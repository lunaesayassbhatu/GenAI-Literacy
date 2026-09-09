import type { Step } from "../moduleStepsData";

export const module1Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🤖",
      badge: "Module 1 of 7",
      title: "What Is AI, Really?",
      highlightWord: "Really?",
      subtitle: "Understand the basics — no jargon, just clarity.",
      learningPoints: [
        "🧠 What generative AI actually is and how it works",
        "⚠️ Why AI can sound confident and still be wrong",
        "✅ How to use AI as a tool — not a shortcut"
      ],
      info: {
        time: "~10 min",
        sections: "3",
        maxXp: "100 XP",
        badges: "2"
      }
    }
  },

  // ── SECTION 1 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "So... what is generative AI?",
      subtitle: "No jargon. Just what's actually happening when you hit send.",
      messages: [
        {
          text: "You've used AI before. But do you actually know what it's doing when you hit send? 🤔",
          mood: "thinking"
        },
        {
          text: "Key idea: it's not pulling answers from the internet — it's *building* them from scratch, every time.",
          mood: "default"
        },
        {
          text: "Dev asked ChatGPT to explain mitosis. He assumed it found an article. It didn't — it generated that answer just for him. Think autocomplete, but way more powerful. 🧠",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "1",
      question: "Dev got an explanation from AI he'd never seen before. Where did it come from?",
      options: [
        { text: "The AI found and rewrote a webpage", correct: false },
        { text: "The AI generated it using patterns learned from its training data", correct: true },
        { text: "A human pre-wrote it in advance", correct: false },
        { text: "It reused a previous conversation", correct: false }
      ],
      hints: [
        "Ask yourself: did the AI make this answer, or find it somewhere?",
        "Cross out any option that involves searching, storing, or retrieving.",
        "Pick the one about building a response from learned patterns."
      ],
      correctFeedback: "Exactly! GenAI builds responses from patterns — it never retrieves anything from the web.",
      wrongFeedback: "GenAI doesn't search or retrieve — it generates a fresh response from learned patterns every single time.",
      xpReward: 30
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "Can you always trust what it says?",
      subtitle: "Why confidence ≠ accuracy.",
      messages: [
        {
          text: "Here's where things get tricky. GenAI sounds confident — but confidence ≠ correctness. 😬",
          mood: "hint"
        },
        {
          text: "Aisha asked AI for paper sources. She got five perfectly-formatted citations. Two of the books don't exist. The AI wasn't lying — it just followed the *pattern* of what citations look like.",
          mood: "thinking"
        },
        {
          text: "This is called a hallucination. Fluent ≠ factual. Always verify before you submit. 🔍",
          mood: "default"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "Why did the AI give Aisha citations for books that don't exist?",
      options: [
        { text: "It found similar books and got the details slightly wrong", correct: false },
        { text: "It generated text that looks like citations, with no way to verify if they're real", correct: true },
        { text: "The books existed when the AI was trained but have since been removed", correct: false },
        { text: "It misunderstood what she was asking for", correct: false }
      ],
      hints: [
        "This isn't about a typo — it's about how AI handles facts.",
        "AI knows what a citation looks like. That's not the same as knowing if it exists.",
        "Pick the option about generating text without any fact-checking."
      ],
      correctFeedback: "Right! AI knows citation patterns — but has no way to check whether those books are actually real.",
      wrongFeedback: "AI doesn't verify facts. It generates text that looks right because it learned what citations are supposed to look like.",
      xpReward: 30
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "So how should you actually use it?",
      subtitle: "Use it as a starting point, not a finish line.",
      messages: [
        {
          text: "So if it can be wrong... is it even useful? Yes — but how you use it matters. 🎯",
          mood: "default"
        },
        {
          text: "Jordan used AI to draft a rough outline, then rewrote it in his own words. He used it to get unstuck — not to skip the thinking.",
          mood: "celebrate"
        },
        {
          text: "Bottom line: you're responsible for what you submit. Use it like a tool you control — not an authority you trust. 💡",
          mood: "hint"
        }
      ]
    }
  },
  {
    type: "drag-drop",
    data: {
      title: "Sort the Tasks",
      highlightWord: "Tasks",
      subtitle: "Drag each task to the right category. Where does GenAI shine — and where do you need to double-check?",
      tasks: [
        { id: "1", text: "Brainstorming essay topics", category: "good" },
        { id: "2", text: "Finding statistics for a paper", category: "verify" },
        { id: "3", text: "Getting a first draft started", category: "good" },
        { id: "4", text: "Checking if a citation is real", category: "verify" },
        { id: "5", text: "Explaining a complex concept", category: "good" },
        { id: "6", text: "Medical or legal information", category: "verify" }
      ],
      hints: [
        "Ask: does this need to be factually correct or safe? If yes — Always Verify.",
        "Brainstorming, drafting, and explaining ideas usually go in Works Well.",
        "Stats, citations, and medical or legal topics always go in Always Verify."
      ],
      zones: {
        good: { label: "✅ Works Well", color: "#4AB7C4" },
        verify: { label: "⚠️ Always Verify", color: "#FF8A50" }
      },
      xpRewards: { perfect: 40, partial: 20, low: 10 }
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 1 Complete!",
      highlightWord: "Complete!",
      subtitle: "You decoded what AI really is — and how to actually use it.",
      takeaways: [
        "GenAI generates — it doesn't retrieve. Every response is built from patterns, not pulled from the web.",
        "It can hallucinate convincingly. A confident, fluent answer is not proof it's accurate.",
        "Always verify facts, citations, and statistics before submitting anything.",
        "Use AI as a starting point — keep the thinking and the decisions yours."
      ],
      badges: [
        { emoji: "🥇", name: "First Steps" },
        { emoji: "🧠", name: "AI Decoded" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module1Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "1",
      question: "Dev got a new explanation. Where did it come from?",
      options: [
        { text: "The AI found and rewrote a webpage", correct: false },
        { text: "The AI generated it using learning patterns", correct: true },
        { text: "A human pre-wrote it", correct: false },
        { text: "It reused an old conversation", correct: false }
      ],
      hints: [
        "Ask yourself: did the AI create this answer, or find it somewhere?",
        "Skip choices about internet searching or reusing old content.",
        "Pick the option about generating a new answer from learned patterns."
      ],
      correctFeedback: "Right! GenAI predicts responses based on patterns, not retrieval.",
      wrongFeedback: "GenAI doesn't search or retrieve — it generates responses from learned patterns every time.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "1",
      question: "What does 'generative' mean?",
      options: [
        { text: "Faster search", correct: false },
        { text: "Copying text", correct: false },
        { text: "Creating new content from your input", correct: true },
        { text: "Random guessing", correct: false }
      ],
      hints: [
        "Think about what the word 'generate' means.",
        "It's not about finding or copying existing information.",
        "Pick the option about producing something new each time."
      ],
      correctFeedback: "Exactly! 'Generative' means producing new outputs — it creates content, not copies it.",
      wrongFeedback: "Generative AI creates new content each time. It doesn't search, copy, or guess randomly.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "1",
      question: "Why might two students get different answers after asking the AI the exact same question?",
      options: [
        { text: "GenAI generates responses each time, so outputs can vary", correct: true },
        { text: "The AI customizes answers based on who's asking", correct: false },
        { text: "The AI pulled from different websites", correct: false },
        { text: "One of them must have worded it differently", correct: false }
      ],
      hints: [
        "Think about how AI builds its responses — does it store and replay answers?",
        "Skip choices about personalization or web searching.",
        "Pick the option about generating responses fresh each time."
      ],
      correctFeedback: "Correct! Because AI generates responses fresh each time, even identical prompts can get slightly different outputs.",
      wrongFeedback: "AI doesn't store or replay answers — it generates responses fresh every time, which is why outputs can vary.",
      xpReward: 30
    }
  }
];

export const module1Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "Why did Aisha get fake sources?",
      options: [
        { text: "They were removed later", correct: false },
        { text: "Small mistakes", correct: false },
        { text: "The AI generated realistic-looking citations without verifying them", correct: true },
        { text: "It misunderstood", correct: false }
      ],
      hints: [
        "This isn't about a typo or misunderstanding.",
        "AI knows what a citation looks like — but that's different from knowing if it exists.",
        "Pick the option about generating text without checking if it's real."
      ],
      correctFeedback: "Right! AI recognizes citation patterns, not actual databases — so it generates ones that look real but aren't.",
      wrongFeedback: "AI doesn't look things up or make small errors — it generates text that looks like a citation without any way to verify it.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "What is a hallucination in GenAI?",
      options: [
        { text: "When the AI makes up information that sounds real", correct: true },
        { text: "When the AI crashes mid-response", correct: false },
        { text: "When the AI repeats itself", correct: false },
        { text: "When the AI misreads your prompt", correct: false }
      ],
      hints: [
        "It's not a technical error — the AI keeps running normally.",
        "Think about what makes AI output dangerous: it sounds right but isn't.",
        "Pick the option about generating false information confidently."
      ],
      correctFeedback: "Exactly! A hallucination is when AI generates plausible-sounding content that has no factual basis.",
      wrongFeedback: "A hallucination isn't a crash or a misread — it's when AI produces confident, fluent content that simply isn't true.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "A GenAI response is well-written and detailed. What does that tell you about its accuracy?",
      options: [
        { text: "It's reliable", correct: false },
        { text: "It was fact-checked", correct: false },
        { text: "Nothing — quality of writing doesn't guarantee correctness", correct: true },
        { text: "It came from a credible source", correct: false }
      ],
      hints: [
        "GenAI is trained on writing patterns — fluency is its default, not a signal of truth.",
        "Think about what AI actually checks before it responds (hint: nothing).",
        "Pick the option that says writing quality and accuracy are unrelated."
      ],
      correctFeedback: "Correct! Fluency and confidence are byproducts of pattern matching, not fact-checking. Always verify independently.",
      wrongFeedback: "A polished response just means AI followed good writing patterns — it has no fact-checking step at all.",
      xpReward: 30
    }
  }
];

export const module1Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "1",
      question: "Why was Jordan's approach effective?",
      options: [
        { text: "He avoided thinking", correct: false },
        { text: "He used AI to get unstuck but kept control", correct: true },
        { text: "He copied it exactly", correct: false },
        { text: "He trusted it fully", correct: false }
      ],
      hints: [
        "Think about what Jordan did differently from someone who just copies the output.",
        "The key word is 'control' — who stayed in charge of the thinking?",
        "Pick the option that treats AI as a tool, not a replacement for thinking."
      ],
      correctFeedback: "Exactly! Using AI to get unstuck while staying in control means you're still doing the thinking — AI just helps you move forward.",
      wrongFeedback: "Jordan didn't copy or fully trust it — he used AI as a springboard and kept his own judgment in the driver's seat.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "2",
      question: "What's riskiest to rely on without checking?",
      options: [
        { text: "Brainstorming ideas", correct: false },
        { text: "Rewriting a paragraph", correct: false },
        { text: "Finding statistics for a paper", correct: true },
        { text: "Explaining a simple concept", correct: false }
      ],
      hints: [
        "Think about which task requires specific facts that need to be accurate.",
        "Brainstorming and rewriting don't depend on facts being correct — which one does?",
        "Pick the option where a wrong answer could get you in real trouble."
      ],
      correctFeedback: "Exactly! Statistics and citations need to be verifiable. AI generates plausible-sounding numbers and sources that may not actually exist.",
      wrongFeedback: "Brainstorming and rewriting are lower-risk because you're not relying on AI for facts. Statistics are high-stakes — always verify them independently.",
      xpReward: 30
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "3",
      question: "Which of these is the best way to use GenAI for an assignment?",
      options: [
        { text: "Use it to brainstorm, then build on it yourself", correct: true },
        { text: "Submit whatever it generates", correct: false },
        { text: "Only use it if your professor approves each response", correct: false },
        { text: "Run it through a second AI to verify it", correct: false }
      ],
      hints: [
        "Think about who should be responsible for the final work.",
        "Which option treats AI as a starting point rather than the finish line?",
        "Pick the option where you're still doing the thinking — AI just helps you begin."
      ],
      correctFeedback: "Right! AI works best as a launchpad. Use it to generate ideas, then shape, verify, and build on them yourself.",
      wrongFeedback: "Submitting AI output directly, or needing approval for every line, both miss the point. The sweet spot is using AI to start — then making it your own.",
      xpReward: 30
    }
  }
];

export const MODULE1_SECTION1_VARIANT_COUNT = 3;
