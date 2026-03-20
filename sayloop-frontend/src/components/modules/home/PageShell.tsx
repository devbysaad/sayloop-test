import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './Rightsidebar';
import TopBar from './TopBar';
import Header from './Header';

const SIDEBAR_W = 288;
const RIGHT_W = 300;
const TOPBAR_H = 52;
const HEADER_H = 64;
const BREAKPOINT = 1024;

const PageShell = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const contentStyle: React.CSSProperties = isDesktop
    ? { marginLeft: SIDEBAR_W, marginRight: RIGHT_W, minHeight: '100vh' }
    : { paddingTop: TOPBAR_H + 8, paddingBottom: HEADER_H + 8, minHeight: '100vh' };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F8F5EF', minHeight: '100vh' }}>
      {!isDesktop && <TopBar />}
      {!isDesktop && <Header />}
      {isDesktop && <Sidebar />}
      {isDesktop && <RightSidebar />}
      <div style={contentStyle}>
        <div style={{ padding: isDesktop ? '40px' : '20px 16px', maxWidth: '720px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageShell;