import React, { useState, useEffect, useCallback } from 'react';
import { getTopicById, type Topic } from '../../../constants/topics';

// ─── Phase logic ───────────────────────────────────────────────────────────────
export type Phase = 'warmup' | 'discussion' | 'challenge';

export function getPhase(timerSeconds: number | null, sessionDuration = 300): Phase {
  if (timerSeconds === null) return 'warmup';
  const elapsed = sessionDuration - timerSeconds;
  if (elapsed >= 180) return 'challenge';
  if (elapsed >= 60)  return 'discussion';
  return 'warmup';
}

const PHASE_META: Record<Phase, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  warmup:     { label: 'Warmup',     emoji: '👋', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  discussion: { label: 'Discussion', emoji: '💬', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  challenge:  { label: 'Challenge',  emoji: '⚡', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
};

const WARMUP_PROMPTS = [
  'Say hello and introduce yourself 👋',
  'Tell your partner where you are from',
  'Share one fun fact about yourself',
  'Ask your partner how they are doing today',
];

// ─── Inline shuffle ────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  topicId: string;
  timerSeconds: number | null;
  sessionDuration?: number;
  /** Called when user clicks a prompt/task (for XP tracking) */
  onPromptClick?: (text: string) => void;
}

// ─── XP reminder (fires every 75s) ────────────────────────────────────────────
function useTopicReminder(timerSeconds: number | null) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (timerSeconds === null) return;
    // Reminder at 225s and 150s remaining (i.e., every ~75s)
    if (timerSeconds === 225 || timerSeconds === 150 || timerSeconds === 75) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(t);
    }
  }, [timerSeconds]);
  return show;
}

// ─── Component ────────────────────────────────────────────────────────────────
const ConversationPanel: React.FC<Props> = ({
  topicId, timerSeconds, sessionDuration = 300, onPromptClick,
}) => {
  const topic = getTopicById(topicId);
  const phase = getPhase(timerSeconds, sessionDuration);
  const pMeta = PHASE_META[phase];
  const showReminder = useTopicReminder(timerSeconds);

  const [clickedPrompts, setClickedPrompts] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [extraPrompts, setExtraPrompts] = useState<string[]>([]);
  const [stuckOpen, setStuckOpen] = useState(false);

  // Shuffle extras on "I'm stuck"
  const handleStuck = useCallback(() => {
    const all = topic ? shuffle(topic.prompts).slice(0, 3) : WARMUP_PROMPTS.slice(0, 3);
    setExtraPrompts(all);
    setStuckOpen(true);
  }, [topic]);

  const handlePromptClick = (text: string) => {
    setClickedPrompts(prev => new Set(prev).add(text));
    onPromptClick?.(text);
  };

  const toggleTask = (i: number) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  // Active prompts based on phase
  const activePrompts = phase === 'warmup'
    ? WARMUP_PROMPTS
    : topic?.prompts ?? WARMUP_PROMPTS;

  const activeTasks = topic?.tasks ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&display=swap');
        .convpanel * { font-family: 'Outfit', sans-serif; }
        .prompt-btn { transition: transform 0.12s, background 0.15s, border-color 0.15s; }
        .prompt-btn:hover { transform: scale(1.01); }
        .task-row { transition: background 0.2s; }
        .task-row:hover { background: rgba(0,0,0,0.02); }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }
        .reminder-slide { animation: remSlide 0.4s ease; }
        @keyframes remSlide { from{opacity:0;transform:translateX(16px);} to{opacity:1;transform:translateX(0);} }
        .phase-pulse { animation: pPulse 2s ease-in-out infinite; }
        @keyframes pPulse { 0%,100%{opacity:1;} 50%{opacity:0.6;} }
      `}</style>

      <div className="convpanel flex flex-col gap-3 h-full overflow-y-auto">

        {/* ─── Topic Lock Bar ───────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 px-4 py-3 flex items-center gap-2.5 shrink-0"
          style={{ background: topic ? `${topic.color}10` : '#F8FAFC', borderColor: topic?.color ?? '#E2E8F0' }}>
          <span className="text-xl">{topic?.emoji ?? '💬'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: topic?.color ?? '#64748B' }}>
              Topic
            </p>
            <p className="font-black text-slate-800 text-sm truncate">{topic?.title ?? topicId}</p>
          </div>
          <div className="w-2 h-2 rounded-full phase-pulse" style={{ background: topic?.color ?? '#64748B' }} />
        </div>

        {/* ─── XP Reminder Toast ───────────────────────────────────────── */}
        {showReminder && (
          <div className="reminder-slide rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-2.5 flex items-center gap-2 shrink-0">
            <span className="text-base">⚡</span>
            <p className="text-green-700 font-black text-xs">Stay on topic — earn more XP!</p>
          </div>
        )}

        {/* ─── Phase Indicator ─────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 px-4 py-3 shrink-0 fade-in"
          style={{ background: pMeta.bg, borderColor: pMeta.border }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{pMeta.emoji}</span>
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: pMeta.color }}>
              {pMeta.label} Phase
            </span>
          </div>
          <p className="text-slate-600 text-xs font-semibold">
            {phase === 'warmup' && 'Say hello and introduce yourself'}
            {phase === 'discussion' && 'Pick a prompt and start talking!'}
            {phase === 'challenge' && 'Level up — complete a speaking task'}
          </p>
        </div>

        {/* ─── Prompts ─────────────────────────────────────────────────── */}
        {(phase === 'warmup' || phase === 'discussion') && (
          <div className="fade-in flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              {phase === 'warmup' ? '🗣️ Intro Starters' : '💬 Talk About'}
            </p>
            {activePrompts.map((prompt, i) => {
              const clicked = clickedPrompts.has(prompt);
              return (
                <button key={i} onClick={() => handlePromptClick(prompt)}
                  className={`prompt-btn w-full text-left px-4 py-3 rounded-2xl border-2 text-xs font-semibold leading-relaxed
                    ${clicked
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}>
                  <span className="mr-1.5">{clicked ? '✅' : '•'}</span>
                  {prompt}
                  {clicked && <span className="ml-2 text-[10px] font-black text-green-500 uppercase">+5 XP</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── Tasks (Challenge phase) ─────────────────────────────────── */}
        {phase === 'challenge' && activeTasks.length > 0 && (
          <div className="fade-in flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">⚡ Speaking Tasks</p>
            {activeTasks.map((task, i) => {
              const done = completedTasks.has(i);
              return (
                <button key={i} onClick={() => toggleTask(i)}
                  className={`task-row w-full text-left px-4 py-3.5 rounded-2xl border-2 text-xs font-semibold leading-relaxed flex items-start gap-3
                    ${done
                      ? 'border-purple-300 bg-purple-50 text-purple-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300'
                    }`}>
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${done ? 'bg-purple-500 border-purple-500' : 'border-slate-300'}`}>
                    {done && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="flex-1">{task}</span>
                  {done && <span className="text-[10px] font-black text-purple-500 uppercase shrink-0">+10 XP</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── I'm Stuck Button ───────────────────────────────────────── */}
        <div className="mt-auto shrink-0 pt-2">
          <button onClick={handleStuck}
            className="w-full py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-600 text-sm font-black
              hover:bg-orange-100 hover:border-orange-300 transition-all flex items-center justify-center gap-2">
            😅 I&apos;m Stuck — Show More
          </button>
        </div>

        {/* ─── I'm Stuck Extra Prompts ────────────────────────────────── */}
        {stuckOpen && extraPrompts.length > 0 && (
          <div className="fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-black uppercase tracking-widest text-orange-400">🆘 Extra Prompts</p>
              <button onClick={() => setStuckOpen(false)} className="text-slate-400 text-xs font-black hover:text-slate-600">✕</button>
            </div>
            {extraPrompts.map((p, i) => (
              <button key={i} onClick={() => handlePromptClick(p)}
                className={`prompt-btn w-full text-left px-4 py-3 rounded-2xl border-2 text-xs font-semibold
                  border-orange-200 bg-white text-slate-700 hover:border-orange-400 hover:bg-orange-50`}>
                💡 {p}
              </button>
            ))}
          </div>
        )}

        {/* ─── Bottom padding ──────────────────────────────────────────── */}
        <div className="h-2 shrink-0" />
      </div>
    </>
  );
};

export default ConversationPanel;
