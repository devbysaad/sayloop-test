// ─── DebatePage ───────────────────────────────────────────────────────────────
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
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  const locationState = location.state as { sessionId?: string; partnerId?: number; topic?: string } | null;

  const dbUserId = (() => {
    const stored = localStorage.getItem('db_user_id');
    return stored ? parseInt(stored, 10) : null;
  })();

  useEffect(() => {
    if (!dbUserId) return;
    if (!locationState?.sessionId) { navigate('/match', { replace: true }); return; }
    if (status === 'idle' && !hasStarted.current) {
      hasStarted.current = true;
      dispatch(sessionActions.joinSession({ userId: dbUserId, sessionId: locationState.sessionId, topic: locationState.topic ?? '' }));
    }
  }, [dbUserId]);

  useEffect(() => {
    return () => {
      if (hasStarted.current && statusRef.current !== 'idle') dispatch(sessionActions.leaveSession());
    };
  }, [dispatch]);

  if (!dbUserId) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor: 'rgba(20,20,20,0.1)', borderTopColor: '#E8480C' }} />
        <p className="text-sm font-medium" style={{ color: 'rgba(20,20,20,0.5)' }}>Loading your profile…</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(20,20,20,0.3)' }}>Make sure you are signed in</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#F8F5EF' }}>
      {status === 'searching' && <MatchmakingScreen />}
      {(status === 'matched' || status === 'in_session') && <SessionScreen userId={dbUserId} />}
      {status === 'ended' && <ResultScreen userId={dbUserId} />}
    </div>
  );
};

export default DebatePage;