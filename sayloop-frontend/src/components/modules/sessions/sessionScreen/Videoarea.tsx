import React from 'react';

interface Props {
    localRef: React.RefObject<HTMLVideoElement>;
    remoteRef: React.RefObject<HTMLVideoElement>;
    remoteReady: boolean;
    camOff: boolean;
    camError: boolean;
    topic: string | null;
    reaction: string | null;
}

const VideoArea = ({ localRef, remoteRef, remoteReady, camOff, camError, topic, reaction }: Props) => {
    return (
        <div className="flex-1 relative bg-stone-950 overflow-hidden">

            {/* ── REMOTE VIDEO (full area) ────────────────────────── */}
            <video
                ref={remoteRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* No remote stream yet — placeholder */}
            {!remoteReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                        <span className="absolute w-24 h-24 rounded-full border-2 border-stone-600 opacity-40 animate-ping" />
                        <span className="absolute w-16 h-16 rounded-full border-2 border-stone-600 opacity-60 animate-ping [animation-delay:400ms]" />
                        <div className="relative z-10 w-14 h-14 rounded-full bg-stone-700 border-2 border-stone-600
                            flex items-center justify-center text-2xl">
                            🎭
                        </div>
                    </div>
                    <p className="text-stone-400 text-sm font-medium">Connecting to partner…</p>
                    <p className="text-stone-600 text-xs mt-1 font-mono">Establishing peer connection</p>
                </div>
            )}

            {/* Floating emoji reaction */}
            {reaction && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-8xl pointer-events-none z-20 drop-shadow-2xl
                        animate-bounce">
                    {reaction}
                </div>
            )}

            {/* Partner label */}
            {remoteReady && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2
                        bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-semibold">
                        Partner {topic ? `· ${topic}` : ''}
                    </span>
                </div>
            )}

            {/* ── LOCAL VIDEO (PiP) ───────────────────────────────── */}
            <div className="absolute bottom-20 right-3 w-32 h-24 sm:w-40 sm:h-28
                      rounded-2xl overflow-hidden border-2 border-stone-600
                      shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-10 bg-stone-800">

                {camError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-500">
                        <span className="text-xl">📷</span>
                        <span className="text-[9px] font-mono">No camera</span>
                    </div>
                ) : (
                    <>
                        <video
                            ref={localRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-200
                          ${camOff ? 'opacity-0' : 'opacity-100'}`}
                        />
                        {camOff && (
                            <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                                <span className="text-2xl">📷</span>
                            </div>
                        )}
                    </>
                )}

                {/* "You" label */}
                <div className="absolute bottom-1.5 left-2 text-[9px] text-white/60 font-mono font-medium">
                    You
                </div>
            </div>

        </div>
    );
};

export default VideoArea;