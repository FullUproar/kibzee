import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-6">
            Effective Date: September 1, 2025 | Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-red-900 text-xl font-bold mb-3">⚠️ CRITICAL SAFETY NOTICE</h2>
            <p className="text-red-800 font-semibold mb-3">
              KIBZEE IS A PLATFORM THAT CONNECTS INDEPENDENT MUSIC TEACHERS WITH STUDENTS. 
              WE DO NOT EMPLOY, ENDORSE, OR SUPERVISE ANY TEACHERS.
            </p>
            <ul className="text-red-700 space-y-2">
              <li>• <strong>NEVER</strong> leave children unattended with any teacher you don't know and trust</li>
              <li>• <strong>ALWAYS</strong> attend your child's first several lessons</li>
              <li>• <strong>VERIFY</strong> teacher credentials independently</li>
              <li>• <strong>MEET</strong> in public spaces initially</li>
              <li>• <strong>TRUST</strong> your instincts - if something feels wrong, it probably is</li>
            </ul>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using Kibzee ("Platform", "Service", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>
            <p>
              You must be at least 18 years old to use this Service. Parents or legal guardians may create accounts on behalf of minors but assume full responsibility for their use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">2. Nature of Service - IMPORTANT</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Platform Only</h3>
            <p className="mb-4">
              Kibzee is solely a marketplace platform that facilitates connections between independent music teachers and students. We are NOT:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>An employer of any teacher</li>
              <li>A music school or educational institution</li>
              <li>A childcare or supervision service</li>
              <li>A guarantor of any teacher's qualifications or character</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Independent Contractors</h3>
            <p className="mb-4">
              All teachers on Kibzee are independent contractors. They are not our employees, agents, or representatives. We do not control, and are not responsible for, their teaching methods, conduct, or any interactions you have with them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">3. Your Responsibilities</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Due Diligence</h3>
            <p className="mb-4">You are solely responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Evaluating the suitability of any teacher</li>
              <li>Verifying credentials, qualifications, and references</li>
              <li>Conducting your own background checks if desired</li>
              <li>Supervising minors during lessons</li>
              <li>Ensuring the safety of lesson locations</li>
              <li>Making informed decisions about who you or your children interact with</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Minors and Parental Supervision</h3>
            <p className="mb-4 font-semibold">
              IF YOU ARE A PARENT OR GUARDIAN ARRANGING LESSONS FOR A MINOR:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You MUST supervise all initial lessons</li>
              <li>You are FULLY RESPONSIBLE for your child's safety</li>
              <li>You SHOULD NOT leave your child alone with a teacher until you have established trust through multiple supervised interactions</li>
              <li>You MUST use your own judgment about when, if ever, to allow unsupervised lessons</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">4. Limitation of Liability - PLEASE READ CAREFULLY</h2>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="font-bold mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, KIBZEE AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS WILL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any loss of profits, revenue, data, or use</li>
                <li>Any harm, injury, or damages arising from your interactions with teachers or other users</li>
                <li>Any criminal acts, negligence, or misconduct by teachers or other users</li>
                <li>Any failure of background checks or verification processes to identify risks</li>
                <li>Any inaccurate information provided by users</li>
              </ul>
            </div>
            <p className="font-bold">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO KIBZEE IN THE PAST TWELVE MONTHS, OR $100, WHICHEVER IS GREATER.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">5. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless Kibzee, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to or use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your interaction with any teacher or user</li>
              <li>Any harm or injury occurring during or as a result of music lessons</li>
              <li>Your negligence or willful misconduct</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">6. Background Checks and Verification</h2>
            <h3 className="text-xl font-semibold mb-3">6.1 Optional Verification</h3>
            <p className="mb-4">
              While we offer optional background check and verification services for teachers, these are NOT comprehensive and DO NOT guarantee safety or qualification. Even "verified" teachers should be thoroughly evaluated by you.
            </p>

            <h3 className="text-xl font-semibold mb-3">6.2 No Guarantee</h3>
            <p className="mb-4 font-semibold">
              WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY BACKGROUND CHECKS OR VERIFICATIONS. CRIMINAL RECORDS MAY NOT BE COMPLETE, AND DANGEROUS INDIVIDUALS MAY PASS BACKGROUND CHECKS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">7. User Conduct</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Provide false, inaccurate, or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post inappropriate, offensive, or harmful content</li>
              <li>Attempt to circumvent platform fees</li>
              <li>Scrape or copy platform content without permission</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">8. Payment Terms</h2>
            <h3 className="text-xl font-semibold mb-3">8.1 Platform Fees</h3>
            <p className="mb-4">
              Kibzee charges a service fee of 5% on all transactions. This fee is non-refundable except as required by law.
            </p>

            <h3 className="text-xl font-semibold mb-3">8.2 Payment Processing</h3>
            <p className="mb-4">
              Payments are processed by third-party payment processors. We are not responsible for payment processing errors, delays, or disputes between users regarding payments.
            </p>

            <h3 className="text-xl font-semibold mb-3">8.3 Refunds and Disputes</h3>
            <p className="mb-4">
              Refund policies are determined by individual teachers. We may facilitate but are not responsible for refund disputes. Users should resolve payment disputes directly with each other.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">9. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by Kibzee and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">10. Privacy and Data Protection</h2>
            <p className="mb-4">
              Your use of our Service is also governed by our <Link href="/privacy" className="text-sage hover:underline">Privacy Policy</Link>. 
              By using the Service, you consent to the collection and use of information as detailed in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">11. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
              for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">12. Disclaimer of Warranties</h2>
            <p className="mb-4 font-semibold">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
              BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE 
              SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">13. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mb-3">13.1 Arbitration</h3>
            <p className="mb-4">
              Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the 
              American Arbitration Association's rules, except where prohibited by law.
            </p>

            <h3 className="text-xl font-semibold mb-3">13.2 Class Action Waiver</h3>
            <p className="mb-4">
              You agree to bring claims only in your individual capacity and not as part of any class or representative action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">14. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by the laws of [Your State/Country], without regard to its conflict of law provisions. 
              You consent to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">15. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or 
              platform notification. Continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4">16. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Kibzee Legal Department</p>
              <p>Email: legal@kibzee.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </section>

          <div className="bg-sage/10 border border-sage rounded-lg p-6 mt-12">
            <h3 className="text-lg font-bold text-ink mb-3">Acknowledgment</h3>
            <p className="text-sm">
              By using Kibzee, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
              You understand the risks involved in using a platform that connects you with independent service providers and 
              accept full responsibility for your safety and the safety of any minors under your care.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}