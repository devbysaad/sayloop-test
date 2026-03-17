import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";
import NicknamePicker from "./NicknamePicker";

// ── Data ──────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
];

const INTERESTS = [
  { id: "daily_life", label: "Daily Life", emoji: "☀️", bg: "#fef3c7", border: "#fcd34d" },
  { id: "travel", label: "Travel & Culture", emoji: "✈️", bg: "#dbeafe", border: "#93c5fd" },
  { id: "food", label: "Food & Cooking", emoji: "🍜", bg: "#dcfce7", border: "#86efac" },
  { id: "movies", label: "Movies & Music", emoji: "🎬", bg: "#fce7f3", border: "#f9a8d4" },
  { id: "tech", label: "Technology", emoji: "💻", bg: "#f3e8ff", border: "#d8b4fe" },
  { id: "sports", label: "Sports & Fitness", emoji: "⚽", bg: "#fed7aa", border: "#fb923c" },
  { id: "books", label: "Books & Stories", emoji: "📚", bg: "#e0f2fe", border: "#7dd3fc" },
  { id: "science", label: "Science", emoji: "🔬", bg: "#f0fdf4", border: "#86efac" },
  { id: "business", label: "Business", emoji: "💼", bg: "#fefce8", border: "#fde047" },
  { id: "art", label: "Art & Design", emoji: "🎨", bg: "#fdf4ff", border: "#e879f9" },
  { id: "gaming", label: "Gaming", emoji: "🎮", bg: "#eff6ff", border: "#93c5fd" },
  { id: "health", label: "Health", emoji: "🏃", bg: "#f0fdf4", border: "#4ade80" },
];

// Steps: 0 = Name+Nickname, 1 = Photo, 2 = Language, 3 = Interests
const STEPS = ["Name & Nickname", "Photo", "Language", "Interests"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(
    user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : ""
  );
  const [selectedNickname, setSelectedNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.imageUrl ?? null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const canNext = (): boolean => {
    if (step === 0) {
      const ok = displayName.trim().length >= 2 && selectedNickname.length >= 1;
      console.log("[Onboarding] canNext step 0 →", ok, "| name:", displayName, "| nick:", selectedNickname);
      return ok;
    }
    if (step === 1) return true;           // photo optional
    if (step === 2) return !!selectedLang;
    if (step === 3) return selectedInterests.length >= 1;
    return false;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const nameParts = displayName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Store nickname locally
      if (selectedNickname) localStorage.setItem("user_nickname", selectedNickname);

      // 1. Save to Clerk
      await user.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          learningLanguage: selectedLang,
          interests: selectedInterests,
          nickname: selectedNickname || firstName,
          onboardingComplete: true,
        },
      });

      // 2. Upload avatar
      if (avatarFile) await user.setProfileImage({ file: avatarFile });

      // 3. Reload Clerk
      await user.reload();

      // 4. Sync to backend DB
      if (!localStorage.getItem("db_user_id")) {
        try {
          const syncRes = await axiosInstance.post("/api/users/sync", {
            email: user.primaryEmailAddress?.emailAddress ?? "",
            firstName,
            lastName,
            pfpSource: user.imageUrl ?? "",
            nickname: selectedNickname || firstName,
          });
          const syncUser = syncRes.data?.data;
          if (syncUser?.id) localStorage.setItem("db_user_id", syncUser.id.toString());
        } catch (syncErr) {
          console.warn("[onboarding] Pre-flight sync failed:", syncErr);
        }
      }

      // 5. Update profile
      try {
        await axiosInstance.put("/api/users/me", {
          firstName,
          lastName,
          learningLanguage: selectedLang,
          interests: selectedInterests,
          nickname: selectedNickname || firstName,
        });
      } catch (syncErr) {
        console.warn("[onboarding] Failed to sync profile:", syncErr);
      }

      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const goNext = () => {
    console.log("[Onboarding] Going to step", step + 1);
    setStep(step + 1);
  };
  const goBack = () => {
    console.log("[Onboarding] Going back to step", step - 1);
    setStep(step - 1);
  };

  const progressPct = step === 0 ? 0 : Math.round((step / (STEPS.length - 1)) * 100);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fffbf5] flex items-center justify-center p-6">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes pulse-ring {
          0%,100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
        .step-card  { animation: fadeUp 0.35s ease both; }
        .interest-check { animation: pop 0.2s ease; }
        .avatar-btn:hover .avatar-overlay { opacity: 1; }
      `}</style>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-sm bg-gradient-to-br from-[#fbbf24] to-[#f97316]">💬</div>
          <span className="text-gray-800 text-lg font-[900]">Sayloop</span>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-1.5 text-xs font-bold ${i <= step ? "text-amber-500" : "text-gray-300"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                    i < step ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" :
                    i === step ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ── Step 0: Name + Nickname (inline like Google email suggestions) ── */}
          {step === 0 && (
            <div className="step-card">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-[900] text-gray-900 mb-1">What's your name?</h2>
              <p className="text-sm text-gray-500 font-semibold mb-4">
                Type your first name — nickname suggestions appear automatically below.
              </p>

              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  console.log("[Onboarding] Name changed:", e.target.value);
                  setDisplayName(e.target.value);
                  if (selectedNickname) setSelectedNickname(""); // reset nick on name change
                }}
                placeholder="e.g. Ahmed"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition text-gray-900 font-semibold text-base"
              />

              {/* Inline nickname suggestions — appear after 2 chars (like Google) */}
              {displayName.trim().length >= 2 && (
                <NicknamePicker
                  realName={displayName.trim().split(" ")[0]}
                  onSelect={(nick) => {
                    console.log("[Onboarding] Nickname selected:", nick);
                    setSelectedNickname(nick);
                  }}
                />
              )}

              {selectedNickname && (
                <div className="mt-3 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <p className="text-green-700 text-sm font-black">
                    Ready! Nickname: <span className="underline">{selectedNickname}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 1: Photo ── */}
          {step === 1 && (
            <div className="step-card">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-2xl font-[900] text-gray-900 mb-1">Add a photo</h2>
              <p className="text-sm text-gray-500 font-semibold mb-6">Put a face to the name — or skip it for now.</p>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="avatar-btn relative w-28 h-28 rounded-full overflow-hidden border-4 border-amber-200 hover:border-amber-400 transition-all duration-200 focus:outline-none"
                  style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"><span className="text-4xl">👤</span></div>
                  }
                  <div className="avatar-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-200">
                    <span className="text-white text-2xl">📷</span>
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button onClick={() => fileRef.current?.click()} className="text-sm font-bold text-amber-500 hover:text-amber-600 transition">
                  {avatarPreview ? "Change photo" : "Upload photo"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Language ── */}
          {step === 2 && (
            <div className="step-card">
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-2xl font-[900] text-gray-900 mb-1">What are you learning?</h2>
              <p className="text-sm text-gray-500 font-semibold mb-5">Pick the language you want to practice.</p>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      console.log("[Onboarding] Language selected:", lang.code);
                      setSelectedLang(lang.code);
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 font-bold text-sm transition-all duration-150 ${
                      selectedLang === lang.code
                        ? "border-amber-400 bg-amber-50 text-amber-700 shadow-md scale-105"
                        : "border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Interests ── */}
          {step === 3 && (
            <div className="step-card">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-[900] text-gray-900 mb-1">What do you love talking about?</h2>
              <p className="text-sm text-gray-500 font-semibold mb-5">
                Pick at least one — we'll match you with people who share your interests.
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {INTERESTS.map((interest) => {
                  const active = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`relative text-left rounded-2xl p-4 border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                        active
                          ? "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                          : "bg-white border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-amber-200"
                      }`}
                      style={active ? { background: interest.bg, borderColor: interest.border } : {}}
                    >
                      {active && (
                        <span className="interest-check absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-[900] bg-gradient-to-br from-amber-400 to-orange-500">✓</span>
                      )}
                      <span className="text-2xl block mb-1.5">{interest.emoji}</span>
                      <span className="text-gray-800 text-xs font-extrabold">{interest.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedInterests.length > 0 && (
                <p className="text-xs text-amber-600 font-bold mt-3 text-center">
                  {selectedInterests.length} selected ✓
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 font-semibold">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={goBack}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:border-amber-300 transition"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canNext()}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext() || loading}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-[900] shadow-[0_8px_22px_rgba(251,191,36,0.45)] hover:shadow-[0_12px_28px_rgba(251,191,36,0.55)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                  : "Let's go! 🚀"
                }
              </button>
            )}
          </div>

          {/* Skip for photo */}
          {step === 1 && (
            <button onClick={() => setStep(2)} className="w-full mt-3 text-center text-sm text-gray-400 font-medium hover:text-gray-600 transition">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}