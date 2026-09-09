import type { Step } from "../moduleStepsData";

export const module2Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🔍",
      badge: "Module 2 of 7",
      title: "Trust in GenAI",
      highlightWord: "Trust",
      subtitle: "Understand why GenAI can't be treated as a reliable source of truth.",
      learningPoints: [
        "🔍 Why GenAI sounds right — even when it's wrong",
        "🤯 How hallucinations happen and what they look like",
        "✅ Which tasks are safe to use AI for — and which need verification"
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
      title: "It sounds right. But is it?",
      subtitle: "Fluent ≠ factual. Coherent ≠ correct.",
      messages: [
        {
          text: "Asking AI a question feels a lot like Googling. But it's completely different under the hood — Google retrieves pages that exist. GenAI generates a response from scratch. 🔍",
          mood: "thinking"
        },
        {
          text: "GenAI is designed to be coherent. Not accurate. A response can be fluent, detailed, well-structured… and still be wrong.",
          mood: "default"
        },
        {
          text: "Aisha studied for her psychology exam using an AI explanation. Two of her answers were marked wrong — the AI had subtly misrepresented the theory. The answer looked credible. It just wasn't. 😬",
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
      question: "What was the core problem in Aisha's scenario?",
      options: [
        { text: "She didn't phrase her question clearly enough", correct: false },
        { text: "The AI gave her outdated information", correct: false },
        { text: "AI doesn't work well for psychology topics", correct: false },
        { text: "She treated a generated response as fact without verifying it", correct: true }
      ],
      hints: [
        "The issue isn't about how she asked — it's about what she did with the answer.",
        "GenAI produces coherent text, not confirmed facts.",
        "Pick the option where verification was missing."
      ],
      correctFeedback: "Exactly! GenAI produces coherent text, not confirmed facts. Verification is always the student's responsibility.",
      wrongFeedback: "The problem wasn't the question or the topic — Aisha trusted generated text as fact without verifying it first.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "Why does it get things wrong?",
      subtitle: "AI doesn't know when it's wrong — and it won't tell you.",
      messages: [
        {
          text: "Here's something that surprises most people: AI doesn't know when it's wrong. It produces the most statistically likely next word — confident whether it's correct or not. 😶",
          mood: "thinking"
        },
        {
          text: "That means it can state false things with full confidence, invent details that were never in its training data, and mix accurate and inaccurate information in the same sentence.",
          mood: "default"
        },
        {
          text: "Dev included a specific quote from a named historian in his essay. His lecturer couldn't find it anywhere — the AI had fabricated it entirely. It looked completely legitimate. That's what makes hallucinations tricky. 😬",
          mood: "hint"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "Why did the AI produce a quote that doesn't exist?",
      options: [
        { text: "It generated a plausible-sounding detail with no ability to verify it", correct: true },
        { text: "It was testing whether Dev would fact-check", correct: false },
        { text: "The quote was real but the source was wrong", correct: false },
        { text: "It pulled the quote from an unreliable website", correct: false }
      ],
      hints: [
        "AI doesn't test users or pull from websites.",
        "GenAI doesn't verify — it generates.",
        "Pick the option about generating without any ability to check."
      ],
      correctFeedback: "Right! GenAI doesn't verify — it generates. Confidence in tone is no indicator of accuracy.",
      wrongFeedback: "AI doesn't retrieve from websites or test users — it simply generates plausible-sounding content with no fact-checking step.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "So when can you trust it?",
      subtitle: "Use AI to think. Use reliable sources to confirm.",
      messages: [
        {
          text: "AI isn't useless — you just have to know which tasks carry risk and which don't. 🎯",
          mood: "default"
        },
        {
          text: "Lower risk: brainstorming, explaining concepts, rough drafts. Higher risk: specific facts, quotes, citations, or anything you'll submit. Always match your verification effort to what's at stake. ✅",
          mood: "celebrate"
        },
        {
          text: "Jordan used AI for talking points and plain-language explanations — but went to peer-reviewed sources for statistics and citations. Use AI to think. Use reliable sources to confirm. That's the move. 💡",
          mood: "hint"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "3",
      question: "Why was Jordan's approach a smart one?",
      options: [
        { text: "He avoided AI for anything important", correct: false },
        { text: "He matched AI's strengths to low-risk tasks and verified where accuracy mattered", correct: true },
        { text: "Brainstorming is the only thing AI is good at", correct: false },
        { text: "Statistics are too complex for AI to understand", correct: false }
      ],
      hints: [
        "It's not about avoiding AI — it's about knowing where to use it.",
        "Think about the difference between low-risk and high-risk tasks.",
        "Pick the option that balances AI's strengths with knowing when to verify."
      ],
      correctFeedback: "Exactly! Knowing where AI adds value — and where it doesn't — is the key to using it well.",
      wrongFeedback: "Jordan didn't avoid AI — he matched it to the right tasks and verified where accuracy mattered. That balance is the key.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 2 Complete!",
      highlightWord: "Complete!",
      subtitle: "You now know why GenAI can't be your only source of truth — and how to use it wisely.",
      takeaways: [
        "GenAI generates responses — it doesn't retrieve verified facts like a search engine.",
        "It can hallucinate confidently: fake quotes, invented statistics, and subtle errors all look real.",
        "AI has no internal fact-checker — the burden of verification always sits with you.",
        "Match AI to low-risk tasks and use reliable sources wherever accuracy matters."
      ],
      badges: [
        { emoji: "🔍", name: "Truth Seeker" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module2Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What was the core problem in Aisha's scenario?",
      options: [
        { text: "She didn't phrase her question clearly enough", correct: false },
        { text: "The AI gave her outdated information", correct: false },
        { text: "AI doesn't work well for psychology topics", correct: false },
        { text: "She treated a generated response as fact without verifying it", correct: true }
      ],
      hints: [
        "The issue isn't about how she asked — it's about what she did with the answer.",
        "GenAI produces coherent text, not confirmed facts.",
        "Pick the option where verification was missing."
      ],
      correctFeedback: "Exactly! GenAI produces coherent text, not confirmed facts. Verification is always the student's responsibility.",
      wrongFeedback: "The problem wasn't the question or the topic — Aisha trusted generated text as fact without verifying it first.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "Why is it risky to treat GenAI like a Google search?",
      options: [
        { text: "Google is slower and less detailed", correct: false },
        { text: "GenAI generates responses rather than retrieving verified information", correct: true },
        { text: "GenAI only works for simple questions", correct: false },
        { text: "Google doesn't understand natural language", correct: false }
      ],
      hints: [
        "Think about what each tool actually does when you ask it something.",
        "One retrieves existing pages. The other writes something new.",
        "Pick the option about generating vs retrieving."
      ],
      correctFeedback: "Right! Search points you to existing sources. GenAI writes something new — with no guarantee it's accurate.",
      wrongFeedback: "The key difference isn't speed or simplicity — GenAI generates new responses rather than pointing to verified sources.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student gets a detailed, well-structured AI explanation to study from. What should they do before relying on it?",
      options: [
        { text: "Ask the AI to simplify it", correct: false },
        { text: "Cross-check it with a reliable source", correct: true },
        { text: "Share it with a classmate to see if it sounds right", correct: false },
        { text: "Ask the AI if it's accurate", correct: false }
      ],
      hints: [
        "A well-written response doesn't mean it's correct.",
        "Another student or the AI itself can't verify facts.",
        "Pick the option that involves checking against a trusted external source."
      ],
      correctFeedback: "Right! A well-structured response doesn't mean it's correct — always verify against a trusted source before studying from it.",
      wrongFeedback: "Simplifying it or asking a classmate won't catch factual errors. Always cross-check with a reliable source.",
      xpReward: 50
    }
  }
];

export const module2Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Why did the AI produce a quote that doesn't exist?",
      options: [
        { text: "It generated a plausible-sounding detail with no ability to verify it", correct: true },
        { text: "It was testing whether Dev would fact-check", correct: false },
        { text: "The quote was real but the source was wrong", correct: false },
        { text: "It pulled the quote from an unreliable website", correct: false }
      ],
      hints: [
        "AI doesn't test users or pull from websites.",
        "GenAI doesn't verify — it generates.",
        "Pick the option about generating without any ability to check."
      ],
      correctFeedback: "Right! GenAI doesn't verify — it generates. Confidence in tone is no indicator of accuracy.",
      wrongFeedback: "AI doesn't retrieve from websites or test users — it generates plausible-sounding content with no fact-checking step.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Which best describes how GenAI handles facts?",
      options: [
        { text: "It retrieves facts from trusted databases", correct: false },
        { text: "It checks information before including it in a response", correct: false },
        { text: "It predicts likely-sounding responses based on patterns, without verifying truth", correct: true },
        { text: "It flags uncertain information so users know to check", correct: false }
      ],
      hints: [
        "GenAI has no access to live databases or fact-checking systems.",
        "It doesn't flag uncertainty — it just generates.",
        "Pick the option about predicting patterns without verification."
      ],
      correctFeedback: "Correct! There's no internal fact-checker. The burden of verification always sits with the user.",
      wrongFeedback: "GenAI doesn't access databases, verify facts, or flag uncertainty — it predicts likely-sounding responses and that's it.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "A student finds a specific statistic in an AI response, complete with a source name and year. What's the safest next step?",
      options: [
        { text: "Use it — the detail means it's probably real", correct: false },
        { text: "Google the source name to see if it exists", correct: true },
        { text: "Ask the AI where it found the statistic", correct: false },
        { text: "Leave it out entirely to be safe", correct: false }
      ],
      hints: [
        "Specific-looking details can still be fabricated.",
        "The AI can't verify its own sources — asking it won't help.",
        "Pick the option that involves independently checking if the source exists."
      ],
      correctFeedback: "Right! Specific details like source names and dates can still be fabricated. Always verify independently.",
      wrongFeedback: "Specific details don't guarantee accuracy, and asking the AI to verify itself won't work. Always check the source independently.",
      xpReward: 50
    }
  }
];

export const module2Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Why was Jordan's approach a smart one?",
      options: [
        { text: "He avoided AI for anything important", correct: false },
        { text: "He matched AI's strengths to low-risk tasks and verified where accuracy mattered", correct: true },
        { text: "Brainstorming is the only thing AI is good at", correct: false },
        { text: "Statistics are too complex for AI to understand", correct: false }
      ],
      hints: [
        "It's not about avoiding AI — it's about knowing where to use it.",
        "Think about the difference between low-risk and high-risk tasks.",
        "Pick the option that balances AI's strengths with knowing when to verify."
      ],
      correctFeedback: "Exactly! Knowing where AI adds value — and where it doesn't — is the key to using it well.",
      wrongFeedback: "Jordan didn't avoid AI — he matched it to the right tasks and verified where accuracy mattered. That balance is the key.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Which task is riskiest to rely on without checking?",
      options: [
        { text: "Getting a concept explained simply", correct: false },
        { text: "Generating a list of essay topic ideas", correct: false },
        { text: "Finding a specific statistic for a graded report", correct: true },
        { text: "Drafting an opening paragraph to edit later", correct: false }
      ],
      hints: [
        "Think about which task requires a specific fact to be accurate.",
        "Brainstorming and drafting don't depend on facts being correct.",
        "Pick the option where a wrong answer could have real consequences."
      ],
      correctFeedback: "Right! Specific facts in graded work carry real consequences if wrong. That's exactly where verification matters most.",
      wrongFeedback: "Brainstorming, explaining, and drafting are lower-risk. Statistics for graded work are high-stakes — always verify independently.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "A student drafts an opening paragraph with AI, then rewrites it in their own words. What does this reflect?",
      options: [
        { text: "Over-reliance on AI", correct: false },
        { text: "Using AI as a tool while staying in control of the work", correct: true },
        { text: "A waste of time — they should just edit what the AI wrote", correct: false },
        { text: "Plagiarism", correct: false }
      ],
      hints: [
        "Think about who is in control of the final work.",
        "Using AI as a starting point and building on it is the recommended approach.",
        "Pick the option that treats AI as a tool, not a replacement."
      ],
      correctFeedback: "Exactly! Using AI as a starting point and building on it yourself leverages its strengths without handing over responsibility.",
      wrongFeedback: "Rewriting in your own words isn't over-reliance or plagiarism — it's using AI as a launchpad while keeping ownership of your work.",
      xpReward: 50
    }
  }
];

export const MODULE2_SECTION_VARIANT_COUNT = 3;
