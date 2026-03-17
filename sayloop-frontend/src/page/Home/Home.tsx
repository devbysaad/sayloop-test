import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import PageShell from '../../components/modules/home/PageShell';

const HomePage = () => {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

  return (
    <PageShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        .home-card { transition: transform 0.2s, box-shadow 0.2s; }
        .home-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .xp-pop { animation: xpPop 0.5s ease; }
        @keyframes xpPop {
          0% { transform: scale(0.8); opacity:0; }
          60% { transform: scale(1.1); opacity:1; }
          100% { transform: scale(1); opacity:1; }
        }
      `}</style>

      {/* Greeting */}
      <div className="mb-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <p className="text-gray-400 text-[13px] font-bold m-0 mb-0.5">Good day 👋</p>
        <h1 className="text-[clamp(24px,5vw,32px)] font-black text-gray-800 m-0">
          Hey, {firstName}!
        </h1>
      </div>

      {/* ── FIND PARTNER hero card ── */}
      <div className="home-card mb-4 rounded-[24px] p-7 relative overflow-hidden border-2 border-orange-200 shadow-xl cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#FF6B35 0%,#FFC857 100%)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#fff,transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 text-8xl opacity-10 select-none leading-none">💬</div>

        <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1 mb-3 relative z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-white text-[12px] font-black">🎙️ LIVE CONVERSATIONS</span>
        </div>

        <h2 className="font-black text-white text-[clamp(20px,4vw,28px)] m-0 mb-2 leading-tight relative z-10">
          Find a conversation<br />
          <span className="text-white/90">partner now</span>
        </h2>
        <p className="text-white/80 text-[13px] font-semibold m-0 mb-5 max-w-[340px] leading-relaxed relative z-10">
          Get matched with a real native speaker in seconds. Pick a topic and start talking.
        </p>

        <div className="flex gap-2.5 mb-5 flex-wrap relative z-10">
          {[
            { e: '🟢', v: '340', l: 'online' },
            { e: '⚡', v: '18s', l: 'match time' },
            { e: '😊', v: '94%', l: 'rating' },
          ].map(s => (
            <div key={s.l} className="bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[12px]">{s.e}</span>
              <span className="text-white font-black text-[13px]">{s.v}</span>
              <span className="text-white/70 font-semibold text-[11px]">{s.l}</span>
            </div>
          ))}
        </div>

        <Link to="/match" className="relative z-10 inline-block">
          <button
            className="text-[#FF6B35] bg-white font-black text-[14px] px-7 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            Find Partner 🚀
          </button>
        </Link>
      </div>

      {/* ── Quick actions flex row ── */}
      <div className="flex flex-wrap gap-3.5 mb-3.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Link to="/learn" className="no-underline flex-1 min-w-[140px]">
          <div className="home-card bg-white border-2 border-orange-100 rounded-2xl p-5 h-full shadow-sm cursor-pointer">
            <div className="w-[42px] h-[42px] rounded-xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-[20px] mb-3 hover:scale-110 transition-transform">📚</div>
            <p className="font-black text-gray-800 text-[14px] m-0 mb-1">Daily Lessons</p>
            <p className="font-semibold text-gray-400 text-[12px] m-0 mb-3 leading-tight">Practice vocab & grammar</p>
            <div className="bg-gray-100 rounded-full h-[5px] overflow-hidden">
              <div className="w-[35%] h-full rounded-full" style={{ background: 'linear-gradient(90deg,#FF6B35,#FFC857)' }} />
            </div>
            <p className="font-bold text-gray-400 text-[10px] m-0 mt-1">35% complete</p>
          </div>
        </Link>

        <Link to="/leaderboard" className="no-underline flex-1 min-w-[140px]">
          <div className="home-card bg-white border-2 border-orange-100 rounded-2xl p-5 h-full shadow-sm cursor-pointer">
            <div className="w-[42px] h-[42px] rounded-xl bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center text-[20px] mb-3 hover:scale-110 transition-transform">🏆</div>
            <p className="font-black text-gray-800 text-[14px] m-0 mb-1">Leaderboard</p>
            <p className="font-semibold text-gray-400 text-[12px] m-0 mb-3 leading-tight">See your global rank</p>
            <div className="flex gap-1.5 items-center">
              {[{ c: 'bg-yellow-400', r: '1' }, { c: 'bg-gray-300', r: '2' }, { c: 'bg-orange-400', r: '3' }].map(r => (
                <div key={r.r} className={`w-5 h-5 rounded-full ${r.c} flex items-center justify-center text-[9px] text-white font-black`}>{r.r}</div>
              ))}
              <span className="text-[10px] text-gray-400 font-bold ml-1">You're #42</span>
            </div>
          </div>
        </Link>

        <div className="home-card bg-white border-2 border-orange-100 rounded-2xl p-5 shadow-sm flex-1 min-w-[140px]">
          <div className="w-[42px] h-[42px] rounded-xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-[20px] mb-3">🎯</div>
          <p className="font-black text-gray-800 text-[14px] m-0 mb-1">Daily Quests</p>
          <p className="font-semibold text-gray-400 text-[12px] m-0 mb-3">2 of 3 done today</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 h-[5px] rounded-full ${i <= 2 ? '' : 'bg-gray-100'}`}
                style={i <= 2 ? { background: 'linear-gradient(90deg,#FF6B35,#FFC857)' } : {}} />
            ))}
          </div>
        </div>

        <div className="home-card bg-white border-2 border-orange-100 rounded-2xl p-5 shadow-sm flex-1 min-w-[140px]">
          <div className="w-[42px] h-[42px] rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-center text-[20px] mb-3">⚡</div>
          <p className="font-black text-gray-800 text-[14px] m-0 mb-1">Your XP</p>
          <p className="font-semibold text-gray-400 text-[12px] m-0 mb-2">Keep your streak alive!</p>
          <p className="font-black text-[#FF6B35] text-[24px] m-0">565 <span className="font-semibold text-gray-400 text-[12px]">XP</span></p>
        </div>
      </div>

      {/* ── Recent conversations ── */}
      <div className="bg-white border-2 border-orange-100 rounded-2xl p-5 shadow-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-800 text-[14px] m-0">Recent Conversations</p>
          <Link to="/session" className="text-[#FF6B35] font-black text-[12px] no-underline hover:underline">Find new →</Link>
        </div>

        {[
          { name: 'Ahmed', flag: '🇸🇦', topic: 'Daily Life', xp: '+15 XP', time: '2h ago', avatar: '😊', color: '#FF6B35' },
          { name: 'Yuki',  flag: '🇯🇵', topic: 'Travel & Culture', xp: '+30 XP', time: 'Yesterday', avatar: '🌸', color: '#A259FF' },
        ].map((c, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
            <div className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center text-[20px] shrink-0 shadow-sm border-2 border-white"
              style={{ background: `linear-gradient(135deg,${c.color}33,${c.color}55)` }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="m-0 font-black text-gray-800 text-[13px]">{c.name} {c.flag}</p>
              <p className="m-0 font-semibold text-gray-400 text-[11px]">{c.topic}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="m-0 font-black text-[#FF6B35] text-[12px]">{c.xp}</p>
              <p className="m-0 font-semibold text-gray-400 text-[10px]">{c.time}</p>
            </div>
          </div>
        ))}

        <div className="mt-3 rounded-xl p-3 text-center border-2 border-dashed border-orange-200 bg-orange-50">
          <p className="m-0 font-black text-[#FF6B35] text-[12px]">🎙️ Start your first real conversation today!</p>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;