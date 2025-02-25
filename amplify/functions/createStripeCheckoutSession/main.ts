import { Handler } from 'aws-cdk-lib/aws-lambda'
import { Stripe } from 'stripe'
import { Context } from '@aws-appsync/utils'
import { env } from '$amplify/env/createStripeCheckoutSession'
import { Schema } from '../../data/resource'
const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: Handler = async (
	ctx: Context<Schema['createStripeCheckoutSession']['args']>
): Promise<Schema['createStripeCheckoutSession']['returnType']> => {
	console.log('context', ctx)
	//collect the phone number from the customer
	const session = await stripe.checkout.sessions.create({
		customer: ctx.arguments.customerId,
		mode: 'subscription',
		phone_number_collection: {
			enabled: true,
		},
		line_items: [
			{
				quantity: 1,
				price: ctx.arguments.priceId,
			},
		],
		success_url: ctx.arguments.successUrl,
		cancel_url: ctx.arguments.cancelUrl,
	})
	if (!session.url) {
		throw new Error('Failed to create checkout session')
	}
	return {
		sessionUrl: session.url,
	}
}
