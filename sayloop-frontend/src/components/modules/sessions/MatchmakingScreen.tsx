import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const MatchmakingScreen = () => {
  const dispatch = useDispatch();
  const { waitingMessage, topic } = useSelector((s: any) => s.session);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#fffbf5] font-sans">
      <div className="w-full max-w-md text-center animate-fade-in-up">

        {/* Spinner */}
        <div className="relative w-32 h-32 mx-auto mb-9">
          <div className="animate-spin-slow absolute inset-0 rounded-full border-4 border-dashed border-amber-300" />
          <div className="absolute inset-4 rounded-full flex items-center justify-center text-5xl bg-linear-to-br from-[#fef3c7] to-[#fed7aa] border-2 border-[#fcd34d] shadow-sm">
            🔍
          </div>
        </div>

        {topic && (
          <div className="animate-fade-in-up [animation-delay:100ms] inline-flex items-center gap-2.5 bg-amber-100/80 border-2 border-amber-300 rounded-full px-5 py-2.5 mb-6 shadow-xs">
            <span className="text-2xl">{
              ({
                'Daily Life': '☀️', 'Travel & Culture': '✈️', 'Food & Cooking': '🍜',
                'Movies & Music': '🎬', 'Technology': '💻', 'Sports & Fitness': '⚽'
              } as Record<string, string>)[topic] ?? '🎯'
            }</span>
            <span className="text-amber-800 text-sm font-[900] uppercase tracking-tighter">{topic}</span>
          </div>
        )}

        <h2 className="text-3xl lg:text-4xl text-gray-800 mb-3 font-[900] tracking-tight">
          Finding your match...
        </h2>
        <p className="text-gray-500 text-lg mb-8 font-[600]">
          {waitingMessage || 'Looking for someone to chat with!'}
        </p>

        <div className="flex justify-center gap-3 mb-10">
          <span className="animate-db w-4 h-4 rounded-full bg-linear-to-br from-amber-400 to-amber-500 shadow-sm" />
          <span className="animate-db w-4 h-4 rounded-full bg-linear-to-br from-orange-400 to-orange-500 [animation-delay:.18s] shadow-sm" />
          <span className="animate-db w-4 h-4 rounded-full bg-linear-to-br from-amber-400 to-amber-500 [animation-delay:.36s] shadow-sm" />
        </div>

        <div className="bg-white rounded-2xl border-2 border-amber-100 px-6 py-4.5 mb-9 shadow-sm transition-all hover:shadow-md">
          <p className="text-gray-600 text-sm font-[600]">
            ⚡ Average wait is just <strong className="text-gray-900 font-[900]">18 seconds</strong>
          </p>
        </div>

        {/* FIX: was sessionActions.disconnect() — doesn't exist. Correct: leaveSession() + reset() */}
        <button
          onClick={() => {
            dispatch(sessionActions.leaveSession());
            dispatch(sessionActions.reset());
          }}
          className="text-gray-400 hover:text-red-500 text-sm font-[800] transition-colors border-none bg-transparent cursor-pointer active:scale-95"
        >
          Cancel active search ✕
        </button>
      </div>
    </div>
  );
};

export default MatchmakingScreen;