import React from "react";

const Footer = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&display=swap');`}</style>
    <footer className="py-14 px-6 bg-slate-900 border-t border-slate-800" style={{ fontFamily:"'Outfit',sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-10 mb-12">
          <div className="flex-[2] min-w-[200px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl text-white"
                style={{ background:'linear-gradient(135deg,#3B82F6,#22C55E)' }}>💬</div>
              <span className="text-xl font-black text-white">SayLoop</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5 font-medium">
              The English learning platform built around real human conversation. No scripts. No bots. Just people.
            </p>
            <p className="text-slate-600 text-xs font-bold">Made with ❤️ for learners worldwide.</p>
          </div>

          {[
            { h:'Product',  links:['How it Works','Features','Community','Mobile App'] },
            { h:'Company',  links:['About','Blog','Careers','Press'] },
            { h:'Support',  links:['Help Center','Safety','Guidelines','Status'] },
          ].map(col => (
            <div key={col.h} className="flex-1 min-w-[130px]">
              <p className="text-sm font-black mb-4 text-white">{col.h}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-slate-500 text-sm font-medium hover:text-blue-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs font-medium">© {new Date().getFullYear()} SayLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-500 text-xs font-medium">All systems operational</span>
            </div>
            <div className="flex gap-4">
              {['Terms','Privacy'].map(l => (
                <a key={l} href="#" className="text-slate-500 text-xs font-bold hover:text-blue-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;