import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .nav-cta { transition: transform 0.2s, box-shadow 0.2s; background: #3B82F6; }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.45); }
        .streak-pill { animation: pillGlow 2.5s ease-in-out infinite; }
        @keyframes pillGlow { 0%,100%{box-shadow:0 0 0 rgba(249,115,22,0.4);} 50%{box-shadow:0 0 12px rgba(249,115,22,0.6);} }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#3B82F6; border-radius:2px; transition:width 0.25s; }
        .nav-link:hover::after { width:100%; }
      `}</style>
      <nav style={{ fontFamily:"'Outfit', sans-serif" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-100 border-b border-blue-100 py-3' : 'bg-white/80 backdrop-blur-sm py-5'
        }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
            <span className="text-xl font-black text-slate-800">SayLoop</span>
            <span className="streak-pill hidden sm:flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-500 rounded-full px-2.5 py-0.5 text-xs font-bold">
              🔥 18 streak
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {['How it Works', 'Features', 'Community'].map(n => (
              <a key={n} href="#" className="nav-link text-sm text-slate-600 hover:text-blue-600 transition-colors font-semibold">{n}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link to="/sign-in">
                <button className="text-sm text-slate-500 hover:text-blue-600 px-4 py-2 transition-colors font-semibold">Log in</button>
              </Link>
              <Link to="/sign-up">
                <button className="nav-cta text-sm text-white px-6 py-2.5 rounded-2xl font-black shadow-md">Start for free 🎮</button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/home">
                <button className="nav-cta text-sm text-white px-6 py-2.5 rounded-2xl font-black shadow-md">Find Partner 🚀</button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <div className="space-y-1.5 w-6">
              <span className={`block h-0.5 bg-blue-500 rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-blue-500 rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-blue-500 rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-blue-100 px-6 py-5 space-y-4 shadow-xl">
            {['How it Works', 'Features', 'Community'].map(n => (
              <a key={n} href="#" className="block text-sm text-slate-600 py-1 font-semibold">{n}</a>
            ))}
            <SignedOut>
              <Link to="/sign-up">
                <button className="w-full mt-2 text-white py-3 rounded-2xl text-sm font-black" style={{ background:'#3B82F6' }}>Start for free 🎮</button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/home">
                <button className="w-full mt-2 text-white py-3 rounded-2xl text-sm font-black" style={{ background:'#3B82F6' }}>Find Partner 🚀</button>
              </Link>
            </SignedIn>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;