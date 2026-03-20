import React, { useState } from 'react';

const FEATURES = [
  { id:'f1', heading:'Free, Fun, Effective',  body:'Earn XP for every conversation. Unlock levels, break streaks — without it feeling like homework.', icon:'🚀', wide:true, bg:'#141414', textColor:'white' },
  { id:'f2', heading:'Gamified Learning',     body:'Streaks, leaderboards, weekly challenges. Learning is a game — and you get to win.', icon:'🏆', bg:'#F8F5EF', border:'rgba(20,20,20,0.1)', textColor:'#141414', accent:'#E8480C' },
  { id:'f3', heading:'Backed by Science',     body:'Spaced repetition and proven methods that actually stick. No fluff, no filler.',                 icon:'🧪', bg:'#F0FAF4', border:'rgba(61,122,92,0.2)', textColor:'#141414', accent:'#3D7A5C' },
  { id:'f4', heading:'Personalized AI',       body:'Every session adapts to your exact level — always challenged, never bored.',                     icon:'🤖', bg:'#FEF8EF', border:'rgba(180,83,9,0.2)', textColor:'#141414', accent:'#B45309' },
  { id:'f5', heading:'Debate Mode ⚔️',        body:'Choose a side. Argue it. Win XP. Debate mode turns every session into a battle of ideas.',        icon:'⚔️', bg:'#F0FAF4', border:'rgba(61,122,92,0.2)', textColor:'#141414', accent:'#3D7A5C' },
  { id:'f6', heading:'Instant Matching',      body:'Average match: 18 seconds. No waiting, no nonsense. Just real humans, really fast.',              icon:'⚡', bg:'#FFF4EF', border:'rgba(232,72,12,0.18)', textColor:'#141414', accent:'#E8480C' },
];

const BentoGrid = () => {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800;900&display=swap');
        .feat-c { transition:transform 0.22s,box-shadow 0.22s; }
        .feat-c:hover { transform:translateY(-6px); box-shadow:0 16px 36px rgba(20,20,20,0.07); }
      `}</style>
      <section id="features" className="py-24 bg-white relative overflow-hidden" style={{ fontFamily:"'Outfit',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-black uppercase tracking-widest"
              style={{ background:'rgba(61,122,92,0.08)', border:'1px solid rgba(61,122,92,0.22)', color:'#3D7A5C' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#3D7A5C', display:'inline-block' }} />Why SayLoop?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#141414] leading-tight">
              <span style={{ fontWeight:300, color:'rgba(20,20,20,0.4)' }}>Proven methods.</span><br />
              <span style={{ color:'#141414' }}>Real results.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {FEATURES.map(f => (
              <div key={f.id}
                onMouseEnter={() => setHov(f.id)}
                onMouseLeave={() => setHov(null)}
                className={`feat-c rounded-2xl p-7 cursor-default relative overflow-hidden ${f.wide ? 'flex-[2] min-w-[280px]' : 'flex-1 min-w-[220px]'}`}
                style={f.wide
                  ? { background:f.bg, border:'none' }
                  : { background:f.bg, border:`1.5px solid ${f.border}` }
                }>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform duration-300 border ${hov===f.id?' scale-110 rotate-3':''}`}
                  style={f.wide
                    ? { background:'rgba(255,255,255,0.12)', borderColor:'rgba(255,255,255,0.2)' }
                    : { background:'white', borderColor:'rgba(20,20,20,0.08)' }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: f.wide ? 'white' : f.accent }}>{f.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: f.wide ? 'rgba(255,255,255,0.7)' : 'rgba(20,20,20,0.55)' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BentoGrid;