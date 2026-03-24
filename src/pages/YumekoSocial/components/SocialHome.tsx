import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Heart, Share2, MoreHorizontal, Trash2, Thermometer, Compass, MessageCircle } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { YumekoUser } from "../index";
import { Badge, calculateAutoBadges, checkBadgeUpgrade } from "./Badges";

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorBadges: string[];
  text: string;
  createdAt: any;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorBadges: string[];
  text: string;
  mood?: number;
  imageURL?: string;
  createdAt: any;
  stats: {
    likes: number;
    shares: number;
    comments?: number;
  };
}

export function SocialHome({ currentUser }: { currentUser: YumekoUser }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostMood, setNewPostMood] = useState(50);
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "yumeko_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      setPosts(fetched);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, "yumeko_posts");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!activeCommentPost) return;
    const q = query(collection(db, `yumeko_posts/${activeCommentPost}/comments`), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: PostComment[] = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() } as PostComment);
      });
      setComments(prev => ({ ...prev, [activeCommentPost]: fetched }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `yumeko_posts/${activeCommentPost}/comments`);
    });
    return () => unsub();
  }, [activeCommentPost]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setIsPosting(true);

    try {
      await addDoc(collection(db, "yumeko_posts"), {
        authorId: currentUser.uid,
        authorName: currentUser.username,
        authorPhoto: currentUser.photoURL,
        authorBadges: [...currentUser.badges, ...calculateAutoBadges(currentUser.activity.posts, currentUser.activity.comments, currentUser.activity.shares)],
        text: newPostText,
        mood: newPostMood,
        createdAt: serverTimestamp(),
        stats: { likes: 0, shares: 0, comments: 0 }
      });

      // Increment user post count
      const userRef = doc(db, "yumeko_users", currentUser.uid);
      
      const oldActivity = {
        posts: currentUser.activity?.posts || 0,
        comments: currentUser.activity?.comments || 0,
        shares: currentUser.activity?.shares || 0
      };
      const newActivity = { ...oldActivity, posts: oldActivity.posts + 1 };

      await updateDoc(userRef, {
        "activity.posts": increment(1)
      });
      
      await checkBadgeUpgrade(currentUser.uid, oldActivity, newActivity);

      setNewPostText("");
      setNewPostMood(50);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "yumeko_posts");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeletePost = async (postId: string, authorId: string) => {
    if (currentUser.uid !== authorId && currentUser.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, "yumeko_posts", postId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `yumeko_posts/${postId}`);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, "yumeko_posts", postId), {
        "stats.likes": increment(1)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_posts/${postId}`);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await updateDoc(doc(db, "yumeko_posts", postId), {
        "stats.shares": increment(1)
      });
      
      const userRef = doc(db, "yumeko_users", currentUser.uid);
      const oldActivity = {
        posts: currentUser.activity?.posts || 0,
        comments: currentUser.activity?.comments || 0,
        shares: currentUser.activity?.shares || 0
      };
      const newActivity = { ...oldActivity, shares: oldActivity.shares + 1 };

      await updateDoc(userRef, {
        "activity.shares": increment(1)
      });
      
      await checkBadgeUpgrade(currentUser.uid, oldActivity, newActivity);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_posts/${postId}`);
    }
  };

  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const autoBadges = calculateAutoBadges(currentUser.activity?.posts || 0, currentUser.activity?.comments || 0, currentUser.activity?.shares || 0);
      const allBadges = [...(currentUser.badges || []), ...autoBadges];

      await addDoc(collection(db, `yumeko_posts/${postId}/comments`), {
        authorId: currentUser.uid,
        authorName: currentUser.username,
        authorPhoto: currentUser.photoURL,
        authorBadges: allBadges,
        text: newCommentText,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, "yumeko_posts", postId), {
        "stats.comments": increment(1)
      });

      const userRef = doc(db, "yumeko_users", currentUser.uid);
      const oldActivity = {
        posts: currentUser.activity?.posts || 0,
        comments: currentUser.activity?.comments || 0,
        shares: currentUser.activity?.shares || 0
      };
      const newActivity = { ...oldActivity, comments: oldActivity.comments + 1 };

      await updateDoc(userRef, {
        "activity.comments": increment(1)
      });
      
      await checkBadgeUpgrade(currentUser.uid, oldActivity, newActivity);

      setNewCommentText("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `yumeko_posts/${postId}/comments`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Status/Post Creator */}
      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        <form onSubmit={handleCreatePost}>
          <div className="flex gap-4">
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border border-red-900/50 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-grow space-y-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What's on your mind? Feeling lucky? 🍀"
                className="w-full bg-black/30 border border-red-900/20 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none min-h-[100px]"
              />

              {/* Luck Meter / Mood Thermometer */}
              <div className="flex items-center gap-4 mt-4 bg-black/40 p-3 rounded-xl border border-red-900/20">
                <div className="p-2 bg-red-950/50 rounded-lg">
                  <Thermometer className={`w-5 h-5 ${newPostMood > 75 ? 'text-yellow-400' : newPostMood > 40 ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                    <span>Tilted 📉</span>
                    <span className="text-red-400">Luck Level: {newPostMood}%</span>
                    <span>Jackpot 🎰</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={newPostMood}
                    onChange={(e) => setNewPostMood(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-red-950 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-red-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  disabled={isPosting || !newPostText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(255,0,0,0.3)] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isPosting ? "Posting..." : <><Send className="w-4 h-4" /> Post</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img 
                    src={post.authorPhoto} 
                    alt={post.authorName} 
                    className="w-10 h-10 rounded-full border border-red-900/50 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{post.authorName}</span>
                      {post.authorBadges?.map(badge => (
                        <Badge key={badge} name={badge} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {post.createdAt?.toDate().toLocaleString() || "Just now"}
                    </span>
                  </div>
                </div>
                
                {(currentUser.uid === post.authorId || currentUser.role === 'admin') && (
                  <button 
                    onClick={() => handleDeletePost(post.id, post.authorId)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-gray-200 mb-4 whitespace-pre-wrap">
                {post.text}
              </div>

              {/* Display Mood Thermometer */}
              {post.mood !== undefined && (
                <div className="mb-4 flex items-center gap-3 bg-black/20 p-2.5 rounded-lg border border-red-900/10">
                  <Thermometer className={`w-4 h-4 ${post.mood > 75 ? 'text-yellow-400' : post.mood > 40 ? 'text-red-500' : 'text-blue-500'}`} />
                  <div className="flex-1 h-1.5 bg-red-950/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${post.mood > 75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : post.mood > 40 ? 'bg-gradient-to-r from-red-800 to-red-500' : 'bg-gradient-to-r from-blue-800 to-blue-500'}`}
                      style={{ width: `${post.mood}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 w-10 text-right">{post.mood}%</span>
                </div>
              )}

              {post.imageURL && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-red-900/30">
                  <img src={post.imageURL} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-red-900/20">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
                >
                  <Heart className="w-5 h-5 group-hover:fill-red-400/20" />
                  <span className="font-medium">{post.stats?.likes || 0}</span>
                </button>
                <button 
                  onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.stats?.comments || 0}</span>
                </button>
                <button 
                  onClick={() => handleShare(post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">{post.stats?.shares || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPost === post.id && (
                <div className="mt-4 pt-4 border-t border-red-900/20 space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {(comments[post.id] || []).map(comment => (
                      <div key={comment.id} className="flex gap-3 bg-black/20 p-3 rounded-xl">
                        <img 
                          src={comment.authorPhoto} 
                          alt={comment.authorName} 
                          className="w-8 h-8 rounded-full border border-red-900/30 object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-white text-sm">{comment.authorName}</span>
                            {comment.authorBadges?.slice(0, 2).map(badge => (
                              <Badge key={badge} name={badge} />
                            ))}
                            <span className="text-[10px] text-gray-500">
                              {comment.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    {(comments[post.id] || []).length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-grow bg-black/50 border border-red-900/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="p-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 hover:text-white rounded-xl disabled:opacity-50 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="inline-block p-4 rounded-full bg-red-950/30 mb-4">
              <Compass className="w-8 h-8 text-red-900" />
            </div>
            <p>No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
}
