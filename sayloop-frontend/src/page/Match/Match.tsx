import { useEffect, useState } from 'react';
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
import { SwipeCardSkeleton, RequestCardSkeleton, HistoryRowSkeleton } from '../../components/ui/SkeletonCard';

type Tab = 'browse' | 'requests' | 'history';

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

  // Match socket listener is initialized globally by GlobalMatchWatcher in routes.tsx

  // Load users on mount
  useEffect(() => {
    dispatch(matchActions.loadUsers({ userId: myUserId }));
  }, [myUserId]);

  // Load requests / history when tab switches
  useEffect(() => {
    if (tab === 'requests') dispatch(matchActions.loadRequests({ userId: myUserId }));
    if (tab === 'history') dispatch(matchActions.loadHistory({ userId: myUserId }));
  }, [tab]);

  // When mode becomes 'confirmed', navigate to /session with the sessionId
  useEffect(() => {
    if (mode === 'confirmed' && matchedSessionId) {
      const sessionId = matchedSessionId;
      const topic = matchedTopic;
      const partnerId = matchedPartner?.id;
      dispatch(clearMatched());
      navigate('/session', {
        state: { sessionId, partnerId, topic },
      });
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

  // "Let's Go" — emit confirm-ready via socket, wait for match:session-start
  const handleLetsGo = () => {
    if (matchedMatchId) {
      dispatch(matchActions.confirmReady({ matchId: matchedMatchId }));
    }
  };

  const currentUser = users[cardIdx] ?? null;
  const pendingCount = requests.length;

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'browse', label: '🔍 Browse' },
    { id: 'requests', label: '📩 Requests', badge: pendingCount },
    { id: 'history', label: '📜 History' },
  ];

  // ── Waiting screen (full-page) ──────────────────────────────────────────────
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
    <div className="min-h-screen bg-[#fffbf5]">
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => dispatch(clearToast())} />
      )}

      {/* MatchFoundModal — shows when match is accepted, user clicks "Let's Go" to confirm */}
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
      <div className="bg-white border-b-2 border-blue-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md"
              style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">Find a Partner</h1>
              <p className="text-blue-400 text-xs font-semibold">Choose who you debate with</p>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-extrabold transition-all flex items-center justify-center gap-1.5
                  ${tab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
                {t.badge ? (
                  <span className="bg-blue-500 text-white text-[10px] font-black rounded-full
                    w-4 h-4 flex items-center justify-center">{t.badge}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">

        {/* ── Browse ── */}
        {tab === 'browse' && (
          usersLoading ? (
            <div className="space-y-4">
              <SwipeCardSkeleton />
            </div>
          ) : currentUser ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-500">{cardIdx + 1} of {users.length}</p>
                <div className="flex gap-1">
                  {users.map((_: any, i: number) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all
                      ${i < cardIdx ? 'w-4 bg-orange-400' : i === cardIdx ? 'w-6 bg-orange-500' : 'w-4 bg-gray-200'}`} />
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
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-7xl mb-4">🎉</div>
              <p className="text-gray-700 font-black text-2xl mb-2">You've seen everyone!</p>
              <p className="text-gray-400 font-semibold mb-6">Check your requests tab for responses.</p>
              <button
                onClick={() => dispatch(matchActions.loadUsers({ userId: myUserId }))}
                className="px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500
                  text-white font-extrabold shadow-md hover:shadow-lg transition-all">
                Refresh 🔄
              </button>
            </div>
          )
        )}

        {/* ── Requests ── */}
        {tab === 'requests' && (
          <IncomingRequests
            requests={requests}
            loading={requestsLoading}
            myUserId={myUserId}
            onAccept={(match) => dispatch(matchActions.acceptRequest({ matchId: match.id, match }))}
            onReject={(matchId) => dispatch(matchActions.rejectRequest({ matchId }))}
            onStartSession={handleLetsGo}
          />
        )}

        {/* ── History ── */}
        {tab === 'history' && (
          <MatchHistory history={history} loading={historyLoading} myUserId={myUserId} />
        )}
      </div>
    </div>
  );
};

export default MatchPage;