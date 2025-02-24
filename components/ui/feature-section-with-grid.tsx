import { Badge } from '@/components/ui/badge'

const features = [
	{
		title: 'Instant Notifications',
		description:
			'Receive immediate alerts via SMS or email when an inmate is booked in the Scott County Jail system.',
		iconBgColor: 'bg-[#2563eb]/20 dark:bg-[#3b82f6]/20',
		icon: (
			<>
				<path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
			</>
		),
	},
	{
		title: 'AI Insights',
		description:
			'Get insights into trends and patterns in the Scott County Jail system.',
		iconBgColor: 'bg-[#7c3aed]/20 dark:bg-[#8b5cf6]/20',
		icon: (
			<path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
		),
	},
	{
		title: 'Secure & Private',
		description:
			'Your tracking lists and personal information are protected with enterprise-grade security.',
		iconBgColor: 'bg-[#059669]/20 dark:bg-[#10b981]/20',
		icon: (
			<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
		),
	},
	{
		title: '24/7 Monitoring',
		description:
			'Round-the-clock monitoring ensures you never miss important updates about tracked inmates.',
		iconBgColor: 'bg-[#dc2626]/20 dark:bg-[#ef4444]/20',
		icon: (
			<>
				<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				<path d="M12 2v2m0 16v2m-8-10H4m16 0h-2" />
			</>
		),
	},
]

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
						{features.map((feature, index) => (
							<div key={index} className="flex flex-col gap-2">
								<div
									className={`rounded-md aspect-video mb-2 flex items-center justify-center transition-colors ${feature.iconBgColor}`}
								>
									<svg
										className="w-12 h-12 text-primary"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										{feature.icon}
									</svg>
								</div>
								<h3 className="text-xl tracking-tight">{feature.title}</h3>
								<p className="text-muted-foreground text-base">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export { Feature }
