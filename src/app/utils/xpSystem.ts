export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

export const LEVELS: Level[] = [
  { level: 1, title: "Beginner", minXP: 0, maxXP: 99 },
  { level: 2, title: "Learner", minXP: 100, maxXP: 249 },
  { level: 3, title: "Explorer", minXP: 250, maxXP: 499 },
  { level: 4, title: "Scholar", minXP: 500, maxXP: 849 },
  { level: 5, title: "Expert", minXP: 850, maxXP: 1299 },
  { level: 6, title: "Master", minXP: 1300, maxXP: 1999 },
  { level: 7, title: "Champion", minXP: 2000, maxXP: 9999 },
];

export function getCurrentLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; max: number; percentage: number } {
  const level = getCurrentLevel(xp);
  const nextLevel = LEVELS[level.level]; // Get next level (index equals current level)
  
  if (!nextLevel) {
    // Max level
    return { current: xp - level.minXP, max: 100, percentage: 100 };
  }
  
  const currentLevelXP = xp - level.minXP;
  const xpNeeded = nextLevel.minXP - level.minXP;
  const percentage = (currentLevelXP / xpNeeded) * 100;
  
  return {
    current: currentLevelXP,
    max: xpNeeded,
    percentage: Math.round(Math.min(percentage, 100))
  };
}

export function getXPToNextLevel(xp: number): number {
  const level = getCurrentLevel(xp);
  const nextLevel = LEVELS[level.level];
  
  if (!nextLevel) {
    return 0; // Max level
  }
  
  return nextLevel.minXP - xp;
}
