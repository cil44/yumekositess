import React, { useState, useEffect, useRef } from "react";
import { YumekoUser } from "../index";
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { Send, Users, Plus, ArrowLeft, Shield } from "lucide-react";
import { Badge, calculateAutoBadges } from "./Badges";

interface Guild {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  memberCount?: number;
  isOfficial?: boolean;
  createdAt: any;
}

interface GuildMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  senderBadges?: string[];
  text: string;
  createdAt: any;
}

export function SocialGuild({ currentUser }: { currentUser: YumekoUser }) {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [messages, setMessages] = useState<GuildMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newGuildName, setNewGuildName] = useState("");
  const [newGuildDesc, setNewGuildDesc] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "yumeko_guilds"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const gList: Guild[] = [];
      snapshot.forEach((doc) => {
        gList.push({ id: doc.id, ...doc.data() } as Guild);
      });
      
      // Auto-seed official guilds if none exist
      if (snapshot.empty) {
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
        for (const g of officialGuilds) {
          await setDoc(doc(db, "yumeko_guilds", g.id), g);
        }
      }

      setGuilds(gList);
      
      // Update selected guild if it changes
      if (selectedGuild) {
        const updated = gList.find(g => g.id === selectedGuild.id);
        if (updated) setSelectedGuild(updated);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, "yumeko_guilds");
    });
    return () => unsub();
  }, [selectedGuild?.id]);

  useEffect(() => {
    if (!selectedGuild) return;

    const q = query(
      collection(db, `yumeko_guilds/${selectedGuild.id}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: GuildMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as GuildMessage);
      });
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `yumeko_guilds/${selectedGuild.id}/messages`);
    });

    return () => unsub();
  }, [selectedGuild]);

  const handleCreateGuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim()) return;

    try {
      await addDoc(collection(db, "yumeko_guilds"), {
        name: newGuildName.trim(),
        description: newGuildDesc.trim(),
        creatorId: currentUser.uid,
        members: [currentUser.uid],
        createdAt: serverTimestamp()
      });
      setIsCreating(false);
      setNewGuildName("");
      setNewGuildDesc("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "yumeko_guilds");
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    try {
      await updateDoc(doc(db, "yumeko_guilds", guildId), {
        members: arrayUnion(currentUser.uid)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_guilds/${guildId}`);
    }
  };

  const handleLeaveGuild = async (guildId: string) => {
    try {
      await updateDoc(doc(db, "yumeko_guilds", guildId), {
        members: arrayRemove(currentUser.uid)
      });
      setSelectedGuild(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_guilds/${guildId}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGuild) return;

    const msgText = newMessage.trim();
    setNewMessage("");

    const autoBadges = calculateAutoBadges(currentUser.activity?.posts || 0, currentUser.activity?.comments || 0, currentUser.activity?.shares || 0);
    const allBadges = [...(currentUser.badges || []), ...autoBadges];

    try {
      await addDoc(collection(db, `yumeko_guilds/${selectedGuild.id}/messages`), {
        senderId: currentUser.uid,
        senderName: currentUser.username,
        senderPhoto: currentUser.photoURL,
        senderBadges: allBadges,
        text: msgText,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `yumeko_guilds/${selectedGuild.id}/messages`);
    }
  };

  if (isCreating) {
    return (
      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Guild</h2>
        </div>
        <form onSubmit={handleCreateGuild} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Guild Name</label>
            <input
              type="text"
              required
              value={newGuildName}
              onChange={(e) => setNewGuildName(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
              placeholder="e.g. High Rollers"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={newGuildDesc}
              onChange={(e) => setNewGuildDesc(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 resize-none h-24"
              placeholder="What is this guild about?"
            />
          </div>
          <button
            type="submit"
            disabled={!newGuildName.trim()}
            className="w-full py-3 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)] disabled:opacity-50 transition-all"
          >
            Create Guild
          </button>
        </form>
      </div>
    );
  }

  if (!selectedGuild) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" /> Guilds
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500/30 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>

        <div className="grid gap-4">
          {guilds.map(g => {
            const isMember = g.members.includes(currentUser.uid);
            return (
              <div key={g.id} className="p-5 bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {g.name}
                    {(g.isOfficial || g.name === "Yumeko Badge" || g.name === "Yumeko Fans") && <Shield className="w-4 h-4 text-red-500 fill-red-500/20" />}
                    <span className="text-xs font-normal px-2 py-1 bg-black/50 rounded-full text-gray-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {
                        g.name === "Yumeko Badge" ? (89267 + g.members.length).toLocaleString() : 
                        g.name === "Yumeko Fans" ? (73346 + g.members.length).toLocaleString() : 
                        g.isOfficial ? (g.memberCount || 0).toLocaleString() : 
                        g.members.length
                      }
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{g.description}</p>
                </div>
                <div>
                  {isMember ? (
                    <button
                      onClick={() => setSelectedGuild(g)}
                      className="px-6 py-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all whitespace-nowrap"
                    >
                      Enter Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGuild(g.id)}
                      className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all whitespace-nowrap"
                    >
                      Join Guild
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {guilds.length === 0 && (
            <div className="text-center text-gray-500 py-10">No guilds found. Be the first to create one!</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.05)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-red-900/30 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedGuild(null)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" /> {selectedGuild.name}
            </div>
            <div className="text-xs text-gray-400">
              {selectedGuild.name === "Yumeko Badge" ? (89267 + selectedGuild.members.length).toLocaleString() : 
               selectedGuild.name === "Yumeko Fans" ? (73346 + selectedGuild.members.length).toLocaleString() : 
               selectedGuild.isOfficial ? (selectedGuild.memberCount || 0).toLocaleString() : 
               selectedGuild.members.length} members
            </div>
          </div>
        </div>
        <button
          onClick={() => handleLeaveGuild(selectedGuild.id)}
          className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/80 border border-red-900/50 text-red-400 hover:text-white rounded-lg text-xs font-medium transition-all"
        >
          Leave
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.uid;
          const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {showHeader ? (
                  <img src={msg.senderPhoto} alt={msg.senderName} className="w-8 h-8 rounded-full border border-red-900/30 object-cover mt-1 flex-shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 flex-shrink-0"></div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {showHeader && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs text-gray-500">{msg.senderName}</span>
                      {msg.senderBadges && msg.senderBadges.length > 0 && (
                        <div className="flex gap-1">
                          {msg.senderBadges.slice(0, 2).map((b, i) => <Badge key={`${b}-${i}`} name={b} />)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`rounded-2xl p-3 ${isMe ? 'bg-red-900/80 text-white rounded-tr-none' : 'bg-gray-900/80 text-gray-200 rounded-tl-none border border-red-900/20'}`}>
                    <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-red-900/30 bg-black/40">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message guild..."
            className="flex-grow bg-black/50 border border-red-900/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
