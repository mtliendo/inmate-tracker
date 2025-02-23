import type { SQSHandler } from 'aws-lambda'
import { Resend } from 'resend'
import { env } from '$amplify/env/inmateQueuePoller'

const resend = new Resend(env.RESEND_API_KEY)

const generateEmailHTML = (inmate: {
	name: string
	bookingDateTime: string
	charges: (string | null)[] | undefined
	mugshotUrl?: string | null
}) => {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>Inmate Alert</title>
				<style>
					body { 
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
						line-height: 1.6;
						color: #333;
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.header {
						background: linear-gradient(to right, #6366f1, #a855f7);
						color: white;
						padding: 20px;
						border-radius: 8px 8px 0 0;
						text-align: center;
					}
					.content {
						background: #fff;
						padding: 20px;
						border: 1px solid #e5e7eb;
						border-radius: 0 0 8px 8px;
					}
					.inmate-photo {
						width: 150px;
						height: 150px;
						object-fit: cover;
						border-radius: 8px;
						margin: 20px auto;
						display: block;
					}
					.charges {
						background: #f3f4f6;
						padding: 15px;
						border-radius: 6px;
						margin-top: 15px;
					}
					.footer {
						text-align: center;
						margin-top: 20px;
						font-size: 0.875rem;
						color: #6b7280;
					}
				</style>
			</head>
			<body>
				<div class="header">
					<h1>🚨 Inmate Alert</h1>
				</div>
				<div class="content">
					<h2>New Booking Alert</h2>
					${
						inmate.mugshotUrl
							? `<img src="${inmate.mugshotUrl}" alt="Inmate Photo" class="inmate-photo" />`
							: ''
					}
					<p><strong>Name:</strong> ${inmate.name}</p>
					<p><strong>Booking Date/Time:</strong> ${inmate.bookingDateTime}</p>
					<div class="charges">
						<h3>Charges:</h3>
						<ul>
							${(inmate.charges || [])
								.filter((c): c is string => c !== null)
								.map((charge) => `<li>${charge}</li>`)
								.join('')}
						</ul>
					</div>
					<div class="footer">
						<p>This alert was sent from Inmate Alerts. To manage your notification preferences, visit your account settings.</p>
					</div>
				</div>
			</body>
		</html>
	`
}

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
			subject: `Inmate Alert: ${message.inmate.name}`,
			html: generateEmailHTML(message.inmate),
		})
	}
}
