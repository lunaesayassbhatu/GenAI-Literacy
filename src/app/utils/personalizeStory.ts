import type { CharacterId } from "./userData";
import { getCharacterInfo } from "../data/charactersData";
import type { Step } from "./moduleStepsData";

// Lessons are written around three recurring personas. Learners pick one on the
// "Choose your character" screen, and every story, scenario and question should
// then star *their* character — never the other two.

const NAME_PATTERN = /\b(Aisha|Dev|Jordan)\b/g;
const FEMALE: Record<CharacterId, boolean> = { aisha: true, dev: false, jordan: false };

function idForName(name: string): CharacterId {
  return name.toLowerCase() as CharacterId;
}

function matchCase(source: string, replacement: string): string {
  return source[0] === source[0].toUpperCase()
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

/** Swaps gendered pronouns when the written character and the chosen one differ. */
function swapPronouns(text: string, toFemale: boolean): string {
  if (toFemale) {
    return text
      .replace(/\b(himself)\b/gi, (m) => matchCase(m, "herself"))
      .replace(/\b(he|him|his)\b/gi, (m) => matchCase(m, m.toLowerCase() === "he" ? "she" : "her"));
  }
  return text
    .replace(/\b(herself)\b/gi, (m) => matchCase(m, "himself"))
    .replace(/\bshe\b/gi, (m) => matchCase(m, "he"))
    // "her" is possessive ("her essay") before a word, object ("told her.") otherwise.
    .replace(/\bher\b(?=\s+[A-Za-z'’])/gi, (m) => matchCase(m, "his"))
    .replace(/\bher\b/gi, (m) => matchCase(m, "him"));
}

/** Rewrites one string so any persona it mentions becomes the chosen character. */
export function personalizeText(text: string, chosen: CharacterId): string {
  const mentioned = new Set<CharacterId>();
  for (const m of text.matchAll(NAME_PATTERN)) mentioned.add(idForName(m[1]));
  if (mentioned.size === 0) return text;
  const chosenName = getCharacterInfo(chosen).name;
  let out = text.replace(NAME_PATTERN, chosenName);
  // Pronouns only need fixing when every mentioned persona differs in gender from the chosen one.
  const sourceFemale = [...mentioned].some((id) => FEMALE[id]);
  const sourceMale = [...mentioned].some((id) => !FEMALE[id]);
  if (sourceFemale !== sourceMale && sourceFemale !== FEMALE[chosen]) {
    out = swapPronouns(out, FEMALE[chosen]);
  }
  return out;
}

function deepPersonalize<T>(value: T, chosen: CharacterId): T {
  if (typeof value === "string") return personalizeText(value, chosen) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepPersonalize(v, chosen)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepPersonalize(v, chosen);
    }
    return out as T;
  }
  return value;
}

/** Returns the steps with every recurring persona replaced by the learner's chosen character. */
export function personalizeSteps(steps: Step[], chosen: CharacterId): Step[] {
  return deepPersonalize(steps, chosen);
}
