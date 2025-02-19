import { Badge } from '@/components/ui/badge'

function Feature() {
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex flex-col gap-10">
					<div className="flex gap-4 flex-col items-start">
						<div>
							<Badge>Features</Badge>
						</div>
						<div className="flex gap-2 flex-col">
							<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
								Comprehensive Inmate Tracking
							</h2>
							<p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
								Stay informed about inmate status changes in Scott County with
								our advanced tracking features
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M5.5 7h13a2 2 0 012 2v6a2 2 0 01-2 2h-13a2 2 0 01-2-2V9a2 2 0 012-2z" />
									<path d="M12 7V3" />
									<path d="M8 3h8" />
									<path d="M12 11v2" />
									<path d="M12 17v.01" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">Instant Notifications</h3>
							<p className="text-muted-foreground text-base">
								Receive immediate alerts via SMS or email when there are changes
								in inmate status.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">
								Multiple Tracking Lists
							</h3>
							<p className="text-muted-foreground text-base">
								Create and manage multiple lists of inmates to track, perfect
								for legal professionals and families.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M12 4v16m8-8H4" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">Customizable Alerts</h3>
							<p className="text-muted-foreground text-base">
								Filter notifications by charge type, status changes, or specific
								events that matter to you.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">Secure & Private</h3>
							<p className="text-muted-foreground text-base">
								Your tracking lists and personal information are protected with
								enterprise-grade security.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">Dashboard Analytics</h3>
							<p className="text-muted-foreground text-base">
								View booking trends, status updates, and track multiple cases
								from a single dashboard.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-primary"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-xl tracking-tight">24/7 Monitoring</h3>
							<p className="text-muted-foreground text-base">
								Round-the-clock monitoring ensures you never miss important
								updates about tracked inmates.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export { Feature }
