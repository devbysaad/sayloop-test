import React, { useState } from 'react';
import { communicate, run, learn, top } from '../../../assets/LandingPage';

const FEATURES = [
  {
    id: 'fun',
    col: 'md:col-span-2',
    bg: 'bg-white border-stone-200',
    heading: 'Free, Fun, Effective',
    body: 'Quick bite-sized lessons earn you points, unlock new levels, and build real fluency. Research shows it actually works.',
    icon: '🚀',
    iconBg: 'bg-green-50 border-green-200',
    img: top,
    imgAlt: 'Fun Learning',
    layout: 'row',
  },
  {
    id: 'gamified',
    col: 'md:col-span-1 md:row-span-2',
    bg: 'bg-green-600 border-green-500',
    heading: 'Gamified Learning',
    body: 'Stay motivated with streaks, leaderboards, and weekly challenges. Learning feels like a game — because it is.',
    icon: '🏆',
    iconBg: 'bg-white/20 border-white/30',
    img: communicate,
    imgAlt: 'Gamified',
    layout: 'col',
    dark: true,
  },
  {
    id: 'science',
    col: 'md:col-span-1',
    bg: 'bg-white border-stone-200',
    heading: 'Backed by Science',
    body: 'Spaced repetition and proven teaching methods that delight learners and actually stick.',
    icon: '🧪',
    iconBg: 'bg-amber-50 border-amber-200',
    img: learn,
    imgAlt: 'Science',
    layout: 'col-small',
  },
  {
    id: 'ai',
    col: 'md:col-span-1',
    bg: 'bg-stone-900 border-stone-700',
    heading: 'Personalized AI',
    body: 'Lessons tailored to your exact level. The AI adapts every session so you\'re always challenged, never lost.',
    icon: '🤖',
    iconBg: 'bg-white/10 border-white/20',
    img: run,
    imgAlt: 'AI',
    layout: 'col-small',
    dark: true,
  },
];

const BentoGrid = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 bg-stone-100 relative overflow-hidden">
      {/* subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #292524 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200
                           text-green-700 text-[11px] font-bold uppercase tracking-widest
                           rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Why Sayloop?
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight tracking-tight">
            Proven methods.<br />
            <span className="text-green-600">Real results.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(280px,auto)]">
          {FEATURES.map((f) => (
            <div
              key={f.id}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className={`${f.col} border rounded-[28px] p-8 overflow-hidden relative
                          transition-all duration-300 cursor-default
                          ${f.bg}
                          ${hovered === f.id ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)] -translate-y-1' : 'shadow-sm'}
                          ${f.layout === 'row' ? 'flex flex-col md:flex-row items-center gap-8' : 'flex flex-col'}
                        `}
            >
              {/* glow */}
              {f.dark && (
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* content block */}
              <div className={`${f.layout === 'row' ? 'flex-1' : ''} relative z-10`}>
                <div className={`w-11 h-11 ${f.iconBg} border rounded-2xl flex items-center justify-center text-xl mb-4
                                 transition-transform duration-300 ${hovered === f.id ? 'scale-110' : ''}`}>
                  {f.icon}
                </div>
                <h3 className={`text-xl font-extrabold mb-2 ${f.dark ? 'text-white' : 'text-stone-900'}`}>
                  {f.heading}
                </h3>
                <p className={`text-sm leading-relaxed max-w-xs ${f.dark ? 'text-white/70' : 'text-stone-500'}`}>
                  {f.body}
                </p>
              </div>

              {/* image */}
              <div className={`relative z-10 flex justify-center
                ${f.layout === 'row'       ? 'flex-1'        : ''}
                ${f.layout === 'col'       ? 'mt-auto'       : ''}
                ${f.layout === 'col-small' ? 'mt-auto'       : ''}
              `}>
                <img
                  src={f.img}
                  alt={f.imgAlt}
                  className={`object-contain transition-transform duration-500
                    ${f.layout === 'row'       ? 'max-h-[200px]' : ''}
                    ${f.layout === 'col'       ? 'max-h-[160px] w-full max-w-[160px]' : ''}
                    ${f.layout === 'col-small' ? 'max-h-[120px]' : ''}
                    ${hovered === f.id         ? f.layout === 'row' ? 'rotate-2 scale-105' : 'scale-110' : ''}
                  `}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;