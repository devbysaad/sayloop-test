import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { useWebRTC } from './Userwebrtc';
import DrawBanner from './Drawbanner';
import ResignModal from './Resignmodal';

interface Props { userId: number; }

const REACTIONS = ['👍', '👏', '😂', '🔥', '❤️', '😮'];

const SessionScreen = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { topic, drawState, messages, arguments: args } = useSelector((s: any) => s.session);

  const localRef  = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const { state: rtc, actions: rtcActions } = useWebRTC(localRef, remoteRef, userId);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Reaction float
  const [reaction, setReaction] = useState<string | null>(null);
  const handleReaction = (e: string) => { setReaction(e); setTimeout(() => setReaction(null), 2500); };

  // Resign
  const [showResign, setShowResign] = useState(false);

  // Chat
  const [chatTab, setChatTab] = useState<'chat' | 'debate'>('chat');
  const [chatOpen, setChatOpen] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [argInput, setArgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, args, chatTab]);

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    dispatch(sessionActions.sendMessage({ message: msgInput.trim() }));
    setMsgInput('');
  };
  const sendArg = () => {
    if (!argInput.trim()) return;
    dispatch(sessionActions.submitArgument({ argument: argInput.trim() }));
    setArgInput('');
  };

  const drawDisabled = !rtc.canOfferDraw || drawState === 'offered' || drawState === 'received';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .sess * { font-family:'Outfit',sans-serif; }
        .slide-up { animation: slideUp 0.3s ease; }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0;} to{transform:translateY(0);opacity:1;} }
        .live-dot { animation:ld 1.4s ease-in-out infinite; }
        @keyframes ld { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.8);opacity:0.4;} }
        .react-btn:hover { transform:scale(1.3); }
        .react-btn { transition:transform 0.15s; }
        video::-webkit-media-controls { display:none !important; }
        .chat-panel { transition:height 0.35s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="sess h-screen flex flex-col overflow-hidden bg-slate-100" style={{ fontFamily:"'Outfit', sans-serif" }}>

        <DrawBanner drawState={drawState} />
        {showResign && (
          <ResignModal
            onConfirm={() => { setShowResign(false); dispatch(sessionActions.resign()); }}
            onCancel={() => setShowResign(false)}
          />
        )}

        {/* ═══ TOP BAR ═══ */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-slate-100 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg text-white shadow-md"
              style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
            <span className="text-base font-black text-slate-800 hidden sm:block">SayLoop <span className="text-green-500">Live</span></span>
            {topic && (
              <div className="flex items-center gap-1.5 bg-green-50 border-2 border-green-200 rounded-full px-3 py-1 text-xs font-black text-green-700 uppercase tracking-wider">
                <span className="live-dot w-1.5 h-1.5 bg-green-500 rounded-full" />{topic}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 bg-blue-50 border-2 border-blue-200 rounded-full px-3.5 py-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-sm font-black text-blue-700">{fmtTime(elapsed)}</span>
            </div>
            {/* Mobile chat toggle */}
            <button onClick={() => setChatOpen(o => !o)}
              className="flex lg:hidden items-center gap-1.5 bg-blue-50 border-2 border-blue-200 rounded-full px-3 py-1.5 text-blue-600 text-xs font-black"
            >
              💬 Chat {messages.length > 0 && <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">{messages.length}</span>}
            </button>
          </div>
        </header>

        {/* ═══ MAIN: 50/50 VIDEO AREA ═══ */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden gap-1 p-1 bg-slate-200">

          {/* LEFT — Opponent */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-800 shadow-lg min-h-[35vh] sm:min-h-0">
            <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />

            {/* Connecting placeholder */}
            {!rtc.remoteReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background:'#1E293B' }}>
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
                  <div className="absolute inset-3 rounded-full border-4 border-orange-400/20 animate-ping" style={{ animationDelay:'0.5s' }} />
                  <div className="w-16 h-16 rounded-2xl bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-3xl">🎭</div>
                </div>
                <p className="text-white font-black text-base mb-1">Connecting...</p>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Setting up peer link</p>
                <div className="mt-4 w-40 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ background:'linear-gradient(90deg,#3B82F6,#22C55E)', width:'100%', animation:'loadBar 1.5s ease-in-out infinite' }} />
                </div>
                <style>{`@keyframes loadBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }`}</style>
              </div>
            )}

            {/* Floating reaction */}
            {reaction && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none z-30 animate-bounce drop-shadow-2xl">{reaction}</div>
            )}

            {/* Partner label */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/60 shadow-sm">
              <span className="live-dot w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-700 text-xs font-black">Partner {topic ? `· ${topic}` : ''}</span>
            </div>
            <div className="absolute bottom-3 left-3 text-slate-200 text-xs bg-black/40 rounded-lg px-2.5 py-1 font-black backdrop-blur-sm">OPPONENT</div>
          </div>

          {/* RIGHT — You */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 shadow-lg min-h-[35vh] sm:min-h-0">
            <video ref={localRef} autoPlay muted playsInline
              className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${rtc.camOff ? 'opacity-0' : 'opacity-100'}`} />

            {/* Cam off overlay */}
            {rtc.camOff && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                <span className="text-5xl opacity-30 mb-2">📹</span>
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Camera Off</span>
              </div>
            )}
            {/* Cam error */}
            {rtc.camError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                <span className="text-5xl opacity-30 mb-2">📷</span>
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Camera Error</span>
              </div>
            )}

            <div className="absolute top-3 right-3 bg-blue-600 rounded-xl px-3 py-1.5 shadow-md">
              <span className="text-white text-xs font-black">YOU</span>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM PANEL: controls + inline chat ═══ */}
        <div className="shrink-0 bg-white border-t-2 border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">

          {/* Control bar */}
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3 flex-wrap">

            {/* Mic + Cam */}
            <div className="flex gap-2">
              <button onClick={rtcActions.toggleMute}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90 border-2"
                style={rtc.muted
                  ? { background:'#EF4444', borderColor:'#EF4444', color:'white', boxShadow:'0 4px 12px rgba(239,68,68,0.4)' }
                  : { background:'#EFF6FF', borderColor:'#BFDBFE', color:'#3B82F6' }
                }>
                {rtc.muted ? '🔇' : '🎤'}
              </button>
              <button onClick={rtcActions.toggleCam}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90 border-2"
                style={rtc.camOff
                  ? { background:'#EF4444', borderColor:'#EF4444', color:'white', boxShadow:'0 4px 12px rgba(239,68,68,0.4)' }
                  : { background:'#F0FDF4', borderColor:'#BBF7D0', color:'#22C55E' }
                }>
                {rtc.camOff ? '📷' : '📹'}
              </button>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-2 py-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {REACTIONS.map(e => (
                <button key={e} onClick={() => handleReaction(e)}
                  className="react-btn w-9 h-9 rounded-[14px] flex items-center justify-center text-lg border-none bg-transparent cursor-pointer">
                  {e}
                </button>
              ))}
            </div>

            {/* Chat toggle (desktop) + Draw + Resign */}
            <div className="flex items-center gap-2">
              <button onClick={() => setChatOpen(o => !o)}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-black border-2 transition-all"
                style={chatOpen
                  ? { background:'#EFF6FF', borderColor:'#3B82F6', color:'#3B82F6' }
                  : { background:'#F8FAFC', borderColor:'#E2E8F0', color:'#64748B' }
                }>
                💬 {chatOpen ? 'Hide Chat' : 'Show Chat'}
              </button>

              <button onClick={rtcActions.offerDraw} disabled={drawDisabled}
                className="hidden sm:block px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all"
                style={drawDisabled
                  ? { background:'#F8FAFC', borderColor:'#E2E8F0', color:'#CBD5E1', cursor:'not-allowed' }
                  : { background:'#FFF7ED', borderColor:'#FED7AA', color:'#F97316' }
                }>
                {rtc.drawCooldownSec > 0 ? `Draw (${rtc.drawCooldownSec}s)` : 'Offer Draw'}
              </button>

              <button onClick={() => setShowResign(true)}
                className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border-2 bg-red-50 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                Resign ✕
              </button>
            </div>
          </div>

          {/* Chat panel (slides in/out below control bar) */}
          {chatOpen && (
            <div className="slide-up border-t-2 border-slate-100 flex flex-col" style={{ height:'260px' }}>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 shrink-0">
                {(['chat','debate'] as const).map(t => (
                  <button key={t} onClick={() => setChatTab(t)}
                    className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-none cursor-pointer transition-all relative"
                    style={{ background:'transparent', color: chatTab===t ? '#3B82F6' : '#94A3B8' }}>
                    {t==='chat' ? '💬 Chat' : '⚔️ Debate'}
                    {chatTab===t && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full" style={{ background:'linear-gradient(90deg,#3B82F6,#22C55E)' }} />}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
                {chatTab==='chat' ? (
                  messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-3xl mb-2 opacity-30">💬</div>
                      <p className="text-slate-400 text-sm font-black">No messages yet</p>
                    </div>
                  ) : messages.map((m: any) => (
                    <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl font-medium shadow-sm ${m.isMe ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-slate-700 bg-white border border-slate-100'}`}
                        style={m.isMe ? { background:'linear-gradient(135deg,#3B82F6,#22C55E)' } : {}}>
                        {m.message}
                        <div className="text-[9px] mt-1 opacity-60 font-mono">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  args.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-3xl mb-2 opacity-30">⚔️</div>
                      <p className="text-slate-400 text-sm font-black">No arguments yet</p>
                    </div>
                  ) : args.map((a: any, i: number) => (
                    <div key={a.id} className={`rounded-2xl p-3.5 border-2 text-sm ${a.isMe ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-black"
                          style={{ background: a.isMe ? '#3B82F6' : '#94A3B8' }}>{i+1}</span>
                        <span className="text-xs font-black uppercase tracking-wider" style={{ color: a.isMe ? '#3B82F6' : '#94A3B8' }}>
                          {a.isMe ? 'Your Point' : "Partner's Point"}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium m-0">{a.argument}</p>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                {chatTab==='chat' ? (
                  <div className="flex gap-2.5">
                    <input value={msgInput} onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMsg()}
                      placeholder="Type a message..."
                      className="flex-1 rounded-2xl px-4 py-2.5 text-sm border-2 border-slate-200 focus:border-blue-400 outline-none transition-all font-medium placeholder:text-slate-300 bg-slate-50"
                    />
                    <button onClick={sendMsg} disabled={!msgInput.trim()}
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl active:scale-90 border-none cursor-pointer transition-all hover:scale-105 text-white"
                      style={msgInput.trim() ? { background:'linear-gradient(135deg,#3B82F6,#22C55E)', boxShadow:'0 4px 12px rgba(59,130,246,0.4)' } : { background:'#E2E8F0' }}>
                      ↑
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <input value={argInput} onChange={e => setArgInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendArg()}
                      placeholder="Make your argument..."
                      className="flex-1 rounded-2xl px-4 py-2.5 text-sm border-2 border-slate-200 focus:border-orange-400 outline-none transition-all font-medium placeholder:text-slate-300 bg-slate-50"
                    />
                    <button onClick={sendArg} disabled={!argInput.trim()}
                      className="px-4 py-2.5 rounded-2xl text-xs font-black text-white border-none cursor-pointer transition-all hover:scale-105 active:scale-95"
                      style={argInput.trim() ? { background:'linear-gradient(135deg,#F97316,#EF4444)', boxShadow:'0 4px 12px rgba(249,115,22,0.4)' } : { background:'#E2E8F0', color:'#94A3B8' }}>
                      Submit ⚔️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionScreen;