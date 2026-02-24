import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const TOPICS = [
  { id: 1, label: 'Daily Life', emoji: '☀️', bg: '#fef3c7', border: '#fcd34d' },
  { id: 2, label: 'Travel & Culture', emoji: '✈️', bg: '#dbeafe', border: '#93c5fd' },
  { id: 3, label: 'Food & Cooking', emoji: '🍜', bg: '#dcfce7', border: '#86efac' },
  { id: 4, label: 'Movies & Music', emoji: '🎬', bg: '#fce7f3', border: '#f9a8d4' },
  { id: 5, label: 'Technology', emoji: '💻', bg: '#f3e8ff', border: '#d8b4fe' },
  { id: 6, label: 'Sports & Fitness', emoji: '⚽', bg: '#fed7aa', border: '#fb923c' },
];

const IdleScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const [sel, setSel] = useState<typeof TOPICS[0] | null>(null);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-[#fffbf5]">

      {/* ── Left panel ─────────────────────────────── */}
      <aside className="animate-fade-in-up lg:w-[42%] bg-white flex flex-col justify-between px-8 py-12 lg:px-14 lg:py-16
                        border-b lg:border-b-0 lg:border-r border-amber-100 relative overflow-hidden font-sans">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-30 pointer-events-none bg-[radial-gradient(circle,#fde68a,transparent_70%)]" />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-sm bg-linear-to-br from-[#fbbf24] to-[#f97316]">💬</div>
          <span className="text-gray-800 text-lg font-[900]">Sayloop</span>
        </div>

        <div className="relative z-10 my-10 lg:my-0">
          <div className="text-5xl mb-5">🎯</div>
          <h1 className="text-3xl lg:text-4xl text-gray-800 leading-snug mb-4 font-[900]">
            Find someone to<br />
            <span className="text-[#f59e0b]">practice with!</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs font-[600]">
            Pick a topic you love talking about. We'll match you with a real native speaker in seconds!
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { e: '🟢', v: '340', l: 'online now' },
              { e: '⚡', v: '18s', l: 'avg match' },
              { e: '😊', v: '94%', l: 'satisfaction' },
            ].map(s => (
              <div key={s.l} className="rounded-2xl p-3 text-center border-2 border-amber-100 bg-[#fef9f0] transition-all hover:scale-105">
                <div className="text-lg mb-1">{s.e}</div>
                <p className="text-gray-800 text-sm font-[900]">{s.v}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-300 text-xs flex items-center gap-1.5 font-[600] mt-10 lg:mt-0">
          🔒 Encrypted · Safe · Anonymous
        </p>
      </aside>

      {/* ── Right panel ────────────────────────────── */}
      <main className="animate-fade-in-up [animation-delay:100ms] flex-1 flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 font-sans">

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-[900] bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-sm">1</div>
          <span className="text-gray-700 text-sm font-extrabold">What do you want to talk about?</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {TOPICS.map(t => {
            const active = sel?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSel(t)}
                className={`relative text-left rounded-2xl p-5 border-2 transition-all duration-200 hover:-translate-y-1 ${active ? 'shadow-[0_6px_20px_rgba(0,0,0,0.08)]' : 'bg-white border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-amber-200'
                  }`}
                style={active ? {
                  background: t.bg,
                  borderColor: t.border,
                } : {}}
              >
                {active && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-[900] bg-linear-to-br from-[#fbbf24] to-[#f97316] animate-pop">✓</span>
                )}
                <span className="text-3xl block mb-2">{t.emoji}</span>
                <span className="text-gray-800 text-sm block font-extrabold">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-[900] transition-colors ${sel ? 'bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-sm' : 'bg-gray-300'
            }`}>2</div>
          <span className="text-gray-700 text-sm font-extrabold">Find your conversation partner!</span>
        </div>

        <button
          onClick={() => sel && dispatch(sessionActions.findPartner({ userId, topic: sel.label }))}
          disabled={!sel}
          className={`w-full py-4 rounded-2xl text-base transition-all duration-200 font-[800] border-none active:scale-[0.98] ${sel
              ? 'text-white bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-[0_8px_22px_rgba(251,191,36,0.45)] cursor-pointer hover:shadow-[0_12px_28px_rgba(251,191,36,0.55)]'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
            }`}
        >
          {sel ? `Match me for "${sel.label}" 🚀` : 'Pick a topic first 👆'}
        </button>

        {sel && (
          <p className="animate-fade-in-up text-center text-gray-400 text-sm mt-4 font-[600] italic">
            Usually matched in under 18 seconds ⚡
          </p>
        )}
      </main>
    </div>
  );
};

export default IdleScreen;