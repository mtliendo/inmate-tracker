'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'

interface FooterProps {
	logo?: React.ReactNode
	brandName?: string
	socialLinks?: Array<{
		icon: React.ReactNode
		href: string
		label: string
	}>
	mainLinks?: Array<{
		href: string
		label: string
	}>
	legalLinks?: Array<{
		href: string
		label: string
	}>
	copyright?: {
		text: string
		license?: string
	}
}

const navLinks = [
	// { label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'FAQ', href: '#faq' },
]

const defaultProps = {
	logo: <Hexagon className="h-10 w-10" />,
	brandName: 'Inmate Alerts',
	socialLinks: [
		// {
		// 	icon: <Twitter className="h-5 w-5" />,
		// 	href: 'https://twitter.com',
		// 	label: 'Twitter',
		// },
		// {
		// 	icon: <Github className="h-5 w-5" />,
		// 	href: 'https://github.com',
		// 	label: 'GitHub',
		// },
	],
	mainLinks: [
		// { href: '/features', label: 'Features' },
		// { href: '/about', label: 'About' },
		{
			href: 'mailto:support@focusotter.com?subject=Inmate%20Alert%20Support',
			label: 'Contact',
		},
	],
	legalLinks: [
		{ href: '/privacy', label: 'Privacy Policy' },
		{ href: '/terms', label: 'Terms of Service' },
	],
	copyright: {
		text: `© 2024 - ${new Date().getFullYear()} Inmate Alerts`,
		license: 'All rights reserved',
	},
}

export function Footer({
	logo = defaultProps.logo,
	brandName = defaultProps.brandName,
	socialLinks = defaultProps.socialLinks,
	mainLinks = defaultProps.mainLinks,
	legalLinks = defaultProps.legalLinks,
	copyright = defaultProps.copyright,
}: FooterProps) {
	const pathname = usePathname()
	const isHomePage = pathname === '/'

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return (
		<footer className="pb-6 pt-16 lg:pb-8 lg:pt-24">
			<div className="px-4 lg:px-8">
				<div className="md:flex md:items-start md:justify-between">
					<Link
						href="/"
						className="flex items-center gap-x-2"
						aria-label={brandName}
					>
						{logo}
						<span className="font-bold text-xl">{brandName}</span>
					</Link>
					<ul className="flex list-none mt-6 md:mt-0 space-x-3">
						{socialLinks.map((link, i) => (
							<li key={i}>
								<Button
									variant="secondary"
									size="icon"
									className="h-10 w-10 rounded-full"
									asChild
								>
									<a href={link.href} target="_blank" aria-label={link.label}>
										{link.icon}
									</a>
								</Button>
							</li>
						))}
					</ul>
				</div>
				<div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
					<nav className="lg:mt-0 lg:col-[4/11]">
						<ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
							{!isHomePage &&
								navLinks.map((link, i) => (
									<li key={`nav-${i}`} className="my-1 mx-2 shrink-0">
										<button
											onClick={() => scrollToSection(link.href)}
											className="text-sm text-primary underline-offset-4 hover:underline"
										>
											{link.label}
										</button>
									</li>
								))}
							{mainLinks.map((link, i) => (
								<li key={`main-${i}`} className="my-1 mx-2 shrink-0">
									<Link
										href={link.href}
										className="text-sm text-primary underline-offset-4 hover:underline"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<div className="mt-6 lg:mt-0 lg:col-[4/11]">
						<ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
							{legalLinks.map((link, i) => (
								<li key={i} className="my-1 mx-3 shrink-0">
									<Link
										href={link.href}
										className="text-sm text-muted-foreground underline-offset-4 hover:underline"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
						<div>{copyright.text}</div>
						{copyright.license && <div>{copyright.license}</div>}
					</div>
				</div>
			</div>
		</footer>
	)
}
