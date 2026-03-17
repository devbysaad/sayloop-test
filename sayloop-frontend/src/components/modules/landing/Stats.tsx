import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { emoji:'🗣️', value:14000, suffix:'+', label:'Daily Conversations', color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
  { emoji:'⚡', value:50000, suffix:'+', label:'Learners Active',     color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
  { emoji:'🌎', value:190,   suffix:'+', label:'Countries',           color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
  { emoji:'⭐', value:4.9,   suffix:'',  label:'App Rating', decimal:true, color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE' },
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
      className="flex-1 min-w-[160px] rounded-3xl p-6 text-center hover:-translate-y-2 transition-all duration-300 cursor-default group shadow-sm hover:shadow-xl border-2"
      style={{ background: bg, borderColor: border }}>
      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">{emoji}</div>
      <p className="text-4xl mb-1 font-black" style={{ color }}>
        {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-500 text-sm font-semibold">{label}</p>
    </div>
  );
};

const Stats = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');`}</style>
    <section className="py-20 px-6 bg-slate-50" style={{ fontFamily:"'Outfit',sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-5">
          {STATS.map((s, i) => <Card key={i} {...s} />)}
        </div>
      </div>
    </section>
  </>
);

export default Stats;