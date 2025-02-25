'use client'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Authenticator } from '@aws-amplify/ui-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Amplify } from 'aws-amplify'
import config from '@/amplify_outputs.json'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { FathomAnalytics } from './fathom'

const queryClient = new QueryClient()

Amplify.configure(config)

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
				<FathomAnalytics />
				<QueryClientProvider client={queryClient}>
					<div className="flex flex-col min-h-screen">
						<Authenticator.Provider>
							<Navbar />
							<div className="flex-grow pt-20">{children}</div>
							<Footer />
							<Toaster richColors position="top-center" />
						</Authenticator.Provider>
					</div>
				</QueryClientProvider>
			</body>
		</html>
	)
}
