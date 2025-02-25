import { Metadata } from 'next'
import ClientLayout from './layout-client'

export const metadata: Metadata = {
	title: 'Inmate Tracker',
	description: 'Track and manage inmate information',
	icons: {
		icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
		apple: [{ url: '/apple-icon.png', type: 'image/png' }],
	},
	manifest: '/manifest.json',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <ClientLayout>{children}</ClientLayout>
}
