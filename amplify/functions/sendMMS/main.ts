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

		// Validate mugshot URL before sending
		let validatedMugshotUrl = inmate.mugshotUrl || ''

		if (validatedMugshotUrl) {
			try {
				// Try to fetch the image to see if it exists
				const imageResponse = await fetch(validatedMugshotUrl, {
					method: 'HEAD',
				})
				if (!imageResponse.ok) {
					console.log('Mugshot image not available yet, using fallback')
					validatedMugshotUrl =
						'https://robohash.org/' +
						encodeURIComponent(inmate.name) +
						'?set=set4'
				}
			} catch (error) {
				console.log('Error checking mugshot availability:', error)
				validatedMugshotUrl =
					'https://robohash.org/' +
					encodeURIComponent(inmate.name) +
					'?set=set4'
			}
		}

		// Create a new inmate object with the validated mugshot URL
		const validatedInmate = {
			...inmate,
			mugshotUrl: validatedMugshotUrl,
		}

		return await sendMMS({
			phone,
			inmate: validatedInmate,
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
