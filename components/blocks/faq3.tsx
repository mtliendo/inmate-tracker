'use client'

import { Button } from '@/components/ui/button'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

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
			"Alerts include the inmate's name, booking date/time, charges, and their mugshot. Note that due to how the data is provided to us, the mugshot may not always be available as it takes time for Scott County to upload the mugshot to their system.",
	},
	{
		id: 'faq-3',
		question: 'Can I track inmates in other counties?',
		answer:
			'Currently, our service is focused on Scott County, Iowa. We plan to expand to other counties in the future. We are working with local law enforcement agencies to expand our coverage.',
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
	{
		id: 'faq-6',
		question: 'What do you mean by real-time alerts?',
		answer:
			'Our system checks the Scott County Jail website every 4 minutes for new inmate bookings. When a new booking is found, you will receive an alert via email and/or text message.',
	},
]

const Faq3 = ({
	heading = 'Frequently Asked Questions',
	description = "Find answers to common questions about our inmate tracking service. Can't find what you're looking for? Contact our support team for assistance.",
	items = faqItems,
	supportHeading = 'Need Additional Help?',
	supportDescription = 'Our dedicated support team is available to assist you with any questions about our inmate tracking service.',
	supportButtonText = 'Contact Support',
	supportButtonUrl = 'mailto:support@focusotter.com?subject=Inmate%20Alert%20Support',
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
				<div className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm p-8 text-center md:p-10 lg:p-12 border border-white/10">
					<h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
						{supportHeading}
					</h3>
					<p className="mb-8 text-gray-400 max-w-2xl">{supportDescription}</p>
					<Button
						className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white w-full sm:w-auto"
						asChild
					>
						<a href={supportButtonUrl}>{supportButtonText}</a>
					</Button>
				</div>
			</div>
		</section>
	)
}

export { Faq3 }
