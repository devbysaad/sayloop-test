import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../../redux/service/session.saga';

const ResultScreen = ({ userId }: { userId: number }) => {
  const dispatch = useDispatch();
  const { result, topic, arguments: args } = useSelector((s: any) => s.session);

  const isPartnerLeft =
    result?.reason === 'partner_disconnected' || result?.reason === 'partner_skipped';

  const myArgs = args.filter((a: any) => a.isMe);

  const handlePlayAgain = () => {
    dispatch(sessionActions.reset());
    dispatch(sessionActions.connect({ userId }));
  };

  const handleGoHome = () => {
    dispatch(sessionActions.reset());
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">

      {/* ── LEFT — result summary ───────────────────────────── */}
      <aside className="lg:w-[44%] bg-white border-b lg:border-b-0 lg:border-r border-stone-200
                        flex flex-col justify-between px-8 py-10 lg:px-14 lg:py-14 relative overflow-hidden">

        {/* glow */}
        <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-50 pointer-events-none
          ${isPartnerLeft ? 'bg-red-100' : 'bg-green-100'}`} />

        {/* brand */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 tracking-widest uppercase relative z-10">
          <span className={`w-2 h-2 rounded-full ${isPartnerLeft ? 'bg-red-400' : 'bg-green-500'}`} />
          Sayloop · Session Ended
        </div>

        {/* main result */}
        <div className="relative z-10 my-10 lg:my-0">

          {/* icon */}
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm
            ${isPartnerLeft ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            {isPartnerLeft ? '😢' : '🏆'}
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight tracking-tight mb-3">
            {isPartnerLeft ? 'Session Ended Early' : 'Debate Complete!'}
          </h1>

          <p className="text-stone-500 text-[15px] leading-relaxed max-w-xs mb-8">
            {result?.message || 'Great session. Your arguments have been recorded.'}
          </p>

          {/* topic badge */}
          {topic && (
            <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200
                            rounded-full px-4 py-2 mb-8">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-widest">Topic</span>
              <span className="w-px h-3 bg-stone-300" />
              <span className="text-sm font-bold text-stone-700">{topic}</span>
            </div>
          )}

          {/* XP card */}
          {!isPartnerLeft && (
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200
                            rounded-2xl px-5 py-4 max-w-xs">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="font-extrabold text-amber-600 text-2xl leading-none">+10 XP</p>
                <p className="text-stone-500 text-xs mt-1">Earned for debate participation</p>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <p className="relative z-10 text-xs text-stone-400 flex items-center gap-1.5">
          <span>🔒</span> Peer-to-peer · End-to-end encrypted
        </p>
      </aside>

      {/* ── RIGHT — arguments + actions ─────────────────────── */}
      <main className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-14">

        {/* arguments section */}
        {myArgs.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold
                               flex items-center justify-center shrink-0">⚔</span>
              <span className="text-[11px] font-mono font-medium text-stone-400 tracking-widest uppercase">
                Your arguments ({myArgs.length})
              </span>
            </div>

            <div className="space-y-2.5 mb-10 max-h-72 overflow-y-auto pr-1">
              {myArgs.map((a: any, i: number) => (
                <div key={a.id}
                  className="bg-white border border-stone-200 rounded-2xl px-4 py-3.5
                             hover:border-stone-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-4 h-4 rounded-full bg-green-100 border border-green-300
                                     text-green-700 text-[9px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                      Argument
                    </span>
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed">{a.argument}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 mb-8">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-stone-400 text-sm font-medium">No arguments submitted</p>
            <p className="text-stone-300 text-xs mt-1">Try submitting some next time!</p>
          </div>
        )}

        {/* stats row */}
        {!isPartnerLeft && (
          <div className="grid grid-cols-3 gap-2 mb-10">
            {[
              { val: myArgs.length, lbl: 'Arguments made' },
              { val: '—', lbl: 'AI score' },
              { val: '+10', lbl: 'XP earned' },
            ].map((s) => (
              <div key={s.lbl}
                className="bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-center">
                <p className="font-mono text-xl font-semibold text-stone-800">{s.val}</p>
                <p className="text-[11px] text-stone-400 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        )}

        {/* actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-stone-600
                       bg-white border-2 border-stone-200 hover:border-stone-400
                       hover:-translate-y-px transition-all duration-150"
          >
            Go Home
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white
                       bg-green-600 hover:bg-green-700
                       shadow-[0_4px_14px_rgba(22,163,74,0.28)]
                       hover:-translate-y-px active:translate-y-0 transition-all duration-150"
          >
            Debate Again 🎯
          </button>
        </div>

      </main>
    </div>
  );
};

export default ResultScreen;