import React from 'react';

const STEPS = [
  { emoji: '🎯', step: '01', title: 'Pick what you want to talk about', body: 'Choose any topic — travel, food, hobbies, current events. You decide. We make it happen.', color: '#fef3c7', border: '#fcd34d' },
  { emoji: '⚡', step: '02', title: 'Get matched with a real person',    body: 'In seconds, we find you a native speaker who is ready to chat. Zero waiting. Zero bots.', color: '#fed7aa', border: '#fb923c' },
  { emoji: '💬', step: '03', title: 'Talk, laugh, and actually learn',   body: 'Have a real video conversation. Make mistakes. Laugh about it. That is how fluency actually happens.', color: '#bbf7d0', border: '#34d399' },
];

const HowItWorks = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>
    <section className="py-24 px-6" style={{ fontFamily: "'Nunito', sans-serif", background: 'linear-gradient(180deg,#fffbf5 0%,#fff 100%)' }}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm px-4 py-2 rounded-full mb-5" style={{ fontWeight: 800 }}>
            ✨ Stupidly simple
          </span>
          <h2 className="text-4xl lg:text-5xl text-gray-800 mb-4" style={{ fontWeight: 900 }}>
            3 steps to your<br />
            <span style={{ color: '#f59e0b' }}>first real conversation</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-sm mx-auto" style={{ fontWeight: 600 }}>
            No setup. No lessons. Just talk.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="rounded-3xl p-8 hover:-translate-y-1 transition-all" style={{ background: s.color, border: `2px solid ${s.border}` }}>
              <div className="text-5xl mb-5">{s.emoji}</div>
              <span className="inline-block text-xs text-gray-400 mb-2" style={{ fontWeight: 800 }}>STEP {s.step}</span>
              <h3 className="text-xl text-gray-800 mb-3" style={{ fontWeight: 900 }}>{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed" style={{ fontWeight: 600 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 rounded-3xl p-7 border-2 border-amber-200 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-gray-800 text-lg mb-1" style={{ fontWeight: 900 }}>🎉 Zero prep needed</p>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 600 }}>Jump in, make mistakes, have fun — that is literally the whole point.</p>
          </div>
          <a href="/sign-up">
            <button className="shrink-0 text-white px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all text-sm"
              style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 6px 18px rgba(251,191,36,0.4)' }}>
              Try your first session →
            </button>
          </a>
        </div>
      </div>
    </section>
  </>
);

export default HowItWorks;