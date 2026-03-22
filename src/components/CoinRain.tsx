import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface Coin {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export function CoinRain() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // Generate initial coins
    const generateCoins = () => {
      const newCoins: Coin[] = [];
      const numCoins = Math.floor(window.innerWidth / 50); // Adjust density based on screen width
      
      for (let i = 0; i < numCoins; i++) {
        newCoins.push({
          id: i,
          x: Math.random() * 100, // Random horizontal position (vw)
          y: -20 - Math.random() * 50, // Start above the screen
          size: 16 + Math.random() * 24, // Random size between 16px and 40px
          duration: 3 + Math.random() * 4, // Random fall duration
          delay: Math.random() * 5, // Random start delay
          rotation: Math.random() * 360, // Random initial rotation
        });
      }
      setCoins(newCoins);
    };

    generateCoins();

    // Regenerate on window resize to maintain density
    window.addEventListener('resize', generateCoins);
    return () => window.removeEventListener('resize', generateCoins);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute text-primary/30" // Adjust opacity here
          initial={{
            x: `${coin.x}vw`,
            y: `${coin.y}vh`,
            rotate: coin.rotation,
            opacity: 0
          }}
          animate={{
            y: '120vh', // Fall past the bottom of the screen
            rotate: coin.rotation + 360 * (Math.random() > 0.5 ? 1 : -1), // Spin while falling
            opacity: [0, 1, 1, 0] // Fade in and out
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: coin.size,
            height: coin.size,
          }}
        >
          <Coins size={coin.size} />
        </motion.div>
      ))}
    </div>
  );
}
