import React from 'react';

const STEPS = [
  { step:'01', emoji:'🎯', title:'Pick what you want to talk about', body:"Choose any topic — travel, food, debates. You decide the battlefield. We make it epic.", color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { step:'02', emoji:'⚡', title:'Get matched with a real person', body:"In seconds, we find you a native speaker who's ready. Zero bots. Zero waiting. Pure human.",  color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
  { step:'03', emoji:'💬', title:'Talk, laugh, and actually learn', body:"Have a real conversation. Mess up your grammar. Laugh about it. That's literally how fluency happens.", color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
];

const HowItWorks = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&display=swap');
      .step-card { transition:transform 0.25s,box-shadow 0.25s; }
      .step-card:hover { transform:translateY(-8px) rotate(-0.4deg); box-shadow:0 20px 40px rgba(0,0,0,0.06); }
    `}</style>
    <section id="how" className="py-24 px-6 bg-white" style={{ fontFamily:"'Outfit',sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5 text-xs font-black uppercase tracking-widest text-blue-600">
            ✨ Stupidly Simple
          </span>
          <h2 className="text-4xl lg:text-5xl text-slate-900 mb-4 font-black">
            3 steps to your
            <span style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}> first real conversation</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium">No setup. No lessons. Just talk.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10 items-stretch">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="step-card flex-1 rounded-3xl p-8 cursor-default border-2" style={{ background:s.bg, borderColor:s.border }}>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-black mb-4"
                  style={{ background:s.color }}>{s.step}</div>
                <div className="text-5xl mb-4">{s.emoji}</div>
                <h3 className="text-xl text-slate-800 mb-3 font-black">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.body}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:flex items-center justify-center text-2xl text-slate-300 flex-shrink-0 self-center">→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white text-lg mb-1 font-black">🎉 Zero prep needed</p>
            <p className="text-slate-400 text-sm font-medium">Jump in, mess up, have fun — that's literally the whole point.</p>
          </div>
          <a href="/sign-up">
            <button className="shrink-0 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:-translate-y-1 hover:scale-105 transition-all active:scale-95 shadow-xl"
              style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', boxShadow:'0 8px 24px rgba(59,130,246,0.45)' }}>
              Try your first session →
            </button>
          </a>
        </div>
      </div>
    </section>
  </>
);

export default HowItWorks;