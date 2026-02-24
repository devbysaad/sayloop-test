import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { useWebRTC } from './Userwebrtc';
import VideoArea from './Videoarea';
import ControlBar from './Controlbar';
import SidePanel from './Sidepanel';
import DrawBanner from './Drawbanner';
import ResignModal from './Resignmodal';

interface Props {
  userId: number;
}

const SessionScreen = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { topic, drawState } = useSelector((s: any) => s.session);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const { state: rtc, actions: rtcActions } = useWebRTC(localRef, remoteRef, userId);

  // Session timer counts up from 0
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Floating emoji reaction (shown on the remote video briefly)
  const [reaction, setReaction] = useState<string | null>(null);
  const handleReaction = (emoji: string) => {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 2500);
  };

  // Resign confirmation modal
  const [showResign, setShowResign] = useState(false);
  const handleResignConfirm = () => {
    setShowResign(false);
    dispatch(sessionActions.resign());
  };

  return (
    <div className="h-screen bg-stone-950 flex flex-col overflow-hidden relative select-none font-sans">

      {/* Draw offer banner (shows when drawState is offered or received) */}
      <DrawBanner drawState={drawState} />

      {/* Resign confirmation dialog */}
      {showResign && (
        <ResignModal
          onConfirm={handleResignConfirm}
          onCancel={() => setShowResign(false)}
        />
      )}

      {/* Top bar: brand, topic badge, live timer */}
      <header className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b-2 border-stone-800/50 shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm shadow-lg shadow-orange-500/20">💬</div>
            <span className="text-sm font-[900] text-stone-200 tracking-tight uppercase hidden sm:block">
              Sayloop <span className="text-amber-500">Live</span>
            </span>
          </div>

          {topic && (
            <div className="flex items-center gap-2 bg-stone-800 border border-stone-700/50 text-stone-300 text-[11px] font-[800] rounded-2xl px-3.5 py-1.5 uppercase tracking-wider shadow-inner">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              {topic}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 bg-stone-800 rounded-2xl px-4.5 py-2 border border-stone-700/50 shadow-inner">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <span className="font-mono text-sm font-[900] text-stone-100 tracking-tighter">
            {fmtTime(elapsed)}
          </span>
        </div>

        <div className="w-10 sm:w-20" />
      </header>

      {/* Main content: video area + side panel */}
      <div className="flex flex-1 overflow-hidden bg-stone-950">

        {/* Left: video + control bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <VideoArea
            localRef={localRef}
            remoteRef={remoteRef}
            remoteReady={rtc.remoteReady}
            camOff={rtc.camOff}
            camError={rtc.camError}
            topic={topic}
            reaction={reaction}
          />

          <ControlBar
            muted={rtc.muted}
            camOff={rtc.camOff}
            canOfferDraw={rtc.canOfferDraw}
            drawCooldownSec={rtc.drawCooldownSec}
            drawState={drawState}
            onToggleMute={rtcActions.toggleMute}
            onToggleCam={rtcActions.toggleCam}
            onOfferDraw={rtcActions.offerDraw}
            onReaction={handleReaction}
            onResign={() => setShowResign(true)}
          />
        </div>

        {/* Right: chat and debate panel (desktop only) */}
        <SidePanel userId={userId} />
      </div>
    </div>
  );
};

export default SessionScreen;