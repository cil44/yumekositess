import { useState } from "react";
import { YumekoUser } from "../index";
import { db, auth } from "@/src/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { Settings, LogOut, Save, User, FileText } from "lucide-react";
import { signOut } from "firebase/auth";

export function SocialSettings({ currentUser }: { currentUser: YumekoUser }) {
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateDoc(doc(db, "yumeko_users", currentUser.uid), {
        username,
        bio
      });
      setMessage("Settings saved successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_users/${currentUser.uid}`);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-black text-white tracking-tight">Settings</h2>
      </div>

      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        <div className="space-y-6 max-w-md">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Your username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Bio
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none h-24"
              placeholder="Tell us about yourself"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm ${message.includes('success') ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
              {message}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={handleSave}
              disabled={saving || (!username.trim())}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>

            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-black border border-red-900/50 hover:bg-red-950/30 text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
