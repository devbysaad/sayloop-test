import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const ResultScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { result, topic, arguments: args } = useSelector((s: any) => s.session);

  const isWin  = result?.outcome === 'resign' && result?.winnerId === userId;
  const isDraw = result?.outcome === 'draw';
  const isLoss = result?.outcome === 'resign' && !isWin;
  const isDisc = result?.outcome === 'opponent_disconnected';

  const xp = isWin || isDisc ? 30 : isDraw ? 15 : 10;

  const config = isWin  ? { emoji: '🏆', title: 'You won!',            sub: 'Your opponent resigned. Great arguing!',           bg: '#fef9c3', border: '#fde047' }
    : isDraw ? { emoji: '🤝', title: 'Draw agreed!',         sub: 'Both sides made excellent points.',             bg: '#dbeafe', border: '#93c5fd' }
    : isLoss ? { emoji: '💪', title: 'You resigned.',         sub: 'Sometimes stepping back is wise. Try again!',   bg: '#fce7f3', border: '#f9a8d4' }
    : isDisc ? { emoji: '🎉', title: 'Partner disconnected', sub: 'You win by default — keep the streak!',         bg: '#dcfce7', border: '#86efac' }
    :          { emoji: '⭐', title: 'Great conversation!',   sub: 'Every session makes you a better speaker.',     bg: '#fef3c7', border: '#fcd34d' };

  const myArgs = (args ?? []).filter((a: any) => a.isMe);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        @keyframes pop { from{opacity:0;transform:scale(.9) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .pop { animation: pop .4s ease both; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{ fontFamily: "'Nunito', sans-serif", background: '#fffbf5' }}>
        <div className="w-full max-w-lg pop">

          {/* Result card */}
          <div className="rounded-3xl p-8 mb-5 text-center border-2 shadow-lg"
            style={{ background: config.bg, borderColor: config.border }}>
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h1 className="text-3xl text-gray-800 mb-2" style={{ fontWeight: 900 }}>{config.title}</h1>
            <p className="text-gray-600 text-base mb-6" style={{ fontWeight: 600 }}>{config.sub}</p>

            {/* XP badge */}
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 border-2 mb-5"
              style={{ borderColor: config.border }}>
              <span className="text-3xl">⚡</span>
              <div className="text-left">
                <p className="text-amber-600 text-2xl" style={{ fontWeight: 900 }}>+{xp} XP</p>
                <p className="text-gray-400 text-xs" style={{ fontWeight: 700 }}>earned this session</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { e: '💬', v: myArgs.length,             l: 'Arguments' },
                { e: '🎯', v: topic ?? 'General',         l: 'Topic' },
                { e: '🏅', v: result?.outcome ?? 'done',  l: 'Outcome' },
              ].map(s => (
                <div key={s.l} className="bg-white rounded-2xl p-3 border" style={{ borderColor: config.border }}>
                  <div className="text-xl mb-1">{s.e}</div>
                  <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 800 }}>{s.v}</p>
                  <p className="text-gray-400 text-[10px]" style={{ fontWeight: 700 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arguments recap */}
          {myArgs.length > 0 && (
            <div className="bg-white rounded-3xl p-6 mb-5 border-2 border-gray-100 shadow-sm">
              <p className="text-gray-500 text-xs mb-4" style={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Your arguments ({myArgs.length})
              </p>
              <div className="space-y-2.5 max-h-44 overflow-y-auto">
                {myArgs.map((a: any, i: number) => (
                  <div key={a.id} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5"
                      style={{ fontWeight: 900, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>{i+1}</span>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontWeight: 600 }}>{a.argument}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(sessionActions.reset())}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 text-sm hover:border-gray-300 hover:-translate-y-0.5 transition-all"
              style={{ fontWeight: 800 }}
            >
              Go home
            </button>
            <button
              onClick={() => { dispatch(sessionActions.reset()); dispatch(sessionActions.connect({ userId })); }}
              className="flex-1 py-4 rounded-2xl text-white text-sm hover:-translate-y-0.5 transition-all"
              style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 8px 22px rgba(251,191,36,0.4)' }}
            >
              Talk again 🎉
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultScreen;