import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/clerk-react'

import Marketing      from '../../page/LandingPages/Marketing'
import SignInPage     from '../modules/auth/SignIn'
import SignUpPage     from '../modules/auth/SignUp'
import OnboardingPage from '../modules/auth/OnBoardingPage'
import HomePage       from '../../page/Home/Home'
import Learn          from '../../page/Home/Learn'
import ProfilePage    from '../../page/Home/Profile'
import LeaderboardPage from '../../page/Home/LeaderBoard'
import QuestPage      from '../../page/Home/Quest'
import MorePage       from '../../page/Home/More'
import ShopPage       from '../../page/Home/ShopPage'
import SessionPage    from '../../page/Session/Session'

// ── Guards ────────────────────────────────────────────────────────────────────

/** Requires login. Redirects to /sign-in if not authenticated. */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}

/**
 * Requires login + completed onboarding.
 * New users (onboardingComplete !== true) are redirected to /onboarding.
 */
const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  if (!user?.unsafeMetadata?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}

// ── Routes ────────────────────────────────────────────────────────────────────

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"         element={<Marketing />} />
    <Route path="/sign-in/*" element={<SignInPage />} />
    <Route path="/sign-up/*" element={<SignUpPage />} />

    {/*
      SSO Callbacks — Clerk redirects here after Google OAuth.
      Always go to /home. OnboardingGuard handles new vs returning users.
    */}
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

    {/* Onboarding — login required, onboarding NOT yet required */}
    <Route
      path="/onboarding"
      element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      }
    />

    {/* App pages — login + completed onboarding required */}
    <Route path="/home"        element={<OnboardingGuard><HomePage /></OnboardingGuard>} />
    <Route path="/learn"       element={<OnboardingGuard><Learn /></OnboardingGuard>} />
    <Route path="/leaderboard" element={<OnboardingGuard><LeaderboardPage /></OnboardingGuard>} />
    <Route path="/quests"      element={<OnboardingGuard><QuestPage /></OnboardingGuard>} />
    <Route path="/more"        element={<OnboardingGuard><MorePage /></OnboardingGuard>} />
    <Route path="/shop"        element={<OnboardingGuard><ShopPage /></OnboardingGuard>} />
    <Route path="/profile"     element={<OnboardingGuard><ProfilePage /></OnboardingGuard>} />
    <Route path="/session"     element={<OnboardingGuard><SessionPage /></OnboardingGuard>} />
  </Routes>
)

export default AppRoutes