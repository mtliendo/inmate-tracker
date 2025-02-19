'use client'

import { Menu } from 'lucide-react'
import { Button } from './button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from './sheet'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface NavLink {
	label: string
	href: string
}

interface NavbarProps {
	links?: NavLink[]
}

const navLinks = [
	{ label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'FAQ', href: '#faq' },
]

export function Navbar({ links = navLinks }: NavbarProps) {
	const pathname = usePathname()
	const isHomePage = pathname === '/'
	const [pendingScroll, setPendingScroll] = useState<string | null>(null)

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
		<header className="absolute top-0 z-50 w-full">
			<div className="absolute inset-0 bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-[2px]" />
			<div className="container relative flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-6 md:gap-8 lg:gap-10">
					{/* Logo */}
					<Link href="/" className="font-semibold relative">
						Your Logo
					</Link>

					{/* Desktop Navigation - Only show on homepage */}
					{isHomePage && (
						<nav className="hidden md:flex md:gap-6 lg:gap-8">
							{links.map((link) => (
								<button
									key={link.href}
									onClick={() => scrollToSection(link.href)}
									className={cn(
										'text-sm font-medium text-foreground/90 transition-colors hover:text-foreground relative'
									)}
								>
									{link.label}
								</button>
							))}
						</nav>
					)}
				</div>

				{/* Mobile Navigation - Only show on homepage */}
				{isHomePage && (
					<Sheet
						onOpenChange={(open) => {
							if (!open && pendingScroll) {
								// When sheet is closed and we have a pending scroll
								setTimeout(() => {
									scrollToSection(pendingScroll)
									setPendingScroll(null)
								}, 300) // Adjust timing to match sheet close animation
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
								{links.map((link) => (
									<SheetClose asChild key={link.href}>
										<button
											onClick={() => {
												setPendingScroll(link.href)
											}}
											className="text-left text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</button>
									</SheetClose>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				)}
			</div>
		</header>
	)
}
