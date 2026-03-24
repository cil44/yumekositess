import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Search, Edit2, Check, X, Users, MessageSquare, Award, Shield } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, orderBy, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { YumekoUser } from "../index";
import { Post } from "./SocialHome";
import { BADGE_COLORS, Badge } from "./Badges";

const ADMIN_BADGES = [
  'Fans No.1', 'Fans No.2', 'Fans No.3', 'Fans No.4', 'Fans No.5',
  'Fans No.6', 'Fans No.7', 'Fans No.8', 'Fans No.9', 'Fans No.10',
  'Fans Fanatic', 'MOD', 'ADM', 'DEV', 'TEAM', 'POPULAR'
];

export function SocialAdmin({ currentUser }: { currentUser: YumekoUser }) {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState<YumekoUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // User editing state
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editStats, setEditStats] = useState({ likes: 0, shares: 0, followers: 0 });
  const [editBadges, setEditBadges] = useState<string[]>([]);
  const [newBadge, setNewBadge] = useState("");

  // Post editing state
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostStats, setEditPostStats] = useState({ likes: 0, shares: 0 });

  const fetchData = async () => {
    try {
      const uq = query(collection(db, "yumeko_users"));
      const usnap = await getDocs(uq);
      setUsers(usnap.docs.map(doc => ({ ...doc.data() } as YumekoUser)));

      const pq = query(collection(db, "yumeko_posts"), orderBy("createdAt", "desc"));
      const psnap = await getDocs(pq);
      setPosts(psnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, "admin_fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveStats = async (uid: string) => {
    try {
      const oldUser = users.find(u => u.uid === uid);
      await updateDoc(doc(db, "yumeko_users", uid), {
        "stats.likes": editStats.likes,
        "stats.shares": editStats.shares,
        "stats.followers": editStats.followers,
        "badges": editBadges,
      });
      
      // Check if new badges were added to send notification
      if (oldUser) {
        const addedBadges = editBadges.filter(b => !oldUser.badges.includes(b));
        for (const badge of addedBadges) {
          await addDoc(collection(db, `yumeko_users/${uid}/notifications`), {
            type: 'badge',
            message: `🏆 your badge upgraded to ${badge}`,
            read: false,
            createdAt: serverTimestamp()
          });
        }
      }

      setUsers(users.map(u => u.uid === uid ? { ...u, stats: editStats, badges: editBadges } : u));
      setEditingUser(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_users/${uid}`);
    }
  };

  const handleSavePostStats = async (id: string) => {
    try {
      await updateDoc(doc(db, "yumeko_posts", id), {
        "stats.likes": editPostStats.likes,
        "stats.shares": editPostStats.shares,
      });
      setPosts(posts.map(p => p.id === id ? { ...p, stats: editPostStats } : p));
      setEditingPost(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_posts/${id}`);
    }
  };

  const seedOfficialGuilds = async () => {
    setLoading(true);
    try {
      const officialGuilds = [
        {
          id: "yumeko_badge",
          name: "Yumeko Badge",
          description: "A special community for fans who love collecting badges, showing support, and joining fun events.",
          creatorId: "system",
          members: [currentUser.uid],
          memberCount: 89267,
          isOfficial: true,
          createdAt: serverTimestamp()
        },
        {
          id: "yumeko_fans",
          name: "Yumeko Fans",
          description: "The main guild for all Yumeko lovers, a place to chat casually and stay updated with the latest news.",
          creatorId: "system",
          members: [currentUser.uid],
          memberCount: 73346,
          isOfficial: true,
          createdAt: serverTimestamp()
        }
      ];

      for (const guild of officialGuilds) {
        await setDoc(doc(db, "yumeko_guilds", guild.id), guild);
      }
      alert("Official Guilds seeded successfully!");
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "yumeko_guilds_seed");
    } finally {
      setLoading(false);
    }
  };

  const seedCommunity = async () => {
    setLoading(true);
    try {
      const fakeUsers: YumekoUser[] = [
        {
          uid: "fake_user_1",
          username: "Rizky Pratama",
          bio: "Pecinta Yumeko garis keras! Bot terbaik yang pernah ada! ❤️",
          photoURL: "https://picsum.photos/seed/user1/200",
          coverURL: "https://picsum.photos/seed/cover1/800/200",
          role: 'user',
          stats: { likes: 1250, shares: 450, followers: 890 },
          badges: ['Fans No.1', 'POPULAR'],
          activity: { posts: 45, comments: 120, shares: 30 }
        },
        {
          uid: "fake_user_2",
          username: "Andi Wijaya",
          bio: "Casino adalah hidupku. Yumeko adalah ratuku. 🎰",
          photoURL: "https://picsum.photos/seed/user2/200",
          coverURL: "https://picsum.photos/seed/cover2/800/200",
          role: 'user',
          stats: { likes: 3400, shares: 1200, followers: 2500 },
          badges: ['Fans No.2', 'Fans Fanatic'],
          activity: { posts: 88, comments: 340, shares: 150 }
        },
        {
          uid: "fake_user_3",
          username: "Siti Aminah",
          bio: "Koleksi badge itu hobi! 🏆",
          photoURL: "https://picsum.photos/seed/user3/200",
          coverURL: "https://picsum.photos/seed/cover3/800/200",
          role: 'user',
          stats: { likes: 890, shares: 120, followers: 450 },
          badges: ['Fans No.5'],
          activity: { posts: 12, comments: 80, shares: 10 }
        },
        {
          uid: "fake_user_4",
          username: "Budi Santoso",
          bio: "Coding dan Yumeko. Kombinasi maut. 💻",
          photoURL: "https://picsum.photos/seed/user4/200",
          coverURL: "https://picsum.photos/seed/cover4/800/200",
          role: 'user',
          stats: { likes: 450, shares: 80, followers: 230 },
          badges: ['DEV'],
          activity: { posts: 5, comments: 45, shares: 5 }
        },
        {
          uid: "fake_user_5",
          username: "Dewi Lestari",
          bio: "Yumeko lucu banget sih. 😍",
          photoURL: "https://picsum.photos/seed/user5/200",
          coverURL: "https://picsum.photos/seed/cover5/800/200",
          role: 'user',
          stats: { likes: 2100, shares: 890, followers: 1500 },
          badges: ['Fans No.3', 'POPULAR'],
          activity: { posts: 67, comments: 230, shares: 90 }
        }
      ];

      const fakePosts = [
        {
          authorId: "fake_user_1",
          authorName: "Rizky Pratama",
          authorPhoto: "https://picsum.photos/seed/user1/200",
          authorBadges: ['Fans No.1', 'POPULAR'],
          text: "Sumpah, Yumeko bot terbaik! Fitur ekonominya seru banget. ❤️",
          mood: 100,
          createdAt: serverTimestamp(),
          stats: { likes: 45, shares: 12, comments: 5 }
        },
        {
          authorId: "fake_user_2",
          authorName: "Andi Wijaya",
          authorPhoto: "https://picsum.photos/seed/user2/200",
          authorBadges: ['Fans No.2', 'Fans Fanatic'],
          text: "Bisa tambahin game Poker gak? Pasti makin rame! 🎰",
          mood: 80,
          createdAt: serverTimestamp(),
          stats: { likes: 120, shares: 45, comments: 23 }
        },
        {
          authorId: "fake_user_3",
          authorName: "Siti Aminah",
          authorPhoto: "https://picsum.photos/seed/user3/200",
          authorBadges: ['Fans No.5'],
          text: "Gimana caranya dapet badge 'Fans No.1'? Pengen banget! 🏆",
          mood: 70,
          createdAt: serverTimestamp(),
          stats: { likes: 34, shares: 5, comments: 12 }
        },
        {
          authorId: "fake_user_4",
          authorName: "Budi Santoso",
          authorPhoto: "https://picsum.photos/seed/user4/200",
          authorBadges: ['DEV'],
          text: "Ada API buat Yumeko gak ya? Mau coba bikin dashboard sendiri. 💻",
          mood: 60,
          createdAt: serverTimestamp(),
          stats: { likes: 12, shares: 2, comments: 8 }
        },
        {
          authorId: "fake_user_5",
          authorName: "Dewi Lestari",
          authorPhoto: "https://picsum.photos/seed/user5/200",
          authorBadges: ['Fans No.3', 'POPULAR'],
          text: "Avatarnya gemoy banget. Tambahin emote dong! 😍",
          mood: 90,
          createdAt: serverTimestamp(),
          stats: { likes: 89, shares: 34, comments: 15 }
        },
        {
          authorId: "fake_user_1",
          authorName: "Rizky Pratama",
          authorPhoto: "https://picsum.photos/seed/user1/200",
          authorBadges: ['Fans No.1', 'POPULAR'],
          text: "Baru aja menang 1M di blackjack! Yumeko emang hoki! 🃏",
          mood: 100,
          createdAt: serverTimestamp(),
          stats: { likes: 67, shares: 23, comments: 8 }
        },
        {
          authorId: "fake_user_3",
          authorName: "Siti Aminah",
          authorPhoto: "https://picsum.photos/seed/user3/200",
          authorBadges: ['Fans No.5'],
          text: "Akhirnya dapet badge pertama! Seneng banget! ✨",
          mood: 95,
          createdAt: serverTimestamp(),
          stats: { likes: 45, shares: 10, comments: 4 }
        },
        {
          authorId: "fake_user_2",
          authorName: "Andi Wijaya",
          authorPhoto: "https://picsum.photos/seed/user2/200",
          authorBadges: ['Fans No.2', 'Fans Fanatic'],
          text: "Request: Tambahin role 'High Roller' buat yang punya saldo > 1B! 💰",
          mood: 85,
          createdAt: serverTimestamp(),
          stats: { likes: 230, shares: 89, comments: 45 }
        }
      ];

      // Add users
      for (const user of fakeUsers) {
        await setDoc(doc(db, "yumeko_users", user.uid), user);
      }

      // Add posts
      for (const post of fakePosts) {
        await addDoc(collection(db, "yumeko_posts"), post);
      }

      alert("Community seeded successfully!");
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "yumeko_community_seed");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.uid.includes(searchTerm)
  );

  const filteredPosts = posts.filter(p => 
    p.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(255,0,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-950/50 rounded-2xl border border-red-900/50">
              <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                ADMIN PANEL
              </h2>
              <p className="text-gray-400 text-sm">God mode activated. Edit stats and badges manually.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={seedOfficialGuilds}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> Seed Official Guilds
            </button>
            <button 
              onClick={seedCommunity}
              className="px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-500/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Seed Community
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-red-900/30 pb-4">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'users' ? 'bg-red-900/50 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-red-900/50 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <MessageSquare className="w-4 h-4" /> Posts
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-red-900/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-4">
            {filteredUsers.map(u => (
              <div key={u.uid} className="bg-black/40 border border-red-900/20 rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={u.photoURL} alt={u.username} className="w-12 h-12 rounded-full border border-red-900/50" referrerPolicy="no-referrer" />
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {u.username}
                        {u.badges && u.badges.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {u.badges.map(b => <Badge key={b} name={b} />)}
                          </div>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">{u.uid}</p>
                    </div>
                  </div>

                  {editingUser === u.uid ? (
                    <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Likes</label>
                        <input 
                          type="number" 
                          value={editStats.likes} 
                          onChange={e => setEditStats({...editStats, likes: parseInt(e.target.value) || 0})}
                          className="w-20 bg-black border border-red-900/50 rounded p-1 text-white text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Shares</label>
                        <input 
                          type="number" 
                          value={editStats.shares} 
                          onChange={e => setEditStats({...editStats, shares: parseInt(e.target.value) || 0})}
                          className="w-20 bg-black border border-red-900/50 rounded p-1 text-white text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Followers</label>
                        <input 
                          type="number" 
                          value={editStats.followers} 
                          onChange={e => setEditStats({...editStats, followers: parseInt(e.target.value) || 0})}
                          className="w-20 bg-black border border-red-900/50 rounded p-1 text-white text-sm"
                        />
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <button onClick={() => handleSaveStats(u.uid)} className="p-2 bg-green-900/50 hover:bg-green-800/50 text-green-400 rounded-lg transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingUser(null)} className="p-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex gap-6 text-center">
                        <div>
                          <div className="text-lg font-bold text-white">{u.stats.likes}</div>
                          <div className="text-[10px] uppercase text-gray-500">Likes</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{u.stats.shares}</div>
                          <div className="text-[10px] uppercase text-gray-500">Shares</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{u.stats.followers}</div>
                          <div className="text-[10px] uppercase text-gray-500">Followers</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingUser(u.uid);
                          setEditStats(u.stats);
                          setEditBadges(u.badges || []);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Badge Editor */}
                {editingUser === u.uid && (
                  <div className="mt-4 pt-4 border-t border-red-900/30 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Award className="w-4 h-4" /> Manage Badges
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editBadges.map(b => (
                        <div key={b} className="flex items-center gap-1 bg-black/50 rounded-full pl-2 pr-1 py-1 border border-red-900/30">
                          <Badge name={b} />
                          <button 
                            onClick={() => setEditBadges(editBadges.filter(badge => badge !== b))}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={newBadge} 
                        onChange={e => setNewBadge(e.target.value)}
                        className="bg-black border border-red-900/50 rounded-lg p-2 text-white text-sm"
                      >
                        <option value="">Select badge to add...</option>
                        {ADMIN_BADGES.filter(b => !editBadges.includes(b)).map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => {
                          if (newBadge && !editBadges.includes(newBadge)) {
                            setEditBadges([...editBadges, newBadge]);
                            setNewBadge("");
                          }
                        }}
                        disabled={!newBadge}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800/50 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(p => (
              <div key={p.id} className="bg-black/40 border border-red-900/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <img src={p.authorPhoto} alt={p.authorName} className="w-10 h-10 rounded-full border border-red-900/50" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm">{p.authorName}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{p.text}</p>
                  </div>
                </div>

                {editingPost === p.id ? (
                  <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Likes</label>
                      <input 
                        type="number" 
                        value={editPostStats.likes} 
                        onChange={e => setEditPostStats({...editPostStats, likes: parseInt(e.target.value) || 0})}
                        className="w-20 bg-black border border-red-900/50 rounded p-1 text-white text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase text-gray-500 font-bold">Shares</label>
                      <input 
                        type="number" 
                        value={editPostStats.shares} 
                        onChange={e => setEditPostStats({...editPostStats, shares: parseInt(e.target.value) || 0})}
                        className="w-20 bg-black border border-red-900/50 rounded p-1 text-white text-sm"
                      />
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button onClick={() => handleSavePostStats(p.id)} className="p-2 bg-green-900/50 hover:bg-green-800/50 text-green-400 rounded-lg transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingPost(null)} className="p-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{p.stats?.likes || 0}</div>
                        <div className="text-[10px] uppercase text-gray-500">Likes</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{p.stats?.shares || 0}</div>
                        <div className="text-[10px] uppercase text-gray-500">Shares</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingPost(p.id);
                        setEditPostStats(p.stats || { likes: 0, shares: 0 });
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
