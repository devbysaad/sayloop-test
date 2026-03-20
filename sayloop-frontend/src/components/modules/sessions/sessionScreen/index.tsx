import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';
import { useWebRTC } from './Userwebrtc';
import DrawBanner from './Drawbanner';
import ResignModal from './Resignmodal';
import ConversationPanel from '../ConversationPanel';

interface Props { userId: number; }

const REACTIONS = ['👍', '👏', '😂', '🔥', '❤️', '😮'];

// ── Timer color helper ──────────────────────────────────────────────────────
const timerColor = (secs: number | null) => {
  if (secs === null) return { text: '#1E293B', bg: '#EFF6FF', border: '#BFDBFE' };
  if (secs > 60)   return { text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
  if (secs > 30)   return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
  return             { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
};

const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── XP Popup stack ─────────────────────────────────────────────────────────
const XpPopups = ({ popups }: { popups: any[] }) => (
  <div className="absolute top-16 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
    {popups.map(p => (
      <div key={p.id}
        className="flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-lg border-2"
        style={{ background:'#F0FDF4', borderColor:'#BBF7D0', animation:'xpFloat 2.5s ease-out forwards' }}>
        <span className="text-lg">⚡</span>
        <span className="text-green-700 text-sm font-black">{p.amount > 0 ? `+${p.amount}` : p.amount} XP</span>
        {p.label && <span className="text-green-600 text-xs font-semibold">{p.label}</span>}
      </div>
    ))}
    <style>{`@keyframes xpFloat {
      0%{opacity:0;transform:translateY(10px) scale(0.8);}
      20%{opacity:1;transform:translateY(-4px) scale(1.05);}
      80%{opacity:1;transform:translateY(-8px) scale(1);}
      100%{opacity:0;transform:translateY(-20px) scale(0.95);}
    }`}</style>
  </div>
);

// ── Mic Warning Banner ─────────────────────────────────────────────────────
const MicWarning = ({ seconds }: { seconds: number }) => (
  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
    <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 border-2 shadow-xl"
      style={{ background:'#FFF7ED', borderColor:'#FDBA74', animation:'pulse 1s ease-in-out infinite' }}>
      <span className="text-2xl" style={{ animation:'shake 0.5s ease-in-out infinite alternate' }}>⚠️</span>
      <div>
        <p className="text-orange-700 font-black text-sm">Mic off — auto-exit in {seconds}s</p>
        <p className="text-orange-500 text-xs font-semibold">Turn your mic on to stay in session</p>
      </div>
    </div>
    <style>{`@keyframes shake { from{transform:rotate(-3deg);} to{transform:rotate(3deg);} }`}</style>
  </div>
);

const SessionScreen = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { topic, drawState, messages, arguments: args, timerSeconds, micWarning, xpPopups } =
    useSelector((s: any) => s.session);

  const localRef  = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const { state: rtc, actions: rtcActions } = useWebRTC(localRef, remoteRef, userId);

  // Mic change reporting (on change only)
  const prevMicRef = useRef<boolean>(!rtc.muted);
  useEffect(() => {
    const isOn = !rtc.muted;
    if (isOn !== prevMicRef.current) {
      console.log('[Session] Mic change → mic:status isOn=', isOn);
      dispatch(sessionActions.reportMicStatus({ isOn }));
      prevMicRef.current = isOn;
    }
  }, [rtc.muted]);

  // Speaking tick (every 1s when mic ON)
  useEffect(() => {
    if (rtc.muted) return;
    const id = setInterval(() => dispatch(sessionActions.reportSpeaking()), 1000);
    return () => clearInterval(id);
  }, [rtc.muted]);

  // Reaction
  const [reaction, setReaction] = useState<string | null>(null);
  const handleReaction = (e: string) => { setReaction(e); setTimeout(() => setReaction(null), 2500); };

  // Resign modal
  const [showResign, setShowResign] = useState(false);

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTab, setChatTab] = useState<'chat' | 'panel' | 'debate'>('chat');
  const [msgInput, setMsgInput] = useState('');
  const [argInput, setArgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, args, chatTab]);

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

  const tc = timerColor(timerSeconds);
  const timerIsLow = timerSeconds !== null && timerSeconds <= 30;
  const drawDisabled = !rtc.canOfferDraw || drawState === 'offered' || drawState === 'received';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .sess * { font-family:'Outfit',sans-serif; box-sizing:border-box; }
        .slide-up { animation: slideUp 0.3s ease; }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0;} to{transform:translateY(0);opacity:1;} }
        .live-dot { animation:ld 1.4s ease-in-out infinite; }
        @keyframes ld { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.8);opacity:0.4;} }
        .react-btn:hover { transform:scale(1.3); }
        .react-btn { transition:transform 0.15s; }
        .timer-pulse { animation: timerP 1s ease-in-out infinite; }
        @keyframes timerP { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        video::-webkit-media-controls { display:none !important; }
      `}</style>

      <div className="sess h-screen flex flex-col overflow-hidden bg-slate-100 relative">

        <DrawBanner drawState={drawState} />
        {showResign && (
          <ResignModal
            onConfirm={() => {
              console.log('[Session] Resign confirmed');
              setShowResign(false);
              dispatch(sessionActions.resign());
            }}
            onCancel={() => setShowResign(false)}
          />
        )}
        <XpPopups popups={xpPopups} />
        {micWarning !== null && <MicWarning seconds={micWarning} />}

        {/* ═══ TOP HEADER ═══ */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-slate-100 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg text-white shadow-md"
              style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
            <span className="text-base font-black text-slate-800 hidden sm:block">
              SayLoop <span className="text-green-500">Live</span>
            </span>
            {topic && (
              <div className="flex items-center gap-1.5 bg-green-50 border-2 border-green-200 rounded-full px-3 py-1 text-xs font-black text-green-700 uppercase tracking-wider">
                <span className="live-dot w-1.5 h-1.5 bg-green-500 rounded-full" />{topic.replace('_', ' ')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-2 border-2 rounded-full px-4 py-2 ${timerIsLow ? 'timer-pulse' : ''}`}
              style={{ background: tc.bg, borderColor: tc.border }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: tc.text }} />
              <span className="font-mono text-base font-black" style={{ color: tc.text }}>
                {timerSeconds !== null ? fmtTime(timerSeconds) : '--:--'}
              </span>
            </div>

            {/* Mobile chat toggle */}
            <button onClick={() => setChatOpen(o => !o)}
              className="flex lg:hidden items-center gap-1.5 bg-blue-50 border-2 border-blue-200 rounded-full px-3 py-1.5 text-blue-600 text-xs font-black">
              💬 {messages.length > 0 && (
                <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">{messages.length}</span>
              )}
            </button>
          </div>
        </header>

        {/* ═══ MAIN BODY — flex-col on mobile, flex-row on desktop ═══ */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-1 p-1 bg-slate-200">

          {/* LEFT — Videos (50/50) */}
          <div className="flex flex-col sm:flex-row flex-1 gap-1 min-h-0">

            {/* Opponent */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-800 shadow-lg min-h-[28vh] sm:min-h-0">
              <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />
              {!rtc.remoteReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background:'#1E293B' }}>
                  <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
                    <div className="absolute inset-3 rounded-full border-4 border-orange-400/20 animate-ping" style={{ animationDelay:'0.5s' }} />
                    <div className="w-12 h-12 rounded-2xl bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-2xl">🎭</div>
                  </div>
                  <p className="text-white font-black text-sm mb-1">Connecting...</p>
                  <div className="mt-3 w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ background:'linear-gradient(90deg,#3B82F6,#22C55E)', animation:'loadBar 1.5s ease-in-out infinite' }} />
                  </div>
                  <style>{`@keyframes loadBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }`}</style>
                </div>
              )}
              {reaction && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl pointer-events-none z-30 animate-bounce">{reaction}</div>
              )}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/60 shadow-sm">
                <span className="live-dot w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-700 text-xs font-black">Partner</span>
              </div>
              <div className="absolute bottom-3 left-3 text-slate-200 text-xs bg-black/40 rounded-lg px-2.5 py-1 font-black backdrop-blur-sm">OPPONENT</div>
            </div>

            {/* You */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 shadow-lg min-h-[28vh] sm:min-h-0">
              <video ref={localRef} autoPlay muted playsInline
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${rtc.camOff ? 'opacity-0' : 'opacity-100'}`} />
              {rtc.camOff && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                  <span className="text-5xl opacity-30 mb-2">📹</span>
                  <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Camera Off</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-blue-600 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-1.5">
                {rtc.muted && <span className="text-red-300 text-xs">🔇</span>}
                <span className="text-white text-xs font-black">YOU</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Conversation Panel sidebar (desktop) */}
          <div className="hidden lg:flex lg:flex-col lg:w-80 shrink-0 gap-1 overflow-hidden">
            <div className="flex-1 bg-white rounded-2xl p-4 overflow-y-auto shadow-sm">
              <ConversationPanel
                topicId={topic ?? 'daily_life'}
                timerSeconds={timerSeconds}
                onPromptClick={(text) => console.log('[Panel] Prompt clicked:', text)}
              />
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM CONTROLS ═══ */}
        <div className="shrink-0 bg-white border-t-2 border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap">

            {/* Mic + Cam */}
            <div className="flex gap-2">
              <button onClick={rtcActions.toggleMute}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90 border-2"
                style={rtc.muted
                  ? { background:'#EF4444', borderColor:'#EF4444', color:'white', boxShadow:'0 4px 12px rgba(239,68,68,0.4)' }
                  : { background:'#EFF6FF', borderColor:'#BFDBFE', color:'#3B82F6' }}>
                {rtc.muted ? '🔇' : '🎤'}
              </button>
              <button onClick={rtcActions.toggleCam}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90 border-2"
                style={rtc.camOff
                  ? { background:'#EF4444', borderColor:'#EF4444', color:'white', boxShadow:'0 4px 12px rgba(239,68,68,0.4)' }
                  : { background:'#F0FDF4', borderColor:'#BBF7D0', color:'#22C55E' }}>
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Chat toggle (mobile — conversation panel replaces for desktop) */}
              <button onClick={() => setChatOpen(o => !o)}
                className="flex lg:hidden items-center gap-1.5 px-3 py-2.5 rounded-2xl text-sm font-black border-2 transition-all"
                style={chatOpen
                  ? { background:'#EFF6FF', borderColor:'#3B82F6', color:'#3B82F6' }
                  : { background:'#F8FAFC', borderColor:'#E2E8F0', color:'#64748B' }}>
                💬
              </button>

              <button onClick={rtcActions.offerDraw} disabled={drawDisabled}
                className="hidden sm:block px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all"
                style={drawDisabled
                  ? { background:'#F8FAFC', borderColor:'#E2E8F0', color:'#CBD5E1', cursor:'not-allowed' }
                  : { background:'#FFF7ED', borderColor:'#FED7AA', color:'#F97316' }}>
                {rtc.drawCooldownSec > 0 ? `Draw (${rtc.drawCooldownSec}s)` : 'Offer Draw'}
              </button>

              <button onClick={() => setShowResign(true)}
                className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border-2 bg-red-50 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                Resign ✕
              </button>
            </div>
          </div>

          {/* Mobile chat + conversation panel */}
          {chatOpen && (
            <div className="slide-up border-t-2 border-slate-100 flex flex-col" style={{ height:'280px' }}>
              <div className="flex border-b border-slate-100 shrink-0">
                {(['chat', 'panel'] as const).map(t => (
                  <button key={t} onClick={() => setChatTab(t as any)}
                    className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-none cursor-pointer transition-all relative"
                    style={{ background:'transparent', color: chatTab === t ? '#3B82F6' : '#94A3B8' }}>
                    {t === 'chat' ? '💬 Chat' : '🎯 Topics'}
                    {chatTab === t && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full" style={{ background:'linear-gradient(90deg,#3B82F6,#22C55E)' }} />}
                  </button>
                ))}
                {/* Also show debate tab in chat section */}
                <button onClick={() => setChatTab('debate' as any)}
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-none cursor-pointer transition-all relative"
                  style={{ background:'transparent', color: chatTab === 'debate' ? '#3B82F6' : '#94A3B8' }}>
                  ⚔️ Debate
                  {chatTab === 'debate' && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full" style={{ background:'linear-gradient(90deg,#3B82F6,#22C55E)' }} />}
                </button>
              </div>

              {/* Topics panel (mobile) */}
              {chatTab === 'panel' && (
                <div className="flex-1 overflow-y-auto p-3">
                  <ConversationPanel
                    topicId={topic ?? 'daily_life'}
                    timerSeconds={timerSeconds}
                    onPromptClick={(text) => console.log('[Panel] Mobile prompt:', text)}
                  />
                </div>
              )}

              {/* Chat */}
              {chatTab === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-3xl mb-2 opacity-30">💬</div>
                        <p className="text-slate-400 text-sm font-black">No messages yet</p>
                      </div>
                    ) : messages.map((m: any) => (
                      <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl font-medium shadow-sm ${m.isMe ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-slate-700 bg-white border border-slate-100'}`}
                          style={m.isMe ? { background:'linear-gradient(135deg,#3B82F6,#22C55E)' } : {}}>
                          {m.message}
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                    <div className="flex gap-2.5">
                      <input value={msgInput} onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-2xl px-4 py-2.5 text-sm border-2 border-slate-200 focus:border-blue-400 outline-none transition-all font-medium placeholder:text-slate-300 bg-slate-50"
                      />
                      <button onClick={sendMsg} disabled={!msgInput.trim()}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl active:scale-90 border-none cursor-pointer transition-all hover:scale-105 text-white"
                        style={msgInput.trim() ? { background:'linear-gradient(135deg,#3B82F6,#22C55E)' } : { background:'#E2E8F0' }}>
                        ↑
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Debate */}
              {chatTab === 'debate' && (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
                    {args.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-3xl mb-2 opacity-30">⚔️</div>
                        <p className="text-slate-400 text-sm font-black">No arguments yet</p>
                      </div>
                    ) : args.map((a: any) => (
                      <div key={a.id} className={`rounded-2xl p-3.5 border-2 text-sm ${a.isMe ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <p className="text-slate-700 font-medium m-0">{a.argument}</p>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                    <div className="flex gap-2.5">
                      <input value={argInput} onChange={e => setArgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendArg()}
                        placeholder="Make your argument..."
                        className="flex-1 rounded-2xl px-4 py-2.5 text-sm border-2 border-slate-200 focus:border-orange-400 outline-none transition-all font-medium placeholder:text-slate-300 bg-slate-50"
                      />
                      <button onClick={sendArg} disabled={!argInput.trim()}
                        className="px-4 py-2.5 rounded-2xl text-xs font-black text-white border-none cursor-pointer transition-all hover:scale-105 active:scale-95"
                        style={argInput.trim() ? { background:'linear-gradient(135deg,#F97316,#EF4444)' } : { background:'#E2E8F0', color:'#94A3B8' }}>
                        Submit ⚔️
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionScreen;