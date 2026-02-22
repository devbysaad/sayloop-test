import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { useWebRTC } from './Userwebrtc';
import SidePanel from './Sidepanel';
import { DrawBanner, ResignModal, ControlBar } from './SessionControls';

// ── VIDEO AREA ─────────────────────────────────────────────────

interface VideoAreaProps {
  localRef: React.RefObject<HTMLVideoElement>;
  remoteRef: React.RefObject<HTMLVideoElement>;
  remoteReady: boolean;
  camOff: boolean;
  camError: boolean;
  topic: string | null;
  reaction: string | null;
}

export const VideoArea = ({ localRef, remoteRef, remoteReady, camOff, camError, topic, reaction }: VideoAreaProps) => (
  <div className="flex-1 relative overflow-hidden bg-gray-900">
    <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />

    {/* Waiting overlay */}
    {!remoteReady && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
        <style>{`
          @keyframes spin { to{transform:rotate(360deg)} }
          .spin-ring { animation: spin 3s linear infinite; }
        `}</style>
        <div className="relative w-24 h-24 mb-6">
          <div className="spin-ring absolute inset-0 rounded-full border-4 border-dashed border-amber-400/30" />
          <div className="absolute inset-4 rounded-full bg-gray-800 flex items-center justify-center text-3xl border border-gray-700">
            📡
          </div>
        </div>
        <p className="text-white/70 text-sm font-semibold">Connecting to partner...</p>
        <p className="text-white/30 text-xs mt-1 font-mono">Establishing connection</p>
      </div>
    )}

    {/* Floating reaction */}
    {reaction && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none z-20 drop-shadow-2xl"
        style={{ animation: 'bounce .5s ease' }}>
        {reaction}
      </div>
    )}

    {/* Partner label */}
    {remoteReady && (
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-2xl px-3 py-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-white/80 text-xs font-semibold">Partner{topic ? ` · ${topic}` : ''}</span>
      </div>
    )}

    {/* Local PiP */}
    <div className="absolute bottom-20 right-3 w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden z-10 bg-gray-800"
      style={{ border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 6px 24px rgba(0,0,0,0.5)' }}>
      {camError ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-white/30">
          <span className="text-2xl">📷</span>
          <span className="text-[9px] font-mono">No camera</span>
        </div>
      ) : (
        <>
          <video ref={localRef} autoPlay muted playsInline className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)', opacity: camOff ? 0 : 1, transition: 'opacity .2s' }} />
          {camOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-2xl">📷</div>
          )}
        </>
      )}
      <div className="absolute bottom-1.5 left-2 text-[9px] text-white/40 font-mono">You</div>
    </div>
  </div>
);

// ── SESSION SCREEN ─────────────────────────────────────────────

const Session = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { topic, drawState } = useSelector((s: any) => s.session);

  const localRef  = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const { state: rtc, actions: rtcActions } = useWebRTC(localRef, remoteRef, userId);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const [reaction, setReaction] = useState<string | null>(null);
  const handleReaction = (e: string) => { setReaction(e); setTimeout(() => setReaction(null), 2500); };

  const [showResign, setShowResign] = useState(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
      <div className="h-screen flex flex-col overflow-hidden bg-white relative select-none"
        style={{ fontFamily: "'Nunito', sans-serif" }}>

        <DrawBanner drawState={drawState} />
        {showResign && (
          <ResignModal
            onConfirm={() => { setShowResign(false); dispatch(sessionActions.resign()); }}
            onCancel={() => setShowResign(false)}
          />
        )}

        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 shrink-0 bg-white border-b-2 border-amber-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>💬</div>
            {topic && (
              <span className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 rounded-full px-3 py-1.5 text-xs"
                style={{ fontWeight: 800, color: '#92400e' }}>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {topic}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm font-bold">{fmt(elapsed)}</span>
          </div>

          <div className="w-24" />
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <VideoArea
              localRef={localRef} remoteRef={remoteRef}
              remoteReady={rtc.remoteReady} camOff={rtc.camOff}
              camError={rtc.camError} topic={topic} reaction={reaction}
            />
            <ControlBar
              muted={rtc.muted} camOff={rtc.camOff}
              canOfferDraw={rtc.canOfferDraw} drawCooldownSec={rtc.drawCooldownSec}
              drawState={drawState}
              onToggleMute={rtcActions.toggleMute} onToggleCam={rtcActions.toggleCam}
              onOfferDraw={rtcActions.offerDraw} onReaction={handleReaction}
              onResign={() => setShowResign(true)}
            />
          </div>
          <SidePanel userId={userId} />
        </div>
      </div>
    </>
  );
};

export default Session;