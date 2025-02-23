import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { Handler } from 'aws-cdk-lib/aws-lambda'
import { Schema } from '../../data/resource'
import { Context } from '@aws-appsync/utils'
import { env } from '$amplify/env/testSendEmail'
const sqs = new SQSClient()

export const handler: Handler = async (
	ctx: Context<Schema['testSendEmail']['args']>
): Promise<Schema['testSendEmail']['returnType']> => {
	try {
		const { email, inmate } = ctx.arguments

		// Send to SQS queue instead of calling Resend directly
		await sqs.send(
			new SendMessageCommand({
				QueueUrl: env.QUEUE_URL,
				MessageBody: JSON.stringify({
					email,
					inmate,
				}),
			})
		)

		return {
			message: 'Email queued successfully',
		}
	} catch (error) {
		console.error('Error queueing email:', error)
		return {
			message: 'Email not sent, error: ' + error,
		}
	}
}
