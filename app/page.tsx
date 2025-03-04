'use client'
import { HeroSection } from '@/components/blocks/hero-section-dark'

import { Pricing } from '@/components/ui/pricing-cards'
import { Faq3 } from '@/components/blocks/faq3'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const client = generateClient<Schema>()

export default function Home() {
	const { user } = useAuthenticator((context) => [context.user])

	// Query for user data to get Stripe customer ID
	const { data: userData } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await client.models.User.list()
			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		enabled: !!user?.username,
	})

	// Mutation for getting billing portal session
	const { mutate: getBillingSession } = useMutation({
		mutationFn: async (customerId: string) => {
			const response = await client.mutations.createStripeCheckoutSession({
				priceId:
					process.env.NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID!,
				customerId,
				successUrl: window.location.href,
				cancelUrl: window.location.href,
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
			toast.error(`Failed to access checkout session: ${error.message}`)
		},
	})

	return (
		<>
			<main>
				<div className="relative" id="top">
					<HeroSection
						subtitle={{
							regular: 'Stay informed with ',
							gradient: 'Scott County Inmate Alerts',
						}}
						description="Never miss an update about inmates in Scott County, Iowa. Get instant alerts about bookings, releases, and status changes delivered straight to your phone or email. Perfect for families, legal professionals, and concerned citizens."
						ctaText="Start Tracking Now"
						ctaHref="#pricing"
						gridOptions={{
							angle: 65,
							opacity: 0.4,
							cellSize: 50,
							darkLineColor: '#fff',
						}}
					/>
					{/* Smooth gradient transition to features */}
					<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-background/50 to-accent/10" />
				</div>

				<div className="relative bg-accent/10" id="features">
					{/* Enhanced dot pattern background */}
					<div className="absolute inset-0 -z-10">
						<svg
							className="h-full w-full opacity-50"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
						>
							<pattern
								id="dotPattern"
								x="0"
								y="0"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<circle
									cx="2"
									cy="2"
									r="1.5"
									className="fill-muted-foreground/20"
								/>
							</pattern>
							<rect width="100%" height="100%" fill="url(#dotPattern)" />
						</svg>
					</div>

					{/* Continuous gradient background starting from middle of features */}
					<div className="absolute inset-0 top-1/2 -z-20 bg-gradient-to-b from-transparent via-purple-950/10 to-pink-900/10" />
				</div>

				<div className="relative" id="pricing">
					{/* Continue the gradient through pricing section */}
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-900/10 via-purple-900/20 to-blue-900/10" />
					<Pricing
						isAuthenticated={!!user?.username}
						onUpgrade={() => {
							const dbUser = userData?.[0]
							if (dbUser?.stripeCustomerId) {
								getBillingSession(dbUser.stripeCustomerId)
							}
						}}
					/>
				</div>

				<div id="faq" className="relative">
					{/* Final gradient section */}
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent" />
					<Faq3 />
				</div>
			</main>
		</>
	)
}
