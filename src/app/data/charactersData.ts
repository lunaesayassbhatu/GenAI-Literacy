import type { CharacterId } from "../utils/userData";

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  color: string;
  tagline: string;
  story: string;
}

export const CHARACTERS: CharacterInfo[] = [
  {
    id: "aisha",
    name: "Aisha",
    color: "#E8547A",
    tagline: "Sophomore at ASU",
    story:
      "Aisha dives into GenAI headfirst, using it for everything from essays to exam prep. She's been burned by confident-sounding answers that turned out wrong, and now she's building the habit of verifying before she trusts.",
  },
  {
    id: "dev",
    name: "Dev",
    color: "#4AB7C4",
    tagline: "2nd-Year Data Science Student at ASU",
    story:
      "Dev thinks before he prompts. He's the one asking what data a tool was trained on, who might be left out, and what the real cost of using it is — before he ever hits enter.",
  },
  {
    id: "jordan",
    name: "Jordan",
    color: "#FFC627",
    tagline: "Computer Science Master's Student at ASU",
    story:
      "Jordan doesn't settle for the first answer. When a response falls flat, he digs in, gets more specific, and iterates until the output actually matches what he needed.",
  },
];

export function getCharacterInfo(id: CharacterId | undefined): CharacterInfo {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
