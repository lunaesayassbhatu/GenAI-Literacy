// ─── ARGONIA: EXPLORE THE CITY ───────────────────────────────────────────────
// A point-and-click view of the whole city. Every hotspot is a place, person or object the learner can click.
// Each one shows a short story moment, the idea behind it (tied to a module), and usually one quick question.
//
// All text lives here. The picture itself is drawn in components/games/ArgoniaCityScene.tsx; hotspot positions
// are percentages of the picture, so they keep working if CITY_BACKGROUND_IMAGE is set to a painted or
// AI-generated image of the city (use the same positions, or adjust x/y below to match the new picture).

/** The picture of the city. Set to null to use the drawn scene instead. */
import cityImage from "../assets/argonia-city.png";
import cityVideo from "../assets/argonia-city.mp4";
import tourVideo from "../assets/argonia-tour.mp4";
import tourPoster from "../assets/argonia-tour-poster.jpg";

export const CITY_BACKGROUND_IMAGE: string | null = cityImage;

/** A short looping video of the same picture (people, rider and water move). Set to null to show only the still picture. */
export const CITY_BACKGROUND_VIDEO: string | null = cityVideo;

/**
 * The guided tour: about 78 seconds with music, climbing the city one place at a time and ending with the queen.
 * `chapters` are the places in the tour (seconds from the start), so a learner can jump straight to one.
 * Music: J. S. Bach, Violin Sonata No. 1 in G minor, BWV 1001, I. Adagio (CC0, public domain dedication), and a quiet murmur of people made for this project.
 */
export const CITY_TOUR = {
  video: tourVideo,
  poster: tourPoster,
  chapters: [
    { label: "The whole city", at: 0 },
    { label: "The Eastgate", at: 7 },
    { label: "The lake and windmill", at: 14 },
    { label: "The workshop", at: 21 },
    { label: "The market", at: 28 },
    { label: "The notice board", at: 35 },
    { label: "The road", at: 42 },
    { label: "The clock tower", at: 49 },
    { label: "The dovecote", at: 56 },
    { label: "The castle", at: 63 },
    { label: "The queen", at: 70 },
  ],
  credit: "Music: J. S. Bach, Violin Sonata No. 1 in G minor, BWV 1001, I. Adagio (CC0).",
};

/** Hotspot positions (percent of the picture) for CITY_BACKGROUND_IMAGE. The x/y on each spot below are for the drawn scene. */
export const IMAGE_SPOT_POSITIONS: Record<string, { x: number; y: number }> = {
  "palace": { x: 23.7, y: 16.5 },
  "pigeon-loft": { x: 8.7, y: 38.9 },
  "eastgate": { x: 89.4, y: 73.1 },
  "north-rider": { x: 40.7, y: 61.3 },
  "rumor-board": { x: 45.1, y: 76.7 },
  "workshop": { x: 65.7, y: 61.3 },
  "university": { x: 26.9, y: 44.8 },
  "market": { x: 57, y: 81.4 },
  "scribes-hall": { x: 53.8, y: 51.9 },
  "lake": { x: 72.8, y: 41.3 },
};

export interface CityQuestionOption { text: string; good: boolean; feedback: string }
export interface CityQuestion { prompt: string; options: CityQuestionOption[] }

export interface CitySpot {
  id: string;
  name: string;
  emoji: string;
  /** Position on the picture, as a percentage of its width and height. */
  x: number;
  y: number;
  /** Which module this connects to (0 = story clue only). */
  moduleNumber: number;
  module: string;
  /** The story moment. */
  story: string;
  /** The idea to take away. */
  idea: string;
  question?: CityQuestion;
  /** A clue for the mystery, if this spot holds one. */
  clue?: string;
}

export const XP_LOOK = 5;
export const XP_CORRECT = 10;

export const CITY_SPOTS: CitySpot[] = [
  {
    id: "palace",
    name: "The Royal Palace",
    emoji: "🏰",
    x: 50,
    y: 17.5,
    moduleNumber: 1,
    module: "What is Generative AI, really?",
    story:
      "High above the clouds, the palace doors are closing to the people. Somewhere inside, the queen waits for you. The king's codex vanished along with him, but yours is in your bag, ready to write.",
    idea:
      "Your codex writes a fresh answer from patterns every time. It doesn't look anything up, and it doesn't know where anyone is.",
    question: {
      prompt: "A servant whispers, “Just ask the codex where the king is. It knows everything.” Is that right?",
      options: [
        { text: "Yes. It searches the whole kingdom.", good: false, feedback: "It doesn't search anywhere. It writes a new answer from patterns, so it could invent a place that sounds right." },
        { text: "No. It can't know where he is, and it might invent an answer.", good: true, feedback: "Exactly. Use it to draft questions or ideas, then go and find the real facts yourself." },
        { text: "Only if you ask politely.", good: false, feedback: "Politeness doesn't change what it can do. It still has no way of seeing the king." },
      ],
    },
  },
  {
    id: "pigeon-loft",
    name: "The Pigeon Loft",
    emoji: "🕊️",
    x: 41.5,
    y: 33,
    moduleNumber: 0,
    module: "A clue",
    story:
      "The king's letters came here by pigeon. The keeper spreads the last few on a table: each shorter than the one before, until the final one is barely a line. “He stopped asking for advice,” she says quietly.",
    idea: "Noticing a pattern in real evidence is your job. A codex can help you draft questions, but you are the investigator.",
    clue: "The king's letters grew shorter and shorter, and he stopped asking his advisors for help.",
  },
  {
    id: "eastgate",
    name: "The Eastgate",
    emoji: "🚪",
    x: 63,
    y: 34.5,
    moduleNumber: 2,
    module: "Trust in GenAI",
    story:
      "Ysolde, the gatekeeper, keeps a daily log of everyone who passes through. “The codex says the king left through here? There's no one called Bram Holloway on my gate. Read the log yourself.”",
    idea:
      "When a claim matters, check it against an independent record: a log, a source, or someone who was really there.",
    question: {
      prompt: "The codex says the king left through the Eastgate. The gate log says he didn't. What do you do?",
      options: [
        { text: "Trust the codex. It sounded sure.", good: false, feedback: "Sounding sure isn't evidence, and the codex has no way of having seen anything." },
        { text: "Trust the log. It's an independent record you can read and check.", good: true, feedback: "Yes. A record made by someone who was there beats a confident answer from a tool that wasn't." },
        { text: "Ask the codex again until it agrees with you.", good: false, feedback: "Repeating a question until you hear what you want only collects agreement, not evidence." },
      ],
    },
  },
  {
    id: "north-rider",
    name: "The Hooded Rider",
    emoji: "🐎",
    x: 70,
    y: 42.5,
    moduleNumber: 0,
    module: "A clue",
    story:
      "On the north road a lone rider in a hooded cloak slips away at dusk. A shepherd saw him go. “He never once looked back,” she says.",
    idea: "One small, real observation can be worth more than a long, confident answer from a machine.",
    clue: "A hooded rider left Argonia by the north road at dusk.",
  },
  {
    id: "rumor-board",
    name: "The Rumor Board",
    emoji: "📌",
    x: 50.4,
    y: 49.5,
    moduleNumber: 2,
    module: "Trust in GenAI",
    story:
      "Notices cover the board: “The king fled with the treasury!” “He vanished in a storm!” “He's hiding in the clouds!” Every one is written in bold, confident ink, and not one is signed.",
    idea: "Confident wording isn't evidence. The same is true of an AI answer that sounds polished and certain.",
    question: {
      prompt: "What does a confident, well-written notice tell you about whether it's true?",
      options: [
        { text: "Nothing. Confidence isn't evidence.", good: true, feedback: "Right. Look for who said it and how you could check it." },
        { text: "That it's probably true.", good: false, feedback: "Plenty of false things are written confidently. That's why you check." },
        { text: "That someone fact-checked it.", good: false, feedback: "Nothing on this board shows any checking, and an AI answer won't either unless you do it." },
      ],
    },
  },
  {
    id: "workshop",
    name: "The Codex Workshop",
    emoji: "⚙️",
    x: 33.7,
    y: 49.5,
    moduleNumber: 3,
    module: "How does GenAI ‘learn’?",
    story:
      "Sparks, gears and the smell of hot metal. The engineer wipes her hands. “We fed it books, letters and tavern songs. Don't ask me exactly how it picks its words. Nobody can say for sure.”",
    idea: "A GenAI tool reflects what it was trained on, and even its makers can't always explain why it wrote something.",
    question: {
      prompt: "Nobody can fully explain why the codex wrote a particular answer. How should you treat what it gives you?",
      options: [
        { text: "As a final ruling. It has read a lot.", good: false, feedback: "Reading a lot doesn't make it reliable, and you can't see how it decided." },
        { text: "As a first draft to check against sources you can see.", good: true, feedback: "Yes. Use it to move quickly, then verify what matters." },
        { text: "As useless. Never use it.", good: false, feedback: "That wastes a useful tool. The skill is using it carefully." },
      ],
    },
  },
  {
    id: "university",
    name: "The University Hall",
    emoji: "🎓",
    x: 68.3,
    y: 47,
    moduleNumber: 4,
    module: "Using GenAI Responsibly",
    story:
      "Students argue under the clock tower. The professor smiles. “Do you need to be an engineer to use the codex well? Not at all. You need to ask good questions and keep your own judgment.”",
    idea: "AI literacy isn't about being technical. It's about knowing what it can and can't do, and staying in charge of your own decisions.",
    question: {
      prompt: "What matters most for using the codex well?",
      options: [
        { text: "Knowing how to build one.", good: false, feedback: "You don't need to build it. Understanding its limits matters more." },
        { text: "Asking clear questions and checking the answers.", good: true, feedback: "Yes. Good questions and your own judgment make the difference." },
        { text: "Using it for everything.", good: false, feedback: "Using it for everything means skipping the thinking that only you can do." },
      ],
    },
  },
  {
    id: "market",
    name: "The Market Below",
    emoji: "🧺",
    x: 25.8,
    y: 66,
    moduleNumber: 5,
    module: "GenAI and Bias",
    story:
      "Stalls of cloth, bread and tools line the lower mountain. The traders say the codex gets their prices and customs wrong, or leaves them out. “It talks like the people on the hill,” says a baker.",
    idea: "AI can reflect the gaps and slants in the material it learned from, so some people and places end up under-represented.",
    question: {
      prompt: "Why might the codex describe the market so poorly?",
      options: [
        { text: "Most of what it learned from was written by and about people higher up the mountain.", good: true, feedback: "Right. Uneven training material produces uneven answers, without anyone intending it." },
        { text: "Markets are too complicated for it.", good: false, feedback: "It's not about difficulty. It's about what it was given to learn from." },
        { text: "The baker is making it up.", good: false, feedback: "The baker's experience is real. The gap is in what the codex learned from." },
      ],
    },
  },
  {
    id: "scribes-hall",
    name: "The Scribes' Hall",
    emoji: "📜",
    x: 76.7,
    y: 65.3,
    moduleNumber: 6,
    module: "Getting AI to Do What You Want",
    story:
      "A scribe shows you two slips of paper. The first says “Write something.” and brings back a vague paragraph. The second asks for a friendly three-sentence welcome for visiting scholars that mentions the library hours, and brings back something you can actually use.",
    idea: "Vague input leads to vague output. Be specific, then improve the result by trying again with small changes.",
    question: {
      prompt: "Which slip would give the better result?",
      options: [
        { text: "“Write something.”", good: false, feedback: "Too open. The codex has to guess everything: topic, length, tone and audience." },
        { text: "“Write a friendly 3-sentence welcome for visiting scholars that mentions the library hours.”", good: true, feedback: "Yes. It says who it's for, how long it is, the tone and what to include." },
        { text: "“Welcome.”", good: false, feedback: "One word gives it almost nothing to work with." },
      ],
    },
  },
  {
    id: "lake",
    name: "The Great Lake",
    emoji: "💧",
    x: 36.7,
    y: 93,
    moduleNumber: 7,
    module: "GenAI and the Environment",
    story:
      "The lake powers every codex in the kingdom, and the shoreline has crept back. The water is lower than anyone remembers. Every answer the machines print takes power and water to produce.",
    idea: "GenAI has real energy and resource costs behind every answer, so it's worth using with intention.",
    question: {
      prompt: "Which habit uses the codex most thoughtfully?",
      options: [
        { text: "Ask the same thing thirty times to compare the wording.", good: false, feedback: "That multiplies the cost for very little gain. Refine one good question instead." },
        { text: "Think first, ask one clear question, and use it when it truly helps.", good: true, feedback: "Yes. Being intentional saves effort, energy and water." },
        { text: "Ask for fifty pictures just for fun.", good: false, feedback: "Every picture has a cost behind it. Make the ones you need." },
      ],
    },
  },
];

// ── Progress (saved in the browser) ────────────────────────────────────────────
const CITY_KEY = "argonia_city_v1";

export interface CityProgress { found: string[]; answered: string[] }

export function loadCityProgress(): CityProgress {
  try {
    const raw = localStorage.getItem(CITY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      found: Array.isArray(parsed?.found) ? parsed.found : [],
      answered: Array.isArray(parsed?.answered) ? parsed.answered : [],
    };
  } catch {
    return { found: [], answered: [] };
  }
}

export function saveCityProgress(p: CityProgress): void {
  try { localStorage.setItem(CITY_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}
