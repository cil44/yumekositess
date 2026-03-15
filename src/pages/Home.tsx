import { motion } from "motion/react";
import { ChevronDown, Sparkles, Zap, Globe, Gift, Terminal } from "lucide-react";
import { config } from "@/src/config";
import { Button } from "@/src/components/ui/Button";
import { CommandShowcase } from "@/src/components/CommandShowcase";

const features = [
  {
    icon: <Terminal className="w-6 h-6 text-primary" />,
    title: "50+ Commands",
    description: "Complete economy, casino, and social commands."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "24/7 Active",
    description: "Bot is always online without downtime."
  },
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "Global Economy",
    description: "Global economy system across servers."
  },
  {
    icon: <Gift className="w-6 h-6 text-primary" />,
    title: "Free Forever",
    description: "Free to use forever at no cost."
  }
];

export function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        </div>

        {/* Discord Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl mx-auto bg-surface rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
        >
          {/* Banner */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img
              src={config.botBanner}
              alt="Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-12 pt-4 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative -mt-24 md:-mt-32 mb-6 group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-surface shadow-[0_0_30px_rgba(255,215,0,0.3)] overflow-hidden bg-surface">
                <img
                  src={config.botAvatar}
                  alt={config.botName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Online Status Dot */}
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-[#23a559] border-4 border-surface rounded-full shadow-[0_0_15px_rgba(35,165,89,0.8)]" />
            </div>

            {/* Title & Tagline */}
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {config.botName}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 font-medium mb-10 max-w-2xl">
              {config.tagline}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <a href={config.inviteURL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg">
                  <Sparkles className="w-5 h-5" />
                  Invite me to server
                </Button>
              </a>
              <a href={config.supportServer} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg">
                  Support Server
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-primary/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Premium <span className="text-primary">Features</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-surface/50 backdrop-blur-sm border border-white/5 hover:border-primary/50 rounded-2xl p-8 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-background border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commands Section */}
      <section className="w-full px-6 py-32 relative z-10 bg-surface/10 border-t border-white/5">
        <CommandShowcase />
      </section>

      {/* Stats Section */}
      <section className="w-full bg-surface/30 border-y border-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { value: "50+", label: "Commands" },
            { value: "24/7", label: "Active" },
            { value: "Global", label: "Economy" },
            { value: "Free", label: "Forever" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="font-serif text-4xl md:text-6xl font-bold text-primary mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                {stat.value}
              </span>
              <span className="text-gray-400 font-medium tracking-widest uppercase text-sm">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
