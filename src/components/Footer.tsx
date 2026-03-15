import { Link } from "react-router-dom";
import { config } from "@/src/config";
import { Mail, MessageCircle, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative z-10">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={config.botAvatar}
              alt={config.botName}
              className="w-10 h-10 rounded-full border border-primary/30"
              referrerPolicy="no-referrer"
            />
            <span className="font-serif text-2xl font-bold text-white tracking-wider">
              {config.botName}
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
            Yumeko is a global economy and casino Discord bot with a complete gaming system,
            leaderboard, and social features.
          </p>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/commands" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Commands
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/tos" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
            Support & Contact
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <Send className="w-4 h-4 text-primary" />
              <span>Admin Telegram: <a href={`https://${config.adminTelegram}`} target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-colors">{config.adminTelegram}</a></span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Admin Discord: <span className="text-white">{config.adminDiscord}</span></span>
            </li>
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <Mail className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex flex-col">
                {config.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="text-white hover:text-primary transition-colors">
                    {email}
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center relative z-10">
        <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">
          {config.footerText}
        </p>
      </div>
    </footer>
  );
}
