import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const LANGS = ['Spanish 🇪🇸', 'Japanese 🇯🇵', 'French 🇫🇷', 'Arabic 🇸🇦', 'Korean 🇰🇷', 'Mandarin 🇨🇳'];

const Hero = () => {
  const { isSignedIn } = useUser();
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % LANGS.length); setVisible(true); }, 300);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-10px) rotate(2deg)} }
        .anim-1 { animation: fadeUp .6s ease both; }
        .anim-2 { animation: fadeUp .6s .1s ease both; }
        .anim-3 { animation: fadeUp .6s .2s ease both; }
        .anim-4 { animation: fadeUp .6s .3s ease both; }
        .card-a { animation: floatA 5s ease-in-out infinite; }
        .card-b { animation: floatB 6s ease-in-out infinite 1s; }
        .lang-word { transition: opacity .3s, transform .3s; }
      `}</style>

      <section
        style={{ fontFamily: "'Nunito', sans-serif", background: 'linear-gradient(160deg, #fffbf5 0%, #fff7ed 100%)' }}
        className="min-h-screen flex items-center pt-24 pb-20 overflow-hidden relative"
      >
        {/* Soft blobs */}
        <div className="absolute top-16 right-8 w-80 h-80 rounded-full pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)' }} />
        <div className="absolute bottom-8 left-4 w-64 h-64 rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* ─ Left ─ */}
          <div>
            <div className="anim-1 inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-4 py-2 mb-7">
              <span className="text-lg">🎙️</span>
              <span className="text-amber-800 text-sm" style={{ fontWeight: 800 }}>Learn by talking to real people</span>
            </div>

            <h1 className="anim-2 text-5xl lg:text-6xl text-gray-800 leading-[1.1] mb-6" style={{ fontWeight: 900 }}>
              Speak{' '}
              <span
                className="lang-word inline-block"
                style={{ color: '#f59e0b', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
              >
                {LANGS[idx]}
              </span>
              <br />with a real<br />
              <span style={{ color: '#f97316' }}>human today.</span>
            </h1>

            <p className="anim-3 text-gray-500 text-lg leading-relaxed mb-9 max-w-md" style={{ fontWeight: 600 }}>
              No boring lessons. No robots. Just jump in and have a real conversation — you'll be amazed how fast you improve.
            </p>

            <div className="anim-4 flex flex-col sm:flex-row gap-4 mb-10">
              {isSignedIn ? (
                <Link to="/debate">
                  <button className="text-white text-base px-9 py-4 rounded-2xl transition-all hover:-translate-y-1"
                    style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 8px 24px rgba(251,191,36,0.45)' }}>
                    Find someone to talk to 🚀
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/sign-up">
                    <button className="text-white text-base px-9 py-4 rounded-2xl transition-all hover:-translate-y-1"
                      style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 8px 24px rgba(251,191,36,0.45)' }}>
                      Start for free 🎉
                    </button>
                  </Link>
                  <Link to="/sign-in">
                    <button className="text-gray-600 text-base px-9 py-4 rounded-2xl border-2 border-gray-200 hover:border-amber-300 hover:-translate-y-0.5 transition-all"
                      style={{ fontWeight: 700 }}>
                      Log in
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className="anim-4 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#fbbf24','#f97316','#34d399','#60a5fa','#a78bfa'].map((c,i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-3 border-white flex items-center justify-center text-xs text-white font-bold"
                    style={{ background: c, border: '2px solid white' }}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm" style={{ fontWeight: 700 }}>
                <span className="text-gray-800" style={{ fontWeight: 900 }}>14,000+</span> conversations happening right now
              </p>
            </div>
          </div>

          {/* ─ Right: floating cards ─ */}
          <div className="hidden lg:flex relative h-[500px] items-center justify-center">
            <div className="card-a absolute top-6 left-0 bg-white rounded-3xl p-5 w-72 shadow-xl" style={{ border: '2px solid #fde68a' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>😊</div>
                <div>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 800 }}>Ahmed · 🇸🇦</p>
                  <p className="text-gray-400 text-xs" style={{ fontWeight: 600 }}>Learning English</p>
                </div>
                <div className="ml-auto bg-green-100 rounded-full px-2 py-1">
                  <span className="text-green-600 text-[10px]" style={{ fontWeight: 800 }}>● Live</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl rounded-tl-sm p-3">
                <p className="text-gray-700 text-sm leading-relaxed" style={{ fontWeight: 600 }}>"Can we practice greetings? I want to sound more natural!"</p>
              </div>
            </div>

            <div className="card-b absolute bottom-10 right-0 bg-white rounded-3xl p-5 w-64 shadow-xl" style={{ border: '2px solid #bbf7d0' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}>🌸</div>
                <div>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 800 }}>Yuki · 🇯🇵</p>
                  <p className="text-gray-400 text-xs" style={{ fontWeight: 600 }}>Learning Spanish</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-3 flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="text-green-700 text-xs" style={{ fontWeight: 800 }}>Just matched!</p>
                  <p className="text-gray-400 text-[10px]" style={{ fontWeight: 600 }}>Session starting...</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-2xl px-5 py-3 shadow-lg" style={{ border: '2px solid #fcd34d' }}>
              <p className="text-amber-600 text-sm" style={{ fontWeight: 800 }}>🟢 340 people online now</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;