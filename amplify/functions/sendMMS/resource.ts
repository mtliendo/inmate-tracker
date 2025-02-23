import { defineFunction, secret } from '@aws-amplify/backend'

export const sendMMS = defineFunction({
	name: 'testSendMMS',
	entry: './main.ts',
	resourceGroupName: 'data',
	runtime: 22,
	memoryMB: 512,
	environment: {
		TWILIO_API_KEY: secret('TWILIO_API_KEY'),
	},
})
