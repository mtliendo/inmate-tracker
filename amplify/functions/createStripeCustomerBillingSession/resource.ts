import { defineFunction, secret } from '@aws-amplify/backend'

export const createStripeCustomerBillingSession = defineFunction({
	name: 'createStripeCustomerBillingSession',
	entry: './main.ts',
	environment: {
		STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
	},
})
