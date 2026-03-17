import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const MatchmakingScreen = () => {
  const dispatch = useDispatch();
  const { waitingMessage, topic } = useSelector((s: any) => s.session);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .bubble1 { animation: bubbleFloat1 3s ease-in-out infinite; }
        .bubble2 { animation: bubbleFloat1 3.5s ease-in-out 0.5s infinite; }
        .bubble3 { animation: bubbleFloat1 4s ease-in-out 1s infinite; }
        @keyframes bubbleFloat1 {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.08); }
        }
        .search-ring { animation: searchSpin 2s linear infinite; }
        @keyframes searchSpin { to { transform: rotate(360deg); } }
        .dot-bounce { animation: dotBounce 1.2s ease-in-out infinite; }
        @keyframes dotBounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .progress-bar { animation: progressFill 18s linear infinite; }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fffbf5] relative overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* Background dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,#FF6B35 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Floating speech bubbles in background */}
        <div className="bubble1 absolute top-20 left-12 text-5xl opacity-15 select-none">💬</div>
        <div className="bubble2 absolute top-32 right-16 text-4xl opacity-15 select-none">🗣️</div>
        <div className="bubble3 absolute bottom-24 left-20 text-3xl opacity-15 select-none">💭</div>
        <div className="bubble1 absolute bottom-16 right-24 text-4xl opacity-10 select-none" style={{ animationDelay: '2s' }}>🎙️</div>

        <div className="w-full max-w-md text-center relative z-10">

          {/* Animated search icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="search-ring absolute inset-0 rounded-full border-4 border-dashed border-orange-300" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
            <div className="absolute inset-4 rounded-full flex items-center justify-center text-5xl shadow-lg"
              style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '2px solid #fed7aa' }}>
              🔍
            </div>
          </div>

          {/* Bouncing speech bubble chars */}
          <div className="flex justify-center gap-4 mb-8">
            {['💬', '🗣️', '💬'].map((e, i) => (
              <span key={i} className="dot-bounce text-3xl" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>

          {topic && (
            <div className="inline-flex items-center gap-2.5 bg-orange-100 border-2 border-orange-300 rounded-full px-5 py-2.5 mb-6">
              <span className="text-2xl">🎯</span>
              <span className="text-orange-700 text-sm font-black uppercase tracking-tight">{topic}</span>
            </div>
          )}

          <h2 className="text-3xl lg:text-4xl text-gray-800 mb-3 font-black tracking-tight">
            Finding your perfect<br />
            <span style={{ color: '#FF6B35' }}>English sparring partner</span> 🥊
          </h2>
          <p className="text-gray-500 text-base mb-8 font-semibold">
            {waitingMessage || 'Scanning 340 online speakers right now...'}
          </p>

          {/* Progress bar */}
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-3 mx-auto max-w-xs">
            <div className="progress-bar h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#FF6B35,#FFC857)' }} />
          </div>
          <p className="text-gray-300 text-xs font-bold mb-8">Typical wait: ~18 seconds</p>

          {/* Stats pill */}
          <div className="inline-flex items-center gap-2 bg-white border-2 border-orange-100 rounded-xl px-5 py-3 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-gray-600 text-sm font-semibold">
              ⚡ Average wait is just <strong className="text-gray-900 font-black">18 seconds</strong>
            </p>
          </div>

          <button
            onClick={() => { dispatch(sessionActions.leaveSession()); dispatch(sessionActions.reset()); }}
            className="text-gray-400 hover:text-red-500 text-sm font-black transition-colors border-none bg-transparent cursor-pointer hover:underline active:scale-95"
          >
            Cancel active search ✕
          </button>
        </div>
      </div>
    </>
  );
};

export default MatchmakingScreen;