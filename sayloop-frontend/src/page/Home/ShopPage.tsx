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

  return (
    <PageShell>
      <div className="animate-fade-in-up mb-5 font-sans">
        <p className="text-[#9ca3af] text-[13px] font-bold m-0 mb-0.5">Spend your gems</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-[900] text-[#1a1a26] m-0">Shop</h1>
      </div>

      <div className="bg-gradient-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[20px] px-5 py-4 mb-6 flex items-center justify-between font-sans">
        <div>
          <p className="text-[#9ca3af] text-[12px] font-[600] m-0 mb-0.5">Your balance</p>
          <p className="text-white font-[900] text-[22px] m-0">0 Gems</p>
        </div>
        <div className="w-[46px] h-[46px] rounded-[14px] bg-gradient-to-br from-[#fbbf24] to-[#f97316] flex items-center justify-center font-[900] text-white text-[20px]">
          G
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-6 font-sans">
          <p className="text-[#1a1a26] font-[900] text-[15px] mb-3">{category}</p>
          <div className="flex flex-col gap-3">
            {items.filter(i => i.category === category).map(item => (
              <div key={item.id} className="bg-white border-2 border-[#fef3c7] rounded-[18px] px-5 py-4 flex items-center gap-4">
                <div className="w-[46px] h-[46px] rounded-[14px] bg-[#fef3c7] flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f97316]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-0.5">{item.name}</p>
                  <p className="font-[600] text-[#9ca3af] text-[12px] m-0">{item.description}</p>
                </div>
                <button className="shrink-0 bg-gradient-to-br from-[#fbbf24] to-[#f97316] text-white font-[900] text-[12px] px-4 py-2 rounded-[12px] border-none cursor-pointer">
                  {item.price} G
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </PageShell>
  );
};

export default ShopPage;