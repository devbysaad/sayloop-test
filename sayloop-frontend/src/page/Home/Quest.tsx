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
      <div className="animate-fade-in-up mb-5 font-sans">
        <p className="text-[#9ca3af] text-[13px] font-bold m-0 mb-0.5">Daily</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-[900] text-[#1a1a26] m-0">Quests</h1>
      </div>

      <div className="flex flex-col gap-3">
        {quests.map((quest) => {
          const percent = Math.round((quest.progress / quest.total) * 100);
          const done = quest.progress >= quest.total;
          return (
            <div key={quest.id} className={`bg-white border-2 rounded-[18px] px-5 py-4 font-sans ${done ? 'border-[#fbbf24]' : 'border-[#fef3c7]'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-0.5">{quest.title}</p>
                  <p className="font-[600] text-[#9ca3af] text-[12px] m-0">{quest.description}</p>
                </div>
                <div className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-[900] ${done ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-gray-100 text-gray-500'}`}>
                  +{quest.xp} XP
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f97316] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-[11px] font-[900] text-[#9ca3af] m-0 shrink-0">
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