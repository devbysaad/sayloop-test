import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/service/session.saga';

const MatchmakingScreen = ({ userId }) => {
  const dispatch                     = useDispatch();
  const { waitingMessage, topic }    = useSelector((s) => s.session);

  const handleCancel = () => {
    dispatch(sessionActions.disconnect());
    dispatch(sessionActions.reset());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col items-center justify-center px-6">
      {/* Animated pulse rings */}
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute w-40 h-40 rounded-full bg-[#58CC02]/10 animate-ping" />
        <div className="absolute w-32 h-32 rounded-full bg-[#58CC02]/20 animate-ping [animation-delay:200ms]" />
        <div className="absolute w-24 h-24 rounded-full bg-[#58CC02]/30 animate-ping [animation-delay:400ms]" />
        <div className="w-20 h-20 rounded-full bg-[#58CC02] flex items-center justify-center text-4xl shadow-lg relative z-10">
          🎯
        </div>
      </div>

      {/* Topic pill */}
      {topic && (
        <div className="bg-white border border-gray-200 rounded-full px-5 py-2 mb-6 shadow-sm">
          <span className="text-sm font-bold text-[#4B4B4B]">Topic: </span>
          <span className="text-sm font-bold text-[#58CC02]">{topic}</span>
        </div>
      )}

      <h2 className="text-3xl font-black text-[#4B4B4B] mb-3 text-center">
        Finding Your Match
      </h2>
      <p className="text-gray-500 font-medium text-center mb-2">
        {waitingMessage || 'Looking for a partner with the same topic...'}
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 my-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-[#58CC02] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      <button
        onClick={handleCancel}
        className="mt-4 text-sm font-bold text-gray-400 hover:text-[#FF4B4B] transition-colors underline underline-offset-2"
      >
        Cancel Search
      </button>
    </div>
  );
};

export default MatchmakingScreen;
