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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>
      <nav
        style={{ fontFamily: "'Nunito', sans-serif" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>
              💬
            </div>
            <span className="text-xl text-gray-800" style={{ fontWeight: 900 }}>Sayloop</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['How it works', 'Languages', 'Community'].map(n => (
              <a key={n} href="#" className="text-sm text-gray-500 hover:text-amber-500 transition-colors" style={{ fontWeight: 700 }}>{n}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link to="/sign-in">
                <button className="text-sm text-gray-600 hover:text-amber-500 px-4 py-2 transition-colors" style={{ fontWeight: 700 }}>Log in</button>
              </Link>
              <Link to="/sign-up">
                <button
                  className="text-sm text-white px-6 py-2.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 4px 14px rgba(251,191,36,0.45)' }}
                >
                  Get started — it's free!
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/home">
                <button className="text-sm text-white px-6 py-2.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 4px 14px rgba(251,191,36,0.45)' }}>
                  Go Home - Find a partner
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <div className="space-y-1.5 w-6">
              <span className={`block h-0.5 bg-gray-600 rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-amber-50 px-6 py-5 space-y-4">
            {['How it works', 'Languages', 'Community'].map(n => (
              <a key={n} href="#" className="block text-sm text-gray-600 py-1" style={{ fontWeight: 700 }}>{n}</a>
            ))}
            <SignedOut>
              <Link to="/sign-up">
                <button className="w-full mt-2 text-white py-3 rounded-2xl text-sm"
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>
                  Get started free
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/session">
                <button className="w-full mt-2 text-white py-3 rounded-2xl text-sm"
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>
                  Find a partner
                </button>
              </Link>
            </SignedIn>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;