import { Handler } from 'aws-cdk-lib/aws-lambda'
import { Stripe } from 'stripe'
import { Context } from '@aws-appsync/utils'
import { env } from '$amplify/env/createStripeCustomerBillingSession'
import { Schema } from '../../data/resource'
const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: Handler = async (
	ctx: Context<Schema['createStripeCustomerBillingSession']['args']>
): Promise<Schema['createStripeCustomerBillingSession']['returnType']> => {
	const session = await stripe.billingPortal.sessions.create({
		customer: ctx.arguments.customerId,
		return_url: ctx.arguments.returnUrl,
	})
	return {
		sessionUrl: session.url,
	}
}
