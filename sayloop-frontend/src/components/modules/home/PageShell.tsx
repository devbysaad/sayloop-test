import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './Rightsidebar';
import TopBar from './TopBar';
import Header from './Header';

const SIDEBAR_W = 288;   // left sidebar width px
const RIGHT_W   = 300;   // right sidebar width px
const TOPBAR_H  = 52;    // mobile top bar height px
const HEADER_H  = 64;    // mobile bottom nav height px
const BREAKPOINT = 1024; // lg breakpoint px

const PageShell = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const contentStyle: React.CSSProperties = isDesktop
    ? {
        // Desktop: content lives between the two fixed sidebars
        marginLeft:  SIDEBAR_W,
        marginRight: RIGHT_W,
        minHeight:   '100vh',
      }
    : {
        // Mobile: full width, padded to avoid fixed top/bottom bars
        paddingTop:    TOPBAR_H + 8,
        paddingBottom: HEADER_H + 8,
        minHeight:     '100vh',
      };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: '#fffbf5', minHeight: '100vh' }}>

      {/* Mobile only */}
      {!isDesktop && <TopBar />}
      {!isDesktop && <Header />}

      {/* Desktop only */}
      {isDesktop && <Sidebar />}
      {isDesktop && <RightSidebar />}

      {/* Content */}
      <div style={contentStyle}>
        <div style={{
          padding:   isDesktop ? '40px' : '20px 16px',
          maxWidth:  '720px',
          margin:    '0 auto',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageShell;