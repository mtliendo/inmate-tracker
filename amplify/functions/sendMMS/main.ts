import { Handler } from 'aws-cdk-lib/aws-lambda'
import { Context } from '@aws-appsync/utils'
import { Schema } from '../../data/resource'
import { env } from '$amplify/env/testSendMMS'
import { sendMMS } from '../utils/sendMMS'

export const handler: Handler = async (
	ctx: Context<Schema['testSendMMS']['args']>
): Promise<Schema['testSendMMS']['returnType']> => {
	try {
		const { phone, inmate } = ctx.arguments

		return await sendMMS({
			phone,
			inmate,
			twilioConfig: {
				accountSid: process.env.TWILIO_ACCOUNT_SID!,
				apiKey: env.TWILIO_API_KEY!,
				phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
			},
		})
	} catch (error) {
		console.error('Error sending MMS:', error)
		return {
			message: 'MMS not sent, error: ' + error,
			messageId: '',
		}
	}
}
