import React from 'react';

const STEPS = [
  { step: '01', emoji: '🎯', title: 'Pick what you want to talk about', body: "Choose any topic — travel, food, debates. You decide the battlefield. We make it epic.", color: '#E8480C', bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)' },
  { step: '02', emoji: '⚡', title: 'Get matched with a real person', body: "In seconds, we find you a native speaker who's ready. Zero bots. Zero waiting. Pure human.", color: '#B45309', bg: '#FEF8EF', border: 'rgba(180,83,9,0.2)' },
  { step: '03', emoji: '💬', title: 'Talk, laugh, and actually learn', body: "Have a real conversation. Mess up your grammar. Laugh about it. That's literally how fluency happens.", color: '#3D7A5C', bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)' },
];

const HowItWorks = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');
      .step-card { transition:transform 0.25s,box-shadow 0.25s; }
      .step-card:hover { transform:translateY(-8px) rotate(-0.4deg); box-shadow:0 16px 36px rgba(20,20,20,0.07); }
    `}</style>
    <section id="how" className="py-24 px-6 bg-[#F8F5EF]" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5 text-xs font-black uppercase tracking-widest"
            style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)', color: '#E8480C' }}>
            ✨ Stupidly Simple
          </span>
          <h2 className="text-4xl lg:text-5xl text-[#141414] mb-4">
            <span className="font-light" style={{ color: 'rgba(20,20,20,0.4)' }}>3 steps to your</span>
            <span className="font-black text-[#141414]"> first real conversation</span>
          </h2>
          <p className="text-[#141414]/50 text-lg font-normal">No setup. No lessons. Just talk.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10 items-stretch">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="step-card flex-1 rounded-2xl p-8 cursor-default border" style={{ background: s.bg, borderColor: s.border }}>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-black mb-4"
                  style={{ background: s.color }}>{s.step}</div>
                <div className="text-5xl mb-4">{s.emoji}</div>
                <h3 className="text-xl text-[#141414] mb-3 font-black">{s.title}</h3>
                <p className="text-[#141414]/55 text-sm leading-relaxed font-normal">{s.body}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:flex items-center justify-center text-xl text-[#141414]/20 flex-shrink-0 self-center">→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-[#141414] rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white text-lg mb-1 font-black">🎉 Zero prep needed</p>
            <p className="text-white/40 text-sm font-normal">Jump in, mess up, have fun — that's literally the whole point.</p>
          </div>
          <a href="/sign-up">
            <button className="shrink-0 text-white px-8 py-3.5 rounded-xl text-sm font-black hover:-translate-y-1 hover:scale-105 transition-all active:scale-95 shadow-md"
              style={{ background: '#E8480C', boxShadow: '0 8px 24px rgba(232,72,12,0.35)' }}>
              Try your first session →
            </button>
          </a>
        </div>
      </div>
    </section>
  </>
);

export default HowItWorks;