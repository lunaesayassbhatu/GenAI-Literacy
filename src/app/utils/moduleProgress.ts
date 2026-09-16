import { supabase } from './supabase';

const PROGRESS_KEY = "asu_genai_module_progress";
const VARIANT_COUNTER_KEY = "asu_genai_variant_counters";
const MODULE_XP_KEY = "asu_genai_module_xp";
const COMMITTED_MODULE_XP_KEY = "asu_genai_committed_module_xp";
const EVER_COMPLETED_KEY = "asu_genai_ever_completed_modules";

export interface StepProgress {
  stepIndex: number;   // last step the user reached (0-based)
  totalSteps: number;
  questionVariant?: number; // which question variant is active for this run
}

type ProgressStore = Record<string, StepProgress>;
type NumberStore = Record<string, number>;

function loadStore(): ProgressStore {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: ProgressStore): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
}

function loadNumberStore(key: string): NumberStore {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNumberStore(key: string, store: NumberStore): void {
  localStorage.setItem(key, JSON.stringify(store));
}

/** Load the saved progress for a single module. Returns null if never started. */
export function loadModuleProgress(moduleId: string): StepProgress | null {
  return loadStore()[moduleId] ?? null;
}

/**
 * Save progress for a module.
 * Only advances forward — visiting an earlier step won't erase later progress.
 */
export function saveModuleProgress(
  moduleId: string,
  stepIndex: number,
  totalSteps: number,
  questionVariant?: number
): void {
  const store = loadStore();
  const current = store[moduleId];
  if (!current || stepIndex > current.stepIndex) {
    store[moduleId] = {
      stepIndex,
      totalSteps,
      questionVariant: questionVariant ?? current?.questionVariant,
    };
    saveStore(store);
    syncModuleProgressToSupabase(moduleId, stepIndex, totalSteps, store[moduleId].questionVariant);
  }
}

async function syncModuleProgressToSupabase(
  moduleId: string,
  stepIndex: number,
  totalSteps: number,
  questionVariant?: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { console.warn('syncProgress: no user'); return; }

  const { error } = await supabase.from('module_progress').upsert({
    user_id: user.id,
    module_id: moduleId,
    step_index: stepIndex,
    total_steps: totalSteps,
    question_variant: questionVariant ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,module_id' });

  if (error) console.error('module_progress upsert failed:', error);
}

/**
 * Returns the variant index to use for this run, then advances the counter
 * so the next fresh start gets the next variant.
 */
export function advanceVariantCounter(moduleId: string, totalVariants: number): number {
  try {
    const raw = localStorage.getItem(VARIANT_COUNTER_KEY);
    const store: Record<string, number> = raw ? JSON.parse(raw) : {};
    const current = store[moduleId] ?? 0;
    store[moduleId] = (current + 1) % totalVariants;
    localStorage.setItem(VARIANT_COUNTER_KEY, JSON.stringify(store));
    return current;
  } catch {
    return 0;
  }
}

/** Clear saved progress for a single module so it starts from the beginning. */
export function resetModuleProgress(moduleId: string): void {
  const store = loadStore();
  if (!(moduleId in store)) return;
  delete store[moduleId];
  saveStore(store);
}

/**
 * Whether the user has ever fully finished this module at least once.
 * Unlike step progress, this is never cleared by resetModuleProgress/restart —
 * it's what keeps the "Review" option available even after a restart.
 */
export function hasEverCompletedModule(moduleId: string): boolean {
  const store = loadNumberStore(EVER_COMPLETED_KEY);
  return store[moduleId] === 1;
}

export function markModuleEverCompleted(moduleId: string): void {
  if (!moduleId) return;
  const store = loadNumberStore(EVER_COMPLETED_KEY);
  if (store[moduleId] === 1) return;
  store[moduleId] = 1;
  saveNumberStore(EVER_COMPLETED_KEY, store);
}

export function getModuleXP(moduleId: string): number {
  if (!moduleId) return 0;
  const store = loadNumberStore(MODULE_XP_KEY);
  return Math.max(0, store[moduleId] ?? 0);
}

export function setModuleXP(moduleId: string, xp: number): void {
  if (!moduleId) return;
  const store = loadNumberStore(MODULE_XP_KEY);
  store[moduleId] = Math.max(0, xp);
  saveNumberStore(MODULE_XP_KEY, store);
  syncModuleXPToSupabase(moduleId, Math.max(0, xp), getCommittedModuleXP(moduleId));
}

export function resetModuleXP(moduleId: string): void {
  if (!moduleId) return;
  const store = loadNumberStore(MODULE_XP_KEY);
  if (store[moduleId] === undefined) return;
  delete store[moduleId];
  saveNumberStore(MODULE_XP_KEY, store);
}

export function getCommittedModuleXP(moduleId: string): number {
  if (!moduleId) return 0;
  const store = loadNumberStore(COMMITTED_MODULE_XP_KEY);
  return Math.max(0, store[moduleId] ?? 0);
}

export function setCommittedModuleXP(moduleId: string, xp: number): void {
  if (!moduleId) return;
  const store = loadNumberStore(COMMITTED_MODULE_XP_KEY);
  store[moduleId] = Math.max(0, xp);
  saveNumberStore(COMMITTED_MODULE_XP_KEY, store);
  syncModuleXPToSupabase(moduleId, getModuleXP(moduleId), Math.max(0, xp));
}

async function syncModuleXPToSupabase(moduleId: string, xp: number, committedXp: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { console.warn('syncXP: no user'); return; }

  const { error } = await supabase.from('module_xp').upsert({
    user_id: user.id,
    module_id: moduleId,
    xp,
    committed_xp: committedXp,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,module_id' });

  if (error) console.error('module_xp upsert failed:', error);
}

export function resetCommittedModuleXP(moduleId: string): void {
  if (!moduleId) return;
  const store = loadNumberStore(COMMITTED_MODULE_XP_KEY);
  if (store[moduleId] === undefined) return;
  delete store[moduleId];
  saveNumberStore(COMMITTED_MODULE_XP_KEY, store);
}

/**
 * Returns how many of a module's display lessons should appear completed,
 * derived proportionally from step progress.
 */
export function getCompletedLessonCount(
  moduleId: string,
  totalLessons: number
): number {
  const progress = loadModuleProgress(moduleId);
  if (!progress || progress.totalSteps === 0) return 0;
  if (progress.stepIndex >= progress.totalSteps - 1) return totalLessons;
  return Math.floor(
    ((progress.stepIndex + 1) / progress.totalSteps) * totalLessons
  );
}
