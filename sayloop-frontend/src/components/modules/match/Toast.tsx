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
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl
        font-bold text-sm flex items-center gap-2 animate-fade-in-up
        ${type === 'error'
          ? 'bg-red-50 border-2 border-red-200 text-red-700'
          : 'bg-white border-2 border-green-200 text-green-700'}`}
    >
      <span>{type === 'error' ? '❌' : '✅'}</span>
      {message}
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 font-black">×</button>
    </div>
  );
};

export default Toast;