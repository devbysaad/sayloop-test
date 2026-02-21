import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const MatchmakingScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { waitingMessage, topic } = useSelector((s: any) => s.session);

  const handleCancel = () => {
    dispatch(sessionActions.disconnect());
    dispatch(sessionActions.reset());
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white border border-stone-200 rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.06)]
                      w-full max-w-md px-10 py-14 flex flex-col items-center text-center relative overflow-hidden">

        {/* top green glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40
                        bg-green-100 rounded-full blur-3xl opacity-70 pointer-events-none" />

        {/* Ripple rings + icon */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-10">
          <span className="absolute w-28 h-28 rounded-full border-2 border-green-400 opacity-20 animate-ping" />
          <span className="absolute w-20 h-20 rounded-full border-2 border-green-400 opacity-30
                           animate-ping [animation-delay:400ms]" />
          <span className="absolute w-14 h-14 rounded-full border-2 border-green-500 opacity-50
                           animate-ping [animation-delay:800ms]" />
          <div className="relative z-10 w-12 h-12 rounded-full bg-green-600
                          flex items-center justify-center text-xl shadow-[0_4px_16px_rgba(22,163,74,0.35)]">
            🎯
          </div>
        </div>

        {/* Topic badge */}
        {topic && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200
                          rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-700">{topic}</span>
          </div>
        )}

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-2">
          Finding your match
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xs">
          {waitingMessage || 'Looking for someone with a different take on this topic…'}
        </p>

        {/* Bouncing dots */}
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>

        {/* Sliding progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden mb-8">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full
                          w-2/3 animate-[slide_2s_ease-in-out_infinite]
                          [animation:_slide_2s_ease-in-out_infinite]" />
        </div>

        <button
          onClick={handleCancel}
          className="text-xs font-semibold text-stone-400 hover:text-red-500
                     px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-150"
        >
          Cancel search
        </button>
      </div>

      {/* Tailwind doesn't include this keyframe by default — add to tailwind.config if needed */}
      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%);  }
        }
      `}</style>
    </div>
  );
};

export default MatchmakingScreen;