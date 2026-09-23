// ─── Game 1: AI Ethics Matching ────────────────────────────────────────────

export interface EthicsPair {
  id: string;
  scenario: string;
  concern: string;
}

export const ETHICS_PAIRS: EthicsPair[] = [
  {
    id: "a",
    scenario: "AI writes your homework essay",
    concern: "Academic honesty concern",
  },
  {
    id: "b",
    scenario: "AI recommends only one news source",
    concern: "Bias / echo chamber concern",
  },
  {
    id: "c",
    scenario: "An app tracks your location 24/7 using AI",
    concern: "Privacy concern",
  },
  {
    id: "d",
    scenario: "AI generates fake celebrity photos",
    concern: "Misinformation concern",
  },
];

// ─── Game 2: Fact or Myth ────────────────────────────────────────────────────

export interface Statement {
  text: string;
  isFact: boolean;
  why: string;
}

export const STATEMENTS: Statement[] = [
  // FACTS
  {
    text: "AI generates content — it doesn't search the web",
    isFact: true,
    why: "GenAI predicts responses from patterns, not live searches.",
  },
  {
    text: "AI can completely make up facts that sound real",
    isFact: true,
    why: "Called a hallucination — AI sounds confident even when wrong.",
  },
  {
    text: "AI has a cutoff date and can't know recent events",
    isFact: true,
    why: "Models are trained on data up to a certain date only.",
  },
  {
    text: "A vague prompt gets a vague answer",
    isFact: true,
    why: "AI only works with what you give it. Context = better output.",
  },
  {
    text: "AI outputs can reflect bias from training data",
    isFact: true,
    why: "Biased training data produces biased outputs — unintentionally.",
  },
  {
    text: "Well-written AI text doesn't mean it's accurate",
    isFact: true,
    why: "Fluency and correctness are completely separate things.",
  },
  {
    text: "AI citations can be completely fabricated",
    isFact: true,
    why: "AI can invent a source name, author, and year that don't exist.",
  },
  {
    text: "You're responsible for anything you submit using AI",
    isFact: true,
    why: "AI doesn't take accountability. Whatever you hand in is on you.",
  },
  {
    text: "AI literacy doesn't require coding skills",
    isFact: true,
    why: "It's a critical thinking skill, not a technical one.",
  },
  {
    text: "Refining your prompt beats starting over from scratch",
    isFact: true,
    why: "Tell AI what was wrong — it gives it more to work with.",
  },
  // MYTHS
  {
    text: "AI searches the internet to answer your questions",
    isFact: false,
    why: "Most GenAI generates from training patterns, not live retrieval.",
  },
  {
    text: "If AI sounds confident, it must be correct",
    isFact: false,
    why: "AI sounds equally confident whether right or completely wrong.",
  },
  {
    text: "AI is completely neutral and unbiased",
    isFact: false,
    why: "AI inherits every bias present in its training data.",
  },
  {
    text: "AI citations always come from real sources",
    isFact: false,
    why: "Citations can be hallucinated — believable and entirely fake.",
  },
  {
    text: "Only tech people need to understand AI",
    isFact: false,
    why: "AI affects everyone. Critical thinking about it is universal.",
  },
  {
    text: "AI truly understands what you mean when you type",
    isFact: false,
    why: "AI predicts likely words — it has no real understanding of intent.",
  },
  {
    text: "Longer prompts always produce better results",
    isFact: false,
    why: "Specificity matters more than length.",
  },
  {
    text: "You can fully trust AI for medical or legal advice",
    isFact: false,
    why: "High-stakes areas where AI errors have the worst consequences.",
  },
];

// ─── Game 5: AI Bias Matching ────────────────────────────────────────────────

export const BIAS_PAIRS: EthicsPair[] = [
  {
    id: "a",
    scenario: "An AI writing tool defaults to male names for \"doctor\" and female names for \"nurse\"",
    concern: "Gender bias baked into training data",
  },
  {
    id: "b",
    scenario: "A resume-screening AI ranks candidates differently based on names that sound a certain ethnicity",
    concern: "Racial bias in training data",
  },
  {
    id: "c",
    scenario: "An AI tutor gives shorter, less detailed answers to messages written in non-standard English",
    concern: "Language and dialect bias",
  },
  {
    id: "d",
    scenario: "An AI image generator shows mostly Western clothing and settings for \"a typical wedding\"",
    concern: "Cultural representation bias",
  },
];

// ─── Game 6: Black Box Matching ──────────────────────────────────────────────

export const BLACKBOX_PAIRS: EthicsPair[] = [
  {
    id: "a",
    scenario: "AI cites a study with a specific author, journal, and year",
    concern: "Could be a fabricated citation — verify independently",
  },
  {
    id: "b",
    scenario: "You ask AI to explain why it gave that particular answer",
    concern: "Not fully possible — the reasoning is a black box",
  },
  {
    id: "c",
    scenario: "AI answers a question about an event from last week",
    concern: "May be unreliable — check its training data cutoff",
  },
  {
    id: "d",
    scenario: "AI gives a long, confident, fluent answer",
    concern: "Confidence and fluency are not proof of accuracy",
  },
];

// ─── Game 7: Environmental Impact: Fact or Myth ─────────────────────────────

export const ENV_STATEMENTS: Statement[] = [
  {
    text: "Training a large AI model can emit as much carbon as several transatlantic flights",
    isFact: true,
    why: "Large-scale training runs consume massive amounts of compute and energy.",
  },
  {
    text: "Data centers use water to cool the servers that run GenAI tools",
    isFact: true,
    why: "Cooling systems for AI infrastructure require significant water resources.",
  },
  {
    text: "Every single AI query adds a small amount to ongoing energy use",
    isFact: true,
    why: "Usage at scale — not just training — is a real, ongoing cost.",
  },
  {
    text: "Environmental impact scales with how many people use a tool, not just how it was built",
    isFact: true,
    why: "Millions of everyday queries add up on top of the initial training cost.",
  },
  {
    text: "Typing into a chatbox has basically zero environmental impact",
    isFact: false,
    why: "It feels weightless, but it's backed by real energy and water use at a data center.",
  },
  {
    text: "Only training a model has an environmental cost — everyday use afterward is free",
    isFact: false,
    why: "Ongoing use at scale adds up just as much as training, if not more.",
  },
  {
    text: "AI companies have fully solved the energy and water cost of running these tools",
    isFact: false,
    why: "The cost is real, growing with adoption, and not yet fully solved.",
  },
  {
    text: "The environmental cost is the same no matter how many people use a tool",
    isFact: false,
    why: "Impact scales with usage — more queries means more energy and water used.",
  },
];

// ─── Game 3: Build-a-Prompt ──────────────────────────────────────────────────

export interface PromptPiece {
  id: string;
  text: string;
  required: boolean;
}

export interface BuildScenario {
  id: string;
  goal: string;
  pieces: PromptPiece[];
  outputs: Record<number, string>;
}

export const BUILD_SCENARIOS: BuildScenario[] = [
  {
    id: "bedtime",
    goal: "Get AI to write a bedtime story for a 5-year-old",
    pieces: [
      { id: "p1", text: "Write a story", required: true },
      { id: "p2", text: "for a 5-year-old", required: true },
      { id: "p3", text: "about a sleepy dragon", required: false },
      { id: "p4", text: "Keep it short (3 sentences)", required: true },
      { id: "p5", text: "Use simple words", required: true },
      { id: "p6", text: "End with the dragon falling asleep", required: false },
    ],
    outputs: {
      0: "Sure! Here's a story.",
      1: "Sure! Here's a short story for a 5-year-old.",
      2: "Once upon a time, there was a sleepy dragon...",
      3: "Once there was a sleepy dragon. He yawned and yawned. Then he curled up and went to sleep.",
      4: "Once there was a sleepy dragon. He felt very tired. He closed his eyes and slept.",
      5: "Once there was a sleepy dragon who could not stay awake. His eyes drooped as the stars came out. He curled up, gave one last big yawn, and fell fast asleep.",
      6: "Once there was a sleepy dragon who could not stay awake. His eyes drooped as the stars came out. He curled up, gave one last big yawn, and fell fast asleep.",
    },
  },
  {
    id: "apology",
    goal: "Get AI to write an apology message to a friend",
    pieces: [
      { id: "p1", text: "Write an apology", required: true },
      { id: "p2", text: "to my best friend", required: true },
      { id: "p3", text: "for forgetting their birthday", required: true },
      { id: "p4", text: "Keep it warm and casual", required: true },
      { id: "p5", text: "Not too long — 3 sentences", required: false },
      { id: "p6", text: "Don't make it sound dramatic", required: false },
    ],
    outputs: {
      0: "I'm sorry.",
      1: "I'm sorry, I made a mistake.",
      2: "Hey, I'm really sorry for what happened.",
      3: "Hey, I'm so sorry I forgot your birthday — that was really thoughtless of me. I hope you know how much I value our friendship. Can I make it up to you?",
      4: "Hey, I'm so sorry I forgot your birthday! That's so unlike me and I feel terrible. You mean a lot to me — can we celebrate late?",
      5: "Hey, I'm so sorry I missed your birthday — that was totally on me. You're one of my favorite people and you deserved better. Let me make it up to you soon!",
      6: "Hey, I'm so sorry I missed your birthday — that was totally on me. You're one of my favorite people and you deserved better. Let me make it up to you soon!",
    },
  },
];

// ─── Game 4: Prompt Sandbox ──────────────────────────────────────────────────

export interface CheckItem {
  keywords: string[];
  label: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  checks: {
    audience: CheckItem;
    topic: CheckItem;
    format: CheckItem;
  };
  examplePrompt: string;
  why: string;
}

export const MISSIONS: Mission[] = [
  {
    id: "hallucination",
    title: "Explain AI hallucination",
    description:
      'Get AI to explain what "hallucination" means in AI — for a 10-year-old. No jargon.',
    checks: {
      audience: {
        keywords: ["kid", "child", "10", "year", "young", "simple", "easy", "beginner"],
        label: "Specified the audience",
      },
      topic: {
        keywords: ["hallucin", "made up", "make up", "wrong", "false", "invent"],
        label: "Mentioned the topic clearly",
      },
      format: {
        keywords: ["example", "like", "short", "explain", "simple", "plain"],
        label: "Asked for a simple format or example",
      },
    },
    examplePrompt:
      'Explain what "hallucination" means in AI in 2–3 sentences. Use simple words a 10-year-old would understand. Give one everyday example.',
    why: "A good prompt tells AI who it's talking to, what to explain, and how to format the response.",
  },
  {
    id: "bias",
    title: "Ask about AI bias",
    description:
      "Get AI to explain algorithmic bias — for a college student who has never heard of it.",
    checks: {
      audience: {
        keywords: ["student", "college", "beginner", "unfamiliar", "never heard", "simple"],
        label: "Specified the audience",
      },
      topic: {
        keywords: ["bias", "algorithmic", "unfair", "training data", "prejudice"],
        label: "Mentioned bias or fairness",
      },
      format: {
        keywords: ["example", "explain", "short", "plain", "define", "what is"],
        label: "Asked for an explanation or example",
      },
    },
    examplePrompt:
      "Explain algorithmic bias to a college student who has never encountered the term. Keep it under 100 words and give one real-world example.",
    why: "Naming your audience and asking for examples makes responses much more useful.",
  },
  {
    id: "prompt",
    title: "Ask AI to improve a prompt",
    description:
      'Ask AI to improve this weak prompt: "Help me write something" — make it better for writing a cover letter.',
    checks: {
      audience: {
        keywords: ["cover letter", "job", "application", "professional", "career"],
        label: "Mentioned the purpose (cover letter / job)",
      },
      topic: {
        keywords: ["improve", "better", "rewrite", "fix", "stronger", "specific"],
        label: "Asked to improve or rewrite",
      },
      format: {
        keywords: ["example", "show", "version", "result", "output", "produce"],
        label: "Asked for an example or output",
      },
    },
    examplePrompt:
      'Improve this vague prompt into a specific one for writing a professional cover letter: "Help me write something." Show me the improved version and explain what you changed.',
    why: "Giving AI context about purpose and asking for an example output gets you much more specific help.",
  },
];
