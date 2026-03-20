import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { heart, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const TopBar = () => {
  const { xp, gems, streak } = useSelector((s: RootState) => s.economy);
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-[52px] z-100 px-4 flex items-center justify-between"
      style={{ background: '#F8F5EF', borderBottom: '1px solid rgba(20,20,20,0.08)', fontFamily: "'Outfit', sans-serif" }}>
      <img src={usaflag} alt="lang" className="w-[30px] h-[30px] rounded-[8px]"
        style={{ border: '1px solid rgba(20,20,20,0.1)' }} />
      <div className="flex gap-2">
        {[
          { src: start,  val: streak.toString(), color: '#E8480C' },
          { src: points, val: xp.toString(),     color: '#B45309' },
          { src: heart,  val: gems.toString(),   color: '#E8480C' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1 bg-white rounded-[10px] px-2 py-1"
            style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
            <img src={s.src} alt="" className="w-4 h-4" />
            <span className="font-black text-[12px]" style={{ color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBar;