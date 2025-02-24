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

type PricingProps = {
	isAuthenticated: boolean
	onUpgrade?: () => void
}

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
						{/* Free Plan */}
						<Card className="w-full rounded-lg bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
							<CardHeader>
								<CardTitle>
									<span className="flex flex-row gap-4 items-center font-normal">
										<span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
											🆓 Free Plan
										</span>
									</span>
								</CardTitle>
								<CardDescription className="text-gray-400">
									Perfect for first-time users
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-8 justify-start">
									<p className="flex flex-row items-center gap-2 text-xl">
										<span className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
											$0
										</span>
										<span className="text-sm text-gray-500">/ month</span>
									</p>
									<div className="flex flex-col gap-4 justify-start">
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-blue-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Track 1 name</p>
												<p className="text-gray-500 text-sm">
													Monitor one individual efficiently
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-blue-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Daily AI crime insights</p>
												<p className="text-gray-500 text-sm">
													Basic AI-powered analysis
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<X className="w-4 h-4 mt-2 text-gray-500" />
											<div className="flex flex-col">
												<p className="text-gray-500">
													No weekly/monthly reports
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-4">
										<p className="text-sm font-medium text-gray-300">
											Best For:
										</p>
										<ul className="text-sm text-gray-500 space-y-2">
											<li>• Concerned citizens & families</li>
											<li>• First-time users</li>
											<li>• Casual crime monitoring</li>
										</ul>
									</div>
									<Button
										variant="outline"
										className="gap-4 border-gray-800 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300"
										asChild={!isAuthenticated}
										onClick={isAuthenticated ? onUpgrade : undefined}
									>
										{isAuthenticated ? (
											<span>
												Change Plan <MoveRight className="h-4 w-4" />
											</span>
										) : (
											<a href="/acknowledgement">
												Start Free <MoveRight className="h-4 w-4" />
											</a>
										)}
									</Button>
									<p className="text-xs text-center text-gray-500">
										{isAuthenticated
											? 'Switch plans anytime'
											: 'No credit card required!'}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Watchful Citizen Plan */}
						<Card className="w-full rounded-lg bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300">
							<CardHeader>
								<CardTitle>
									<span className="flex flex-row gap-4 items-center font-normal">
										<span className="bg-gradient-to-r from-orange-200 to-purple-200 bg-clip-text text-transparent">
											🛡️ Watchful Citizen
										</span>
									</span>
								</CardTitle>
								<CardDescription className="text-gray-400">
									Enhanced monitoring capabilities
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-8 justify-start">
									<p className="flex flex-row items-center gap-2 text-xl">
										<span className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
											$5
										</span>
										<span className="text-sm text-gray-500">/ month</span>
									</p>
									<div className="flex flex-col gap-4 justify-start">
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Track up to 10 names</p>
												<p className="text-gray-500 text-sm">
													Monitor multiple individuals
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Daily AI crime insights</p>
												<p className="text-gray-500 text-sm">
													Detailed AI-powered analysis
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">
													Weekly & monthly AI reports
												</p>
												<p className="text-gray-500 text-sm">
													Comprehensive email reports
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-4">
										<p className="text-sm font-medium text-gray-300">
											Best For:
										</p>
										<ul className="text-sm text-gray-500 space-y-2">
											<li>• Landlords monitoring tenants</li>
											<li>• Employers screening employees</li>
											<li>• Community leaders</li>
										</ul>
									</div>
									<Button
										variant="outline"
										className="gap-4 border-gray-800 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300"
										asChild={!isAuthenticated}
										onClick={isAuthenticated ? onUpgrade : undefined}
									>
										{isAuthenticated ? (
											<span>
												Change Plan <MoveRight className="h-4 w-4" />
											</span>
										) : (
											<a href="/acknowledgement">
												Subscribe Now <MoveRight className="h-4 w-4" />
											</a>
										)}
									</Button>
									<p className="text-xs text-center text-gray-500">
										{isAuthenticated
											? 'Switch plans anytime'
											: 'Stay informed & proactive!'}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Professional Monitor Plan */}
						<Card className="w-full rounded-lg relative bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 border-purple-900/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
							<div className="absolute inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent opacity-20 rounded-lg" />
							<CardHeader className="relative z-10">
								<CardTitle>
									<span className="flex flex-row gap-4 items-center font-normal">
										<span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
											📢 Professional Monitor
										</span>
									</span>
								</CardTitle>
								<CardDescription className="text-gray-400">
									Advanced monitoring & insights
								</CardDescription>
							</CardHeader>
							<CardContent className="relative z-10">
								<div className="flex flex-col gap-8 justify-start">
									<p className="flex flex-row items-center gap-2 text-xl">
										<span className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
											$15
										</span>
										<span className="text-sm text-gray-500">/ month</span>
									</p>
									<div className="flex flex-col gap-4 justify-start">
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Track up to 25 names</p>
												<p className="text-gray-500 text-sm">
													Extensive monitoring capabilities
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">Daily AI crime insights</p>
												<p className="text-gray-500 text-sm">
													Advanced AI-powered analysis
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">
													Weekly & monthly AI reports
												</p>
												<p className="text-gray-500 text-sm">
													Comprehensive email reports
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-4">
										<p className="text-sm font-medium text-gray-300">
											Best For:
										</p>
										<ul className="text-sm text-gray-500 space-y-2">
											<li>• Lawyers monitoring clients</li>
											<li>• Bail bondsmen tracking leads</li>
											<li>• Journalists covering crime</li>
										</ul>
									</div>
									<Button
										className="gap-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 transition-all duration-300 relative z-20"
										asChild={!isAuthenticated}
										onClick={isAuthenticated ? onUpgrade : undefined}
									>
										{isAuthenticated ? (
											<span>
												Change Plan <MoveRight className="h-4 w-4" />
											</span>
										) : (
											<a href="/acknowledgement">
												Subscribe Now <MoveRight className="h-4 w-4" />
											</a>
										)}
									</Button>
									<p className="text-xs text-center text-gray-500">
										{isAuthenticated
											? 'Switch plans anytime'
											: 'Get real-time crime monitoring!'}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export { Pricing }
