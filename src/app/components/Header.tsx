import { Link, useNavigate, useLocation } from "react-router-dom";
import { DolphinMascot } from "./DolphinMascot";
import { Home, User, LogOut, BookOpen, Gamepad2 } from "lucide-react";
import { getUserData, logout } from "../utils/userData";
import { getCurrentLevel } from "../utils/xpSystem";
import { useTheme } from "../utils/themeContext";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = getUserData();
  const { theme, colors } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const xp = userData?.xp || 0;
  const streak = userData?.learningDays || 0;

  return (
    <header
      className="border-b shadow-sm sticky top-0 z-50"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.cardBorder
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <DolphinMascot size={50} animate={false} />
            <div>
              <h2 className="text-xl" style={{ color: colors.accentGold }}>ASU GenAI Lab</h2>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Smart AI Learning</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/home"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={
                isActive('/home')
                  ? { backgroundColor: colors.accentMaroon, color: theme === 'dark' ? '#F0E0E4' : '#FFFFFF' }
                  : { color: colors.textSecondary }
              }
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/learning-lab"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={
                isActive('/learning-lab')
                  ? { backgroundColor: colors.accentMaroon, color: theme === 'dark' ? '#F0E0E4' : '#FFFFFF' }
                  : { color: colors.textSecondary }
              }
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">Learning Lab</span>
            </Link>

            <Link
              to="/games"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={
                isActive('/games')
                  ? { backgroundColor: colors.accentMaroon, color: theme === 'dark' ? '#F0E0E4' : '#FFFFFF' }
                  : { color: colors.textSecondary }
              }
            >
              <Gamepad2 size={18} />
              <span className="hidden sm:inline">Games</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={
                isActive('/profile')
                  ? { backgroundColor: colors.accentMaroon, color: theme === 'dark' ? '#F0E0E4' : '#FFFFFF' }
                  : { color: colors.textSecondary }
              }
            >
              <User size={18} />
              <span className="hidden sm:inline">
                {userData?.username}
              </span>
            </Link>


            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: colors.textSecondary }}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}