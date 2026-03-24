import React, { useState, useEffect, useRef } from "react";
import { YumekoUser } from "../index";
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, doc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { Send, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Badge, calculateAutoBadges } from "./Badges";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: any;
}

export function SocialChat({ currentUser }: { currentUser: YumekoUser }) {
  const [users, setUsers] = useState<YumekoUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<YumekoUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all users to chat with
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "yumeko_users"));
        const snapshot = await getDocs(q);
        const usersList: YumekoUser[] = [];
        snapshot.forEach((doc) => {
          if (doc.id !== currentUser.uid) {
            usersList.push(doc.data() as YumekoUser);
          }
        });
        setUsers(usersList);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "yumeko_users");
      }
    };
    fetchUsers();
  }, [currentUser.uid]);

  useEffect(() => {
    if (!selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
    const q = query(
      collection(db, `yumeko_chats/${chatId}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `yumeko_chats/${chatId}/messages`);
    });

    return () => unsub();
  }, [selectedUser, currentUser.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
    const msgText = newMessage.trim();
    setNewMessage("");

    try {
      // Ensure chat document exists
      await setDoc(doc(db, "yumeko_chats", chatId), {
        users: [currentUser.uid, selectedUser.uid],
        lastUpdated: serverTimestamp()
      }, { merge: true });

      // Add message
      await addDoc(collection(db, `yumeko_chats/${chatId}/messages`), {
        senderId: currentUser.uid,
        text: msgText,
        createdAt: serverTimestamp()
      });
      
      // Add notification for the recipient
      await addDoc(collection(db, `yumeko_users/${selectedUser.uid}/notifications`), {
        type: 'chat',
        message: `New message from ${currentUser.username}`,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `yumeko_chats/${chatId}/messages`);
    }
  };

  const handleSendImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !imageUrl.trim()) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
    const urlToSend = imageUrl.trim();
    setImageUrl("");
    setShowImageInput(false);

    try {
      await setDoc(doc(db, "yumeko_chats", chatId), {
        users: [currentUser.uid, selectedUser.uid],
        lastUpdated: serverTimestamp()
      }, { merge: true });

      await addDoc(collection(db, `yumeko_chats/${chatId}/messages`), {
        senderId: currentUser.uid,
        text: "",
        imageUrl: urlToSend,
        createdAt: serverTimestamp()
      });
      
      await addDoc(collection(db, `yumeko_users/${selectedUser.uid}/notifications`), {
        type: 'chat',
        message: `New image from ${currentUser.username}`,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `yumeko_chats/${chatId}/messages`);
    }
  };

  if (!selectedUser) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Private Chat</h2>
        <div className="grid gap-4">
          {users.map(u => (
            <button
              key={u.uid}
              onClick={() => setSelectedUser(u)}
              className="flex items-center gap-4 p-4 bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-2xl hover:bg-red-950/30 transition-all text-left"
            >
              <img src={u.photoURL} alt={u.username} className="w-12 h-12 rounded-full border border-red-900/50 object-cover" referrerPolicy="no-referrer" />
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {u.username}
                  {u.badges && u.badges.length > 0 && (
                    <div className="flex gap-1">
                      {u.badges.slice(0, 2).map((b, i) => <Badge key={`${b}-${i}`} name={b} />)}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400 truncate">{u.bio}</div>
              </div>
            </button>
          ))}
          {users.length === 0 && (
            <div className="text-center text-gray-500 py-10">No other users found.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.05)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-red-900/30 flex items-center gap-4 bg-black/40">
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={selectedUser.photoURL} alt={selectedUser.username} className="w-10 h-10 rounded-full border border-red-900/50 object-cover" referrerPolicy="no-referrer" />
        <div className="font-bold text-white flex items-center gap-2">
          {selectedUser.username}
          {selectedUser.badges && selectedUser.badges.length > 0 && (
            <div className="flex gap-1">
              {selectedUser.badges.slice(0, 2).map((b, i) => <Badge key={`${b}-${i}`} name={b} />)}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-3 ${isMe ? 'bg-red-900/80 text-white rounded-tr-none' : 'bg-gray-900/80 text-gray-200 rounded-tl-none border border-red-900/20'}`}>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Shared" className="rounded-xl mb-2 max-w-full" referrerPolicy="no-referrer" />
                )}
                {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-red-900/30 bg-black/40">
        {showImageInput && (
          <form onSubmit={handleSendImage} className="flex gap-2 mb-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL here..."
              className="flex-grow bg-black/50 border border-red-900/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
            />
            <button
              type="submit"
              disabled={!imageUrl.trim()}
              className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all"
            >
              Send Image
            </button>
            <button
              type="button"
              onClick={() => setShowImageInput(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
          </form>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
            title="Send Image URL"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
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
