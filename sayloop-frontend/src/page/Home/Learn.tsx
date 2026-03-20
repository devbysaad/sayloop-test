import { useState } from 'react';
import PageShell from '../../components/modules/home/PageShell';

type NodeType = 'lesson' | 'practice' | 'chest' | 'talk' | 'checkpoint' | 'story' | 'locked-lesson' | 'locked-chest' | 'locked-talk';
type NodePos = 'left' | 'center' | 'right';
type NodeState = 'done' | 'active' | 'locked';

interface PathNode {
  id: number;
  type: NodeType;
  pos: NodePos;
  state: NodeState;
  icon: string;
  label: string;
  xp?: number;
  stars?: number;
}

interface Unit {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  textColor: string;
  nodes: PathNode[];
}

const UNITS: Unit[] = [
  {
    id: 1,
    title: 'Section 1, Unit 1',
    subtitle: 'Solo trip: Compare travel experiences',
    color: '#141414',
    borderColor: 'rgba(232,72,12,0.4)',
    textColor: '#E8480C',
    nodes: [
      { id: 1, type: 'lesson', pos: 'center', state: 'done', icon: '💬', label: 'Introductions', xp: 15, stars: 3 },
      { id: 2, type: 'lesson', pos: 'right', state: 'done', icon: '✈️', label: 'At the airport', xp: 15, stars: 3 },
      { id: 3, type: 'practice', pos: 'center', state: 'done', icon: '🔄', label: 'Practice', xp: 10, stars: 2 },
      { id: 4, type: 'lesson', pos: 'left', state: 'done', icon: '🗺️', label: 'Giving directions', xp: 15, stars: 2 },
      { id: 5, type: 'chest', pos: 'center', state: 'done', icon: '📦', label: 'Treasure chest', xp: 20 },
      { id: 6, type: 'lesson', pos: 'right', state: 'done', icon: '🏨', label: 'At the hotel', xp: 15, stars: 3 },
      { id: 7, type: 'talk', pos: 'left', state: 'active', icon: '💬', label: 'Talk to practice!' },
      { id: 8, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '🍽️', label: 'Ordering food' },
      { id: 9, type: 'locked-lesson', pos: 'right', state: 'locked', icon: '🛒', label: 'Shopping' },
      { id: 10, type: 'locked-chest', pos: 'center', state: 'locked', icon: '📦', label: 'Treasure chest' },
      { id: 11, type: 'checkpoint', pos: 'center', state: 'locked', icon: '🏆', label: 'Checkpoint' },
    ],
  },
  {
    id: 2,
    title: 'Section 1, Unit 2',
    subtitle: 'Daily life: Talk about routines',
    color: '#3D7A5C',
    borderColor: 'rgba(61,122,92,0.4)',
    textColor: '#3D7A5C',
    nodes: [
      { id: 12, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '☀️', label: 'Morning routines' },
      { id: 13, type: 'locked-lesson', pos: 'right', state: 'locked', icon: '🏃', label: 'Exercise & health' },
      { id: 14, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '🍳', label: 'Cooking at home' },
      { id: 15, type: 'locked-talk', pos: 'left', state: 'locked', icon: '💬', label: 'Talk: Daily life' },
      { id: 16, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '💼', label: 'Work & career' },
      { id: 17, type: 'locked-chest', pos: 'right', state: 'locked', icon: '📦', label: 'Treasure chest' },
      { id: 18, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '🎭', label: 'Hobbies & free time' },
      { id: 19, type: 'checkpoint', pos: 'center', state: 'locked', icon: '🏆', label: 'Checkpoint' },
    ],
  },
  {
    id: 3,
    title: 'Section 1, Unit 3',
    subtitle: 'Social English: Make plans & express opinions',
    color: '#B45309',
    borderColor: 'rgba(180,83,9,0.4)',
    textColor: '#B45309',
    nodes: [
      { id: 20, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '📅', label: 'Making plans' },
      { id: 21, type: 'locked-lesson', pos: 'right', state: 'locked', icon: '🎬', label: 'Movies & shows' },
      { id: 22, type: 'locked-lesson', pos: 'left', state: 'locked', icon: '🤝', label: 'Agreeing & disagreeing' },
      { id: 23, type: 'locked-talk', pos: 'center', state: 'locked', icon: '💬', label: 'Talk: Opinions' },
      { id: 24, type: 'locked-chest', pos: 'right', state: 'locked', icon: '📦', label: 'Treasure chest' },
      { id: 25, type: 'locked-lesson', pos: 'center', state: 'locked', icon: '📰', label: 'News & current events' },
      { id: 26, type: 'checkpoint', pos: 'center', state: 'locked', icon: '🏆', label: 'Checkpoint' },
    ],
  },
];

const CONNECTOR_ACTIVE = '#E8480C';
const CONNECTOR_INACTIVE = 'rgba(20,20,20,0.1)';
const CONNECTOR_DONE = '#3D7A5C';

const posStyles: Record<NodePos, React.CSSProperties> = {
  left: { display: 'flex', justifyContent: 'flex-start', paddingLeft: 40 },
  center: { display: 'flex', justifyContent: 'center' },
  right: { display: 'flex', justifyContent: 'flex-end', paddingRight: 40 },
};

const Stars = ({ count }: { count: number }) => (
  <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 }}>
    {[1, 2, 3].map(i => (
      <span key={i} style={{ fontSize: 10, opacity: i <= count ? 1 : 0.2 }}>⭐</span>
    ))}
  </div>
);

const LearnNode = ({ node, unitColor, onActive }: { node: PathNode; unitColor: string; onActive?: () => void }) => {
  const isDone = node.state === 'done';
  const isActive = node.state === 'active';
  const isLocked = node.state === 'locked';

  const isTalk = node.type === 'talk' || node.type === 'locked-talk';
  const isChest = node.type === 'chest' || node.type === 'locked-chest';
  const isCheck = node.type === 'checkpoint';

  const size = isActive ? 88 : isTalk ? 80 : isCheck ? 76 : isChest ? 0 : 68;

  if (isChest) {
    return (
      <div style={posStyles[node.pos]}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 110, height: 76, borderRadius: 14,
            background: isDone ? '#F0FAF4' : 'white',
            border: isDone ? '1.5px solid rgba(61,122,92,0.3)' : '1.5px solid rgba(20,20,20,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', boxShadow: '0 4px 14px rgba(20,20,20,0.06)',
            cursor: isLocked ? 'default' : 'pointer',
            opacity: isLocked ? 0.45 : 1,
          }}>
            <span style={{ fontSize: 32 }}>{node.icon}</span>
            {isLocked && (
              <div style={{
                position: 'absolute', top: -9, right: -9,
                width: 22, height: 22, background: 'rgba(20,20,20,0.1)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>🔒</div>
            )}
          </div>
          {node.xp && isDone && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#3D7A5C' }}>+{node.xp} XP</span>
          )}
        </div>
      </div>
    );
  }

  if (isTalk) {
    return (
      <div style={posStyles[node.pos]}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: isActive ? '#F0FAF4' : isDone ? '#F0FAF4' : 'rgba(20,20,20,0.04)',
            border: isActive ? '4px solid rgba(61,122,92,0.4)' : isDone ? '3px solid rgba(61,122,92,0.3)' : '1.5px solid rgba(20,20,20,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isActive ? '0 8px 24px rgba(61,122,92,0.2)' : 'none',
            cursor: isLocked ? 'default' : 'pointer',
            opacity: isLocked ? 0.4 : 1,
            animation: isActive ? 'bounce 2.5s ease-in-out infinite' : 'none',
          }}>
            <span style={{ fontSize: 44 }}>{node.icon}</span>
          </div>
          {isActive && (
            <div style={{
              background: '#141414', borderRadius: 8, padding: '5px 12px',
              whiteSpace: 'nowrap', marginTop: 2,
            }}>
              <span style={{ color: '#3D7A5C', fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}>{node.label}</span>
              <div style={{
                position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                borderBottom: '5px solid #141414',
              }} />
            </div>
          )}
          {isLocked && (
            <div style={{
              position: 'absolute', top: -6, right: -6,
              width: 22, height: 22, background: 'rgba(20,20,20,0.1)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10
            }}>🔒</div>
          )}
        </div>
      </div>
    );
  }

  const bgColor = isDone ? '#3D7A5C' : isActive ? unitColor : 'rgba(20,20,20,0.06)';
  const borderColor = isDone
    ? 'rgba(61,122,92,0.35)'
    : isActive
      ? `${unitColor}50`
      : 'rgba(20,20,20,0.1)';
  const shadowColor = isDone
    ? 'rgba(61,122,92,0.3)'
    : isActive
      ? `${unitColor}40`
      : 'transparent';

  return (
    <div style={posStyles[node.pos]}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{
          width: size, height: size, borderRadius: isCheck ? 20 : '50%',
          background: bgColor,
          border: `${isActive ? 4 : 3}px solid ${borderColor}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${shadowColor}`,
          cursor: isLocked ? 'default' : 'pointer',
          opacity: isLocked ? 0.35 : 1,
          position: 'relative',
          animation: isActive ? 'bounce 2s infinite' : 'none',
        }}>
          <span style={{ fontSize: isActive ? 30 : isCheck ? 26 : 22 }}>{node.icon}</span>
          {isActive && (
            <span style={{ color: 'white', fontSize: 9, fontWeight: 900, marginTop: 2, fontFamily: 'inherit', letterSpacing: '0.5px' }}>
              {node.label.toUpperCase().slice(0, 6)}
            </span>
          )}
          {isLocked && (
            <div style={{
              position: 'absolute', top: -7, right: -7,
              width: 20, height: 20, background: 'rgba(20,20,20,0.1)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
            }}>🔒</div>
          )}
        </div>
        {isDone && node.stars !== undefined && <Stars count={node.stars} />}
        {isDone && node.xp && (
          <span style={{ fontSize: 10, fontWeight: 700, color: '#3D7A5C' }}>+{node.xp} XP</span>
        )}
        {!isDone && !isActive && (
          <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(20,20,20,0.3)', textAlign: 'center', maxWidth: 80 }}>{node.label}</span>
        )}
        {isDone && (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(20,20,20,0.4)', textAlign: 'center', maxWidth: 80 }}>{node.label}</span>
        )}
      </div>
    </div>
  );
};

const getConnectorColor = (fromState: NodeState, toState: NodeState) => {
  if (fromState === 'done' && toState === 'done') return CONNECTOR_DONE;
  if (fromState === 'done' && toState === 'active') return CONNECTOR_ACTIVE;
  return CONNECTOR_INACTIVE;
};

const Learn = () => {
  const [activeUnit] = useState(1);

  return (
    <PageShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(232,72,12,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(232,72,12,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,72,12,0); }
        }
      `}</style>

      {UNITS.map((unit, ui) => (
        <div key={unit.id} style={{ marginBottom: 8 }}>

          {/* Unit header banner */}
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            background: unit.color === '#141414' ? '#141414' : 'white',
            borderRadius: 16,
            padding: '18px 16px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            position: 'relative',
            overflow: 'hidden',
            border: `1.5px solid ${unit.borderColor}`,
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 90, height: 90, borderRadius: '50%',
              background: `radial-gradient(circle, ${unit.textColor}, transparent 65%)`,
              opacity: 0.12, pointerEvents: 'none',
            }} />
            <div>
              <p style={{
                color: unit.color === '#141414' ? 'rgba(255,255,255,0.4)' : 'rgba(20,20,20,0.4)',
                fontSize: 10, fontWeight: 600, margin: '0 0 3px',
                letterSpacing: '0.8px', textTransform: 'uppercase',
              }}>
                {unit.title}
              </p>
              <h2 style={{
                color: unit.color === '#141414' ? '#F8F5EF' : '#141414',
                fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 800,
                margin: 0, lineHeight: 1.25, letterSpacing: '-0.2px',
              }}>
                {unit.subtitle}
              </h2>
            </div>
            <button style={{
              background: unit.color === '#141414' ? '#F8F5EF' : unit.textColor,
              color: unit.color === '#141414' ? '#141414' : 'white',
              padding: '9px 14px', borderRadius: 10,
              fontWeight: 700, fontSize: 11, border: 'none',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
              fontFamily: 'inherit', letterSpacing: '0.3px',
            }}>
              ≡ GUIDEBOOK
            </button>
          </div>

          {/* Path nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', paddingBottom: 12, gap: 0, fontFamily: "'Outfit', sans-serif" }}>
            {unit.nodes.map((node, ni) => {
              const prevNode = ni > 0 ? unit.nodes[ni - 1] : null;
              const connColor = prevNode ? getConnectorColor(prevNode.state, node.state) : CONNECTOR_INACTIVE;
              const connH = node.type === 'talk' || node.type === 'locked-talk' ? 44 : 24;
              return (
                <div key={node.id}>
                  {ni > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: 3, height: connH, background: connColor, borderRadius: 99, opacity: connColor === CONNECTOR_INACTIVE ? 1 : 1 }} />
                    </div>
                  )}
                  <LearnNode node={node} unitColor={unit.textColor} />
                </div>
              );
            })}
          </div>

          {/* Section divider */}
          {ui < UNITS.length - 1 && (
            <div style={{
              margin: '24px 0',
              padding: '14px 18px',
              background: 'rgba(20,20,20,0.03)',
              border: '1px dashed rgba(20,20,20,0.12)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <div>
                <p style={{ color: 'rgba(20,20,20,0.35)', fontSize: 10, fontWeight: 600, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Coming up next
                </p>
                <p style={{ color: 'rgba(20,20,20,0.6)', fontSize: 13, fontWeight: 700, margin: 0 }}>
                  {UNITS[ui + 1].subtitle}
                </p>
              </div>
              <div style={{
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(20,20,20,0.06)',
                color: 'rgba(20,20,20,0.4)', fontSize: 11, fontWeight: 700,
              }}>🔒 Locked</div>
            </div>
          )}
        </div>
      ))}

      {/* Bottom label */}
      <div style={{ textAlign: 'center', borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 20, fontFamily: "'Outfit', sans-serif", marginTop: 8 }}>
        <p style={{ color: 'rgba(20,20,20,0.3)', fontSize: 12, fontWeight: 500, margin: 0 }}>
          Complete current unit to unlock the next section
        </p>
      </div>
    </PageShell>
  );
};

export default Learn;