import PageShell from '../../components/modules/home/PageShell';

const Learn = () => {
  return (
    <PageShell>
      {/* Section header */}
      <div className="animate-fade-in-up bg-linear-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[22px] px-6 py-5 mb-9 flex items-center justify-between gap-3 relative overflow-hidden font-sans">
        <div className="absolute -top-6 -right-6 w-[100px] h-[100px] rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-20 pointer-events-none" />
        <div>
          <p className="text-[#9ca3af] text-[11px] font-extrabold m-0 mb-1 tracking-[1px] uppercase">← Section 1, Unit 1</p>
          <h1 className="text-[#fffbf5] text-[clamp(15px,3vw,18px)] font-[900] m-0 leading-tight">Solo trip: Compare travel experiences</h1>
        </div>
        <button className="bg-white text-[#1a1a26] px-4 py-2.5 rounded-[12px] font-[800] text-[12px] border-none cursor-pointer font-sans shrink-0 flex items-center gap-1.5 whitespace-nowrap hover:bg-gray-50 transition-colors shadow-md">
          ≡ GUIDEBOOK
        </button>
      </div>

      {/* Learning path */}
      <div className="animate-fade-in-up [animation-delay:100ms] flex flex-col items-center pb-10 font-sans">

        {/* Node 1 — START (active, bouncing) */}
        <div className="animate-bounce-slow lesson-node w-[88px] h-[88px] rounded-full bg-linear-to-br from-[#fbbf24] to-[#f97316] border-4 border-[#d97706] flex flex-col items-center justify-center shadow-[0_10px_28px_rgba(251,191,36,0.45)] transition-transform hover:scale-105 cursor-pointer">
          <span className="text-white text-[30px] leading-none">✓</span>
          <span className="text-white text-[10px] font-[900]">START</span>
        </div>

        <div className="w-[3px] h-7 bg-linear-to-b from-[#fcd34d] to-[#fef3c7]" />

        {/* Node 2 — Star (done) */}
        <div className="lesson-node w-[70px] h-[70px] rounded-full bg-linear-to-br from-[#fbbf24] to-[#f97316] border-4 border-[#d97706] flex items-center justify-center shadow-[0_6px_18px_rgba(251,191,36,0.3)] transition-transform hover:scale-110 cursor-pointer">
          <span className="text-[28px]">⭐</span>
        </div>

        <div className="w-[3px] h-7 bg-gray-200" />

        {/* Node 3 — Chest (locked, wide) */}
        <div className="lesson-node w-[110px] h-[78px] rounded-[18px] bg-white border-3 border-gray-200 flex items-center justify-center relative shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 cursor-pointer">
          <span className="text-[36px]">📦</span>
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[11px]">🔒</div>
        </div>

        <div className="w-[3px] h-7 bg-gray-200" />

        {/* Node 4 — Mascot (big, next unlock) */}
        <div className="lesson-node relative group">
          <div className="w-[116px] h-[116px] rounded-full bg-[#fef9f0] border-4 border-[#fcd34d] flex items-center justify-center shadow-[0_8px_24px_rgba(251,191,36,0.18)] transition-transform group-hover:scale-105 cursor-pointer">
            <span className="text-[52px]">💬</span>
          </div>
          {/* Tooltip */}
          <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 bg-[#1a1a26] rounded-[10px] px-3 py-1.5 whitespace-nowrap transition-all group-hover:-translate-y-1">
            <span className="text-[#f59e0b] text-[11px] font-[800]">Talk to practice!</span>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#1a1a26]" />
          </div>
        </div>

        <div className="w-[3px] h-11 bg-gray-200" />

        {/* Node 5 — Puzzle (locked) */}
        <div className="lesson-node w-[70px] h-[70px] rounded-full bg-white border-3 border-gray-200 flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform hover:scale-110 cursor-pointer">
          <span className="text-[26px]">🧩</span>
          <div className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-gray-200 rounded-full flex items-center justify-center text-[10px]">🔒</div>
        </div>

        <div className="w-[3px] h-7 bg-gray-200" />

        {/* Node 6 — Trophy (locked) */}
        <div className="lesson-node w-[70px] h-[70px] rounded-full bg-white border-3 border-gray-200 flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform hover:scale-110 cursor-pointer">
          <span className="text-[26px]">🏆</span>
          <div className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-gray-200 rounded-full flex items-center justify-center text-[10px]">🔒</div>
        </div>

      </div>

      {/* Bottom label */}
      <div className="text-center border-t-2 border-[#fef3c7] pt-5 font-sans">
        <p className="text-[#9ca3af] text-[12px] font-bold m-0">Solo trip: Ask about transportation</p>
      </div>
    </PageShell>
  );
};

export default Learn;