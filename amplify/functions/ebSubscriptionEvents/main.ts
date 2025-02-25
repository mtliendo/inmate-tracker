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

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

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

				console.log('stripeCustomer', stripeCustomer)

				const updatedUser = await amplifyClient.models.User.update(
					{
						id: stripeCustomer.metadata.userId,
						stripePriceId: event.detail.data.object.items.data[0].price.id,
						phone: stripeCustomer.phone,
						status: 'paid',
					},
					{ authMode: 'iam' }
				)

				console.log('updated user', updatedUser)

				return {
					statusCode: 200,
				}
			} catch (error) {
				console.log('error', error)
			}

			break
		case 'customer.subscription.deleted':
			console.log('customer.subscription.deleted')
			//reset to the free plan
			try {
				const stripeCustomer = (await stripe.customers.retrieve(
					event.detail.data.object.customer
				)) as Stripe.Customer

				// Get the current user to preserve their preferences
				const currentUser = await amplifyClient.models.User.get(
					{ id: stripeCustomer.metadata.userId },
					{ authMode: 'iam' }
				)

				if (!currentUser.data) {
					throw new Error('User not found')
				}

				await amplifyClient.models.User.update(
					{
						id: stripeCustomer.metadata.userId,
						stripePriceId: null,
						status: 'free',
						inmateAlertPreferences: {
							...currentUser.data.inmateAlertPreferences,
							names: currentUser.data.inmateAlertPreferences.names || [],
							alertMethod: 'EMAIL', // Reset to email only for free plan
						},
					},
					{ authMode: 'iam' }
				)
			} catch (error) {
				console.log('error', error)
			}
			break
		case 'checkout.session.completed':
			console.log('checkout.session.completed')
			try {
				const stripeCustomer = (await stripe.customers.retrieve(
					event.detail.data.object.customer
				)) as Stripe.Customer

				await amplifyClient.models.User.update(
					{
						id: stripeCustomer.metadata.userId,
						phone: stripeCustomer.phone,
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
