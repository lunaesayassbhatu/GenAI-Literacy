import type { Step } from "../moduleStepsData";

export const module3Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🧬",
      badge: "Module 3 of 7",
      title: "How does GenAI 'learn'?",
      highlightWord: "'learn'?",
      subtitle: "Understand how AI outputs are shaped by training data — and what that means for quality and transparency.",
      learningPoints: [
        "📦 Where AI's knowledge comes from — and its limits",
        "🔲 Why AI outputs lack transparency (the black box problem)",
        "🧐 How to critically assess AI responses like an editor"
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
      title: "Where does AI's knowledge come from?",
      subtitle: "If AI learned from the internet… it learned from the good stuff and the bad stuff.",
      messages: [
        {
          text: "GenAI models are trained on massive datasets — text from websites, books, articles, forums, and more. That data shapes everything: what the model knows, how it talks, and what it gets wrong. 📦",
          mood: "default"
        },
        {
          text: "The phrase 'garbage in, garbage out' applies here. Biased, incomplete, or outdated training data means biased, incomplete, or outdated outputs. The model can't flag its own gaps — it just responds with what it has.",
          mood: "thinking"
        },
        {
          text: "Dev asked AI about recent research in his field. The model gave a confident summary — but missed two years of key developments entirely. It didn't say 'I might be out of date.' It just answered. That's the problem. 😬",
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
      question: "Why did Dev get an outdated summary?",
      options: [
        { text: "He asked the question in the wrong way", correct: false },
        { text: "The AI made up the information", correct: false },
        { text: "The model's training data had a cutoff, so it lacked recent knowledge", correct: true },
        { text: "AI doesn't work well for research topics", correct: false }
      ],
      hints: [
        "It's not about how he asked — it's about what the model knows.",
        "All GenAI models have a knowledge cutoff date.",
        "Pick the option about the model lacking recent information entirely."
      ],
      correctFeedback: "Right! All GenAI models have a knowledge cutoff. They can't know what they weren't trained on — and they won't always tell you.",
      wrongFeedback: "The issue isn't how Dev asked — the model simply had no knowledge of developments after its training cutoff date.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What's in the black box?",
      subtitle: "Ever tried to find where an AI response actually came from? Good luck.",
      messages: [
        {
          text: "Unlike search engines, most GenAI tools don't show you where a specific claim came from, how confident the model actually is, or why it gave you that particular response. 🔲",
          mood: "thinking"
        },
        {
          text: "This is the 'black box' problem — you get an output, but the reasoning is invisible. Some tools add citations — but those can be hallucinated too.",
          mood: "default"
        },
        {
          text: "Aisha tried to fact-check an AI paragraph for a classmate. There was no source trail. When she searched independently, she found conflicting information. No transparency means verification falls entirely on you — that's a skill worth building. 💡",
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
      question: "Aisha couldn't trace the AI's claim to a source. What does this mean for users?",
      options: [
        { text: "The claim is definitely wrong", correct: false },
        { text: "The AI must have made it up", correct: false },
        { text: "Users carry the responsibility for verifying claims they can't trace", correct: true },
        { text: "The AI tool needs to be updated", correct: false }
      ],
      hints: [
        "Not being able to trace it doesn't mean it's wrong — but it does shift responsibility.",
        "Think about what lack of transparency means for the user.",
        "Pick the option about the verification burden falling on you."
      ],
      correctFeedback: "Exactly! Lack of transparency shifts the verification burden to the user. That's a skill, not just a technical problem.",
      wrongFeedback: "An untraceable claim isn't automatically wrong or fabricated — but you can't assume it's right either. Verification is your responsibility.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Critically assessing GenAI outputs",
      subtitle: "Think of yourself as an editor, not a reader.",
      messages: [
        {
          text: "Don't just accept what's on the page — question it. Treat AI responses as a first draft, not a final answer. Ask: does this claim seem plausible? Can I find it elsewhere? 🧐",
          mood: "default"
        },
        {
          text: "Be especially sceptical of specific details: numbers, names, quotes, dates. Know your tool — does it have a knowledge cutoff? Does it cite sources?",
          mood: "thinking"
        },
        {
          text: "Jordan got an AI summary for a seminar. Instead of reading passively, he flagged specific claims to check. He found one was outdated. Same AI output. Different mindset. Much better result. 🎯",
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
      question: "Which type of claim most warranted checking in Jordan's scenario?",
      options: [
        { text: "Specific numbers, dates, and named facts", correct: true },
        { text: "General topic introductions", correct: false },
        { text: "Explanations of broad concepts", correct: false },
        { text: "Suggested discussion questions", correct: false }
      ],
      hints: [
        "Think about where hallucinations and outdated info tend to hide.",
        "Broad concepts are lower-risk. What's higher-risk?",
        "Pick the option about precise, verifiable details."
      ],
      correctFeedback: "Right! Specific details — figures, names, dates — are exactly where hallucinations and outdated info tend to hide.",
      wrongFeedback: "Broad concepts and discussion questions carry less risk. It's the specific, verifiable details — numbers, names, dates — that need checking.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 3 Complete!",
      highlightWord: "Complete!",
      subtitle: "You now understand where AI knowledge comes from — and how to evaluate it critically.",
      takeaways: [
        "GenAI is trained on massive datasets with a cutoff date — it can't know what happened after.",
        "The black box problem means you can't see the reasoning or sources behind a response.",
        "Citations in AI responses can be hallucinated — always verify independently.",
        "Approach AI like an editor: question specific details, flag time-sensitive claims, verify before trusting."
      ],
      badges: [
        { emoji: "🔍", name: "Source Skeptic" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module3Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "Why did Dev get an outdated summary?",
      options: [
        { text: "He asked the question in the wrong way", correct: false },
        { text: "The AI made up the information", correct: false },
        { text: "The model's training data had a cutoff, so it lacked recent knowledge", correct: true },
        { text: "AI doesn't work well for research topics", correct: false }
      ],
      hints: [
        "It's not about how he asked — it's about what the model knows.",
        "All GenAI models have a knowledge cutoff date.",
        "Pick the option about the model lacking recent information entirely."
      ],
      correctFeedback: "Right! All GenAI models have a knowledge cutoff. They can't know what they weren't trained on — and they won't always tell you.",
      wrongFeedback: "The issue isn't how Dev asked — the model simply had no knowledge of developments after its training cutoff date.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student asks AI about a law that changed last year. Why might the response be unreliable?",
      options: [
        { text: "The model may not have been trained on information past a certain date", correct: true },
        { text: "AI isn't designed for legal topics", correct: false },
        { text: "Laws are too complex for AI to summarize", correct: false },
        { text: "The student should have been more specific", correct: false }
      ],
      hints: [
        "Think about what the model knows — and when it stopped learning.",
        "It's not about the topic type or how the question was phrased.",
        "Pick the option about the training cutoff."
      ],
      correctFeedback: "Exactly! GenAI has a training cutoff — anything that changed after that date won't be reflected in its responses.",
      wrongFeedback: "The issue isn't the topic or the phrasing — GenAI simply may not know about changes that happened after its training cutoff.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What's the best way to handle time-sensitive research when using GenAI?",
      options: [
        { text: "Trust the AI if the response sounds current", correct: false },
        { text: "Ask the AI when it was last updated", correct: false },
        { text: "Verify recent developments through up-to-date sources independently", correct: true },
        { text: "Avoid using AI for research altogether", correct: false }
      ],
      hints: [
        "AI can't reliably flag its own knowledge gaps.",
        "Asking the AI about itself won't give you a reliable answer.",
        "Pick the option that involves going to current sources directly."
      ],
      correctFeedback: "Right! AI can't flag its own gaps in knowledge. For anything time-sensitive, always cross-check with current sources.",
      wrongFeedback: "AI can't reliably verify its own currency — for time-sensitive research, always verify against up-to-date independent sources.",
      xpReward: 50
    }
  }
];

export const module3Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Aisha couldn't trace the AI's claim to a source. What does this mean for users?",
      options: [
        { text: "The claim is definitely wrong", correct: false },
        { text: "The AI must have made it up", correct: false },
        { text: "Users carry the responsibility for verifying claims they can't trace", correct: true },
        { text: "The AI tool needs to be updated", correct: false }
      ],
      hints: [
        "Not being able to trace it doesn't mean it's wrong — but it does shift responsibility.",
        "Think about what lack of transparency means for the user.",
        "Pick the option about the verification burden falling on you."
      ],
      correctFeedback: "Exactly! Lack of transparency shifts the verification burden to the user. That's a skill, not just a technical problem.",
      wrongFeedback: "An untraceable claim isn't automatically wrong or fabricated — but you can't assume it's right either. Verification is your responsibility.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What is the 'black box' problem with GenAI?",
      options: [
        { text: "AI tools are too expensive for most users", correct: false },
        { text: "Users can't see the reasoning or sources behind a model's outputs", correct: true },
        { text: "AI responses are often too technical to understand", correct: false },
        { text: "AI works better for some subjects than others", correct: false }
      ],
      hints: [
        "It's not about cost or technical language.",
        "Think about what's hidden when you receive an AI response.",
        "Pick the option about not seeing the reasoning behind outputs."
      ],
      correctFeedback: "Right! Transparency is limited by design. You get a response — but not the reasoning behind it.",
      wrongFeedback: "The black box problem is specifically about transparency — you can't see how the model arrived at its response.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "A GenAI tool provides citations alongside its response. Should a student trust them?",
      options: [
        { text: "Yes — citations mean the information is verified", correct: false },
        { text: "Only if there are more than three sources listed", correct: false },
        { text: "Not automatically — citations can be hallucinated just like any other detail", correct: true },
        { text: "Yes — tools that cite sources are more advanced and reliable", correct: false }
      ],
      hints: [
        "The number of sources doesn't matter if they're fabricated.",
        "Citations are just another type of detail AI generates.",
        "Pick the option that treats citations with the same scepticism as any other claim."
      ],
      correctFeedback: "Right! Citations can look legitimate and still be fabricated. Always verify sources independently, even when they're provided.",
      wrongFeedback: "Citations don't guarantee accuracy — they can be hallucinated just like any other detail. Always verify them independently.",
      xpReward: 50
    }
  }
];

export const module3Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Which type of claim most warranted checking in Jordan's scenario?",
      options: [
        { text: "Specific numbers, dates, and named facts", correct: true },
        { text: "General topic introductions", correct: false },
        { text: "Explanations of broad concepts", correct: false },
        { text: "Suggested discussion questions", correct: false }
      ],
      hints: [
        "Think about where hallucinations and outdated info tend to hide.",
        "Broad concepts are lower-risk. What's higher-risk?",
        "Pick the option about precise, verifiable details."
      ],
      correctFeedback: "Right! Specific details — figures, names, dates — are exactly where hallucinations and outdated info tend to hide.",
      wrongFeedback: "Broad concepts and discussion questions carry less risk. It's the specific, verifiable details — numbers, names, dates — that need checking.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "What does it mean to approach AI like an editor?",
      options: [
        { text: "Fixing grammar and spelling in AI responses", correct: false },
        { text: "Rewriting AI outputs in your own words before submitting", correct: false },
        { text: "Actively questioning, checking, and improving what AI produces rather than accepting it", correct: true },
        { text: "Only using AI for creative tasks where accuracy doesn't matter", correct: false }
      ],
      hints: [
        "An editor does more than fix grammar — think about their mindset.",
        "It's not just about rewriting — it's about critical evaluation.",
        "Pick the option about questioning and verifying rather than passively accepting."
      ],
      correctFeedback: "Exactly! An editor's mindset keeps you critical and in control — not just a passive consumer of whatever the model generates.",
      wrongFeedback: "Editing isn't just about grammar or rewording — it's an active, questioning mindset that challenges and verifies what you're given.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "A student gets an AI summary on a topic they know nothing about. Why is this riskier than if they were already familiar?",
      options: [
        { text: "AI performs worse when the user is less knowledgeable", correct: false },
        { text: "They have no baseline to judge whether the response is plausible or not", correct: true },
        { text: "They are more likely to ask the question incorrectly", correct: false },
        { text: "AI summaries are only reliable for topics the user already understands", correct: false }
      ],
      hints: [
        "The AI's output doesn't change based on what the user knows.",
        "Think about what prior knowledge lets you do when reading AI output.",
        "Pick the option about having no way to spot errors."
      ],
      correctFeedback: "Right! Prior knowledge helps you spot red flags. When you're starting from scratch, errors are much harder to catch — making verification even more important.",
      wrongFeedback: "AI doesn't adjust based on user knowledge — the risk is that without prior knowledge, you have no way to judge whether the response is plausible.",
      xpReward: 50
    }
  }
];

export const MODULE3_SECTION_VARIANT_COUNT = 3;
