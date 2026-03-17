import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, X, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/Button";

const PRICE_LIST = [
  { coins: "5.000.000", price: "Rp. 7.000" },
  { coins: "10.000.000", price: "Rp. 10.000" },
  { coins: "25.000.000", price: "Rp. 15.000" },
  { coins: "50.000.000", price: "Rp. 20.000" },
  { coins: "150.000.000", price: "Rp. 45.000" },
];

export function BuyCoinSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Buy Coins
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface border border-white/10 rounded-3xl p-8 max-w-lg w-full"
            >
              {/* Content Wrapper */}
              <div className="relative z-10">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Price List</h2>
                
                <div className="space-y-4 mb-8">
                  {PRICE_LIST.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white font-bold">{item.coins}</span>
                      <span className="text-primary font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mb-8">
                  <a href="https://t.me/haiyumee" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-[#0088cc] hover:bg-[#0077b5]">
                      <Send className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                  </a>
                  <a href="https://discord.com/users/1398634587277496444" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4]">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discord
                    </Button>
                  </a>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 mb-4 text-sm">Scan QR for Payment</p>
                  <img 
                    src="https://i.imgur.com/swpLchh.png" 
                    alt="QR Code Payment" 
                    className="w-full max-w-[250px] rounded-xl mx-auto border-4 border-primary object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-gray-500 text-xs mt-4">Contact admin with payment proof</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
