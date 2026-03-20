import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import PageShell from '../../components/modules/home/PageShell';

const HomePage = () => {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

  return (
    <PageShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .home-card { transition: transform 0.2s, box-shadow 0.2s; }
        .home-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(20,20,20,0.08); }
      `}</style>

      {/* Greeting */}
      <div className="mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <p className="text-[#141414]/40 text-[13px] font-normal m-0 mb-0.5">Good day 👋</p>
        <h1 className="text-[clamp(24px,5vw,32px)] font-black text-[#141414] m-0" style={{ letterSpacing: '-1px' }}>
          Hey, {firstName}!
        </h1>
      </div>

      {/* Find Partner hero card */}
      <div className="home-card mb-4 rounded-2xl p-7 relative overflow-hidden border border-black/10 shadow-sm cursor-pointer"
        style={{ background: '#141414' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#E8480C,transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 text-8xl opacity-5 select-none leading-none">💬</div>

        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3 relative z-10"
          style={{ background: 'rgba(61,122,92,0.2)', border: '1px solid rgba(61,122,92,0.35)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#3D7A5C', display: 'inline-block' }} />
          <span className="text-[12px] font-black" style={{ color: '#3D7A5C' }}>LIVE CONVERSATIONS</span>
        </div>

        <h2 className="font-black text-white text-[clamp(20px,4vw,28px)] m-0 mb-2 leading-tight relative z-10"
          style={{ letterSpacing: '-0.5px' }}>
          Find a conversation<br />
          <span className="text-white/50 font-light">partner now</span>
        </h2>
        <p className="text-white/45 text-[13px] font-normal m-0 mb-5 max-w-[340px] leading-relaxed relative z-10">
          Get matched with a real native speaker in seconds. Pick a topic and start talking.
        </p>

        <div className="flex gap-2.5 mb-5 flex-wrap relative z-10">
          {[
            { e: '🟢', v: '340', l: 'online' },
            { e: '⚡', v: '18s', l: 'match time' },
            { e: '😊', v: '94%', l: 'rating' },
          ].map(s => (
            <div key={s.l} className="rounded-xl px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-[12px]">{s.e}</span>
              <span className="text-white font-black text-[13px]">{s.v}</span>
              <span className="text-white/40 font-normal text-[11px]">{s.l}</span>
            </div>
          ))}
        </div>

        <Link to="/match" className="relative z-10 inline-block">
          <button className="font-black text-[14px] px-7 py-3 rounded-xl shadow-sm hover:scale-105 transition-transform active:scale-95"
            style={{ background: '#E8480C', color: 'white', boxShadow: '0 4px 16px rgba(232,72,12,0.35)' }}>
            Find Partner →
          </button>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3.5 mb-3.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Link to="/learn" className="no-underline flex-1 min-w-[140px]">
          <div className="home-card bg-white border border-black/8 rounded-2xl p-5 h-full shadow-sm cursor-pointer">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] mb-3"
              style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>📚</div>
            <p className="font-black text-[#141414] text-[14px] m-0 mb-1">Daily Lessons</p>
            <p className="font-normal text-[#141414]/45 text-[12px] m-0 mb-3 leading-tight">Practice vocab & grammar</p>
            <div className="bg-black/6 rounded-full h-[5px] overflow-hidden">
              <div className="w-[35%] h-full rounded-full" style={{ background: '#E8480C' }} />
            </div>
            <p className="font-medium text-[#141414]/35 text-[10px] m-0 mt-1">35% complete</p>
          </div>
        </Link>

        <Link to="/leaderboard" className="no-underline flex-1 min-w-[140px]">
          <div className="home-card bg-white border border-black/8 rounded-2xl p-5 h-full shadow-sm cursor-pointer">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] mb-3"
              style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)' }}>🏆</div>
            <p className="font-black text-[#141414] text-[14px] m-0 mb-1">Leaderboard</p>
            <p className="font-normal text-[#141414]/45 text-[12px] m-0 mb-3 leading-tight">See your global rank</p>
            <div className="flex gap-1.5 items-center">
              {[{ c: '#E8480C', r: '1' }, { c: '#B45309', r: '2' }, { c: '#3D7A5C', r: '3' }].map(r => (
                <div key={r.r} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-black"
                  style={{ background: r.c }}>{r.r}</div>
              ))}
              <span className="text-[10px] text-[#141414]/35 font-medium ml-1">You're #42</span>
            </div>
          </div>
        </Link>

        <div className="home-card bg-white border border-black/8 rounded-2xl p-5 shadow-sm flex-1 min-w-[140px]">
          <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] mb-3"
            style={{ background: '#F0FAF4', border: '1px solid rgba(61,122,92,0.22)' }}>🎯</div>
          <p className="font-black text-[#141414] text-[14px] m-0 mb-1">Daily Quests</p>
          <p className="font-normal text-[#141414]/45 text-[12px] m-0 mb-3">2 of 3 done today</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-[5px] rounded-full"
                style={{ background: i <= 2 ? '#3D7A5C' : 'rgba(20,20,20,0.08)' }} />
            ))}
          </div>
        </div>

        <div className="home-card bg-white border border-black/8 rounded-2xl p-5 shadow-sm flex-1 min-w-[140px]">
          <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] mb-3"
            style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)' }}>⚡</div>
          <p className="font-black text-[#141414] text-[14px] m-0 mb-1">Your XP</p>
          <p className="font-normal text-[#141414]/45 text-[12px] m-0 mb-2">Keep your streak alive!</p>
          <p className="font-black text-[24px] m-0" style={{ color: '#E8480C' }}>565 <span className="font-normal text-[#141414]/35 text-[12px]">XP</span></p>
        </div>
      </div>

      {/* Recent conversations */}
      <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-[#141414] text-[14px] m-0">Recent Conversations</p>
          <Link to="/session" className="font-black text-[12px] no-underline hover:underline" style={{ color: '#E8480C' }}>Find new →</Link>
        </div>

        {[
          { name: 'Ahmed', flag: '🇸🇦', topic: 'Daily Life',       xp: '+15 XP', time: '2h ago',   avatar: '😊', color: '#E8480C' },
          { name: 'Yuki',  flag: '🇯🇵', topic: 'Travel & Culture', xp: '+30 XP', time: 'Yesterday', avatar: '🌸', color: '#3D7A5C' },
        ].map((c, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-black/5' : ''}`}>
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] shrink-0"
              style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="m-0 font-black text-[#141414] text-[13px]">{c.name} {c.flag}</p>
              <p className="m-0 font-normal text-[#141414]/45 text-[11px]">{c.topic}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="m-0 font-black text-[12px]" style={{ color: '#3D7A5C' }}>{c.xp}</p>
              <p className="m-0 font-normal text-[#141414]/35 text-[10px]">{c.time}</p>
            </div>
          </div>
        ))}

        <div className="mt-3 rounded-xl p-3 text-center border border-dashed"
          style={{ borderColor: 'rgba(232,72,12,0.25)', background: '#FFF4EF' }}>
          <p className="m-0 font-black text-[12px]" style={{ color: '#E8480C' }}>🎙️ Start your first real conversation today!</p>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;