import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const TOPICS = [
  { id: 1, label: 'AI & Society', tag: 'Technology', icon: '⚡' },
  { id: 2, label: 'Climate Change', tag: 'Environment', icon: '🌿' },
  { id: 3, label: 'Future of Work', tag: 'Economics', icon: '◎' },
  { id: 4, label: 'Social Media', tag: 'Culture', icon: '◇' },
  { id: 5, label: 'Space Exploration', tag: 'Science', icon: '◉' },
  { id: 6, label: 'Education System', tag: 'Society', icon: '◆' },
];

const STATS = [
  { value: '2,400+', label: 'debates today' },
  { value: '18 sec', label: 'avg match time' },
  { value: '94%', label: 'satisfaction' },
];

const IdleScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<typeof TOPICS[0] | null>(null);

  const handleFind = () => {
    if (!selected) return;
    dispatch(sessionActions.findPartner({ userId, topic: selected.label }));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">

      {/* LEFT PANEL */}
      <aside className="lg:w-[44%] bg-white border-b lg:border-b-0 lg:border-r border-stone-200
                        flex flex-col justify-between px-8 py-10 lg:px-14 lg:py-14 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 tracking-widest uppercase relative z-10">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Sayloop · Live Debates
        </div>

        {/* Hero */}
        <div className="relative z-10 my-10 lg:my-0">
          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200
                           text-green-700 text-[11px] font-semibold tracking-widest uppercase
                           rounded-full px-3 py-1 mb-5">
            🎯 Sharpen your thinking
          </span>
          <h1 className="text-4xl lg:text-[2.7rem] font-extrabold text-stone-900 leading-[1.1] tracking-tight mb-4">
            Debate real people.<br />
            <span className="text-green-600">Think</span> better.
          </h1>
          <p className="text-stone-500 text-[15px] leading-relaxed max-w-sm mb-10">
            Get matched with someone who disagrees with you. Make your case live on video —
            every session sharpens your reasoning and communication.
          </p>
          <div className="flex gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-mono text-xl font-medium text-stone-800">{s.value}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-stone-400 flex items-center gap-1.5">
          <span>🔒</span> Peer-to-peer · End-to-end encrypted
        </p>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-14">

        {/* Step 1 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold
                           flex items-center justify-center shrink-0">1</span>
          <span className="text-[11px] font-mono font-medium text-stone-400 tracking-widest uppercase">
            Choose a topic
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-8">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`relative text-left rounded-2xl p-4 border transition-all duration-150
                ${selected?.id === t.id
                  ? 'bg-green-50 border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.12)]'
                  : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm hover:-translate-y-px'
                }`}
            >
              {selected?.id === t.id && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-green-500 rounded-full
                                 text-white text-[9px] font-bold flex items-center justify-center">✓</span>
              )}
              <span className={`text-base block mb-1.5 transition-colors
                ${selected?.id === t.id ? 'text-green-600' : 'text-stone-400'}`}>
                {t.icon}
              </span>
              <span className={`block text-[9px] font-mono tracking-widest uppercase mb-1 transition-colors
                ${selected?.id === t.id ? 'text-green-500' : 'text-stone-400'}`}>
                {t.tag}
              </span>
              <span className="block text-[13px] font-bold text-stone-800 leading-snug">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold
                           flex items-center justify-center shrink-0">2</span>
          <span className="text-[11px] font-mono font-medium text-stone-400 tracking-widest uppercase">
            Find your match
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFind}
            disabled={!selected}
            className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-150
              ${selected
                ? 'bg-green-600 text-white shadow-[0_4px_14px_rgba(22,163,74,0.28)] hover:bg-green-700 hover:-translate-y-px active:translate-y-0'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
          >
            {selected ? `Match me — ${selected.label}` : 'Select a topic first'}
          </button>
          {selected && (
            <p className="text-xs text-stone-400 leading-relaxed max-w-[100px]">
              Usually matched in under 30 sec.
            </p>
          )}
        </div>

      </main>
    </div>
  );
};

export default IdleScreen;