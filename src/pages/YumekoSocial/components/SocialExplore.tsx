import { useState, useEffect } from "react";
import { YumekoUser } from "../index";
import { db } from "@/src/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { Search, Compass, Users, ArrowLeft } from "lucide-react";
import { SocialProfile } from "./SocialProfile";
import { Badge, calculateAutoBadges } from "./Badges";

export function SocialExplore({ currentUser }: { currentUser: YumekoUser }) {
  const [users, setUsers] = useState<YumekoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<YumekoUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "yumeko_users"));
        const snap = await getDocs(q);
        const fetchedUsers = snap.docs.map(doc => ({ ...doc.data() } as YumekoUser));
        setUsers(fetchedUsers.filter(u => u.uid !== currentUser.uid)); // Exclude self
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "yumeko_users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser.uid]);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedUser) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Explore
        </button>
        <SocialProfile currentUser={currentUser} profileUser={selectedUser} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-black text-white tracking-tight">Explore Users</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by name or bio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/50 border border-red-900/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => {
            const autoBadges = calculateAutoBadges(user.activity?.posts || 0, user.activity?.comments || 0, user.activity?.shares || 0);
            const allBadges = [...(user.badges || []), ...autoBadges];
            
            return (
              <div 
                key={user.uid}
                onClick={() => setSelectedUser(user)}
                className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,0,0,0.05)] hover:border-red-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={user.photoURL} 
                    alt={user.username} 
                    className="w-16 h-16 rounded-full border-2 border-red-900/50 object-cover group-hover:border-red-500 transition-colors"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate text-lg">{user.username}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{user.bio || "No bio yet."}</p>
                    
                    {allBadges.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {allBadges.slice(0, 3).map((badge, i) => (
                          <Badge key={`${badge}-${i}`} name={badge} />
                        ))}
                        {allBadges.length > 3 && (
                          <span className="text-[10px] text-gray-500 font-bold px-1">+{allBadges.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6 pt-4 border-t border-red-900/20">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{user.stats?.likes || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{user.stats?.followers || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Followers</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-black/30 rounded-3xl border border-red-900/20">
              <Users className="w-12 h-12 mx-auto mb-4 text-red-900/50" />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
