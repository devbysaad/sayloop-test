import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

// ── Create and return socket instance ─────────────────
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports:       ['websocket'],
      autoConnect:      false,
      reconnection:     true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const connectSocket  = () => getSocket().connect();
export const disconnectSocket = () => { if (socket) { socket.disconnect(); socket = null; } };

export default getSocket;
