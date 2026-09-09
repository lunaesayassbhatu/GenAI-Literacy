import type { Step } from "../moduleStepsData";

export const module4Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🌍",
      badge: "Module 4 of 7",
      title: "Using GenAI Responsibly",
      highlightWord: "Responsibly",
      subtitle: "AI literacy is for everyone — not just those with technical backgrounds.",
      learningPoints: [
        "🙋 What AI literacy actually means — and doesn't mean",
        "⚠️ What happens when people disengage from AI",
        "🌱 How to build your own AI literacy over time"
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
      title: "Who gets to understand AI?",
      subtitle: "Think AI is only for coders? That's one of the most limiting misconceptions out there.",
      messages: [
        {
          text: "AI literacy does NOT mean knowing how to code, build models, or understand neural network maths. It DOES mean understanding what AI can and can't do, using it critically, and knowing when not to trust it. 🙋",
          mood: "default"
        },
        {
          text: "In a group project, Aisha's teammate said 'I'll leave the AI stuff to Dev — I'm not a tech person.' Aisha realised she'd said the same thing. But Dev knowing how to code has nothing to do with using AI critically.",
          mood: "thinking"
        },
        {
          text: "You don't need to know how an engine works to be a good driver. Same idea. When non-technical people opt out, they become passive consumers — using tools without understanding them, and more vulnerable to misinformation. 💡",
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
      question: "What does AI literacy actually require?",
      options: [
        { text: "Strong programming and mathematics skills", correct: false },
        { text: "A background in computer science or engineering", correct: false },
        { text: "The ability to think critically about how AI works and how to use it responsibly", correct: true },
        { text: "Experience building or training AI models", correct: false }
      ],
      hints: [
        "AI literacy is about using AI — not building it.",
        "Think about what makes someone an informed, critical user.",
        "Pick the option about critical thinking and responsible use."
      ],
      correctFeedback: "Right! AI literacy is about informed, critical use — not technical construction. Those are two different skill sets.",
      wrongFeedback: "AI literacy doesn't require coding or maths — it's about understanding what AI does, its limits, and how to use it critically.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What happens when people stay on the sidelines?",
      subtitle: "When AI literacy gets treated as a tech specialism, the consequences go way beyond the individual.",
      messages: [
        {
          text: "When most people disengage from AI: passive consumption rises, a narrow group shapes tools for everyone, and critical voices from education, healthcare, law, and the arts get left out. 📢",
          mood: "thinking"
        },
        {
          text: "Dev is surprised to find that some of his non-technical friends are the most thoughtful AI users he knows. A journalism student spots AI-generated misinformation. A social policy student asks who benefits from automated decisions — and who doesn't.",
          mood: "celebrate"
        },
        {
          text: "Domain knowledge + critical thinking = AI literacy. No code required. 🧠",
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
      question: "Why does it matter who develops AI literacy — not just who builds AI?",
      options: [
        { text: "More users means better AI performance", correct: false },
        { text: "Non-technical users provide better training data", correct: false },
        { text: "Informed users across all fields help ensure AI is used critically and held accountable", correct: true },
        { text: "AI development requires input from every profession", correct: false }
      ],
      hints: [
        "It's not about performance or training data.",
        "Think about accountability and who AI affects.",
        "Pick the option about critical engagement across all fields."
      ],
      correctFeedback: "Exactly! AI affects everyone. Critical engagement with it shouldn't be limited to those who build it.",
      wrongFeedback: "It's not about improving AI performance — it's about ensuring AI is used critically and held accountable across all the fields it affects.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Building your own AI literacy",
      subtitle: "You've already started. Now keep going.",
      messages: [
        {
          text: "Understanding what GenAI is, how it can go wrong, and what its limits are? That's AI literacy in action. But it's ongoing — AI is changing fast, and staying literate means staying curious. 🌱",
          mood: "celebrate"
        },
        {
          text: "Habits that build AI literacy: Ask 'how does this work?' before using it. Ask 'who made this, and what assumptions did they bring?' When AI surprises you, ask why — don't just accept or dismiss it.",
          mood: "default"
        },
        {
          text: "Aisha starts asking friends in other programmes how AI shows up in their fields. A law student, a nursing student, and an art student all have insights a computer science student might never consider. Diverse perspectives make for better AI literacy. 🌍",
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
      question: "Which best describes an ongoing AI literacy habit?",
      options: [
        { text: "Regularly questioning how AI tools work, who built them, and what assumptions they carry", correct: true },
        { text: "Completing a one-time course on machine learning", correct: false },
        { text: "Only using tools approved by technical experts", correct: false },
        { text: "Avoiding AI tools until you fully understand the underlying technology", correct: false }
      ],
      hints: [
        "AI literacy isn't a destination — it's a practice.",
        "One-time certifications don't keep up with how fast AI changes.",
        "Pick the option about ongoing curiosity and questioning."
      ],
      correctFeedback: "Right! AI literacy isn't a destination — it's a practice. Staying curious and critical beats any one-time certification.",
      wrongFeedback: "AI literacy isn't a one-time achievement — it's an ongoing habit of questioning, checking, and staying curious about the tools you use.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 4 Complete!",
      highlightWord: "Complete!",
      subtitle: "You're now an AI citizen — equipped to engage with AI critically, no matter your background.",
      takeaways: [
        "AI literacy is about critical use, not technical construction — no coding required.",
        "When people opt out, they become passive consumers more vulnerable to misinformation.",
        "Diverse perspectives across fields are essential for holding AI accountable.",
        "AI literacy is a practice, not a destination — stay curious and keep questioning."
      ],
      badges: [
        { emoji: "🌍", name: "AI Citizen" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module4Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What does AI literacy actually require?",
      options: [
        { text: "Strong programming and mathematics skills", correct: false },
        { text: "A background in computer science or engineering", correct: false },
        { text: "The ability to think critically about how AI works and how to use it responsibly", correct: true },
        { text: "Experience building or training AI models", correct: false }
      ],
      hints: [
        "AI literacy is about using AI — not building it.",
        "Think about what makes someone an informed, critical user.",
        "Pick the option about critical thinking and responsible use."
      ],
      correctFeedback: "Right! AI literacy is about informed, critical use — not technical construction. Those are two different skill sets.",
      wrongFeedback: "AI literacy doesn't require coding or maths — it's about understanding what AI does, its limits, and how to use it critically.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What's the risk when non-technical people assume AI 'isn't for them'?",
      options: [
        { text: "AI tools become less effective without diverse users", correct: false },
        { text: "They may become passive consumers rather than informed, critical users", correct: true },
        { text: "Technical users end up doing more work", correct: false },
        { text: "AI development slows down", correct: false }
      ],
      hints: [
        "It's not about tool performance or workload.",
        "Think about what happens to someone who uses a tool without understanding it.",
        "Pick the option about engaging with AI uncritically."
      ],
      correctFeedback: "Exactly! Opting out of AI literacy doesn't mean opting out of AI — it means engaging with it without the tools to do so critically.",
      wrongFeedback: "The risk isn't to AI performance — it's to the person. Using AI without understanding its limits makes you more vulnerable to its errors.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student says 'I don't need to understand AI — I just use it for assignments.' What's the problem?",
      options: [
        { text: "Students should avoid using AI for assignments altogether", correct: false },
        { text: "Using a tool without understanding its limits makes you more vulnerable to its errors", correct: true },
        { text: "Only students in technical fields need to use AI for assignments", correct: false },
        { text: "There's no problem — most people use tools they don't fully understand", correct: false }
      ],
      hints: [
        "It's not about whether to use AI — it's about how.",
        "Think about what you miss when you use something uncritically.",
        "Pick the option about being vulnerable to errors without understanding."
      ],
      correctFeedback: "Right! Using AI uncritically means engaging with it without the tools to catch errors, spot bias, or know when not to trust it.",
      wrongFeedback: "The problem isn't using AI for assignments — it's using it without the understanding to catch its mistakes or know its limits.",
      xpReward: 50
    }
  }
];

export const module4Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Why does it matter who develops AI literacy — not just who builds AI?",
      options: [
        { text: "More users means better AI performance", correct: false },
        { text: "Non-technical users provide better training data", correct: false },
        { text: "Informed users across all fields help ensure AI is used critically and held accountable", correct: true },
        { text: "AI development requires input from every profession", correct: false }
      ],
      hints: [
        "It's not about performance or training data.",
        "Think about accountability and who AI affects.",
        "Pick the option about critical engagement across all fields."
      ],
      correctFeedback: "Exactly! AI affects everyone. Critical engagement with it shouldn't be limited to those who build it.",
      wrongFeedback: "It's not about improving AI performance — it's about ensuring AI is used critically and held accountable across all the fields it affects.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Which person demonstrates AI literacy without technical skills?",
      options: [
        { text: "A journalism student who identifies AI-generated misinformation in news articles", correct: true },
        { text: "A developer who builds machine learning tools", correct: false },
        { text: "A data scientist who trains language models", correct: false },
        { text: "An engineer who works on AI safety systems", correct: false }
      ],
      hints: [
        "AI literacy isn't the same as building AI.",
        "Think about who is critically evaluating AI's outputs and impact.",
        "Pick the option about someone using domain knowledge to assess AI critically."
      ],
      correctFeedback: "Right! Recognising AI's influence and limitations in your own domain is core AI literacy — regardless of technical background.",
      wrongFeedback: "Building AI isn't the same as being AI literate. The journalism student is critically evaluating AI's real-world impact — that's literacy.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What happens when AI development is shaped by a narrow group of people?",
      options: [
        { text: "AI becomes more accurate and efficient", correct: false },
        { text: "The values and blind spots of that group get embedded into tools that affect everyone", correct: true },
        { text: "Non-technical users get easier interfaces", correct: false },
        { text: "AI tools become harder to misuse", correct: false }
      ],
      hints: [
        "Think about what gets built in — and what gets left out.",
        "A narrow perspective produces a narrow tool.",
        "Pick the option about values and blind spots being embedded."
      ],
      correctFeedback: "Exactly! When diverse perspectives are missing, the tools that get built reflect a limited worldview — which affects everyone who uses them.",
      wrongFeedback: "A narrow group building AI doesn't make it more accurate or secure — it means their assumptions and blind spots get baked into tools everyone uses.",
      xpReward: 50
    }
  }
];

export const module4Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Which best describes an ongoing AI literacy habit?",
      options: [
        { text: "Regularly questioning how AI tools work, who built them, and what assumptions they carry", correct: true },
        { text: "Completing a one-time course on machine learning", correct: false },
        { text: "Only using tools approved by technical experts", correct: false },
        { text: "Avoiding AI tools until you fully understand the underlying technology", correct: false }
      ],
      hints: [
        "AI literacy isn't a destination — it's a practice.",
        "One-time certifications don't keep up with how fast AI changes.",
        "Pick the option about ongoing curiosity and questioning."
      ],
      correctFeedback: "Right! AI literacy isn't a destination — it's a practice. Staying curious and critical beats any one-time certification.",
      wrongFeedback: "AI literacy isn't a one-time achievement — it's an ongoing habit of questioning, checking, and staying curious about the tools you use.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "What does Aisha's approach at the end of the section demonstrate?",
      options: [
        { text: "That non-technical students should avoid forming opinions about AI", correct: false },
        { text: "That AI literacy requires consulting technical experts", correct: false },
        { text: "That diverse perspectives across fields strengthen critical engagement with AI", correct: true },
        { text: "That AI tools work differently depending on your subject area", correct: false }
      ],
      hints: [
        "It's not about consulting experts or avoiding opinions.",
        "Think about what Aisha gains from talking to people in different fields.",
        "Pick the option about diverse perspectives improving critical thinking."
      ],
      correctFeedback: "Right! Insights from ethics, communication, policy, and care are essential to understanding AI's real-world impact.",
      wrongFeedback: "Aisha isn't looking for technical help — she's broadening her perspective by hearing how AI shows up across different fields.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Why is talking to people in other fields a useful AI literacy habit?",
      options: [
        { text: "They can teach you how to build better AI tools", correct: false },
        { text: "Different fields surface different risks, uses, and blind spots that broaden your understanding", correct: true },
        { text: "It helps you find out which AI tools are most popular", correct: false },
        { text: "Technical students need non-technical perspectives to balance their skills", correct: false }
      ],
      hints: [
        "It's not about building tools or popularity.",
        "Think about what a law student, nurse, or artist sees that a computer science student might miss.",
        "Pick the option about surfacing different risks and blind spots."
      ],
      correctFeedback: "Exactly! AI shows up differently in law, healthcare, journalism, and the arts. Diverse perspectives sharpen your critical thinking in ways a single field can't.",
      wrongFeedback: "Talking across fields isn't about technical skills — it's about surfacing risks, uses, and blind spots that only show up when you step outside your own domain.",
      xpReward: 50
    }
  }
];

export const MODULE4_SECTION_VARIANT_COUNT = 3;
