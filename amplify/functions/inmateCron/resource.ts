import { defineFunction } from '@aws-amplify/backend'

export const inmateCron = defineFunction({
	name: 'inmate-cron',
	entry: './main.ts',
	schedule: 'every 4m',
	runtime: 22,
	memoryMB: 512,
	timeoutSeconds: 15,
})
