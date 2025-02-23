'use client'
import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import Script from 'next/script'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlusCircle, Trash2, CreditCard, LogOut } from 'lucide-react'

const client = generateClient<Schema>()

declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			'stripe-pricing-table': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>
		}
	}
}

type NameInput = {
	firstName: string
	lastName: string
}

function NameFields({
	name,
	index,
	onDelete,
	onChange,
}: {
	name: NameInput
	index: number
	onDelete: (index: number) => void
	onChange: (index: number, name: NameInput) => void
}) {
	return (
		<div className="flex gap-4 items-center">
			<div className="flex-1">
				<input
					type="text"
					value={name.firstName}
					required
					onChange={(e) =>
						onChange(index, { ...name, firstName: e.target.value })
					}
					placeholder="First Name"
					className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 focus:border-white/25 outline-none transition-colors placeholder-gray-500"
				/>
			</div>
			<div className="flex-1">
				<input
					type="text"
					value={name.lastName}
					required
					onChange={(e) =>
						onChange(index, { ...name, lastName: e.target.value })
					}
					placeholder="Last Name"
					className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 focus:border-white/25 outline-none transition-colors placeholder-gray-500"
				/>
			</div>
			<button
				onClick={() => onDelete(index)}
				className="p-2 text-white/70 hover:text-white transition-colors"
				aria-label="Delete name"
			>
				<Trash2 className="h-5 w-5" />
			</button>
		</div>
	)
}

function MyAccountPage() {
	const { user, signOut } = useAuthenticator((context) => [context.user])
	const queryClient = useQueryClient()
	const [names, setNames] = React.useState<NameInput[]>([])
	const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)

	// Query for user data
	const {
		data: userData,
		isLoading,
		error,
	} = useQuery({
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

	// Set initial names from user data
	React.useEffect(() => {
		if (userData?.[0]?.inmateAlertPreferences?.names) {
			const validNames = userData[0].inmateAlertPreferences.names
				.filter((name): name is NameInput => name !== null)
				.map((name) => ({
					firstName: (name.firstName || '').trim(),
					lastName: (name.lastName || '').trim(),
				}))
			setNames(validNames)
		}
	}, [userData])

	// Mutation for creating a new user
	const { mutate: createUser, data: newUserData } = useMutation({
		mutationFn: async () => {
			const response = await client.mutations.setupNewUser({
				email: user.signInDetails?.loginId as string,
			})
			if (!response.data) {
				throw new Error('Failed to create new user')
			}
			return response.data
		},
	})

	// Mutation for updating names
	const { mutate: updateNames } = useMutation({
		mutationFn: async (newNames: NameInput[]) => {
			if (!userData?.[0]) throw new Error('No user found')

			const response = await client.models.User.update({
				id: userData[0].id,
				inmateAlertPreferences: {
					...userData[0].inmateAlertPreferences,
					names: newNames,
				},
			})

			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
			toast.success('Names updated successfully')
			setHasUnsavedChanges(false)
		},
		onError: (error) => {
			toast.error(`Failed to update names: ${error.message}`)
		},
	})

	// Mutation for getting billing portal session
	const { mutate: getBillingSession } = useMutation({
		mutationFn: async (customerId: string) => {
			const response =
				await client.mutations.createStripeCustomerBillingPortalSession({
					customerId,
					returnUrl: window.location.href,
				})
			if (!response.data) {
				throw new Error('Failed to create billing session')
			}
			return response.data
		},
		onSuccess: (data) => {
			window.location.href = data.sessionUrl
		},
		onError: (error) => {
			toast.error(`Failed to access billing portal: ${error.message}`)
		},
	})

	// If we have no users and haven't created one yet, create one
	React.useEffect(() => {
		if (userData && userData.length === 0 && !newUserData) {
			createUser()
		}
	}, [userData, newUserData, createUser])

	const handleAddName = () => {
		if (names.length >= 10) {
			toast.error('Maximum of 10 names allowed')
			return
		}
		setNames([...names, { firstName: '', lastName: '' }])
		setHasUnsavedChanges(true)
	}

	const handleDeleteName = (index: number) => {
		setNames(names.filter((_, i) => i !== index))
		setHasUnsavedChanges(true)
	}

	const handleNameChange = (index: number, newName: NameInput) => {
		setNames(
			names.map((name, i) =>
				i === index
					? {
							firstName: newName.firstName.trim(),
							lastName: newName.lastName.trim(),
					  }
					: name
			)
		)
		setHasUnsavedChanges(true)
	}

	const handleSaveNames = () => {
		updateNames(names)
	}

	if (isLoading) {
		return (
			<div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto p-4 text-red-400">
				Error: {(error as Error).message}
			</div>
		)
	}

	const dbUser = userData?.[0]
	const clientSecret = newUserData?.customerSession

	// Handle different user states
	if (clientSecret) {
		return (
			<div className="container mx-auto p-4">
				<div className="mb-4">Stripe Pricing Table for new customer</div>
				<Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
				<stripe-pricing-table
					pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
					publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
					customer-session-client-secret={clientSecret}
				></stripe-pricing-table>
			</div>
		)
	}

	if (dbUser?.status === 'inactive' && dbUser.stripeCustomerId) {
		return (
			<div className="container mx-auto p-4">
				<div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center border border-white/10">
					<h1 className="text-2xl font-bold mb-4">Subscription Inactive</h1>
					<p className="mb-4 text-gray-400">
						Your subscription is currently inactive. Click below to manage your
						subscription.
					</p>
					<button
						onClick={() => getBillingSession(dbUser.stripeCustomerId!)}
						className="bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/25 text-white font-medium px-6 py-2 rounded transition-all"
					>
						Manage Subscription
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<h1 className="text-2xl font-bold text-white">My Account</h1>
				<div className="flex flex-col md:flex-row gap-4">
					<button
						onClick={() =>
							dbUser?.stripeCustomerId &&
							getBillingSession(dbUser.stripeCustomerId)
						}
						className="bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/25 text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 transition-all"
					>
						<CreditCard className="h-5 w-5" />
						Manage Billing
					</button>
					<button
						onClick={() => signOut()}
						className="bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/25 text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 transition-all"
					>
						<LogOut className="h-5 w-5" />
						Sign Out
					</button>
				</div>
			</div>

			<div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
					<h2 className="text-xl font-semibold text-white">Alert Names</h2>
					<button
						onClick={handleAddName}
						disabled={names.length >= 10}
						className="bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/25 text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 transition-all"
					>
						<PlusCircle className="h-5 w-5" />
						Add Name
					</button>
				</div>

				<div className="space-y-4">
					{names.map((name, index) => (
						<NameFields
							key={index}
							name={name}
							index={index}
							onDelete={handleDeleteName}
							onChange={handleNameChange}
						/>
					))}
				</div>

				{hasUnsavedChanges && (
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleSaveNames}
							className="bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/25 text-white px-6 py-2 rounded transition-all"
						>
							Save Changes
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default withAuthenticator(MyAccountPage)
