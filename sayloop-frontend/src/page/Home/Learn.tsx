import PageShell from '../../components/modules/home/PageShell';

const nodes = [
  { id: 1, icon: '✓', label: 'START', type: 'start', pos: 'center' },
  { id: 2, icon: '⭐', type: 'done', pos: 'right' },
  { id: 3, icon: '📦', type: 'chest', pos: 'center' },
  { id: 4, icon: '💬', type: 'talk', pos: 'left', big: true, tooltip: 'Talk to practice!' },
  { id: 5, icon: '🧩', type: 'locked', pos: 'right' },
  { id: 6, icon: '🏆', type: 'locked', pos: 'center' },
];

const posMap = {
  left: 'self-start ml-6',
  center: 'self-center',
  right: 'self-end mr-6',
};

const Learn = () => {
  return (
    <PageShell>
      <div
        style={{
          fontFamily: "'Nunito', sans-serif",
          background: 'linear-gradient(180deg, #1a1a26 0%, #2d2d3d 100%)',
          borderRadius: 22,
          padding: '20px 16px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -24,
            right: -24,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fde68a, transparent 65%)',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />
        <div>
          <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 800, margin: '0 0 4px', letterSpacing: 1, textTransform: 'uppercase' }}>
            ← Section 1, Unit 1
          </p>
          <h1 style={{ color: '#fffbf5', fontSize: 'clamp(15px,3vw,18px)', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
            Solo trip: Compare travel experiences
          </h1>
        </div>
        <button
          style={{
            background: 'white',
            color: '#1a1a26',
            padding: '10px 16px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 12,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: 'inherit',
          }}
        >
          ≡ GUIDEBOOK
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', paddingBottom: 40, gap: 0 }}>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              border: '4px solid #d97706',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 28px rgba(251,191,36,0.45)',
              cursor: 'pointer',
              animation: 'bounce 2s infinite',
            }}
          >
            <span style={{ color: 'white', fontSize: 28, lineHeight: 1 }}>✓</span>
            <span style={{ color: 'white', fontSize: 10, fontWeight: 900, fontFamily: 'inherit' }}>START</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 3, height: 28, background: 'linear-gradient(#fcd34d, #fef3c7)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 48 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              border: '4px solid #d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(251,191,36,0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 28 }}>⭐</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 3, height: 28, background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 110,
              height: 78,
              borderRadius: 18,
              background: 'white',
              border: '3px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 36 }}>📦</span>
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 24,
                height: 24,
                background: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}
            >
              🔒
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 3, height: 28, background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 48 }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 116,
                height: 116,
                borderRadius: '50%',
                background: '#fef9f0',
                border: '4px solid #fcd34d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(251,191,36,0.18)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 52 }}>💬</span>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -44,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1a1a26',
                borderRadius: 10,
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 800, fontFamily: 'inherit' }}>Talk to practice!</span>
              <div
                style={{
                  position: 'absolute',
                  top: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderBottom: '5px solid #1a1a26',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 3, height: 44, background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 48 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'white',
              border: '3px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 26 }}>🧩</span>
            <div
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 22,
                height: 22,
                background: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
            >
              🔒
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 3, height: 28, background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'white',
              border: '3px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 26 }}>🏆</span>
            <div
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 22,
                height: 22,
                background: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
            >
              🔒
            </div>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', borderTop: '2px solid #fef3c7', paddingTop: 20, fontFamily: 'inherit' }}>
        <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, margin: 0 }}>Solo trip: Ask about transportation</p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </PageShell>
  );
};

export default Learn;