import { Handler } from 'aws-cdk-lib/aws-lambda'
import { Stripe } from 'stripe'
import { Context } from '@aws-appsync/utils'
import { env } from '$amplify/env/createStripeCustomerBillingPortalSession'
import { Schema } from '../../data/resource'
const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: Handler = async (
	ctx: Context<Schema['createStripeCustomerBillingPortalSession']['args']>
): Promise<
	Schema['createStripeCustomerBillingPortalSession']['returnType']
> => {
	console.log('context', ctx)
	const session = await stripe.billingPortal.sessions.create({
		customer: ctx.arguments.customerId,
		return_url: ctx.arguments.returnUrl,
	})
	if (!session.url) {
		throw new Error('Failed to create billing portal session')
	}
	return {
		sessionUrl: session.url,
	}
}
