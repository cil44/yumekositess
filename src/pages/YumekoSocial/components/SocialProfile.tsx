import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Edit3, Check, X, Camera, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { YumekoUser } from "../index";
import { Badge, calculateAutoBadges } from "./Badges";

export function SocialProfile({ currentUser, profileUser }: { currentUser: YumekoUser, profileUser: YumekoUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: profileUser.username,
    bio: profileUser.bio,
    photoURL: profileUser.photoURL,
    coverURL: profileUser.coverURL,
  });
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = currentUser.uid === profileUser.uid;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "yumeko_users", profileUser.uid), {
        username: editData.username,
        bio: editData.bio,
        photoURL: editData.photoURL,
        coverURL: editData.coverURL,
      });
      setIsEditing(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_users/${profileUser.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const autoBadges = calculateAutoBadges(profileUser.activity.posts, profileUser.activity.comments, profileUser.activity.shares);
  const allBadges = [...profileUser.badges, ...autoBadges];

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-red-950">
          <img 
            src={isEditing ? editData.coverURL : profileUser.coverURL} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0000] to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-4 relative z-10">
            <div className="relative">
              <img 
                src={isEditing ? editData.photoURL : profileUser.photoURL} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-[#0a0000] object-cover bg-black shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {isOwnProfile && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-full transition-all flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}

            {isEditing && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(255,0,0,0.3)] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : <><Check className="w-4 h-4" /> Save</>}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  className="w-full bg-black/30 border border-red-900/30 rounded-xl px-4 py-2 text-2xl font-bold text-white focus:outline-none focus:border-red-500/50"
                  placeholder="Username"
                />
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="w-full bg-black/30 border border-red-900/30 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-red-500/50 resize-none h-24"
                  placeholder="Bio"
                />
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={editData.photoURL}
                    onChange={(e) => setEditData({...editData, photoURL: e.target.value})}
                    className="w-full bg-black/30 border border-red-900/30 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-red-500/50"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editData.coverURL}
                    onChange={(e) => setEditData({...editData, coverURL: e.target.value})}
                    className="w-full bg-black/30 border border-red-900/30 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-red-500/50"
                    placeholder="https://example.com/cover.png"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
                    {profileUser.username}
                    <div className="flex gap-2 flex-wrap mt-1">
                      {allBadges.map((badge, i) => (
                        <Badge key={`${badge}-${i}`} name={badge} />
                      ))}
                    </div>
                  </h2>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {profileUser.bio}
                </p>
              </>
            )}

            {/* Stats (Numbers Only) */}
            <div className="flex gap-8 pt-6 border-t border-red-900/20">
              <div className="text-center">
                <div className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                  {profileUser.stats.likes.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                  {profileUser.stats.shares.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Shares</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                  {profileUser.stats.followers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
