import { supabase } from './supabase';
import type { ItemSlot } from '../data/itemsData';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export type UserType = 'student' | 'professor' | 'faculty' | 'staff';
export type CharacterId = 'aisha' | 'dev' | 'jordan';

export interface UserData {
  username: string;
  loginDate: string;
  learningDays: number;
  badges: Badge[];
  lastCheckIn: string;
  completedGames: string[];
  assignmentsAnalyzed: number;
  xp: number;
  bestStreak: number;
  userType: UserType;
  year?: string;
  major?: string;
  isReturningUser?: boolean;
  language?: string;
  selectedCharacter?: CharacterId;
  equippedItems?: Partial<Record<ItemSlot, string>>;
}

export function getUserData(): UserData | null {
  const data = localStorage.getItem("asu_genai_user");
  if (!data) return null;
  return JSON.parse(data);
}

export function updateUserData(updates: Partial<UserData>) {
  const currentData = getUserData();
  if (!currentData) return;

  const updatedData = { ...currentData, ...updates };
  localStorage.setItem("asu_genai_user", JSON.stringify(updatedData));

  // Fire-and-forget sync to Supabase
  syncUserToSupabase(updatedData);
}

async function syncUserToSupabase(data: UserData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await Promise.all([
    supabase.from('profiles').upsert({
      id: user.id,
      username: data.username,
      user_type: data.userType || 'student',
      year: data.year || null,
      major: data.major || null,
      language: data.language || 'en',
      selected_character: data.selectedCharacter || null,
    }, { onConflict: 'id' }),
    supabase.from('user_stats').upsert({
      id: user.id,
      learning_days: data.learningDays || 0,
      best_streak: data.bestStreak || 0,
      last_check_in: data.lastCheckIn || null,
      assignments_analyzed: data.assignmentsAnalyzed || 0,
      completed_games: data.completedGames || [],
      xp: data.xp || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' }),
  ]);
}

async function syncBadgeToSupabase(badge: Badge): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('badges').upsert({
    user_id: user.id,
    badge_id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    earned_date: badge.earnedDate,
  }, { onConflict: 'user_id,badge_id' });
}

export function checkDailyCheckIn(): boolean {
  const userData = getUserData();
  if (!userData) return false;

  const badges = [...userData.badges];

  // Award first-checkin whenever it's missing, regardless of whether today is a new day
  if (!badges.some(b => b.id === 'first-checkin')) {
    badges.push({
      id: 'first-checkin',
      name: 'First Day',
      description: 'Started your GenAI learning journey',
      icon: '🌟',
      earnedDate: new Date().toISOString()
    });
    updateUserData({ badges });
  }

  const today = new Date().toISOString().split('T')[0];
  const lastCheckIn = userData.lastCheckIn;

  if (lastCheckIn !== today) {
    const updatedBadges = [...getUserData()!.badges];

    const daysSinceLastCheckIn = Math.floor(
      (new Date(today).getTime() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    let learningDays = userData.learningDays;
    if (daysSinceLastCheckIn === 1) {
      learningDays += 1;
    } else if (daysSinceLastCheckIn > 1) {
      learningDays = 1;
    }

    if (learningDays === 3 && !updatedBadges.some(b => b.id === 'streak-3')) {
      updatedBadges.push({
        id: 'streak-3',
        name: '3-Day Streak',
        description: 'Checked in for 3 consecutive days',
        icon: '🔥',
        earnedDate: new Date().toISOString()
      });
    }

    if (learningDays === 7 && !updatedBadges.some(b => b.id === 'streak-7')) {
      updatedBadges.push({
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Checked in for 7 consecutive days',
        icon: '⚡',
        earnedDate: new Date().toISOString()
      });
    }

    updateUserData({ lastCheckIn: today, learningDays, badges: updatedBadges });
    return true;
  }

  return false;
}

const HIGH_SCORE_KEY = 'asu_genai_high_scores';

export function getHighScore(gameId: string): number {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    const store: Record<string, number> = raw ? JSON.parse(raw) : {};
    return store[gameId] ?? 0;
  } catch { return 0; }
}

export function saveHighScore(gameId: string, score: number): boolean {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    const store: Record<string, number> = raw ? JSON.parse(raw) : {};
    if (score > (store[gameId] ?? 0)) {
      store[gameId] = score;
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(store));
      return true;
    }
    return false;
  } catch { return false; }
}

export function awardBadge(badgeId: string, name: string, description: string, icon: string) {
  const userData = getUserData();
  if (!userData) return;

  if (userData.badges.some(b => b.id === badgeId)) return;

  const newBadge: Badge = {
    id: badgeId,
    name,
    description,
    icon,
    earnedDate: new Date().toISOString()
  };

  updateUserData({ badges: [...userData.badges, newBadge] });

  // Sync badge separately so it hits the badges table too
  syncBadgeToSupabase(newBadge);
}

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem("asu_genai_user");
}

export function addXP(amount: number) {
  const userData = getUserData();
  if (!userData) return;

  const newXP = (userData.xp || 0) + amount;
  updateUserData({ xp: newXP });

  return newXP;
}
