import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const MatchmakingScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { waitingMessage, topic } = useSelector((s: any) => s.session);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes db { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-10px);opacity:1} }
        .spin-ring { animation: spin 2.5s linear infinite; }
        .d1{animation:db 1.3s ease infinite 0s}
        .d2{animation:db 1.3s ease infinite .18s}
        .d3{animation:db 1.3s ease infinite .36s}
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ fontFamily: "'Nunito', sans-serif", background: '#fffbf5' }}>
        <div className="w-full max-w-md text-center">

          {/* Spinner */}
          <div className="relative w-32 h-32 mx-auto mb-9">
            <div className="spin-ring absolute inset-0 rounded-full border-4 border-dashed border-amber-300" />
            <div className="absolute inset-4 rounded-full flex items-center justify-center text-5xl"
              style={{ background: 'linear-gradient(135deg,#fef3c7,#fed7aa)', border: '2px solid #fcd34d' }}>
              🔍
            </div>
          </div>

          {topic && (
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-5 py-2.5 mb-5">
              <span className="text-xl">{
                { 'Daily Life':'☀️', 'Travel & Culture':'✈️', 'Food & Cooking':'🍜',
                  'Movies & Music':'🎬', 'Technology':'💻', 'Sports & Fitness':'⚽' }[topic] ?? '🎯'
              }</span>
              <span className="text-amber-800 text-sm" style={{ fontWeight: 800 }}>{topic}</span>
            </div>
          )}

          <h2 className="text-3xl text-gray-800 mb-3" style={{ fontWeight: 900 }}>
            Finding your match...
          </h2>
          <p className="text-gray-500 text-base mb-7" style={{ fontWeight: 600 }}>
            {waitingMessage || 'Looking for someone to chat with!'}
          </p>

          <div className="flex justify-center gap-2.5 mb-8">
            <span className="d1 w-3.5 h-3.5 rounded-full inline-block bg-amber-400" />
            <span className="d2 w-3.5 h-3.5 rounded-full inline-block bg-orange-400" />
            <span className="d3 w-3.5 h-3.5 rounded-full inline-block bg-amber-400" />
          </div>

          <div className="bg-white rounded-2xl border-2 border-amber-100 px-6 py-4 mb-8 shadow-sm">
            <p className="text-gray-600 text-sm" style={{ fontWeight: 600 }}>
              ⚡ Average wait is just <strong className="text-gray-800">18 seconds</strong>
            </p>
          </div>

          <button
            onClick={() => { dispatch(sessionActions.disconnect()); dispatch(sessionActions.reset()); }}
            className="text-gray-400 hover:text-red-400 text-sm transition-colors"
            style={{ fontWeight: 700 }}
          >
            Cancel search
          </button>
        </div>
      </div>
    </>
  );
};

export default MatchmakingScreen;