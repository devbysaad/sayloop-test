/**
 * src/hooks/useAuthInit.ts
 *
 * Syncs the Clerk user with the backend DB on first load.
 * BUG FIXED: was using axios directly hitting wrong URL/port.
 * Now uses axiosInstance which has the correct baseURL from .env.
 */
import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axiosInstance from '../lib/axiosInstance';

export const useAuthInit = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const syncedRef = useRef(false); // prevent double-sync in StrictMode

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;
        if (syncedRef.current) return;

        const syncUser = async () => {
            try {
                // Get the Clerk JWT — this is the correct way, not localStorage
                const token = await getToken();
                const response = await axiosInstance.post(
                    '/api/users/sync',
                    {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress ?? '',
                    }
                );

                const dbUser = response.data.data;
                if (dbUser?.id) {
                    localStorage.setItem('db_user_id', dbUser.id.toString());
                }
                if (token) {
                    localStorage.setItem('clerk_token', token);
                }

                syncedRef.current = true;
            } catch (err) {
                console.error('[useAuthInit] Failed to init auth:', err);
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user, getToken]);
};