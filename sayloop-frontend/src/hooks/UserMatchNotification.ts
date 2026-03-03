import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getActiveMatches, type Match } from '../lib/matchApi';

/**
 * Polls every 5s for matches where THIS user is the receiver (User 2)
 * and the status just flipped to 'accepted'.
 * Mount this globally so User 2 gets the modal no matter which page they're on.
 */
export function useMatchNotification(myUserId: number | null) {
  const { isSignedIn } = useUser();
  const [acceptedMatch, setAcceptedMatch] = useState<Match | null>(null);
  // Track IDs we've already shown so we don't re-fire
  const seenRef = useRef<Set<number>>(new Set());

  const poll = useCallback(async () => {
    if (!myUserId || !isSignedIn) return;
    try {
      const active = await getActiveMatches(myUserId);
      for (const m of active) {
        if (
          m.status === 'accepted' &&
          m.receiverId === myUserId &&
          !seenRef.current.has(m.id)
        ) {
          seenRef.current.add(m.id);
          setAcceptedMatch(m);
          break;
        }
      }
    } catch {
      // network hiccup — keep polling silently
    }
  }, [myUserId, isSignedIn]);

  useEffect(() => {
    if (!myUserId || !isSignedIn) return;
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [myUserId, isSignedIn, poll]);

  const clearAccepted = useCallback(() => setAcceptedMatch(null), []);

  return { acceptedMatch, clearAccepted };
}