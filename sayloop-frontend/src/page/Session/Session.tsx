import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// FIX: sessionActions lives in the SAGA, not the slice.
// The slice only exports state actions (setSearching, setMatched, etc.)
import { sessionActions } from '../../redux/saga/session.saga';
import MatchmakingScreen from '../../components/modules/sessions/MatchmakingScreen';
import SessionScreen from '../../components/modules/sessions/sessionScreen/index';
import ResultScreen from '../../components/modules/sessions/ResultScreen';
import IdleScreen from '../../components/modules/sessions/IdleScreen';

const DebatePage = () => {
  const dispatch = useDispatch();
  // FIX: removed 'connecting' and 'waiting' — valid statuses are:
  // 'idle' | 'searching' | 'matched' | 'in_session' | 'ended'
  const { status } = useSelector((s: any) => s.session);

  const reduxUserId: number | null = useSelector(
    (s: any) => s.profile?.profileStats?.userId ?? null,
  );

  const [dbUserId, setDbUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem('db_user_id');
    return stored ? parseInt(stored, 10) : null;
  });

  // Poll localStorage every 500ms until useAuthInit writes db_user_id
  useEffect(() => {
    if (dbUserId) return;
    const interval = setInterval(() => {
      const stored = localStorage.getItem('db_user_id');
      if (stored) {
        setDbUserId(parseInt(stored, 10));
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dbUserId]);

  // Also accept userId from Redux profile if available sooner than localStorage
  useEffect(() => {
    if (!dbUserId && reduxUserId) setDbUserId(reduxUserId);
  }, [reduxUserId, dbUserId]);

  // FIX: was dispatching sessionActions.connect / sessionActions.disconnect
  // — those don't exist. The correct actions are sessionActions.findPartner
  // (dispatched by IdleScreen when the user picks a topic) and
  // sessionActions.leaveSession / sessionActions.reset (on unmount).
  // This effect now only cleans up on unmount — it does NOT auto-start searching.
  useEffect(() => {
    return () => {
      dispatch(sessionActions.leaveSession());
    };
  }, [dispatch]);

  if (!dbUserId) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-500 text-sm font-semibold">Loading your profile…</p>
          <p className="text-stone-400 text-xs mt-1">Make sure you are signed in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* idle — user picks a topic and clicks "Find Partner" */}
      {status === 'idle' && <IdleScreen userId={dbUserId} />}

      {/* searching — waiting in queue for an opponent */}
      {status === 'searching' && <MatchmakingScreen />}

      {/* matched / in_session — debate is live */}
      {(status === 'matched' || status === 'in_session') && (
        <SessionScreen userId={dbUserId} />
      )}

      {/* ended — show XP / result */}
      {status === 'ended' && <ResultScreen userId={dbUserId} />}
    </div>
  );
};

export default DebatePage;