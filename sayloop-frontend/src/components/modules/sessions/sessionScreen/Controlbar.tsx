import React from 'react';

type DrawState = 'none' | 'offered' | 'received';

interface Props {
  muted: boolean;
  camOff: boolean;
  canOfferDraw: boolean;
  drawCooldownSec: number;
  drawState: DrawState;
  onToggleMute: () => void;
  onToggleCam: () => void;
  onOfferDraw: () => void;
  onReaction: (emoji: string) => void;
  onResign: () => void;
}

const REACTIONS = ['👍', '👏', '😂', '🔥', '❤️', '😮'];

const ControlBar = ({ muted, camOff, canOfferDraw, drawCooldownSec, drawState, onToggleMute, onToggleCam, onOfferDraw, onReaction, onResign }: Props) => {
  const drawDisabled = !canOfferDraw || drawState === 'offered' || drawState === 'received';

  return (
    <div className="shrink-0 px-3 sm:px-6 py-3.5 border-t z-10"
      style={{ background:'rgba(11,11,21,0.97)', backdropFilter:'blur(12px)', borderColor:'rgba(124,58,237,0.2)' }}>
      <div className="flex items-center justify-between max-w-3xl mx-auto gap-2 sm:gap-3">

        {/* Mic + Cam */}
        <div className="flex items-center gap-2">
          <button onClick={onToggleMute}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 border-none cursor-pointer
              ${muted ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            style={muted
              ? { background:'linear-gradient(135deg,#dc2626,#ef4444)', boxShadow:'0 4px 14px rgba(220,38,38,0.4)' }
              : { background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)' }
            }>
            {muted ? '🔇' : '🎤'}
          </button>

          <button onClick={onToggleCam}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 border-none cursor-pointer
              ${camOff ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            style={camOff
              ? { background:'linear-gradient(135deg,#dc2626,#ef4444)', boxShadow:'0 4px 14px rgba(220,38,38,0.4)' }
              : { background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)' }
            }>
            {camOff ? '📷' : '📹'}
          </button>
        </div>

        {/* Reaction row */}
        <div className="flex items-center gap-1 rounded-[22px] p-1 border overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ background:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.2)' }}>
          {REACTIONS.map(e => (
            <button key={e} onClick={() => onReaction(e)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[18px] flex items-center justify-center text-base sm:text-lg shrink-0
                hover:scale-125 active:scale-75 transition-all duration-150 border-none cursor-pointer"
              style={{ background:'transparent' }}>
              {e}
            </button>
          ))}
        </div>

        {/* Draw + Resign */}
        <div className="flex items-center gap-2">
          <button onClick={onOfferDraw} disabled={drawDisabled}
            className="hidden sm:block px-4 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 border-none cursor-pointer"
            style={drawDisabled
              ? { background:'rgba(124,58,237,0.05)', color:'rgba(124,58,237,0.3)', cursor:'not-allowed' }
              : { background:'rgba(163,230,53,0.1)', color:'#BEF264', border:'1px solid rgba(163,230,53,0.3)' }
            }>
            {drawCooldownSec > 0 ? `Draw (${drawCooldownSec}s)` : 'Draw'}
          </button>

          <button onClick={onResign}
            className="px-4 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 border-none cursor-pointer hover:scale-105"
            style={{ background:'rgba(239,68,68,0.1)', color:'#FCA5A5', border:'1px solid rgba(239,68,68,0.3)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.7)';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#FCA5A5';
            }}
          >
            Resign ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;