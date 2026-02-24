import React from 'react';
import { heart, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const TopBar = () => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-[52px] z-100 bg-[#fffbf5] border-b-2 border-[#fef3c7] px-4 flex items-center justify-between font-sans">
      <img src={usaflag} alt="lang" className="w-[30px] h-[30px] rounded-[8px] border-2 border-[#fcd34d]" />
      <div className="flex gap-2">
        {[{ src: start, val: '0', color: 'text-[#f97316]' }, { src: points, val: '565', color: 'text-[#3b82f6]' }, { src: heart, val: '5', color: 'text-[#ef4444]' }].map((s, i) => (
          <div key={i} className="flex items-center gap-1 bg-white border-2 border-[#fef3c7] rounded-[10px] padding-1 px-2 py-1">
            <img src={s.src} alt="" className="w-4 h-4" />
            <span className={`${s.color} font-[900] text-[12px]`}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBar;