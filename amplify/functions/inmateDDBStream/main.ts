import type { DynamoDBStreamHandler } from 'aws-lambda'
import { type Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/inmateDDBStream'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

const sqs = new SQSClient()
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: DynamoDBStreamHandler = async (event) => {
	for (const record of event.Records) {
		//fetch all the users from the database
		const users = await client.models.User.list({ limit: 500, authMode: 'iam' })
		console.log(`Found ${users.data.length} users`)
		if (record.eventName === 'INSERT') {
			// business logic to process new records
			console.log(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`)
			const newInmate = unmarshall(
				record.dynamodb?.NewImage as Record<string, AttributeValue>
			) as Schema['Inmate']['type']
			if (!newInmate.name) {
				console.log('No name found for inmate')
			}
			for (const user of users.data) {
				const isMatch = user.inmateAlertPreferences.names.some((name) => {
					if (name?.firstName && name?.lastName) {
						return (
							newInmate.name
								.toLowerCase()
								.includes(name.firstName.toLowerCase()) &&
							newInmate.name.toLowerCase().includes(name.lastName.toLowerCase())
						)
					}
				})

				if (isMatch) {
					console.log(`User ${user.id} has a match with inmate ${newInmate.id}`)
					console.log('Notifying the user based on their alert preferences')

					const userAlertPreferences = user.inmateAlertPreferences.alertMethod
					if (
						userAlertPreferences === 'EMAIL' ||
						userAlertPreferences === 'EMAIL_AND_TEXT'
					) {
						console.log('Sending email to the user using sqs')
						await sqs.send(
							new SendMessageCommand({
								QueueUrl: process.env.QUEUE_URL!,
								MessageBody: JSON.stringify({
									email: user.email,
									inmate: newInmate,
								}),
							})
						)
					} else if (
						userAlertPreferences === 'TEXT' ||
						userAlertPreferences === 'EMAIL_AND_TEXT'
					) {
						console.log('Sending SMS to the user')
					}
				}
			}
		}
	}

	return {
		batchItemFailures: [],
	}
}
