import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInSession } from '../../../../redux/slice/session.slice';
import { sessionActions } from '../../../../redux/service/session.saga';
import { getSocket } from '../../../../redux/service/socket.service';

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        // Add TURN server from your .env for production
        // {
        //   urls: import.meta.env.VITE_TURN_URL,
        //   username: import.meta.env.VITE_TURN_USERNAME,
        //   credential: import.meta.env.VITE_TURN_CREDENTIAL,
        // },
    ],
};

export interface WebRTCState {
    muted: boolean;
    camOff: boolean;
    remoteReady: boolean;
    camError: boolean;
    localStream: MediaStream | null;
    // draw cooldown
    canOfferDraw: boolean;
    drawCooldownSec: number;
}

export interface WebRTCActions {
    toggleMute: () => void;
    toggleCam: () => void;
    offerDraw: () => void;
}

export const useWebRTC = (
    localRef: React.RefObject<HTMLVideoElement>,
    remoteRef: React.RefObject<HTMLVideoElement>,
    userId: number,
) => {
    const dispatch = useDispatch();
    const { partner, isInitiator, roomId, drawState } = useSelector((s: any) => s.session);
    const socket = getSocket();

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [muted, setMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [remoteReady, setRemoteReady] = useState(false);
    const [camError, setCamError] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // ── Draw 1-per-minute cooldown ──────────────────────────────────
    const [canOfferDraw, setCanOfferDraw] = useState(true);
    const [drawCooldownSec, setDrawCooldownSec] = useState(0);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startDrawCooldown = useCallback(() => {
        setCanOfferDraw(false);
        setDrawCooldownSec(60);
        cooldownRef.current = setInterval(() => {
            setDrawCooldownSec((s) => {
                if (s <= 1) {
                    clearInterval(cooldownRef.current!);
                    setCanOfferDraw(true);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }, []);

    const offerDraw = useCallback(() => {
        if (!canOfferDraw || drawState !== 'none') return;
        dispatch(sessionActions.offerDraw());
        startDrawCooldown();
    }, [canOfferDraw, drawState, dispatch, startDrawCooldown]);

    // ── Build peer connection ───────────────────────────────────────
    const buildPC = useCallback((stream: MediaStream) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add local tracks
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        // Remote stream → video element
        pc.ontrack = (e) => {
            if (remoteRef.current) {
                remoteRef.current.srcObject = e.streams[0];
            }
            setRemoteReady(true);
            dispatch(setInSession());
        };

        // Send ICE candidates to partner
        pc.onicecandidate = (e) => {
            if (e.candidate && partner?.socketId) {
                socket.emit('ice-candidate', {
                    candidate: e.candidate,
                    to: partner.socketId,
                });
            }
        };

        // Connection state logging
        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            console.log('[WebRTC] Connection state:', state);
            if (state === 'failed') {
                console.warn('[WebRTC] Connection failed — attempting restart');
                pc.restartIce();
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('[WebRTC] ICE state:', pc.iceConnectionState);
        };

        return pc;
    }, [partner?.socketId, dispatch, remoteRef]);

    // ── Init camera + mic, then start WebRTC ───────────────────────
    useEffect(() => {
        let pc: RTCPeerConnection;

        const init = async () => {
            try {
                // Request both video and audio
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
                });

                streamRef.current = stream;
                setLocalStream(stream);

                if (localRef.current) {
                    localRef.current.srcObject = stream;
                }

                pc = buildPC(stream);

                // If I'm the initiator, create and send offer
                if (isInitiator) {
                    const offer = await pc.createOffer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    });
                    await pc.setLocalDescription(offer);
                    socket.emit('offer', { offer, to: partner.socketId });
                    console.log('[WebRTC] Offer sent to', partner.socketId);
                }
            } catch (err) {
                console.error('[WebRTC] getUserMedia failed:', err);
                setCamError(true);
            }
        };

        init();

        // ── Socket signal handlers ──────────────────────────────────
        const onOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
            console.log('[WebRTC] Received offer from', from);
            const currentPC = pcRef.current;
            if (!currentPC) return;
            try {
                await currentPC.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await currentPC.createAnswer();
                await currentPC.setLocalDescription(answer);
                socket.emit('answer', { answer, to: from });
                console.log('[WebRTC] Answer sent to', from);
            } catch (err) {
                console.error('[WebRTC] Error handling offer:', err);
            }
        };

        const onAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log('[WebRTC] Received answer');
            try {
                await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
                console.error('[WebRTC] Error setting answer:', err);
            }
        };

        const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            try {
                if (candidate && pcRef.current) {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error('[WebRTC] Error adding ICE candidate:', err);
            }
        };

        socket.on('offer', onOffer);
        socket.on('answer', onAnswer);
        socket.on('ice-candidate', onIceCandidate);

        return () => {
            socket.off('offer', onOffer);
            socket.off('answer', onAnswer);
            socket.off('ice-candidate', onIceCandidate);
            streamRef.current?.getTracks().forEach((t) => t.stop());
            pcRef.current?.close();
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []); // run once on mount

    // ── Toggle mute ────────────────────────────────────────────────
    const toggleMute = useCallback(() => {
        const audioTracks = streamRef.current?.getAudioTracks() ?? [];
        if (audioTracks.length === 0) return;
        const newEnabled = !audioTracks[0].enabled;
        audioTracks.forEach((t) => { t.enabled = newEnabled; });
        setMuted(!newEnabled);
    }, []);

    // ── Toggle camera ──────────────────────────────────────────────
    const toggleCam = useCallback(() => {
        const videoTracks = streamRef.current?.getVideoTracks() ?? [];
        if (videoTracks.length === 0) return;
        const newEnabled = !videoTracks[0].enabled;
        videoTracks.forEach((t) => { t.enabled = newEnabled; });
        setCamOff(!newEnabled);
    }, []);

    const state: WebRTCState = {
        muted, camOff, remoteReady, camError, localStream,
        canOfferDraw, drawCooldownSec,
    };

    const actions: WebRTCActions = { toggleMute, toggleCam, offerDraw };

    return { state, actions };
};