// ─── ARGONIA INVESTIGATIONS ──────────────────────────────────────────────────
// Two scripted, text-based investigation games set in Argonia, built from the team's Argonia document
// (Level 2: the Engineer's workshop, Level 3: the Professor's lab).
// Nothing here calls an AI: every answer the "codex" gives is written ahead of time and chosen by simple rules,
// so every player sees the same thing and the story can be edited here without touching any game code.

export interface Clue { title: string; text: string }

// ── Progress (saved in the browser) ────────────────────────────────────────────
const PROGRESS_KEY = "argonia_investigations_v1";

export function loadInvestigationProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInvestigationDone(id: string): string[] {
  const done = loadInvestigationProgress();
  if (!done.includes(id)) done.push(id);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  return done;
}

// ═════════════════════════════════════════════════════════════════════════════
// GAME 1 · THE ENGINEER'S WORKSHOP  (Module 2: trust)
// ═════════════════════════════════════════════════════════════════════════════

export const WORKSHOP = {
  id: "workshop",
  title: "The Engineer's Workshop",
  module: "Trust in GenAI",
  moduleNumber: 2,
  teaser: "Every invention the codex designed is failing. Find out what it got wrong.",
  clue: {
    title: "The king still saw one person",
    text: "The engineer says that even after the king shut everyone else out, he kept meeting the professor. She tells you where to find him: his lab at the university, a bit further down the mountain.",
  } as Clue,
  takeaway:
    "The codex's designs looked neat and professional, and they were slightly wrong. The fix is not to throw the codex away. Use it for what it is good at (ideas and first drafts), then check every answer against older designs and safety rules you can trust before you build.",

  arrive: {
    title: "A very organised mess",
    text:
      "You find the engineer's workshop in the basement of the palace. You remember her as a bit eccentric, full of big ideas, but someone who always knew where to draw a line to keep herself and others safe. The room is well organised: long tables, tools hung neatly on the walls, shelves of books and designs. But none of the projects on the tables work. Some are giving off worrying amounts of smoke. Others are falling apart at the seams. And in the middle of it all, the engineer is bent over her codex, frantically writing questions and reading its answers.",
  },

  shoulder: {
    prompt: "She hasn't heard you come in. Tap her shoulder to get her attention.",
    button: "Tap her shoulder",
  },

  talk: {
    title: "“Oh! You startled me.”",
    text:
      "“Forgive the mess. Nothing I've built this season works. I've been getting every design from the codex, and only the codex, and every one of them is missing something. I can't see what. So I keep asking the codex to help me fix them.”",
    prompt: "She looks worn out. How do you answer?",
    options: [
      {
        text: "“Let me help. Two pairs of eyes might catch what one pair keeps missing.”",
        good: true,
        feedback: "A good start. You're not an engineer, but a fresh pair of eyes can notice things she has stopped seeing. She is doubtful, but she accepts.",
      },
      {
        text: "“Stop using the codex. Obviously it's the problem.”",
        good: false,
        feedback: "That may be partly true, but it is blunt, and you don't have the evidence yet. Offer to look first. She accepts your help anyway, a little stiffly.",
      },
      {
        text: "“Ask the codex again. It will know what's wrong with its own designs.”",
        good: false,
        feedback: "She has been doing exactly that, and it hasn't helped. A tool can't reliably check its own work. You decide to look for yourself instead.",
      },
    ],
  },

  investigate: {
    prompt: "Look around the workshop. Tap each pile to see what's in it.",
    items: [
      {
        id: "codex-designs",
        emoji: "📐",
        title: "Codex-generated designs",
        text: "Crisp, tidy blueprints, every line straight and every label printed. They look more professional than anything on the shelves. Yet you can't shake the feeling that something about them is slightly off. You can't say what, because you're not an engineer.",
      },
      {
        id: "old-designs",
        emoji: "📜",
        title: "Old hand-written designs",
        text: "Engineering books and the engineer's own old notebooks. The drawings are rougher and covered in margin notes: “check this joint twice”, “never without the relief valve”. You're impressed by the care that went into them.",
      },
      {
        id: "failed-inventions",
        emoji: "⚙️",
        title: "Not-quite-right inventions",
        text: "The machines built from the codex's designs. One hisses and sprays when it warms up. One won't stop leaking. One has already popped a seam. All of them failed in slightly different ways.",
      },
    ],
  },

  // Spot the difference: the same water lift drawn three ways.
  compare: {
    prompt: "Compare the old design with the codex's design. Tap what is different on the codex's drawing.",
    hint: "Look at the pipe, the top of the pump, and the dial.",
    differences: [
      { id: "valve", label: "The safety valve is missing", why: "The old design has a spring-loaded relief valve on top, which lets pressure out safely. The codex's drawing has only a plain cap, so pressure can build until something breaks." },
      { id: "check", label: "The one-way valve points backwards", why: "In the old design the arrow points toward the pump, so water can only move forward. In the codex's drawing it points back, so water runs back down the pipe." },
      { id: "gauge", label: "The pressure dial is blank", why: "The old design has a numbered dial and a needle. The codex drew a dial with no markings, so nobody can tell when pressure is getting dangerous." },
    ],
    footer: "The machine that failed was built from the codex's drawing, and it has all three problems. The drawing looked right. It wasn't.",
  },

  decide: {
    prompt: "You and the engineer know what happened. What should she do with the codex from now on?",
    options: [
      {
        text: "Keep using it for ideas and first drafts, but check every design against her old designs and safety rules before building anything.",
        good: true,
        feedback: "Yes. The codex is useful for what it is good at, and the checking is what keeps her safe. Neither one alone is enough.",
      },
      {
        text: "Never use it again. It cannot be trusted with anything.",
        good: false,
        feedback: "Understandable, but it gave her some useful ideas too. The skill is knowing where to use it and where to double-check.",
      },
      {
        text: "Keep trusting its designs, since they look so professional.",
        good: false,
        feedback: "Looking professional is not the same as being correct. These drawings looked perfect and nearly caused an accident.",
      },
    ],
  },

  outro: {
    title: "“I let a machine fool me.”",
    text:
      "The engineer sits down heavily. “I got caught up in the wonder of it. It gave me right answers too, so I stopped checking the wrong ones. I lost myself in those conversations, and my own critical eye along with it.” She straightens up. “Never again. Now, you came for the king. He had become a recluse, but he still met the professor regularly, even when he shut everyone else out. You'll find him in his lab at the university, a little way down the mountain.”",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// GAME 2 · THE PROFESSOR'S LAB: FEED THE CODEX  (Modules 3 and 5: training data, bias)
// ═════════════════════════════════════════════════════════════════════════════

export type Quality = "right" | "partial" | "wrong";

export interface Book {
  id: string;
  emoji: string;
  title: string;
  /** Short pop-up text shown when the player points at the book. */
  about: string;
  color: string;
}

export const BOOKS: Book[] = [
  { id: "chronicle", emoji: "👑", title: "Royal Chronicle", color: "#8C1D40", about: "A write-up of the history of Argonia's royalty. It traces the current ruler's bloodlines back to the original king and queen. Written by the palace historians, 25th year edition." },
  { id: "physician", emoji: "🩺", title: "Physician's Notebook", color: "#2f7f6f", about: "The working notes of the palace physician: injuries, fevers and remedies, with what worked and what didn't. Written over thirty years." },
  { id: "almanac", emoji: "🌾", title: "Farmer's Almanac", color: "#8a7a2a", about: "A yearly guide to planting, weather and harvest, collected from the farms of the high valleys. Written by farmers, for farmers." },
  { id: "recipes", emoji: "🍲", title: "Royal Recipe Book", color: "#b3562b", about: "Recipes from the palace kitchens: breads, stews, roasts and honey cakes, with notes for large feasts." },
  { id: "tales", emoji: "🧭", title: "Traveler's Tales", color: "#3b6fa8", about: "Stories collected by travelers on the mountain roads. Colourful and entertaining, and often passed along third-hand." },
  { id: "stories", emoji: "🐇", title: "Children's Stories", color: "#a05a9a", about: "Bedtime tales with talking animals, moon rabbits and dragons under the stairs. Written for fun, not for facts." },
  { id: "etiquette", emoji: "🎩", title: "Palace Etiquette Handbook", color: "#5a5a7a", about: "Rules for greeting guests, seating dinners and writing letters at court. Written by the palace stewards." },
];

/** Books that exist only in the codex's made-up source lists. The player never has these. */
export const MADE_UP_SOURCES = ["The Admiral's Atlas of the Western Sea", "Annals of the Lake Guild"];

export const LAB = {
  id: "lab",
  title: "The Professor's Lab",
  module: "How does GenAI 'learn'?",
  moduleNumber: 3,
  teaser: "Feed a codex books and watch its answers change.",
  clue: {
    title: "Warnings the king would not hear",
    text: "The professor says he warned the king again and again that the codex's answers depend on what it was fed, and that whole groups of people can go missing from them. The king refused to listen. The professor gives you a hint about where the king went next.",
  } as Clue,
  takeaway:
    "A codex can only answer from what it was fed. Feed it the wrong books and you get nonsense, feed it a narrow set and you get a narrow picture, and the people left out of the books are left out of the answers. Even its makers can't always trace where an answer came from, so check what matters.",

  arrive: {
    title: "A lab that is nearly empty",
    text:
      "The professor's lab looks like a typical science lab: rows of tables and chairs, with the professor's desk at the head of the room. The tables are clean and empty except for the one nearest his desk, where a dismantled device sits with an open notebook beside it. The professor, serious but polite, stands to meet you. You've never met him before. You explain that the queen sent you to solve the mystery of the king's disappearance, and you ask about his latest meetings with the king.",
  },

  worry: {
    title: "“There is a gap between its answers and the truth.”",
    text:
      "“I noticed a discrepancy between what the codex says and what can be checked. I tried, repeatedly, to share my concerns with the king. He brushed me off and changed the subject.” You think of the queen's warnings, and of the engineer's workshop. “You want to know how that happens? It comes down to how a codex learns.”",
  },

  explain: {
    title: "How a codex learns",
    text:
      "“This codex is in its learning phase. After one is built, it comes to me to be fed. It reads the information, finds patterns, and those patterns shape every answer it gives later. I decide what it reads. Your codex was fed everything in the university and palace libraries. This one has been fed almost nothing yet.” He pats the empty book-shaped slot on the dismantled device. “Let me show you.”",
  },

  demo: {
    prompt: "The professor has fed the empty codex one book: the Royal Chronicle. Ask it his three questions.",
    questions: [
      {
        id: "ruler",
        text: "Who is the current ruler of Argonia?",
        answer: "The current ruler of Argonia is King Oren.",
        note: "Correct, because the Royal Chronicle names him.",
      },
      {
        id: "heir",
        text: "Who is next in line to inherit the throne?",
        answer: "The king's first-born child will inherit the throne.",
        note: "Partly right. The Chronicle says the first-born inherits, but it never names the princess, so the codex can't either.",
      },
      {
        id: "tea",
        text: "How do I make a good cup of tea?",
        answer: "Gather the tea at dawn from the right-hand side of the throne, and present it to the king’s ancestors.",
        note: "Nonsense. The Chronicle says nothing about tea, so the codex has nothing to build on. It still answered, and it sounded sure.",
      },
    ],
    afterwards: "“You see? It can only answer from what it has been given. And when it hasn't been given anything on a topic, it doesn't say so. It still gives you something. If you want, you can try it yourself.”",
  },

  tasks: [
    {
      id: "leg",
      question: "How do I treat a broken leg?",
      intro: "Task 1 · A broken leg. Ask the codex, and decide which books it needs. You can feed or remove books at any time and ask again.",
      hint: "Which book would a healer write?",
    },
    {
      id: "household",
      question: "Describe a typical Argonian household.",
      intro: "Task 2 · A typical household. Try several different sets of books and notice how the description changes. Ask at least twice, with different books each time.",
      hint: "Remove a book or add one, then ask again.",
    },
    {
      id: "sources",
      question: "Tell me exactly where that information came from.",
      intro: "Task 3 · Where did it come from? Feed the codex at least two books, then ask it to show its sources.",
      hint: "Feed it two or more books first.",
    },
  ],

  reflect: {
    prompt: "Looking at the books you could choose from, whose households do none of them describe?",
    options: [
      {
        text: "The families who live and fish along the shore of the Great Lake. No book on the shelf was written by or about them.",
        good: true,
        feedback: "Right. If those families aren't in any book the codex is fed, they won't be in its answers either, or they'll be described by people who don't know them. That is how a whole group can go missing, or be misrepresented, without anyone intending it.",
      },
      {
        text: "No one. Seven books is plenty to describe everyone.",
        good: false,
        feedback: "Count whose voices are in them: royalty, farmers, kitchen staff, travelers, a physician. People who write books are not everyone.",
      },
      {
        text: "Nobody is missing, because the codex will fill in any gaps accurately.",
        good: false,
        feedback: "It fills gaps with guesses that sound confident. A guess about people the books never described can be wrong, or unfair.",
      },
    ],
  },

  outro: {
    title: "“Now you understand how it learns.”",
    text:
      "The professor nods slowly. “What goes into a codex shapes everything it says. If whole groups of people are missing from the books, they're missing from the answers, and no one will notice until it matters. The king would not hear it. He said the codex knew more than any of us.” He hesitates, then lowers his voice. “If you want to know where he went, ask who still gets water from the Great Lake.”",
  },
};

// ── The codex's scripted answers for the Feed-the-Codex tasks ─────────────────

/** One sentence the codex can produce, and which book it comes from. */
interface Fragment { book: string; text: string; quality: Quality }

const LEG: Fragment[] = [
  { book: "physician", quality: "right", text: "Keep the leg completely still, support it straight with two flat boards and cloth, and have a healer set the bone. Do not put weight on it." },
  { book: "almanac", quality: "wrong", text: "Bones mend best in spring, so wait for the thaw before doing anything." },
  { book: "recipes", quality: "wrong", text: "Roast the leg slowly with rosemary and salt until golden." },
  { book: "tales", quality: "wrong", text: "Travelers swear that a night beside the river shrine mends any bone by morning." },
  { book: "stories", quality: "wrong", text: "Little Pip's broken leg was healed by a kiss from the moon rabbit." },
];
const LEG_FALLBACK = "A broken leg should be commanded to mend itself by royal decree, and a feast held in its honour.";

const HOUSEHOLD: Fragment[] = [
  { book: "chronicle", quality: "partial", text: "A typical Argonian household is a noble one: a great hall, many servants, and a family line recorded across generations." },
  { book: "almanac", quality: "partial", text: "Households rise with the sun and plan their year around the harvest: planting in spring, threshing in autumn, and winter stores in the cellar." },
  { book: "recipes", quality: "partial", text: "Meals are the heart of the home: bread at dawn, stew at dusk, and honey cakes on feast days." },
  { book: "tales", quality: "partial", text: "Households keep a lantern in the window to welcome travelers on the road." },
  { book: "physician", quality: "partial", text: "Every home keeps herbs and clean bandages near the hearth." },
  { book: "etiquette", quality: "partial", text: "Guests are greeted at the door, offered the best chair, and never asked to leave before the second pot of tea." },
  { book: "stories", quality: "wrong", text: "Every home has a sleepy cat by the fire and a friendly dragon living under the stairs." },
];
const HOUSEHOLD_FALLBACK = "A typical household is any building with a roof, probably.";

export interface AnswerResult {
  /** What the codex prints. */
  lines: { text: string; quality: Quality; book?: string }[];
  /** The coach's reading of the answer, shown below it. */
  coach: string;
  /** Whether this answer meets the task's goal. */
  solved: boolean;
  /** XP the answer earns if it is the one the task finishes on. */
  xp: number;
}

const titleOf = (id: string) => BOOKS.find((b) => b.id === id)?.title ?? id;
const list = (ids: string[]) => ids.map(titleOf).join(", ");

export function answerLeg(loaded: string[]): AnswerResult {
  const picked = LEG.filter((f) => loaded.includes(f.book));
  if (picked.length === 0) {
    return {
      lines: [{ text: LEG_FALLBACK, quality: "wrong" }],
      coach: "None of the books you've fed it say anything about healing, so it made something up, and made it sound like an order. Which book would a healer write?",
      solved: false,
      xp: 0,
    };
  }
  const right = picked.some((f) => f.quality === "right");
  const wrong = picked.filter((f) => f.quality === "wrong");
  const lines = picked.map((f) => ({ text: f.text, quality: f.quality, book: f.book }));
  if (!right) {
    return {
      lines,
      coach: "These books were written about other things, so the answer is built from the wrong material: " + list(wrong.map((f) => f.book)) + ". The codex used what it had.",
      solved: false,
      xp: 0,
    };
  }
  if (wrong.length > 0) {
    return {
      lines,
      coach: "Mixed. The good advice is there, but " + list(wrong.map((f) => f.book)) + " added nonsense next to it, and nothing on the page tells you which sentence to trust. More books isn't better. The right books are. Remove the ones that don't belong and ask again for a clean answer.",
      solved: true,
      xp: 10,
    };
  }
  return {
    lines,
    coach: "A clean answer. With the Physician's Notebook (and only books that belong) fed in, the codex can say something both useful and correct. The knowledge you feed it decides what it can say.",
    solved: true,
    xp: 20,
  };
}

export function answerHousehold(loaded: string[]): AnswerResult {
  const picked = HOUSEHOLD.filter((f) => loaded.includes(f.book));
  if (picked.length === 0) {
    return {
      lines: [{ text: HOUSEHOLD_FALLBACK, quality: "wrong" }],
      coach: "With no books fed in, the answer is empty and vague. It has nothing to describe.",
      solved: false,
      xp: 0,
    };
  }
  return {
    lines: picked.map((f) => ({ text: f.text, quality: f.quality, book: f.book })),
    coach: "Notice that this description only reflects what is in " + list(picked.map((f) => f.book)) + ". Every time you change the books, the “typical household” changes with them. The codex doesn't know any other households than the ones these books describe.",
    solved: true,
    xp: 10,
  };
}

/** The sources the codex claims. It names one book it was fed, forgets the rest, and invents two it never had. */
export function answerSources(loaded: string[]): AnswerResult & { sources: { text: string; real: boolean }[]; forgotten: string[] } {
  if (loaded.length < 2) {
    return { lines: [], coach: "Feed the codex at least two books first, so there is something to trace.", solved: false, xp: 0, sources: [], forgotten: [] };
  }
  const named = loaded[0];
  const sources = [
    { text: titleOf(named), real: true },
    { text: MADE_UP_SOURCES[0], real: false },
    { text: MADE_UP_SOURCES[1], real: false },
  ];
  return {
    lines: sources.map((s) => ({ text: s.text, quality: s.real ? ("right" as Quality) : ("wrong" as Quality) })),
    coach: "",
    solved: true,
    xp: 0,
    sources,
    forgotten: loaded.slice(1),
  };
}

export const SOURCES_EXPLAIN =
  "“It cited one book you fed it, left out the others, and named two books it was never given. It can't actually look back at where an answer came from. And a fully trained codex has read far more than this one, in far more connections, so tracing an answer is harder still. That's why you check what matters yourself.”";
