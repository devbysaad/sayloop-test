import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../redux/saga/session.saga';

const TOPICS = [
  { id: 1, label: 'Daily Life',       emoji: '☀️', bg: '#fef3c7', border: '#fcd34d' },
  { id: 2, label: 'Travel & Culture', emoji: '✈️', bg: '#dbeafe', border: '#93c5fd' },
  { id: 3, label: 'Food & Cooking',   emoji: '🍜', bg: '#dcfce7', border: '#86efac' },
  { id: 4, label: 'Movies & Music',   emoji: '🎬', bg: '#fce7f3', border: '#f9a8d4' },
  { id: 5, label: 'Technology',       emoji: '💻', bg: '#f3e8ff', border: '#d8b4fe' },
  { id: 6, label: 'Sports & Fitness', emoji: '⚽', bg: '#fed7aa', border: '#fb923c' },
];

const IdleScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const [sel, setSel] = useState<typeof TOPICS[0] | null>(null);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div className="min-h-screen flex flex-col lg:flex-row"
        style={{ fontFamily: "'Nunito', sans-serif", background: '#fffbf5' }}>

        {/* ── Left panel ─────────────────────────────── */}
        <aside className="lg:w-[42%] bg-white flex flex-col justify-between px-8 py-12 lg:px-14 lg:py-16
                          border-b lg:border-b-0 lg:border-r border-amber-100 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle,#fde68a,transparent 70%)' }} />

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-sm"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>💬</div>
            <span className="text-gray-800 text-lg" style={{ fontWeight: 900 }}>Sayloop</span>
          </div>

          <div className="relative z-10 my-10 lg:my-0">
            <div className="text-5xl mb-5">🎯</div>
            <h1 className="text-3xl lg:text-4xl text-gray-800 leading-snug mb-4" style={{ fontWeight: 900 }}>
              Find someone to<br />
              <span style={{ color: '#f59e0b' }}>practice with!</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs" style={{ fontWeight: 600 }}>
              Pick a topic you love talking about. We'll match you with a real native speaker in seconds!
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { e: '🟢', v: '340', l: 'online now' },
                { e: '⚡', v: '18s', l: 'avg match' },
                { e: '😊', v: '94%', l: 'satisfaction' },
              ].map(s => (
                <div key={s.l} className="rounded-2xl p-3 text-center border-2 border-amber-100"
                  style={{ background: '#fef9f0' }}>
                  <div className="text-lg mb-1">{s.e}</div>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 900 }}>{s.v}</p>
                  <p className="text-gray-400 text-[10px]" style={{ fontWeight: 700 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-300 text-xs flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            🔒 Encrypted · Safe · Anonymous
          </p>
        </aside>

        {/* ── Right panel ────────────────────────────── */}
        <main className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16">

          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
              style={{ fontWeight: 900, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>1</div>
            <span className="text-gray-700 text-sm" style={{ fontWeight: 800 }}>What do you want to talk about?</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {TOPICS.map(t => {
              const active = sel?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSel(t)}
                  className="relative text-left rounded-2xl p-5 border-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: active ? t.bg : '#fff',
                    borderColor: active ? t.border : '#e5e7eb',
                    boxShadow: active ? '0 6px 20px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {active && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                      style={{ fontWeight: 900, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>✓</span>
                  )}
                  <span className="text-3xl block mb-2">{t.emoji}</span>
                  <span className="text-gray-800 text-sm block" style={{ fontWeight: 800 }}>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
              style={{ fontWeight: 900, background: sel ? 'linear-gradient(135deg,#fbbf24,#f97316)' : '#d1d5db' }}>2</div>
            <span className="text-gray-700 text-sm" style={{ fontWeight: 800 }}>Find your conversation partner!</span>
          </div>

          <button
            onClick={() => sel && dispatch(sessionActions.findPartner({ userId, topic: sel.label }))}
            disabled={!sel}
            className="w-full py-4 rounded-2xl text-base transition-all"
            style={sel ? {
              fontWeight: 800, color: '#fff',
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              boxShadow: '0 8px 22px rgba(251,191,36,0.45)',
            } : {
              fontWeight: 800, color: '#d1d5db',
              background: '#f3f4f6', cursor: 'not-allowed',
            }}
          >
            {sel ? `Match me for "${sel.label}" 🚀` : 'Pick a topic first 👆'}
          </button>

          {sel && (
            <p className="text-center text-gray-400 text-sm mt-3" style={{ fontWeight: 600 }}>
              Usually matched in under 18 seconds ⚡
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default IdleScreen;