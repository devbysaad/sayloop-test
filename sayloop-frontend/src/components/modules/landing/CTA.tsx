import React from "react";
import { Link } from "react-router-dom";

const CTA = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800;900&display=swap');
      .cta-bb { transition:transform 0.15s,box-shadow 0.15s; }
      .cta-bb:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 16px 40px rgba(232,72,12,0.35); }
      .float-d { animation:floatD 4s ease-in-out infinite; }
      .float-e { animation:floatD 5s ease-in-out 2s infinite; }
      @keyframes floatD { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(5deg);} }
    `}</style>
    <section className="py-24 px-6 bg-[#F8F5EF]" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-2xl p-10 lg:p-16 overflow-hidden text-white"
          style={{ background: '#141414' }}>

          <div className="float-d absolute top-6 right-10 text-5xl opacity-10 select-none pointer-events-none">💬</div>
          <div className="float-e absolute bottom-6 left-10 text-4xl opacity-10 select-none pointer-events-none">🎙️</div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="text-6xl mb-5">🚀</div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                <span className="font-light text-white/40">Ready to actually</span><br />
                <span className="font-black text-white">speak English?</span>
              </h2>
              <p className="text-white/45 text-lg max-w-sm mx-auto lg:mx-0 font-normal">
                No bots. No boring lessons. Just real people and real conversations — starting in 30 seconds.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-5">
              <Link to="/sign-up">
                <button className="cta-bb bg-[#E8480C] text-white text-base px-12 py-5 rounded-xl font-black shadow-lg">
                  Get started — it's free! →
                </button>
              </Link>
              <div className="flex flex-wrap justify-center gap-4">
                {['✅ Free forever', '✅ No bots — ever', '✅ 190+ countries'].map(t => (
                  <span key={t} className="text-white/40 text-xs font-normal">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3D7A5C', display: 'inline-block' }} />
                <span className="text-white/60 text-xs font-medium">340 speakers online right now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default CTA;