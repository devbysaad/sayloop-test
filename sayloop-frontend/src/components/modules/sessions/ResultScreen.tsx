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
    ? { emoji: '🏆', title: 'You won!',              sub: 'Your opponent resigned. Great arguing!',         bg: '#fef9c3', border: '#fde047' }
    : isDraw
    ? { emoji: '🤝', title: 'Draw agreed!',           sub: 'Both sides made excellent points.',             bg: '#dbeafe', border: '#93c5fd' }
    : isLoss
    ? { emoji: '💪', title: 'You resigned.',          sub: 'Sometimes stepping back is wise. Try again!',   bg: '#fce7f3', border: '#f9a8d4' }
    : isDisc
    ? { emoji: '🎉', title: 'Partner disconnected',  sub: 'You win by default — keep the streak!',         bg: '#dcfce7', border: '#86efac' }
    : { emoji: '⭐', title: 'Great conversation!',   sub: 'Every session makes you a better speaker.',     bg: '#fef3c7', border: '#fcd34d' };

  const myArgs = (args ?? []).filter((a: any) => a.isMe);

  const handleGoHome = () => {
    dispatch(sessionActions.reset());
    navigate('/home', { replace: true });
  };

  // "Play Again" → reset redux + go to /match to pick a new partner
  const handlePlayAgain = () => {
    dispatch(sessionActions.reset());
    navigate('/match', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 font-sans bg-[#fffbf5]">
      <div className="w-full max-w-lg animate-pop font-sans">

        {/* Result card */}
        <div className="rounded-[32px] p-8 mb-6 text-center border-2 shadow-2xl"
          style={{ background: config.bg, borderColor: config.border }}>
          <div className="text-7xl mb-5 drop-shadow-lg">{config.emoji}</div>
          <h1 className="text-3xl lg:text-4xl text-gray-800 mb-2 font-[900] tracking-tight">{config.title}</h1>
          <p className="text-gray-600 text-base mb-8 font-[600] leading-relaxed max-w-[280px] mx-auto">{config.sub}</p>

          {/* XP badge */}
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-5 border-2 mb-8 shadow-sm"
            style={{ borderColor: config.border }}>
            <span className="text-4xl">⚡</span>
            <div className="text-left">
              <p className="text-amber-600 text-3xl font-[900] leading-none mb-1">+{xp} XP</p>
              <p className="text-gray-400 text-[10px] font-[900] uppercase tracking-widest">earned this session</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { e: '💬', v: myArgs.length,          l: 'Arguments' },
              { e: '🎯', v: topic ?? 'General',     l: 'Topic'     },
              { e: '🏅', v: result?.outcome ?? '-', l: 'Outcome'   },
            ].map(s => (
              <div key={s.l} className="bg-white/60 backdrop-blur-xs rounded-2xl p-3.5 border"
                style={{ borderColor: config.border }}>
                <div className="text-2xl mb-1.5">{s.e}</div>
                <p className="text-gray-800 text-xs truncate font-[900] uppercase tracking-tighter">{s.v}</p>
                <p className="text-gray-400 text-[9px] font-[800] uppercase tracking-widest mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arguments recap */}
        {myArgs.length > 0 && (
          <div className="bg-white rounded-[28px] p-6 mb-6 border-2 border-gray-100/80 shadow-sm">
            <p className="text-gray-400 text-[10px] mb-5 font-[900] tracking-[0.2em] uppercase">
              Your Case Log ({myArgs.length})
            </p>
            <div className="space-y-3.5 max-h-52 overflow-y-auto pr-2">
              {myArgs.map((a: any, i: number) => (
                <div key={a.id} className="flex gap-4 items-start">
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 font-[900]
                    bg-gradient-to-br from-[#fbbf24] to-[#f97316] shadow-sm">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-[13px] leading-relaxed font-[600] m-0">{a.argument}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3.5">
          <button onClick={handleGoHome}
            className="flex-1 py-4 rounded-2xl bg-white text-gray-500 text-[13px] font-[900] uppercase tracking-wider
              hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-sm active:scale-95 cursor-pointer border-none">
            🏠 Home
          </button>
          <button onClick={handlePlayAgain}
            className="flex-1 py-4 rounded-2xl text-white text-[13px] font-[900] uppercase tracking-wider
              hover:-translate-y-0.5 transition-all active:scale-95 border-none cursor-pointer
              bg-gradient-to-br from-[#fbbf24] to-[#f97316] shadow-[0_12px_28px_rgba(251,191,36,0.4)]">
            Play Again 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;