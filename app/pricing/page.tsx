'use client'
import React from 'react'

import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'

function PricingPage() {
	return (
		<Authenticator
			className={
				'flex items-center justify-center h-screen w-screen bg-background'
			}
			socialProviders={['facebook', 'google']}
		>
			<div>PricingPage</div>
		</Authenticator>
	)
}

export default PricingPage
