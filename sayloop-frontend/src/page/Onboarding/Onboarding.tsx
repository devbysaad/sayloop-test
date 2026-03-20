import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import NicknamePicker from '../../components/modules/auth/NicknamePicker';

const OnboardingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedNick, setSelectedNick] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = user?.firstName || user?.username || 'User';

  const handleContinue = async () => {
    if (!selectedNick) return;
    setSaving(true);
    setError(null);
    try {
      localStorage.setItem('user_nickname', selectedNick);
      try {
        const token = await (window as any).Clerk?.session?.getToken();
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ nickname: selectedNick }),
        });
      } catch { }
      navigate('/home', { replace: true });
    } catch {
      setError('Something went wrong. Try again.');
    }
    setSaving(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F5EF' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'rgba(20,20,20,0.15)', borderTopColor: '#E8480C' }} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .onboard { animation: fadeUp 0.5s ease; }
      `}</style>

      <div className="onboard w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="SayLoop" className="h-12" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
              style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>
              <span className="text-[11px]">🎭</span>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#E8480C' }}>Step 1 of 1</span>
            </div>
            <h1 className="text-2xl font-black text-[#141414] mb-2" style={{ letterSpacing: '-0.5px' }}>
              Hi {firstName}! 👋
            </h1>
            <p className="text-sm font-normal leading-relaxed" style={{ color: 'rgba(20,20,20,0.5)' }}>
              Choose a display nickname. Your real name stays hidden from other users — this keeps SayLoop safe and focused on learning.
            </p>
          </div>

          <NicknamePicker realName={firstName} onSelect={setSelectedNick} />

          {error && <p className="text-[12px] font-medium mt-3" style={{ color: '#E8480C' }}>{error}</p>}

          <button
            onClick={handleContinue}
            disabled={!selectedNick || saving}
            className="mt-5 w-full py-4 rounded-xl font-black text-base text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: selectedNick ? '#E8480C' : 'rgba(20,20,20,0.1)', boxShadow: selectedNick ? '0 4px 16px rgba(232,72,12,0.3)' : 'none' }}
          >
            {saving
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : selectedNick
                ? `Continue as "${selectedNick}" →`
                : 'Pick a nickname first'
            }
          </button>

          <p className="text-center text-[11px] font-normal mt-4" style={{ color: 'rgba(20,20,20,0.35)' }}>
            🔒 Your real name is never shown to other users
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;