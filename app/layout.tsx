'use client'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Authenticator } from '@aws-amplify/ui-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<div className="flex flex-col min-h-screen">
					<Authenticator.Provider>
						<Navbar />
						<div className="flex-grow">{children}</div>
						<Footer />
					</Authenticator.Provider>
				</div>
			</body>
		</html>
	)
}
