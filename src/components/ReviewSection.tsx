import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, LogIn, Send, User, Trash2, ChevronDown } from "lucide-react";
import { auth, db, googleProvider } from "@/src/lib/firebase";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Button } from "./ui/Button";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

function UserAvatar({ name, src }: { name: string; src?: string }) {
  const initials = name.charAt(0).toUpperCase();
  
  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  if (src && src.startsWith('http') && !src.includes('dicebear')) {
    return <img src={src} alt={name} className="w-12 h-12 rounded-full border border-white/10 object-cover" />;
  }

  return (
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border border-white/10"
      style={{ backgroundColor: getColor(name) }}
    >
      {initials}
    </div>
  );
}

const INITIAL_REVIEWS = [
  { id: "r1", userName: "RYUzeen", rating: 5, comment: "oii min bagi coin dong", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: "r2", userName: "oppay_mu88g", rating: 5, comment: "I'm from FB", createdAt: new Date(Date.now() - 9 * 1000) },
  { id: "r3", userName: "tyaraswis", rating: 5, comment: "udah gabung kak", createdAt: new Date(Date.now() - 5 * 60 * 1000) },
  { id: "r4", userName: "Jull_33", rating: 5, comment: "This bot is insanely good!", createdAt: new Date(Date.now() - 10 * 60 * 1000) },
  { id: "r5", userName: "𝕲𝖎𝖑𝖑𝖜𝖆𝖞𝖞", rating: 5, comment: "ini serius liaa lu yang buat?gelo", createdAt: new Date(Date.now() - 20 * 60 * 1000) },
  { id: "r6", userName: "Budi Santoso", rating: 5, comment: "Thought it would be complicated, but it's actually super easy to use.", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: "r7", userName: "Sarah", rating: 5, comment: "Just started playing, the game is so cute! 😻", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "r8", userName: "jjeee_389", rating: 5, comment: "Holy moly", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { id: "r9", userName: "𝖏𝖊𝖗𝖊𝖒𝖎𝖊", rating: 5, comment: "I'm addicted to playing this 😂", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "r10", userName: "gwtyan", rating: 4, comment: "Just joined, seems cool.", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: "r11", userName: "ilyjeee", rating: 5, comment: "Finally invited Yumeko to my server!", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
];

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSecs < 60) return `${diffInSecs} second`;
  if (diffInMins < 60) return `${diffInMins} minute`;
  if (diffInHours < 24) return `${diffInHours} hours`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function ReviewSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, "reviews");
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/operation-not-allowed") {
        setError("Google login is not enabled in Firebase Console. Please enable it in the Authentication -> Sign-in method tab.");
      } else {
        setError("Failed to login with Google.");
      }
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || undefined,
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment("");
      setNewRating(5);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, "reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const [displayReviews, setDisplayReviews] = useState<Review[]>([]);

  useEffect(() => {
    const allReviews = [...INITIAL_REVIEWS as Review[], ...reviews];
    // Fisher-Yates shuffle
    for (let i = allReviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allReviews[i], allReviews[j]] = [allReviews[j], allReviews[i]];
    }
    setDisplayReviews(allReviews);
  }, [reviews]);

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16 relative z-10">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          User <span className="text-primary">Reviews</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          What do they say about Yumeko Bot? Share your experience too!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
      </div>

      <div className="space-y-8">
        {/* Accordion for Reviews */}
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-6 py-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
          >
            <h3 className="font-serif text-xl font-semibold text-primary flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              Read User Reviews ({displayReviews.length})
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 max-h-[500px] overflow-y-auto space-y-4 bg-background/30">
                  {displayReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.5) }}
                      className="bg-surface/50 border border-white/5 rounded-xl p-5 relative group hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <UserAvatar name={review.userName} src={review.userAvatar} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-bold text-base truncate pr-2">{review.userName}</h4>
                            <div className="flex gap-0.5 flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-primary fill-current" : "text-gray-700"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 italic text-sm mb-2">"{review.comment}"</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {review.createdAt?.toDate ? getRelativeTime(review.createdAt.toDate()) : getRelativeTime(new Date(review.createdAt))}
                            </span>
                            {user && user.uid === review.userId && (
                              <button 
                                onClick={() => handleDelete(review.id)}
                                className="text-red-500/50 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Review Form */}
        <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-primary fill-current" />
            Write a Review
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {!user ? (
            <div className="text-center py-8 bg-background/50 rounded-2xl border border-white/5">
              <p className="text-gray-400 mb-6">You must login with Google to give a rating.</p>
              <Button onClick={handleLogin} className="bg-white text-black hover:bg-gray-200 border-none">
                <LogIn className="w-5 h-5 mr-2" />
                Login with Google
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-background/50 border border-white/5 rounded-2xl">
                <UserAvatar name={user.displayName || "Anonymous"} src={user.photoURL || undefined} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{user.displayName}</p>
                  <button type="button" onClick={handleLogout} className="text-xs text-gray-500 hover:text-primary transition-colors">Logout</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`transition-all duration-200 ${newRating >= star ? "text-primary scale-110" : "text-gray-600 hover:text-gray-400"}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your experience..."
                  className="w-full bg-background border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-none"
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Review
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
