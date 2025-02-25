import { Check, MoveRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Feature = {
	included: boolean
	title: string
	description?: string
}

type PricingPlan = {
	id: string
	name: string
	icon: string
	description: string
	price: number
	features: Feature[]
	bestFor: string[]
	gradientColors: {
		from: string
		to: string
		iconText: string
		shadowColor?: string
		border?: string
		buttonGradient?: {
			from: string
			to: string
		}
	}
}

type PricingProps = {
	isAuthenticated: boolean
	onUpgrade?: () => void
}

const pricingPlans: PricingPlan[] = [
	{
		id: 'free',
		name: 'Free Plan',
		icon: '🆓',
		description: 'Perfect for first-time users',
		price: 0,
		features: [
			{
				included: true,
				title: 'Track 1 name',
				description: 'Monitor one individual efficiently',
			},
			{
				included: true,
				title: 'Daily AI crime insights (coming soon)',
				description: 'Basic AI-powered analysis',
			},
			// {
			// 	included: false,
			// 	title: 'No weekly/monthly reports',
			// },
		],
		bestFor: [
			'Concerned citizens & families',
			'First-time users',
			'Casual crime monitoring',
		],
		gradientColors: {
			from: 'gray-900',
			to: 'gray-950',
			iconText: 'from-blue-200 to-cyan-200',
			shadowColor: 'blue-900/20',
			border: 'gray-800',
		},
	},
	{
		id: 'watchful',
		name: 'Watchful Citizen',
		icon: '🛡️',
		description: 'Enhanced monitoring capabilities',
		price: 5,
		features: [
			{
				included: true,
				title: 'Track up to 10 names',
				description: 'Monitor multiple individuals',
			},
			{
				included: true,
				title: 'Daily AI crime insights (coming soon)',
				description: 'Detailed AI-powered analysis',
			},
			// {
			// 	included: true,
			// 	title: 'Weekly & monthly AI reports',
			// 	description: 'Comprehensive email reports',
			// },
		],
		bestFor: [
			'Landlords monitoring tenants',
			'Employers screening employees',
			'Community leaders',
		],
		gradientColors: {
			from: 'gray-900',
			to: 'gray-950',
			iconText: 'from-orange-200 to-purple-200',
			shadowColor: 'purple-900/20',
			border: 'gray-800',
		},
	},
	{
		id: 'professional',
		name: 'Professional Monitor',
		icon: '📢',
		description: 'Advanced monitoring & insights',
		price: 15,
		features: [
			{
				included: true,
				title: 'Track up to 25 names',
				description: 'Extensive monitoring capabilities',
			},
			{
				included: true,
				title: 'Daily AI crime insights (coming soon)',
				description: 'Advanced AI-powered analysis',
			},
			// {
			// 	included: true,
			// 	title: 'Weekly & monthly AI reports',
			// 	description: 'Comprehensive email reports',
			// },
		],
		bestFor: [
			'Lawyers monitoring clients',
			'Bail bondsmen tracking leads',
			'Journalists covering crime',
		],
		gradientColors: {
			from: 'gray-900',
			to: 'gray-900',
			iconText: 'from-purple-200 to-pink-200',
			shadowColor: 'purple-500/20',
			border: 'purple-900/50',
			buttonGradient: {
				from: 'purple-600',
				to: 'pink-600',
			},
		},
	},
]

function Pricing({ isAuthenticated, onUpgrade }: PricingProps) {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex text-center justify-center items-center gap-4 flex-col">
					<Badge>Pricing</Badge>
					<div className="flex gap-2 flex-col">
						<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
							Simple, Transparent Pricing
						</h2>
						<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
							{isAuthenticated
								? 'Upgrade your plan anytime to unlock more features'
								: 'Start with our free plan and upgrade anytime. No credit card required to get started.'}
						</p>
					</div>
					<div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
						{pricingPlans.map((plan) => (
							<Card
								key={plan.id}
								className={`w-full rounded-lg ${
									plan.id === 'professional'
										? 'bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900'
										: `bg-gradient-to-b from-${plan.gradientColors.from} to-${plan.gradientColors.to}`
								} border-${
									plan.gradientColors.border
								} hover:shadow-lg hover:shadow-${
									plan.gradientColors.shadowColor
								} transition-all duration-300 ${
									plan.id === 'professional' ? 'relative' : ''
								}`}
							>
								{plan.id === 'professional' && (
									<div className="absolute inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent opacity-20 rounded-lg" />
								)}
								<CardHeader className="relative z-10">
									<CardTitle>
										<span className="flex flex-row gap-4 items-center font-normal">
											<span
												className={`bg-gradient-to-r ${plan.gradientColors.iconText} bg-clip-text text-transparent`}
											>
												{plan.icon} {plan.name}
											</span>
										</span>
									</CardTitle>
									<CardDescription className="text-gray-400">
										{plan.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="relative z-10">
									<div className="flex flex-col gap-8 justify-start">
										<p className="flex flex-row items-center gap-2 text-xl">
											<span className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
												${plan.price}
											</span>
											<span className="text-sm text-gray-500">/ month</span>
										</p>
										<div className="flex flex-col gap-4 justify-start">
											{plan.features.map((feature, index) => (
												<div key={index} className="flex flex-row gap-4">
													{feature.included ? (
														<Check
															className={`w-4 h-4 mt-2 ${
																plan.id === 'free'
																	? 'text-blue-400'
																	: 'text-purple-400'
															}`}
														/>
													) : (
														<X className="w-4 h-4 mt-2 text-gray-500" />
													)}
													<div className="flex flex-col">
														<p
															className={
																feature.included
																	? 'text-gray-200'
																	: 'text-gray-500'
															}
														>
															{feature.title}
														</p>
														{feature.description && (
															<p className="text-gray-500 text-sm">
																{feature.description}
															</p>
														)}
													</div>
												</div>
											))}
										</div>
										<div className="flex flex-col gap-4">
											<p className="text-sm font-medium text-gray-300">
												Best For:
											</p>
											<ul className="text-sm text-gray-500 space-y-2">
												{plan.bestFor.map((item, index) => (
													<li key={index}>• {item}</li>
												))}
											</ul>
										</div>
										<Button
											variant={
												plan.id === 'professional' ? 'default' : 'outline'
											}
											className={
												plan.id === 'professional'
													? 'gap-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 transition-all duration-300 relative z-20'
													: 'gap-4 border-gray-800 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300'
											}
											asChild={!isAuthenticated}
											onClick={isAuthenticated ? onUpgrade : undefined}
										>
											{isAuthenticated ? (
												<span>
													Change Plan <MoveRight className="h-4 w-4" />
												</span>
											) : (
												<a href="/acknowledgement">
													{plan.id === 'free' ? 'Start Free' : 'Subscribe Now'}{' '}
													<MoveRight className="h-4 w-4" />
												</a>
											)}
										</Button>
										<p className="text-xs text-center text-gray-500">
											{isAuthenticated
												? 'Switch plans anytime'
												: plan.id === 'free'
												? 'No credit card required!'
												: plan.id === 'professional'
												? 'Get real-time crime monitoring!'
												: 'Stay informed & proactive!'}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export { Pricing }
