'use client'
import React, { useEffect } from 'react'
import { ShootingStars } from '@/components/ui/shooting-stars'

import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
function PricingPage() {
	return (
		<div className="min-h-screen w-full bg-black relative">
			{/* Background with stars */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
				<div className="stars absolute inset-0" />
			</div>

			{/* Content */}
			<Authenticator
				socialProviders={['google', 'facebook']}
				className={
					'flex items-center justify-center relative z-50 bg-transparent mx-auto my-20'
				}
			>
				<PricingTable />
			</Authenticator>

			{/* Multiple shooting star layers with different colors and speeds */}
			<ShootingStars
				starColor="#9E00FF"
				trailColor="#2EB9DF"
				minSpeed={15}
				maxSpeed={35}
				minDelay={1000}
				maxDelay={3000}
			/>
			<ShootingStars
				starColor="#FF0099"
				trailColor="#FFB800"
				minSpeed={10}
				maxSpeed={25}
				minDelay={2000}
				maxDelay={4000}
			/>
			<ShootingStars
				starColor="#00FF9E"
				trailColor="#00B8FF"
				minSpeed={20}
				maxSpeed={40}
				minDelay={1500}
				maxDelay={3500}
			/>

			<style jsx>{`
				.stars {
					background-image: radial-gradient(
							2px 2px at 20px 30px,
							#eee,
							rgba(0, 0, 0, 0)
						),
						radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
						radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
					background-repeat: repeat;
					background-size: 200px 200px;
					animation: twinkle 5s ease-in-out infinite;
					opacity: 0.5;
				}

				@keyframes twinkle {
					0% {
						opacity: 0.5;
					}
					50% {
						opacity: 0.8;
					}
					100% {
						opacity: 0.5;
					}
				}
			`}</style>
		</div>
	)
}

export default PricingPage

/* todo: On this component, check if there is a user. If there is, check to see if there is,
then pull the stripe customer id from the user. If there is no user, create a new user
and then create a new stripe customer id. Then, pull the stripe customer id from the user.
Then, display the pricing page with the stripe customer id.

Show the user a loading state if the stripe customer id is being pulled.

*/
const PricingTable = () => {
	useEffect(() => {
		console.log('in here!!')
	}, [])
	return <div>PricingTable</div>
}
