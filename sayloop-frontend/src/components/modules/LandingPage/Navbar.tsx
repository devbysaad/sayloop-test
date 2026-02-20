import React, { useState, useEffect } from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Mainlogo } from '../../../assets/logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
      <nav className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 w-full
        ${scrolled
          ? 'max-w-4xl bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200'
          : 'max-w-6xl bg-transparent'
        }`}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={Mainlogo} alt="Sayloop" className="h-9 w-auto" />
          <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300
            ${scrolled ? 'text-green-600' : 'text-stone-800'}`}>
            Sayloop
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {['Learn', 'Debate', 'Leaderboard'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150
                ${scrolled
                  ? 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}>
              {item}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link to="/sign-in">
              <button className={`hidden sm:block text-sm font-bold px-4 py-2 rounded-full transition-all duration-150
                ${scrolled ? 'text-stone-600 hover:bg-stone-100' : 'text-stone-700 hover:bg-white/60'}`}>
                Sign in
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold
                                 px-5 py-2.5 rounded-full shadow-[0_3px_0_#15803d]
                                 active:shadow-none active:translate-y-px transition-all duration-150">
                Get Started
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;