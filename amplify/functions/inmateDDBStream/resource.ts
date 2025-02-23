import { defineFunction } from '@aws-amplify/backend'

export const inmateDDBStream = defineFunction({
	name: 'inmateDDBStream',
	entry: './main.ts',
	resourceGroupName: 'data',
	runtime: 22,
	memoryMB: 512,
	timeoutSeconds: 15,
})
