import React from "react";

const Footer = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');`}</style>
    <footer className="py-14 px-6 bg-[#141414] border-t border-white/8" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-10 mb-12">
          <div className="flex-[2] min-w-[200px]">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="SayLoop" className="h-10" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-5 font-normal">
              The English learning platform built around real human conversation. No scripts. No bots. Just people.
            </p>
            <p className="text-white/20 text-xs font-medium">Made with ❤️ for learners worldwide.</p>
          </div>

          {[
            { h: 'Product', links: ['How it Works', 'Features', 'Community', 'Mobile App'] },
            { h: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { h: 'Support', links: ['Help Center', 'Safety', 'Guidelines', 'Status'] },
          ].map(col => (
            <div key={col.h} className="flex-1 min-w-[130px]">
              <p className="text-sm font-black mb-4 text-white">{col.h}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-white/35 text-sm font-normal transition-colors hover:text-[#E8480C]">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-normal">© {new Date().getFullYear()} SayLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3D7A5C', display: 'inline-block' }} />
              <span className="text-white/30 text-xs font-normal">All systems operational</span>
            </div>
            <div className="flex gap-4">
              {['Terms', 'Privacy'].map(l => (
                <a key={l} href="#" className="text-white/30 text-xs font-medium hover:text-[#E8480C] transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;