import { Handler } from 'aws-cdk-lib/aws-lambda'
import { env } from '$amplify/env/ebSubscriptionEvents'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { type Schema } from '../../data/resource'
import { generateClient } from 'aws-amplify/data'
import { Amplify } from 'aws-amplify'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)
const amplifyClient = generateClient<Schema>()

import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-01-27.acacia',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any) => {
	switch (event.detail.type) {
		case 'customer.subscription.created':
			try {
				console.log('customer.subscription.created')

				//get the stripe customer
				const stripeCustomer = (await stripe.customers.retrieve(
					event.detail.data.object.customer
				)) as Stripe.Customer

				await amplifyClient.models.User.update(
					{
						id: stripeCustomer.metadata.userId,
						stripePriceId: event.detail.data.object.items.data[0].price.id,
					},
					{ authMode: 'iam' }
				)

				return {
					statusCode: 200,
				}
			} catch (error) {
				console.log('error', error)
			}

			break
		case 'customer.subscription.deleted':
			console.log('customer.subscription.deleted')
			//remove all stripe info from db
			try {
				const stripeCustomer = (await stripe.customers.retrieve(
					event.detail.data.object.customer
				)) as Stripe.Customer

				await amplifyClient.models.User.update(
					{
						id: stripeCustomer.metadata.userId,
						stripeCustomerId: null,
						stripePriceId: null,
					},
					{ authMode: 'iam' }
				)
			} catch (error) {
				console.log('error', error)
			}
			break
		default:
			console.log('unknown event type', event.detail.type)
	}
}
