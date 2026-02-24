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
    // FIX: sendMessage only takes { message } — saga doesn't accept userId here
    dispatch(sessionActions.sendMessage({ message: msgInput.trim() }));
    setMsgInput('');
  };

  const sendArg = () => {
    if (!argInput.trim()) return;
    // FIX: submitArgument only takes { argument }
    dispatch(sessionActions.submitArgument({ argument: argInput.trim() }));
    setArgInput('');
  };

  return (
    <div className="hidden lg:flex w-80 flex-col shrink-0 bg-white border-l-2 border-amber-100 font-sans">

      {/* Tabs */}
      <div className="flex shrink-0 border-b-2 border-amber-100 font-sans">
        {(['chat', 'debate'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-4 text-xs tracking-wider uppercase transition-all duration-200 border-none cursor-pointer font-sans ${tab === t
                ? 'font-[900] text-[#f97316] border-b-2 border-[#f97316] bg-amber-50/50'
                : 'font-[700] text-gray-400 border-b-2 border-transparent bg-transparent hover:text-gray-600 hover:bg-gray-50'
              }`}>
            {t === 'chat' ? '💬 Chat' : '🎯 Debate'}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 font-sans">
        {tab === 'chat' ? (
          messages.length === 0 ? (
            <div className="animate-fade-in-up flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4 grayscale opacity-60">💬</div>
              <p className="text-gray-700 text-sm font-[800]">No messages yet</p>
              <p className="text-gray-400 text-xs mt-1.5 font-[600]">Start the conversation!</p>
            </div>
          ) : messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${m.isMe
                  ? 'font-[600] bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white rounded-2xl rounded-br-xs'
                  : 'font-[600] text-gray-700 bg-gray-100 rounded-2xl rounded-bl-xs'
                }`}>
                {m.message}
                <div className={`text-[9px] mt-1.5 font-mono uppercase tracking-tighter opacity-70 ${m.isMe ? 'text-amber-100' : 'text-gray-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          args.length === 0 ? (
            <div className="animate-fade-in-up flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4 grayscale opacity-60">🎯</div>
              <p className="text-gray-700 text-sm font-[800]">No arguments yet</p>
              <p className="text-gray-400 text-xs mt-1.5 font-[600]">Build your case!</p>
            </div>
          ) : args.map((a: any, i: number) => (
            <div key={a.id} className={`animate-fade-in-up rounded-[20px] p-4 border-2 text-sm leading-relaxed shadow-xs transition-transform hover:scale-[1.02] ${a.isMe ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50/50 border-gray-100'
              }`}>
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-[900] ${a.isMe ? 'bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-sm' : 'bg-gray-400'
                  }`}>
                  {i + 1}
                </span>
                <span className="text-[11px] text-gray-500 font-[800] uppercase tracking-wider opacity-60">
                  {a.isMe ? 'Your Point' : "Partner's Point"}
                </span>
              </div>
              <p className="text-gray-700 font-[700] m-0">{a.argument}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t-2 border-amber-100 shrink-0 bg-white">
        {tab === 'chat' ? (
          <div className="flex gap-2.5">
            <input
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Type a message..."
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-gray-100 focus:border-amber-400 transition-all font-[700] placeholder:text-gray-300 font-sans shadow-xs"
            />
            <button onClick={sendMsg} disabled={!msgInput.trim()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 border-none cursor-pointer active:scale-90 ${msgInput.trim()
                  ? 'bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white shadow-lg shadow-amber-500/30'
                  : 'bg-gray-100 text-gray-300'
                }`}>
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
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none border-2 border-gray-100 focus:border-amber-400 resize-none transition-all font-[700] placeholder:text-gray-300 font-sans shadow-xs"
            />
            <button onClick={sendArg} disabled={!argInput.trim()}
              className={`w-full py-3.5 rounded-2xl text-[13px] transition-all duration-200 border-none cursor-pointer active:scale-[0.98] ${argInput.trim()
                  ? 'font-[900] text-white bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-lg shadow-amber-500/30'
                  : 'font-[700] text-gray-400 bg-gray-100'
                }`}>
              Submit Argument 🎯
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;