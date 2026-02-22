import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { emoji: '🌍', value: 14000, suffix: '+', label: 'Daily conversations', color: '#fef3c7', border: '#fcd34d' },
  { emoji: '🗣️', value: 47,    suffix: '',  label: 'Languages available', color: '#dbeafe', border: '#93c5fd' },
  { emoji: '🌎', value: 190,   suffix: '+', label: 'Countries',           color: '#dcfce7', border: '#86efac' },
  { emoji: '⭐', value: 4.9,   suffix: '',  label: 'App rating',          color: '#fce7f3', border: '#f9a8d4', decimal: true },
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

const Card = ({ emoji, value, suffix, label, color, border, decimal }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, !!decimal, active);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="rounded-3xl p-6 text-center hover:-translate-y-1 transition-all cursor-default" style={{ background: color, border: `2px solid ${border}` }}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="text-4xl text-gray-800 mb-1" style={{ fontWeight: 900 }}>
        {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-600 text-sm" style={{ fontWeight: 700 }}>{label}</p>
    </div>
  );
};

const Stats = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    <section className="py-20 px-6 bg-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s, i) => <Card key={i} {...s} />)}
      </div>
    </section>
  </>
);

export default Stats;