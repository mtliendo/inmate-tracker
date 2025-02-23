import type { SQSHandler } from 'aws-lambda'
import { Resend } from 'resend'
import { env } from '$amplify/env/inmateQueuePoller'

const resend = new Resend(env.RESEND_API_KEY)

export const handler: SQSHandler = async (event) => {
	console.log('Received event:', JSON.stringify(event, null, 2))
	//* wait 1.25 seconds: https://resend.com/docs/api-reference/introduction#rate-limit
	await new Promise((resolve) => setTimeout(resolve, 1250))

	//* process the messages
	for (const record of event.Records) {
		const message = JSON.parse(record.body)
		console.log('Message:', message)
		await resend.emails.send({
			from: 'Inmate Alerts <support@mail.focusotter.com>',
			to: [message.email],
			subject: `Inmate Alert`,
			html: '<p>it works!</p>',
			attachments: message.attachments
				? [
						{
							path: 'https://github.com/mtliendo.png',
						},
				  ]
				: [],
		})
	}
}
