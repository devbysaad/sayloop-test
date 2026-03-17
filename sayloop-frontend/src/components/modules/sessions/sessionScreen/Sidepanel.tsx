import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';

const SidePanel = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { messages, arguments: args } = useSelector((s: any) => s.session);
  const [tab, setTab] = useState<'chat' | 'debate'>('chat');
  const [msgInput, setMsgInput] = useState('');
  const [argInput, setArgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, args, tab]);

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:'#0F0F1E' }}>

      {/* Tabs — Discord channel style */}
      <div className="flex shrink-0 border-b" style={{ borderColor:'rgba(124,58,237,0.2)' }}>
        {(['chat', 'debate'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3.5 text-xs tracking-wider uppercase font-black transition-all duration-200 border-none cursor-pointer relative"
            style={{
              background: 'transparent',
              color: tab === t ? '#C4B5FD' : 'rgba(107,114,128,1)',
            }}>
            {t === 'chat' ? '💬 Chat' : '⚔️ Debate'}
            {tab === t && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                style={{ background:'linear-gradient(90deg,#7C3AED,#22D3EE)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ scrollbarWidth:'thin', scrollbarColor:'rgba(124,58,237,0.3) transparent' }}>
        {tab === 'chat' ? (
          messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-4xl mb-3 opacity-30">💬</div>
              <p className="text-gray-500 text-sm font-black">No messages yet</p>
              <p className="text-gray-600 text-xs mt-1 font-medium">Start the conversation!</p>
            </div>
          ) : messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm font-medium
                ${m.isMe ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-gray-200'}`}
                style={m.isMe
                  ? { background:'linear-gradient(135deg,#7C3AED,#5B21B6)', boxShadow:'0 4px 12px rgba(124,58,237,0.3)' }
                  : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }
                }>
                {m.message}
                <div className="text-[9px] mt-1 monospace uppercase tracking-tighter opacity-50"
                  style={{ color: m.isMe ? 'rgba(196,181,253,0.8)' : 'rgba(156,163,175,0.8)' }}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          args.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-4xl mb-3 opacity-30">⚔️</div>
              <p className="text-gray-500 text-sm font-black">No arguments yet</p>
              <p className="text-gray-600 text-xs mt-1 font-medium">Build your case!</p>
            </div>
          ) : args.map((a: any, i: number) => (
            <div key={a.id} className="rounded-2xl p-4 border text-sm leading-relaxed transition-transform hover:scale-[1.01]"
              style={a.isMe
                ? { background:'rgba(124,58,237,0.1)', borderColor:'rgba(124,58,237,0.3)' }
                : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }
              }>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black"
                  style={a.isMe
                    ? { background:'linear-gradient(135deg,#7C3AED,#22D3EE)' }
                    : { background:'rgba(255,255,255,0.1)' }
                  }>{i + 1}</span>
                <span className="text-[11px] font-black uppercase tracking-wider"
                  style={{ color: a.isMe ? 'rgba(196,181,253,0.7)' : 'rgba(107,114,128,1)' }}>
                  {a.isMe ? 'Your Point' : "Partner's Point"}
                </span>
              </div>
              <p className="font-medium m-0" style={{ color: a.isMe ? '#E9D5FF' : '#9CA3AF' }}>{a.argument}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="px-4 py-4 border-t shrink-0" style={{ borderColor:'rgba(124,58,237,0.2)', background:'rgba(10,10,20,0.8)' }}>
        {tab === 'chat' ? (
          <div className="flex gap-2.5">
            <input
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Message..."
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none font-medium transition-all"
              style={{
                background:'rgba(124,58,237,0.1)',
                border:'1px solid rgba(124,58,237,0.3)',
                color:'white',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.7)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.3)')}
            />
            <button onClick={sendMsg} disabled={!msgInput.trim()}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 border-none cursor-pointer active:scale-90 hover:scale-105"
              style={msgInput.trim()
                ? { background:'linear-gradient(135deg,#7C3AED,#22D3EE)', boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }
                : { background:'rgba(255,255,255,0.05)', color:'rgba(107,114,128,1)' }
              }>
              ↑
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={argInput}
              onChange={e => setArgInput(e.target.value)}
              placeholder="Make your argument..."
              rows={3}
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none font-medium transition-all"
              style={{
                background:'rgba(124,58,237,0.1)',
                border:'1px solid rgba(124,58,237,0.3)',
                color:'white',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.7)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.3)')}
            />
            <button onClick={sendArg} disabled={!argInput.trim()}
              className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-200 border-none cursor-pointer active:scale-[0.98] hover:scale-[1.02]"
              style={argInput.trim()
                ? { background:'linear-gradient(135deg,#7C3AED,#22D3EE)', color:'white', boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }
                : { background:'rgba(255,255,255,0.05)', color:'rgba(107,114,128,1)' }
              }>
              Submit Argument ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;