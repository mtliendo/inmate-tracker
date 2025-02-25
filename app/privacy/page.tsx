import React from 'react'

export default function PrivacyPolicy() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
						Privacy Policy
					</h1>

					<div className="prose prose-invert prose-lg max-w-none">
						<p className="text-gray-300">
							Last Updated:{' '}
							{new Date().toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
						<p>
							Welcome to Inmate Alerts (&quot;we,&quot; &quot;our,&quot; or
							&quot;us&quot;). We respect your privacy and are committed to
							protecting your personal information. This Privacy Policy explains
							how we collect, use, disclose, and safeguard your information when
							you use our Inmate Alerts service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							2. Information We Collect
						</h2>
						<p>We collect the following types of information:</p>
						<ul className="list-disc pl-6 mt-2 space-y-2">
							<li>
								<strong>Personal Information:</strong> Name, email address,
								phone number, and payment information when you register for our
								service.
							</li>
							<li>
								<strong>Subscription Information:</strong> Details about your
								subscription plan, payment history, and billing information.
							</li>
							<li>
								<strong>Alert Preferences:</strong> Names of inmates you wish to
								track, notification preferences, and alert settings.
							</li>
							<li>
								<strong>Usage Information:</strong> Information about how you
								use our service, including log data, device information, and IP
								address.
							</li>
						</ul>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							3. How We Use Your Information
						</h2>
						<p>We use your information for the following purposes:</p>
						<ul className="list-disc pl-6 mt-2 space-y-2">
							<li>
								To provide and maintain our service, including processing
								subscriptions and sending alerts.
							</li>
							<li>To process payments and manage your account.</li>
							<li>
								To send you notifications about inmate status changes based on
								your alert preferences.
							</li>
							<li>
								To communicate with you about your account, respond to
								inquiries, and provide customer support.
							</li>
							<li>To improve and optimize our service.</li>
							<li>To comply with legal obligations.</li>
						</ul>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							4. Third-Party Services
						</h2>
						<p>
							We use the following third-party services to operate our platform:
						</p>
						<ul className="list-disc pl-6 mt-2 space-y-2">
							<li>
								<strong>Amazon Web Services (AWS):</strong> For hosting our
								application, storing data, and authentication services.
							</li>
							<li>
								<strong>Stripe:</strong> For processing payments and managing
								subscriptions.
							</li>
							<li>
								<strong>Twilio:</strong> For sending SMS notifications.
							</li>
							<li>
								<strong>Resend:</strong> For sending email notifications.
							</li>
						</ul>
						<p>
							Each of these services has their own privacy policies that govern
							how they handle your information.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							5. Data Retention
						</h2>
						<p>
							We retain your personal information for as long as necessary to
							provide you with our services and as needed to comply with our
							legal obligations. If you cancel your subscription, we may retain
							certain information as required by law or for legitimate business
							purposes.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							6. Data Security
						</h2>
						<p>
							We implement appropriate technical and organizational measures to
							protect your personal information against unauthorized access,
							alteration, disclosure, or destruction. However, no method of
							transmission over the Internet or electronic storage is 100%
							secure, and we cannot guarantee absolute security.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">7. Your Rights</h2>
						<p>
							Depending on your location, you may have certain rights regarding
							your personal information, including:
						</p>
						<ul className="list-disc pl-6 mt-2 space-y-2">
							<li>
								The right to access the personal information we hold about you.
							</li>
							<li>
								The right to request correction of inaccurate information.
							</li>
							<li>The right to request deletion of your information.</li>
							<li>
								The right to restrict or object to processing of your
								information.
							</li>
							<li>The right to data portability.</li>
						</ul>
						<p>
							To exercise these rights, please contact us at
							support@focusotter.com.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							8. Children&apos;s Privacy
						</h2>
						<p>
							Our service is not intended for individuals under the age of 18.
							We do not knowingly collect personal information from children. If
							you are a parent or guardian and believe your child has provided
							us with personal information, please contact us.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							9. Changes to This Privacy Policy
						</h2>
						<p>
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy on
							this page and updating the &quot;Last Updated&quot; date. You are
							advised to review this Privacy Policy periodically for any
							changes.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
						<p>
							If you have any questions about this Privacy Policy, please
							contact us at:
						</p>
						<p className="mt-2">
							<a
								href="mailto:support@focusotter.com"
								className="text-purple-400 hover:text-purple-300"
							>
								support@focusotter.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
