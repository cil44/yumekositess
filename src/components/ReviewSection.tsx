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
  { id: "1", userName: "Budi Santoso", rating: 5, comment: "Anjirr gw kira bakal ribet ternyata gampang juga co", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: "2", userName: "Sarah", rating: 5, comment: "Aku baru coba bentar tapi lucu juga gamenya 😻", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "3", userName: "Rizky", rating: 5, comment: "Sriusss ini botnya bgsss 👍", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  { id: "4", userName: "Alex", rating: 5, comment: "I like bots that are simple like this", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "5", userName: "Dinda", rating: 5, comment: "Aku suka sih yang command nya gk ribet gini 😍", createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
  { id: "6", userName: "Fajar", rating: 4, comment: "Gw kira bakal pusing pakainya, ternyata gampang banget", createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
  { id: "7", userName: "Maya", rating: 5, comment: "Aku baru coba tapi seru juga 😋", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "8", userName: "John", rating: 5, comment: "Seems like a nice project, keep it up!", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: "9", userName: "Andi", rating: 5, comment: "Srius ini enak dipakai rame rame", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  { id: "10", userName: "Putri", rating: 5, comment: "Gw suka konsep bot kayak gini, unik", createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
  { id: "11", userName: "Kevin", rating: 5, comment: "I tried a few commands and it works well", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: "12", userName: "Siska", rating: 5, comment: "Ak tadi iseng coba eh ternyata oke juga", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
  { id: "13", userName: "Bimo", rating: 4, comment: "Anjirr lumayan juga buat hiburan server", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
  { id: "14", userName: "Emily", rating: 5, comment: "Could be fun with friends in a server", createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
  { id: "15", userName: "Rian", rating: 5, comment: "Aku kira bot biasa ternyata ada game juga 😭", createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) },
  { id: "16", userName: "David", rating: 5, comment: "The help menu makes it easy to learn, nice job", createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
  { id: "17", userName: "Tika", rating: 5, comment: "Srius gw gk nyangka bakal semudah ini", createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000) },
  { id: "18", userName: "Chris", rating: 5, comment: "This looks promising, will definitely use it more", createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000) },
  { id: "19", userName: "Lina", rating: 5, comment: "Aku masih baru di discord tapi gk bingung pakainya 🥰", createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000) },
  { id: "20", userName: "Hadi", rating: 5, comment: "Gw bakal coba pakai di server gw nanti", createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000) },
  { id: "21", userName: "Sarah", rating: 5, comment: "I like the idea behind this bot", createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000) },
  { id: "22", userName: "Ferry", rating: 5, comment: "Anjirr ini bikin server jadi lebih hidup", createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000) },
  { id: "23", userName: "Dewi", rating: 5, comment: "Aku suka tampilannya juga 😍", createdAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000) },
  { id: "24", userName: "Mark", rating: 5, comment: "Definitely worth trying, recommended!", createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000) },
  { id: "25", userName: "Yuni", rating: 5, comment: "Srius ini patut dicoba sih", createdAt: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000) },
  { id: "26", userName: "Gani", rating: 5, comment: "Bgsss menurut gw 👍👍", createdAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000) },
  { id: "27", userName: "Jessica", rating: 5, comment: "This bot could become popular, good luck!", createdAt: new Date(Date.now() - 155 * 24 * 60 * 60 * 1000) }
];

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
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
        userAvatar: user.photoURL || undefined,
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

  const displayReviews = [...INITIAL_REVIEWS as Review[], ...reviews];

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
                  <UserAvatar name={review.userName} src={review.userAvatar} />
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
                        {review.createdAt?.toDate ? getRelativeTime(review.createdAt.toDate()) : getRelativeTime(new Date(review.createdAt))}
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
