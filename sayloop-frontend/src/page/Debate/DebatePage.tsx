import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../redux/saga/session.saga';
import MatchmakingScreen from '../../components/modules/sessions/MatchmakingScreen';
import SessionScreen     from '../../components/modules/sessions/sessionScreen/index';
import ResultScreen      from '../../components/modules/sessions/ResultScreen';
import IdleScreen        from '../../components/modules/sessions/IdleScreen';

// Each browser tab generates a unique ID so the server treats them as different users.
// Replace with real Clerk userId once auth is wired up.
const MOCK_USER_ID = Math.floor(Math.random() * 900000) + 100000;

const DebatePage = () => {
  const dispatch = useDispatch();
  const { status, isConnected } = useSelector((s: any) => s.session);

  useEffect(() => {
    dispatch(sessionActions.connect({ userId: MOCK_USER_ID }));
    return () => {
      dispatch(sessionActions.disconnect());
    };
  }, [dispatch]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-600 font-semibold text-sm">Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {status === 'idle'       && <IdleScreen        userId={MOCK_USER_ID} />}
      {status === 'searching'  && <MatchmakingScreen  userId={MOCK_USER_ID} />}
      {status === 'matched'    && <SessionScreen      userId={MOCK_USER_ID} />}
      {status === 'in_session' && <SessionScreen      userId={MOCK_USER_ID} />}
      {status === 'ended'      && <ResultScreen       userId={MOCK_USER_ID} />}
    </div>
  );
};

export default DebatePage;