import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../../redux/saga/session.saga';

interface Props {
    userId: number;
}

const SidePanel = ({ userId }: Props) => {
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
        dispatch(sessionActions.sendMessage({ userId, message: msgInput.trim() }));
        setMsgInput('');
    };

    const sendArg = () => {
        if (!argInput.trim()) return;
        dispatch(sessionActions.submitArgument({ userId, argument: argInput.trim() }));
        setArgInput('');
    };

    return (
        <div className="hidden lg:flex w-80 bg-white border-l border-stone-200 flex-col shrink-0">

            {/* Tabs */}
            <div className="flex border-b border-stone-200 shrink-0">
                {(['chat', 'debate'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-all
              ${tab === t
                                ? 'text-green-700 border-b-2 border-green-600 bg-green-50/50'
                                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'}`}
                    >
                        {t === 'chat' ? '💬 Chat' : '⚔️ Debate'}
                    </button>
                ))}
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5">
                {tab === 'chat' ? (
                    messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <span className="text-4xl mb-3">💬</span>
                            <p className="text-stone-400 text-sm font-semibold">No messages yet</p>
                            <p className="text-stone-300 text-xs mt-1">Say something to break the ice!</p>
                        </div>
                    ) : (
                        messages.map((m: any) => (
                            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
                  ${m.isMe
                                        ? 'bg-green-600 text-white rounded-br-sm'
                                        : 'bg-stone-100 text-stone-800 rounded-bl-sm'}`}>
                                    {m.message}
                                    <div className={`text-[9px] mt-1 font-mono
                    ${m.isMe ? 'text-green-200 text-right' : 'text-stone-400'}`}>
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    args.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <span className="text-4xl mb-3">⚔️</span>
                            <p className="text-stone-400 text-sm font-semibold">No arguments yet</p>
                            <p className="text-stone-300 text-xs mt-1">Submit your first argument below</p>
                        </div>
                    ) : (
                        args.map((a: any, i: number) => (
                            <div
                                key={a.id}
                                className={`rounded-2xl px-3.5 py-3 text-sm leading-relaxed border
                  ${a.isMe
                                        ? 'bg-green-50 border-green-200 text-green-900'
                                        : 'bg-stone-50 border-stone-200 text-stone-800'}`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center
                    ${a.isMe ? 'bg-green-200 text-green-800' : 'bg-stone-200 text-stone-600'}`}>
                                        {i + 1}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                        {a.isMe ? 'Your argument' : 'Partner'}
                                    </span>
                                </div>
                                {a.argument}
                            </div>
                        ))
                    )
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="px-3 py-3 border-t border-stone-200 bg-stone-50 shrink-0">
                {tab === 'chat' ? (
                    <div className="flex gap-2">
                        <input
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                            placeholder="Type a message…"
                            className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm
                         text-stone-800 placeholder-stone-400 outline-none
                         focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                        />
                        <button
                            onClick={sendMsg}
                            disabled={!msgInput.trim()}
                            className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold
                         flex items-center justify-center shrink-0
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            ↑
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={argInput}
                            onChange={(e) => setArgInput(e.target.value)}
                            placeholder="Type your argument…"
                            rows={3}
                            className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm
                         text-stone-800 placeholder-stone-400 outline-none resize-none
                         focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                        />
                        <button
                            onClick={sendArg}
                            disabled={!argInput.trim()}
                            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white
                         text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all active:scale-95"
                        >
                            Submit argument ⚔️
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default SidePanel;