import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../../../assets/PNG/hero.png";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F0F9FF] to-white pt-24 pb-12 px-6">

            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-fade-in-up">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-xs uppercase tracking-widest mb-2 border border-green-200">
                        v2.0 Now Live
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                        Master a language, <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] to-[#2B6A01]">
                            unlock the world.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-lg font-medium leading-relaxed">
                        The most advanced, fun, and effective way to learn. Join millions of learners enjoying the new Sayloop experience.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                        <Link to="/sign-up" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-[0_4px_0_0_#2B6A01] active:shadow-none active:translate-y-[4px] transition-all duration-200">
                                Start Learning
                            </button>
                        </Link>
                        <Link to="/sign-in" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#1CB0F6] font-bold py-4 px-10 rounded-2xl text-lg border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] active:shadow-none active:translate-y-[4px] transition-all duration-200">
                                Login
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 font-semibold mt-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 10,000+ Students</p>
                    </div>
                </div>

                <div className="relative flex justify-center lg:justify-end animate-float">
                    <div className="relative w-full max-w-[500px]">
                        {/* Main Character */}
                        <img
                            src={HeroImg}
                            alt="Sayloop Hero"
                            className="w-full drop-shadow-2xl relative z-10 transition-transform duration-500"
                        />

                        <div className="absolute top-10 -left-8 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl z-20 animate-bounce-slow hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🔥</div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Streak</div>
                                    <div className="text-lg font-black text-gray-800">12 Days</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-20 -right-8 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl z-20 animate-bounce-slow delay-700 hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">💎</div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Gems</div>
                                    <div className="text-lg font-black text-gray-800">4,200</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
