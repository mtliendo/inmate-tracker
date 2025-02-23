'use client'
import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import Script from 'next/script'
import { useQuery, useMutation } from '@tanstack/react-query'

const client = generateClient<Schema>()

declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			'stripe-pricing-table': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>
		}
	}
}

function MyAccountPage() {
	const { user, signOut } = useAuthenticator((context) => [context.user])

	// Query for user data
	const {
		data: userData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await client.models.User.list()
			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		enabled: !!user.signInDetails?.loginId,
	})

	// Mutation for creating a new user
	const { mutate: createUser, data: newUserData } = useMutation({
		mutationFn: async () => {
			const response = await client.mutations.setupNewUser({
				email: user.signInDetails?.loginId as string,
			})
			if (!response.data) {
				throw new Error('Failed to create new user')
			}
			return response.data
		},
	})

	// Mutation for getting billing portal session
	const { mutate: getBillingSession } = useMutation({
		mutationFn: async (customerId: string) => {
			const response =
				await client.mutations.createStripeCustomerBillingPortalSession({
					customerId,
					returnUrl: window.location.href,
				})
			if (!response.data) {
				throw new Error('Failed to create billing session')
			}
			return response.data
		},
		onSuccess: (data) => {
			// Redirect to Stripe portal
			window.location.href = data.sessionUrl
		},
	})

	// If we have no users and haven't created one yet, create one
	React.useEffect(() => {
		if (userData && userData.length === 0 && !newUserData) {
			createUser()
		}
	}, [userData, newUserData, createUser])

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {(error as Error).message}</div>
	}

	const dbUser = userData?.[0]
	const clientSecret = newUserData?.customerSession

	// Handle different user states
	if (clientSecret) {
		return (
			<div>
				<div>Stripe Pricing Table for new customer</div>
				<Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
				<stripe-pricing-table
					pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
					publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
					customer-session-client-secret={clientSecret}
				></stripe-pricing-table>
			</div>
		)
	}

	if (dbUser?.status === 'inactive' && dbUser.stripeCustomerId) {
		return (
			<div className="text-center p-8">
				<h1 className="text-2xl font-bold mb-4">Subscription Inactive</h1>
				<p className="mb-4">
					Your subscription is currently inactive. Click below to manage your
					subscription.
				</p>
				<button
					onClick={() => getBillingSession(dbUser.stripeCustomerId!)}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Manage Subscription
				</button>
			</div>
		)
	}

	return (
		<div>
			<h1>My Account for {dbUser?.email}</h1>
		</div>
	)
}

export default withAuthenticator(MyAccountPage)
