import { motion } from "motion/react";
import { config } from "@/src/config";

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">
          Privacy <span className="text-primary">Policy</span>
        </h1>

        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-secondary">
          <p className="text-sm text-gray-500 mb-8">Last Updated: March 2026</p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-6 leading-relaxed">
            Welcome to {config.botName}. We are committed to protecting your personal information and your right to privacy.
            If you have any questions or concerns about this privacy notice or our practices with regard to your personal
            information, please contact us at {config.emails[0]}.
          </p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4 leading-relaxed">
            We collect personal information that you voluntarily provide to us when you register on the Services,
            express an interest in obtaining information about us or our products and Services, when you participate
            in activities on the Services, or otherwise when you contact us.
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Discord User ID and Username</li>
            <li>Server IDs where the bot is present</li>
            <li>Command usage data and interaction logs</li>
            <li>In-game economy balances and inventory</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-6 leading-relaxed">
            We use personal information collected via our Services for a variety of business purposes described below.
            We process your personal information for these purposes in reliance on our legitimate business interests,
            in order to enter into or perform a contract with you, with your consent, and/or for compliance with our
            legal obligations.
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To manage user accounts and provide our services.</li>
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To enforce our terms, conditions, and policies.</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="mb-6 leading-relaxed">
            We have implemented appropriate technical and organizational security measures designed to protect the
            security of any personal information we process. However, despite our safeguards and efforts to secure your
            information, no electronic transmission over the Internet or information storage technology can be guaranteed
            to be 100% secure.
          </p>

          <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-6 leading-relaxed">
            If you have questions or comments about this notice, you may email us at {config.emails[0]} or contact
            our support server via Discord.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
