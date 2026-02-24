import React from 'react';
import Routes from './components/routes/routes';
import { useAuthInit } from './hooks/useAuthInit';

const AuthInitializer = () => {
  // Runs on every signed-in session:
  // - writes clerk_token to localStorage (used by all API services)
  // - calls /api/users/sync, stores db_user_id to localStorage (used by DebatePage etc.)
  useAuthInit();
  return null;
};

const App = () => {
  return (
    <div>
      <AuthInitializer />
      <Routes />
    </div>
  );
};

export default App;