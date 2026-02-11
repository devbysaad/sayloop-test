import React from "react";

const Footer = () => {
    const footerLinks = [
        { title: "About", links: ["Mission", "Team", "Careers", "Press"] },
        { title: "Product", links: ["Sayloop", "Schools", "Business", "Test"] },
        { title: "Resources", links: ["Blog", "Research", "Help Center", "Status"] },
        { title: "Legal", links: ["Terms", "Privacy", "Guidelines"] },
    ];

    return (
        <footer className="bg-[#1A1A1A] text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-12">

                    <div className="w-full md:w-1/3">
                        <h2 className="text-3xl font-black text-[#58CC02] mb-4">Sayloop</h2>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            The world's most popular way to learn a language. 100% free, fun and effective.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {/* Social Icons Placeholder */}
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#58CC02] transition-colors cursor-pointer">🐦</div>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#58CC02] transition-colors cursor-pointer">📸</div>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#58CC02] transition-colors cursor-pointer">🎵</div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {footerLinks.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="font-bold text-lg mb-4 text-white">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a href="#" className="text-gray-400 hover:text-[#58CC02] transition-colors text-sm font-medium">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500 text-sm font-medium">
                    © {new Date().getFullYear()} Sayloop Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
