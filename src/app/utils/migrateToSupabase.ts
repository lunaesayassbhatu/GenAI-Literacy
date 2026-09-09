import { supabase } from './supabase';

export async function hydrateLocalStorageFromSupabase(userId: string, userEmail: string): Promise<void> {
  // Clear stale local data if it belongs to a different user
  const existingLocal = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("asu_genai_user") || "{}");
      if (parsed.email && parsed.email !== userEmail) {
        localStorage.removeItem("asu_genai_user");
        localStorage.removeItem("asu_genai_module_progress");
        localStorage.removeItem("asu_genai_module_xp");
        localStorage.removeItem("asu_genai_committed_module_xp");
        return {};
      }
      return parsed;
    } catch { return {}; }
  })();

  const [
    { data: profile },
    { data: stats },
    { data: badges },
    { data: moduleProgressRows },
    { data: moduleXpRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("user_stats").select("*").eq("id", userId).single(),
    supabase.from("badges").select("*").eq("user_id", userId),
    supabase.from("module_progress").select("*").eq("user_id", userId),
    supabase.from("module_xp").select("*").eq("user_id", userId),
  ]);

  // Merge module XP — take the higher value between local and Supabase
  const existingXP = (() => {
    try { return JSON.parse(localStorage.getItem("asu_genai_module_xp") || "{}"); } catch { return {}; }
  })();
  const existingCommitted = (() => {
    try { return JSON.parse(localStorage.getItem("asu_genai_committed_module_xp") || "{}"); } catch { return {}; }
  })();
  const xpStore: Record<string, number> = { ...existingXP };
  const committedStore: Record<string, number> = { ...existingCommitted };
  for (const row of (moduleXpRows ?? [])) {
    xpStore[row.module_id] = Math.max(xpStore[row.module_id] ?? 0, row.xp);
    committedStore[row.module_id] = Math.max(committedStore[row.module_id] ?? 0, row.committed_xp);
  }
  localStorage.setItem("asu_genai_module_xp", JSON.stringify(xpStore));
  localStorage.setItem("asu_genai_committed_module_xp", JSON.stringify(committedStore));

  const totalXPFromModules = Object.values(committedStore).reduce((sum, xp) => sum + xp, 0);
  const mergedXP = Math.max(existingLocal.xp ?? 0, stats?.xp ?? 0, totalXPFromModules);
  const mergedLearningDays = Math.max(existingLocal.learningDays ?? 0, stats?.learning_days ?? 0);
  const mergedBestStreak = Math.max(existingLocal.bestStreak ?? 0, stats?.best_streak ?? 0);

  // Merge badges: Supabase wins on overlap
  const supabaseBadges = (badges ?? []).map((b: { badge_id: string; name: string; description: string; icon: string; earned_date: string }) => ({
    id: b.badge_id, name: b.name, description: b.description, icon: b.icon, earnedDate: b.earned_date,
  }));
  const localBadges: { id: string }[] = existingLocal.badges ?? [];
  const mergedBadges = [
    ...supabaseBadges,
    ...localBadges.filter((lb) => !supabaseBadges.some((sb: { id: string }) => sb.id === lb.id)),
  ];

  // Build merged user object, preserving any local fields not covered by Supabase
  const mergedUser = {
    ...existingLocal,
    email: userEmail,
    username: profile?.username ?? existingLocal.username ?? "",
    language: profile?.language ?? existingLocal.language ?? "en",
    userType: profile?.user_type ?? existingLocal.userType ?? "student",
    year: profile?.year ?? existingLocal.year ?? "",
    major: profile?.major ?? existingLocal.major ?? "",
    loginDate: existingLocal.loginDate ?? new Date().toISOString(),
    learningDays: mergedLearningDays,
    bestStreak: mergedBestStreak,
    lastCheckIn: stats?.last_check_in ?? existingLocal.lastCheckIn ?? new Date().toISOString().split("T")[0],
    completedGames: stats?.completed_games ?? existingLocal.completedGames ?? [],
    assignmentsAnalyzed: stats?.assignments_analyzed ?? existingLocal.assignmentsAnalyzed ?? 0,
    xp: mergedXP,
    badges: mergedBadges,
    isReturningUser: true,
  };
  localStorage.setItem("asu_genai_user", JSON.stringify(mergedUser));

  // Merge module progress — keep the furthest-along step
  const existingProgress = (() => {
    try { return JSON.parse(localStorage.getItem("asu_genai_module_progress") || "{}"); } catch { return {}; }
  })();
  const progressStore = { ...existingProgress };
  for (const row of (moduleProgressRows ?? [])) {
    const current = progressStore[row.module_id];
    if (!current || row.step_index > current.stepIndex) {
      progressStore[row.module_id] = {
        stepIndex: row.step_index,
        totalSteps: row.total_steps,
        questionVariant: row.question_variant ?? undefined,
      };
    }
  }
  localStorage.setItem("asu_genai_module_progress", JSON.stringify(progressStore));

  // Push all merged data back so other devices stay in sync
  await migrateLocalStorageToSupabase();
}

export async function migrateLocalStorageToSupabase(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Sync user profile + stats
  const rawUser = localStorage.getItem('asu_genai_user');
  if (rawUser) {
    const u = JSON.parse(rawUser);
    await Promise.all([
      supabase.from('profiles').upsert({
        id: user.id,
        username: u.username,
        user_type: u.userType || 'student',
        year: u.year || null,
        major: u.major || null,
        language: u.language || 'en',
      }, { onConflict: 'id' }),
      supabase.from('user_stats').upsert({
        id: user.id,
        learning_days: u.learningDays || 0,
        best_streak: u.bestStreak || 0,
        last_check_in: u.lastCheckIn || null,
        assignments_analyzed: u.assignmentsAnalyzed || 0,
        completed_games: u.completedGames || [],
        xp: u.xp || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' }),
    ]);

    // Sync badges
    for (const badge of (u.badges || [])) {
      await supabase.from('badges').upsert({
        user_id: user.id,
        badge_id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        earned_date: badge.earnedDate,
      }, { onConflict: 'user_id,badge_id' });
    }
  }

  // Sync module progress
  const rawProgress = localStorage.getItem('asu_genai_module_progress');
  if (rawProgress) {
    const store = JSON.parse(rawProgress) as Record<string, { stepIndex: number; totalSteps: number; questionVariant?: number }>;
    for (const [moduleId, progress] of Object.entries(store)) {
      await supabase.from('module_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        step_index: progress.stepIndex,
        total_steps: progress.totalSteps,
        question_variant: progress.questionVariant ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_id' });
    }
  }

  // Sync module XP
  const rawXP = localStorage.getItem('asu_genai_module_xp');
  const rawCommitted = localStorage.getItem('asu_genai_committed_module_xp');
  if (rawXP) {
    const xpStore = JSON.parse(rawXP) as Record<string, number>;
    const committedStore: Record<string, number> = rawCommitted ? JSON.parse(rawCommitted) : {};
    for (const [moduleId, xp] of Object.entries(xpStore)) {
      await supabase.from('module_xp').upsert({
        user_id: user.id,
        module_id: moduleId,
        xp,
        committed_xp: committedStore[moduleId] ?? 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_id' });
    }
  }
}
