export const PLAN_LIMITS = {
	FREE: 1,
	WATCHFUL_CITIZEN: 10,
	PROFESSIONAL_MONITOR: 25,
} as const

export type PlanType = 'free' | 'paid' | 'inactive' | 'canceled'

export interface PlanDetails {
	name: string
	maxNames: number
	features: string[]
}

export const PLAN_DETAILS: Record<string, PlanDetails> = {
	[process.env.NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID!]: {
		name: 'Watchful Citizen',
		maxNames: PLAN_LIMITS.WATCHFUL_CITIZEN,
		features: [
			'Track up to 10 names',
			'Daily AI crime insights',
			'Weekly & monthly AI reports',
		],
	},
	[process.env.NEXT_PUBLIC_PROFESSIONAL_MONITOR_MONTHLY_STRIPE_PRICE_ID!]: {
		name: 'Professional Monitor',
		maxNames: PLAN_LIMITS.PROFESSIONAL_MONITOR,
		features: [
			'Track up to 25 names',
			'Daily AI crime insights',
			'Weekly & monthly AI reports',
			'Advanced analytics',
		],
	},
}
