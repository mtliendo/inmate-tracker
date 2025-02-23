import { defineFunction, secret } from '@aws-amplify/backend'

export const createStripeCustomerBillingPortalSession = defineFunction({
	name: 'createStripeCustomerBillingPortalSession',
	entry: './main.ts',
	environment: {
		STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
	},
})
