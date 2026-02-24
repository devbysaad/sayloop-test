interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const ResignModal = ({ onConfirm, onCancel }: Props) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center
                  bg-stone-950/70 backdrop-blur-sm px-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-8 text-center animate-pop">

            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl
                      flex items-center justify-center text-3xl mx-auto mb-5 shadow-sm">
                🏳️
            </div>

            <h3 className="text-xl font-[900] text-stone-900 mb-2 tracking-tight">Resign this match?</h3>


            {/* XP breakdown */}
            <div className="flex items-center justify-center gap-6 bg-stone-50
                      border-2 border-stone-200/60 rounded-2xl px-6 py-4 mb-8">
                <div className="text-center">
                    <p className="font-mono text-xl font-[900] text-red-500">0 XP</p>
                    <p className="text-[10px] text-stone-400 mt-0.5 font-bold uppercase tracking-wider">You earn</p>
                </div>
                <div className="text-stone-300 font-bold text-lg">vs</div>
                <div className="text-center">
                    <p className="font-mono text-xl font-[900] text-green-600">+30 XP</p>
                    <p className="text-[10px] text-stone-400 mt-0.5 font-bold uppercase tracking-wider">Partner earns</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200
                     text-stone-700 text-sm font-[800] transition-all active:scale-95 border-none cursor-pointer"
                >
                    Keep playing
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700
                     text-white text-sm font-[800] transition-all active:scale-95 border-none cursor-pointer shadow-md"
                >
                    Resign
                </button>
            </div>
        </div>
    </div>
);

export default ResignModal;