import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/service/session.saga';
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

    // Video refs passed down to VideoArea + useWebRTC
    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    // WebRTC logic lives entirely in the hook
    const { state: rtc, actions: rtcActions } = useWebRTC(localRef, remoteRef, userId);

    // Timer
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(id);
    }, []);
    const fmtTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // Floating reaction
    const [reaction, setReaction] = useState<string | null>(null);
    const handleReaction = (emoji: string) => {
        setReaction(emoji);
        setTimeout(() => setReaction(null), 2500);
    };

    // Resign modal
    const [showResign, setShowResign] = useState(false);
    const handleResignConfirm = () => {
        setShowResign(false);
        dispatch(sessionActions.resign());
    };

    return (
        <div className="h-screen bg-stone-900 flex flex-col overflow-hidden relative select-none">

            {/* ── OVERLAYS ───────────────────────────────────────── */}
            <DrawBanner drawState={drawState} />
            {showResign && (
                <ResignModal
                    onConfirm={handleResignConfirm}
                    onCancel={() => setShowResign(false)}
                />
            )}

            {/* ── TOP BAR ────────────────────────────────────────── */}
            <header className="flex items-center justify-between px-5 py-3
                         bg-stone-900 border-b border-stone-800 shrink-0 z-10">

                {/* Left: brand + topic */}
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-stone-500 tracking-widest uppercase hidden sm:block">
                        Sayloop
                    </span>
                    {topic && (
                        <span className="flex items-center gap-1.5 bg-stone-800 border border-stone-700
                             text-stone-300 text-xs font-semibold rounded-full px-3 py-1.5">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            {topic}
                        </span>
                    )}
                </div>

                {/* Center: live timer */}
                <div className="flex items-center gap-2 bg-stone-800 rounded-full px-4 py-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-mono text-sm font-semibold text-stone-200">
                        {fmtTime(elapsed)}
                    </span>
                </div>

                {/* Right: nothing — resign is in ControlBar */}
                <div className="w-20" />
            </header>

            {/* ── MAIN BODY ──────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Video column */}
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

                {/* Side panel (desktop only) */}
                <SidePanel userId={userId} />

            </div>
        </div>
    );
};

export default SessionScreen;