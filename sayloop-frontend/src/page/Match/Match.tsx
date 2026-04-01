import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { matchActions } from '../../redux/saga/match.saga';
import { clearMatched, clearToast } from '../../redux/slice/match.slice';
import SwipeCard from '../../components/modules/match/SwipeCard';
import WaitingScreen from '../../components/modules/match/WaitingScreen';
import MatchFoundModal from '../../components/modules/match/MatchFoundModal';
import IncomingRequests from '../../components/modules/match/IncomingRequest';
import MatchHistory from '../../components/modules/match/MatchHistory';
import Toast from '../../components/modules/match/Toast';
import { SwipeCardSkeleton } from '../../components/ui/SkeletonCard';

type Tab = 'browse' | 'requests' | 'history';

// ── Auto-retry searching component ────────────────────────────────────────────
// Pure UI only — no polling. Polling is managed by MatchPage so
// mount/unmount cycles caused by usersLoading toggling can't trigger new fetches.
const AutoRetrySearching = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsTimer = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(dotsTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E8480C] animate-spin" />
        <div className="absolute inset-3 rounded-full flex items-center justify-center text-2xl"
          style={{ background: '#FFF4EF' }}>🔍</div>
      </div>
      <p className="font-black text-[#141414] text-xl mb-1" style={{ letterSpacing: '-0.3px' }}>
        Looking for partners{dots}
      </p>
      <p className="text-sm font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>
        Checking for new users to match with
      </p>
    </div>
  );
};

const MatchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myUserId = parseInt(localStorage.getItem('db_user_id') ?? '0', 10);

  const {
    users, usersLoading, cardIdx,
    mode, pendingMatchId, pendingPartner, pendingTopic,
    matchedMatchId, matchedSessionId, matchedPartner, matchedTopic,
    requests, requestsLoading,
    history, historyLoading,
    toast,
  } = useSelector((s: any) => s.match);

  const [tab, setTab] = useState<Tab>('browse');
  const [topic, setTopic] = useState('');

  // ── Initial load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (myUserId) dispatch(matchActions.loadUsers({ userId: myUserId }));
  }, [myUserId]);

  useEffect(() => {
    if (tab === 'requests') dispatch(matchActions.loadRequests({ userId: myUserId }));
    if (tab === 'history') dispatch(matchActions.loadHistory({ userId: myUserId }));
  }, [tab]);

  // ── Stable 4-second polling — ONLY when no users found and on browse tab ─────
  // Kept here (not inside AutoRetrySearching) so the interval is NOT destroyed
  // when usersLoading flips true (which temporarily unmounts AutoRetrySearching
  // to show the skeleton — that was causing the 429 flood).
  const usersLoadingRef = useRef(usersLoading);
  usersLoadingRef.current = usersLoading;
  const usersRef = useRef(users);
  usersRef.current = users;

  useEffect(() => {
    if (tab !== 'browse' || !myUserId) return;
    // Wait 4s before first retry (never fire immediately — the initial load
    // via the effect above already ran the first fetch).
    const timer = setInterval(() => {
      // Skip if a request is already in-flight or users appeared
      if (!usersLoadingRef.current && usersRef.current.length === 0) {
        dispatch(matchActions.loadUsers({ userId: myUserId }));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [tab, myUserId]); // stable — only resets when tab or userId changes

  useEffect(() => {
    if (mode === 'confirmed' && matchedSessionId) {
      const sessionId = matchedSessionId;
      const topic = matchedTopic;
      const partnerId = matchedPartner?.id;
      dispatch(clearMatched());
      navigate('/session', { state: { sessionId, partnerId, topic } });
    }
  }, [mode, matchedSessionId]);

  const handleSend = () => {
    const partner = users[cardIdx];
    if (!topic || !partner) return;
    dispatch(matchActions.sendRequest({ userId: myUserId, partnerId: partner.id, topic, partner }));
    setTopic('');
  };

  const handleSkip = () => {
    dispatch({ type: 'match/nextCard' });
    setTopic('');
  };

  const handleLetsGo = () => {
    if (matchedMatchId) dispatch(matchActions.confirmReady({ matchId: matchedMatchId }));
  };

  const currentUser = users[cardIdx] ?? null;
  const pendingCount = requests.length;

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'browse', label: '🔍 Browse' },
    { id: 'requests', label: '📩 Requests', badge: pendingCount },
    { id: 'history', label: '📜 History' },
  ];

  if (mode === 'waiting' && pendingMatchId && pendingPartner) {
    return (
      <WaitingScreen
        partner={pendingPartner}
        topic={pendingTopic}
        onCancel={() => dispatch(matchActions.cancelWaiting())}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => dispatch(clearToast())} />}

      {mode === 'matched' && matchedPartner && (
        <MatchFoundModal
          partner={matchedPartner}
          topic={matchedTopic}
          sessionId={matchedSessionId}
          onStart={handleLetsGo}
          onCancel={() => dispatch(clearMatched())}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm"
        style={{ borderColor: 'rgba(20,20,20,0.08)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
              style={{ background: '#141414' }}>💬</div>
            <div>
              <h1 className="font-black text-[#141414] text-lg leading-none" style={{ letterSpacing: '-0.3px' }}>Find a Partner</h1>
              <p className="text-[11px] font-normal mt-0.5" style={{ color: '#3D7A5C' }}>Choose who you practice with</p>
            </div>
          </div>
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(20,20,20,0.05)' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2 rounded-lg text-sm font-black transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: tab === t.id ? 'white' : 'transparent',
                  color: tab === t.id ? '#E8480C' : 'rgba(20,20,20,0.45)',
                  boxShadow: tab === t.id ? '0 1px 4px rgba(20,20,20,0.08)' : 'none',
                }}>
                {t.label}
                {t.badge ? (
                  <span className="text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ background: '#E8480C' }}>{t.badge}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {tab === 'browse' && (
          usersLoading ? (
            <div className="space-y-4"><SwipeCardSkeleton /></div>
          ) : currentUser ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium" style={{ color: 'rgba(20,20,20,0.4)' }}>{cardIdx + 1} of {users.length}</p>
                <div className="flex gap-1">
                  {users.map((_: any, i: number) => (
                    <div key={i} className="h-1.5 rounded-full transition-all"
                      style={{
                        width: i === cardIdx ? 24 : 16,
                        background: i < cardIdx ? '#3D7A5C' : i === cardIdx ? '#E8480C' : 'rgba(20,20,20,0.1)',
                      }} />
                  ))}
                </div>
              </div>
              <SwipeCard
                user={currentUser} topic={topic} onTopic={setTopic}
                onSkip={handleSkip} onSend={handleSend}
                sending={false} exiting={false} exitDir={null}
              />
            </>
          ) : (
            <AutoRetrySearching />
          )
        )}

        {tab === 'requests' && (
          <IncomingRequests
            requests={requests} loading={requestsLoading} myUserId={myUserId}
            onAccept={(match) => dispatch(matchActions.acceptRequest({ matchId: match.id, match }))}
            onReject={(matchId) => dispatch(matchActions.rejectRequest({ matchId }))}
            onStartSession={handleLetsGo}
          />
        )}

        {tab === 'history' && (
          <MatchHistory history={history} loading={historyLoading} myUserId={myUserId} />
        )}
      </div>
    </div>
  );
};

export default MatchPage;