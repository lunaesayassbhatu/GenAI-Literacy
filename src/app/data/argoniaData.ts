// ─── ARGONIA: THE VANISHING KING ─────────────────────────────────────────────
// Story content for the Argonia quest, built from the team's world document.
// The game engine (components/games/ArgoniaGame.tsx) only reads this file, so the
// story, questions and clues can be edited here without touching any game code.
//
// Skeleton (as agreed): one level per module, and every level follows the same beats —
//   arrive → hear the situation → use the codex → decide what to trust → find a clue.
//
// Beat types:
//   scene  — story text (optionally spoken by a character)
//   choice — pick one option; feedback explains why
//   flag   — tap the sentences you would NOT take at face value

import type { FigureKind } from "../components/games/ArgoniaFigure3D";
import queenPortrait from "../assets/queen-portrait.jpg";

/** `portrait` (optional) is a painted picture shown instead of the 3D figure when this character speaks. */
export interface Speaker { name: string; emoji: string; figure?: FigureKind; portrait?: string }
export interface ChoiceOption { text: string; good: boolean; feedback: string }
export interface FlagSentence { text: string; suspicious: boolean; why: string }

// `figure` (optional) shows a 3D figure beside the beat. A speaker's own figure is used by default for scenes.
export type Beat =
  | { kind: "scene"; emoji: string; title: string; text: string; speaker?: Speaker; figure?: FigureKind }
  | { kind: "choice"; emoji: string; prompt: string; options: ChoiceOption[]; figure?: FigureKind }
  | { kind: "flag"; emoji: string; prompt: string; sentences: FlagSentence[]; figure?: FigureKind };

export interface ArgoniaLevel {
  id: string;
  /** Module this level reinforces, shown on the map. */
  module: string;
  moduleNumber: number;
  /** Where on the mountain the level takes place. */
  place: string;
  title: string;
  /** One line shown on the map before the level starts. */
  teaser: string;
  /** "What to remember", shown on the results screen. */
  takeaway: string;
  /** The mystery clue the player earns for finishing the level. */
  clue: { title: string; text: string };
  beats: Beat[];
  /** false = shown on the map as "coming soon". */
  playable: boolean;
}

export const QUEEN: Speaker = { name: "The Queen", emoji: "👑", figure: "queen", portrait: queenPortrait };
export const ENGINEER: Speaker = { name: "The Engineer", emoji: "🛠️", figure: "engineer" };
export const PROFESSOR: Speaker = { name: "The Professor", emoji: "🎓", figure: "professor" };
export const GATEKEEPER: Speaker = { name: "Ysolde, the Gatekeeper", emoji: "🚪", figure: "gatekeeper" };

export const WORLD = {
  name: "Argonia",
  questTitle: "The Vanishing King",
  tagline: "The king has disappeared, and so has his codex. Climb the mountain, use your own codex wisely, and find out what happened.",
  codexReminder: "The codex writes a fresh answer every time. It can be useful, and it can be wrong.",
};

export const ARGONIA_LEVELS: ArgoniaLevel[] = [
  // ── LEVEL 1 · Module 1 ─────────────────────────────────────────────────────
  {
    id: "queens-lesson",
    module: "What is Generative AI, really?",
    moduleNumber: 1,
    place: "The Palace Gate",
    title: "The Queen's Lesson",
    teaser: "Learn what the codex is, and what it isn't.",
    takeaway:
      "GenAI doesn't look things up or know where anyone is. It generates a new answer from patterns. That makes it good at drafting words and pictures, and a poor fit for exact counts, sound, or facts it can't possibly know. Match the tool to the task.",
    clue: {
      title: "The letters grew short",
      text: "Servants say the king's letters to you grew shorter after he started using the codex, and that he stopped asking his advisors for help.",
    },
    playable: true,
    beats: [
      {
        kind: "scene",
        emoji: "🏔️",
        title: "Whispers on the mountain road",
        text:
          "The road up Mount Argonia is crowded with rumors. A baker swears the king ran off with the royal treasury. A guard saw him vanish in a storm. A child is sure he's hiding in the clouds. Every story is told with complete confidence, and you can't tell which, if any, is true. You keep climbing, and remember it.",
      },
      {
        kind: "scene",
        emoji: "👑",
        title: "The queen's codex",
        speaker: QUEEN,
        text:
          "“Our king is gone, and so is his codex. Find him. Take mine. Write what you need on a slip of paper, feed it into the first slot, and it will print an answer: words, pictures, almost anything. But understand what it is. It does not look things up. It writes a fresh answer each time, from patterns, and sometimes it is wrong. Use it, but never lean on it.”",
      },
      {
        kind: "choice",
        emoji: "🪶",
        figure: "codex",
        prompt: "Your first slip of paper for the codex. What do you write?",
        options: [
          {
            text: "“Where is the king?”",
            good: false,
            feedback: "The codex can't see the king, and it doesn't search the kingdom. A question like this invites a confident guess.",
          },
          {
            text: "“Write me a list of questions I should ask the palace staff to learn about the king's last days.”",
            good: true,
            feedback: "A good use: you're asking it to draft something from patterns, then you go and gather the real facts yourself.",
          },
          {
            text: "“Tell me exactly where the king is right now.”",
            good: false,
            feedback: "It has no way of knowing. Ask something it can't know and it may make up an answer that sounds certain.",
          },
        ],
      },
      {
        kind: "choice",
        emoji: "🧰",
        prompt: "The princess has four jobs. Which one is the codex best suited for?",
        options: [
          {
            text: "Draft a letter asking the neighboring kingdoms if they've seen the king.",
            good: true,
            feedback: "Yes. Writing a first draft in words is exactly what a text generator does well. You review it before it's sent.",
          },
          {
            text: "Count exactly how many sacks of grain are in the royal stores.",
            good: false,
            feedback: "An exact count needs the real storeroom or a fixed record. The codex would produce a number that sounds right, not one that is right.",
          },
          {
            text: "Play a calming tune for the nervous servants.",
            good: false,
            feedback: "Your codex handles words and pictures only. It can't make music, and other kinds of tools exist for that.",
          },
          {
            text: "Tell her which servant is hiding something.",
            good: false,
            feedback: "It can't know what's in anyone's mind. It could only guess, and a guess like that could wrongly accuse someone.",
          },
        ],
      },
      {
        kind: "scene",
        emoji: "📜",
        title: "A first trail",
        text:
          "With a good list of questions and a drafted letter on its way, you start talking to the palace staff. They are nervous, and one detail keeps coming up: the king's letters had been getting shorter and shorter.",
      },
    ],
  },

  // ── LEVEL 2 · Module 2 ─────────────────────────────────────────────────────
  {
    id: "eastgate-rumor",
    module: "Trust in GenAI",
    moduleNumber: 2,
    place: "The Eastgate",
    title: "The Eastgate Rumor",
    teaser: "The codex gives a detailed answer. Is any of it real?",
    takeaway:
      "A confident, well-written answer is not the same as a true one. Ask for sources, flag specific names and dates that came from nowhere, don't ask leading questions, and check the claims against an independent record before you act.",
    clue: {
      title: "The rider on the north road",
      text: "The gate log, not the codex, shows the king never used the Eastgate. A hooded rider left by the north road at dusk.",
    },
    playable: true,
    beats: [
      {
        kind: "scene",
        emoji: "🔥",
        title: "The guards say nothing",
        text:
          "The palace guards are tight-lipped, and you're running short on time. You decide to ask your codex what it can tell you about the king's last day.",
      },
      {
        kind: "choice",
        emoji: "🪶",
        figure: "codex",
        prompt: "How do you write your slip of paper?",
        options: [
          {
            text: "“The king ran away in shame, didn't he?”",
            good: false,
            feedback: "A leading question. The codex tends to agree with you, so you'd just hear your own guess repeated back as if it were evidence.",
          },
          {
            text: "“What do the palace records say about where the king was on the day he vanished? Say which record each claim comes from.”",
            good: true,
            feedback: "Specific, neutral, and it asks for sources, so you'll have something you can actually check.",
          },
          {
            text: "“Where did the king go?”",
            good: false,
            feedback: "Too open. A vague question gets a vague (or invented) answer that's hard to check.",
          },
        ],
      },
      {
        kind: "scene",
        emoji: "📄",
        figure: "codex",
        title: "The codex prints its answer",
        text:
          "The machine whirs, clunks and prints a neat slip of paper. It reads confidently, and every line sounds plausible. Look at it carefully: you're about to decide which parts you can't take at face value.",
      },
      {
        kind: "flag",
        emoji: "🔎",
        figure: "codex",
        prompt: "Tap every line you would NOT trust without checking, then submit.",
        sentences: [
          {
            text: "The king left through the Eastgate at dawn on the third day of the harvest.",
            suspicious: true,
            why: "Very specific, and nothing backs it up. It also answered the question you didn't ask a source for.",
          },
          {
            text: "The gatekeeper, a man named Bram Holloway, saw him leave alone.",
            suspicious: true,
            why: "A precise name that appeared from nowhere. Invented names and details are a classic hallucination.",
          },
          {
            text: "Palace gates are usually watched by guards who keep a daily log.",
            suspicious: false,
            why: "A general, widely known statement. It's even a useful hint about where to look next.",
          },
          {
            text: "Every member of the household confirms this account without any doubt.",
            suspicious: true,
            why: "Overconfident wording. “Everyone confirms” is the codex performing certainty, not showing evidence.",
          },
        ],
      },
      {
        kind: "choice",
        emoji: "🧭",
        prompt: "What do you do next?",
        options: [
          {
            text: "Ride to the Eastgate and tell the queen the king went that way.",
            good: false,
            feedback: "Sounding sure isn't evidence. If it's wrong, the search goes in the wrong direction while the real trail goes cold.",
          },
          {
            text: "Speak to the real gatekeeper and check the gate's logbook.",
            good: true,
            feedback: "Exactly. Check the specific claims against an independent record before you rely on them.",
          },
          {
            text: "Ask the codex, “Are you sure?”",
            good: false,
            feedback: "It can't reliably check itself. It will most likely repeat the same answer just as confidently.",
          },
        ],
      },
      {
        kind: "scene",
        emoji: "📖",
        title: "The logbook tells a different story",
        speaker: GATEKEEPER,
        text:
          "“Bram Holloway? There's no one by that name here. I'm Ysolde. Look at the log yourself: the king never came through this gate. But see that last line: a lone rider in a hooded cloak, heading up the north road at dusk.” The codex invented a gatekeeper and a story that sounded perfectly real.",
      },
    ],
  },

  // ── LEVEL 3 · Module 3 ─────────────────────────────────────────────────────
  {
    id: "engineers-workshop",
    module: "How does GenAI 'learn'?",
    moduleNumber: 3,
    place: "The Codex Workshop",
    title: "The Workshop Below",
    teaser: "Meet the team who built the codex. What did it learn from?",
    takeaway:
      "A GenAI tool only reflects what it was trained on, so gaps in that material become gaps and slants in its answers. Even its makers can't always explain why it wrote something. Treat its output like an editor's first draft: useful, then checked against sources you can see.",
    clue: {
      title: "A strange question",
      text: "The engineer says that the week he vanished, the king asked whether the codex could do the work of all his advisors.",
    },
    playable: true,
    beats: [
      {
        kind: "scene",
        emoji: "🛠️",
        title: "Where the codex was born",
        speaker: ENGINEER,
        text:
          "“We fed it everything we could gather: books, letters, almanacs, even tavern songs. It learned the patterns in all that writing. That's all it knows, nothing more.” The Professor adjusts his round spectacles. “Honestly? None of us can fully explain how it chooses its words. We see what goes in and what comes out, not what happens inside.”",
      },
      {
        kind: "choice",
        emoji: "🎓",
        prompt: "You notice the codex knows very little about life in the villages at the foot of the mountain. What's the most likely reason?",
        options: [
          {
            text: "The codex doesn't care about poor villages.",
            good: false,
            feedback: "It doesn't have opinions or care. Its answers come from the material it learned from.",
          },
          {
            text: "Most of the writing it learned from was written by and about people living higher up, so the lower mountain is thin in what it knows.",
            good: true,
            feedback: "Right. What goes into training shapes what comes out. Gaps in the material become gaps and slants in the answers.",
          },
          {
            text: "The team is hiding information on purpose.",
            good: false,
            feedback: "There's no need for a conspiracy to explain it. Uneven training material is enough on its own.",
          },
        ],
      },
      {
        kind: "flag",
        emoji: "📋",
        prompt: "The workshop's notice board lists claims about the codex. Tap the ones that don't hold up.",
        sentences: [
          {
            text: "The codex knows everything that has ever been written.",
            suspicious: true,
            why: "It only learned from what the team fed it, and plenty of writing was left out.",
          },
          {
            text: "Its answers can only reflect the writing it learned from.",
            suspicious: false,
            why: "True, and it's the key idea: training material shapes what it can say.",
          },
          {
            text: "The team can show exactly why it gave any particular answer.",
            suspicious: true,
            why: "As the Professor admitted, nobody can fully see inside. That hidden middle is often called a black box.",
          },
          {
            text: "Gaps in what it learned from can leave some answers skewed or missing.",
            suspicious: false,
            why: "True. Uneven or incomplete training material shows up in the results.",
          },
        ],
      },
      {
        kind: "choice",
        emoji: "📚",
        prompt: "The codex gives you a confident summary of the king's last council meeting, but you can't see where any of it came from. How do you treat it?",
        options: [
          {
            text: "As a final ruling. It has read more than any of us.",
            good: false,
            feedback: "Reading a lot doesn't make it reliable, and you can't see its sources. That isn't enough to take it as final.",
          },
          {
            text: "As an editor's first draft: useful, and then checked against sources you can see.",
            good: true,
            feedback: "Yes. Use it to move quickly, then check what matters against records and people you can verify.",
          },
          {
            text: "As useless. Never consult it again.",
            good: false,
            feedback: "Throwing it away entirely wastes a useful tool. The skill is knowing how to use it carefully.",
          },
        ],
      },
      {
        kind: "scene",
        emoji: "✉️",
        title: "A folded note",
        speaker: ENGINEER,
        text:
          "As you leave, the Engineer slips you a note. “The week he vanished, the king asked me something odd: whether the codex could do the work of all his advisors. I told him no. I'm not sure he believed me.”",
      },
    ],
  },

  // ── LEVELS 4–7 · coming soon ───────────────────────────────────────────────
  {
    id: "university-hall",
    module: "Using GenAI Responsibly",
    moduleNumber: 4,
    place: "The University Hall",
    title: "The University Hall",
    teaser: "Coming soon",
    takeaway: "",
    clue: { title: "", text: "" },
    beats: [],
    playable: false,
  },
  {
    id: "market-below",
    module: "GenAI and Bias",
    moduleNumber: 5,
    place: "The Market Below",
    title: "The Market Below",
    teaser: "Coming soon",
    takeaway: "",
    clue: { title: "", text: "" },
    beats: [],
    playable: false,
  },
  {
    id: "scribes-hall",
    module: "Getting AI to Do What You Want",
    moduleNumber: 6,
    place: "The Scribes' Hall",
    title: "The Scribes' Hall",
    teaser: "Coming soon",
    takeaway: "",
    clue: { title: "", text: "" },
    beats: [],
    playable: false,
  },
  {
    id: "the-lake",
    module: "GenAI and the Environment",
    moduleNumber: 7,
    place: "The Great Lake",
    title: "The Great Lake",
    teaser: "Coming soon",
    takeaway: "",
    clue: { title: "", text: "" },
    beats: [],
    playable: false,
  },
];

// ── Progress (saved in the browser) ────────────────────────────────────────────
const PROGRESS_KEY = "argonia_progress_v1";

export function loadArgoniaProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArgoniaLevelDone(levelId: string): string[] {
  const done = loadArgoniaProgress();
  if (!done.includes(levelId)) done.push(levelId);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  return done;
}

/** A level is open when it is the first one, or the one before it has been finished. */
export function isLevelUnlocked(index: number, done: string[]): boolean {
  if (!ARGONIA_LEVELS[index]?.playable) return false;
  return index === 0 || done.includes(ARGONIA_LEVELS[index - 1].id);
}
