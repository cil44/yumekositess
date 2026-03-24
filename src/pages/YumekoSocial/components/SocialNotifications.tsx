import { useState, useEffect } from "react";
import { YumekoUser } from "../index";
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-error-handler";
import { Bell, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export function SocialNotifications({ currentUser }: { currentUser: YumekoUser }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, `yumeko_users/${currentUser.uid}/notifications`),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notifs);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `yumeko_users/${currentUser.uid}/notifications`);
    });

    return () => unsub();
  }, [currentUser.uid]);

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, `yumeko_users/${currentUser.uid}/notifications`, notifId), {
        read: true
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `yumeko_users/${currentUser.uid}/notifications/${notifId}`);
    }
  };

  const markAllAsRead = async () => {
    notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-red-500" /> Notifications
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        <div className="divide-y divide-red-900/20">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-red-950/20'}`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {notif.type === 'badge' ? '🏆' : notif.type === 'chat' ? '💬' : '🔔'}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm ${notif.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                    {notif.message}
                  </p>
                  {notif.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.createdAt.toDate()).toLocaleString()}
                    </p>
                  )}
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
