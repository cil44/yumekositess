import { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, Lock, BadgeCheck } from "lucide-react";
import { config } from "@/src/config";

export function DevDiary() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(36893);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10"
      >
        {/* Author Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <img 
              src={config.botAvatar} 
              alt="YumekoDev" 
              className="w-14 h-14 rounded-full border-2 border-primary/30 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              YumekoDev 
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold uppercase tracking-wider">
                Dev
              </span>
            </h2>
            <p className="text-sm text-gray-400 font-mono">@yumekodev</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="space-y-4 text-gray-200 leading-relaxed text-[15px] md:text-base font-medium">
          <p>hyy, I'm YumekoDev 👋</p>
          <p>at the beginning, I created Yumeko simply because of my hobby and a little obsession:)</p>
          <p>even though I don't have a team or friends helping me, with my ambition, Yumeko slowly became what it is today 🫶</p>
          <p>for me, this is still an experiment... because I want the things I create to match my own expectations :&gt;</p>
          <p>I hope you feel comfortable using Yumeko and enjoy it :3</p>
          <p>with your support and appreciation, I'll be even more motivated to keep improving and do my best for Yumeko 🩶</p>
          <p>maybe right now many of you don't know Yumeko yet hehe</p>
          <p>I rarely promote Yumeko because I'm not very good with words, and sometimes people might think "ah... this bot is probably not good"</p>
          <p>also, most servers I joined don't allow promotion 🥹</p>
          <p>but... I'll keep waiting<br/>I believe Yumeko will be known by many people someday</p>
          <p>I just hope when that day comes, my passion for Yumeko is still as strong 😌</p>
        </div>

        {/* Footer / Date */}
        <div className="mt-10 mb-6 pb-6 border-b border-white/10">
          <p className="text-sm text-gray-400 font-mono flex flex-col gap-1">
            <span>Indonesian — 24 March 2026</span>
          </p>
        </div>

        {/* Interactions */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-6 md:gap-8">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all duration-300 ${liked ? 'text-pink-500 scale-105' : 'text-gray-400 hover:text-pink-400 hover:scale-105'}`}
            >
              <Heart className={`w-6 h-6 md:w-7 md:h-7 transition-colors ${liked ? 'fill-current' : ''}`} />
              <span className="font-semibold text-sm md:text-base">{likes.toLocaleString()}</span>
            </button>
            
            <div className="flex items-center gap-2 text-red-400/80 cursor-not-allowed group" title="Comments restricted">
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
              <span className="font-semibold text-sm md:text-base flex items-center gap-1.5">
                Restricted <Lock className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>

            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105">
              <Share2 className="w-6 h-6 md:w-7 md:h-7" />
              <span className="font-semibold text-sm md:text-base">2,317</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
