'use client'
import React, { useState } from 'react'
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { GlowEffect } from '@/components/ui/glow-effect'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const client = generateClient<Schema>()

function AcknowledgementPage() {
	const { user } = useAuthenticator((context) => [context.user])
	const queryClient = useQueryClient()
	const router = useRouter()
	const [acknowledged, setAcknowledged] = useState(false)

	// Query for user data
	const { data: userData, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await client.models.User.list()
			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		enabled: !!user.signInDetails?.loginId,
	})

	// Mutation for updating user acknowledgement
	const { mutate: updateAcknowledgement, isPending } = useMutation({
		mutationFn: async () => {
			if (!userData?.[0]) throw new Error('No user found')

			const response = await client.models.User.update({
				id: userData[0].id,
				disclaimerAcknowledged: true,
			})

			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
			toast.success('Acknowledgement recorded')
			router.push('/my-account')
		},
		onError: (error) => {
			toast.error(`Failed to record acknowledgement: ${error.message}`)
		},
	})

	// If user has already acknowledged, redirect to my-account
	React.useEffect(() => {
		if (userData?.[0]?.disclaimerAcknowledged) {
			router.push('/my-account')
		}
	}, [userData, router])

	if (isLoading) {
		return (
			<div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500/50"></div>
			</div>
		)
	}

	return (
		<div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
			{/* Glow Effect Background */}
			<GlowEffect
				className="opacity-20"
				colors={['#3b82f6', '#8b5cf6', '#6366f1']}
				mode="breathe"
				blur="strongest"
			/>

			<div className="relative max-w-2xl w-full rounded-lg border border-gray-800 bg-black/50 backdrop-blur-xl p-8 space-y-6">
				<h1 className="text-2xl font-bold text-white text-center mb-8">
					Acknowledgement
				</h1>

				<div className="prose prose-invert max-w-none space-y-4">
					<p className="text-gray-300">
						This application is not affiliated with the Scott County Jail. The
						inmate data for this application comes from the{' '}
						<a
							href="https://www.scottcountyiowa.us/sheriff/inmates.php"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 underline"
						>
							Scott County Jail Inmates Page
						</a>
						.
					</p>

					<p className="text-gray-300">
						As such, there are no such guarantees as to the accuracy of the
						data.
					</p>

					<p className="text-gray-300">
						Remember that an arrest without disposition is not an indication of
						guilt.
					</p>

					<p className="text-gray-300">
						It&apos;s a bit odd creating something that I hope no one ever
						needs. May this app bring assurance and piece of mind to those that
						end up needing it.
					</p>

					<p className="text-gray-400 italic text-right">
						— Michael Liendo, Creator of Inmate Alerts
					</p>

					<div className="flex items-start space-x-2 pt-4">
						<Checkbox
							id="acknowledgement"
							checked={acknowledged}
							onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
							className="mt-1"
						/>
						<Label
							htmlFor="acknowledgement"
							className="text-sm text-gray-300 font-normal leading-relaxed"
						>
							I acknowledge that I have read and understand this statement.
						</Label>
					</div>
				</div>

				<div className="flex justify-center pt-4">
					<Button
						disabled={!acknowledged || isPending}
						onClick={() => updateAcknowledgement()}
						className="w-full max-w-sm"
					>
						{isPending ? (
							<div className="flex items-center gap-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								<span>Processing...</span>
							</div>
						) : (
							'Continue'
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}

const formFields = {
	signUp: {
		given_name: {
			order: 1,
			label: 'Full Name',
			placeholder: 'Full Name',
		},
		email: {
			order: 2,
		},
		phone_number: {
			order: 3,
		},
		password: {
			order: 4,
		},
		confirm_password: {
			order: 5,
		},
	},
}

export default withAuthenticator(AcknowledgementPage, {
	formFields,
	initialState: 'signUp',
})
