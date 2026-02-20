import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../redux/service/session.saga';
import MatchmakingScreen from '../../components/modules/sessions/MatchmakingScreen';
import SessionScreen from '../../components/modules/sessions/SessionScreen';
import ResultScreen from '../../components/modules/sessions/ResultScreen';
import IdleScreen from '../../components/modules/sessions/IdleScreen';

// 👉 Replace with real user ID from Clerk
const MOCK_USER_ID = 1;

const DebatePage = () => {
  const dispatch = useDispatch();
  const { status, isConnected } = useSelector((s) => s.session);

  // Connect socket when page mounts
  useEffect(() => {
    dispatch(sessionActions.connect({ userId: MOCK_USER_ID }));
    return () => dispatch(sessionActions.disconnect());
  }, [dispatch]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#4B4B4B] font-bold">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {status === 'idle' && <IdleScreen userId={MOCK_USER_ID} />}
      {status === 'searching' && <MatchmakingScreen userId={MOCK_USER_ID} />}
      {status === 'matched' && <SessionScreen userId={MOCK_USER_ID} />}
      {status === 'in_session' && <SessionScreen userId={MOCK_USER_ID} />}
      {status === 'ended' && <ResultScreen userId={MOCK_USER_ID} />}
    </div>
  );
};

export default DebatePage;
