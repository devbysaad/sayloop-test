import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getActiveMatches, type Match } from '../lib/matchApi';

const BASE_INTERVAL = 15_000; // 15 seconds
const MAX_INTERVAL = 60_000;  // 60 seconds (backoff cap)
const SEEN_KEY = 'match_notification_seen_ids';

// ── Persist seen IDs in sessionStorage so they survive remounts ───────────────
function getSeenIds(): Set<number> {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function persistSeenId(id: number) {
  const seen = getSeenIds();
  seen.add(id);
  sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

/** Call this to prevent the notification from re-firing for a given match. */
export function markMatchSeen(matchId: number) {
  persistSeenId(matchId);
}

/**
 * Polls for matches where THIS user is the receiver
 * and the status just flipped to 'accepted'.
 * Mount this globally so the user gets the modal no matter which page they're on.
 *
 * Uses sessionStorage to track already-shown IDs (survives remounts / StrictMode).
 * Uses exponential backoff on errors to avoid 429 rate-limit floods.
 */
export function useMatchNotification(myUserId: number | null) {
  const { isSignedIn } = useUser();
  const [acceptedMatch, setAcceptedMatch] = useState<Match | null>(null);
  const delayRef = useRef(BASE_INTERVAL);

  const poll = useCallback(async () => {
    if (!myUserId || !isSignedIn) return;
    try {
      const active = await getActiveMatches(myUserId);
      delayRef.current = BASE_INTERVAL;
      const seen = getSeenIds();
      for (const m of active) {
        if (
          m.status === 'accepted' &&
          m.receiverId === myUserId &&
          !seen.has(m.id)
        ) {
          persistSeenId(m.id);
          setAcceptedMatch(m);
          break;
        }
      }
    } catch {
      delayRef.current = Math.min(delayRef.current * 2, MAX_INTERVAL);
    }
  }, [myUserId, isSignedIn]);

  useEffect(() => {
    if (!myUserId || !isSignedIn) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = (delay: number) => {
      timer = setTimeout(async () => {
        await poll();
        schedule(delayRef.current);
      }, delay);
    };
    schedule(3000);

    return () => clearTimeout(timer);
  }, [myUserId, isSignedIn, poll]);

  const clearAccepted = useCallback(() => setAcceptedMatch(null), []);

  return { acceptedMatch, clearAccepted };
}