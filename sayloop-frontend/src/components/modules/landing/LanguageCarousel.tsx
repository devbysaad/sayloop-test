import React, { useState } from 'react';

const TOPICS = [
  { name:'Daily Life',     emoji:'☀️', xp:'+15 XP', color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { name:'Travel',         emoji:'✈️', xp:'+20 XP', color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
  { name:'Food & Culture', emoji:'🍜', xp:'+15 XP', color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
  { name:'Tech & AI',      emoji:'💻', xp:'+25 XP', color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { name:'Sports',         emoji:'⚽', xp:'+20 XP', color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
  { name:'Movies & TV',    emoji:'🎬', xp:'+15 XP', color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
  { name:'Debate ⚔️',      emoji:'⚡', xp:'+30 XP', color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { name:'Books',          emoji:'📚', xp:'+20 XP', color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
  { name:'Gaming',         emoji:'🎮', xp:'+25 XP', color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
  { name:'Business',       emoji:'💼', xp:'+25 XP', color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { name:'Science',        emoji:'🔬', xp:'+20 XP', color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
  { name:'Health',         emoji:'🏃', xp:'+20 XP', color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
];

const LanguageCarousel = () => {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
        .topic-chip { transition:transform 0.18s,box-shadow 0.18s; }
        .topic-chip:hover { transform:translateY(-3px) scale(1.04); }
      `}</style>
      <section className="py-24 px-6 bg-white" style={{ fontFamily:"'Outfit',sans-serif" }}>
        <div className="max-w-6xl mx-auto text-center mb-12">
          <span className="inline-block bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-5 text-xs font-black uppercase tracking-widest text-orange-500">
            💬 Pick a topic, find a partner
          </span>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4 font-black">
            Whatever you want to
            <span style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}> talk about today</span>
          </h2>
          <p className="text-slate-500 text-base font-medium">Native speakers are waiting on every topic right now.</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
          <div className="flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-4">
            {TOPICS.map(t => {
              const active = sel === t.name;
              return (
                <button key={t.name} onClick={() => setSel(active ? null : t.name)}
                  className="topic-chip shrink-0 flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 font-black text-sm"
                  style={active
                    ? { background:t.color, borderColor:t.color, color:'white', boxShadow:`0 6px 20px ${t.color}55` }
                    : { background:t.bg, borderColor:t.border, color:t.color }
                  }>
                  <span className="text-xl">{t.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-black leading-none mb-0.5">{t.name}</p>
                    <p className="text-xs font-bold opacity-60">{t.xp}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {sel && (
          <div className="max-w-6xl mx-auto mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-slate-700 text-sm font-semibold">
              🎉 <strong className="text-slate-900">{sel}</strong> fans are online! Start a conversation and earn XP.
            </p>
            <a href="/sign-up">
              <button className="shrink-0 text-white text-xs px-6 py-3 rounded-xl font-black hover:scale-105 transition-transform active:scale-95 shadow-lg"
                style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', boxShadow:'0 6px 18px rgba(59,130,246,0.4)' }}>
                Start talking 🚀
              </button>
            </a>
          </div>
        )}
      </section>
    </>
  );
};

export default LanguageCarousel;