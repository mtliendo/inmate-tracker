import { defineFunction, secret } from '@aws-amplify/backend'

export const sendEmail = defineFunction({
	name: 'testSendEmail',
	entry: './main.ts',
	resourceGroupName: 'data',
	runtime: 22,
	memoryMB: 512,
	environment: {
		RESEND_API_KEY: secret('RESEND_API_KEY'),
	},
})
