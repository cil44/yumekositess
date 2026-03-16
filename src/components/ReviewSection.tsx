import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, LogIn, Send, User, Trash2 } from "lucide-react";
import { auth, db, googleProvider } from "@/src/lib/firebase";
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
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: any;
}

const INITIAL_REVIEWS = [
  {
    id: "1",
    userName: "Ayumee",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayumee",
    rating: 5,
    comment: "asli asik bgtt woiii",
    createdAt: new Date()
  },
  {
    id: "2",
    userName: "Kuroo",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kuroo",
    rating: 5,
    comment: "bot paling bgus si mnurutku😵command lengkap kalo bingung tnggal command .help udah ada tuh panduan nya",
    createdAt: new Date()
  },
  {
    id: "3",
    userName: "Vee",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vee",
    rating: 5,
    comment: "bisa bisa nya ni bot baru ada sekarang👊😭",
    createdAt: new Date()
  },
  {
    id: "4",
    userName: "Zenn",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zenn",
    rating: 5,
    comment: "lengkap banget udah gitu kalo klen masuk leaderboard frame nya bagus dishop juga bagus loh",
    createdAt: new Date()
  },
  {
    id: "5",
    userName: "Choco",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Choco",
    rating: 5,
    comment: "Gila sih ini bot casino paling gacor, auto kaya raya di discord 💸🔥",
    createdAt: new Date()
  },
  {
    id: "6",
    userName: "Neko",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neko",
    rating: 5,
    comment: "Sering-sering event ya min, seru bgt asli mainnya bareng temen se-server",
    createdAt: new Date()
  }
];

export function ReviewSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.error("Firestore error:", err);
      setError("Gagal memuat review. Pastikan Firebase sudah dikonfigurasi.");
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
        setError("Google login belum diaktifkan di Firebase Console. Silakan aktifkan di tab Authentication -> Sign-in method.");
      } else {
        setError("Gagal login dengan Google.");
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
        userAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment("");
      setNewRating(5);
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("Gagal mengirim review. Cek izin database (Firestore Rules).");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const displayReviews = reviews.length > 0 ? reviews : INITIAL_REVIEWS as Review[];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-32 relative z-10">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          User <span className="text-primary">Reviews</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Apa kata mereka tentang Yumeko Bot? Bagikan pengalamanmu juga!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sticky top-32">
            <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              Beri Rating
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {!user ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-6">Kamu harus login dengan Google untuk memberikan rating.</p>
                <Button onClick={handleLogin} className="w-full bg-white text-black hover:bg-gray-200 border-none">
                  <LogIn className="w-5 h-5" />
                  Login with Google
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-6 p-3 bg-white/5 rounded-2xl">
                  <img src={user.photoURL || ""} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary" />
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
                  <label className="block text-sm font-medium text-gray-400 mb-3">Komentar</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pengalamanmu..."
                    className="w-full bg-background border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-none"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Mengirim..." : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Review
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {displayReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-surface/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative group"
              >
                <div className="flex items-start gap-4">
                  <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full border border-white/10" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold">{review.userName}</h4>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-primary fill-current" : "text-gray-700"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed italic">"{review.comment}"</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {user && user.uid === review.userId && (
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500/50 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
