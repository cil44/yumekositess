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
  { id: 1, user: "Yumaa", message: "Just won 20,000 coins in Slots! What a lucky strike!! 🎰", type: "win" },
  { id: 2, user: "Haiyumee (Dev)", message: "Sent 50,000 coins to Cici for free!!! Generous Dev! 🎁", type: "gift" },
  { id: 3, user: "Yerikho", message: "Won 2,000 coins in Dice! Feeling lucky!! 🎲", type: "win" },
  { id: 4, user: "Ji_Ryo", message: "Just cleared out the shop!! Total billionaire vibes!! 💰", type: "shop" },
  { id: 5, user: "Sultan_Bekasi", message: "Just hit the 100,000 coins Jackpot!! 🔥", type: "win" },
  { id: 6, user: "Ratu_Hoki", message: "Won 15,000 coins in Blackjack!! 🃏", type: "win" },
  { id: 7, user: "Haiyumee (Dev)", message: "Dropped 5,000 bonus coins to all active members! 🎊", type: "gift" },
  { id: 8, user: "Budi_Santoso", message: "Exchanged 50,000 coins for E-Wallet balance! ✅", type: "shop" },
  { id: 9, user: "Player_Pro", message: "Won 30,000 coins in Roulette!! 🎡", type: "win" },
  { id: 10, user: "Haiyumee (Dev)", message: "Gifted 2,500 coins to 'Anonym'! Enjoy!! 💸", type: "gift" },
  { id: 11, user: "Si_Paling_Hoki", message: "5x win streak in Dice!! Absolutely insane!! 🎲🔥", type: "win" },
  { id: 12, user: "RichGuy", message: "Just purchased the VIP Gold package! 👑", type: "shop" },
  { id: 13, user: "LuckyStrike", message: "Mega Win! Got 75,000 coins from Slots!! 🎰✨", type: "win" },
  { id: 14, user: "Haiyumee (Dev)", message: "Welcome 1000th member! 10,000 coins bonus sent!", type: "gift" },
  { id: 15, user: "Cuan_Terus", message: "Just withdrew 200,000 coins! Fast payout confirmed!! 🚀", type: "info" },
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
      case "win": return <Trophy className="w-4 h-4 text-yellow-400" />;
      case "gift": return <Gift className="w-4 h-4 text-pink-400" />;
      case "shop": return <ShoppingCart className="w-4 h-4 text-blue-400" />;
      default: return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-4 bg-background/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm pointer-events-auto relative overflow-hidden group"
          >
            {/* Premium Gradient Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              {getIcon(current.type)}
            </div>
            <div className="relative flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                  Live Feed
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-tighter">Live</span>
                </div>
              </div>
              <p className="text-[13px] font-medium text-white/90 leading-tight">
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
