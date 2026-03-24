import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Compass, MessageCircle, Shield, Bell, User, Settings, ShieldAlert,
  LogOut
} from "lucide-react";
import { auth, db, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";

// Sub-components
import { SocialHome } from "./components/SocialHome";
import { SocialExplore } from "./components/SocialExplore";
import { SocialChat } from "./components/SocialChat";
import { SocialGuild } from "./components/SocialGuild";
import { SocialNotifications } from "./components/SocialNotifications";
import { SocialProfile } from "./components/SocialProfile";
import { SocialSettings } from "./components/SocialSettings";
import { SocialAdmin } from "./components/SocialAdmin";
import { AuthScreen } from "./components/AuthScreen";

export type TabType = 'home' | 'explore' | 'chat' | 'guild' | 'notifications' | 'profile' | 'settings' | 'admin';

export interface YumekoUser {
  uid: string;
  username: string;
  bio: string;
  photoURL: string;
  coverURL: string;
  role: 'user' | 'admin';
  stats: {
    likes: number;
    shares: number;
    followers: number;
  };
  badges: string[];
  activity: {
    posts: number;
    comments: number;
    shares: number;
  };
}

export function YumekoSocial() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [yumekoUser, setYumekoUser] = useState<YumekoUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create YumekoUser profile
        const userRef = doc(db, "yumeko_users", currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            // Check if dev login
            const isDev = currentUser.email === "AyumeeDEV###DEV" || currentUser.email === "ayumeedev@yumeko.com" || currentUser.email === "cyliaa1411@gmail.com";
            
            let defaultUsername = currentUser.displayName || "Anonymous Gambler";

            const newUser: YumekoUser = {
              uid: currentUser.uid,
              username: defaultUsername,
              bio: "Feeling lucky today 🍀",
              photoURL: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
              coverURL: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1200&auto=format&fit=crop", // Casino theme
              role: isDev ? 'admin' : 'user',
              stats: { likes: 0, shares: 0, followers: 0 },
              badges: isDev ? ['DEV'] : [],
              activity: { posts: 0, comments: 0, shares: 0 }
            };
            await setDoc(userRef, newUser);
            setYumekoUser(newUser);
            if (isDev) setActiveTab('admin');
          } else {
            const data = docSnap.data() as YumekoUser;
            
            // Auto-upgrade existing dev account if needed
            let needsUpdate = false;
            const updatedData = { ...data };
            
            if (currentUser.email === "cyliaa1411@gmail.com") {
              if (data.role !== 'admin') {
                updatedData.role = 'admin';
                if (!updatedData.badges.includes('DEV')) {
                  updatedData.badges.push('DEV');
                }
                needsUpdate = true;
              }
            }

            if (needsUpdate) {
              await setDoc(userRef, updatedData);
              setYumekoUser(updatedData);
            } else {
              setYumekoUser(data);
            }

            if (updatedData.role === 'admin' && activeTab === 'home') {
              setActiveTab('admin');
            }
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `yumeko_users/${currentUser.uid}`);
        }
      } else {
        setYumekoUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Realtime listener for user profile updates (badges, stats)
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "yumeko_users", user.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setYumekoUser(docSnap.data() as YumekoUser);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `yumeko_users/${user.uid}`);
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050000]">
        <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !yumekoUser) {
    return <AuthScreen />;
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'guild', icon: Shield, label: 'Guild' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (yumekoUser.role === 'admin') {
    navItems.push({ id: 'admin', icon: ShieldAlert, label: 'Admin Panel' });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <SocialHome currentUser={yumekoUser} />;
      case 'explore': return <SocialExplore currentUser={yumekoUser} />;
      case 'chat': return <SocialChat currentUser={yumekoUser} />;
      case 'guild': return <SocialGuild currentUser={yumekoUser} />;
      case 'notifications': return <SocialNotifications currentUser={yumekoUser} />;
      case 'profile': return <SocialProfile currentUser={yumekoUser} profileUser={yumekoUser} />;
      case 'settings': return <SocialSettings currentUser={yumekoUser} />;
      case 'admin': return yumekoUser.role === 'admin' ? <SocialAdmin currentUser={yumekoUser} /> : <SocialHome currentUser={yumekoUser} />;
      default: return <SocialHome currentUser={yumekoUser} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#050000] text-gray-200 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-full min-h-[calc(100vh-5rem)]">
        
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 border-r border-red-900/30 bg-[#0a0000]/80 backdrop-blur-xl p-4 flex flex-col gap-2 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="mb-8 px-4 py-2">
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              YUMEKO SOCIAL
            </h1>
          </div>

          <div className="flex-grow flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-950/50 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.15)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-red-900/30">
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-950/30 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow relative overflow-hidden bg-gradient-to-br from-[#0a0000] to-[#050000]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          <div className="h-full overflow-y-auto p-4 md:p-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
