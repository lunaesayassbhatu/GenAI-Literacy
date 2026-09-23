import { getUserData, updateUserData } from "./userData";
import { getCurrentLevel } from "./xpSystem";
import { MODULES } from "./modulesData";
import { hasEverCompletedModule } from "./moduleProgress";
import { ITEMS, type CosmeticItem, type ItemSlot } from "../data/itemsData";

/** Badge ids awarded on completing each of the 7 games listed on the Games hub
 *  — the source of truth for "games completed" since UserData.completedGames
 *  is never populated. ("game-master" is MatchingGame's badge; that route
 *  isn't linked from the hub, so it's intentionally excluded from the count.) */
const GAME_COMPLETION_BADGE_IDS = [
  "ethics-expert",
  "black-box-skeptic",
  "fact-or-myth-master",
  "bias-detective",
  "prompt-builder",
  "prompt-engineer",
  "eco-conscious",
];

export function getModulesCompletedCount(): number {
  return MODULES.filter((m) => hasEverCompletedModule(m.id)).length;
}

export function getGamesCompletedCount(): number {
  const userData = getUserData();
  if (!userData) return 0;
  return GAME_COMPLETION_BADGE_IDS.filter((id) =>
    userData.badges.some((b) => b.id === id)
  ).length;
}

export function isItemUnlocked(item: CosmeticItem): boolean {
  const userData = getUserData();
  if (!userData) return false;

  switch (item.unlock.type) {
    case "level":
      return getCurrentLevel(userData.xp || 0).level >= item.unlock.level;
    case "modulesCompleted":
      return getModulesCompletedCount() >= item.unlock.count;
    case "gamesCompleted":
      return getGamesCompletedCount() >= item.unlock.count;
  }
}

export function getUnlockedItems(): CosmeticItem[] {
  return ITEMS.filter(isItemUnlocked);
}

export function getEquippedMap(): Partial<Record<ItemSlot, string>> {
  return getUserData()?.equippedItems ?? {};
}

/** The ids of the currently-equipped items, for handing straight to CharacterMascot. */
export function getEquippedItemIds(): string[] {
  return Object.values(getEquippedMap()).filter((id): id is string => Boolean(id));
}

export function equipItem(item: CosmeticItem): void {
  if (!isItemUnlocked(item)) return;
  const equipped = { ...getEquippedMap(), [item.slot]: item.id };
  updateUserData({ equippedItems: equipped });
}

export function unequipSlot(slot: ItemSlot): void {
  const equipped = { ...getEquippedMap() };
  delete equipped[slot];
  updateUserData({ equippedItems: equipped });
}
