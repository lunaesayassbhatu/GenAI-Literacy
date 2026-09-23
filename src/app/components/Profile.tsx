import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { getUserData, updateUserData, type UserType } from "../utils/userData";
import { getCurrentLevel, getXPProgress, getXPToNextLevel } from "../utils/xpSystem";
import { MODULES, getCurrentLesson, type Module, type Lesson } from "../utils/modulesData";
import { loadModuleProgress } from "../utils/moduleProgress";
import { getFriends, addFriend, removeFriend, type Friend } from "../utils/friends";
import { useTheme } from "../utils/themeContext";
import { motion } from "motion/react";
import {
  Edit2, Save, X, ArrowRight, Calendar, Award, Target,
  Trophy, Users, Crown, TrendingUp, Sparkles, Sun, Moon, Lock, Shirt
} from "lucide-react";
import { ITEMS, describeUnlock, type CosmeticItem, type ItemSlot } from "../data/itemsData";
import { isItemUnlocked, equipItem, unequipSlot, getEquippedMap, getEquippedItemIds } from "../utils/itemsSystem";

const SLOT_LABELS: Record<ItemSlot, string> = {
  hat: "Hat",
  cape: "Cape",
  accessory: "Accessory",
};

function getRealCurrentModule(): Module | null {
  for (const mod of MODULES) {
    if (mod.locked) continue;
    const saved = loadModuleProgress(mod.id);
    if (!saved) return mod; // not started yet
    if (saved.stepIndex < saved.totalSteps - 1) return mod; // in progress
  }
  return null;
}

export function Profile() {
  const [userData, setUserData] = useState(getUserData);
  const { theme, colors, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Re-read from localStorage whenever XP is committed (e.g. after completing a module)
  useEffect(() => {
    const sync = () => setUserData(getUserData());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  const [friendError, setFriendError] = useState<string | null>(null);
  const [addingFriend, setAddingFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; icon: string; description: string; earnedDate?: string } | null>(null);

  useEffect(() => {
    getFriends().then(setFriends);
  }, []);

  const handleAddFriend = async () => {
    setAddingFriend(true);
    setFriendError(null);
    const result = await addFriend(friendInput);
    setAddingFriend(false);
    if (!result.success) {
      setFriendError(result.error || "Something went wrong.");
      return;
    }
    setFriendInput("");
    setShowAddFriend(false);
    getFriends().then(setFriends);
  };

  const handleRemoveFriend = async (id: string) => {
    await removeFriend(id);
    setSelectedFriend(null);
    getFriends().then(setFriends);
  };
  const [editForm, setEditForm] = useState({
    userType: userData?.userType || "student",
    year: userData?.year || "",
    major: userData?.major || "",
  });

  if (!userData) return <div>Loading...</div>;

  const {
    username, learningDays, badges, xp = 0,
    bestStreak = 0, userType, year, major,
    assignmentsAnalyzed = 0,
  } = userData;

  const level = getCurrentLevel(xp);
  const progress = getXPProgress(xp);
  const xpToNext = getXPToNextLevel(xp);
  const equippedItemIds = getEquippedItemIds();
  const equippedMap = getEquippedMap();

  const handleToggleEquip = (item: CosmeticItem) => {
    if (equippedMap[item.slot] === item.id) {
      unequipSlot(item.slot);
    } else {
      equipItem(item);
    }
    setUserData(getUserData());
  };
  const currentModule = getRealCurrentModule();
  const currentLesson = currentModule ? getCurrentLesson(currentModule) : null;

  // Mock leaderboard — user's real XP slotted in
  const leaderboardData = [
    { name: "Alex Chen",      exp: 1250, avatar: "👨‍🎓", isCurrentUser: false },
    { name: "Sarah Johnson",  exp: 1180, avatar: "👩‍🎓", isCurrentUser: false },
    { name: username,         exp: xp,   avatar: "👤",   isCurrentUser: true  },
    { name: "Mike Rodriguez", exp: 980,  avatar: "👨‍💻", isCurrentUser: false },
    { name: "Emily Davis",    exp: 920,  avatar: "👩‍💼", isCurrentUser: false },
  ]
    .sort((a, b) => b.exp - a.exp)
    .map((u, i) => ({ ...u, rank: i + 1 }));


  const availableBadges = [
    { id: "first-checkin",       name: "First Day",            icon: "🌟", description: "Start your GenAI learning journey"       },
    { id: "first-module",        name: "Module Complete",       icon: "📚", description: "Complete your first module"               },
    { id: "streak-3",            name: "3-Day Streak",          icon: "🔥", description: "Check in for 3 consecutive days"          },
    { id: "streak-7",            name: "Week Warrior",          icon: "⚡", description: "Check in for 7 consecutive days"          },
    { id: "game-master",         name: "Game Master",           icon: "🎮", description: "Complete the AI Matching game"            },
    { id: "ethics-expert",       name: "Ethics Expert",         icon: "⚖️", description: "Complete the Ethics Matching game"       },
    { id: "fact-or-myth-master", name: "Fact or Myth Master",   icon: "🔍", description: "Complete the Fact or Myth game"           },
    { id: "prompt-builder",      name: "Prompt Builder",        icon: "✍️", description: "Complete the Build-a-Prompt game"        },
    { id: "prompt-engineer",     name: "Prompt Engineer",       icon: "🧪", description: "Complete the Prompt Sandbox game"         },
    { id: "bias-detective",      name: "Bias Detective",        icon: "🔎", description: "Complete the AI Bias Matching game"      },
    { id: "black-box-skeptic",   name: "Black Box Skeptic",     icon: "📦", description: "Complete the Black Box Matching game"    },
    { id: "eco-conscious",       name: "Eco-Conscious User",    icon: "🌱", description: "Complete the Environmental Impact game"  },
  ];

  const handleSaveProfile = () => {
    updateUserData({
      userType: editForm.userType as UserType,
      year: editForm.year,
      major: editForm.major,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      userType: userData.userType || "student",
      year: userData.year || "",
      major: userData.major || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── Profile Header ───────────────────────────────────── */}
        <div className="rounded-2xl shadow-lg p-8"
          style={{ background: "linear-gradient(135deg, #8B1A2E 0%, #6B1530 100%)" }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                to="/choose-character"
                className="w-24 h-24 rounded-full flex items-end justify-center overflow-hidden transition-transform hover:scale-105"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                title="Change your character"
              >
                {userData.selectedCharacter ? (
                  <CharacterMascot character={userData.selectedCharacter} variant="portrait" size={88} animate={false} equipped={equippedItemIds} />
                ) : (
                  <span className="text-4xl m-auto">👤</span>
                )}
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-1" style={{ color: "#F0E0E4" }}>{username}</h1>
                <p className="mb-1" style={{ color: "rgba(240,224,228,0.8)" }}>
                  Level {level.level} {level.title}
                </p>
                {!isEditing && (
                  <div className="flex items-center gap-3 text-sm" style={{ color: "rgba(240,224,228,0.7)" }}>
                    <span className="capitalize">{userType || "Not set"}</span>
                    {userType === "student" && year  && <span>• {year}</span>}
                    {userType === "student" && major && <span>• {major}</span>}
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: "rgba(255,198,39,0.2)", color: "#FFC627" }}>
              <Edit2 size={18} /><span>Edit Profile</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: "rgba(240,224,228,0.8)" }}>Role</label>
                  <select value={editForm.userType}
                    onChange={(e) => setEditForm({ ...editForm, userType: e.target.value as UserType })}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#F0E0E4", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                {editForm.userType === "student" && (<>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "rgba(240,224,228,0.8)" }}>Year</label>
                    <select value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#F0E0E4", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <option value="">Select Year</option>
                      {["Freshman","Sophomore","Junior","Senior","Graduate"].map(y =>
                        <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "rgba(240,224,228,0.8)" }}>Major</label>
                    <input type="text" value={editForm.major} placeholder="e.g., Computer Science"
                      onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#F0E0E4", border: "1px solid rgba(255,255,255,0.2)" }} />
                  </div>
                </>)}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80"
                  style={{ backgroundColor: "#FFC627", color: "#0D0508" }}>
                  <Save size={18} /><span>Save</span>
                </button>
                <button onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#F0E0E4" }}>
                  <X size={18} /><span>Cancel</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── XP Progress Banner ───────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-2xl shadow-lg p-6 relative overflow-hidden"
          style={{ backgroundColor: colors.cardBackground, border: "2px solid rgba(255,198,39,0.35)" }}>
          <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-5"
            style={{ background: "radial-gradient(circle at top right, #FFC627 0%, transparent 70%)" }} />

          <div className="flex items-center justify-between mb-4 flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl px-4 py-2 shadow-lg"
                style={{ background: "linear-gradient(135deg, #8C1D40 0%, #6B1530 100%)" }}>
                <div className="text-xs font-bold text-white/80 mb-1 text-center">LEVEL</div>
                <div className="text-3xl font-black text-white text-center">{level.level}</div>
              </div>
              <div>
                <h3 className="text-xl font-black mb-1" style={{ color: "#8C1D40" }}>Experience Progress</h3>
                <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  {xp} / {xp + xpToNext} XP to Level {level.level + 1}
                </p>
              </div>
            </div>
            <div className="rounded-2xl px-5 py-3 shadow-lg"
              style={{ background: "linear-gradient(135deg, #FFC627 0%, #ffd966 100%)" }}>
              <div className="text-xs font-bold text-white/90 mb-1 text-center">TOTAL XP</div>
              <div className="text-2xl font-black text-white text-center">{xp}</div>
            </div>
          </div>

          {/* Bar */}
          <div className="relative z-10">
            <div className="h-8 rounded-full overflow-hidden border"
              style={{ backgroundColor: colors.progressBarBg, borderColor: "rgba(140,29,64,0.2)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #8C1D40 0%, #FFC627 100%)" }}>
                {/* Shine sweep */}
                <div className="absolute inset-0"
                  style={{
                    background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
                    animation: "xpShine 2s ease-in-out infinite",
                    width: "200%",
                  }} />
              </motion.div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-white drop-shadow">{progress.percentage}% Complete</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 relative z-10">
            <Sparkles size={14} className="text-[#FFC627]" />
            <p className="text-sm font-bold" style={{ color: colors.textSecondary }}>
              {xpToNext} XP needed to reach Level {level.level + 1}!
            </p>
            <Sparkles size={14} className="text-[#FFC627]" />
          </div>
          <style>{`@keyframes xpShine { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
        </motion.div>

        {/* ── Stats Row ────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Calendar size={28} className="text-white" />,
              iconBg: "linear-gradient(135deg, #8C1D40, #6B1530)",
              border: "rgba(140,29,64,0.4)",
              value: learningDays,
              valueColor: "#8C1D40",
              label: "Day Streak",
              sub: `Best: ${bestStreak} days • Keep going! 🔥`,
            },
            {
              icon: <Award size={28} className="text-white" />,
              iconBg: "linear-gradient(135deg, #FFC627, #ffd966)",
              border: "rgba(255,198,39,0.4)",
              value: badges.length,
              valueColor: "#d4a017",
              label: "Badges Earned",
              sub: "Complete challenges to earn more! 🏆",
            },
            {
              icon: <Target size={28} className="text-white" />,
              iconBg: "linear-gradient(135deg, #22c55e, #16a34a)",
              border: "rgba(34,197,94,0.4)",
              value: assignmentsAnalyzed,
              valueColor: "#16a34a",
              label: "Assignments Analyzed",
              sub: "Analyze more to learn better! 📚",
            },
          ].map((card, i) => (
            <div key={i}
              className="rounded-2xl shadow-lg p-6 relative overflow-hidden"
              style={{ backgroundColor: colors.cardBackground, border: `2px solid ${card.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full p-3 shadow-md" style={{ background: card.iconBg }}>{card.icon}</div>
                <div className="text-right">
                  <div className="text-4xl font-black" style={{ color: card.valueColor }}>{card.value}</div>
                  <div className="text-sm font-bold" style={{ color: colors.textSecondary }}>{card.label}</div>
                </div>
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Today's Module ───────────────────────────────────── */}
        {currentModule && (
          <div className="rounded-2xl shadow-lg p-6"
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: "#8C1D40" }}>
                  TODAY'S MODULE
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>{currentModule.name}</h3>
                {currentLesson && (
                  <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Current: {currentLesson.title}</p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {currentModule.lessons.map((lesson: Lesson, idx: number) => {
                      const saved = loadModuleProgress(currentModule.id);
                      const completedCount = saved
                        ? Math.floor(((saved.stepIndex + 1) / saved.totalSteps) * currentModule.lessons.length)
                        : 0;
                      return (
                        <div key={lesson.id} className="w-2 h-2 rounded-full" style={{
                          backgroundColor: idx < completedCount ? "#4BB7C4"
                            : idx === completedCount ? "rgba(75,183,196,0.5)"
                            : "rgba(122,90,98,0.3)"
                        }} />
                      );
                    })}
                  </div>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {(() => {
                      const saved = loadModuleProgress(currentModule.id);
                      const total = currentModule.lessons.length;
                      const completed = saved
                        ? Math.min(Math.floor(((saved.stepIndex + 1) / saved.totalSteps) * total), total)
                        : 0;
                      return `${completed}/${total} done`;
                    })()}
                  </span>
                </div>
              </div>
              <button onClick={() => navigate(`/module/${currentModule.id}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#FFC627", color: "#0D0508" }}>
                <span>Continue Learning</span><ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ── Leaderboard + Friends ────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="rounded-2xl shadow-lg p-6"
            style={{ backgroundColor: colors.cardBackground, border: "2px solid rgba(255,198,39,0.3)" }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-full p-2 shadow-md" style={{ background: "linear-gradient(135deg, #FFC627, #ffd966)" }}>
                <Trophy className="text-white" size={22} />
              </div>
              <h2 className="text-xl font-black" style={{ color: "#8C1D40" }}>Leaderboard</h2>
            </div>
            <div className="space-y-2">
              {leaderboardData.map((user) => (
                <motion.div key={user.rank} whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: user.isCurrentUser
                      ? "linear-gradient(135deg, rgba(140,29,64,0.12) 0%, rgba(255,198,39,0.08) 100%)"
                      : "rgba(128,128,128,0.04)",
                    border: user.isCurrentUser ? "2px solid rgba(140,29,64,0.35)" : "1px solid rgba(128,128,128,0.1)",
                  }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm shadow"
                    style={{ background: user.rank === 1 ? "linear-gradient(135deg,#FFC627,#ffd966)"
                      : user.rank === 2 ? "linear-gradient(135deg,#d1d5db,#9ca3af)"
                      : user.rank === 3 ? "linear-gradient(135deg,#d97706,#92400e)"
                      : "linear-gradient(135deg,#8C1D40,#6B1530)" }}>
                    {user.rank === 1 ? <Crown size={14} /> : user.rank}
                  </div>
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: colors.textPrimary }}>
                      {user.name}
                      {user.isCurrentUser && <span className="text-xs ml-1 font-normal" style={{ color: "#8C1D40" }}>(You)</span>}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{user.exp} exp</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Friends */}
          <div className="rounded-2xl shadow-lg p-6"
            style={{ backgroundColor: colors.cardBackground, border: "2px solid rgba(34,197,94,0.3)" }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-full p-2 shadow-md" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                <Users className="text-white" size={22} />
              </div>
              <h2 className="text-xl font-black" style={{ color: "#16a34a" }}>Friends</h2>
            </div>
            <div className="space-y-2 mb-4">
              {friends.length === 0 && !showAddFriend && (
                <p className="text-sm text-center py-4" style={{ color: colors.textSecondary }}>
                  No friends added yet.
                </p>
              )}
              {friends.map((friend) => (
                <motion.button
                  key={friend.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedFriend(friend)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors"
                  style={{ background: "rgba(128,128,128,0.04)", border: "1px solid rgba(128,128,128,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="font-black text-sm" style={{ color: colors.textPrimary }}>{friend.username}</p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Added {new Date(friend.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {showAddFriend ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={friendInput}
                    onChange={(e) => { setFriendInput(e.target.value); setFriendError(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddFriend(); }}
                    placeholder="Their username"
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, backgroundColor: colors.background, color: colors.textPrimary }}
                  />
                  <button
                    onClick={handleAddFriend}
                    disabled={addingFriend || !friendInput.trim()}
                    className="px-4 py-2 rounded-lg font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                    {addingFriend ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => { setShowAddFriend(false); setFriendError(null); setFriendInput(""); }}
                    className="px-3 py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-80"
                    style={{ backgroundColor: "rgba(128,128,128,0.1)", color: colors.textSecondary }}>
                    Cancel
                  </button>
                </div>
                {friendError && (
                  <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>{friendError}</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAddFriend(true)}
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                + Add Friends
              </button>
            )}
          </div>
        </div>

        {/* Friend detail popover */}
        {selectedFriend && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setSelectedFriend(null)}
          >
            <div
              className="w-full max-w-xs rounded-2xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-5xl">👤</span>
              <h3 className="text-lg font-black mt-2" style={{ color: colors.textPrimary }}>{selectedFriend.username}</h3>
              <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
                Friends since {new Date(selectedFriend.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemoveFriend(selectedFriend.id)}
                  className="flex-1 py-2 rounded-lg font-bold text-sm transition-colors hover:opacity-80"
                  style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                  Remove Friend
                </button>
                <button
                  onClick={() => setSelectedFriend(null)}
                  className="flex-1 py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-80"
                  style={{ backgroundColor: "rgba(128,128,128,0.1)", color: colors.textSecondary }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badge detail popover */}
        {selectedBadge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="w-full max-w-xs rounded-2xl p-6 text-center"
              style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-5xl">{selectedBadge.icon}</span>
              <h3 className="text-lg font-black mt-2" style={{ color: colors.textPrimary }}>{selectedBadge.name}</h3>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>{selectedBadge.description}</p>
              {selectedBadge.earnedDate ? (
                <p className="text-xs mb-5" style={{ color: "#8C1D40" }}>Earned {selectedBadge.earnedDate}</p>
              ) : (
                <p className="text-xs mb-5 font-semibold" style={{ color: "#0ea5e9" }}>Not yet earned</p>
              )}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: "rgba(128,128,128,0.1)", color: colors.textSecondary }}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* ── Your Badges ──────────────────────────────────────── */}
        <div className="rounded-2xl shadow-lg p-6"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}>
          <h2 className="text-xl font-black mb-5" style={{ color: "#8C1D40" }}>Your Badges</h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <motion.button
                  key={badge.id}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  onClick={() => setSelectedBadge({
                    name: badge.name,
                    icon: badge.icon,
                    description: badge.description,
                    earnedDate: new Date(badge.earnedDate).toLocaleDateString(),
                  })}
                  className="p-4 rounded-xl text-center border"
                  style={{ borderColor: "rgba(157,78,221,0.3)", background: "rgba(157,78,221,0.05)" }}>
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-black" style={{ color: "#8C1D40" }}>{badge.name}</p>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-6xl mb-3 animate-bounce">🎯</div>
              <p className="font-bold" style={{ color: colors.textSecondary }}>
                No badges yet! Start learning to earn your first badge.
              </p>
            </div>
          )}
        </div>

        {/* ── Available Badges to Earn ─────────────────────────── */}
        <div className="rounded-2xl shadow-lg p-6"
          style={{ backgroundColor: colors.cardBackground, border: "2px solid rgba(0,212,255,0.25)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="rounded-full p-2 shadow-md" style={{ background: "linear-gradient(135deg, #00d4ff, #9d4edd)" }}>
              <TrendingUp className="text-white" size={22} />
            </div>
            <h2 className="text-xl font-black" style={{ color: "#0ea5e9" }}>Available Badges to Earn</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {availableBadges
              .filter((b) => !badges.some((earned) => earned.id === b.id))
              .map((badge) => (
                <button key={badge.id}
                  onClick={() => setSelectedBadge({ name: badge.name, icon: badge.icon, description: badge.description })}
                  className="p-4 rounded-xl text-center border-2 border-dashed opacity-60 hover:opacity-80 transition-opacity"
                  style={{ borderColor: "rgba(157,78,221,0.4)", background: "rgba(128,128,128,0.04)" }}>
                  <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                  <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>{badge.name}</p>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>Tap for details</p>
                </button>
              ))}
          </div>
        </div>

        {/* ── Avatar Locker ────────────────────────────────────── */}
        <div className="rounded-2xl shadow-lg p-6"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="rounded-full p-2 shadow-md" style={{ background: "linear-gradient(135deg, #E8547A, #8B1A2E)" }}>
              <Shirt className="text-white" size={22} />
            </div>
            <h2 className="text-xl font-black" style={{ color: "#8C1D40" }}>Avatar Locker</h2>
          </div>

          {(["hat", "cape", "accessory"] as ItemSlot[]).map((slot) => (
            <div key={slot} className="mb-6 last:mb-0">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
                {SLOT_LABELS[slot]}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ITEMS.filter((item) => item.slot === slot).map((item) => {
                  const unlocked = isItemUnlocked(item);
                  const isEquipped = equippedMap[slot] === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => unlocked && handleToggleEquip(item)}
                      disabled={!unlocked}
                      className="p-4 rounded-xl text-center border-2 transition-all hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
                      style={{
                        borderColor: isEquipped ? colors.accentGold : unlocked ? colors.cardBorder : "transparent",
                        background: isEquipped ? "rgba(255,198,39,0.12)" : "rgba(128,128,128,0.04)",
                        opacity: unlocked ? 1 : 0.5,
                      }}
                    >
                      <div className="mb-2 flex items-center justify-center" style={{ height: 24 }}>
                        {unlocked ? (
                          <span className="text-xl" style={{ color: colors.accentGold }}>✦</span>
                        ) : (
                          <Lock size={18} style={{ color: colors.textSecondary }} />
                        )}
                      </div>
                      <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>{item.name}</p>
                      <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        {unlocked ? (isEquipped ? "Equipped — tap to remove" : "Tap to equip") : describeUnlock(item.unlock)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Appearance ───────────────────────────────────────── */}
        <div className="rounded-2xl shadow-lg p-6"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}>
          <h2 className="text-xl font-black mb-5" style={{ color: '#8C1D40' }}>Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold" style={{ color: colors.textPrimary }}>Theme</p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative flex items-center rounded-full p-1 transition-colors duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                border: `1px solid ${colors.cardBorder}`,
                width: 64,
                height: 32,
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Sun size={14} style={{ color: theme === 'light' ? colors.accentGold : colors.textSecondary, marginLeft: 2, flexShrink: 0 }} />
              <Moon size={14} style={{ color: theme === 'dark' ? colors.accentGold : colors.textSecondary, marginLeft: 'auto', marginRight: 2, flexShrink: 0 }} />
              <span
                className="absolute top-1 rounded-full transition-all duration-300"
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: colors.accentMaroon,
                  left: theme === 'light' ? 4 : 38,
                }}
              />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}