import { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
import type { MatchUser } from '../../../lib/matchApi';

interface Props {
  partner: MatchUser;
  topic: string;
  onCancel: () => void;
}

const TOPIC_EMOJI: Record<string, string> = {
  daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
  sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
};

const WaitingScreen = ({ partner, topic, onCancel }: Props) => {
  const [seconds, setSeconds] = useState(0);
  const [dots, setDots] = useState('');
  const [xpPops, setXpPops] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Random floating speech bubbles
  useEffect(() => {
    const t = setInterval(() => {
      const id = Date.now();
      setXpPops(prev => [...prev.slice(-4), { id, x: Math.random() * 80 + 10, y: -20 }]);
      setTimeout(() => setXpPops(prev => prev.filter(p => p.id !== id)), 2500);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { opacity:0; transform: translateY(0) scale(0.8); }
          30% { opacity:1; transform: translateY(-20px) scale(1.1); }
          100% { opacity:0; transform: translateY(-80px) scale(0.9); }
        }
        .xp-float { animation: floatUp 2.5s ease-out forwards; }
        @keyframes pulseBig {
          0%,100% { transform: scale(1); opacity:0.2; }
          50% { transform: scale(1.3); opacity:0.4; }
        }
        .pulse-ring1 { animation: pulseBig 1.8s ease-in-out infinite; }
        .pulse-ring2 { animation: pulseBig 1.8s ease-in-out 0.6s infinite; }
      `}</style>
      <div className="min-h-screen bg-[#fffbf5] flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* Background dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #FF6B35 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Floating XP pop-ups */}
        {xpPops.map(p => (
          <div key={p.id} className="xp-float absolute text-sm font-black text-orange-500 pointer-events-none z-20"
            style={{ left: `${p.x}%`, bottom: '40%' }}>
            💬 chat!
          </div>
        ))}

        {/* Pulsing rings */}
        <div className="relative mb-10">
          <div className="pulse-ring1 absolute inset-0 rounded-full scale-150" style={{ background: 'radial-gradient(circle,#FF6B35,transparent)', opacity:0.2 }} />
          <div className="pulse-ring2 absolute inset-0 rounded-full scale-[1.75]" style={{ background: 'radial-gradient(circle,#FFC857,transparent)', opacity:0.15 }} />
          <div className="relative z-10">
            <UserAvatar user={partner} size={96} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)' }}>⏳</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-black text-3xl text-gray-800 mb-2 text-center">
          Waiting for {partner.firstName}{dots}
        </h2>
        <p className="text-gray-400 font-semibold text-sm mb-6 text-center max-w-xs leading-relaxed">
          Almost there... they're warming up their English! 🔥 You'll be notified the second they accept.
        </p>

        {/* Topic chip */}
        <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-200 rounded-full px-5 py-2.5 mb-8">
          <span className="text-xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
          <span className="text-orange-700 font-black text-sm capitalize">{topic.replace('_', ' ')}</span>
          <span className="text-orange-400 text-xs font-bold">+25 XP</span>
        </div>

        {/* Partner card */}
        <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-orange-100 shadow-xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar user={partner} size={44} />
            <div className="flex-1">
              <p className="font-black text-gray-900">{partner.firstName}</p>
              <p className="text-gray-400 text-xs font-semibold">@{partner.username}</p>
            </div>
            <div className="text-right bg-yellow-50 border border-yellow-200 rounded-xl px-2.5 py-1.5">
              <p className="font-black text-gray-800 text-sm">{partner.points.toLocaleString()}</p>
              <p className="text-yellow-600 text-[10px] font-black">⚡ XP</p>
            </div>
          </div>
          {/* Listening animation */}
          <div className="bg-orange-50 rounded-2xl p-3 flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-orange-400"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p className="text-orange-600 font-bold text-xs">Listening for their response…</p>
          </div>
        </div>

        <p className="text-gray-300 text-xs font-bold mb-8">{seconds}s elapsed</p>

        <button onClick={onCancel}
          className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors hover:underline">
          Cancel request ✕
        </button>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-7px); }
          }
        `}</style>
      </div>
    </>
  );
};

export default WaitingScreen;