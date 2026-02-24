import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';

type DrawState = 'none' | 'offered' | 'received';

interface Props {
    drawState: DrawState;
}

const DrawBanner = ({ drawState }: Props) => {
    const dispatch = useDispatch();

    if (!drawState || (drawState !== 'offered' && drawState !== 'received')) return null;

    if (drawState === 'received') {
        return (
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-auto max-w-sm animate-fade-in-up font-sans">
                <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-[24px] shadow-2xl px-6 py-5
                        flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl
                            flex items-center justify-center text-2xl shrink-0 shadow-sm">
                            🤝
                        </div>
                        <div>
                            <p className="font-[900] text-stone-800 text-sm leading-tight tracking-tight">Draw Offered!</p>
                            <p className="text-stone-500 text-[11px] mt-1 font-[600]">Both get <strong className="text-green-600">+15 XP</strong> if accepted</p>
                        </div>
                    </div>
                    <div className="flex gap-2.5 shrink-0">
                        <button
                            onClick={() => dispatch(sessionActions.acceptDraw())}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs
                         font-[900] uppercase tracking-wider rounded-xl transition-all active:scale-95 border-none cursor-pointer shadow-md shadow-green-600/20"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => dispatch(sessionActions.declineDraw())}
                            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs
                         font-[900] uppercase tracking-wider rounded-xl transition-all active:scale-95 border-none cursor-pointer"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-auto animate-fade-in-up font-sans">
            <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-300 rounded-2xl shadow-xl
                      px-6 py-4 flex items-center gap-3.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <p className="text-amber-900 text-sm font-[800] tracking-tight">
                    Draw offered — waiting for partner to respond…
                </p>
            </div>
        </div>
    );
};

export default DrawBanner;