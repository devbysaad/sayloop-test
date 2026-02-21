import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInSession } from '../../../../redux/slice/session.slice';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { getSocket } from '../../../../redux/service/socket.service';

// Add TURN credentials from your .env file.
// For localhost testing the STUN servers below are enough.
// Uncomment the TURN block if testing across different networks.
const buildIceServers = (): RTCConfiguration => ({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // {
    //   urls:       import.meta.env.VITE_TURN_URL,
    //   username:   import.meta.env.VITE_TURN_USERNAME,
    //   credential: import.meta.env.VITE_TURN_CREDENTIAL,
    // },
  ],
});

export interface WebRTCState {
  muted:          boolean;
  camOff:         boolean;
  remoteReady:    boolean;
  camError:       boolean;
  localStream:    MediaStream | null;
  canOfferDraw:   boolean;
  drawCooldownSec:number;
}

export interface WebRTCActions {
  toggleMute: () => void;
  toggleCam:  () => void;
  offerDraw:  () => void;
}

export const useWebRTC = (
  localRef:  React.RefObject<HTMLVideoElement>,
  remoteRef: React.RefObject<HTMLVideoElement>,
  userId:    number,
) => {
  const dispatch = useDispatch();

  // Read Redux state via refs so the useEffect closure always gets fresh values.
  // Without refs, the effect captures stale values from the first render.
  const sessionState = useSelector((s: any) => s.session);
  const sessionRef   = useRef(sessionState);
  useEffect(() => {
    sessionRef.current = sessionState;
  }, [sessionState]);

  const socket  = getSocket();
  const pcRef   = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [muted,       setMuted]       = useState(false);
  const [camOff,      setCamOff]      = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [camError,    setCamError]    = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Draw offer: one per minute cooldown
  const [canOfferDraw,    setCanOfferDraw]    = useState(true);
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
    const { drawState } = sessionRef.current;
    if (!canOfferDraw || drawState !== 'none') return;
    dispatch(sessionActions.offerDraw());
    startDrawCooldown();
  }, [canOfferDraw, dispatch, startDrawCooldown]);

  // Builds the RTCPeerConnection and wires up track and ICE handlers
  const buildPC = useCallback((stream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection(buildIceServers());
    pcRef.current = pc;

    // Add local camera and mic tracks to the connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // When we receive the remote video/audio stream, attach it to the video element
    pc.ontrack = (event) => {
      if (remoteRef.current) {
        remoteRef.current.srcObject = event.streams[0];
      }
      setRemoteReady(true);
      dispatch(setInSession());
    };

    // Send our network candidates to the partner through the server
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      const partner = sessionRef.current.partner;
      if (partner?.socketId) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to:        partner.socketId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] connection state:', pc.connectionState);
      if (pc.connectionState === 'failed') {
        console.warn('[WebRTC] connection failed, restarting ICE');
        pc.restartIce();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state:', pc.iceConnectionState);
    };

    return pc;
  }, [dispatch, remoteRef, socket]);

  // Main setup: runs once when the component mounts
  useEffect(() => {
    const init = async () => {
      try {
        // Ask the browser for camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });

        streamRef.current = stream;
        setLocalStream(stream);

        // Show our own video in the small PiP box
        if (localRef.current) {
          localRef.current.srcObject = stream;
        }

        const pc = buildPC(stream);

        // The initiator (the user who joined second, matched first) sends the offer.
        // We read from the ref to get the current Redux value, not the stale closure.
        const { isInitiator, partner } = sessionRef.current;

        if (isInitiator) {
          if (!partner?.socketId) {
            console.error('[WebRTC] isInitiator is true but partner.socketId is missing');
            return;
          }
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

    // Socket signal handlers: these are registered here so only this hook
    // processes them. The saga deliberately does NOT handle offer/answer/ice-candidate.

    const onOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('[WebRTC] Received offer from', from);
      const pc = pcRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
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

    socket.on('offer',         onOffer);
    socket.on('answer',        onAnswer);
    socket.on('ice-candidate', onIceCandidate);

    init();

    // Cleanup: stop camera, close peer connection, remove socket listeners
    return () => {
      socket.off('offer',         onOffer);
      socket.off('answer',        onAnswer);
      socket.off('ice-candidate', onIceCandidate);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []); // intentionally empty — we use refs for fresh values

  const toggleMute = useCallback(() => {
    const tracks = streamRef.current?.getAudioTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach((t) => { t.enabled = next; });
    setMuted(!next);
  }, []);

  const toggleCam = useCallback(() => {
    const tracks = streamRef.current?.getVideoTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach((t) => { t.enabled = next; });
    setCamOff(!next);
  }, []);

  const state: WebRTCState = {
    muted, camOff, remoteReady, camError, localStream,
    canOfferDraw, drawCooldownSec,
  };

  const actions: WebRTCActions = { toggleMute, toggleCam, offerDraw };

  return { state, actions };
};