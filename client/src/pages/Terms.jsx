import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10"
      >
        <h1 className="font-display-md text-display-md text-on-surface mb-2">Terms & Conditions</h1>

        <div className="space-y-8 text-on-surface-variant text-sm leading-relaxed text-justify">

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">1. Introduction</h2>
            <p className="mb-2">These Terms & Conditions ("Terms", "Terms and Conditions") govern the use of the Tech Decoder website, services, project engagements, meetings, payments, referrals, revisions, and related services.</p>
            <p className="mb-2">By using the website, requesting a service, booking a project, submitting a project request, making a payment, requesting a meeting, or otherwise engaging with Tech Decoder, the user ("User", "Client", or "you") agrees to these Terms.</p>
            <p>If you do not agree with these Terms, you should not use the website or engage Tech Decoder for its services.</p>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">2. Definitions</h2>
            <p className="mb-2">For these Terms:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>"Tech Decoder", "we", "us", or "our"</strong> means the business/entity operating the Tech Decoder website and providing the relevant services.</li>
              <li><strong>"User", "Client", or "you"</strong> means any person or entity using the website or purchasing/requesting our services.</li>
              <li><strong>"Project"</strong> means the website, software, design, development, technical, consulting, or other work agreed between Tech Decoder and the Client.</li>
              <li><strong>"Project Requirements"</strong> means the requirements, scope, features, deliverables, design specifications, and other points specifically agreed and documented for a Project.</li>
              <li><strong>"Referral"</strong> means a person introduced to Tech Decoder by an existing User through the applicable referral mechanism.</li>
              <li><strong>"Successful Referral"</strong> means a Referral that results in the referred party successfully booking a Project and completing payment in full.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">3. Services and Project Scope</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder will provide the services described and agreed for the relevant Project.</li>
              <li>The Project scope will be based on the requirements specifically discussed, documented, and agreed before or during project confirmation.</li>
              <li>Features, functionality, integrations, designs, pages, content, or deliverables that are not included in the agreed scope may be treated as additional work and may require additional charges or timelines.</li>
              <li>Tech Decoder will make reasonable efforts to understand and meet the Client's requirements, design preferences, and expectations.</li>
              <li>The Client is responsible for providing accurate requirements, information, content, credentials, assets, approvals, and feedback necessary for the Project.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">4. Project Acceptance</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>A Project becomes accepted once the Client confirms the Project, approves the applicable proposal/quotation/scope, or otherwise provides clear confirmation to proceed.</li>
              <li>Once a Project has been accepted, Tech Decoder may allocate resources, begin planning, design, development, or other work.</li>
              <li>Acceptance of a Project creates a commitment to the agreed engagement and payment terms.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">5. Payment Terms</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>The Client must make payments according to the payment schedule communicated or agreed for the Project.</li>
              <li>The Client is expected to make required payments at the earliest and within the agreed payment period.</li>
              <li>Tech Decoder may delay, pause, or reschedule Project work when a required payment is delayed or remains outstanding.</li>
              <li>Any delay caused by late payment may result in a corresponding delay to the Project timeline or delivery date.</li>
              <li>The Client remains responsible for all agreed amounts for work performed or committed under the accepted Project, subject to any applicable refund provisions in these Terms.</li>
              <li>Third-party charges, subscriptions, hosting, domains, paid APIs, software licenses, stock assets, or other external costs may be charged separately where applicable.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">6. Full Payment and Priority Advantage</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder aims to provide fair attention to all accepted Projects and will make reasonable efforts to complete Projects within the agreed or communicated timelines.</li>
              <li>Projects are not automatically ignored, deprioritized, or refused because the Client has not paid the full amount upfront.</li>
              <li>However, where a Client completes <strong>100% payment upfront</strong>, the Project may receive an operational advantage in scheduling, coordination, delivery, or support.</li>
              <li>Full payment does not guarantee an exact delivery date unless such date has been expressly confirmed by Tech Decoder.</li>
              <li>Tech Decoder will continue to make reasonable efforts to meet the applicable Project deadline for all Clients.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">7. Refund Policy</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Payments are generally non-refundable once a Project has been accepted and Tech Decoder has begun work.</strong></li>
              <li>A Client cannot request a refund merely because they later dislike the completed Project, change their mind, prefer a different design, or no longer want the Project.</li>
              <li>Tech Decoder invests time, resources, planning, development, design, and other effort after Project acceptance. Accordingly, work already undertaken is not ordinarily eligible for a refund.</li>
              <li><strong>Refund consideration may arise only where a specifically documented and agreed Project Requirement has not been achieved by Tech Decoder</strong>, subject to verification and review of the agreed scope.</li>
              <li>General dissatisfaction, subjective preference, a change of mind, or a request for a substantially different concept does not by itself establish eligibility for a refund.</li>
              <li>Any refund, where applicable, will be assessed against the agreed Project Requirements and the actual work delivered.</li>
              <li>Nothing in this section is intended to exclude or restrict any refund, cancellation, or consumer right that cannot legally be excluded under applicable law.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">8. Revisions and Change Requests</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder will make reasonable efforts to match the Client's agreed requirements, designs, and expectations.</li>
              <li>The number of included minor revision rounds may depend on the selected service/package. The applicable package terms will govern.</li>
              <li>A revision round is intended for reasonable adjustments to the agreed deliverable and is not an opportunity to repeatedly redesign or replace the original concept.</li>
              <li>Once the Project is ready or delivered, the Client cannot request repetitive or unlimited changes simply because they prefer a different outcome.</li>
              <li>Changes after completion will generally be considered only where there is a blocker in agreed functionality; a material defect in functionality; a significant issue where the delivered design does not meet an expressly agreed design requirement; or another issue covered by the agreed Project Requirements.</li>
              <li>New features, new functionality, a substantially different design direction, changes caused by newly introduced requirements, or repeated subjective preference changes may be treated as additional work and may incur additional charges.</li>
              <li>Minor revisions do not include rebuilding an already approved Project from scratch.</li>
              <li>Client delays in providing feedback or approvals may affect the Project timeline.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">9. Client Responsibilities</h2>
            <p className="mb-2">The Client agrees to:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-2">
              <li>Provide accurate and complete Project Requirements.</li>
              <li>Provide required content, images, logos, credentials, access, documents, and other materials on time.</li>
              <li>Review deliverables and provide consolidated feedback within a reasonable period.</li>
              <li>Provide timely approvals or decisions when requested.</li>
              <li>Ensure that materials supplied by the Client do not infringe the rights of third parties.</li>
              <li>Make payments according to the agreed payment schedule.</li>
              <li>Avoid requesting work outside the agreed scope without first agreeing to any applicable additional cost or timeline.</li>
            </ol>
            <p>Failure to provide required information, approvals, assets, or payments may affect the Project timeline.</p>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">10. Project Timelines and Delays</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder will make reasonable efforts to complete Projects within the communicated or agreed deadline.</li>
              <li>Project timelines may depend on timely Client feedback, approvals, payments, content, third-party services, and other dependencies.</li>
              <li>Delays caused by the Client, including delayed payments, delayed feedback, delayed approvals, or unavailable information, may extend the Project timeline.</li>
              <li>Delays caused by third-party providers, hosting services, APIs, payment providers, external platforms, force majeure events, or circumstances outside Tech Decoder's reasonable control may also affect delivery.</li>
              <li>Tech Decoder will communicate material delays where reasonably possible.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">11. Meetings</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Users may request a meeting by submitting the meeting form available on the Tech Decoder website.</li>
              <li>Submitting the meeting form is a <strong>request and does not constitute final confirmation</strong> of the meeting.</li>
              <li>The meeting will be considered confirmed only when Tech Decoder provides confirmation through WhatsApp, a website notification, or another officially communicated confirmation channel.</li>
              <li>Tech Decoder may change a confirmed meeting time in emergency, unavoidable, or exceptional circumstances.</li>
              <li>Tech Decoder will make reasonable efforts to attend the initially confirmed meeting time and avoid unnecessary or repeated rescheduling.</li>
              <li>A meeting request does not guarantee availability at the requested time.</li>
              <li>Users are expected to attend confirmed meetings on time. Repeated failure to attend may result in the meeting being rescheduled or cancelled.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">12. Referral Program</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Users may refer other potential Clients to Tech Decoder through the available referral mechanism.</li>
              <li>A referral remains <strong>Pending</strong> until the referred person successfully books a Project with Tech Decoder and completes payment in full.</li>
              <li>A referral is considered a <strong>Successful Referral</strong> only after the referred person has successfully booked/confirmed a Project; and completed <strong>100% payment</strong> for that Project.</li>
              <li>The referral amount will be payable to the referring User only after the Successful Referral conditions have been fully satisfied.</li>
              <li>Until the referred Client has booked the Project and completed payment in full, the referral amount remains in <strong>Pending</strong> status.</li>
              <li>The referring User cannot claim, withdraw, or otherwise demand the referral amount while the referral remains Pending.</li>
              <li>If the referred person does not book a Project or does not complete the required full payment, no referral payout will become due.</li>
              <li>Tech Decoder may verify referrals and may require sufficient information to establish that the referral was made through the applicable referral process.</li>
              <li>A referral cannot be generated through fraudulent, misleading, self-referral, duplicate, or abusive activity.</li>
              <li>Tech Decoder may reject or invalidate a referral where the referral does not meet the program requirements.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">13. Website Use</h2>
            <p className="mb-2">Users agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>use the website for unlawful purposes;</li>
              <li>submit false, misleading, or fraudulent information;</li>
              <li>attempt to gain unauthorized access to the website, accounts, systems, or data;</li>
              <li>interfere with website functionality or security;</li>
              <li>upload malicious code, malware, or harmful content;</li>
              <li>misuse forms, meeting requests, referral systems, or other website features; or</li>
              <li>copy, reproduce, modify, or exploit Tech Decoder's website content or intellectual property without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">14. Intellectual Property</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Unless otherwise agreed in writing, Tech Decoder retains ownership of its pre-existing code, frameworks, libraries, processes, templates, tools, methods, know-how, reusable components, and internal systems.</li>
              <li>Client-provided content and materials remain the Client's property, subject to the rights necessary for Tech Decoder to perform the Project.</li>
              <li>Ownership or licensing of the final Project deliverables will be determined by the applicable Project agreement, quotation, or scope.</li>
              <li>Third-party software, fonts, images, APIs, libraries, plugins, and other third-party materials may remain subject to their respective licenses and terms.</li>
              <li>Tech Decoder may not grant rights to third-party materials that it does not own.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">15. Third-Party Services</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Projects may depend on third-party services such as hosting providers, domain registrars, payment gateways, APIs, software platforms, analytics services, communication platforms, or other external providers.</li>
              <li>Tech Decoder is not responsible for outages, policy changes, pricing changes, limitations, suspensions, security incidents, or failures caused by third-party providers.</li>
              <li>Additional third-party charges may be the responsibility of the Client where applicable.</li>
              <li>Changes to third-party services may require Project modifications, additional work, or additional charges.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">16. Communication</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder may communicate with Clients through WhatsApp, website notifications, email, or other contact methods provided by the Client.</li>
              <li>Clients are responsible for keeping their contact information accurate and accessible.</li>
              <li>Official confirmations, approvals, payment-related communications, Project updates, and meeting confirmations may be delivered through the communication channel specified by Tech Decoder.</li>
              <li>The Client should retain relevant communication and confirmations relating to their Project.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">17. Confidentiality</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Both parties should use reasonable care when handling confidential information shared in connection with a Project.</li>
              <li>Confidential information should not be disclosed to third parties except where required to perform the Project, required by law, or otherwise authorized.</li>
              <li>Information that is already publicly available, independently developed, or lawfully obtained from another source may not be considered confidential.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">18. Data and Privacy</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder may collect and process information necessary to operate the website, communicate with Users, process Projects, manage payments, provide support, and operate the referral and meeting systems.</li>
              <li>Personal information will be handled in accordance with the applicable Privacy Policy.</li>
              <li>Users should not submit sensitive personal information unless it is reasonably necessary for the requested service and the website specifically requests it.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">19. Project Cancellation or Termination</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder may suspend or terminate a Project where the Client materially breaches these Terms, fails to make required payments, provides unlawful materials, engages in abusive conduct, or otherwise prevents reasonable completion of the Project.</li>
              <li>The Client may request cancellation, but cancellation does not automatically create a right to a refund.</li>
              <li>Amounts relating to work already performed, resources already committed, or non-refundable third-party expenses may remain payable, subject to applicable law and the specific Project agreement.</li>
              <li>Any cancellation or termination should be communicated through an official communication channel.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">20. Acceptance and Approvals</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Client approval of a design, feature, milestone, proposal, or deliverable indicates that the Client has reviewed and accepted the relevant item for the applicable stage.</li>
              <li>Once an item has been approved, later requests to substantially change the approved direction may be treated as additional work.</li>
              <li>Tech Decoder may request written or digital confirmation for important approvals.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">21. Disclaimer</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder will use reasonable skill and care in providing its services.</li>
              <li>Tech Decoder does not guarantee that every subjective expectation, preference, or desired outcome will be achieved unless it forms part of the specifically documented and agreed Project Requirements.</li>
              <li>Tech Decoder does not guarantee uninterrupted availability of third-party services or platforms.</li>
              <li>Estimated timelines are dependent on Project scope, Client cooperation, payments, approvals, and external dependencies.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">22. Limitation of Liability</h2>
            <p className="mb-2">To the maximum extent permitted by applicable law, Tech Decoder will not be liable for indirect, incidental, consequential, special, or unforeseeable losses arising from the use of its website or services.</p>
            <p className="mb-2">Nothing in these Terms limits liability that cannot legally be limited or excluded under applicable law.</p>
            <p>Any additional limitation of liability applicable to a particular Project may be specified in the Project agreement.</p>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">23. Force Majeure</h2>
            <p className="mb-2">Tech Decoder will not be responsible for delays or failure to perform caused by circumstances beyond its reasonable control, including natural disasters, government actions, internet or infrastructure failures, widespread service outages, war, civil unrest, strikes, or major failures of third-party services.</p>
            <p>Tech Decoder will make reasonable efforts to resume affected services as soon as practical.</p>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">24. Changes to Services and Terms</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tech Decoder may update its website, services, pricing, policies, referral rules, and these Terms from time to time.</li>
              <li>Updated Terms will apply from the stated effective date unless otherwise required by applicable law.</li>
              <li>Project-specific terms already agreed with a Client may continue to govern that Project where expressly stated.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">25. Severability & No Waiver</h2>
            <p className="mb-2">If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision will be modified or removed to the minimum extent necessary, while the remaining provisions will continue to apply to the extent permitted by law.</p>
            <p>Failure by Tech Decoder to enforce any provision of these Terms immediately does not constitute a waiver of its right to enforce that provision later.</p>
          </section>

          <section>
            <h2 className="text-xl text-on-surface font-semibold mb-3">26. Contact</h2>
            <p className="mb-2">For questions regarding these Terms, Projects, payments, referrals, or meetings, Users may contact Tech Decoder through the official contact methods provided on the website.</p>
            <p>
              <strong>Tech Decoder</strong><br />
              Email: techdecoderlab@gmail.com<br />
              WhatsApp: +91 8275270901<br />
            </p>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
