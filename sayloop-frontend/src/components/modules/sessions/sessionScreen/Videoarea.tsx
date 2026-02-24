import React from 'react';

interface Props {
    localRef: React.RefObject<HTMLVideoElement | null>;
    remoteRef: React.RefObject<HTMLVideoElement | null>;
    remoteReady: boolean;
    camOff: boolean;
    camError: boolean;
    topic: string | null;
    reaction: string | null;
}

const VideoArea = ({ localRef, remoteRef, remoteReady, camOff, camError, topic, reaction }: Props) => {
    return (
        <div className="flex-1 relative bg-stone-950 overflow-hidden font-sans">

            {/* ── REMOTE VIDEO (full area) ────────────────────────── */}
            <video
                ref={remoteRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* No remote stream yet — placeholder */}
            {!remoteReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 z-20">
                    <div className="relative flex items-center justify-center w-28 h-28 mb-5">
                        <span className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" />
                        <span className="absolute inset-4 rounded-full border-2 border-amber-500/40 animate-ping [animation-delay:400ms]" />
                        <div className="relative z-10 w-16 h-16 rounded-3xl bg-stone-800 border-2 border-stone-700
                            flex items-center justify-center text-3xl shadow-2xl shadow-amber-500/10">
                            🎭
                        </div>
                    </div>
                    <h3 className="text-white text-lg font-[900] tracking-tight mb-1">Connecting...</h3>
                    <p className="text-stone-500 text-xs font-[600] uppercase tracking-widest font-mono">Securing peer link</p>
                </div>
            )}

            {/* Floating emoji reaction */}
            {reaction && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-9xl pointer-events-none z-30 drop-shadow-2xl
                        animate-bounce select-none">
                    {reaction}
                </div>
            )}

            {/* Partner label */}
            {remoteReady && (
                <div className="absolute bottom-5 left-5 flex items-center gap-2.5
                        bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 shadow-lg z-10 animate-fade-in-up">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-white text-xs font-[800] tracking-wide uppercase">
                        Partner {topic ? `· ${topic}` : ''}
                    </span>
                </div>
            )}

            {/* ── LOCAL VIDEO (PiP) ───────────────────────────────── */}
            <div className="absolute bottom-24 right-5 w-36 h-28 sm:w-48 sm:h-36
                      rounded-3xl overflow-hidden border-2 border-stone-700
                      shadow-2xl z-20 bg-stone-900 ring-4 ring-black/20 transition-all hover:scale-105">

                {camError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-600 bg-stone-950">
                        <span className="text-2xl">📷</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Camera Error</span>
                    </div>
                ) : (
                    <>
                        <video
                            ref={localRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500
                          ${camOff ? 'opacity-0' : 'opacity-100'}`}
                        />
                        {camOff && (
                            <div className="absolute inset-0 bg-linear-to-br from-stone-800 to-stone-900 flex flex-col items-center justify-center gap-2">
                                <span className="text-3xl grayscale opacity-30">📹</span>
                                <span className="text-[9px] text-stone-500 font-[900] uppercase tracking-widest font-mono">Camera Off</span>
                            </div>
                        )}
                    </>
                )}

                {/* "You" label */}
                <div className="absolute bottom-2.5 left-3 text-[9px] text-white/50 font-mono font-[900] uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    You
                </div>
            </div>

        </div>
    );
};

export default VideoArea;