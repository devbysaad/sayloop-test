import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import NicknamePicker from '../../components/modules/auth/NicknamePicker';

/**
 * Onboarding page — shown after first signup to let the user pick a nickname.
 * The nickname is stored in localStorage and sent to backend via /api/users/sync.
 */
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
      // Store locally for immediate use
      localStorage.setItem('user_nickname', selectedNick);

      // Try to update on backend (non-blocking — if it fails, locally stored is enough)
      try {
        const token = await (window as any).Clerk?.session?.getToken();
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ nickname: selectedNick }),
        });
      } catch {
        // Silently fail — nickname is stored locally and can be synced later
      }

      navigate('/home', { replace: true });
    } catch (err: any) {
      setError('Something went wrong. Try again.');
    }
    setSaving(false);
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&display=swap');
        .onboard * { font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .onboard { animation: fadeUp 0.5s ease; }
      `}</style>

      <div className="onboard w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
          <span className="text-2xl font-black text-slate-800">SayLoop</span>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-full px-3 py-1 mb-4">
              <span className="text-blue-500 text-xs">🎭</span>
              <span className="text-blue-600 text-xs font-black uppercase tracking-widest">Step 1 of 1</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">
              Hi {firstName}! 👋
            </h1>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              Choose a display nickname. Your real name stays hidden from other users — this keeps SayLoop safe and focused on learning.
            </p>
          </div>

          {/* Nickname Picker */}
          <NicknamePicker realName={firstName} onSelect={setSelectedNick} />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs font-semibold mt-3">{error}</p>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedNick || saving}
            className="mt-5 w-full py-4 rounded-2xl font-black text-base text-white transition-all
              disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: selectedNick ? 'linear-gradient(135deg,#3B82F6,#22C55E)' : '#E2E8F0' }}
          >
            {saving
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : selectedNick
                ? `Continue as "${selectedNick}" 🚀`
                : 'Pick a nickname first'
            }
          </button>

          <p className="text-center text-slate-400 text-xs font-semibold mt-4">
            🔒 Your real name is never shown to other users
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
