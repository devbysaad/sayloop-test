import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { emoji: '🗣️', value: 1240, suffix: '+', label: 'Daily Conversations', color: '#E8480C', bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)' },
  { emoji: '👥', value: 8700, suffix: '+', label: 'Active Learners', color: '#B45309', bg: '#FEF8EF', border: 'rgba(180,83,9,0.2)' },
  { emoji: '🌎', value: 47, suffix: '+', label: 'Countries', color: '#3D7A5C', bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)' },
  { emoji: '⭐', value: 4.8, suffix: '', label: 'Avg. Session Rating', decimal: true, color: '#141414', bg: '#FFFFFF', border: 'rgba(20,20,20,0.1)' },
];

const useCountUp = (target: number, decimal: boolean, active: boolean) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const steps = 60;
    const inc = target / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setV(target); clearInterval(t); }
      else setV(decimal ? Math.round(cur * 10) / 10 : Math.floor(cur));
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [active]);
  return v;
};

const Card = ({ emoji, value, suffix, label, color, bg, border, decimal }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, !!decimal, active);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      className="flex-1 min-w-[160px] rounded-2xl p-6 text-center hover:-translate-y-2 transition-all duration-300 cursor-default group shadow-sm hover:shadow-md border"
      style={{ background: bg, borderColor: border }}>
      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">{emoji}</div>
      <p className="text-4xl mb-1 font-black" style={{ color }}>
        {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
      </p>
      <p className="text-[#141414]/45 text-sm font-normal">{label}</p>
    </div>
  );
};

const Stats = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800;900&display=swap');`}</style>
    <section className="py-20 px-6 bg-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-5">
          {STATS.map((s, i) => <Card key={i} {...s} />)}
        </div>
      </div>
    </section>
  </>
);

export default Stats;