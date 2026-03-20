import PageShell from '../../components/modules/home/PageShell';

const ShopPage = () => {
  const items = [
    { id: 1, name: 'Streak Freeze', description: 'Protect your streak for one day', price: 10, category: 'Power-ups' },
    { id: 2, name: 'Double XP', description: 'Earn 2x XP for 1 hour', price: 20, category: 'Power-ups' },
    { id: 3, name: 'Extra Heart', description: 'Get one extra heart', price: 5, category: 'Hearts' },
    { id: 4, name: 'Full Hearts', description: 'Refill all your hearts instantly', price: 15, category: 'Hearts' },
    { id: 5, name: 'Dark Theme', description: 'Unlock dark mode for the app', price: 50, category: 'Themes' },
    { id: 6, name: 'Gold Theme', description: 'Unlock gold mode for the app', price: 75, category: 'Themes' },
  ];

  const categories = [...new Set(items.map(i => i.category))];

  const categoryAccent: Record<string, { bg: string; border: string; color: string }> = {
    'Power-ups': { bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)', color: '#E8480C' },
    'Hearts': { bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)', color: '#E8480C' },
    'Themes': { bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)', color: '#3D7A5C' },
  };

  return (
    <PageShell>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>
      <div className="mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <p className="text-[#141414]/40 text-[13px] font-normal m-0 mb-0.5">Spend your gems</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-black text-[#141414] m-0" style={{ letterSpacing: '-0.5px' }}>Shop</h1>
      </div>

      {/* Balance banner */}
      <div className="rounded-xl px-5 py-4 mb-6 flex items-center justify-between"
        style={{ background: '#141414', fontFamily: "'Outfit', sans-serif" }}>
        <div>
          <p className="text-white/40 text-[12px] font-normal m-0 mb-0.5">Your balance</p>
          <p className="text-white font-black text-[22px] m-0" style={{ letterSpacing: '-0.5px' }}>0 Gems</p>
        </div>
        <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center font-black text-white text-[18px]"
          style={{ background: '#B45309' }}>
          G
        </div>
      </div>

      {categories.map(category => {
        const acc = categoryAccent[category] ?? categoryAccent['Power-ups'];
        return (
          <div key={category} className="mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <p className="text-[#141414] font-black text-[14px] mb-3 uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>{category}</p>
            <div className="flex flex-col gap-3">
              {items.filter(i => i.category === category).map(item => (
                <div key={item.id} className="bg-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm"
                  style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
                  <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: acc.bg, border: `1px solid ${acc.border}` }}>
                    <div className="w-5 h-5 rounded-full" style={{ background: acc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#141414] text-[14px] m-0 mb-0.5">{item.name}</p>
                    <p className="font-normal text-[#141414]/45 text-[12px] m-0">{item.description}</p>
                  </div>
                  <button className="shrink-0 text-white font-black text-[12px] px-4 py-2 rounded-xl border-none cursor-pointer hover:scale-105 transition-transform active:scale-95"
                    style={{ background: acc.color, boxShadow: `0 4px 12px ${acc.color}35` }}>
                    {item.price} G
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </PageShell>
  );
};

export default ShopPage;