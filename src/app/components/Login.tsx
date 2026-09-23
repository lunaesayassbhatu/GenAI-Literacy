import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Globe, User, UserPlus, Shield, Zap } from "lucide-react";
import { supabase } from "../utils/supabase";
import { hydrateLocalStorageFromSupabase } from "../utils/migrateToSupabase";
import { checkDailyCheckIn } from "../utils/userData";

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("en");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!email.toLowerCase().endsWith("@asu.edu")) {
      setEmailError("Please use your ASU email (@asu.edu)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (isSignUp && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const buildUserData = (overrides = {}) => {
    const existingUser = localStorage.getItem("asu_genai_user");
    const isReturning = !!existingUser;

    return {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      language,
      loginDate: new Date().toISOString(),
      learningDays: 1,
      badges: [],
      lastCheckIn: new Date().toISOString().split("T")[0],
      xp: 0,
      bestStreak: 0,
      userType: "student" as const,
      year: "",
      major: "",
      isReturningUser: isReturning,
      completedModules: [],
      moduleProgress: {},
      completedGames: [],
      assignmentsAnalyzed: 0,
      ...overrides,
    };
  };

  const populateLocalStorage = (userData: ReturnType<typeof buildUserData>) => {
    localStorage.setItem("asu_genai_user", JSON.stringify(userData));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (!validateEmail(email)) return;
    if (!password.trim()) return;
    if (isSignUp && !validatePassword()) return;

    setIsLoading(true);
    setAuthError("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username.trim(), language } },
      });
      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }
      populateLocalStorage(buildUserData());
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      await hydrateLocalStorageFromSupabase(data.user.id, email.trim().toLowerCase());
      localStorage.setItem('hydrated_session', data.user.id);
      checkDailyCheckIn();
    }

    setIsLoading(false);
    navigate("/home");
  };

  const handleSSOLogin = () => {
    // Microsoft / ASU SSO — coming in a future update
    alert("ASU SSO integration coming soon! Please sign in manually for now.");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setPasswordError("");
    setEmailError("");
  };

  const torchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const torch = torchRef.current;
    if (!torch) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (e: MouseEvent) => {
      torch.style.setProperty("--torch-x", `${e.clientX}px`);
      torch.style.setProperty("--torch-y", `${e.clientY}px`);
      torch.style.opacity = "1";
    };
    const handleLeave = () => {
      torch.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #1a0a0f 25%, #2d1420 50%, #451d30 75%, #5a263f 100%)",
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-40 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #8C1D40 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-32 right-20 w-40 h-40 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, #FFC627 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute top-1/2 right-10 w-24 h-24 rounded-full opacity-35 blur-2xl animate-pulse"
          style={{
            background: "radial-gradient(circle, #8C1D40 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <Zap className="absolute top-32 right-32 text-[#FFC627] opacity-60 animate-pulse" size={32} />
        <Zap
          className="absolute bottom-40 left-40 text-[#FFC627] opacity-50 animate-pulse"
          size={24}
          style={{ animationDelay: "1.5s" }}
        />
        <Zap
          className="absolute top-64 left-20 text-[#8C1D40] opacity-40 animate-pulse"
          size={28}
          style={{ animationDelay: "0.5s" }}
        />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 8 + 4 + "px",
              height: Math.random() * 8 + 4 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              background: ["#8C1D40", "#FFC627", "#FFFFFF"][Math.floor(Math.random() * 3)],
              opacity: Math.random() * 0.5 + 0.3,
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Torch/flashlight glow that follows the cursor, lighting up the dark background */}
      <div
        ref={torchRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle 260px at var(--torch-x, 50%) var(--torch-y, 20%), rgba(255,198,39,0.22), rgba(255,198,39,0.08) 45%, transparent 75%)",
        }}
      />

      <div className="max-w-md w-full relative z-10">
        <div
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-md border-4 relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderColor: "#8C1D40",
            boxShadow: "0 20px 60px rgba(140, 29, 64, 0.4)",
          }}
        >
          {/* Corner Accents */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at top right, #8C1D40 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at bottom left, #FFC627 0%, transparent 70%)" }}
          />

          {/* Logo */}
          <div className="text-center mb-6 relative">
            <h1 className="text-4xl font-black mb-1" style={{ color: "#8C1D40" }}>
              ASU Sunwave
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignUp ? (
                "Create your account to get started"
              ) : (
                <span className="font-bold">
                  Master responsible GenAI use for ASU students, faculty and staff
                </span>
              )}
            </p>
          </div>

          {/* SSO Button */}
          <button
            onClick={handleSSOLogin}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 mb-6 font-black text-lg relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #FFC627 0%, #ffd966 100%)",
              boxShadow: "0 8px 20px rgba(255, 198, 39, 0.4)",
              color: "#000000",
              border: "3px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <Shield size={24} />
            <span>Quick Start with ASU SSO</span>
            <Zap size={20} className="absolute right-4 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-semibold">or {isSignUp ? "sign up" : "sign in"} manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                <User size={18} className="text-[#8C1D40]" />
                Player Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your hero name"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold"
                style={{ borderColor: "rgba(140, 29, 64, 0.3)" }}
                onFocus={(e) => (e.target.style.borderColor = "#FFC627")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(140, 29, 64, 0.3)")}
                required
              />
            </div>

            {/* ASU Email */}
            <div>
              <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                <Mail size={18} className="text-[#8C1D40]" />
                ASU Email Badge
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                onBlur={(e) => validateEmail(e.target.value)}
                placeholder="yourname@asu.edu"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold ${emailError ? "border-red-400 bg-red-50" : ""}`}
                style={!emailError ? { borderColor: "rgba(140, 29, 64, 0.3)" } : {}}
                onFocus={(e) => !emailError && (e.target.style.borderColor = "#8C1D40")}
                required
              />
              {emailError && <p className="mt-1 text-sm text-red-500 font-bold">⚠️ {emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                <Lock size={18} className="text-[#8C1D40]" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold"
                style={{ borderColor: "rgba(140, 29, 64, 0.3)" }}
                onFocus={(e) => (e.target.style.borderColor = "#8C1D40")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(140, 29, 64, 0.3)")}
                required
              />
            </div>

            {/* Confirm Password (sign up only) */}
            {isSignUp && (
              <div>
                <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                  <Lock size={18} className="text-[#8C1D40]" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold ${passwordError ? "border-red-400 bg-red-50" : ""}`}
                  style={!passwordError ? { borderColor: "rgba(140, 29, 64, 0.3)" } : {}}
                  onFocus={(e) => !passwordError && (e.target.style.borderColor = "#8C1D40")}
                  required
                />
                {passwordError && <p className="mt-1 text-sm text-red-500 font-bold">⚠️ {passwordError}</p>}
              </div>
            )}

            {/* Language */}
            <div>
              <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                <Globe size={18} className="text-[#8C1D40]" />
                Choose Your Language Quest
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-bold"
                style={{ borderColor: "rgba(140, 29, 64, 0.3)" }}
                onFocus={(e) => (e.target.style.borderColor = "#FFC627")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(140, 29, 64, 0.3)")}
              >
                <option value="en">🇺🇸 English</option>
                <option value="zh-CN">🇨🇳 中文（简体）</option>
                <option value="zh-TW">🇹🇼 中文（繁體）</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>

            {/* Auth error */}
            {authError && (
              <p className="text-sm text-red-600 font-bold text-center bg-red-50 px-3 py-2 rounded-xl">
                ⚠️ {authError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 font-black text-lg relative overflow-hidden mt-2 group"
              style={{
                background: "linear-gradient(135deg, #8C1D40 0%, #6B1530 100%)",
                boxShadow: "0 8px 24px rgba(140, 29, 64, 0.5)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading Adventure...
                </span>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={22} /> : <LogIn size={22} />}
                  <span>{isSignUp ? "Start Adventure!" : "Dive Into Learning!"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-4">
            <button
              onClick={toggleMode}
              className="w-full py-3 rounded-2xl transition-all duration-300 hover:scale-105 font-black text-base"
              style={{
                background: "linear-gradient(135deg, #FFC627 0%, #ffd966 100%)",
                color: "#000000",
                boxShadow: "0 4px 12px rgba(255, 198, 39, 0.4)",
              }}
            >
              {isSignUp ? "🎯 Already have an account? Jump Back In!" : "🌟 New here? Create Your Character!"}
            </button>
          </div>
        </div>

        {/* ASU Branding */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">Arizona State University</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8C1D40" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFC627" }} />
          </div>
        </div>
      </div>
    </div>
  );
}