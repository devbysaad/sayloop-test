import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import US from 'country-flag-icons/react/3x2/US';
import ES from 'country-flag-icons/react/3x2/ES';
import FR from 'country-flag-icons/react/3x2/FR';
import DE from 'country-flag-icons/react/3x2/DE';
import IT from 'country-flag-icons/react/3x2/IT';
import BR from 'country-flag-icons/react/3x2/BR';
import NL from 'country-flag-icons/react/3x2/NL';
import SE from 'country-flag-icons/react/3x2/SE';
import TR from 'country-flag-icons/react/3x2/TR';
import RU from 'country-flag-icons/react/3x2/RU';
import PL from 'country-flag-icons/react/3x2/PL';
import JP from 'country-flag-icons/react/3x2/JP';
import KR from 'country-flag-icons/react/3x2/KR';
import CN from 'country-flag-icons/react/3x2/CN';
import SA from 'country-flag-icons/react/3x2/SA';
import IN from 'country-flag-icons/react/3x2/IN';

const LANGS = [
    { Flag: US, name: 'English', learners: '1.5B' },
    { Flag: ES, name: 'Spanish', learners: '500M' },
    { Flag: FR, name: 'French', learners: '300M' },
    { Flag: DE, name: 'German', learners: '200M' },
    { Flag: IT, name: 'Italian', learners: '90M' },
    { Flag: BR, name: 'Portuguese', learners: '260M' },
    { Flag: NL, name: 'Dutch', learners: '24M' },
    { Flag: SE, name: 'Swedish', learners: '10M' },
    { Flag: TR, name: 'Turkish', learners: '80M' },
    { Flag: RU, name: 'Russian', learners: '258M' },
    { Flag: PL, name: 'Polish', learners: '45M' },
    { Flag: JP, name: 'Japanese', learners: '128M' },
    { Flag: KR, name: 'Korean', learners: '77M' },
    { Flag: CN, name: 'Chinese', learners: '918M' },
    { Flag: SA, name: 'Arabic', learners: '422M' },
    { Flag: IN, name: 'Hindi', learners: '600M' },
];

const FlagPack = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [active, setActive] = useState<string | null>(null);

    const onScroll = () => {
        const el = ref.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 10);
        setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    const scroll = (dir: 'left' | 'right') => {
        ref.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    return (
        <section className="py-10 bg-white border-y border-stone-200 relative">
            <div className="max-w-[1400px] mx-auto px-4 relative">

                {/* Left fade + arrow */}
                {showLeft && (
                    <>
                        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <button onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white
                         border border-stone-200 rounded-full shadow-md flex items-center justify-center
                         hover:bg-stone-50 transition-all">
                            <ChevronLeft className="w-5 h-5 text-stone-600" />
                        </button>
                    </>
                )}

                {/* Scrollable row */}
                <div ref={ref} onScroll={onScroll}
                    className="flex gap-3 overflow-x-auto px-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {LANGS.map((l) => {
                        const isActive = active === l.name;
                        return (
                            <button
                                key={l.name}
                                onClick={() => setActive(isActive ? null : l.name)}
                                className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl border
                            transition-all duration-150 group
                            ${isActive
                                        ? 'bg-green-50 border-green-400 shadow-[0_0_0_3px_rgba(34,197,94,0.12)]'
                                        : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-400 hover:shadow-sm'
                                    }`}
                            >
                                <div className="w-10 h-7 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                                    <l.Flag className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <p className={`text-[13px] font-bold whitespace-nowrap
                    ${isActive ? 'text-green-700' : 'text-stone-700'}`}>
                                        {l.name}
                                    </p>
                                    <p className="text-[10px] font-mono text-stone-400">{l.learners} speakers</p>
                                </div>
                                {isActive && <span className="text-green-500 text-xs ml-1">✓</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Right fade + arrow */}
                {showRight && (
                    <>
                        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                        <button onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white
                         border border-stone-200 rounded-full shadow-md flex items-center justify-center
                         hover:bg-stone-50 transition-all">
                            <ChevronRight className="w-5 h-5 text-stone-600" />
                        </button>
                    </>
                )}
            </div>

            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
};

export default FlagPack;