import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Hero = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="min-h-screen flex items-center pt-24 pb-20 overflow-hidden relative bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .blob1 { animation: blob1 8s ease-in-out infinite; }
        .blob2 { animation: blob2 10s ease-in-out infinite; }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,-15px) scale(1.06);} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-15px,20px) scale(1.04);} }
        .fa { animation: fa 3.5s ease-in-out infinite; }
        .fb { animation: fa 4.5s ease-in-out 0.8s infinite; }
        .fc { animation: fa 5s ease-in-out 1.5s infinite; }
        @keyframes fa { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
        .hero-btn { transition:transform 0.15s,box-shadow 0.15s; }
        .hero-btn:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 12px 32px rgba(59,130,246,0.45); }
        .hero-btn:active { transform:scale(0.97); }
        .fade-up { opacity:0; animation:fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        .d1{animation-delay:0.05s;}.d2{animation-delay:0.15s;}.d3{animation-delay:0.25s;}.d4{animation-delay:0.35s;}
        .live-dot { animation:ldot 1.4s ease-in-out infinite; }
        @keyframes ldot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.8);opacity:0.4;} }
      `}</style>

      {/* Blobs */}
      <div className="blob1 absolute top-16 right-0 w-[450px] h-[450px] rounded-full pointer-events-none opacity-10"
        style={{ background:'radial-gradient(circle,#3B82F6,transparent 70%)' }} />
      <div className="blob2 absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
        style={{ background:'radial-gradient(circle,#22C55E,transparent 70%)' }} />
      <div className="absolute top-1/3 left-1/2 w-56 h-56 rounded-full pointer-events-none opacity-8"
        style={{ background:'radial-gradient(circle,#F97316,transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14 w-full relative z-10"
        style={{ fontFamily:"'Outfit', sans-serif" }}>

        {/* ── Left ── */}
        <div className="flex-1 max-w-xl">
          <div className="fade-up inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <span>🎙️</span>
            <span className="text-blue-600 text-xs font-bold">Real people. Real English. Right now.</span>
          </div>

          <h1 className="fade-up d1 text-5xl lg:text-[62px] text-slate-900 leading-[1.06] mb-5 font-black">
            Speak English<br />with real people.<br />
            <span style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Not bots. Not lessons.
            </span>
          </h1>

          <p className="fade-up d2 text-slate-500 text-lg leading-relaxed mb-8 max-w-md font-medium">
            Match with speakers worldwide. Pick a topic, debate it, earn XP —
            and <span className="text-slate-800 font-bold">actually get fluent</span> by speaking.
          </p>

          <div className="fade-up d3 flex flex-col sm:flex-row gap-4 mb-8">
            {isSignedIn ? (
              <Link to="/match">
                <button className="hero-btn text-white text-base px-10 py-4 rounded-2xl font-black shadow-xl" style={{ background:'#3B82F6' }}>Find a Partner 🚀</button>
              </Link>
            ) : (
              <>
                <Link to="/sign-up">
                  <button className="hero-btn text-white text-base px-10 py-4 rounded-2xl font-black shadow-xl" style={{ background:'#3B82F6' }}>Start for free 🎉</button>
                </Link>
                <Link to="/sign-in">
                  <button className="text-slate-600 text-base px-10 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:-translate-y-0.5 transition-all font-semibold">
                    Log in
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Avatar row */}
          <div className="fade-up d4 flex items-center gap-3 mb-5">
            <div className="flex -space-x-2.5">
              {['#3B82F6','#22C55E','#F97316','#EC4899','#8B5CF6'].map((c,i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-black shadow-sm"
                  style={{ background: c }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm font-medium">
              <span className="text-slate-900 font-black">14,000+</span> conversations right now
            </p>
          </div>

          {/* Stats pills */}
          <div className="fade-up d4 flex flex-wrap gap-3">
            {[
              { icon:'⚡', val:'18s', label:'avg match', color:'bg-blue-50 border-blue-200 text-blue-600' },
              { icon:'🏆', val:'94%', label:'satisfaction', color:'bg-green-50 border-green-200 text-green-600' },
              { icon:'🌐', val:'Free', label:'forever', color:'bg-orange-50 border-orange-200 text-orange-500' },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border ${s.color}`}>
                <span className="text-sm">{s.icon}</span>
                <span className="font-black text-sm">{s.val}</span>
                <span className="text-xs font-medium opacity-70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: floating cards ── */}
        <div className="flex-1 hidden lg:flex items-center justify-center h-[500px] relative" style={{ fontFamily:"'Outfit', sans-serif" }}>

          {/* Main debate card */}
          <div className="fa absolute top-4 left-0 bg-white rounded-3xl p-5 w-68 border-2 border-blue-100 shadow-2xl shadow-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm"
                style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)' }}>A</div>
              <div>
                <p className="text-slate-800 text-sm font-black">Ahmed</p>
                <p className="text-slate-400 text-xs font-medium">Practicing English 🇸🇦</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                <span className="live-dot w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-green-600 text-[10px] font-black">LIVE</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl rounded-tl-sm p-3 border border-slate-100">
              <p className="text-slate-600 text-sm leading-relaxed font-medium">"Remote work should be the new normal — change my mind!"</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-500">⚔️ DEBATE</span>
              <span className="text-slate-400 text-[10px]">+25 XP on win</span>
            </div>
          </div>

          {/* XP burst */}
          <div className="fc absolute top-16 right-2 bg-white rounded-2xl px-4 py-3 border-2 border-green-200 shadow-lg shadow-green-50">
            <p className="text-green-600 text-sm font-black">⚡ +50 XP earned!</p>
            <p className="text-slate-400 text-[10px] mt-0.5 font-medium">Won the debate round</p>
          </div>

          {/* Match found card */}
          <div className="fb absolute bottom-10 right-0 bg-white rounded-3xl p-5 w-60 border-2 border-blue-100 shadow-2xl shadow-blue-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm"
                style={{ background:'linear-gradient(135deg,#22C55E,#16A34A)' }}>S</div>
              <div>
                <p className="text-slate-800 text-sm font-black">Sara</p>
                <p className="text-orange-500 text-xs font-bold">🔥 18 day streak · Lv.12</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-2 border border-blue-100">
              <span>🎉</span>
              <div>
                <p className="text-blue-700 text-xs font-black">Just matched!</p>
                <p className="text-slate-400 text-[10px] font-medium">Session starting...</p>
              </div>
            </div>
          </div>

          {/* Level badge */}
          <div className="fa absolute top-1/2 left-12 bg-white rounded-2xl px-4 py-2.5 border-2 border-orange-200 shadow-lg" style={{ animationDelay:'1.5s' }}>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <p className="text-orange-500 text-sm font-black">Level 12 Reached!</p>
            </div>
          </div>

          {/* Online bubble */}
          <div className="fb bg-white absolute bottom-32 left-1/2 -translate-x-1/2 rounded-2xl px-4 py-2.5 border-2 border-green-200 shadow-lg" style={{ animationDelay:'2s' }}>
            <div className="flex items-center gap-2">
              <span className="live-dot w-2 h-2 bg-green-500 rounded-full" />
              <p className="text-green-600 text-sm font-black">340 speakers online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;