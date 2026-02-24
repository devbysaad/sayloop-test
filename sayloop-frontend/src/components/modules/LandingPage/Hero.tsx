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
      <section className="min-h-screen flex items-center pt-24 pb-20 overflow-hidden relative font-sans bg-linear-to-br from-[#fffbf5] to-[#fff7ed]">
        {/* Soft blobs */}
        <div className="absolute top-16 right-8 w-80 h-80 rounded-full pointer-events-none opacity-40 bg-[radial-gradient(circle,#fde68a,transparent_70%)]" />
        <div className="absolute bottom-8 left-4 w-64 h-64 rounded-full pointer-events-none opacity-30 bg-[radial-gradient(circle,#fed7aa,transparent_70%)]" />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* ─ Left ─ */}
          <div className="relative z-10">
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-4 py-2 mb-7">
              <span className="text-lg">🎙️</span>
              <span className="text-amber-800 text-sm font-[800]">Learn by talking to real people</span>
            </div>

            <h1 className="animate-fade-in-up [animation-delay:100ms] text-5xl lg:text-6xl text-gray-800 leading-[1.1] mb-6 font-[900]">
              Speak{' '}
              <span
                className="inline-block transition-all duration-300 text-[#f59e0b]"
                style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
              >
                {LANGS[idx]}
              </span>
              <br />with a real<br />
              <span className="text-[#f97316]">human today.</span>
            </h1>

            <p className="animate-fade-in-up [animation-delay:200ms] text-gray-500 text-lg leading-relaxed mb-9 max-w-md font-[600]">
              No boring lessons. No robots. Just jump in and have a real conversation — you'll be amazed how fast you improve.
            </p>

            <div className="animate-fade-in-up [animation-delay:300ms] flex flex-col sm:flex-row gap-4 mb-10">
              {isSignedIn ? (
                <Link to="/debate">
                  <button className="text-white text-base px-9 py-4 rounded-2xl transition-all hover:-translate-y-1 font-[800] bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-[0_8px_24px_rgba(251,191,36,0.45)]">
                    Find someone to talk to 🚀
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/sign-up">
                    <button className="text-white text-base px-9 py-4 rounded-2xl transition-all hover:-translate-y-1 font-[800] bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-[0_8px_24px_rgba(251,191,36,0.45)] active:scale-95">
                      Start for free 🎉
                    </button>
                  </Link>
                  <Link to="/sign-in">
                    <button className="text-gray-600 text-base px-9 py-4 rounded-2xl border-2 border-gray-200 hover:border-amber-300 hover:-translate-y-0.5 transition-all font-bold active:scale-95">
                      Log in
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className="animate-fade-in-up [animation-delay:300ms] flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#fbbf24', '#f97316', '#34d399', '#60a5fa', '#a78bfa'].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold bg-[${c}] shadow-sm`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm font-bold">
                <span className="text-gray-800 font-[900]">14,000+</span> conversations happening right now
              </p>
            </div>
          </div>

          {/* ─ Right: floating cards ─ */}
          <div className="hidden lg:flex relative h-[500px] items-center justify-center">
            <div className="animate-float-a absolute top-6 left-0 bg-white rounded-3xl p-5 w-72 shadow-xl border-2 border-[#fcd34d]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-linear-to-br from-[#fbbf24] to-[#f97316]">A</div>
                <div>
                  <p className="text-gray-800 text-sm font-[800]">Ahmed</p>
                  <p className="text-gray-400 text-xs font-[600]">Learning English</p>
                </div>
                <div className="ml-auto bg-green-100 rounded-full px-2 py-1">
                  <span className="text-green-600 text-[10px] font-[800]">● Live</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl rounded-tl-sm p-3">
                <p className="text-gray-700 text-sm leading-relaxed font-[600]">"Can we practice greetings? I want to sound more natural!"</p>
              </div>
            </div>

            <div className="animate-float-b [animation-delay:1s] absolute bottom-10 right-0 bg-white rounded-3xl p-5 w-64 shadow-xl border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-linear-to-br from-emerald-400 to-emerald-600">Y</div>
                <div>
                  <p className="text-gray-800 text-sm font-[800]">Yuki</p>
                  <p className="text-gray-400 text-xs font-[600]">Learning Spanish</p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="text-emerald-700 text-xs font-[800]">Just matched!</p>
                  <p className="text-gray-400 text-[10px] font-[600]">Session starting...</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-2xl px-5 py-3 shadow-lg border-2 border-amber-300">
              <p className="text-amber-600 text-sm font-[800]">🟢 340 people online now</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;