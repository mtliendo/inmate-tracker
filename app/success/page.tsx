'use client'
import React from 'react'
import { ShootingStars } from '@/components/ui/shooting-stars'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessPage() {
	return (
		<div className="min-h-screen w-full bg-black relative">
			{/* Background with stars */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
				<div className="stars absolute inset-0" />
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
				<div className="text-center max-w-2xl mx-auto bg-black/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
					<CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
					<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
						Thank You for Subscribing!
					</h1>
					<p className="text-gray-300 mb-8 text-lg">
						Your subscription has been confirmed. You&apos;re now ready to start
						setting up your inmate alerts.
					</p>
					<Link
						href="/my-account"
						className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
					>
						Go to My Account
					</Link>
				</div>
			</div>

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
