import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { inmateCron } from '../functions/inmateCron/resource'
import { inmateDDBStream } from '../functions/inmateDDBStream/resource'
import { setupNewUser } from '../functions/setupNewUser/resource'
import { ebSubscriptionEvents } from '../functions/ebSubscriptionEvents/resource'
import { createStripeCustomerBillingPortalSession } from '../functions/createStripeCustomerBillingPortalSession/resource'
const schema = a
	.schema({
		Name: a.customType({
			firstName: a.string(),
			lastName: a.string(),
		}),
		InmateAlertPreferences: a.customType({
			names: a.ref('Name').array().required(),
			charges: a.string().array(),
			chargeTypeAlerts: a.enum(['MISDEMEANOR', 'FELONY', 'BOTH', 'NONE']),
			hourlyAlertsEnabled: a.boolean(),
			alertMethod: a.enum(['EMAIL', 'TEXT', 'EMAIL_AND_TEXT']),
		}),
		User: a
			.model({
				owner: a.string().required(),
				stripeCustomerId: a.string(),
				stripePriceId: a.string(),
				status: a.enum(['trialing', 'paid', 'inactive']),
				email: a.email().required(),
				phone: a.phone(),
				inmateAlertPreferences: a.ref('InmateAlertPreferences').required(),
			})
			.authorization((allow) => [allow.owner()]),
		Inmate: a
			.model({
				name: a.string().required(),
				age: a.integer(),
				bookingDateTime: a.string(),
				releaseDateTime: a.string(),
				committingAgency: a.string(),
				mugshotUrl: a.string(),
				profileUrl: a.string(),
				charges: a.string().array(),
			})
			.authorization((allow) => [allow.group('none')]),
		setupNewUser: a
			.mutation()
			.arguments({
				email: a.email().required(),
			})
			.handler(a.handler.function(setupNewUser))
			.returns(
				a.customType({
					customerSession: a.string().required(),
				})
			)
			.authorization((allow) => [allow.authenticated()]),
		createStripeCustomerBillingPortalSession: a
			.mutation()
			.returns(
				a.customType({
					sessionUrl: a.string().required(),
				})
			)
			.arguments({
				customerId: a.string().required(),
				returnUrl: a.string().required(),
			})
			.handler(a.handler.function(createStripeCustomerBillingPortalSession))
			.authorization((allow) => [allow.authenticated()]),
	})
	.authorization((allow) => [
		allow.resource(inmateCron),
		allow.resource(inmateDDBStream),
		allow.resource(setupNewUser),
		allow.resource(ebSubscriptionEvents),
	])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
	},
})
