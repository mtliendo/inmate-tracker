import type { PostConfirmationTriggerHandler } from 'aws-lambda'
import { type Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/setupNewUser'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: PostConfirmationTriggerHandler = async (event) => {
	const owner = `${event.request.userAttributes.sub}::${event.userName}`
	const userAttributes = event.request.userAttributes
	console.log('event', event)

	// Step 1: Create user in database
	let newUser
	try {
		const result = await client.models.User.create(
			{
				email: userAttributes.email,
				owner,
				name: userAttributes.given_name,
				phone: userAttributes.phone_number,
				disclaimerAcknowledged: false,
				status: 'free',
				inmateAlertPreferences: {
					names: [],
					chargeTypeAlerts: 'NONE',
					hourlyAlertsEnabled: false,
					alertMethod: 'EMAIL',
				},
			},
			{ authMode: 'iam' }
		)
		console.log('result', result)
		newUser = result.data
	} catch (error) {
		console.error('Failed to create user in database:', error)
		throw new Error(`Failed to create user ${userAttributes.email} in database`)
	}

	if (!newUser || !newUser.id) {
		throw new Error(`Failed to create user ${userAttributes.email} in database`)
	}

	// Step 2: Create Stripe customer
	let stripeCustomer: Stripe.Customer
	try {
		stripeCustomer = await stripe.customers.create({
			email: userAttributes.email,
			phone: userAttributes.phone_number,
			metadata: {
				userId: newUser.id,
			},
		})
	} catch (error) {
		// Clean up: Delete the user we created since Stripe customer creation failed
		try {
			await client.models.User.delete({ id: newUser.id }, { authMode: 'iam' })
		} catch (cleanupError) {
			console.error('Failed to clean up user after Stripe error:', cleanupError)
		}
		console.error('Failed to create Stripe customer:', error)
		throw new Error(
			`Failed to create Stripe customer for user ${userAttributes.email}`
		)
	}

	// Step 3: Update user with Stripe customer ID
	try {
		const updateResult = await client.models.User.update(
			{
				id: newUser.id,
				stripeCustomerId: stripeCustomer.id,
			},
			{ authMode: 'iam' }
		)
		newUser = updateResult.data
	} catch (error) {
		// Log error but don't throw since user and Stripe customer were created successfully
		console.error('Failed to update user with Stripe customer ID:', error)
		console.error('Manual intervention may be needed for user:', newUser?.id)
	}

	if (!newUser || !newUser.id) {
		throw new Error('Failed to update user with Stripe customer ID')
	}

	return event
}
