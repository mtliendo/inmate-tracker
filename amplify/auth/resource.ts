import { defineAuth } from '@aws-amplify/backend'
import { setupNewUser } from '../functions/setupNewUser/resource'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	triggers: {
		postConfirmation: setupNewUser,
	},
	loginWith: {
		email: true,
	},
	userAttributes: {
		email: {
			required: true,
		},
		phoneNumber: {
			required: true,
		},
		givenName: {
			required: true,
		},
	},
})
