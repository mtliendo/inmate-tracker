import { inmateCron } from './functions/inmateCron/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { inmateDDBStream } from './functions/inmateDDBStream/resource'
import { EventSourceMapping } from 'aws-cdk-lib/aws-lambda'
import { StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { Duration, Stack } from 'aws-cdk-lib'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import branchName from 'current-git-branch'
import { config } from '@dotenvx/dotenvx'
import { inmateQueuePoller } from './functions/inmateQueuePoller/resource'
import { setupNewUser } from './functions/setupNewUser/resource'
import { CloudWatchLogGroup } from 'aws-cdk-lib/aws-events-targets'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { Rule } from 'aws-cdk-lib/aws-events'
import { EventBus } from 'aws-cdk-lib/aws-events'
import { LogGroup } from 'aws-cdk-lib/aws-logs'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { ebSubscriptionEvents } from './functions/ebSubscriptionEvents/resource'

config({ path: '.env.local', override: false })
const currentBranch = branchName() || process.env.AWS_BRANCH

const backend = defineBackend({
	auth,
	data,
	inmateCron,
	inmateDDBStream,
	inmateQueuePoller,
	setupNewUser,
	ebSubscriptionEvents,
})

const customResourcesStack = backend.createStack(
	`InmateAlertsCustomResourcesStack-${currentBranch}`
)

//*--------SQS Queue Setup------

//* create an SQS Queue
const queue = new Queue(
	Stack.of(backend.data),
	'inmateEmailNotificationQueue',
	{
		queueName: `inmate-email-notification-queue-${currentBranch}`,
		visibilityTimeout: Duration.seconds(30),
	}
)

//* permit a lambda function to poll sqs for messages
queue.grantConsumeMessages(backend.inmateQueuePoller.resources.lambda)

//* add the lambda functions as a target to the queue
new EventSourceMapping(
	Stack.of(backend.data),
	'InmateEmailNotificationQueueEventSourceMapping',
	{
		target: backend.inmateQueuePoller.resources.lambda,
		eventSourceArn: queue.queueArn,
		batchSize: 2, //* process a max of two messages at a time
	}
)

//* Don't allow the lambda to scale up past 1
backend.inmateQueuePoller.resources.cfnResources.cfnFunction.reservedConcurrentExecutions = 1

//*--------end of SQS Queue Setup------

//*--------DDB Stream for inmate table------

const inmatesTable = backend.data.resources.tables['Inmate']
backend.inmateDDBStream.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		actions: [
			'dynamodb:DescribeStream',
			'dynamodb:GetRecords',
			'dynamodb:GetShardIterator',
			'dynamodb:ListStreams',
		],
		resources: ['*'],
	})
)
backend.inmateDDBStream.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		actions: ['sqs:SendMessage'],
		resources: [queue.queueArn],
	})
)

new EventSourceMapping(Stack.of(backend.data), 'InmateDDBStreamMapping', {
	target: backend.inmateDDBStream.resources.lambda,
	eventSourceArn: inmatesTable.tableStreamArn,
	startingPosition: StartingPosition.LATEST,
	retryAttempts: 2,
})

backend.inmateDDBStream.addEnvironment('QUEUE_URL', queue.queueUrl)
backend.inmateDDBStream.addEnvironment('QUEUE_ARN', queue.queueArn)

//*---------end of DDB Stream for inmate table------------

//*---------Setup EventBridge for Stripe------------

//* get the event bus for stripe events (created by Stripe workbench)
const stripeEventBus = EventBus.fromEventBusArn(
	customResourcesStack,
	`stripeEventBridgeBus-${currentBranch}`,
	`arn:aws:events:::event-bus/aws.partner/stripe.com/${process.env.STRIPE_EVENTBUS_ID}`
)

//create a new cloudwatch log group and Rule for stripe SUBSCRIPTION events
const stripeSubscriptionEventsLogGroup = new LogGroup(
	customResourcesStack,
	'qcspStripeSubscriptionEventsLogGroup',
	{
		logGroupName: '/aws/events/qcsp-stripeSubscriptionEventsLogGroup',
		retention: RetentionDays.ONE_MONTH,
	}
)

new Rule(customResourcesStack, 'qcspStripeEventBridgeSubscriptionRule', {
	ruleName: 'qcsp-stripe-subscription-events-rule',
	eventBus: stripeEventBus,
	targets: [
		new LambdaFunction(backend.ebSubscriptionEvents.resources.lambda),
		new CloudWatchLogGroup(stripeSubscriptionEventsLogGroup),
	],
	eventPattern: {
		source: [`aws.partner/stripe.com/${process.env.STRIPE_EVENTBUS_ID}`],
	},
})

//*---------end of EventBridge for Stripe------------
