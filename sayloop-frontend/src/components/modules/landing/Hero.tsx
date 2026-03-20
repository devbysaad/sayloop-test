import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Hero = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="min-h-screen flex items-center pt-24 pb-20 overflow-hidden relative bg-[#F8F5EF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap');
        .fa { animation: fa 3.5s ease-in-out infinite; }
        .fb { animation: fa 4.5s ease-in-out 0.8s infinite; }
        .fc { animation: fa 5s ease-in-out 1.5s infinite; }
        @keyframes fa { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
        .hero-btn { transition:transform 0.15s,box-shadow 0.15s; }
        .hero-btn:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 12px 32px rgba(232,72,12,0.35); }
        .hero-btn:active { transform:scale(0.97); }
        .fade-up { opacity:0; animation:fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        .d1{animation-delay:0.05s;}.d2{animation-delay:0.15s;}.d3{animation-delay:0.25s;}.d4{animation-delay:0.35s;}
        .live-dot { animation:ldot 1.4s ease-in-out infinite; }
        @keyframes ldot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.8);opacity:0.4;} }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14 w-full relative z-10"
        style={{ fontFamily:"'Outfit', sans-serif" }}>

        <div className="flex-1 max-w-xl">
          <div className="fade-up inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="live-dot w-2 h-2 rounded-full bg-[#3D7A5C]" style={{ display:'inline-block' }} />
            <span className="text-[#141414]/60 text-xs font-medium">340 real speakers online right now</span>
          </div>

          <h1 className="fade-up d1 leading-[1.06] mb-5">
            <span className="block text-5xl lg:text-[62px] font-light text-[#141414]/40" style={{ letterSpacing:'-2px' }}>Speak English</span>
            <span className="block text-5xl lg:text-[62px] font-black text-[#141414]" style={{ letterSpacing:'-3px' }}>
              with real{' '}
              <span style={{ fontFamily:"'Playfair Display', serif", fontStyle:'italic', color:'#E8480C', letterSpacing:'-1px' }}>people.</span>
            </span>
            <span className="block text-2xl lg:text-3xl font-medium text-[#141414]/40 mt-1">Not bots. Not lessons.</span>
          </h1>

          <p className="fade-up d2 text-[#141414]/55 text-lg leading-relaxed mb-8 max-w-md font-normal">
            Match with speakers worldwide. Pick a topic, debate it, earn XP —
            and <span className="text-[#141414] font-semibold">actually get fluent</span> by speaking.
          </p>

          <div className="fade-up d3 flex flex-col sm:flex-row gap-4 mb-8">
            {isSignedIn ? (
              <Link to="/match">
                <button className="hero-btn text-white text-base px-10 py-4 rounded-xl font-black shadow-md" style={{ background:'#E8480C' }}>Find a Partner →</button>
              </Link>
            ) : (
              <>
                <Link to="/sign-up">
                  <button className="hero-btn text-white text-base px-10 py-4 rounded-xl font-black shadow-md" style={{ background:'#E8480C' }}>Start for free →</button>
                </Link>
                <Link to="/sign-in">
                  <button className="text-[#141414]/60 text-base px-10 py-4 rounded-xl border border-black/12 hover:border-black/25 hover:-translate-y-0.5 transition-all font-medium bg-white">
                    Log in
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="fade-up d4 flex items-center gap-3 mb-5">
            <div className="flex -space-x-2.5">
              {['#E8480C','#3D7A5C','#B45309','#141414','#888'].map((c,i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#F8F5EF] flex items-center justify-center text-xs text-white font-black shadow-sm"
                  style={{ background: c }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <p className="text-[#141414]/55 text-sm font-normal">
              <span className="text-[#141414] font-black">14,000+</span> conversations right now
            </p>
          </div>

          <div className="fade-up d4 flex flex-wrap gap-3">
            {[
              { icon:'⚡', val:'18s', label:'avg match', bg:'#FFF4EF', border:'rgba(232,72,12,0.2)', color:'#E8480C' },
              { icon:'🏆', val:'94%', label:'satisfaction', bg:'#F0FAF4', border:'rgba(61,122,92,0.22)', color:'#3D7A5C' },
              { icon:'🌐', val:'Free', label:'forever', bg:'#FEF8EF', border:'rgba(180,83,9,0.2)', color:'#B45309' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 rounded-xl px-3 py-2 border"
                style={{ background:s.bg, borderColor:s.border }}>
                <span className="text-sm">{s.icon}</span>
                <span className="font-black text-sm" style={{ color:s.color }}>{s.val}</span>
                <span className="text-xs font-normal text-[#141414]/45">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 hidden lg:flex items-center justify-center h-[500px] relative" style={{ fontFamily:"'Outfit', sans-serif" }}>

          <div className="fa absolute top-4 left-0 bg-white rounded-2xl p-5 w-68 border border-black/10 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ background:'#E8480C' }}>A</div>
              <div>
                <p className="text-[#141414] text-sm font-black">Ahmed</p>
                <p className="text-[#141414]/45 text-xs font-normal">Practicing English 🇸🇦</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background:'rgba(61,122,92,0.08)', border:'1px solid rgba(61,122,92,0.22)' }}>
                <span className="live-dot w-1.5 h-1.5 rounded-full" style={{ background:'#3D7A5C', display:'inline-block' }} />
                <span className="text-[10px] font-black" style={{ color:'#3D7A5C' }}>LIVE</span>
              </div>
            </div>
            <div className="bg-[#F8F5EF] rounded-xl rounded-tl-sm p-3 border border-black/6">
              <p className="text-[#141414]/65 text-sm leading-relaxed font-normal">"Remote work should be the new normal — change my mind!"</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background:'#FFF4EF', border:'1px solid rgba(232,72,12,0.2)', color:'#E8480C' }}>⚔️ DEBATE</span>
              <span className="text-[#141414]/35 text-[10px]">+25 XP on win</span>
            </div>
          </div>

          <div className="fc absolute top-16 right-2 bg-white rounded-xl px-4 py-3 shadow-md"
            style={{ border:'1px solid rgba(61,122,92,0.22)' }}>
            <p className="text-sm font-black" style={{ color:'#3D7A5C' }}>⚡ +50 XP earned!</p>
            <p className="text-[#141414]/40 text-[10px] mt-0.5 font-normal">Won the debate round</p>
          </div>

          <div className="fb absolute bottom-10 right-0 bg-white rounded-2xl p-5 w-60 border border-black/10 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ background:'#3D7A5C' }}>S</div>
              <div>
                <p className="text-[#141414] text-sm font-black">Sara</p>
                <p className="text-[#B45309] text-xs font-medium">🔥 18 day streak · Lv.12</p>
              </div>
            </div>
            <div className="rounded-xl p-3 flex items-center gap-2"
              style={{ background:'#FFF4EF', border:'1px solid rgba(232,72,12,0.18)' }}>
              <span>🎉</span>
              <div>
                <p className="text-[#E8480C] text-xs font-black">Just matched!</p>
                <p className="text-[#141414]/40 text-[10px] font-normal">Session starting...</p>
              </div>
            </div>
          </div>

          <div className="fa absolute top-1/2 left-12 bg-white rounded-xl px-4 py-2.5 shadow-md"
            style={{ animationDelay:'1.5s', border:'1px solid rgba(180,83,9,0.2)' }}>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <p className="text-sm font-black" style={{ color:'#B45309' }}>Level 12 Reached!</p>
            </div>
          </div>

          <div className="fb bg-white absolute bottom-32 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2.5 shadow-md"
            style={{ animationDelay:'2s', border:'1px solid rgba(61,122,92,0.22)' }}>
            <div className="flex items-center gap-2">
              <span className="live-dot w-2 h-2 rounded-full" style={{ background:'#3D7A5C', display:'inline-block' }} />
              <p className="text-sm font-black" style={{ color:'#3D7A5C' }}>340 speakers online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;