import twilio from 'twilio'

type SendMMSParams = {
	phone: string
	inmate: {
		name: string
		bookingDateTime: string
		charges: (string | null)[] | undefined
		mugshotUrl?: string | null
	}
	twilioConfig: {
		accountSid: string
		apiKey: string
		phoneNumber: string
	}
}

export async function sendMMS({ phone, inmate, twilioConfig }: SendMMSParams) {
	const twilioClient = twilio(twilioConfig.accountSid, twilioConfig.apiKey)

	const messageBody = `🚨 Inmate Alert 🚨\n\nName: ${inmate.name}\nBooked: ${
		inmate.bookingDateTime
	}\nCharges: ${inmate.charges?.join(', ') || 'No charges'}`

	const message = await twilioClient.messages.create({
		body: messageBody,
		from: twilioConfig.phoneNumber,
		to: phone,
		...(inmate.mugshotUrl && { mediaUrl: [inmate.mugshotUrl] }),
	})

	return {
		message: 'MMS sent successfully',
		messageId: message.sid,
	}
}
