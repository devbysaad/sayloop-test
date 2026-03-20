import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket } from '../redux/service/socket.service';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // If we're on `/match` or `/home`, we emit those page names.
    // Ensure '/' maps to 'landing' and not 'home' so unverified landing users don't show up in match queue
    const segment = location.pathname.split('/')[1];
    const page = segment ? segment : 'landing';
    const socket = getSocket();

    if (socket && socket.connected) {
      socket.emit('page:join', { page });
    }

    // Clean up when leaving page
    return () => {
      if (socket && socket.connected) {
        socket.emit('page:leave');
      }
    };
  }, [location.pathname]);
}
