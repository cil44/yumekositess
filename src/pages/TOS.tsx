import { motion } from "motion/react";
import { config } from "@/src/config";

export function TOS() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">
          Terms of <span className="text-primary">Service</span>
        </h1>

        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-secondary">
          <p className="text-sm text-gray-500 mb-8">Last Updated: March 2026</p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-6 leading-relaxed">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on
            behalf of an entity ("you") and {config.botName} ("we," "us" or "our"), concerning your access to and use
            of the {config.botName} Discord Bot and the {config.botName}.online website as well as any other media form,
            media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p className="mb-6 leading-relaxed">
            Unless otherwise indicated, the Site and the Bot are our proprietary property and all source code, databases,
            functionality, software, website designs, audio, video, text, photographs, and graphics on the Site
            (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks")
            are owned or controlled by us or licensed to us.
          </p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">3. User Representations</h2>
          <p className="mb-4 leading-relaxed">
            By using the Site or the Bot, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You are not under the age of 13.</li>
            <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">4. Prohibited Activities</h2>
          <p className="mb-6 leading-relaxed">
            You may not access or use the Site or the Bot for any purpose other than that for which we make the Site
            and the Bot available. The Site and the Bot may not be used in connection with any commercial endeavors
            except those that are specifically endorsed or approved by us.
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Make any unauthorized use of the Site or the Bot, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email.</li>
            <li>Use the Site or the Bot as part of any effort to compete with us or otherwise use the Site, the Bot, and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
            <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">5. Modifications and Interruptions</h2>
          <p className="mb-6 leading-relaxed">
            We reserve the right to change, modify, or remove the contents of the Site or the Bot at any time or for
            any reason at our sole discretion without notice. However, we have no obligation to update any information
            on our Site. We also reserve the right to modify or discontinue all or part of the Site or the Bot without
            notice at any time.
          </p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-6 leading-relaxed">
            In order to resolve a complaint regarding the Site or the Bot or to receive further information regarding
            use of the Site or the Bot, please contact us at {config.emails[0]}.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
