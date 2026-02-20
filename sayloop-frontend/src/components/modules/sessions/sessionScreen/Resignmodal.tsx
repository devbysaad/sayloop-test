import React from 'react';

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const ResignModal = ({ onConfirm, onCancel }: Props) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center
                  bg-stone-950/70 backdrop-blur-sm px-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full px-8 py-8 text-center
                    animate-[pop_0.2s_ease-out]">

            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl
                      flex items-center justify-center text-3xl mx-auto mb-5">
                🏳️
            </div>

            <h3 className="text-xl font-extrabold text-stone-900 mb-2">Resign this match?</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
                Like chess — resigning means your opponent wins the round.
            </p>

            {/* XP breakdown */}
            <div className="flex items-center justify-center gap-6 bg-stone-50
                      border border-stone-200 rounded-2xl px-6 py-4 mb-6">
                <div className="text-center">
                    <p className="font-mono text-xl font-semibold text-red-500">0 XP</p>
                    <p className="text-xs text-stone-400 mt-0.5">You earn</p>
                </div>
                <div className="text-stone-300 font-bold text-lg">vs</div>
                <div className="text-center">
                    <p className="font-mono text-xl font-semibold text-green-600">+30 XP</p>
                    <p className="text-xs text-stone-400 mt-0.5">Partner earns</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200
                     text-stone-700 text-sm font-bold transition-all active:scale-95"
                >
                    Keep playing
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700
                     text-white text-sm font-bold transition-all active:scale-95"
                >
                    Resign
                </button>
            </div>
        </div>

        <style>{`
      @keyframes pop {
        0%   { transform: scale(0.92); opacity: 0; }
        100% { transform: scale(1);    opacity: 1; }
      }
    `}</style>
    </div>
);

export default ResignModal;