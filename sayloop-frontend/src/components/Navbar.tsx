import React, { useState, useEffect } from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Mainlogo } from '../assets/logo'; // Adjust path if needed

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-4 left-0 right-0 z-[100] transition-all duration-300 flex justify-center px-4`}>
            <div className={`
        flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300
        ${scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg w-full max-w-5xl border border-white/20'
                    : 'bg-transparent w-full max-w-7xl'
                }
      `}>
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={Mainlogo} alt="Sayloop" className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" />
                    <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? 'text-[#58CC02]' : 'text-[#4B4B4B]'}`}>
                        Sayloop
                    </span>
                </Link>


                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Link to="/sign-in">
                            <button className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-2.5 px-6 rounded-full text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                Get Started
                            </button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
