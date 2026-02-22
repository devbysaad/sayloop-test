import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';

const SidePanel = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { messages, arguments: args } = useSelector((s: any) => s.session);
  const [tab, setTab] = useState<'chat' | 'debate'>('chat');
  const [msgInput, setMsgInput] = useState('');
  const [argInput, setArgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, args, tab]);

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    dispatch(sessionActions.sendMessage({ userId, message: msgInput.trim() }));
    setMsgInput('');
  };
  const sendArg = () => {
    if (!argInput.trim()) return;
    dispatch(sessionActions.submitArgument({ userId, argument: argInput.trim() }));
    setArgInput('');
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div className="hidden lg:flex w-80 flex-col shrink-0 bg-white border-l-2 border-amber-100"
        style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* Tabs */}
        <div className="flex shrink-0 border-b-2 border-amber-100">
          {(['chat','debate'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-xs transition-all"
              style={tab === t ? {
                fontWeight: 800, color: '#f97316',
                borderBottom: '2px solid #f97316',
                background: '#fff9f5',
              } : {
                fontWeight: 700, color: '#9ca3af',
                borderBottom: '2px solid transparent',
              }}>
              {t === 'chat' ? '💬 Chat' : '🎯 Debate'}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {tab === 'chat' ? (
            messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500 text-sm" style={{ fontWeight: 700 }}>No messages yet</p>
                <p className="text-gray-300 text-xs mt-1" style={{ fontWeight: 600 }}>Say something!</p>
              </div>
            ) : messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl"
                  style={m.isMe ? {
                    fontWeight: 600,
                    background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                    color: '#fff',
                    borderBottomRightRadius: '6px',
                  } : {
                    fontWeight: 600, color: '#374151',
                    background: '#f3f4f6',
                    borderBottomLeftRadius: '6px',
                  }}>
                  {m.message}
                  <div className="text-[9px] mt-1 opacity-60 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            args.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-gray-500 text-sm" style={{ fontWeight: 700 }}>No arguments yet</p>
                <p className="text-gray-300 text-xs mt-1" style={{ fontWeight: 600 }}>Make your case!</p>
              </div>
            ) : args.map((a: any, i: number) => (
              <div key={a.id} className="rounded-2xl p-4 border-2 text-sm leading-relaxed"
                style={a.isMe ? {
                  background: '#fff9f0', borderColor: '#fcd34d', fontWeight: 600, color: '#374151',
                } : {
                  background: '#f9fafb', borderColor: '#e5e7eb', fontWeight: 600, color: '#374151',
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                    style={{ fontWeight: 900, background: a.isMe ? 'linear-gradient(135deg,#fbbf24,#f97316)' : '#9ca3af' }}>
                    {i+1}
                  </span>
                  <span className="text-[10px] text-gray-400" style={{ fontWeight: 700 }}>
                    {a.isMe ? 'Your argument' : 'Partner'}
                  </span>
                </div>
                {a.argument}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t-2 border-amber-100 shrink-0">
          {tab === 'chat' ? (
            <div className="flex gap-2">
              <input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                placeholder="Type a message..."
                className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none border-2 border-gray-200 focus:border-amber-300 transition-colors"
                style={{ fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}
              />
              <button onClick={sendMsg} disabled={!msgInput.trim()}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all"
                style={msgInput.trim() ? {
                  background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                } : { background: '#f3f4f6' }}>
                ↑
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={argInput}
                onChange={e => setArgInput(e.target.value)}
                placeholder="Make your argument..."
                rows={3}
                className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none border-2 border-gray-200 focus:border-amber-300 resize-none transition-colors"
                style={{ fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}
              />
              <button onClick={sendArg} disabled={!argInput.trim()}
                className="w-full py-2.5 rounded-2xl text-sm transition-all"
                style={argInput.trim() ? {
                  fontWeight: 800, color: '#fff',
                  background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                } : {
                  fontWeight: 700, color: '#9ca3af', background: '#f3f4f6',
                }}>
                Submit argument 🎯
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidePanel;