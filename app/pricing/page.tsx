'use client'
import React from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PLAN_DETAILS } from '@/app/types/subscription'

const client = generateClient<Schema>()

function PricingContent() {
	const { user } = useAuthenticator((context) => [context.user])

	const { data: userData, isLoading } = useQuery({
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

	const { mutate: getCheckoutSession, isPending: isLoadingCheckout } =
		useMutation({
			mutationFn: async ({
				customerId,
				priceId,
			}: {
				customerId: string
				priceId: string
			}) => {
				const response = await client.mutations.createStripeCheckoutSession({
					priceId,
					customerId,
					successUrl: `${window.location.origin}/success`,
					cancelUrl: `${window.location.origin}/pricing`,
				})
				if (!response.data) {
					throw new Error('Failed to create checkout session')
				}
				return response.data
			},
			onSuccess: (data) => {
				window.location.href = data.sessionUrl
			},
			onError: (error) => {
				toast.error(`Failed to create checkout session: ${error.message}`)
			},
		})

	const { mutate: getBillingPortal, isPending: isLoadingPortal } = useMutation({
		mutationFn: async (customerId: string) => {
			const response =
				await client.mutations.createStripeCustomerBillingSession({
					customerId,
					returnUrl: `${window.location.origin}/pricing`,
				})
			if (!response.data) {
				throw new Error('Failed to create billing portal session')
			}
			return response.data
		},
		onSuccess: (data) => {
			window.location.href = data.sessionUrl
		},
		onError: (error) => {
			toast.error(`Failed to access billing portal: ${error.message}`)
		},
	})

	const dbUser = userData?.[0]
	const hasActiveSubscription =
		dbUser?.stripePriceId && dbUser?.status === 'paid'

	const handlePlanAction = (priceId: string) => {
		if (!dbUser?.stripeCustomerId) {
			toast.error('Please sign in to upgrade')
			return
		}

		const isLoading = isLoadingCheckout || isLoadingPortal
		if (isLoading) return

		// Always use billing portal for existing customers
		if (dbUser?.status === 'paid') {
			getBillingPortal(dbUser.stripeCustomerId)
		} else {
			getCheckoutSession({ customerId: dbUser.stripeCustomerId, priceId })
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500/50"></div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
					Choose Your Plan
				</h1>
				<p className="text-lg text-gray-400 max-w-2xl mx-auto">
					Select the plan that best fits your needs. All plans include our core
					features with different monitoring capacities.
				</p>
				{hasActiveSubscription && dbUser?.stripePriceId && (
					<div className="mt-4 text-sm text-gray-400">
						Current Plan:{' '}
						<span className="font-semibold">
							{PLAN_DETAILS[dbUser.stripePriceId]?.name || 'Unknown'}
						</span>
					</div>
				)}
			</div>

			<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
				{/* Free Plan */}
				<div className="bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
					<h3 className="text-xl font-semibold mb-4">Free Plan</h3>
					<p className="text-gray-400 mb-4">Perfect for personal use</p>
					<div className="text-3xl font-bold mb-6">$0/month</div>
					<ul className="space-y-3 mb-8">
						<li className="flex items-center text-gray-300">
							<span className="mr-2">✓</span> Track 1 name
						</li>
						<li className="flex items-center text-gray-300">
							<span className="mr-2">✓</span> Daily AI crime insights
						</li>
						<li className="flex items-center text-gray-300">
							<span className="mr-2">✗</span> No weekly/monthly reports
						</li>
					</ul>
					<div className="text-sm text-gray-500 mb-8">
						<p className="font-medium mb-2">Best For:</p>
						<ul className="space-y-1">
							<li>• Concerned citizens & families</li>
							<li>• First-time users</li>
							<li>• Casual crime monitoring</li>
						</ul>
					</div>
					<button
						disabled={!dbUser?.stripePriceId && !hasActiveSubscription}
						className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{!dbUser?.stripePriceId ? 'Current Plan' : 'Free Plan'}
					</button>
				</div>

				{/* Watchful Citizen Plan */}
				<div className="bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10 relative overflow-hidden">
					<div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm">
						Popular
					</div>
					<h3 className="text-xl font-semibold mb-4">
						{
							PLAN_DETAILS[
								process.env
									.NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID!
							]?.name
						}
					</h3>
					<p className="text-gray-400 mb-4">For active community members</p>
					<div className="text-3xl font-bold mb-6">$5/month</div>
					<ul className="space-y-3 mb-8">
						{PLAN_DETAILS[
							process.env.NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID!
						]?.features.map((feature, index) => (
							<li key={index} className="flex items-center text-gray-300">
								<span className="mr-2">✓</span> {feature}
							</li>
						))}
					</ul>
					<div className="text-sm text-gray-500 mb-8">
						<p className="font-medium mb-2">Best For:</p>
						<ul className="space-y-1">
							<li>• Landlords monitoring tenants</li>
							<li>• Employers screening employees</li>
							<li>• Community leaders</li>
						</ul>
					</div>
					<button
						onClick={() =>
							handlePlanAction(
								process.env
									.NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID!
							)
						}
						disabled={isLoadingCheckout || isLoadingPortal}
						className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{isLoadingCheckout || isLoadingPortal ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								{hasActiveSubscription ? 'Opening Portal...' : 'Processing...'}
							</>
						) : hasActiveSubscription ? (
							'Change Plan'
						) : (
							'Upgrade Now'
						)}
					</button>
				</div>

				{/* Professional Monitor Plan */}
				<div className="md:col-span-2 bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
					<h3 className="text-xl font-semibold mb-4">
						{
							PLAN_DETAILS[
								process.env
									.NEXT_PUBLIC_PROFESSIONAL_MONITOR_MONTHLY_STRIPE_PRICE_ID!
							]?.name
						}
					</h3>
					<p className="text-gray-400 mb-4">
						For organizations and power users
					</p>
					<div className="text-3xl font-bold mb-6">$15/month</div>
					<ul className="space-y-3 mb-8 grid md:grid-cols-2 gap-4">
						{PLAN_DETAILS[
							process.env
								.NEXT_PUBLIC_PROFESSIONAL_MONITOR_MONTHLY_STRIPE_PRICE_ID!
						]?.features.map((feature, index) => (
							<li key={index} className="flex items-center text-gray-300">
								<span className="mr-2">✓</span> {feature}
							</li>
						))}
					</ul>
					<div className="text-sm text-gray-500 mb-8">
						<p className="font-medium mb-2">Best For:</p>
						<ul className="space-y-1">
							<li>• Lawyers monitoring clients</li>
							<li>• Bail bondsmen tracking leads</li>
							<li>• Journalists covering crime</li>
						</ul>
					</div>
					<button
						onClick={() =>
							handlePlanAction(
								process.env
									.NEXT_PUBLIC_PROFESSIONAL_MONITOR_MONTHLY_STRIPE_PRICE_ID!
							)
						}
						disabled={isLoadingCheckout || isLoadingPortal}
						className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{isLoadingCheckout || isLoadingPortal ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								{hasActiveSubscription ? 'Opening Portal...' : 'Processing...'}
							</>
						) : hasActiveSubscription ? (
							'Change Plan'
						) : (
							'Upgrade Now'
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

function PricingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
			<Authenticator>
				<PricingContent />
			</Authenticator>
		</div>
	)
}

export default PricingPage
