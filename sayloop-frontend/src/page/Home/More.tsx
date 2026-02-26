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

const MorePage = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <div className="animate-fade-in-up mb-5 font-sans">
        <p className="text-[#9ca3af] text-[13px] font-bold m-0 mb-0.5">All features</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-[900] text-[#1a1a26] m-0">More</h1>
      </div>

      <div className="flex flex-col gap-6 font-sans">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[#9ca3af] text-[11px] font-[900] uppercase tracking-widest mb-2 m-0">
              {section.title}
            </p>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="bg-white border-2 border-[#fef3c7] rounded-[18px] px-5 py-4 flex items-center gap-4 text-left w-full cursor-pointer hover:border-[#fbbf24] transition-all duration-150 hover:translate-x-1"
                >
                  <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef3c7] flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f97316]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-0.5">{item.label}</p>
                    <p className="font-[600] text-[#9ca3af] text-[12px] m-0">{item.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-[#9ca3af] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
};

export default MorePage;