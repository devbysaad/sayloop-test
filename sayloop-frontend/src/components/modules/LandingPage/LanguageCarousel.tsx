import React, { useState } from 'react';

const LANGUAGES = [
  { name: 'English',    flag: '🇬🇧', speakers: '1.5B' },
  { name: 'Spanish',    flag: '🇪🇸', speakers: '500M' },
  { name: 'Mandarin',   flag: '🇨🇳', speakers: '920M' },
  { name: 'French',     flag: '🇫🇷', speakers: '280M' },
  { name: 'Arabic',     flag: '🇸🇦', speakers: '370M' },
  { name: 'Japanese',   flag: '🇯🇵', speakers: '125M' },
  { name: 'Portuguese', flag: '🇧🇷', speakers: '250M' },
  { name: 'German',     flag: '🇩🇪', speakers: '130M' },
  { name: 'Korean',     flag: '🇰🇷', speakers: '80M'  },
  { name: 'Italian',    flag: '🇮🇹', speakers: '65M'  },
  { name: 'Hindi',      flag: '🇮🇳', speakers: '600M' },
  { name: 'Turkish',    flag: '🇹🇷', speakers: '80M'  },
  { name: 'Dutch',      flag: '🇳🇱', speakers: '24M'  },
  { name: 'Swedish',    flag: '🇸🇪', speakers: '10M'  },
];

const LanguageCarousel = () => {
  const [sel, setSel] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { scrollbar-width: none; }
      `}</style>
      <section className="py-24 px-6 bg-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full mb-5" style={{ fontWeight: 800 }}>
              🌍 47 languages available
            </span>
            <h2 className="text-4xl lg:text-5xl text-gray-800 mb-4" style={{ fontWeight: 900 }}>
              Whatever language<br />
              <span style={{ color: '#f97316' }}>you dream of speaking</span>
            </h2>
            <p className="text-gray-500 text-base" style={{ fontWeight: 600 }}>
              Tap one — native speakers are waiting right now.
            </p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, white, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, white, transparent)' }} />

          <div className="scroll-hide flex gap-3 overflow-x-auto pb-3">
            {LANGUAGES.map(l => {
              const active = sel === l.name;
              return (
                <button
                  key={l.name}
                  onClick={() => setSel(active ? null : l.name)}
                  className="shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5"
                  style={active ? {
                    background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                    borderColor: '#f97316',
                    boxShadow: '0 6px 18px rgba(251,191,36,0.4)',
                  } : {
                    background: '#fff',
                    borderColor: '#e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <div className="text-left">
                    <p className="text-sm" style={{ fontWeight: 800, color: active ? '#fff' : '#1f2937' }}>{l.name}</p>
                    <p className="text-xs" style={{ fontWeight: 600, color: active ? 'rgba(255,255,255,0.8)' : '#9ca3af' }}>{l.speakers} speakers</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {sel && (
          <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between">
              <p className="text-gray-700 text-sm" style={{ fontWeight: 700 }}>
                🎉 <strong>{sel}</strong> speakers are online right now and ready to chat!
              </p>
              <a href="/sign-up">
                <button className="shrink-0 text-white text-xs px-5 py-2.5 rounded-xl ml-4"
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>
                  Start talking
                </button>
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default LanguageCarousel;