import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../redux/saga/session.saga';
import MatchmakingScreen from '../../components/modules/sessions/MatchmakingScreen';
import SessionScreen from '../../components/modules/sessions/sessionScreen/index';
import ResultScreen from '../../components/modules/sessions/ResultScreen';

/**
 * SessionPage — only handles ACTIVE sessions.
 *
 * Flow:
 *   /match  →  user picks partner + topic  →  navigate('/session', { state })
 *   /session →  this page kicks off joinSession with the sessionId from state
 *
 * If someone lands on /session with no state (direct URL hit), redirect to /match.
 */
const SessionPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { status } = useSelector((s: any) => s.session);

  const dbUserId = parseInt(localStorage.getItem('db_user_id') ?? '0', 10);

  // State passed from MatchPage / GlobalMatchWatcher after a match is confirmed
  const locationState = location.state as {
    sessionId?: string;
    partnerId?: number;
    topic?:     string;
  } | null;

  useEffect(() => {
    // No session context — send them back to the match page
    if (!locationState?.sessionId && status === 'idle') {
      navigate('/match', { replace: true });
      return;
    }

    // ✅ FIX: Dispatch joinSession (not findPartner) so the saga emits
    // 'match:join-session' with the correct sessionId instead of entering
    // the random matchmaking queue via 'find-partner'.
    if (locationState?.sessionId && status === 'idle' && dbUserId) {
      dispatch(sessionActions.joinSession({
        userId:    dbUserId,
        sessionId: locationState.sessionId,
        topic:     locationState.topic ?? 'General',
      }));
    }
  }, []); // run once on mount

  // Cleanup on unmount
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* searching — connecting to partner */}
      {status === 'searching' && <MatchmakingScreen />}

      {/* matched / in_session — debate is live */}
      {(status === 'matched' || status === 'in_session') && (
        <SessionScreen userId={dbUserId} />
      )}

      {/* ended — show XP / result */}
      {status === 'ended' && <ResultScreen userId={dbUserId} />}

      {/* idle with no state = redirect handled in useEffect above */}
    </div>
  );
};

export default SessionPage;