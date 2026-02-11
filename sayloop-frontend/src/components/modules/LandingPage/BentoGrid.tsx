import React from "react";
import { communicate, run, learn, top } from "../../../assets/LandingPage";

const BentoGrid = () => {
    return (
        <section className="py-24 bg-[#F7F9FB] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

           
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-sm font-bold text-[#58CC02] uppercase tracking-widest mb-4">Why Sayloop?</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#4B4B4B] leading-tight">
                        Proven methods. <br />
                        <span className="text-[#1CB0F6]">Real results.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    <div className="md:col-span-2 row-span-1 bg-white rounded-[32px] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8 border border-gray-100 group">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
                            <h4 className="text-2xl font-extrabold text-[#4B4B4B]">Free, Fun, Effective</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Learning with Sayloop is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <img src={top} alt="Fun Learning" className="max-h-[220px] object-contain group-hover:rotate-3 transition-transform duration-500" />
                        </div>
                    </div>

                    <div className="md:col-span-1 row-span-2 bg-[#58CC02] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between text-center border border-green-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 mt-8">
                            <h4 className="text-2xl font-extrabold text-white mb-4">Gamified Learning</h4>
                            <p className="text-white/80 font-medium text-sm leading-relaxed max-w-[200px] mx-auto">
                                Stay motivated with streaks, leaderboards, and fun challenges.
                            </p>
                        </div>

                        <img src={communicate} alt="Gamified" className="w-full max-w-[180px] mt-8 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="md:col-span-1 bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 group">
                        <img src={learn} alt="Science" className="h-[140px] mb-6 object-contain group-hover:-translate-y-2 transition-transform duration-500" />
                        <h4 className="text-xl font-extrabold text-[#4B4B4B] mb-2">Backed by Science</h4>
                        <p className="text-gray-500 text-sm font-medium">
                            Research-backed teaching methods that delight learners.
                        </p>
                    </div>

                    <div className="md:col-span-1 bg-[#1CB0F6] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-blue-400 group relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h4 className="text-xl font-extrabold text-white mb-2 relative z-10">Personalized AI</h4>
                        <p className="text-white/90 text-sm font-medium mb-6 relative z-10">
                            Lessons tailored to help you learn at just the right level.
                        </p>
                        <img src={run} alt="AI" className="h-[120px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
