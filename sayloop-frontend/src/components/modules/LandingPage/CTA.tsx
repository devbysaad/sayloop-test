import React from "react";

const CTA = () => {
    return (
        <section className="py-32 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1CB0F6] to-[#0F6F9C] z-0"></div>

            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>

            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                    Ready to start your journey?
                </h2>

                <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
                    Join the community of millions of learners today and unlock your potential with Sayloop.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             
                    <a href="#" className="group bg-black text-white px-8 py-4 rounded-xl flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-xl border border-white/20">
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                        <div className="text-left">
                            <div className="text-xs uppercase font-bold tracking-wider text-gray-400">Download on the</div>
                            <div className="text-xl font-bold">App Store</div>
                        </div>
                    </a>

                    
                    <a href="#" className="group bg-black text-white px-8 py-4 rounded-xl flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-xl border border-white/20">
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                        <div className="text-left">
                            <div className="text-xs uppercase font-bold tracking-wider text-gray-400">Get it on</div>
                            <div className="text-xl font-bold">Google Play</div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTA;
