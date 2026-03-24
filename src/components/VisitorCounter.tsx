import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-error-handler';
import { Users } from 'lucide-react';

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const statsDoc = doc(db, 'stats', 'global');

    // Increment visitor count once per session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      const updateVisitorCount = async () => {
        try {
          const docSnap = await getDoc(statsDoc);
          if (docSnap.exists()) {
            const currentCount = docSnap.data().visitorCount || 0;
            // If for some reason it's less than 7800, we jump to 7800
            const newCount = Math.max(currentCount, 7800) + 1;
            await updateDoc(statsDoc, {
              visitorCount: newCount
            });
          } else {
            // Initialize with 7800 + 1 for first visitor
            await setDoc(statsDoc, {
              visitorCount: 7801
            });
          }
          sessionStorage.setItem('hasVisited', 'true');
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, 'stats/global');
        }
      };
      updateVisitorCount();
    }

    // Listen for real-time updates
    const unsubscribe = onSnapshot(statsDoc, (docSnap) => {
      if (docSnap.exists()) {
        const val = docSnap.data().visitorCount;
        setCount(val);
        
        // Force update if database value is still low (e.g. from previous version)
        if (val < 7800) {
          updateDoc(statsDoc, { visitorCount: 7800 }).catch(err => handleFirestoreError(err, OperationType.UPDATE, 'stats/global'));
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/global');
    });

    return () => unsubscribe();
  }, []);

  if (count === null) return null;

  // Ensure UI always shows at least 7800
  const finalCount = Math.max(count, 7800);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-400">
      <Users className="w-4 h-4 text-primary" />
      <span>Total Visitors: <span className="text-white font-mono">{finalCount.toLocaleString()}</span></span>
    </div>
  );
}
