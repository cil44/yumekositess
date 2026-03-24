import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles, MoreVertical, BookHeart, Map } from "lucide-react";
import { config } from "@/src/config";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Commands", path: "/commands" },
    { name: "Privacy", path: "/privacy" },
    { name: "TOS", path: "/tos" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary transition-colors">
            <img
              src={config.botAvatar}
              alt={config.botName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-serif text-xl font-bold tracking-wider text-white group-hover:text-primary transition-colors flex items-center gap-2">
            {config.botName}
            <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                location.pathname === link.path ? "text-primary" : "text-gray-400"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
          <a
            href={config.inviteURL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-background hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 font-medium text-sm"
          >
            Invite Bot
          </a>

          {/* More Menu (3 dots) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              title="More"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                >
                  <Link
                    to="/diary"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <BookHeart className="w-4 h-4 text-pink-400" />
                    Dev Diary
                  </Link>
                  <Link
                    to="/journey"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <Map className="w-4 h-4 text-emerald-400" />
                    Yumeko's Journey
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    location.pathname === link.path ? "text-primary" : "text-gray-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href={config.inviteURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-center px-5 py-3 rounded-xl bg-primary text-background font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              >
                Invite Bot
              </a>

              {/* Mobile Extra Links */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-4">
                <Link
                  to="/diary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <BookHeart className="w-5 h-5 text-pink-400" />
                  Dev Diary
                </Link>
                <Link
                  to="/journey"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <Map className="w-5 h-5 text-emerald-400" />
                  Yumeko's Journey
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
