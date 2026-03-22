import { motion } from "motion/react";
import { Gamepad2, Fish, Cat, Image as ImageIcon, BookOpen, ShoppingCart } from "lucide-react";

const features = [
  {
    id: "economy",
    title: "Economy & Gambling",
    description: "Play games, work, beg, form a team for bonus coins, gamble, scratch cards, and claim daily rewards!",
    commands: [".sl <amount>", ".blk <amount>", ".dice <amount>", ".cf <amount> h/t", ".bonus <amount>"],
    gif: "https://i.imgur.com/n3Jsb8w.mp4",
    icon: <Gamepad2 className="w-6 h-6 text-primary" />,
    reverse: false
  },
  {
    id: "fishing",
    title: "Fishing System",
    description: "Go fishing, check your fish collection, and sell them for coins!!",
    commands: [".fish"],
    gif: "https://i.imgur.com/9CdadyW.mp4",
    icon: <Fish className="w-6 h-6 text-primary" />,
    reverse: true
  },
  {
    id: "pets",
    title: "Pet Battles",
    description: "Level up your pets, check their stats, and engage in thrilling 2 vs 2 pet battles with other players!",
    commands: [".pet"],
    gif: "https://i.imgur.com/8pyV5gG.mp4",
    icon: <Cat className="w-6 h-6 text-primary" />,
    reverse: false
  },
  {
    id: "profile",
    title: "Aesthetic Profiles",
    description: "Set an aesthetic profile background with any image you like!",
    commands: [".setbg"],
    gif: "https://i.imgur.com/B1RAuVX.mp4",
    icon: <ImageIcon className="w-6 h-6 text-primary" />,
    reverse: true
  },
  {
    id: "help",
    title: "Help Menu",
    description: "Display all available commands and features in Yumeko Bot.",
    commands: [".help"],
    gif: "https://i.imgur.com/9fGdC11.mp4",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    reverse: false
  },
  {
    id: "shop",
    title: "Global Shop",
    description: "Explore the global shop to view and buy all items and pets available!",
    commands: [".shop"],
    gif: "https://i.imgur.com/zEw5MWz.mp4",
    icon: <ShoppingCart className="w-6 h-6 text-primary" />,
    reverse: true
  }
];

export function FeatureShowcase() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
          Endless <span className="text-primary">Activities</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience a wide variety of activities including games, working, team bonuses, pet battles, fishing, and more!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
      </div>

      <div className="space-y-20">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col gap-8 items-center ${feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.commands.map(cmd => (
                  <span key={cmd} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-primary">
                    {cmd}
                  </span>
                ))}
              </div>
            </div>

            {/* GIF Showcase */}
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface">
                {feature.gif.endsWith('.mp4') ? (
                  <video 
                    src={feature.gif} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <img 
                    src={feature.gif} 
                    alt={feature.title}
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
