import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions }           from '../../../redux/service/session.saga';

const ResultScreen = ({ userId }) => {
  const dispatch          = useDispatch();
  const { result, topic, arguments: args } = useSelector((s) => s.session);

  const isPartnerLeft = result?.reason === 'partner_disconnected' || result?.reason === 'partner_skipped';

  const handlePlayAgain = () => {
    dispatch(sessionActions.reset());
    dispatch(sessionActions.connect({ userId }));
  };

  const handleGoHome = () => {
    dispatch(sessionActions.reset());
    dispatch(sessionActions.connect({ userId }));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col items-center justify-center px-6 py-16">

      {/* Result icon */}
      <div className="text-8xl mb-6 animate-bounce">
        {isPartnerLeft ? '😢' : '🏆'}
      </div>

      <h2 className="text-4xl font-black text-[#4B4B4B] mb-3 text-center">
        {isPartnerLeft ? 'Session Ended' : 'Debate Complete!'}
      </h2>

      <p className="text-gray-500 font-medium text-center mb-2 max-w-sm">
        {result?.message || 'Great debate! Your arguments have been submitted.'}
      </p>

      {topic && (
        <div className="bg-white border border-gray-200 rounded-full px-5 py-2 mt-4 mb-8 shadow-sm">
          <span className="text-sm font-bold text-[#4B4B4B]">Topic: </span>
          <span className="text-sm font-bold text-[#1CB0F6]">{topic}</span>
        </div>
      )}

      {/* Argument summary */}
      {args.length > 0 && (
        <div className="w-full max-w-lg bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-extrabold text-[#4B4B4B] mb-4 text-sm uppercase tracking-widest">
            Your Arguments ({args.filter((a) => a.isMe).length})
          </h3>
          <div className="space-y-3">
            {args.filter((a) => a.isMe).map((a) => (
              <div key={a.id} className="bg-[#58CC02]/10 border border-[#58CC02]/30 rounded-[14px] p-3">
                <p className="text-[#4B4B4B] text-sm leading-relaxed">{a.argument}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XP earned */}
      {!isPartnerLeft && (
        <div className="flex items-center gap-3 bg-[#FF9600]/10 border border-[#FF9600]/30 rounded-[16px] px-6 py-4 mb-8">
          <span className="text-3xl">⚡</span>
          <div>
            <p className="font-black text-[#FF9600] text-xl">+10 XP</p>
            <p className="text-gray-500 text-xs font-medium">Debate participation</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleGoHome}
          className="px-8 py-4 rounded-[16px] font-extrabold text-[#4B4B4B] bg-white border-2 border-gray-200 hover:border-gray-300 transition-all"
        >
          Go Home
        </button>
        <button
          onClick={handlePlayAgain}
          className="px-8 py-4 rounded-[16px] font-extrabold text-white bg-[#58CC02] shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all"
        >
          Debate Again 🎯
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
