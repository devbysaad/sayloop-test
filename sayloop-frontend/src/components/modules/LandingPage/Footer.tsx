import React from "react";

const Footer = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>

    <footer
      className="bg-gray-900 text-white py-14 px-6"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{
                  background:
                    "linear-gradient(135deg,#fbbf24,#f97316)",
                }}
              >
                💬
              </div>
              <span className="text-xl font-black">
                Sayloop
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5 font-semibold">
              The language learning platform built around real human
              conversation. No scripts. No bots.
            </p>
          </div>

          {[
            {
              h: "Product",
              links: [
                "How it works",
                "Languages",
                "Community",
                "Mobile app",
              ],
            },
            {
              h: "Company",
              links: [
                "About",
                "Blog",
                "Careers",
                "Press",
              ],
            },
            {
              h: "Support",
              links: [
                "Help center",
                "Safety",
                "Guidelines",
                "Status",
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <p className="text-sm font-extrabold mb-4">
                {col.h}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amber-400 text-sm font-semibold transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs font-semibold">
            © {new Date().getFullYear()} Sayloop Inc.
            All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-500 text-xs font-semibold">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;