import { defineFunction, secret } from '@aws-amplify/backend'

export const createStripeCheckoutSession = defineFunction({
	name: 'createStripeCheckoutSession',
	entry: './main.ts',
	environment: {
		STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
	},
})
