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
  const [xpPops, setXpPops] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const id = Date.now();
      setXpPops(prev => [...prev.slice(-4), { id, x: Math.random() * 80 + 10 }]);
      setTimeout(() => setXpPops(prev => prev.filter(p => p.id !== id)), 2500);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');
        @keyframes floatUp {
          0%   { opacity:0; transform:translateY(0) scale(0.8); }
          30%  { opacity:1; transform:translateY(-20px) scale(1.1); }
          100% { opacity:0; transform:translateY(-80px) scale(0.9); }
        }
        .xp-float { animation: floatUp 2.5s ease-out forwards; }
        @keyframes pulseBig {
          0%,100% { transform:scale(1); opacity:0.15; }
          50%     { transform:scale(1.3); opacity:0.3; }
        }
        .pulse-ring1 { animation: pulseBig 1.8s ease-in-out infinite; }
        .pulse-ring2 { animation: pulseBig 1.8s ease-in-out 0.6s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>

        {xpPops.map(p => (
          <div key={p.id} className="xp-float absolute text-sm font-black pointer-events-none z-20"
            style={{ left: `${p.x}%`, bottom: '40%', color: '#3D7A5C' }}>
            💬 chat!
          </div>
        ))}

        <div className="relative mb-10">
          <div className="pulse-ring1 absolute inset-0 rounded-full scale-150"
            style={{ background: 'radial-gradient(circle,#E8480C,transparent)', opacity: 0.15 }} />
          <div className="pulse-ring2 absolute inset-0 rounded-full scale-[1.75]"
            style={{ background: 'radial-gradient(circle,#B45309,transparent)', opacity: 0.1 }} />
          <div className="relative z-10">
            <UserAvatar user={partner} size={96} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg border-2 border-[#F8F5EF] shadow-sm"
              style={{ background: '#E8480C' }}>⏳</div>
          </div>
        </div>

        <h2 className="font-black text-3xl text-[#141414] mb-2 text-center" style={{ letterSpacing: '-0.5px' }}>
          Waiting for {partner.firstName}{dots}
        </h2>
        <p className="font-normal text-sm mb-6 text-center max-w-xs leading-relaxed" style={{ color: 'rgba(20,20,20,0.45)' }}>
          Almost there... they're warming up their English! 🔥 You'll be notified the second they accept.
        </p>

        <div className="flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
          style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>
          <span className="text-xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
          <span className="font-black text-sm capitalize" style={{ color: '#E8480C' }}>{topic.replace('_', ' ')}</span>
          <span className="text-xs font-medium" style={{ color: 'rgba(232,72,12,0.6)' }}>+25 XP</span>
        </div>

        {/* Partner card */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-5 mb-8 shadow-sm"
          style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar user={partner} size={44} />
            <div className="flex-1">
              <p className="font-black text-[#141414]">{partner.firstName}</p>
              <p className="text-[12px] font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>@{partner.username}</p>
            </div>
            <div className="text-right rounded-xl px-2.5 py-1.5" style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)' }}>
              <p className="font-black text-[#141414] text-sm">{partner.points.toLocaleString()}</p>
              <p className="text-[10px] font-black" style={{ color: '#B45309' }}>⚡ XP</p>
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: '#F0FAF4', border: '1px solid rgba(61,122,92,0.2)' }}>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full"
                  style={{ background: '#3D7A5C', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p className="text-xs font-medium" style={{ color: '#3D7A5C' }}>Listening for their response…</p>
          </div>
        </div>

        <p className="text-xs font-normal mb-8" style={{ color: 'rgba(20,20,20,0.25)' }}>{seconds}s elapsed</p>

        <button onClick={onCancel}
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: 'rgba(20,20,20,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#E8480C')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(20,20,20,0.4)')}>
          Cancel request ✕
        </button>
      </div>
    </>
  );
};

export default WaitingScreen;