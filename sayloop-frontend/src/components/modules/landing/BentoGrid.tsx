import React, { useState } from 'react';

const FEATURES = [
  { id:'f1', heading:'Free, Fun, Effective',  body:'Earn XP for every conversation. Unlock levels, break streaks — without it feeling like homework.', icon:'🚀', wide:true,  bg:'#3B82F6', textColor:'white' },
  { id:'f2', heading:'Gamified Learning',     body:'Streaks, leaderboards, weekly challenges. Learning is a game — and you get to win.', icon:'🏆', bg:'#EFF6FF', border:'#BFDBFE', textColor:'#1E293B', accent:'#3B82F6' },
  { id:'f3', heading:'Backed by Science',     body:'Spaced repetition and proven methods that actually stick. No fluff, no filler.',                 icon:'🧪', bg:'#F0FDF4', border:'#BBF7D0', textColor:'#1E293B', accent:'#22C55E' },
  { id:'f4', heading:'Personalized AI',       body:'Every session adapts to your exact level — always challenged, never bored.',                     icon:'🤖', bg:'#FFF7ED', border:'#FED7AA', textColor:'#1E293B', accent:'#F97316' },
  { id:'f5', heading:'Debate Mode ⚔️',        body:'Choose a side. Argue it. Win XP. Debate mode turns every session into a battle of ideas.',        icon:'⚔️', bg:'#F0FDF4', border:'#BBF7D0', textColor:'#1E293B', accent:'#22C55E' },
  { id:'f6', heading:'Instant Matching',      body:'Average match: 18 seconds. No waiting, no nonsense. Just real humans, really fast.',              icon:'⚡', bg:'#EFF6FF', border:'#BFDBFE', textColor:'#1E293B', accent:'#3B82F6' },
];

const BentoGrid = () => {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
        .feat-c { transition:transform 0.22s,box-shadow 0.22s; }
        .feat-c:hover { transform:translateY(-7px); box-shadow:0 20px 40px rgba(0,0,0,0.08); }
      `}</style>
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden" style={{ fontFamily:"'Outfit',sans-serif" }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage:'radial-gradient(circle,#3B82F6 1px,transparent 1px)', backgroundSize:'28px 28px' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5 text-xs font-black uppercase tracking-widest text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Why SayLoop?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Proven methods.<br />
              <span style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Real results.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {FEATURES.map(f => (
              <div key={f.id}
                onMouseEnter={() => setHov(f.id)}
                onMouseLeave={() => setHov(null)}
                className={`feat-c rounded-3xl p-7 cursor-default relative overflow-hidden border-2 ${f.wide ? 'flex-[2] min-w-[280px]' : 'flex-1 min-w-[220px]'}`}
                style={f.wide
                  ? { background:f.bg, borderColor:'transparent' }
                  : { background:f.bg, borderColor:f.border }
                }>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-4 transition-transform duration-300 border-2 ${hov===f.id?' scale-110 rotate-3':''}`}
                  style={f.wide ? { background:'rgba(255,255,255,0.25)', borderColor:'rgba(255,255,255,0.4)' } : { background:'white', borderColor:f.border }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: f.wide ? 'white' : f.accent }}>{f.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: f.wide ? 'rgba(255,255,255,0.85)' : '#64748B' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BentoGrid;