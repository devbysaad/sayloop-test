import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * connectSocket
 *
 * ROOT CAUSE FIX:
 * Previously all sockets fell back to the same mock user (dbUserId:6) because:
 *   - token was passed as undefined (saga only provided userId, not token)
 *   - server had no clerkId to fall back on
 *   - server used a hardcoded shared test clerkId for EVERYONE
 *
 * Now we pass BOTH token AND clerkId in the handshake:
 *   - token  → server verifies via Clerk JWT (most secure, production path)
 *   - clerkId → server does a direct DB lookup (dev fallback, still per-user)
 *
 * This guarantees each real user gets their OWN socket.dbUserId.
 */
export const connectSocket = (
  _userId: number,
  token: string | null,
  clerkId?: string | null,
): Socket => {
  if (socket?.connected) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000', {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
    auth: {
      // Only send non-empty values — empty strings cause confusing
      // JWT validation errors on the server
      ...(token ? { token } : {}),
      ...(clerkId ? { clerkId } : {}),
    },
  });

  socket.connect();
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};