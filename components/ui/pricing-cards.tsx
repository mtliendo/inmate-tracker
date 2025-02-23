import { Check, MoveRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function Pricing() {
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
							Try any plan free for 14 days. Choose the option that best fits
							your tracking needs.
						</p>
					</div>
					<div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-2 w-full gap-8">
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
									Concerned citizens, family, friends
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
													Monitor multiple individuals efficiently
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">
													Instant SMS/email alerts
												</p>
												<p className="text-gray-500 text-sm">
													Get notified immediately of any changes
												</p>
											</div>
										</div>
									</div>
									<Button
										variant="outline"
										className="gap-4 border-gray-800 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300"
										asChild
									>
										<a href="/my-account">
											Get Started <MoveRight className="w-4 h-4" />
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
						<Card className="w-full rounded-lg relative bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 border-purple-900/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
							<div className="absolute inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent opacity-20 rounded-lg" />
							<CardHeader className="relative z-10">
								<CardTitle>
									<span className="flex flex-row gap-4 items-center font-normal">
										<span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
											⚓ Professional Monitor
										</span>
									</span>
								</CardTitle>
								<CardDescription className="text-gray-400">
									Perfect for Bail bondsmen, lawyers, journalists, employers,
									landlords, and more
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
												<p className="text-gray-200">Unlimited name tracking</p>
												<p className="text-gray-500 text-sm">
													No limits on the number of names you can track
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">
													Hourly County-Wide Alerts
												</p>
												<p className="text-gray-500 text-sm">
													Stay updated on all county bookings
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4">
											<Check className="w-4 h-4 mt-2 text-purple-400" />
											<div className="flex flex-col">
												<p className="text-gray-200">
													Filter by Felony/Misdemeanor
												</p>
												<p className="text-gray-500 text-sm">
													Customize alerts by charge type
												</p>
											</div>
										</div>
									</div>
									<Button
										className="gap-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 transition-all duration-300 relative z-20"
										asChild
									>
										<a href="/my-account">
											Start Professional Plan <MoveRight className="w-4 h-4" />
										</a>
									</Button>
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
