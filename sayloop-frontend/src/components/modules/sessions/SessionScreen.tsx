import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector }            from 'react-redux';
import { sessionActions }                      from '../../../redux/service/session.saga';
import { setInSession }                        from '../../../redux/slice/session.slice';
import { getSocket }                           from '../../../redux/service/socket.service';

const SessionScreen = ({ userId }) => {
  const dispatch   = useDispatch();
  const { partner, roomId, isInitiator, topic, messages, arguments: args } = useSelector((s) => s.session);

  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef          = useRef(null);

  const [message,   setMessage]   = useState('');
  const [argument,  setArgument]  = useState('');
  const [tab,       setTab]       = useState('chat'); // chat | debate
  const [isMuted,   setIsMuted]   = useState(false);
  const [isCamOff,  setIsCamOff]  = useState(false);
  const [timer,     setTimer]     = useState(300); // 5 minute debate timer

  // ── Countdown timer ───────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── WebRTC Setup ──────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    let localStream;

    const startWebRTC = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcRef.current = pc;

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit('ice-candidate', { candidate: e.candidate, to: partner.socketId });
          }
        };

        pc.ontrack = (e) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        };

        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { offer, to: partner.socketId });
        }

        // Listen for WebRTC signals
        socket.on('offer', async ({ offer, from }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { answer, to: from });
        });

        socket.on('answer', async ({ answer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
        });

        dispatch(setInSession());
      } catch (err) {
        console.error('WebRTC error:', err);
      }
    };

    startWebRTC();

    return () => {
      if (pcRef.current) pcRef.current.close();
      if (localStream)   localStream.getTracks().forEach((t) => t.stop());
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [isInitiator, partner.socketId]);

  // ── Controls ──────────────────────────────────────────
  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) stream.getAudioTracks().forEach((t) => (t.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleCam = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) stream.getVideoTracks().forEach((t) => (t.enabled = isCamOff));
    setIsCamOff(!isCamOff);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    dispatch(sessionActions.sendMessage({ userId, message: message.trim() }));
    setMessage('');
  };

  const handleSubmitArgument = () => {
    if (!argument.trim()) return;
    dispatch(sessionActions.submitArgument({ userId, argument: argument.trim() }));
    setArgument('');
  };

  const handleEndDebate = () => dispatch(sessionActions.endDebate());
  const handleSkip      = () => dispatch(sessionActions.skip({ userId, topic }));

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">

      {/* ── Top bar ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#58CC02] rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm">Live Session</span>
          {topic && (
            <span className="bg-[#58CC02]/20 text-[#58CC02] text-xs font-bold px-3 py-1 rounded-full">
              {topic}
            </span>
          )}
        </div>
        {/* Timer */}
        <div className={`font-black text-2xl tabular-nums ${timer < 60 ? 'text-[#FF4B4B]' : 'text-white'}`}>
          {formatTime(timer)}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSkip}      className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">Skip</button>
          <button onClick={handleEndDebate} className="px-4 py-2 rounded-xl bg-[#FF4B4B] text-white text-sm font-bold hover:bg-red-600 transition-colors">End</button>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Videos */}
        <div className="flex-1 flex flex-col gap-4 p-4">
          {/* Remote video (partner) */}
          <div className="flex-1 bg-[#1a1a1a] rounded-[20px] overflow-hidden relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-bold">Partner</span>
            </div>
          </div>

          {/* Local video (you) — small */}
          <div className="h-36 bg-[#1a1a1a] rounded-[16px] overflow-hidden relative self-end w-52">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <span className="text-white text-xs font-bold">You</span>
            </div>
          </div>

          {/* Media controls */}
          <div className="flex justify-center gap-4 py-2">
            <button onClick={toggleMute} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${isMuted ? 'bg-[#FF4B4B]' : 'bg-white/10 hover:bg-white/20'}`}>
              {isMuted ? '🔇' : '🎙️'}
            </button>
            <button onClick={toggleCam} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${isCamOff ? 'bg-[#FF4B4B]' : 'bg-white/10 hover:bg-white/20'}`}>
              {isCamOff ? '📵' : '📹'}
            </button>
          </div>
        </div>

        {/* ── Right panel: Chat / Debate ─────────────── */}
        <div className="w-80 bg-[#1a1a1a] border-l border-white/10 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {['chat', 'debate'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${tab === t ? 'text-[#58CC02] border-b-2 border-[#58CC02]' : 'text-gray-500 hover:text-white'}`}
              >
                {t === 'chat' ? '💬 Chat' : '🗣️ Debate'}
              </button>
            ))}
          </div>

          {/* Messages / Arguments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tab === 'chat' && messages.map((m) => (
              <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-[14px] text-sm font-medium ${m.isMe ? 'bg-[#58CC02] text-white' : 'bg-white/10 text-white'}`}>
                  {m.message}
                </div>
              </div>
            ))}
            {tab === 'debate' && args.map((a) => (
              <div key={a.id} className={`p-3 rounded-[14px] border text-sm ${a.isMe ? 'border-[#58CC02]/40 bg-[#58CC02]/10' : 'border-white/10 bg-white/5'}`}>
                <div className={`text-xs font-bold mb-1 ${a.isMe ? 'text-[#58CC02]' : 'text-[#1CB0F6]'}`}>
                  {a.isMe ? 'You' : 'Partner'}
                </div>
                <p className="text-white leading-relaxed">{a.argument}</p>
              </div>
            ))}
            {tab === 'chat'   && messages.length   === 0 && <p className="text-gray-600 text-xs text-center pt-4">No messages yet</p>}
            {tab === 'debate' && args.length        === 0 && <p className="text-gray-600 text-xs text-center pt-4">No arguments yet</p>}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            {tab === 'chat' ? (
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#58CC02]"
                />
                <button onClick={handleSendMessage} className="w-10 h-10 bg-[#58CC02] rounded-xl flex items-center justify-center text-white font-bold hover:bg-[#46a302] transition-colors">
                  ➤
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={argument}
                  onChange={(e) => setArgument(e.target.value)}
                  placeholder="Type your argument..."
                  rows={3}
                  className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#58CC02] resize-none"
                />
                <button onClick={handleSubmitArgument} className="w-full bg-[#58CC02] text-white rounded-xl py-2 text-sm font-bold hover:bg-[#46a302] transition-colors">
                  Submit Argument
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionScreen;
