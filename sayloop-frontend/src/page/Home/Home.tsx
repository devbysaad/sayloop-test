import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import PageShell from '../../components/modules/home/PageShell';

const HomePage = () => {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

  return (
    <PageShell>
      {/* Greeting */}
      <div className="animate-fade-in-up mb-7 font-sans">
        <p className="text-[#9ca3af] text-[13px] font-bold m-0 mb-0.5">Good day 👋</p>
        <h1 className="text-[clamp(24px,5vw,32px)] font-[900] text-[#1a1a26] m-0">
          Hey, {firstName}!
        </h1>
      </div>

      {/* ── FIND PARTNER hero card ── */}
      <div className="animate-fade-in-up [animation-delay:70ms] bg-linear-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[24px] p-7 mb-4 relative overflow-hidden border-2 border-[#2d2d3d] shadow-[0_8px_32px_rgba(26,26,38,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl font-sans group">
        <div className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-[0.18] pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1 mb-3">
          <span className="text-[#f59e0b] text-[12px] font-[800] uppercase tracking-wider">🎙️ LIVE CONVERSATIONS</span>
        </div>

        <h2 className="text-[clamp(20px,4vw,26px)] font-[900] text-[#fffbf5] m-0 mb-2 leading-tight">
          Find a conversation<br />
          <span className="text-[#f59e0b]">partner now</span>
        </h2>
        <p className="text-[#9ca3af] text-[13px] font-[600] m-0 mb-5 max-w-[340px] leading-relaxed">
          Get matched with a real native speaker in seconds. Pick a topic and start talking.
        </p>

        <div className="flex gap-2.5 mb-[22px] flex-wrap">
          {[{ e: '🟢', v: '340', l: 'online' }, { e: '⚡', v: '18s', l: 'match' }, { e: '😊', v: '94%', l: 'rating' }].map(s => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[12px]">{s.e}</span>
              <span className="text-[#fffbf5] font-[900] text-[13px]">{s.v}</span>
              <span className="text-[#6b7280] font-[600] text-[11px]">{s.l}</span>
            </div>
          ))}
        </div>

        <Link to="/debate">
          <button className="bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white font-[800] text-[14px] px-7 py-3 rounded-[14px] border-none cursor-pointer font-sans shadow-[0_8px_22px_rgba(251,191,36,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(251,191,36,0.55)] active:scale-95">
            Find Partner 🚀
          </button>
        </Link>
      </div>

      {/* ── Grid row 1 ── */}
      <div className="animate-fade-in-up [animation-delay:140ms] grid grid-cols-2 gap-3.5 mb-3.5 font-sans">
        <Link to="/learn" className="no-underline">
          <div className="bg-white border-2 border-[#fef3c7] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef9f0] border-2 border-[#fde68a] flex items-center justify-center text-[20px] mb-3 transition-transform group-hover:scale-110">📚</div>
            <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1">Daily Lessons</p>
            <p className="font-[600] text-[#9ca3af] text-[12px] m-0 mb-3 leading-tight">Practice vocab & grammar</p>
            <div className="bg-gray-100 rounded-full h-[5px] overflow-hidden">
              <div className="w-[35%] h-full bg-linear-to-r from-[#fbbf24] to-[#f97316] rounded-full" />
            </div>
            <p className="font-bold text-[#9ca3af] text-[10px] m-0 mt-1">35% complete</p>
          </div>
        </Link>

        <Link to="/leaderboard" className="no-underline">
          <div className="bg-white border-2 border-[#fef3c7] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef9f0] border-2 border-[#fde68a] flex items-center justify-center text-[20px] mb-3 transition-transform group-hover:scale-110">🏆</div>
            <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1">Leaderboard</p>
            <p className="font-[600] text-[#9ca3af] text-[12px] m-0 mb-3 leading-tight">See your global rank</p>
            <div className="flex gap-1.5 items-center">
              {['bg-[#fbbf24]', 'bg-[#9ca3af]', 'bg-[#f97316]'].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${c} flex items-center justify-center text-[9px] text-white font-[900]`}>{i + 1}</div>
              ))}
              <span className="text-[10px] text-[#9ca3af] font-bold ml-1">You're #42</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Grid row 2 ── */}
      <div className="animate-fade-in-up [animation-delay:210ms] grid grid-cols-2 gap-3.5 mb-3.5 font-sans">
        <div className="bg-white border-2 border-[#fef3c7] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef9f0] border-2 border-[#fde68a] flex items-center justify-center text-[20px] mb-3 transition-transform group-hover:scale-110">🎯</div>
          <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1">Daily Quests</p>
          <p className="font-[600] text-[#9ca3af] text-[12px] m-0 mb-3">2 of 3 done today</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => <div key={i} className={`flex-1 h-[5px] rounded-full ${i <= 2 ? 'bg-linear-to-r from-[#fbbf24] to-[#f97316]' : 'bg-gray-100'}`} />)}
          </div>
        </div>

        <div className="bg-white border-2 border-[#fef3c7] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef9f0] border-2 border-[#fde68a] flex items-center justify-center text-[20px] mb-3 transition-transform group-hover:scale-110">⚡</div>
          <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1">Your XP</p>
          <p className="font-[600] text-[#9ca3af] text-[12px] m-0 mb-2">Keep your streak alive!</p>
          <p className="font-[900] text-[#f59e0b] text-[22px] m-0">565 <span className="font-[600] text-[#9ca3af] text-[12px]">XP</span></p>
        </div>
      </div>

      {/* ── Recent conversations ── */}
      <div className="animate-fade-in-up [animation-delay:280ms] bg-white border-2 border-[#fef3c7] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] font-sans">
        <div className="flex items-center justify-between mb-3.5">
          <p className="font-[900] text-[#1a1a26] text-[14px] m-0 text-amber-900">Recent Conversations</p>
          <Link to="/debate" className="text-[#f59e0b] font-[800] text-[12px] no-underline hover:underline tracking-tight">Find new →</Link>
        </div>

        {[
          { name: 'Ahmed', flag: '🇸🇦', topic: 'Daily Life', xp: '+15 XP', time: '2h ago', avatar: '😊' },
          { name: 'Yuki', flag: '🇯🇵', topic: 'Travel & Culture', xp: '+30 XP', time: 'Yesterday', avatar: '🌸' },
        ].map((c, i) => (
          <div key={i} className={`flex items-center gap-3 py-2.5 ${i === 0 ? 'border-none' : 'border-t border-gray-50'}`}>
            <div className="w-[38px] h-[38px] rounded-[12px] bg-linear-to-br from-[#fbbf24] to-[#f97316] flex items-center justify-center text-[18px] shrink-0">{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="m-0 font-[800] text-[#1a1a26] text-[13px]">{c.name} {c.flag}</p>
              <p className="m-0 font-[600] text-[#9ca3af] text-[11px]">{c.topic}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="m-0 font-[800] text-[#f59e0b] text-[12px]">{c.xp}</p>
              <p className="m-0 font-[600] text-[#9ca3af] text-[10px]">{c.time}</p>
            </div>
          </div>
        ))}

        <div className="mt-3 bg-[#fef9f0] border border-dashed border-[#fcd34d] rounded-[12px] p-3 text-center">
          <p className="m-0 font-[700] text-[#d97706] text-[12px]">🎙️ Start your first real conversation today!</p>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;