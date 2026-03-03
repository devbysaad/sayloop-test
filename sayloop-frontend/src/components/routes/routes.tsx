import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/clerk-react';

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
import { useMatchNotification } from '../../hooks/UserMatchNotification';
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
// Polls app-wide so the receiver sees the MatchFoundModal
// no matter which page they're on (except /session — that page has its own flow).

function GlobalMatchWatcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const myUserId = (() => {
    const v = localStorage.getItem('db_user_id');
    return v ? parseInt(v, 10) : null;
  })();

  const { acceptedMatch, clearAccepted } = useMatchNotification(myUserId);

  // Don't show the modal if user is already in a session
  if (!acceptedMatch || location.pathname === '/session') return null;

  const partner: MatchUser = {
    id: acceptedMatch.requester.id,
    firstName: acceptedMatch.requester.firstName ?? 'Partner',
    username: acceptedMatch.requester.username ?? '',
    pfpSource: acceptedMatch.requester.pfpSource ?? null,
    points: 0,
    learningLanguage: '',
    interests: [],
    streakLength: 0,
  };

  const handleStart = () => {
    clearAccepted();
    navigate('/session', {
      state: {
        sessionId: acceptedMatch.sessionId,
        partnerId: acceptedMatch.requesterId,
        topic: acceptedMatch.topic,
      },
    });
  };

  const handleCancel = () => {
    clearAccepted();
  };

  return (
    <MatchFoundModal
      partner={partner}
      topic={acceptedMatch.topic}
      sessionId={acceptedMatch.sessionId ?? ''}
      onStart={handleStart}
      onCancel={handleCancel}
    />
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

const AppRoutes = () => (
  <>
    {/* Runs globally — shows MatchFoundModal for User 2 from any page */}
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