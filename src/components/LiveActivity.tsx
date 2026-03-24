import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Gift, ShoppingCart, TrendingUp, Coins } from "lucide-react";

interface Activity {
  id: number;
  message: string;
  type: "win" | "gift" | "shop" | "info";
  user: string;
}

const activities: Activity[] = [
  { id: 1, user: "RYUzeen", message: "Just won 20,000 coins in Slots! Insane luck!! 🎰", type: "win" },
  { id: 2, user: "Haiyumee (Dev)", message: "Sent 50,000 coins to Cici for free!!! Kind Dev! 🎁", type: "gift" },
  { id: 3, user: "oppay_mu88g", message: "Won 2,000 coins in Dice! Feeling lucky!! 🎲", type: "win" },
  { id: 4, user: "tyaraswis", message: "Just bought out the whole shop!! Billionaire vibes!! 💰", type: "shop" },
  { id: 5, user: "Sultan_Bekasi", message: "Just hit a 100,000 coins Jackpot!! 🔥", type: "win" },
  { id: 6, user: "Ratu_Hoki", message: "Won 15,000 coins in Blackjack!! 🃏", type: "win" },
  { id: 7, user: "Haiyumee (Dev)", message: "Giving away 5,000 bonus coins to all active members! 🎊", type: "gift" },
  { id: 8, user: "Budi_Santoso", message: "Just bought a Legendary Pet from the shop!! 🐉", type: "shop" },
  { id: 9, user: "Player_Pro", message: "Won 30,000 coins in Roulette!! 🎡", type: "win" },
  { id: 10, user: "Haiyumee (Dev)", message: "Gave 2,500 coins to 'Anonym'! Congratulations!! 💸", type: "gift" },
  { id: 11, user: "wenxtyy", message: "Just hit a Slot Jackpot of 8,777,935! Insane luck!! 🎰", type: "win" },
  { id: 12, user: "jjeee_389", message: "Just hit #1 on the leaderboard in my server! Let's go! 🏆", type: "win" },
  { id: 13, user: "𝖏𝖊𝖗𝖊𝖒𝖎𝖊", message: "Won Blackjack 5 times in a row! Talk about luck! 🃏", type: "win" },
];

export function LiveActivity() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500); // Wait for exit animation
    }, 5000); // Show each message for 5 seconds

    return () => clearInterval(interval);
  }, []);

  const current = activities[index];

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "win": return <Trophy className="w-3 h-3 text-yellow-400" />;
      case "gift": return <Gift className="w-3 h-3 text-pink-400" />;
      case "shop": return <ShoppingCart className="w-3 h-3 text-blue-400" />;
      default: return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-1.5 md:gap-2 bg-background/90 backdrop-blur-xl border border-white/10 p-1 md:p-1.5 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] max-w-[calc(100vw-1rem)] md:max-w-[200px] pointer-events-auto relative overflow-hidden group"
          >
            {/* Premium Gradient Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-md bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              {getIcon(current.type)}
            </div>
            <div className="relative flex flex-col gap-0">
              <div className="flex items-center gap-1">
                <span className="text-[5px] md:text-[6px] font-black uppercase tracking-[0.1em] text-primary">
                  Live
                </span>
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_3px_rgba(16,185,129,0.6)]" />
                </div>
              </div>
              <p className="text-[7px] md:text-[8px] font-medium text-white/90 leading-tight truncate max-w-[120px] md:max-w-[140px]">
                <span className="font-bold text-white">{current.user}</span>{" "}
                <span className="text-white/70">{current.message.replace(current.user, "").trim()}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
