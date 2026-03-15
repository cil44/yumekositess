import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

const commandCategories = [
  {
    name: "Economy",
    commands: [
      { name: ".bal", description: "Check balance" },
      { name: ".dep", description: "Deposit coins" },
      { name: ".with", description: "Withdraw coins" },
      { name: ".give", description: "Transfer coins" },
      { name: ".daily", description: "Claim daily reward" },
      { name: ".lucky", description: "Try luck for rewards" },
      { name: ".rob", description: "Attempt robbery" },
      { name: ".top", description: "Global leaderboard" },
    ],
  },
  {
    name: "Casino Games",
    commands: [
      { name: ".slots", description: "Slot machine game" },
      { name: ".dice", description: "Dice betting" },
      { name: ".blk", description: "Blackjack" },
      { name: ".cf", description: "Coinflip" },
    ],
  },
  {
    name: "Shop & Inventory",
    commands: [
      { name: ".shop", description: "View shop items" },
      { name: ".buy", description: "Buy an item" },
      { name: ".sell", description: "Sell an item" },
      { name: ".inv", description: "Check inventory" },
    ],
  },
  {
    name: "Pets System",
    commands: [
      { name: ".pets", description: "View your pets" },
      { name: ".phunt", description: "Hunt for new pets" },
      { name: ".battle", description: "Battle with pets" },
    ],
  },
  {
    name: "Social & Profile",
    commands: [
      { name: ".profile", description: "View user profile" },
      { name: ".team invite", description: "Invite to team" },
      { name: ".setcolor", description: "Set profile color" },
      { name: ".setbg", description: "Set profile background" },
    ],
  },
  {
    name: "Utility",
    commands: [
      { name: ".help", description: "Show help menu" },
      { name: ".stat", description: "Show bot statistics" },
    ],
  },
];

export function CommandShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>("Economy");

  const filteredCategories = commandCategories.map((category) => ({
    ...category,
    commands: category.commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.commands.length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          Bot <span className="text-primary">Commands</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore all available commands for Yumeko.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Commands Accordion */}
      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              key={category.name}
              className="bg-surface border border-white/5 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className="w-full px-6 py-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
              >
                <h3 className="font-serif text-xl font-semibold text-primary">
                  {category.name}
                </h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform duration-300",
                    openCategory === category.name ? "rotate-180" : ""
                  )}
                />
              </button>

              <AnimatePresence>
                {openCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.commands.map((cmd) => (
                        <div
                          key={cmd.name}
                          className="flex flex-col p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors group"
                        >
                          <span className="font-mono text-primary font-bold mb-1 group-hover:text-white transition-colors">
                            {cmd.name}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {cmd.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No commands found.
          </div>
        )}
      </div>
    </div>
  );
}
