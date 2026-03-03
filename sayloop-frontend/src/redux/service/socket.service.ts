import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * getOrCreateSocket
 *
 * Returns the existing connected socket or creates a new one.
 * Used by both match and session flows to share a single connection.
 */
export const getOrCreateSocket = (
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
      ...(token ? { token } : {}),
      ...(clerkId ? { clerkId } : {}),
    },
  });

  socket.connect();
  return socket;
};

/**
 * ensureConnected
 *
 * Returns a promise that resolves when the socket is connected.
 * Rejects after a timeout.
 */
export const ensureConnected = (sock: Socket, timeoutMs = 8000): Promise<void> => {
  if (sock.connected) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), timeoutMs);
    sock.once('connect', () => { clearTimeout(timeout); resolve(); });
    sock.once('connect_error', (e: Error) => { clearTimeout(timeout); reject(e); });
  });
};

/**
 * connectSocket  (backwards-compatible wrapper)
 */
export const connectSocket = (
  _userId: number,
  token: string | null,
  clerkId?: string | null,
): Socket => {
  return getOrCreateSocket(token, clerkId);
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};