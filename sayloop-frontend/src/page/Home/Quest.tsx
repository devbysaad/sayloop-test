import PageShell from '../../components/modules/home/PageShell';

const QuestPage = () => {
  const quests = [
    { id: 1, title: 'Complete 3 lessons', description: 'Finish any 3 lessons today', progress: 2, total: 3, xp: 50 },
    { id: 2, title: 'Win a debate', description: 'Win your first debate session', progress: 0, total: 1, xp: 100 },
    { id: 3, title: 'Practice streak', description: 'Maintain a 3 day streak', progress: 1, total: 3, xp: 75 },
    { id: 4, title: 'Find a partner', description: 'Connect with a language partner', progress: 0, total: 1, xp: 30 },
  ];

  return (
    <PageShell>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>
      <div className="mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <p className="text-[#141414]/40 text-[13px] font-normal m-0 mb-0.5">Daily</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-black text-[#141414] m-0" style={{ letterSpacing: '-0.5px' }}>Quests</h1>
      </div>

      <div className="flex flex-col gap-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {quests.map((quest) => {
          const percent = Math.round((quest.progress / quest.total) * 100);
          const done = quest.progress >= quest.total;
          return (
            <div key={quest.id} className="bg-white rounded-xl px-5 py-4"
              style={{ border: done ? '1.5px solid rgba(61,122,92,0.35)' : '1px solid rgba(20,20,20,0.08)', boxShadow: '0 1px 4px rgba(20,20,20,0.05)' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#141414] text-[14px] m-0 mb-0.5">{quest.title}</p>
                  <p className="font-normal text-[#141414]/45 text-[12px] m-0">{quest.description}</p>
                </div>
                <div className="shrink-0 px-3 py-1 rounded-full text-[11px] font-black"
                  style={done
                    ? { background: '#F0FAF4', color: '#3D7A5C', border: '1px solid rgba(61,122,92,0.22)' }
                    : { background: 'rgba(20,20,20,0.05)', color: 'rgba(20,20,20,0.4)' }}>
                  +{quest.xp} XP
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(20,20,20,0.07)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, background: done ? '#3D7A5C' : '#E8480C' }}
                  />
                </div>
                <p className="text-[11px] font-black text-[#141414]/35 m-0 shrink-0">
                  {quest.progress}/{quest.total}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default QuestPage;