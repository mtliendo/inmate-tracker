'use client'
import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
	PlusCircle,
	Trash2,
	CreditCard,
	Mail,
	Phone,
	ChevronDown,
} from 'lucide-react'
import { PLAN_LIMITS, PLAN_DETAILS } from '@/app/types/subscription'
import { useRouter } from 'next/navigation'
import { startOfDay, formatISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const client = generateClient<Schema>()

// Chicago timezone constant
const CHICAGO_TIMEZONE = 'America/Chicago'

// Function to get the start of day in Chicago timezone
function getChicagoStartOfDay(): string {
	// Get the start of day in Chicago timezone
	const now = new Date()
	const chicagoDate = toZonedTime(now, CHICAGO_TIMEZONE)
	const chicagoStartOfDay = startOfDay(chicagoDate)
	return formatISO(chicagoStartOfDay)
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
					className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-500"
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
					className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-500"
				/>
			</div>
			<button
				onClick={() => onDelete(index)}
				className="p-2 text-red-400 hover:text-red-300 transition-colors"
				aria-label="Delete name"
			>
				<Trash2 className="h-5 w-5" />
			</button>
		</div>
	)
}

function MyAccountPage() {
	const { user } = useAuthenticator((context) => [context.user])
	const queryClient = useQueryClient()
	const [names, setNames] = React.useState<NameInput[]>([])
	const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
	const [selectedInmate, setSelectedInmate] = React.useState<
		Schema['Inmate']['type'] | null
	>(null)
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
	const [isSendingEmail, setIsSendingEmail] = React.useState(false)
	const [isSendingSMS, setIsSendingSMS] = React.useState(false)
	const router = useRouter()
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

	// Query for today's inmates
	const {
		data: todayInmates,
		isLoading: isLoadingInmates,
		error: inmatesError,
	} = useQuery({
		queryKey: ['todayInmates'],
		queryFn: async () => {
			const startOfToday = getChicagoStartOfDay()
			const response = await client.models.Inmate.list({
				filter: {
					createdAt: {
						ge: startOfToday,
					},
				},
			})
			if (response.errors) {
				throw new Error(response.errors[0].message)
			}

			// Sort inmates by createdAt time (newest first)
			const sortedInmates = [...response.data].sort((a, b) => {
				const dateA = new Date(a.createdAt || 0).getTime()
				const dateB = new Date(b.createdAt || 0).getTime()
				return dateB - dateA // Descending order (newest first)
			})

			return sortedInmates
		},
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

	// Check if user has acknowledged disclaimer
	React.useEffect(() => {
		if (userData?.[0] && !userData[0].disclaimerAcknowledged) {
			router.push('/acknowledgement')
		}
	}, [userData, router])

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
	const { mutate: getBillingPortal, isPending: isLoadingPortal } = useMutation({
		mutationFn: async (customerId: string) => {
			const response =
				await client.mutations.createStripeCustomerBillingSession({
					customerId,
					returnUrl: `${window.location.origin}/my-account`,
				})
			if (!response.data) {
				throw new Error('Failed to create billing portal session')
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

	// Mutation for updating notification preferences
	const { mutate: updateNotificationPreferences } = useMutation({
		mutationFn: async (alertMethod: 'EMAIL' | 'TEXT' | 'EMAIL_AND_TEXT') => {
			if (!userData?.[0]) throw new Error('No user found')

			const response = await client.models.User.update({
				id: userData[0].id,
				inmateAlertPreferences: {
					names: userData[0].inmateAlertPreferences.names,
					charges: userData[0].inmateAlertPreferences.charges,
					chargeTypeAlerts: userData[0].inmateAlertPreferences.chargeTypeAlerts,
					hourlyAlertsEnabled:
						userData[0].inmateAlertPreferences.hourlyAlertsEnabled,
					alertMethod,
				},
			})

			if (response.errors) {
				throw new Error(response.errors[0].message)
			}
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
			toast.success('Notification preferences updated successfully')
		},
		onError: (error) => {
			toast.error(`Failed to update notification preferences: ${error.message}`)
		},
	})

	const handleAddName = () => {
		const currentPlan = userData?.[0]?.stripePriceId
		const maxNames = currentPlan
			? PLAN_DETAILS[currentPlan]?.maxNames
			: PLAN_LIMITS.FREE

		if (!currentPlan && names.length >= PLAN_LIMITS.FREE) {
			toast.error('Please upgrade to add more names')
			return
		}
		if (maxNames && names.length >= maxNames) {
			toast.error(`Maximum of ${maxNames} names allowed on your current plan`)
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

	// Toggle dropdown
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
		// When opening the dropdown, add a click event listener to the document to close it when clicking outside
		if (!isDropdownOpen) {
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside)
			}, 0)
		} else {
			document.removeEventListener('click', handleClickOutside)
		}
	}

	// Handle click outside dropdown
	const dropdownRef = React.useRef<HTMLDivElement>(null)
	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsDropdownOpen(false)
			document.removeEventListener('click', handleClickOutside)
		}
	}

	// Cleanup event listener on unmount
	React.useEffect(() => {
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	// Select inmate
	const handleSelectInmate = (inmate: Schema['Inmate']['type']) => {
		setSelectedInmate(inmate)
		setIsDropdownOpen(false)
		document.removeEventListener('click', handleClickOutside)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
				<div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500/50"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
				<div className="container mx-auto p-4 text-red-400">
					Error: {(error as Error).message}
				</div>
			</div>
		)
	}

	const dbUser = userData?.[0]

	// Handle different user states

	if (dbUser?.status === 'inactive' && dbUser.stripeCustomerId) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
				<div className="container mx-auto p-4">
					<div className="bg-gradient-to-br from-black/50 via-purple-900/20 to-black/50 backdrop-blur-sm rounded-lg p-8 text-center border border-white/10">
						<h1 className="text-2xl font-bold mb-4">Subscription Inactive</h1>
						<p className="mb-4 text-gray-400">
							Your subscription is currently inactive. Click below to manage
							your subscription.
						</p>
						<button
							onClick={() => getBillingPortal(dbUser.stripeCustomerId!)}
							disabled={isLoadingPortal}
							className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isLoadingPortal ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Opening Portal...
								</>
							) : (
								'Manage Subscription'
							)}
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
			<div className="container mx-auto p-4">
				<div className="max-w-3xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
						<h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
							Welcome, {dbUser?.name}
						</h1>
						<div className="flex flex-col md:flex-row gap-4">
							<button
								onClick={() => {
									if (!dbUser?.stripePriceId || dbUser?.status !== 'paid') {
										window.location.href = '/pricing'
									} else if (dbUser?.stripeCustomerId) {
										getBillingPortal(dbUser.stripeCustomerId)
									}
								}}
								disabled={isLoadingPortal}
								className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50"
							>
								{isLoadingPortal ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Opening Portal...
									</>
								) : (
									<>
										<CreditCard className="h-5 w-5" />
										{!dbUser?.stripePriceId || dbUser?.status !== 'paid'
											? 'Upgrade'
											: 'Manage Billing'}
									</>
								)}
							</button>
						</div>
					</div>

					{/* Current Plan Info */}
					{dbUser?.stripePriceId && (
						<div className="bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6">
							<h2 className="text-lg font-semibold mb-2">Current Plan</h2>
							<div className="text-gray-400">
								<p className="mb-2">
									{PLAN_DETAILS[dbUser.stripePriceId]?.name || 'Free Plan'}
								</p>
								<ul className="list-disc list-inside space-y-1">
									{PLAN_DETAILS[dbUser.stripePriceId]?.features.map(
										(feature, index) => (
											<li key={index}>{feature}</li>
										)
									)}
								</ul>
							</div>
						</div>
					)}

					{/* Notification Preferences Section */}
					<div className="bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6">
						<div className="flex flex-col gap-4">
							<div>
								<h2 className="text-lg font-semibold mb-2">
									Notification Preferences
								</h2>
								<p className="text-sm text-gray-400 mb-4">
									Choose how you want to receive alerts about inmate updates.
								</p>
							</div>

							<div className="space-y-4">
								<div className="flex flex-col gap-2">
									<p className="text-sm font-medium text-gray-300">
										Contact Information
									</p>
									<div className="flex flex-col gap-3 text-sm text-gray-400">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4" />
											<span>{dbUser?.email}</span>
										</div>
										{dbUser?.phone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4" />
												<span>{dbUser.phone}</span>
											</div>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<p className="text-sm font-medium text-gray-300">
										Alert Method
									</p>
									<div className="flex flex-col gap-3">
										<label className="flex items-center gap-3">
											<input
												type="radio"
												name="alertMethod"
												value="EMAIL"
												checked={
													dbUser?.inmateAlertPreferences?.alertMethod ===
													'EMAIL'
												}
												onChange={() => {
													if (!dbUser) return
													updateNotificationPreferences('EMAIL')
												}}
												className="h-4 w-4 text-purple-500 border-gray-600 bg-black/50 focus:ring-purple-500/20"
											/>
											<span className="text-sm text-gray-300">Email only</span>
										</label>
										<label className="flex items-center gap-3">
											<input
												type="radio"
												name="alertMethod"
												value="TEXT"
												checked={
													dbUser?.inmateAlertPreferences?.alertMethod === 'TEXT'
												}
												onChange={() => {
													if (!dbUser) return
													updateNotificationPreferences('TEXT')
												}}
												className="h-4 w-4 text-purple-500 border-gray-600 bg-black/50 focus:ring-purple-500/20"
											/>
											<span className="text-sm text-gray-300">
												Text message only
											</span>
										</label>
										<label className="flex items-center gap-3">
											<input
												type="radio"
												name="alertMethod"
												value="EMAIL_AND_TEXT"
												checked={
													dbUser?.inmateAlertPreferences?.alertMethod ===
													'EMAIL_AND_TEXT'
												}
												onChange={() => {
													if (!dbUser) return
													updateNotificationPreferences('EMAIL_AND_TEXT')
												}}
												className="h-4 w-4 text-purple-500 border-gray-600 bg-black/50 focus:ring-purple-500/20"
											/>
											<span className="text-sm text-gray-300">
												Both email and text message
											</span>
										</label>
									</div>
								</div>

								{/* Test Notification Dropdown */}
								<div className="flex flex-col gap-2 pt-4 border-t border-white/10">
									<p className="text-sm font-medium text-gray-300">
										Test Notifications
									</p>

									{isLoadingInmates ? (
										<div className="flex items-center gap-2 text-sm text-gray-400">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500/50"></div>
											Loading today&apos;s inmates...
										</div>
									) : inmatesError ? (
										<div className="text-sm text-red-400">
											Error loading inmates: {(inmatesError as Error).message}
										</div>
									) : todayInmates && todayInmates.length > 0 ? (
										<>
											<div className="relative" ref={dropdownRef}>
												<button
													onClick={(e) => {
														e.stopPropagation()
														toggleDropdown()
													}}
													className="w-full flex items-center justify-between bg-black/50 border border-white/10 rounded px-4 py-2 text-sm text-gray-300 hover:border-purple-500/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
												>
													<span>
														{selectedInmate
															? selectedInmate.name
															: 'Select an inmate'}
													</span>
													<ChevronDown className="h-4 w-4 ml-2" />
												</button>
												{isDropdownOpen && (
													<div
														className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-20"
														onClick={() => setIsDropdownOpen(false)}
													>
														<div
															className="bg-black/90 border border-white/10 rounded shadow-lg overflow-auto w-full max-w-md max-h-[60vh]"
															onClick={(e) => e.stopPropagation()}
														>
															<div className="sticky top-0 bg-purple-900/50 px-4 py-2 border-b border-white/10">
																<p className="font-medium text-white">
																	Select an inmate
																</p>
															</div>
															{todayInmates.map((inmate) => (
																<button
																	key={inmate.id}
																	onClick={() => handleSelectInmate(inmate)}
																	className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-purple-900/20 transition-colors border-b border-white/5"
																>
																	{inmate.name}
																</button>
															))}
														</div>
													</div>
												)}
											</div>
											<div className="flex flex-wrap gap-3 mt-2">
												<button
													onClick={async () => {
														if (!dbUser?.email || !selectedInmate) {
															toast.error('Please select an inmate first')
															return
														}
														try {
															setIsSendingEmail(true)
															await client.mutations.testSendEmail({
																email: dbUser.email,
																inmate: {
																	name: selectedInmate.name,
																	bookingDateTime:
																		selectedInmate.bookingDateTime ||
																		new Date().toLocaleString(),
																	charges: selectedInmate.charges || [
																		'No charges',
																	],
																	mugshotUrl: selectedInmate.mugshotUrl || '',
																},
															})
															toast.success('Test email sent successfully')
														} catch (error) {
															console.error('Failed to send test email:', error)
															toast.error('Failed to send test email')
														} finally {
															setIsSendingEmail(false)
														}
													}}
													disabled={
														!selectedInmate ||
														!['EMAIL', 'EMAIL_AND_TEXT'].includes(
															dbUser?.inmateAlertPreferences?.alertMethod || ''
														) ||
														isSendingEmail
													}
													className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{isSendingEmail ? (
														<>
															<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
															Sending...
														</>
													) : (
														<>
															<Mail className="h-4 w-4" />
															Test Email
														</>
													)}
												</button>
												{dbUser?.phone && (
													<button
														onClick={async () => {
															if (!dbUser?.phone || !selectedInmate) {
																toast.error('Please select an inmate first')
																return
															}
															try {
																setIsSendingSMS(true)
																await client.mutations.testSendMMS({
																	phone: dbUser.phone!,
																	inmate: {
																		name: selectedInmate.name,
																		bookingDateTime:
																			selectedInmate.bookingDateTime ||
																			new Date().toLocaleString(),
																		charges: selectedInmate.charges || [
																			'No charges',
																		],
																		mugshotUrl: selectedInmate.mugshotUrl || '',
																	},
																})
																toast.success('Test SMS sent successfully')
															} catch (error) {
																console.error('Failed to send test SMS:', error)
																toast.error('Failed to send test SMS')
															} finally {
																setIsSendingSMS(false)
															}
														}}
														disabled={
															!selectedInmate ||
															!['TEXT', 'EMAIL_AND_TEXT'].includes(
																dbUser?.inmateAlertPreferences?.alertMethod ||
																	''
															) ||
															isSendingSMS
														}
														className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
													>
														{isSendingSMS ? (
															<>
																<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
																Sending...
															</>
														) : (
															<>
																<Phone className="h-4 w-4" />
																Test SMS
															</>
														)}
													</button>
												)}
											</div>
										</>
									) : (
										<div className="text-sm text-gray-400">
											No inmates found for today. Check back later.
										</div>
									)}
									<p className="text-xs text-gray-500 mt-1">
										Send a test notification using{' '}
										<a
											href="https://www.scottcountyiowa.us/sheriff/inmates.php?comdate=today"
											target="_blank"
											rel="noopener noreferrer"
											className="text-purple-500 hover:text-purple-600"
										>
											today&apos;s inmate data
										</a>{' '}
										to verify your settings.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-br from-black/50 via-purple-900/10 to-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
						<div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
							<div className="flex-1">
								<h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
									Alert Names
								</h2>
								<p className="mt-1 text-sm text-gray-400">
									Enter first and last names exactly as they appear on official
									records. You can edit these names anytime. Note: We don&apos;t
									check for nicknames, middle names, or name variations.
								</p>
							</div>
							<div className="md:self-start">
								<button
									onClick={handleAddName}
									disabled={names.length >= 10}
									className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap"
								>
									<PlusCircle className="h-5 w-5" />
									Add Name
								</button>
							</div>
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
									className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded transition-all"
								>
									Save Changes
								</button>
							</div>
						)}
					</div>
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

export default withAuthenticator(MyAccountPage, { formFields })
