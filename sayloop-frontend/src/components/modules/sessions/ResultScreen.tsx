import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../../../redux/saga/session.saga';

const ResultScreen = ({ userId }: { userId: number }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { debateResult: result, topic, arguments: args } = useSelector((s: any) => s.session);

  const isWin  = result?.outcome === 'resign' && result?.winnerId === userId;
  const isDraw = result?.outcome === 'draw';
  const isLoss = result?.outcome === 'resign' && !isWin;
  const isDisc = result?.outcome === 'opponent_disconnected';
  const xp     = isWin || isDisc ? 30 : isDraw ? 15 : 10;

  const config = isWin
    ? { emoji: '🏆', title: 'You won!',             sub: 'Your opponent resigned. Legendary arguing!', bg: 'linear-gradient(135deg,#FF6B35,#FFC857)', text: 'white' }
    : isDraw
    ? { emoji: '🤝', title: 'Draw agreed!',          sub: 'Both sides made excellent points.',          bg: 'linear-gradient(135deg,#00A6FB,#A259FF)', text: 'white' }
    : isLoss
    ? { emoji: '💪', title: 'You resigned.',         sub: 'Sometimes stepping back is wise. Try again!', bg: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', text: '#1f2937' }
    : isDisc
    ? { emoji: '🎉', title: 'Partner disconnected', sub: 'You win by default — keep the streak!',      bg: 'linear-gradient(135deg,#22C55E,#16a34a)', text: 'white' }
    : { emoji: '⭐', title: 'Great conversation!',  sub: 'Every session makes you a better speaker.',  bg: 'linear-gradient(135deg,#FFC857,#FF6B35)', text: 'white' };

  const myArgs = (args ?? []).filter((a: any) => a.isMe);

  const handleGoHome = () => { dispatch(sessionActions.reset()); navigate('/home', { replace: true }); };
  const handlePlayAgain = () => { dispatch(sessionActions.reset()); navigate('/match', { replace: true }); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .result-pop { animation: resultPop 0.5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes resultPop {
          from { transform: scale(0.85); opacity:0; }
          to   { transform: scale(1);   opacity:1; }
        }
        .xp-pulse { animation: xpPulse 1s ease-in-out 0.3s 2; }
        @keyframes xpPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#fffbf5]"
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="w-full max-w-lg result-pop">

          {/* Result hero card */}
          <div className="rounded-[32px] p-8 mb-6 text-center relative overflow-hidden"
            style={{ background: config.bg }}>
            <div className="absolute top-0 right-0 text-8xl opacity-10 select-none leading-none pointer-events-none">{config.emoji}</div>
            <div className="text-7xl mb-5 drop-shadow-lg relative z-10">{config.emoji}</div>
            <h1 className="text-3xl lg:text-4xl mb-2 font-black relative z-10" style={{ color: config.text }}>{config.title}</h1>
            <p className="text-base mb-8 font-semibold leading-relaxed max-w-[280px] mx-auto relative z-10"
              style={{ color: config.text === 'white' ? 'rgba(255,255,255,0.85)' : '#4b5563' }}>
              {config.sub}
            </p>

            {/* XP badge */}
            <div className="xp-pulse inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-5 border-2 border-white/30 mb-8 relative z-10">
              <span className="text-4xl">⚡</span>
              <div className="text-left">
                <p className="text-3xl font-black leading-none mb-1" style={{ color: config.text }}>+{xp} XP</p>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: config.text === 'white' ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>earned this session</p>
              </div>
            </div>

            {/* Stats row — flex instead of grid */}
            <div className="flex gap-3 relative z-10">
              {[
                { e: '💬', v: myArgs.length,          l: 'Arguments' },
                { e: '🎯', v: topic ?? 'General',     l: 'Topic'     },
                { e: '🏅', v: result?.outcome ?? '-', l: 'Outcome'   },
              ].map(s => (
                <div key={s.l} className="flex-1 bg-white/20 backdrop-blur rounded-2xl p-3.5 border border-white/30">
                  <div className="text-2xl mb-1.5">{s.e}</div>
                  <p className="text-xs truncate font-black uppercase tracking-tighter"
                    style={{ color: config.text }}>{s.v}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-0.5"
                    style={{ color: config.text === 'white' ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arguments recap */}
          {myArgs.length > 0 && (
            <div className="bg-white rounded-[28px] p-6 mb-6 border-2 border-orange-100 shadow-sm">
              <p className="text-gray-400 text-[10px] mb-5 font-black tracking-[0.2em] uppercase">
                Your Case Log ({myArgs.length})
              </p>
              <div className="space-y-3.5 max-h-52 overflow-y-auto pr-2">
                {myArgs.map((a: any, i: number) => (
                  <div key={a.id} className="flex gap-4 items-start">
                    <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 font-black"
                      style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)' }}>
                      {i + 1}
                    </span>
                    <p className="text-gray-600 text-[13px] leading-relaxed font-semibold m-0">{a.argument}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3.5">
            <button onClick={handleGoHome}
              className="flex-1 py-4 rounded-2xl bg-white text-gray-500 text-[13px] font-black uppercase tracking-wider hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-sm active:scale-95 cursor-pointer border-2 border-gray-100">
              🏠 Home
            </button>
            <button onClick={handlePlayAgain}
              className="flex-1 py-4 rounded-2xl text-white text-[13px] font-black uppercase tracking-wider hover:-translate-y-0.5 hover:scale-105 transition-all active:scale-95 border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)', boxShadow: '0 12px 28px rgba(255,107,53,0.4)' }}>
              Play Again 🎉
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultScreen;