import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";
import NicknamePicker from "./NicknamePicker";

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
  { id: "daily_life", label: "Daily Life", emoji: "☀️", bg: "#FFF4EF", border: "rgba(232,72,12,0.25)" },
  { id: "travel", label: "Travel & Culture", emoji: "✈️", bg: "#EFF6FF", border: "#93c5fd" },
  { id: "food", label: "Food & Cooking", emoji: "🍜", bg: "#FEF8EF", border: "rgba(180,83,9,0.25)" },
  { id: "movies", label: "Movies & Music", emoji: "🎬", bg: "#fff1f2", border: "#fda4af" },
  { id: "tech", label: "Technology", emoji: "💻", bg: "#f5f3ff", border: "#c4b5fd" },
  { id: "sports", label: "Sports & Fitness", emoji: "⚽", bg: "#F0FAF4", border: "rgba(61,122,92,0.25)" },
  { id: "books", label: "Books & Stories", emoji: "📚", bg: "#F0FAF4", border: "rgba(61,122,92,0.22)" },
  { id: "science", label: "Science", emoji: "🔬", bg: "#ecfeff", border: "#a5f3fc" },
  { id: "business", label: "Business", emoji: "💼", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "art", label: "Art & Design", emoji: "🎨", bg: "#fdf4ff", border: "#e879f9" },
  { id: "gaming", label: "Gaming", emoji: "🎮", bg: "#f5f3ff", border: "#c4b5fd" },
  { id: "health", label: "Health", emoji: "🏃", bg: "#F0FAF4", border: "rgba(61,122,92,0.22)" },
];

const STEPS = ["Name & Nickname", "Photo", "Language", "Interests"];

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

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const canNext = (): boolean => {
    if (step === 0) return displayName.trim().length >= 2 && selectedNickname.length >= 1;
    if (step === 1) return true;
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

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const nameParts = displayName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      if (selectedNickname) localStorage.setItem("user_nickname", selectedNickname);
      await user.update({
        firstName, lastName,
        unsafeMetadata: { ...user.unsafeMetadata, learningLanguage: selectedLang, interests: selectedInterests, nickname: selectedNickname || firstName, onboardingComplete: true },
      });
      if (avatarFile) await user.setProfileImage({ file: avatarFile });
      await user.reload();
      if (!localStorage.getItem("db_user_id")) {
        try {
          const syncRes = await axiosInstance.post("/api/users/sync", { email: user.primaryEmailAddress?.emailAddress ?? "", firstName, lastName, pfpSource: user.imageUrl ?? "", nickname: selectedNickname || firstName });
          const syncUser = syncRes.data?.data;
          if (syncUser?.id) localStorage.setItem("db_user_id", syncUser.id.toString());
        } catch { }
      }
      try {
        await axiosInstance.put("/api/users/me", { firstName, lastName, learningLanguage: selectedLang, interests: selectedInterests, nickname: selectedNickname || firstName });
      } catch { }
      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);
  const progressPct = step === 0 ? 0 : Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .step-card { animation: fadeUp 0.35s ease both; }
        .interest-check { animation: pop 0.2s ease; }
        .avatar-btn:hover .avatar-overlay { opacity: 1; }
      `}</style>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center mb-8 justify-center">
          <img src="/logo.png" alt="Sayloop" className="h-9" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(20,20,20,0.08)' }}>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5 text-xs font-black"
                  style={{ color: i <= step ? '#E8480C' : 'rgba(20,20,20,0.25)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 text-white"
                    style={{ background: i <= step ? '#E8480C' : 'rgba(20,20,20,0.08)', color: i <= step ? 'white' : 'rgba(20,20,20,0.35)', boxShadow: i === step ? '0 4px 12px rgba(232,72,12,0.3)' : 'none' }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(20,20,20,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: '#E8480C' }} />
            </div>
          </div>

          {/* Step 0 */}
          {step === 0 && (
            <div className="step-card">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>What's your name?</h2>
              <p className="text-sm font-normal mb-4" style={{ color: 'rgba(20,20,20,0.5)' }}>
                Type your first name — nickname suggestions appear automatically below.
              </p>
              <input
                type="text"
                value={displayName}
                onChange={e => { setDisplayName(e.target.value); if (selectedNickname) setSelectedNickname(""); }}
                placeholder="e.g. Ahmed"
                autoFocus
                className="w-full px-4 py-3 rounded-xl font-medium text-base text-[#141414] transition outline-none"
                style={{ border: '1.5px solid rgba(20,20,20,0.12)', background: 'white' }}
                onFocus={e => (e.target.style.borderColor = '#E8480C')}
                onBlur={e => (e.target.style.borderColor = 'rgba(20,20,20,0.12)')}
              />
              {displayName.trim().length >= 2 && (
                <NicknamePicker realName={displayName.trim().split(" ")[0]} onSelect={nick => setSelectedNickname(nick)} />
              )}
              {selectedNickname && (
                <div className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2"
                  style={{ background: '#F0FAF4', border: '1px solid rgba(61,122,92,0.25)' }}>
                  <span>✅</span>
                  <p className="text-sm font-black" style={{ color: '#3D7A5C' }}>
                    Ready! Nickname: <span className="underline">{selectedNickname}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="step-card">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>Add a photo</h2>
              <p className="text-sm font-normal mb-6" style={{ color: 'rgba(20,20,20,0.5)' }}>Put a face to the name — or skip it for now.</p>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="avatar-btn relative w-28 h-28 rounded-full overflow-hidden transition-all duration-200 focus:outline-none"
                  style={{ border: '3px solid rgba(232,72,12,0.3)' }}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFF4EF' }}><span className="text-4xl">👤</span></div>
                  }
                  <div className="avatar-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200"
                    style={{ background: 'rgba(20,20,20,0.4)' }}>
                    <span className="text-white text-2xl">📷</span>
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button onClick={() => fileRef.current?.click()} className="text-sm font-black transition-opacity hover:opacity-70"
                  style={{ color: '#E8480C' }}>
                  {avatarPreview ? "Change photo" : "Upload photo"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="step-card">
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>What are you learning?</h2>
              <p className="text-sm font-normal mb-5" style={{ color: 'rgba(20,20,20,0.5)' }}>Pick the language you want to practice.</p>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => setSelectedLang(lang.code)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl font-black text-sm transition-all duration-150 hover:scale-105"
                    style={selectedLang === lang.code
                      ? { border: '1.5px solid rgba(232,72,12,0.4)', background: '#FFF4EF', color: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.15)' }
                      : { border: '1px solid rgba(20,20,20,0.1)', color: 'rgba(20,20,20,0.6)', background: 'white' }
                    }>
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="step-card">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>What do you love talking about?</h2>
              <p className="text-sm font-normal mb-5" style={{ color: 'rgba(20,20,20,0.5)' }}>
                Pick at least one — we'll match you with people who share your interests.
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {INTERESTS.map(interest => {
                  const active = selectedInterests.includes(interest.id);
                  return (
                    <button key={interest.id} onClick={() => toggleInterest(interest.id)}
                      className="relative text-left rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                      style={active
                        ? { background: interest.bg, border: `1.5px solid ${interest.border}`, boxShadow: '0 4px 14px rgba(20,20,20,0.06)' }
                        : { background: 'white', border: '1px solid rgba(20,20,20,0.08)' }
                      }>
                      {active && (
                        <span className="interest-check absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black"
                          style={{ background: '#E8480C' }}>✓</span>
                      )}
                      <span className="text-2xl block mb-1.5">{interest.emoji}</span>
                      <span className="text-[#141414] text-xs font-black">{interest.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedInterests.length > 0 && (
                <p className="text-xs font-black mt-3 text-center" style={{ color: '#3D7A5C' }}>
                  {selectedInterests.length} selected ✓
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm font-medium rounded-xl p-3" style={{ color: '#E8480C', background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={goBack}
                className="flex-1 py-3 rounded-xl font-black transition-all hover:scale-[1.02]"
                style={{ border: '1px solid rgba(20,20,20,0.1)', color: 'rgba(20,20,20,0.5)', background: 'transparent' }}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={goNext} disabled={!canNext()}
                className="flex-1 py-3 rounded-xl text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.3)' }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleFinish} disabled={!canNext() || loading}
                className="flex-1 py-3 rounded-xl text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.3)' }}>
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                  : "Let's go! →"
                }
              </button>
            )}
          </div>

          {step === 1 && (
            <button onClick={() => setStep(2)}
              className="w-full mt-3 text-center text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: 'rgba(20,20,20,0.35)' }}>
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}