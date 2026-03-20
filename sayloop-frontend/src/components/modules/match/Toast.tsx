import React, { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg font-black text-sm flex items-center gap-2"
      style={{
        background: type === 'error' ? '#FFF4EF' : '#F0FAF4',
        border: type === 'error' ? '1px solid rgba(232,72,12,0.25)' : '1px solid rgba(61,122,92,0.25)',
        color: type === 'error' ? '#E8480C' : '#3D7A5C',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <span>{type === 'error' ? '❌' : '✅'}</span>
      {message}
      <button onClick={onClose} className="ml-2 font-black hover:opacity-60 transition-opacity"
        style={{ color: 'inherit' }}>×</button>
    </div>
  );
};

export default Toast;