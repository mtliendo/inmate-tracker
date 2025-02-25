'use client'

import { Menu, User2, LogOut } from 'lucide-react'
import { Button } from './button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from './sheet'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'

interface NavLink {
	label: string
	href: string
}

interface NavbarProps {
	links?: NavLink[]
}

const navLinks = [
	// { label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'FAQ', href: '#faq' },
]

export function Navbar({ links = navLinks }: NavbarProps) {
	const pathname = usePathname()
	const isHomePage = pathname === '/'
	const [pendingScroll, setPendingScroll] = useState<string | null>(null)
	const { user, signOut } = useAuthenticator((context) => [context.user])

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	const authLinks = user?.username
		? [
				{ label: 'My Account', href: '/my-account', icon: User2 },
				{ label: 'Sign Out', href: '#', icon: LogOut, onClick: signOut },
		  ]
		: []

	return (
		<header className="absolute top-0 z-50 w-full">
			<div className="absolute inset-0 -z-10 bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-[2px]" />
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-6 md:gap-8 lg:gap-10">
						{/* Logo */}
						<Link href="/" className="font-semibold relative">
							Inmate Alerts
						</Link>

						{/* Desktop Navigation - Only show on homepage */}
						{isHomePage && (
							<nav className="hidden md:flex md:gap-6 lg:gap-8">
								{links.map((link) => (
									<Button
										key={link.href}
										variant="ghost"
										onClick={() => scrollToSection(link.href)}
										className="text-sm font-medium"
									>
										{link.label}
									</Button>
								))}
							</nav>
						)}
					</div>

					{/* Desktop Auth Navigation */}
					<div className="hidden md:flex items-center gap-4">
						{!user?.username ? (
							<Button variant="ghost" className="gap-2" asChild>
								<Link href="/my-account" className="flex items-center gap-2">
									Login
								</Link>
							</Button>
						) : (
							authLinks.map((link) => {
								const Icon = link.icon
								return (
									<Button
										key={link.label}
										variant="ghost"
										className="gap-2"
										onClick={link.onClick}
										asChild={!link.onClick}
									>
										{link.onClick ? (
											<span className="flex items-center gap-2">
												<Icon className="h-4 w-4" />
												{link.label}
											</span>
										) : (
											<Link
												href={link.href}
												className="flex items-center gap-2"
											>
												<Icon className="h-4 w-4" />
												{link.label}
											</Link>
										)}
									</Button>
								)
							})
						)}
					</div>

					{/* Mobile Navigation */}
					<Sheet
						onOpenChange={(open) => {
							if (!open && pendingScroll) {
								setTimeout(() => {
									scrollToSection(pendingScroll)
									setPendingScroll(null)
								}, 300)
							}
						}}
					>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
							</SheetHeader>
							<nav className="mt-8 flex flex-col gap-4">
								{/* Show homepage links only on homepage */}
								{isHomePage &&
									links.map((link) => (
										<SheetClose asChild key={link.href}>
											<Button
												variant="ghost"
												className="justify-start w-full"
												onClick={() => setPendingScroll(link.href)}
											>
												{link.label}
											</Button>
										</SheetClose>
									))}

								{/* Divider if we have both types of links */}
								{isHomePage && authLinks.length > 0 && (
									<div className="h-px bg-border my-2" />
								)}

								{/* Auth Links */}
								{!user?.username ? (
									<SheetClose asChild>
										<Button
											variant="ghost"
											className="justify-start w-full gap-2"
											asChild
										>
											<Link
												href="/my-account"
												className="flex items-center gap-2"
											>
												Login
											</Link>
										</Button>
									</SheetClose>
								) : (
									authLinks.map((link) => {
										const Icon = link.icon
										return (
											<SheetClose asChild key={link.label}>
												<Button
													variant="ghost"
													className="justify-start w-full gap-2"
													onClick={link.onClick}
													asChild={!link.onClick}
												>
													{link.onClick ? (
														<span className="flex items-center gap-2">
															<Icon className="h-4 w-4" />
															{link.label}
														</span>
													) : (
														<Link
															href={link.href}
															className="flex items-center gap-2"
														>
															<Icon className="h-4 w-4" />
															{link.label}
														</Link>
													)}
												</Button>
											</SheetClose>
										)
									})
								)}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
