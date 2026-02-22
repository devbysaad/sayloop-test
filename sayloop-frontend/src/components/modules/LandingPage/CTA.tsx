import React from "react";
import { Link } from "react-router-dom";

const CTA = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    <section
      className="py-24 px-6"
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "linear-gradient(160deg,#fffbf5,#fff7ed)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-[32px] p-10 lg:p-16 text-center overflow-hidden border-2"
          style={{
            background: "linear-gradient(135deg,#fef3c7 0%,#fed7aa 100%)",
            borderColor: "#fcd34d",
          }}
        >
          <div className="absolute top-5 right-8 text-5xl opacity-20 rotate-12 select-none">
            💬
          </div>
          <div className="absolute bottom-5 left-8 text-5xl opacity-20 -rotate-12 select-none">
            🌍
          </div>

          <div className="relative z-10">
            <div className="text-6xl mb-5">🚀</div>

            <h2
              className="text-4xl lg:text-5xl text-gray-800 mb-4"
              style={{ fontWeight: 900 }}
            >
              Your first real conversation
              <br />
              <span style={{ color: "#f59e0b" }}>
                starts in 30 seconds.
              </span>
            </h2>

            <p
              className="text-gray-600 text-lg max-w-sm mx-auto mb-9"
              style={{ fontWeight: 600 }}
            >
              Free forever. No credit card. No boring lessons. Just you and a
              real human.
            </p>

            <Link to="/sign-up">
              <button
                className="text-white text-base px-12 py-4 rounded-2xl hover:-translate-y-1 transition-all"
                style={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg,#fbbf24,#f97316)",
                  boxShadow:
                    "0 10px 28px rgba(251,191,36,0.45)",
                }}
              >
                Get started — it's free! 🎉
              </button>
            </Link>

            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {[
                "✅ Free forever",
                "✅ No bots — ever",
                "✅ 47 languages",
                "✅ 190+ countries",
              ].map((t) => (
                <span
                  key={t}
                  className="text-gray-600 text-sm"
                  style={{ fontWeight: 700 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default CTA;