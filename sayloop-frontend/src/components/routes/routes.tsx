import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Marketing from '../../page/LandingPages/Marketing';
import SignInPage from '../modules/auth/SignIn';
import SignUpPage from '../modules/auth/SignUp';
import OnboardingPage from '../modules/auth/OnBoardingPage';
import HomePage from '../../page/Home/Home';
import Learn from '../../page/Home/Learn';
import ProfilePage from '../../page/Home/Profile';
import LeaderboardPage from '../../page/Home/LeaderBoard';
import QuestPage from '../../page/Home/Quest';
import MorePage from '../../page/Home/More';
import ShopPage from '../../page/Home/ShopPage';
import SessionPage from '../../page/Session/Session';
import MatchPage from '../../page/Match/Match';

import MatchFoundModal from '../modules/match/MatchFoundModal';
import { clearNotification } from '../../redux/slice/match.slice';
import { matchActions } from '../../redux/saga/match.saga';
import type { MatchUser } from '../../lib/matchApi';

// ── Guards ────────────────────────────────────────────────────────────────────

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
};

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!user?.unsafeMetadata?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// ── Global match watcher ──────────────────────────────────────────────────────
// Uses Redux state populated by match saga socket listeners.
// No more HTTP polling — match:request-received events arrive in real-time.

function GlobalMatchWatcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();

  const notification = useSelector((s: any) => s.match.notification);
  const matchMode = useSelector((s: any) => s.match.mode);
  const [socketDebug, setSocketDebug] = useState('not started');

  const myUserId = (() => {
    const v = localStorage.getItem('db_user_id');
    return v ? parseInt(v, 10) : null;
  })();

  // Debug: log notification changes
  useEffect(() => {
    console.log('[GlobalMatchWatcher] notification changed:', notification, 'mode:', matchMode, 'pathname:', location.pathname);
  }, [notification, matchMode, location.pathname]);

  // ── Socket init is now handled by useAuthInit (after /api/users/sync succeeds) ──
  // GlobalMatchWatcher previously polled localStorage to retry initMatchSocket,
  // but that caused a race: it could fire BEFORE sync completed (db_user_id not set)
  // or fire a SECOND time (double socket connection). Removed entirely.
  useEffect(() => {
    if (!isSignedIn) {
      setSocketDebug('not signed in');
      return;
    }
    // Just update the debug badge — socket state is managed by useAuthInit
    const timer = setTimeout(async () => {
      const sock = (await import('../../redux/service/socket.service')).getSocket();
      const state = sock
        ? (sock.connected ? 'connected' : sock.active ? 'connecting' : 'disconnected')
        : 'null';
      setSocketDebug(`socket: ${state} (id=${sock?.id || 'none'})`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isSignedIn]);


  // Don't show the modal if user is already in a session
  if (!notification || location.pathname === '/session') {
    // Show debug info as a tiny floating badge in dev mode
    if (import.meta.env.DEV) {
      return (
        <div style={{
          position: 'fixed', bottom: 4, right: 4, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)', color: '#0f0', fontSize: 10, padding: '2px 6px',
          borderRadius: 4, fontFamily: 'monospace', pointerEvents: 'none'
        }}>
          🔌 {socketDebug} | notif: {notification ? 'YES' : 'null'}
        </div>
      );
    }
    return null;
  }

  const partner: MatchUser = {
    id: notification.requester?.id ?? 0,
    firstName: notification.requester?.firstName ?? 'Partner',
    username: notification.requester?.username ?? '',
    pfpSource: notification.requester?.pfpSource ?? null,
    points: 0,
    learningLanguage: '',
    interests: [],
    streakLength: 0,
  };

  const handleStart = () => {
    // Accept the match immediately
    if (notification) {
      dispatch(matchActions.acceptRequest({
        matchId: notification.id,
        match: notification
      }));
    }
    dispatch(clearNotification());

    // Navigate to match page where the MatchFoundModal will overlay instantly
    navigate('/match');
  };

  const handleCancel = () => {
    dispatch(clearNotification());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} >
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ animation: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1)' }}>
        <div className="bg-gradient-to-br from-blue-400 to-indigo-500 px-6 pt-8 pb-6 text-center">
          <div className="text-5xl mb-3">📩</div>
          <h2 className="text-white font-black text-2xl mb-1">Match Request!</h2>
          <p className="text-white/80 font-semibold text-sm">
            {partner.firstName} wants to debate with you
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-black">
              {partner.firstName?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900 text-lg">{partner.firstName}</p>
              <p className="text-gray-400 text-sm font-semibold">@{partner.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200
            rounded-xl px-4 py-3 mb-6">
            <span className="text-2xl">💬</span>
            <span className="text-amber-800 font-extrabold capitalize">
              {notification.topic?.replace('_', ' ') ?? 'Topic'}
            </span>
          </div>
          <button onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500
              text-white font-black text-lg shadow-[0_8px_24px_rgba(251,191,36,0.45)]
              hover:shadow-[0_12px_32px_rgba(251,191,36,0.55)]
              hover:-translate-y-0.5 transition-all active:scale-95">
            Accept & Debate 🚀
          </button>
          <button onClick={handleCancel}
            className="w-full mt-3 py-3 rounded-2xl border-2 border-gray-200 text-gray-500
              font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50
              transition-all active:scale-95">
            ✕ Dismiss
          </button>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div >
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

const AppRoutes = () => (
  <>
    {/* Runs globally — shows notification for User 2 from any page */}
    <GlobalMatchWatcher />

    <Routes>
      {/* Public */}
      <Route path="/" element={<Marketing />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* SSO callbacks */}
      <Route
        path="/sign-in/sso-callback"
        element={
          <AuthenticateWithRedirectCallback
            signInFallbackRedirectUrl="/home"
            signUpFallbackRedirectUrl="/home"
          />
        }
      />
      <Route
        path="/sign-up/sso-callback"
        element={
          <AuthenticateWithRedirectCallback
            signInFallbackRedirectUrl="/home"
            signUpFallbackRedirectUrl="/home"
          />
        }
      />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected app pages */}
      <Route path="/home" element={<OnboardingGuard><HomePage /></OnboardingGuard>} />
      <Route path="/learn" element={<OnboardingGuard><Learn /></OnboardingGuard>} />
      <Route path="/leaderboard" element={<OnboardingGuard><LeaderboardPage /></OnboardingGuard>} />
      <Route path="/quests" element={<OnboardingGuard><QuestPage /></OnboardingGuard>} />
      <Route path="/more" element={<OnboardingGuard><MorePage /></OnboardingGuard>} />
      <Route path="/shop" element={<OnboardingGuard><ShopPage /></OnboardingGuard>} />
      <Route path="/profile" element={<OnboardingGuard><ProfilePage /></OnboardingGuard>} />
      <Route path="/session" element={<OnboardingGuard><SessionPage /></OnboardingGuard>} />
      <Route path="/match" element={<OnboardingGuard><MatchPage /></OnboardingGuard>} />
    </Routes>
  </>
);

export default AppRoutes;