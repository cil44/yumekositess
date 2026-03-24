import React from 'react';
import { db } from "@/src/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export const BADGE_COLORS: Record<string, string> = {
  'Fans No.1': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.2': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.3': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.4': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.5': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.6': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.7': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.8': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.9': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans No.10': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
  'Fans Fanatic': 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.8)] text-white',
  'MOD': 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] text-white',
  'ADM': 'bg-red-900 text-white border border-red-500',
  'DEV': 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] text-black',
  'TEAM': 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] text-white',
  'POPULAR': 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.6)]',
  'Bronze': 'bg-gradient-to-r from-amber-700 to-amber-900 text-white',
  'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-black',
  'Gold': 'bg-gradient-to-r from-yellow-300 to-yellow-600 text-black',
  'Platinum': 'bg-gray-100 shadow-[0_0_15px_rgba(243,244,246,0.8)] text-black',
  'Diamond': 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] text-white',
};

export const Badge: React.FC<{ name: string }> = ({ name }) => {
  const colorClass = BADGE_COLORS[name] || 'bg-gray-800 text-white border border-gray-600';
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colorClass}`}>
      {name}
    </span>
  );
}

export function calculateAutoBadges(posts: number, comments: number, shares: number): string[] {
  const badges: string[] = [];
  if (posts >= 250 && comments >= 250 && shares >= 250) badges.push('Diamond');
  else if (posts >= 70 && comments >= 70 && shares >= 70) badges.push('Platinum');
  else if (posts >= 60 && comments >= 60 && shares >= 60) badges.push('Gold');
  else if (posts >= 25 && comments >= 25) badges.push('Silver');
  else if (posts >= 3 && comments >= 3) badges.push('Bronze');
  return badges;
}

export async function checkBadgeUpgrade(userId: string, oldActivity: { posts: number, comments: number, shares: number }, newActivity: { posts: number, comments: number, shares: number }) {
  const oldBadges = calculateAutoBadges(oldActivity.posts, oldActivity.comments, oldActivity.shares);
  const newBadges = calculateAutoBadges(newActivity.posts, newActivity.comments, newActivity.shares);
  
  const newEarnedBadges = newBadges.filter(b => !oldBadges.includes(b));
  
  for (const badge of newEarnedBadges) {
    try {
      await addDoc(collection(db, `yumeko_users/${userId}/notifications`), {
        type: 'badge',
        message: `🏆 your badge upgraded to ${badge}`,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error("Failed to send badge notification:", error);
    }
  }
}
