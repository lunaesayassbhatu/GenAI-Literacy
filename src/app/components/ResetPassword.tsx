import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "../utils/supabase";

export function ResetPassword() {
  const navigate = useNavigate();
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(!!session);
    });
  }, []);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a0a0f 25%, #2d1420 50%, #451d30 75%, #5a263f 100%)",
      }}
    >
      <div className="max-w-md w-full relative z-10">
        <div
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-md border-4 relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderColor: "#8C1D40",
            boxShadow: "0 20px 60px rgba(140, 29, 64, 0.4)",
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black mb-1" style={{ color: "#8C1D40" }}>
              Reset Your Password
            </h1>
          </div>

          {hasRecoverySession === null && (
            <p className="text-center text-gray-500">Checking your link...</p>
          )}

          {hasRecoverySession === false && (
            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-4">
                This reset link is invalid or has expired. Please request a new one from the sign-in page.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-2xl font-black text-base"
                style={{ background: "linear-gradient(135deg, #FFC627 0%, #ffd966 100%)", color: "#000000" }}
              >
                Back to Sign In
              </button>
            </div>
          )}

          {hasRecoverySession && !done && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                  <Lock size={18} className="text-[#8C1D40]" />
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold"
                  style={{ borderColor: "rgba(140, 29, 64, 0.3)" }}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-800 font-black flex items-center gap-2">
                  <Lock size={18} className="text-[#8C1D40]" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all font-semibold"
                  style={{ borderColor: "rgba(140, 29, 64, 0.3)" }}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-bold text-center bg-red-50 px-3 py-2 rounded-xl">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #8C1D40 0%, #6B1530 100%)",
                  boxShadow: "0 8px 24px rgba(140, 29, 64, 0.5)",
                }}
              >
                {isLoading ? "Saving..." : "Save New Password"}
              </button>
            </form>
          )}

          {done && (
            <div className="text-center">
              <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: "#8C1D40" }} />
              <p className="text-gray-800 font-bold mb-4">Your password has been updated!</p>
              <button
                onClick={() => navigate("/home")}
                className="w-full py-3 rounded-2xl font-black text-base"
                style={{ background: "linear-gradient(135deg, #FFC627 0%, #ffd966 100%)", color: "#000000" }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
