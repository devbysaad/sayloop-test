import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import HeroImg from '../../../assets/PNG/hero.png';

const BADGES = [
  { emoji: '🔥', label: 'Streak', value: '12 Days', color: 'bg-orange-50 border-orange-200' },
  { emoji: '💎', label: 'Gems',   value: '4,200',   color: 'bg-blue-50 border-blue-200'   },
];

const Hero = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [ready, setReady] = useState(false);
  const [xpPop, setXpPop] = useState(false);

  useEffect(() => { if (isLoaded) setReady(true); }, [isLoaded]);
  useEffect(() => {
    const id = setTimeout(() => setXpPop(true), 1800);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden
                        bg-stone-100 pt-28 pb-16 px-6">

      {/* Background blobs */}
      <div className="absolute top-[-8%] left-[-8%] w-96 h-96 bg-green-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-5%] w-80 h-80 bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #292524 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-7">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200
                          text-green-700 text-xs font-bold uppercase tracking-widest
                          rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            The smarter way to learn
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold text-stone-900
                         leading-[1.08] tracking-tight">
            Master a language,<br className="hidden lg:block" />
            <span className="text-green-600"> unlock the world.</span>
          </h1>

          <p className="text-lg text-stone-500 max-w-md font-medium leading-relaxed">
            Debate, practice, and level up — in the most fun, science-backed way to actually
            become fluent.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!ready ? (
              <div className="h-12 w-48 bg-stone-200 animate-pulse rounded-xl" />
            ) : isSignedIn ? (
              <Link to="/learn">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold
                                   py-3.5 px-8 rounded-xl text-base
                                   shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-px
                                   transition-all duration-150">
                  Continue Learning →
                </button>
              </Link>
            ) : (
              <>
                <Link to="/sign-up">
                  <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white
                                     font-bold py-3.5 px-8 rounded-xl text-base
                                     shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-px
                                     transition-all duration-150">
                    Get Started — It's Free
                  </button>
                </Link>
                <Link to="/sign-in">
                  <button className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-700
                                     font-bold py-3.5 px-8 rounded-xl text-base border-2 border-stone-200
                                     shadow-[0_4px_0_#e7e5e4] active:shadow-none active:translate-y-px
                                     transition-all duration-150">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 text-sm text-stone-400 font-semibold">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
                </div>
              ))}
            </div>
            <span>Trusted by <strong className="text-stone-600">10,000+</strong> learners</span>
          </div>
        </div>

        {/* RIGHT — hero image + floating badges */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px]">

            <img src={HeroImg} alt="Sayloop" className="w-full drop-shadow-2xl relative z-10" />

            {/* Floating XP pop */}
            {xpPop && (
              <div className={`absolute top-6 left-2 sm:-left-10 z-20 transition-all duration-700
                              ${xpPop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="bg-white border border-amber-200 rounded-2xl px-4 py-3 shadow-xl
                                flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-xl">⚡</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">XP Earned</p>
                    <p className="text-lg font-extrabold text-stone-800">+20 XP</p>
                  </div>
                </div>
              </div>
            )}

            {BADGES.map((b, i) => (
              <div key={i}
                className={`absolute z-20 bg-white border ${b.color} rounded-2xl px-4 py-3 shadow-xl
                            flex items-center gap-3 hidden sm:flex
                            ${i === 0 ? 'top-1/4 -left-8' : 'bottom-24 -right-8'}
                            animate-[float_3s_ease-in-out_infinite_${i === 1 ? '1.5s' : ''}]`}
                style={{ animationDelay: i === 1 ? '1.5s' : '0s' }}>
                <div className={`w-10 h-10 ${b.color} rounded-full flex items-center justify-center text-xl`}>
                  {b.emoji}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{b.label}</p>
                  <p className="text-lg font-extrabold text-stone-800">{b.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;