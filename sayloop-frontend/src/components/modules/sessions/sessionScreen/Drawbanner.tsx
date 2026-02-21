import React from 'react';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';

interface Props {
    drawState: 'none' | 'offered' | 'received';
}

const DrawBanner = ({ drawState }: Props) => {
    const dispatch = useDispatch();

    if (drawState === 'none') return null;

    if (drawState === 'received') {
        return (
            <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-50 w-[95vw] sm:w-auto max-w-sm">
                <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl px-5 py-4
                        flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl
                            flex items-center justify-center text-xl shrink-0">
                            🤝
                        </div>
                        <div>
                            <p className="font-bold text-stone-800 text-sm leading-snug">Partner offered a draw</p>
                            <p className="text-stone-400 text-xs mt-0.5">Both earn <strong className="text-green-600">+15 XP</strong> if accepted</p>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => dispatch(sessionActions.acceptDraw())}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm
                         font-bold rounded-xl transition-all active:scale-95"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => dispatch(sessionActions.declineDraw())}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm
                         font-bold rounded-xl transition-all active:scale-95"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-50 w-[95vw] sm:w-auto">
            <div className="bg-amber-50 border border-amber-300 rounded-2xl shadow-lg
                      px-5 py-3 flex items-center gap-3">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
                <p className="text-amber-800 text-sm font-semibold">
                    Draw offered — waiting for partner to respond…
                </p>
            </div>
        </div>
    );
};

export default DrawBanner;