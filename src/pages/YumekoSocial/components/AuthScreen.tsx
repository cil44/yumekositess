import React, { useState } from "react";
import { motion } from "motion/react";
import { LogIn, Mail, Lock, UserPlus } from "lucide-react";
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Handle specific dev login format requested by user
    let authEmail = email;
    if (email === "AyumeeDEV###DEV") {
      authEmail = "ayumeedev@yumeko.com";
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, authEmail, password);
      } else {
        await createUserWithEmailAndPassword(auth, authEmail, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#050000] p-4 font-sans text-gray-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/50 rounded-3xl p-8 shadow-[0_0_40px_rgba(255,0,0,0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
            YUMEKO SOCIAL
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Enter the exclusive community</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Email Address or Dev ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isLogin ? (
              <><LogIn className="w-5 h-5" /> Enter</>
            ) : (
              <><UserPlus className="w-5 h-5" /> Join</>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-red-900/30"></div>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-red-900/30"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            {isLogin ? "Don't have an account? Join now" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
