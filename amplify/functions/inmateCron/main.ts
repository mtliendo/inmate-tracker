import type { EventBridgeHandler } from 'aws-lambda'
import { scrapeInmates } from './utils/scrapeInmates'
import { startOfDay, formatISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

import { type Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/inmate-cron'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()
const CHICAGO_TIMEZONE = 'America/Chicago'

function getChicagoStartOfDay(): string {
	// Get the start of day in Chicago timezone
	const now = new Date()
	const chicagoDate = toZonedTime(now, CHICAGO_TIMEZONE)
	const chicagoStartOfDay = startOfDay(chicagoDate)
	return formatISO(chicagoStartOfDay)
}

interface InmateData {
	name: string
	age: number
	bookingDateTime: string
	releaseDateTime?: string | null
	committingAgency: string
	mugshotUrl?: string
	profileUrl: string
	charges: string[]
}

interface ProcessResult {
	success: boolean
	error?: string
}

async function processInmate(inmate: InmateData): Promise<ProcessResult> {
	try {
		await client.models.Inmate.create(
			{
				name: inmate.name,
				age: inmate.age,
				bookingDateTime: inmate.bookingDateTime,
				releaseDateTime: inmate.releaseDateTime ?? null,
				committingAgency: inmate.committingAgency,
				mugshotUrl: inmate.mugshotUrl ?? null,
				profileUrl: inmate.profileUrl,
				charges: inmate.charges,
			},
			{ authMode: 'iam' }
		)
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error: `Failed to create inmate ${inmate.name}: ${
				error instanceof Error ? error.message : String(error)
			}`,
		}
	}
}

export const handler: EventBridgeHandler<
	'Scheduled Event',
	null,
	void
> = async (event) => {
	console.log('Inmate cron job started', event)
	let currentInmates
	let scrapedInmates

	try {
		// Get the start of today in Chicago timezone (most users are from here)
		const startOfToday = getChicagoStartOfDay()

		// Get all inmates created today
		try {
			currentInmates = await client.models.Inmate.list({
				filter: {
					createdAt: {
						ge: startOfToday,
					},
				},
				authMode: 'iam',
			})
			console.log(
				`Successfully fetched ${currentInmates.data.length} existing inmates for today`
			)
		} catch (error) {
			// Log the error but don't throw - we'll treat it as if there are no inmates
			console.error('Error fetching current inmates:', error)
			currentInmates = { data: [] }
		}

		// Scrape new inmates
		try {
			scrapedInmates = await scrapeInmates()
			console.log(`Successfully scraped ${scrapedInmates.length} inmates`)
		} catch (error) {
			console.error('Error scraping inmates:', error)
			// If we can't scrape, we can't proceed
			throw new Error(
				`Failed to scrape inmates: ${
					error instanceof Error ? error.message : String(error)
				}`
			)
		}

		// Create a Set of existing inmate profile URLs for quick lookup
		const existingProfileUrls = new Set(
			currentInmates.data.map((inmate) => inmate.profileUrl)
		)

		// Filter out inmates that already exist in the database
		const newInmates = scrapedInmates.filter(
			(inmate) => !existingProfileUrls.has(inmate.profileUrl)
		)

		console.log(`Found ${newInmates.length} new inmates to add`)

		// Process inmates in parallel with error handling for each
		const results = await Promise.all(newInmates.map(processInmate))

		// Analyze results
		const successCount = results.filter((r) => r.success).length
		const failures = results.filter((r) => !r.success)

		// Log summary
		if (successCount > 0) {
			console.log(`Successfully created ${successCount} new inmates`)
		}
		if (failures.length > 0) {
			console.warn(
				`Failed to create ${failures.length} inmates:`,
				failures.map((f) => f.error)
			)
		}
	} catch (error) {
		console.error('Critical error in inmate cron job:', error)
		throw error // Only throw for truly critical errors (like failing to scrape)
	}
}
