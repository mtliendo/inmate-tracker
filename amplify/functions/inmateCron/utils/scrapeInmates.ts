import * as cheerio from 'cheerio'

interface Inmate {
	name: string
	age: number
	bookingDateTime: string
	releaseDateTime: string
	committingAgency: string
	charges: string[]
	mugshotUrl: string | undefined
	profileUrl: string
}

/**
 * Validates that all required HTML selectors are present in the page structure
 * @param $ - Cheerio instance
 * @throws Error if any required selectors are missing
 */
function validatePageStructure($: cheerio.CheerioAPI): void {
	const requiredSelectors = {
		table: '.inmates-table',
		'table rows': '.inmates-table tbody tr',
		'inmate name container': '.inmate',
		'age field': '.age',
		'booking date': '.comdate',
		'release date': '.reldate',
		'committing agency': '.comitau',
		'charges list': '.chdesc',
	}

	const missingSelectors = Object.entries(requiredSelectors)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.filter(([_, selector]) => $(selector).length === 0)
		.map(([name]) => name)

	if (missingSelectors.length > 0) {
		throw new Error(
			`Website structure has changed! Missing elements: ${missingSelectors.join(
				', '
			)}. ` + 'Please check if the Scott County website has been updated.'
		)
	}
}

/**
 * Scrapes inmate data from the Scott County Sheriff's Office website
 * @param date - The date to scrape inmates for. Defaults to 'today'. Other options are formatted like '2/10/2025'
 * @returns An array of inmates
 * @throws An error if the HTTP request fails, response is not ok, or if the website structure has changed
 */
export async function scrapeInmates(date = 'today') {
	try {
		const url = `https://www.scottcountyiowa.us/sheriff/inmates.php?comdate=${date}`

		// Fetch the webpage
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const html = await response.text()
		const $ = cheerio.load(html)

		// Validate page structure before processing
		validatePageStructure($)

		const inmates: Inmate[] = []

		// Process each inmate row in the table
		$('.inmates-table tbody tr').each((i, element) => {
			const inmate = {
				name: $(element).find('.inmate div:last-child').text().trim(),
				age: parseInt($(element).find('.age').text().trim()),
				bookingDateTime: $(element).find('.comdate').text().trim(),
				releaseDateTime: $(element).find('.reldate').text().trim(),
				committingAgency: $(element).find('.comitau').text().trim(),
				charges: [] as string[],
				mugshotUrl: $(element)
					.find('.inmate img')
					.attr('src')
					?.replace(/^\/\//, 'https://'),
				profileUrl: `https://www.scottcountyiowa.us/sheriff/inmates.php${$(
					element
				)
					.find('.inmate a')
					.attr('href')}`,
			}

			// Extract charges from the unordered list
			$(element)
				.find('.chdesc ul li')
				.each((i, charge) => {
					inmate.charges.push($(charge).text().trim())
				})

			inmates.push(inmate)
		})

		return inmates
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error scraping inmate data:', error.message)
		} else {
			console.error('Error scraping inmate data:', error)
		}
		throw error
	}
}
