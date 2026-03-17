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

const VideoArea = ({ localRef, remoteRef, remoteReady, camOff, camError, topic, reaction }: Props) => (
  <div className="flex-1 relative overflow-hidden" style={{ background:'#08080F' }}>

    {/* ── Remote video (full area — Omegle style) ── */}
    <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />

    {/* Connecting overlay */}
    {!remoteReady && (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
        style={{ background:'#0B0B18' }}>
        {/* Glow rings */}
        <div className="relative flex items-center justify-center w-36 h-36 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ border:'2px solid #7C3AED' }} />
          <div className="absolute inset-4 rounded-full animate-ping opacity-15"
            style={{ border:'2px solid #22D3EE', animationDelay:'0.5s' }} />
          <div className="absolute inset-8 rounded-full animate-ping opacity-10"
            style={{ border:'2px solid #A3E635', animationDelay:'1s' }} />
          <div className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border"
            style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(34,211,238,0.2))', borderColor:'rgba(124,58,237,0.4)' }}>
            🎭
          </div>
        </div>
        <h3 className="text-white text-xl font-black tracking-tight mb-2">Connecting...</h3>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Securing peer link</p>
        {/* Loading bar */}
        <div className="mt-5 w-48 h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
            style={{ background:'linear-gradient(90deg,#7C3AED,#22D3EE)', width:'60%', animation:'loadSlide 1.5s ease-in-out infinite' }} />
        </div>
        <style>{`
          @keyframes loadSlide {
            0%{transform:translateX(-100%);} 100%{transform:translateX(200%);}
          }
        `}</style>
      </div>
    )}

    {/* Floating emoji reaction */}
    {reaction && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl pointer-events-none z-30 drop-shadow-2xl animate-bounce select-none">
        {reaction}
      </div>
    )}

    {/* Partner label (Discord user chip style) */}
    {remoteReady && (
      <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl px-4 py-2 border z-10"
        style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', borderColor:'rgba(124,58,237,0.3)' }}>
        <span className="w-2.5 h-2.5 bg-lime-400 rounded-full animate-pulse shadow-lg" style={{ boxShadow:'0 0 8px rgba(163,230,53,0.7)' }} />
        <span className="text-white text-xs font-black tracking-wide uppercase">
          Partner {topic ? `· ${topic}` : ''}
        </span>
      </div>
    )}

    {/* ── Local video PiP (Discord camera view) ── */}
    <div className="absolute bottom-20 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden z-20 hover:scale-105 transition-transform duration-200 shadow-2xl border-2"
      style={{ background:'#0B0B15', borderColor:'rgba(124,58,237,0.5)', boxShadow:'0 0 20px rgba(124,58,237,0.3)' }}>

      {camError ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color:'rgba(156,163,175,1)' }}>
          <span className="text-2xl">📷</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Camera Error</span>
        </div>
      ) : (
        <>
          <video ref={localRef} autoPlay muted playsInline
            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${camOff ? 'opacity-0' : 'opacity-100'}`} />
          {camOff && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background:'linear-gradient(135deg,#0B0B15,#1A1A2E)' }}>
              <span className="text-3xl opacity-30">📹</span>
              <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Camera Off</span>
            </div>
          )}
        </>
      )}

      {/* "You" label */}
      <div className="absolute bottom-2 left-2.5 rounded-md px-1.5 py-0.5 text-[9px] text-white/50 font-black uppercase tracking-tighter"
        style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }}>
        You
      </div>

      {/* Violet glow border effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow:'inset 0 0 16px rgba(124,58,237,0.2)' }} />
    </div>
  </div>
);

export default VideoArea;