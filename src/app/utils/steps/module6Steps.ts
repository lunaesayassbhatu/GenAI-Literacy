import type { Step } from "../moduleStepsData";

export const module6Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "💬",
      badge: "Module 6 of 7",
      title: "Getting AI to Do What You Want",
      highlightWord: "Want",
      subtitle: "GenAI doesn't understand you — it predicts you. Learn how to communicate with it so it actually helps.",
      learningPoints: [
        "🎯 Why vague input leads to vague output — every time",
        "✍️ How small changes to your prompt dramatically change results",
        "🔄 Why the best outputs come from iteration, not a perfect first prompt"
      ],
      info: {
        time: "~10 min",
        sections: "3",
        maxXp: "150 XP",
        badges: "1"
      }
    }
  },

  // ── SECTION 1 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "It doesn't understand you. It predicts you.",
      subtitle: "When AI gives you a great response, it can feel like it really got what you meant. It didn't.",
      messages: [
        {
          text: "GenAI doesn't understand your question the way a person would. It doesn't know your context, your intentions, or what you actually need. It predicts the most likely response based on the words you gave it. Vague input = vague output. 🤔",
          mood: "thinking"
        },
        {
          text: "Aisha asks an AI to 'help with her essay.' She gets a generic paragraph about essay structure. She wanted feedback on her argument. The AI didn't misunderstand her — it just had nothing more to go on.",
          mood: "default"
        },
        {
          text: "The AI gave a perfectly reasonable response to a vague request. That's on the input, not the tool. Giving AI exactly what it needs — not assuming it knows what you mean — is the skill. 💡",
          mood: "hint"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "1",
      question: "Why did Aisha get a generic response about essay structure?",
      options: [
        { text: "The AI isn't designed for academic writing", correct: false },
        { text: "Her request didn't give the AI enough context to help her specifically", correct: true },
        { text: "The AI misunderstood her question", correct: false },
        { text: "She should have used a different tool", correct: false }
      ],
      hints: [
        "The AI didn't fail — it responded reasonably to what it was given.",
        "Think about what information was missing from Aisha's request.",
        "Pick the option about context being missing from the input."
      ],
      correctFeedback: "Right! GenAI predicts responses based on your input. Vague input leads to generic output — not because the AI failed, but because it had nothing more to work with.",
      wrongFeedback: "The AI didn't misunderstand or fail — it responded reasonably to a vague request. The issue was that Aisha's input didn't give it enough to work with.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What you put in shapes what you get out",
      subtitle: "Think of it like giving directions. The more specific you are, the more likely you end up where you want to go.",
      messages: [
        {
          text: "Small changes to your input can dramatically change your output. Things that help: be specific about what you want, give context about who you are and why you're asking, tell it the format you need, say what you don't want. ✍️",
          mood: "default"
        },
        {
          text: "Dev needs help with a stats concept. He asks 'explain standard deviation.' He gets a textbook-style wall of text. He tries again: 'explain standard deviation like I've never taken a stats class, using a simple everyday example.' He gets something he can actually use.",
          mood: "thinking"
        },
        {
          text: "Same question. Different input. Completely different result. 🎯",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "Why did Dev's second request get a better response?",
      options: [
        { text: "He gave the AI more context about what kind of explanation he needed", correct: true },
        { text: "The AI learned from his first attempt", correct: false },
        { text: "Simpler questions always get better answers", correct: false },
        { text: "The AI recognised him from the first request", correct: false }
      ],
      hints: [
        "AI doesn't learn between responses in the same session.",
        "Think about what changed between the two requests.",
        "Pick the option about more context producing a more targeted response."
      ],
      correctFeedback: "Exactly! More specific input gives the AI more to work with. Context about your level, needs, and format makes a real difference to the output.",
      wrongFeedback: "AI doesn't learn from previous attempts or recognise users — Dev got a better result because he gave the AI more specific context about what he needed.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "When the output isn't right, don't give up — adjust",
      subtitle: "Getting a bad response doesn't mean AI can't help. It usually means the conversation isn't over yet.",
      messages: [
        {
          text: "If the output isn't what you needed: don't just regenerate — refine. Tell it what was wrong with the last response. Add context you left out the first time. Ask it to try a different approach. The best results usually come from back-and-forth, not a single perfect prompt. 🔄",
          mood: "default"
        },
        {
          text: "Jordan asks AI to help him prepare counterarguments for a debate. The first response is too surface-level. Instead of giving up, he says: 'these are too general — I need arguments that specifically address economic impacts.' The next response is exactly what he needed.",
          mood: "thinking"
        },
        {
          text: "The goal isn't a perfect first prompt. It's knowing how to steer. 🎯",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "3",
      question: "Why was Jordan's second response more useful than his first?",
      options: [
        { text: "The AI got smarter between responses", correct: false },
        { text: "He gave the AI more specific direction about what was missing", correct: true },
        { text: "He used different keywords the AI recognised better", correct: false },
        { text: "Longer conversations always produce better results", correct: false }
      ],
      hints: [
        "AI doesn't improve automatically between turns.",
        "Think about what Jordan actually told the AI in his second message.",
        "Pick the option about giving specific direction about what was wrong."
      ],
      correctFeedback: "Right! Refining your request based on what didn't work is more effective than starting over. Telling the AI what was wrong gives it something concrete to improve on.",
      wrongFeedback: "The AI didn't get smarter or recognise keywords — Jordan got a better result because he told it specifically what was missing from the first response.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 6 Complete!",
      highlightWord: "Complete!",
      subtitle: "You're a Prompt Pro — you know how to communicate with AI so it actually works for you.",
      takeaways: [
        "GenAI predicts responses based on your input — it doesn't understand your intent. Vague input gets vague output.",
        "Small changes to your prompt make a big difference. Be specific: give context, state the format, say what you don't want.",
        "Getting a bad response isn't the end — it's a starting point. Refine, add context, and steer.",
        "The goal isn't one perfect prompt. It's knowing how to have a productive conversation with the tool."
      ],
      badges: [
        { emoji: "💬", name: "Prompt Pro" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module6Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "Why did Aisha get a generic response about essay structure?",
      options: [
        { text: "The AI isn't designed for academic writing", correct: false },
        { text: "Her request didn't give the AI enough context to help her specifically", correct: true },
        { text: "The AI misunderstood her question", correct: false },
        { text: "She should have used a different tool", correct: false }
      ],
      hints: [
        "The AI didn't fail — it responded reasonably to what it was given.",
        "Think about what information was missing from Aisha's request.",
        "Pick the option about context being missing from the input."
      ],
      correctFeedback: "Right! GenAI predicts responses based on your input. Vague input leads to generic output — not because the AI failed, but because it had nothing more to work with.",
      wrongFeedback: "The AI didn't misunderstand or fail — it responded reasonably to a vague request. The issue was that Aisha's input didn't give it enough to work with.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student asks AI to 'explain this topic better.' What's the most likely problem with this request?",
      options: [
        { text: "The topic is too complex for AI", correct: false },
        { text: "The student should have asked a different question", correct: false },
        { text: "'Better' gives the AI no information about what the student actually needs", correct: true },
        { text: "AI can't explain topics in multiple ways", correct: false }
      ],
      hints: [
        "Think about what 'better' actually tells the AI.",
        "AI has no way of knowing what 'better' means without more context.",
        "Pick the option about the word 'better' providing no useful information."
      ],
      correctFeedback: "Exactly! GenAI has no way of knowing what 'better' means to you without more context. Specific requests get specific results.",
      wrongFeedback: "The problem isn't the topic or the question type — 'better' is meaningless without context. The AI has nothing to go on.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What's the key difference between how a human tutor and GenAI interpret a vague question?",
      options: [
        { text: "A human tutor gives longer answers", correct: false },
        { text: "A human tutor can ask follow-up questions to understand what you need, while GenAI works only with what you give it", correct: true },
        { text: "GenAI is more patient with unclear questions", correct: false },
        { text: "There is no real difference", correct: false }
      ],
      hints: [
        "Think about what a human can do that AI can't.",
        "A human can read between the lines — can AI?",
        "Pick the option about clarification and intent."
      ],
      correctFeedback: "Right! A human can read between the lines and ask for clarification. GenAI predicts based on patterns — it has no real understanding of your intent.",
      wrongFeedback: "It's not about length or patience — a human tutor can ask follow-up questions to understand what you need. GenAI only works with what you give it.",
      xpReward: 50
    }
  }
];

export const module6Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Why did Dev's second request get a better response?",
      options: [
        { text: "He gave the AI more context about what kind of explanation he needed", correct: true },
        { text: "The AI learned from his first attempt", correct: false },
        { text: "Simpler questions always get better answers", correct: false },
        { text: "The AI recognised him from the first request", correct: false }
      ],
      hints: [
        "AI doesn't learn between responses in the same session.",
        "Think about what changed between the two requests.",
        "Pick the option about more context producing a more targeted response."
      ],
      correctFeedback: "Exactly! More specific input gives the AI more to work with. Context about your level, needs, and format makes a real difference to the output.",
      wrongFeedback: "AI doesn't learn from previous attempts or recognise users — Dev got a better result because he gave the AI more specific context about what he needed.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "A student wants AI to give feedback on the structure of their essay — not the content. What's the best approach?",
      options: [
        { text: "Ask for 'general feedback' and see what comes back", correct: false },
        { text: "Submit the essay and hope the AI focuses on structure", correct: false },
        { text: "Specify clearly that they want feedback on structure only, not content", correct: true },
        { text: "Ask two separate AIs and compare responses", correct: false }
      ],
      hints: [
        "Without direction, AI makes its own assumptions about what you need.",
        "Think about how to remove guesswork from the AI's response.",
        "Pick the option about being explicit about what you want."
      ],
      correctFeedback: "Right! Without clear direction, AI will make its own assumptions about what you need. Being explicit removes that guesswork.",
      wrongFeedback: "Hoping or asking vaguely leaves the AI guessing. Being explicit about what you want — and what you don't — gets you a focused response.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What's the risk of assuming AI will figure out what you meant from a vague prompt?",
      options: [
        { text: "The AI may crash or produce an error", correct: false },
        { text: "You may get a confident, fluent response that completely misses what you actually needed", correct: true },
        { text: "The AI will ask too many follow-up questions", correct: false },
        { text: "Vague prompts always produce shorter responses", correct: false }
      ],
      hints: [
        "AI doesn't flag confusion — it generates something regardless.",
        "A response can look good and still miss the point.",
        "Pick the option about a fluent response that misses what you needed."
      ],
      correctFeedback: "Exactly! GenAI doesn't flag confusion — it generates something plausible regardless. A response can look great and still miss the point entirely.",
      wrongFeedback: "AI won't crash or ask questions — it generates a confident, fluent response whether or not it understood what you needed. That's the risk.",
      xpReward: 50
    }
  }
];

export const module6Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Why was Jordan's second response more useful than his first?",
      options: [
        { text: "The AI got smarter between responses", correct: false },
        { text: "He gave the AI more specific direction about what was missing", correct: true },
        { text: "He used different keywords the AI recognised better", correct: false },
        { text: "Longer conversations always produce better results", correct: false }
      ],
      hints: [
        "AI doesn't improve automatically between turns.",
        "Think about what Jordan actually told the AI in his second message.",
        "Pick the option about giving specific direction about what was wrong."
      ],
      correctFeedback: "Right! Refining your request based on what didn't work is more effective than starting over. Telling the AI what was wrong gives it something concrete to improve on.",
      wrongFeedback: "The AI didn't get smarter or recognise keywords — Jordan got a better result because he told it specifically what was missing from the first response.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "A student gets an AI response that's close but not quite right. What's the best next step?",
      options: [
        { text: "Start a completely new conversation", correct: false },
        { text: "Accept it and edit it manually", correct: false },
        { text: "Try a different AI tool", correct: false },
        { text: "Tell the AI specifically what needs to change and ask it to try again", correct: true }
      ],
      hints: [
        "Starting over means losing the context you've already built up.",
        "Editing it yourself skips the opportunity to get closer through refinement.",
        "Pick the option about telling the AI exactly what needs to change."
      ],
      correctFeedback: "Exactly! Iteration is part of the process. Pointing out exactly what's missing or off gives the AI the context it needs to do better.",
      wrongFeedback: "Starting over or switching tools discards the context you've built. Telling the AI specifically what to fix is the most efficient path forward.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "What's the most useful mindset when working with GenAI to get what you need?",
      options: [
        { text: "Get it right in one prompt or don't bother", correct: false },
        { text: "Treat it like a search engine and keep trying new queries", correct: false },
        { text: "Treat it like a conversation — refine, add context, and steer as you go", correct: true },
        { text: "Let the AI lead and accept wherever it takes you", correct: false }
      ],
      hints: [
        "One perfect prompt is rarely realistic — and not the goal.",
        "Search engines and AI tools work differently.",
        "Pick the option about treating AI as a back-and-forth process."
      ],
      correctFeedback: "Right! GenAI works best as a back-and-forth process. The more you engage critically and refine your input, the more useful the output becomes.",
      wrongFeedback: "AI isn't a search engine and doesn't need a perfect first prompt. The best results come from treating it like a conversation — refining and steering as you go.",
      xpReward: 50
    }
  }
];

export const MODULE6_SECTION_VARIANT_COUNT = 3;
