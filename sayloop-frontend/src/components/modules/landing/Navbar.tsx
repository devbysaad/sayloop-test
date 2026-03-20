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
        .nav-cta { transition: transform 0.2s, box-shadow 0.2s; background: #E8480C; }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,72,12,0.35); }
        .streak-pill { animation: pillGlow 2.5s ease-in-out infinite; }
        @keyframes pillGlow { 0%,100%{box-shadow:0 0 0 rgba(180,83,9,0.3);} 50%{box-shadow:0 0 10px rgba(180,83,9,0.45);} }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#E8480C; border-radius:2px; transition:width 0.25s; }
        .nav-link:hover::after { width:100%; }
      `}</style>
      <nav style={{ fontFamily: "'Outfit', sans-serif" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#F8F5EF]/95 backdrop-blur-xl shadow-sm border-b border-black/8 py-3'
          : 'bg-[#F8F5EF]/80 backdrop-blur-sm py-5'
          }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="SayLoop" className="h-10" />
            <span className="streak-pill hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 text-[#B45309] rounded-full px-2.5 py-0.5 text-xs font-bold">
              🔥 18 streak
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['How it Works', 'Features', 'Community'].map(n => (
              <a key={n} href="#" className="nav-link text-sm text-[#141414]/60 hover:text-[#141414] transition-colors font-medium">{n}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link to="/sign-in">
                <button className="text-sm text-[#141414]/60 hover:text-[#141414] px-4 py-2 transition-colors font-medium border border-black/10 rounded-xl hover:border-black/20">Log in</button>
              </Link>
              <Link to="/sign-up">
                <button className="nav-cta text-sm text-white px-6 py-2.5 rounded-xl font-black shadow-sm">Start for free →</button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/home">
                <button className="nav-cta text-sm text-white px-6 py-2.5 rounded-xl font-black shadow-sm">Find Partner →</button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <div className="space-y-1.5 w-6">
              <span className={`block h-0.5 bg-[#141414] rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-[#141414] rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-[#141414] rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-[#F8F5EF] border-t border-black/8 px-6 py-5 space-y-4 shadow-lg">
            {['How it Works', 'Features', 'Community'].map(n => (
              <a key={n} href="#" className="block text-sm text-[#141414]/60 py-1 font-medium">{n}</a>
            ))}
            <SignedOut>
              <Link to="/sign-up">
                <button className="w-full mt-2 text-white py-3 rounded-xl text-sm font-black" style={{ background: '#E8480C' }}>Start for free →</button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/home">
                <button className="w-full mt-2 text-white py-3 rounded-xl text-sm font-black" style={{ background: '#E8480C' }}>Find Partner →</button>
              </Link>
            </SignedIn>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;