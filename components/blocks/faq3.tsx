'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface FaqItem {
	id: string
	question: string
	answer: string
}

interface Faq3Props {
	heading?: string
	description?: string
	items?: FaqItem[]
	supportHeading?: string
	supportDescription?: string
	supportButtonText?: string
	supportButtonUrl?: string
}

const faqItems = [
	{
		id: 'faq-1',
		question: 'What are the different pricing plans available?',
		answer:
			'We offer three plans: Watchful Citizen ($4.99/mo) for individuals tracking up to 10 names, Professional Monitor ($14.99/mo) for businesses tracking up to 25 names with advanced features, and Enterprise Tracker ($29.99/mo) for organizations needing unlimited tracking and AI-powered insights.',
	},
	{
		id: 'faq-2',
		question: 'What information is included in the alerts?',
		answer:
			"Alerts include the inmate's name, booking date/time, charges, and status changes. Professional and Enterprise plans also receive additional filtering options and, for Enterprise users, AI-generated arrest summaries.",
	},
	{
		id: 'faq-3',
		question: 'Can I track inmates in other counties?',
		answer:
			'Currently, our service is focused on Scott County, Iowa. We plan to expand to other counties in the future. Sign up for our newsletter to stay updated on our expansion plans.',
	},
	{
		id: 'faq-4',
		question: 'How do I upgrade my plan?',
		answer:
			"You can upgrade your plan at any time through your dashboard. When upgrading, you'll have immediate access to the new features, and your billing will be prorated for the remainder of your current billing cycle.",
	},
	{
		id: 'faq-5',
		question: 'Is my information kept confidential?',
		answer:
			'Yes, we take privacy very seriously. Your personal information and tracking list are kept strictly confidential and secured with industry-standard encryption.',
	},
]

const Faq3 = ({
	heading = 'Frequently Asked Questions',
	description = "Find answers to common questions about our inmate tracking service. Can't find what you're looking for? Contact our support team for assistance.",
	items = faqItems,
	supportHeading = 'Need Additional Help?',
	supportDescription = 'Our dedicated support team is available to assist you with any questions about our inmate tracking service.',
	supportButtonText = 'Contact Support',
	supportButtonUrl = '/pricing',
}: Faq3Props) => {
	return (
		<section className="py-16 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6 mx-auto space-y-8 md:space-y-12 lg:space-y-16 flex flex-col items-center">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
						{heading}
					</h2>
					<p className="text-muted-foreground lg:text-lg">{description}</p>
				</div>
				<Accordion
					type="single"
					collapsible
					className="mx-auto w-full max-w-3xl"
				>
					{items.map((item) => (
						<AccordionItem key={item.id} value={item.id}>
							<AccordionTrigger className="transition-all duration-200 ease-in-out hover:no-underline hover:opacity-60">
								<div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
									{item.question}
								</div>
							</AccordionTrigger>
							<AccordionContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
								<div className="pb-4 pt-0">
									<div className="text-muted-foreground lg:text-lg">
										{item.answer}
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				<div className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-purple-50/30 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/10 p-8 text-center md:p-10 lg:p-12 backdrop-blur-sm border border-purple-100/20 dark:border-purple-400/10">
					<div className="relative">
						<Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border-2 border-purple-100 dark:border-purple-400/20 md:mb-5">
							<AvatarImage src="https://shadcnblocks.com/images/block/avatar-2.webp" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border-2 border-purple-100 dark:border-purple-400/20 md:mb-5">
							<AvatarImage src="https://shadcnblocks.com/images/block/avatar-3.webp" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="mb-4 size-16 border-2 border-purple-100 dark:border-purple-400/20 md:mb-5">
							<AvatarImage src="https://shadcnblocks.com/images/block/avatar-1.webp" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
					</div>
					<h3 className="mb-2 max-w-3xl font-semibold lg:text-lg text-purple-950 dark:text-purple-100">
						{supportHeading}
					</h3>
					<p className="mb-8 max-w-3xl text-purple-900/80 dark:text-purple-200/80 lg:text-lg">
						{supportDescription}
					</p>
					<div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
						<Button
							className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white w-full sm:w-auto"
							asChild
						>
							<a href={supportButtonUrl} target="_blank">
								{supportButtonText}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}

export { Faq3 }
