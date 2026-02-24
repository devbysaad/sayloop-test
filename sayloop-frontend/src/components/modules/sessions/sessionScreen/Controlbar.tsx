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

const ControlBar = ({
    muted, camOff, canOfferDraw, drawCooldownSec, drawState,
    onToggleMute, onToggleCam, onOfferDraw, onReaction, onResign,
}: Props) => {
    const drawDisabled = !canOfferDraw || drawState === 'offered' || drawState === 'received';

    return (
        <div className="shrink-0 bg-stone-900 border-t-2 border-stone-800 px-6 py-4 font-sans">
            <div className="flex items-center justify-between max-w-3xl mx-auto">

                <div className="flex items-center gap-3">
                    <button onClick={onToggleMute}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 active:scale-90 border-none cursor-pointer shadow-sm
              ${muted ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'}`}>
                        {muted ? '🔇' : '🎤'}
                    </button>

                    <button onClick={onToggleCam}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 active:scale-90 border-none cursor-pointer shadow-sm
              ${camOff ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'}`}>
                        {camOff ? '📷' : '📹'}
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-stone-950/40 p-1.5 rounded-[22px] border border-stone-800/50">
                    {REACTIONS.map(e => (
                        <button key={e} onClick={() => onReaction(e)}
                            className="w-10 h-10 rounded-[18px] flex items-center justify-center text-lg
                bg-transparent hover:bg-stone-800 transition-all active:scale-75 border-none cursor-pointer hover:scale-110">
                            {e}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onOfferDraw} disabled={drawDisabled}
                        className={`px-5 py-3 rounded-2xl text-[13px] font-[900] uppercase tracking-wider transition-all duration-200 active:scale-95 border-none cursor-pointer
              ${drawDisabled
                                ? 'bg-stone-800 text-stone-600 cursor-not-allowed opacity-50'
                                : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5'}`}>
                        {drawCooldownSec > 0 ? `Draw (${drawCooldownSec}s)` : 'Offer Draw'}
                    </button>

                    <button onClick={onResign}
                        className="px-5 py-3 rounded-2xl text-[13px] font-[900] uppercase tracking-wider bg-red-500/10 text-red-500
              hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95 border-none cursor-pointer hover:shadow-lg hover:shadow-red-500/20"
                    >
                        Resign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlBar;