import React from 'react'

export default function TermsOfService() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
						Terms of Service
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

						<h2 className="text-xl font-semibold mt-8 mb-4">
							1. Acceptance of Terms
						</h2>
						<p>
							By accessing or using the Inmate Alerts service, you agree to be
							bound by these Terms of Service. If you do not agree to these
							terms, please do not use our service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							2. Description of Service
						</h2>
						<p>
							Inmate Alerts provides notifications about inmate bookings,
							releases, and status changes in Scott County, Iowa. Our service
							allows users to receive alerts via email or SMS when specific
							inmates are booked, released, or have status changes.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							3. Registration and Account
						</h2>
						<p>
							To use our service, you must create an account by providing
							accurate and complete information. You are responsible for
							maintaining the confidentiality of your account credentials and
							for all activities that occur under your account. You must notify
							us immediately of any unauthorized use of your account.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							4. Subscription and Payment
						</h2>
						<p>
							Inmate Alerts offers both free and paid subscription plans. By
							subscribing to a paid plan, you agree to pay all fees associated
							with your subscription. Payments are processed through Stripe, and
							you agree to their terms of service when making a payment.
						</p>
						<p className="mt-2">
							Subscription fees are billed in advance on a recurring basis. You
							can cancel your subscription at any time, but no refunds will be
							provided for the current billing period. After cancellation, your
							subscription will remain active until the end of the current
							billing period.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">5. User Conduct</h2>
						<p>
							You agree not to use our service for any unlawful purpose or in
							any way that could damage, disable, overburden, or impair our
							service. You also agree not to attempt to gain unauthorized access
							to any part of our service, other accounts, or computer systems.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							6. Disclaimer of Warranties
						</h2>
						<p>
							Our service is provided on an &quot;as is&quot; and &quot;as
							available&quot; basis. We make no warranties, expressed or
							implied, regarding the reliability, accuracy, or availability of
							our service. We do not guarantee that our service will be
							error-free or uninterrupted.
						</p>
						<p className="mt-2">
							The information provided through our service is sourced from
							public records maintained by Scott County, Iowa. We do not
							guarantee the accuracy, completeness, or timeliness of this
							information. You acknowledge that there may be delays or errors in
							the information provided.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							7. Limitation of Liability
						</h2>
						<p>
							To the maximum extent permitted by law, we shall not be liable for
							any indirect, incidental, special, consequential, or punitive
							damages, including but not limited to, damages for loss of
							profits, goodwill, use, data, or other intangible losses resulting
							from your use of our service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							8. Indemnification
						</h2>
						<p>
							You agree to indemnify, defend, and hold harmless Inmate Alerts,
							its officers, directors, employees, and agents from any claims,
							liabilities, damages, losses, costs, or expenses, including
							reasonable attorneys&apos; fees, arising from your use of our
							service or your violation of these Terms of Service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							9. Modifications to the Service
						</h2>
						<p>
							We reserve the right to modify, suspend, or discontinue our
							service, temporarily or permanently, at any time without notice.
							We shall not be liable to you or any third party for any
							modification, suspension, or discontinuance of our service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							10. Changes to Terms
						</h2>
						<p>
							We may update these Terms of Service from time to time. We will
							notify you of any changes by posting the new Terms of Service on
							this page. Your continued use of our service after any changes to
							these terms constitutes your acceptance of the new Terms of
							Service.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">
							11. Governing Law
						</h2>
						<p>
							These Terms of Service shall be governed by and construed in
							accordance with the laws of the State of Iowa, without regard to
							its conflict of law provisions.
						</p>

						<h2 className="text-xl font-semibold mt-8 mb-4">12. Contact Us</h2>
						<p>
							If you have any questions about these Terms of Service, please
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
