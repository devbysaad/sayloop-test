import React from 'react';
import Routes from './components/routes/routes';
import { useAuthInit } from './hooks/useAuthInit';
import LevelUpModal from './components/modules/sessions/LevelUpModal';
import { usePageTracking } from './hooks/usePageTracking';

const AuthInitializer = () => {
  // Runs on every signed-in session:
  // - writes clerk_token to localStorage (used by all API services)
  // - calls /api/users/sync, stores db_user_id to localStorage (used by DebatePage etc.)
  // - dispatches FETCH_ECONOMY to load initial economy state
  useAuthInit();
  return null;
};

const App = () => {
  usePageTracking();
  return (
    <div>
      <AuthInitializer />
      <Routes />
      {/* Global economy modals — rendered over any page */}
      <LevelUpModal />
    </div>
  );
};

export default App;