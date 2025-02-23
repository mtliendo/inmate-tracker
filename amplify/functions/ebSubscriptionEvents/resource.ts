import { defineFunction, secret } from '@aws-amplify/backend'

export const ebSubscriptionEvents = defineFunction({
	name: 'ebSubscriptionEvents',
	entry: './main.ts',
	resourceGroupName: 'data',
	runtime: 22,
	memoryMB: 512,
	environment: {
		STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
	},
})
