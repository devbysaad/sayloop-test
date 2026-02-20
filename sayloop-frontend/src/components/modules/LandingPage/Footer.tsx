import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
    { title: 'About', items: ['Mission', 'Team', 'Careers', 'Press'] },
    { title: 'Product', items: ['Sayloop', 'Schools', 'Business', 'API'] },
    { title: 'Resources', items: ['Blog', 'Research', 'Help Center', 'Status'] },
    { title: 'Legal', items: ['Terms', 'Privacy', 'Guidelines', 'Cookies'] },
];

const SOCIALS = [
    { icon: '𝕏', label: 'Twitter' },
    { icon: '📸', label: 'Instagram' },
    { icon: '🎵', label: 'TikTok' },
];

const Footer = () => (
    <footer className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

            {/* Top row */}
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">

                {/* Brand */}
                <div className="w-full md:w-1/3 max-w-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-lg">S</div>
                        <span className="text-2xl font-extrabold text-green-500">Sayloop</span>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed mb-6">
                        The world's most effective way to learn a language — through real conversations,
                        gamified lessons, and live debates.
                    </p>
                    <div className="flex gap-2">
                        {SOCIALS.map((s) => (
                            <button key={s.label}
                                title={s.label}
                                className="w-9 h-9 bg-stone-800 hover:bg-green-600 border border-stone-700
                           hover:border-green-600 rounded-xl flex items-center justify-center
                           text-sm transition-all duration-150">
                                {s.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Links grid */}
                <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {LINKS.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{section.title}</h4>
                            <ul className="space-y-2.5">
                                {section.items.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-stone-400 hover:text-green-400 text-sm transition-colors duration-150">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gamified badges row */}
            <div className="flex flex-wrap gap-2 mb-10">
                {['🔥 Streak system', '🏆 Leaderboards', '💎 Gem rewards', '⚔️ Live debates', '🤖 AI tutor', '📊 Progress tracking'].map((b) => (
                    <span key={b}
                        className="bg-stone-800 border border-stone-700 text-stone-400 text-xs
                       font-semibold rounded-full px-3 py-1.5">
                        {b}
                    </span>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center
                      justify-between gap-4 text-stone-500 text-xs font-medium">
                <p>© {new Date().getFullYear()} Sayloop Inc. All rights reserved.</p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>All systems operational</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;