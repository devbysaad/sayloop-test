import React from "react";
import { Link } from "react-router-dom";

const CTA = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
      .cta-bb { transition:transform 0.15s,box-shadow 0.15s; }
      .cta-bb:hover { transform:translateY(-4px) scale(1.04); box-shadow:0 16px 40px rgba(59,130,246,0.5); }
      .float-d { animation:floatD 4s ease-in-out infinite; }
      .float-e { animation:floatD 5s ease-in-out 2s infinite; }
      @keyframes floatD { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(5deg);} }
    `}</style>
    <section className="py-24 px-6 bg-slate-50" style={{ fontFamily:"'Outfit',sans-serif" }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-[40px] p-10 lg:p-16 overflow-hidden text-white"
          style={{ background:'linear-gradient(135deg,#3B82F6 0%,#22C55E 100%)', boxShadow:'0 24px 64px rgba(59,130,246,0.4)' }}>

          <div className="float-d absolute top-6 right-10 text-5xl opacity-20 select-none">💬</div>
          <div className="float-e absolute bottom-6 left-10 text-4xl opacity-20 select-none">🎙️</div>
          <div className="absolute inset-0 opacity-10 pointer-events-none rounded-[40px] overflow-hidden"
            style={{ backgroundImage:'radial-gradient(circle,white 1.5px,transparent 1.5px)', backgroundSize:'30px 30px' }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="text-6xl mb-5">🚀</div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                Ready to actually<br />speak English?
              </h2>
              <p className="text-white/80 text-lg max-w-sm mx-auto lg:mx-0 font-medium">
                No bots. No boring lessons. Just real people and real conversations — starting in 30 seconds.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-5">
              <Link to="/sign-up">
                <button className="cta-bb bg-white text-blue-600 text-base px-12 py-5 rounded-2xl font-black shadow-2xl">
                  Get started — it's free! 🎉
                </button>
              </Link>
              <div className="flex flex-wrap justify-center gap-4">
                {['✅ Free forever', '✅ No bots — ever', '✅ 190+ countries'].map(t => (
                  <span key={t} className="text-white/80 text-xs font-bold">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/20 border border-white/30">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-black">340 speakers online right now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default CTA;