import PageShell from '../../components/modules/home/PageShell';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    title: 'Learn',
    items: [
      { label: 'Courses', description: 'Browse all courses', path: '/courses' },
      { label: 'Lessons', description: 'Continue your lessons', path: '/lessons' },
      { label: 'Progress', description: 'Track your learning progress', path: '/progress' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Leaderboard', description: 'See top learners this week', path: '/leaderboard' },
      { label: 'Friends', description: 'Connect with other learners', path: '/friends' },
      { label: 'Find Partner', description: 'Practice with a partner', path: '/match' },
    ],
  },
  {
    title: 'Rewards',
    items: [
      { label: 'Quests', description: 'Complete daily quests', path: '/quests' },
      { label: 'Shop', description: 'Spend your gems', path: '/shop' },
      { label: 'Leagues', description: 'Compete in your league', path: '/leagues' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', description: 'View and edit your profile', path: '/profile' },
      { label: 'Notifications', description: 'Manage your notifications', path: '/notifications' },
      { label: 'Settings', description: 'App preferences', path: '/settings' },
    ],
  },
];

const SECTION_COLORS = ['#E8480C', '#3D7A5C', '#B45309', '#141414'];

const MorePage = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>
      <div className="mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <p className="text-[#141414]/40 text-[13px] font-normal m-0 mb-0.5">All features</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-black text-[#141414] m-0" style={{ letterSpacing: '-0.5px' }}>More</h1>
      </div>

      <div className="flex flex-col gap-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {sections.map((section, si) => {
          const accent = SECTION_COLORS[si];
          return (
            <div key={section.title}>
              <p className="text-[#141414]/40 text-[11px] font-black uppercase tracking-widest mb-2 m-0">
                {section.title}
              </p>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="bg-white rounded-xl px-5 py-4 flex items-center gap-4 text-left w-full cursor-pointer transition-all duration-150 hover:translate-x-1 shadow-sm"
                    style={{ border: '1px solid rgba(20,20,20,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}35`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(20,20,20,0.08)')}
                  >
                    <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
                      <div className="w-4 h-4 rounded-full" style={{ background: accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#141414] text-[14px] m-0 mb-0.5">{item.label}</p>
                      <p className="font-normal text-[#141414]/45 text-[12px] m-0">{item.description}</p>
                    </div>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ color: 'rgba(20,20,20,0.25)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default MorePage;