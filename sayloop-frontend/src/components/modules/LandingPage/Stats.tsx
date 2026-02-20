import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { icon: '👨‍🎓', value: 30,  suffix: 'M+',  label: 'Active Learners',     color: 'text-green-600'  },
  { icon: '🌍', value: 190, suffix: '+',   label: 'Countries',            color: 'text-blue-500'   },
  { icon: '📚', value: 1,   suffix: 'B+',  label: 'Lessons Completed',   color: 'text-amber-500'  },
  { icon: '⭐', value: 4.8, suffix: '',    label: 'App Rating',           color: 'text-orange-500' },
];

const useCounter = (target: number, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(target < 10 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const StatCard = ({ stat, animate }: { stat: typeof STATS[0]; animate: boolean }) => {
  const count = useCounter(stat.value, 1800, animate);
  return (
    <div className="flex flex-col items-center text-center space-y-3 group cursor-default
                    bg-white border border-stone-200 rounded-3xl p-8
                    hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:-translate-y-1
                    transition-all duration-300">
      <div className="w-14 h-14 bg-stone-50 border border-stone-200 rounded-2xl
                      flex items-center justify-center text-3xl
                      group-hover:scale-110 transition-transform duration-300">
        {stat.icon}
      </div>
      <div className={`text-4xl font-extrabold ${stat.color} font-mono tracking-tight`}>
        {count}{stat.suffix}
      </div>
      <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</div>
    </div>
  );
};

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimate(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 bg-stone-100 border-y border-stone-200" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatCard key={i} stat={s} animate={animate} />)}
        </div>
      </div>
    </section>
  );
};

export default Stats;