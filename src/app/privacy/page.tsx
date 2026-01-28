export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-6">
            Effective Date: September 1, 2025 | Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">1.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information:</strong> Name, email, password, phone number, profile photo</li>
              <li><strong>Profile Information:</strong> Bio, location, instruments, experience, education, certifications</li>
              <li><strong>Verification Information:</strong> Government ID, proof of insurance, educational documents</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we don't store card numbers)</li>
              <li><strong>Communications:</strong> Messages between users, reviews, support tickets</li>
              <li><strong>Minor Information:</strong> If booking for a minor, their name and age (with parental consent)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">1.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, search queries, lesson bookings</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
              <li><strong>Location Data:</strong> Approximate location from IP address, precise location if permitted</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">1.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Background Check Providers:</strong> Criminal records, verification results (with consent)</li>
              <li><strong>Payment Processors:</strong> Transaction confirmations, dispute information</li>
              <li><strong>Social Media:</strong> If you connect social accounts (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our Services</li>
              <li>Facilitate connections between teachers and students</li>
              <li>Process payments and transactions</li>
              <li>Verify identities and conduct background checks (with consent)</li>
              <li>Send service-related communications</li>
              <li>Respond to support requests</li>
              <li>Detect and prevent fraud, abuse, and security issues</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with consent)</li>
              <li>Analyze usage patterns to improve the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">3. Information Sharing</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 With Other Users</h3>
            <p className="mb-4">We share:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Public Profiles:</strong> Name, photo, bio, instruments, rates, reviews, verification badges</li>
              <li><strong>Upon Booking:</strong> Contact information between matched teachers and students</li>
              <li><strong>Reviews:</strong> Your reviews are public and associated with your name</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 With Service Providers</h3>
            <p className="mb-4">We share data with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Payment processors (Stripe)</li>
              <li>Background check providers (Checkr, Sterling)</li>
              <li>Email service providers</li>
              <li>Cloud storage providers</li>
              <li>Analytics services</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.3 For Legal Reasons</h3>
            <p className="mb-4">We may disclose information when required by law or to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Comply with legal processes</li>
              <li>Protect safety of users or the public</li>
              <li>Protect our rights and property</li>
              <li>Investigate fraud or security issues</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="font-semibold">
                WE DO NOT SELL YOUR PERSONAL INFORMATION TO THIRD PARTIES
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">4. Data Security</h2>
            <p className="mb-4">We implement security measures including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and testing</li>
              <li>Limited access to personal information</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Two-factor authentication options</li>
            </ul>
            <p className="font-semibold">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">5. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold mb-3">5.1 Access and Control</h3>
            <p className="mb-4">You can:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information through your account</li>
              <li>Update or correct your information</li>
              <li>Delete your account (some information may be retained for legal purposes)</li>
              <li>Download your data in a portable format</li>
              <li>Object to certain processing activities</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.2 Communication Preferences</h3>
            <p className="mb-4">You can:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Opt-out of marketing emails</li>
              <li>Adjust notification settings</li>
              <li>Control cookie preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.3 California Privacy Rights</h3>
            <p className="mb-4">
              California residents have additional rights under CCPA, including the right to know what personal 
              information is collected, request deletion, and opt-out of sale (which we don't do).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">6. Children's Privacy</h2>
            <p className="mb-4">
              Our Service is not directed to children under 13. We do not knowingly collect personal information 
              from children under 13 without parental consent.
            </p>
            <p className="mb-4">
              For minors aged 13-17:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Parent/guardian must create and manage the account</li>
              <li>Parent/guardian must provide consent for data collection</li>
              <li>Parent/guardian has full access to the minor's account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain information for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="mb-4">
              Typically, we retain active account data indefinitely while you use the service. After account deletion:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Profile information: Deleted within 30 days</li>
              <li>Transaction records: Retained for 7 years (legal requirement)</li>
              <li>Communications: Retained for 3 years</li>
              <li>Background check results: Retained for 2 years</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for international transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">9. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings, but some features may not work properly without them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">10. Third-Party Links</h2>
            <p className="mb-4">
              Our Service may contain links to third-party websites. We are not responsible for the privacy 
              practices of these sites. Please review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. We will notify you of material changes via 
              email or platform notification. Your continued use after changes indicates acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">12. Contact Us</h2>
            <p className="mb-4">For privacy-related questions or requests:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Data Protection Officer</strong></p>
              <p>Kibzee Privacy Team</p>
              <p>Email: privacy@kibzee.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
            <p className="mt-4">
              To exercise your privacy rights, please email us with "Privacy Rights Request" in the subject line.
            </p>
          </section>

          <div className="bg-sage/10 border border-sage rounded-lg p-6 mt-12">
            <h3 className="text-lg font-bold text-ink mb-3">Your Privacy Matters</h3>
            <p className="text-sm">
              We are committed to protecting your privacy and giving you control over your personal information. 
              If you have any concerns about how we handle your data, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}