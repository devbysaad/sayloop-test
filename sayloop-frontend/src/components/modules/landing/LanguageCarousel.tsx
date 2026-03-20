import React, { useState } from 'react';

const palette = [
  { color:'#E8480C', bg:'#FFF4EF', border:'rgba(232,72,12,0.2)' },
  { color:'#3D7A5C', bg:'#F0FAF4', border:'rgba(61,122,92,0.22)' },
  { color:'#B45309', bg:'#FEF8EF', border:'rgba(180,83,9,0.2)' },
];

const TOPICS = [
  { name:'Daily Life',     emoji:'☀️', xp:'+15 XP', ...palette[0] },
  { name:'Travel',         emoji:'✈️', xp:'+20 XP', ...palette[1] },
  { name:'Food & Culture', emoji:'🍜', xp:'+15 XP', ...palette[2] },
  { name:'Tech & AI',      emoji:'💻', xp:'+25 XP', ...palette[0] },
  { name:'Sports',         emoji:'⚽', xp:'+20 XP', ...palette[1] },
  { name:'Movies & TV',    emoji:'🎬', xp:'+15 XP', ...palette[2] },
  { name:'Debate ⚔️',      emoji:'⚡', xp:'+30 XP', ...palette[0] },
  { name:'Books',          emoji:'📚', xp:'+20 XP', ...palette[1] },
  { name:'Gaming',         emoji:'🎮', xp:'+25 XP', ...palette[2] },
  { name:'Business',       emoji:'💼', xp:'+25 XP', ...palette[0] },
  { name:'Science',        emoji:'🔬', xp:'+20 XP', ...palette[1] },
  { name:'Health',         emoji:'🏃', xp:'+20 XP', ...palette[2] },
];

const LanguageCarousel = () => {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800;900&display=swap');
        .topic-chip { transition:transform 0.18s,box-shadow 0.18s; }
        .topic-chip:hover { transform:translateY(-3px) scale(1.03); }
      `}</style>
      <section className="py-24 px-6 bg-[#F8F5EF]" style={{ fontFamily:"'Outfit',sans-serif" }}>
        <div className="max-w-6xl mx-auto text-center mb-12">
          <span className="inline-block rounded-full px-4 py-2 mb-5 text-xs font-black uppercase tracking-widest"
            style={{ background:'#FEF8EF', border:'1px solid rgba(180,83,9,0.2)', color:'#B45309' }}>
            💬 Pick a topic, find a partner
          </span>
          <h2 className="text-4xl lg:text-5xl text-[#141414] mb-4">
            <span className="font-light" style={{ color:'rgba(20,20,20,0.4)' }}>Whatever you want to</span>
            <span className="font-black text-[#141414]"> talk about today</span>
          </h2>
          <p className="text-[#141414]/50 text-base font-normal">Real speakers are waiting on every topic right now.</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:'linear-gradient(to right, #F8F5EF, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background:'linear-gradient(to left, #F8F5EF, transparent)' }} />
          <div className="flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-4">
            {TOPICS.map(t => {
              const active = sel === t.name;
              return (
                <button key={t.name} onClick={() => setSel(active ? null : t.name)}
                  className="topic-chip shrink-0 flex items-center gap-2.5 px-4 py-3.5 rounded-xl border font-black text-sm"
                  style={active
                    ? { background:t.color, borderColor:t.color, color:'white', boxShadow:`0 6px 18px ${t.color}44` }
                    : { background:t.bg, borderColor:t.border, color:t.color }
                  }>
                  <span className="text-xl">{t.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-black leading-none mb-0.5">{t.name}</p>
                    <p className="text-xs font-medium opacity-60">{t.xp}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {sel && (
          <div className="max-w-6xl mx-auto mt-6 bg-white border border-black/10 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <p className="text-[#141414]/65 text-sm font-normal">
              🎉 <strong className="text-[#141414] font-black">{sel}</strong> fans are online! Start a conversation and earn XP.
            </p>
            <a href="/sign-up">
              <button className="shrink-0 text-white text-xs px-6 py-3 rounded-xl font-black hover:scale-105 transition-transform active:scale-95 shadow-sm"
                style={{ background:'#E8480C', boxShadow:'0 6px 18px rgba(232,72,12,0.3)' }}>
                Start talking →
              </button>
            </a>
          </div>
        )}
      </section>
    </>
  );
};

export default LanguageCarousel;