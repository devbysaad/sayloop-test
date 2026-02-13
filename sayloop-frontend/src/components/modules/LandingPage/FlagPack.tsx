import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Import individual flag SVG components
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
import NO from 'country-flag-icons/react/3x2/NO';
import JP from 'country-flag-icons/react/3x2/JP';
import KR from 'country-flag-icons/react/3x2/KR';
import CN from 'country-flag-icons/react/3x2/CN';
import SA from 'country-flag-icons/react/3x2/SA';
import IN from 'country-flag-icons/react/3x2/IN';

const LanguageCarousel = () => {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const languages = [
        { Flag: US, name: 'ENGLISH', bgColor: 'bg-blue-50' },
        { Flag: ES, name: 'SPANISH', bgColor: 'bg-yellow-50' },
        { Flag: FR, name: 'FRENCH', bgColor: 'bg-blue-50' },
        { Flag: DE, name: 'GERMAN', bgColor: 'bg-gray-50' },
        { Flag: IT, name: 'ITALIAN', bgColor: 'bg-green-50' },
        { Flag: BR, name: 'PORTUGUESE', bgColor: 'bg-green-50' },
        { Flag: NL, name: 'DUTCH', bgColor: 'bg-orange-50' },
        { Flag: SE, name: 'SWEDISH', bgColor: 'bg-blue-50' },
        { Flag: TR, name: 'TURKISH', bgColor: 'bg-red-50' },
        { Flag: RU, name: 'RUSSIAN', bgColor: 'bg-blue-50' },
        { Flag: PL, name: 'POLISH', bgColor: 'bg-red-50' },
        { Flag: NO, name: 'NORWEGIAN', bgColor: 'bg-blue-50' },
        { Flag: JP, name: 'JAPANESE', bgColor: 'bg-red-50' },
        { Flag: KR, name: 'KOREAN', bgColor: 'bg-blue-50' },
        { Flag: CN, name: 'CHINESE', bgColor: 'bg-red-50' },
        { Flag: SA, name: 'ARABIC', bgColor: 'bg-green-50' },
        { Flag: IN, name: 'HINDI', bgColor: 'bg-orange-50' },
    ];

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative py-6 bg-white border-b border-gray-200">
            <div className="relative max-w-[1400px] mx-auto px-4">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-14"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {languages.map((language, index) => {
                        const FlagComponent = language.Flag;
                        return (
                            <div
                                key={index}
                                className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white  rounded-2xl hover:border-gray-300  transition-all cursor-pointer group"
                            >
                                {/* Flag */}
                                <div className={`flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden ${language.bgColor}  border-gray-200`}>
                                    <FlagComponent className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                                </div>

                                {/* Language Name */}
                                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                                    {language.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                )}
            </div>

            {/* Hide Scrollbar CSS */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default LanguageCarousel;