import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../../redux/saga/session.saga';
import MatchmakingScreen from '../../components/modules/sessions/MatchmakingScreen';
import SessionScreen from '../../components/modules/sessions/sessionScreen/index';
import ResultScreen from '../../components/modules/sessions/ResultScreen';

const DebatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((s: any) => s.session);
  const hasStarted = useRef(false);

  // State passed from MatchPage / GlobalMatchWatcher after a match is accepted
  const locationState = location.state as {
    sessionId?: string;
    partnerId?: number;
    topic?: string;
  } | null;

  const dbUserId = (() => {
    const stored = localStorage.getItem('db_user_id');
    return stored ? parseInt(stored, 10) : null;
  })();

  // On mount: if no sessionId in router state → send to /match
  // If sessionId present → join the existing session (NOT random matchmaking)
  useEffect(() => {
    if (!dbUserId) return;

    if (!locationState?.sessionId) {
      // No session context — nothing to do here, go pick a partner
      navigate('/match', { replace: true });
      return;
    }

    if (status === 'idle' && !hasStarted.current) {
      hasStarted.current = true;
      // KEY FIX: dispatch joinSession (joins existing match room)
      // instead of findPartner (starts random queue search)
      dispatch(sessionActions.joinSession({
        userId: dbUserId,
        sessionId: locationState.sessionId,
        topic: locationState.topic ?? '',
      }));
    }
  }, [dbUserId]); // run once when userId is ready



  // Cleanup on unmount — only leave if session actually connected (not during StrictMode re-mount)
  useEffect(() => {
    return () => {
      if (hasStarted.current && status !== 'idle') {
        dispatch(sessionActions.leaveSession());
      }
    };
  }, [dispatch, status]);

  // Loading state while db_user_id isn't written yet
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
      {/* searching — connecting to partner via socket */}
      {status === 'searching' && <MatchmakingScreen />}

      {/* matched / in_session — debate is live */}
      {(status === 'matched' || status === 'in_session') && (
        <SessionScreen userId={dbUserId} />
      )}

      {/* ended — show XP / result */}
      {status === 'ended' && <ResultScreen userId={dbUserId} />}

      {/* idle with no locationState = redirect handled in useEffect above — render nothing */}
    </div>
  );
};

export default DebatePage;