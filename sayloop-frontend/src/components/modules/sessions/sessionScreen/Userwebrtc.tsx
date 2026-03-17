import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInSession } from '../../../../redux/slice/session.slice';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { getSocket } from '../../../../redux/service/socket.service';

const buildIceServers = (): RTCConfiguration => ({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: import.meta.env.VITE_TURN_URL,
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
  ],
});

export interface WebRTCState {
  muted: boolean;
  camOff: boolean;
  remoteReady: boolean;
  camError: boolean;
  localStream: MediaStream | null;
  canOfferDraw: boolean;
  drawCooldownSec: number;
}

export interface WebRTCActions {
  toggleMute: () => void;
  toggleCam: () => void;
  offerDraw: () => void;
}

export const useWebRTC = (
  localRef: React.RefObject<HTMLVideoElement | null>,
  remoteRef: React.RefObject<HTMLVideoElement | null>,
  _userId: number,
) => {
  const dispatch = useDispatch();

  const sessionState = useSelector((s: any) => s.session);
  const sessionRef = useRef(sessionState);
  useEffect(() => { sessionRef.current = sessionState; }, [sessionState]);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // ── ICE candidate buffer ──────────────────────────────────────────────────
  // Candidates that arrive before setRemoteDescription is called are buffered
  // here and drained once the remote description is set.
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);

  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [camError, setCamError] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [canOfferDraw, setCanOfferDraw] = useState(true);
  const [drawCooldownSec, setDrawCooldownSec] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDrawCooldown = useCallback(() => {
    setCanOfferDraw(false);
    setDrawCooldownSec(60);
    cooldownRef.current = setInterval(() => {
      setDrawCooldownSec(s => {
        if (s <= 1) { clearInterval(cooldownRef.current!); setCanOfferDraw(true); return 0; }
        return s - 1;
      });
    }, 1000);
  }, []);

  const offerDraw = useCallback(() => {
    const { drawState } = sessionRef.current;
    if (!canOfferDraw || drawState === 'offered' || drawState === 'received') return;
    dispatch(sessionActions.offerDraw());
    startDrawCooldown();
  }, [canOfferDraw, dispatch, startDrawCooldown]);

  /**
   * Drain any buffered ICE candidates into the peer connection.
   * Call this after setRemoteDescription completes.
   */
  const drainIceCandidates = useCallback(async (pc: RTCPeerConnection) => {
    const buffered = iceCandidateBuffer.current.splice(0);
    if (buffered.length > 0) {
      console.log(`[WebRTC] Draining ${buffered.length} buffered ICE candidates`);
    }
    for (const candidate of buffered) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTC] Buffered ICE candidate failed:', err);
      }
    }
  }, []);

  const buildPC = useCallback((stream: MediaStream, socket: ReturnType<typeof getSocket>): RTCPeerConnection => {
    const pc = new RTCPeerConnection(buildIceServers());
    pcRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = event => {
      console.log('[WebRTC] Remote track received — stream connected ✅');
      if (remoteRef.current) remoteRef.current.srcObject = event.streams[0];
      setRemoteReady(true);
      dispatch(setInSession());
    };

    pc.onicecandidate = event => {
      if (!event.candidate) return;
      const partner = sessionRef.current.partner;
      if (partner?.socketId) {
        socket?.emit('ice-candidate', { candidate: event.candidate, to: partner.socketId });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] connection state:', pc.connectionState);
      if (pc.connectionState === 'failed') {
        console.warn('[WebRTC] connection failed — restarting ICE');
        pc.restartIce();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state:', pc.iceConnectionState);
    };

    return pc;
  }, [dispatch, remoteRef]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn('[WebRTC] socket not available — skipping init');
      return;
    }

    const init = async () => {
      try {
        console.log('[WebRTC] Requesting camera/mic...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });

        streamRef.current = stream;
        setLocalStream(stream);
        if (localRef.current) localRef.current.srcObject = stream;
        console.log('[WebRTC] Got local stream ✅');

        const pc = buildPC(stream, socket);

        const { isInitiator } = sessionRef.current;
        console.log('[WebRTC] isInitiator:', isInitiator);

        if (isInitiator) {
          let partnerSocketId = sessionRef.current.partner?.socketId;
          let retries = 0;
          while (!partnerSocketId && retries < 20) {
            await new Promise(r => setTimeout(r, 500));
            partnerSocketId = sessionRef.current.partner?.socketId;
            retries++;
          }

          if (!partnerSocketId) {
            console.error('[WebRTC] isInitiator=true but partner.socketId still missing after retries');
            return;
          }

          const offer = await pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
          await pc.setLocalDescription(offer);
          socket.emit('offer', { offer, to: partnerSocketId });
          console.log('[WebRTC] Offer sent to', partnerSocketId);
        }
      } catch (err) {
        console.error('[WebRTC] getUserMedia failed:', err);
        setCamError(true);
      }
    };

    const onOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('[WebRTC] Received offer from', from);

      // Wait for pcRef to be set
      let attempts = 0;
      while (!pcRef.current && attempts < 30) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }

      const pc = pcRef.current;
      if (!pc) {
        console.error('[WebRTC] pcRef still null — offer dropped');
        return;
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('[WebRTC] Remote description set (offer) ✅ — draining ICE buffer');
        await drainIceCandidates(pc);

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
        const pc = pcRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('[WebRTC] Remote description set (answer) ✅ — draining ICE buffer');
        await drainIceCandidates(pc);
      } catch (err) {
        console.error('[WebRTC] Error setting answer:', err);
      }
    };

    const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (!candidate) return;
      const pc = pcRef.current;
      if (!pc || !pc.remoteDescription) {
        // Buffer it — remote description not set yet
        console.log('[WebRTC] Buffering ICE candidate (remote description not ready yet)');
        iceCandidateBuffer.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTC] ICE candidate error (ignored):', err);
      }
    };

    socket.on('offer', onOffer);
    socket.on('answer', onAnswer);
    socket.on('ice-candidate', onIceCandidate);

    init();

    return () => {
      socket.off('offer', onOffer);
      socket.off('answer', onAnswer);
      socket.off('ice-candidate', onIceCandidate);
      streamRef.current?.getTracks().forEach(t => t.stop());
      pcRef.current?.close();
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      iceCandidateBuffer.current = [];
    };
  }, []);

  const toggleMute = useCallback(() => {
    const tracks = streamRef.current?.getAudioTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach(t => { t.enabled = next; });
    setMuted(!next);
    console.log('[Session] Mic toggled →', next ? 'ON 🎤' : 'OFF 🔇');
  }, []);

  const toggleCam = useCallback(() => {
    const tracks = streamRef.current?.getVideoTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach(t => { t.enabled = next; });
    setCamOff(!next);
    console.log('[Session] Camera toggled →', next ? 'ON 📹' : 'OFF 📷');
  }, []);

  return {
    state: { muted, camOff, remoteReady, camError, localStream, canOfferDraw, drawCooldownSec } as WebRTCState,
    actions: { toggleMute, toggleCam, offerDraw } as WebRTCActions,
  };
};