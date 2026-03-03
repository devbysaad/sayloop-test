/**
 * Syncs the Clerk user with the backend DB on first load.
 * Also wires up the Clerk token getter for axiosInstance.
 *
 * Fix: Combined into a single useEffect so the token getter is
 * guaranteed to be set before syncUser is called — no race condition.
 *
 * Fix 2: Added retry with back-off when getToken() returns null
 * (common during OAuth redirect — Clerk session isn't ready yet).
 */
import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axiosInstance, { setTokenGetter } from '../lib/axiosInstance';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1500;

export const useAuthInit = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const syncedRef = useRef(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    // Wait until Clerk is fully loaded and user is signed in
    if (!isLoaded || !isSignedIn || !user) return;
    // Only sync once per session
    if (syncedRef.current) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const init = async () => {
      try {
        // 1. Wire up token getter FIRST — before any API call
        setTokenGetter(() => getToken());

        // 2. Verify we can actually get a token before calling the API
        const token = await getToken();
        if (!token) {
          retryCountRef.current += 1;
          if (retryCountRef.current <= MAX_RETRIES && !cancelled) {
            console.warn(
              `[useAuthInit] No token available yet — retrying (attempt ${retryCountRef.current}/${MAX_RETRIES})`
            );
            retryTimer = setTimeout(() => {
              if (!cancelled) init();
            }, RETRY_DELAY_MS);
          } else {
            console.error('[useAuthInit] Max retries reached — could not get Clerk token');
          }
          return;
        }

        // 3. Sync user to backend DB
        const response = await axiosInstance.post('/api/users/sync', {
          email: user.primaryEmailAddress?.emailAddress ?? '',
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          pfpSource: user.imageUrl ?? '',
        });

        const dbUser = response.data?.data;
        if (dbUser?.id) {
          localStorage.setItem('db_user_id', dbUser.id.toString());
        }

        syncedRef.current = true;
        retryCountRef.current = 0;
        console.log('[useAuthInit] User synced successfully:', dbUser?.id);
      } catch (err) {
        console.error('[useAuthInit] Failed to sync user:', err);

        // Retry on transient failures (network, 5xx) but not on permanent ones (400)
        const status = (err as any)?.response?.status;
        const isTransient = !status || status >= 500 || status === 429;
        if (isTransient && retryCountRef.current < MAX_RETRIES && !cancelled) {
          retryCountRef.current += 1;
          console.warn(
            `[useAuthInit] Retrying sync (attempt ${retryCountRef.current}/${MAX_RETRIES})`
          );
          retryTimer = setTimeout(() => {
            if (!cancelled) init();
          }, RETRY_DELAY_MS);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isLoaded, isSignedIn, user, getToken]);
};