export type ItemSlot = "hat" | "cape" | "accessory";

export type UnlockCondition =
  | { type: "level"; level: number }
  | { type: "modulesCompleted"; count: number }
  | { type: "gamesCompleted"; count: number };

export interface CosmeticItem {
  id: string;
  slot: ItemSlot;
  name: string;
  description: string;
  unlock: UnlockCondition;
}

export const ITEMS: CosmeticItem[] = [
  {
    id: "explorer-cap",
    slot: "hat",
    name: "Explorer Cap",
    description: "Reach Level 2",
    unlock: { type: "level", level: 2 },
  },
  {
    id: "champions-crown",
    slot: "hat",
    name: "Champion's Crown",
    description: "Reach Level 7 (max level)",
    unlock: { type: "level", level: 7 },
  },
  {
    id: "scholars-cape",
    slot: "cape",
    name: "Scholar's Cape",
    description: "Reach Level 4",
    unlock: { type: "level", level: 4 },
  },
  {
    id: "masters-cloak",
    slot: "cape",
    name: "Master's Cloak",
    description: "Complete all 7 learning modules",
    unlock: { type: "modulesCompleted", count: 7 },
  },
  {
    id: "insight-badge",
    slot: "accessory",
    name: "Insight Badge",
    description: "Complete 3 learning modules",
    unlock: { type: "modulesCompleted", count: 3 },
  },
  {
    id: "game-medal",
    slot: "accessory",
    name: "Game Medal",
    description: "Complete 4 games",
    unlock: { type: "gamesCompleted", count: 4 },
  },
  {
    id: "champion-sash",
    slot: "accessory",
    name: "Champion's Sash",
    description: "Complete all 7 games",
    unlock: { type: "gamesCompleted", count: 7 },
  },
];

export function describeUnlock(unlock: UnlockCondition): string {
  switch (unlock.type) {
    case "level":
      return `Reach Level ${unlock.level}`;
    case "modulesCompleted":
      return `Complete ${unlock.count} learning module${unlock.count === 1 ? "" : "s"}`;
    case "gamesCompleted":
      return `Complete ${unlock.count} game${unlock.count === 1 ? "" : "s"}`;
  }
}
