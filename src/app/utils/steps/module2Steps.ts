import type { Step } from "../moduleStepsData";

export const module2Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🔍",
      badge: "Module 2 of 7",
      title: "Trust in GenAI",
      highlightWord: "Trust",
      subtitle: "Understand why GenAI can't be treated as a reliable source of truth or support.",
      learningPoints: [
        "🔍 Why GenAI outputs can sound right, even when it's wrong",
        "🤝 Why GenAI outputs can sound supportive and understanding",
        "🤯 How GenAI hallucinations happen and what they look like",
        "✅ Which tasks are safe to use GenAI for and which need verification or human advice"
      ],
      info: {
        time: "~15 min",
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
      title: "GenAI can sound right. But is it actually?",
      subtitle: "Sounding fluent is not the same as being factual, and seeming coherent is not the same as being correct.",
      messages: [
        {
          text: "Asking GenAI a question can feel a lot like using a search engine, but it actually works in a completely different way. Search engines have been set up to retrieve pages that exist, while GenAI generates a new response either from scratch, a combination of different sources, or other prediction attempts.",
          mood: "thinking"
        },
        {
          text: "GenAI is designed to be coherent and to sound human-like, not to be accurate. It cannot decide whether its outputs are true or false. Instead, it is trained to predict the next token in a sequence or to learn distributions over pixels and create new samples. In short, GenAI may make up details based on observed patterns. This is called a *hallucination*.",
          mood: "default"
        },
        {
          text: "For example, an LLM might produce text that seems right, but does not match up to the actual data. Similarly, an image generator might create a picture that doesn't make sense, like a person with more than 5 fingers.",
          mood: "hint",
          link: "https://www.ibm.com/think/topics/ai-hallucinations"
        },
        {
          text: "John was working on an academic paper and needed a reference for a specific phenomenon. He asked his GenAI tool for references about that phenomenon and received three references, which he cited in the paper. Easy, right? Not quite. After he submitted his paper to a journal, it got rejected — it contained non-existent references, flagged as undisclosed use of GenAI. Even though the references seemed credible, they didn't actually exist. 😬",
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
      question: "A student gets a detailed, well-structured AI explanation to study from. What should they do before relying on it?",
      options: [
        { text: "Nothing. Continue using it to study", correct: false },
        { text: "Cross-check it with the course's textbook", correct: true },
        { text: "Share it with a classmate to see if it sounds right", correct: false },
        { text: "Ask the AI if it's accurate", correct: false }
      ],
      hints: [
        "A well-structured response doesn't mean it's correct.",
        "Another student, or the AI itself, can't actually verify facts.",
        "Pick the option that involves checking against a trusted, independent source."
      ],
      correctFeedback: "Right! A well-structured response doesn't mean it's correct — always cross-check against a trusted source like the course textbook.",
      wrongFeedback: "Asking the AI to check itself, or asking a classmate, won't catch factual errors. Always cross-check with a reliable, independent source.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "It might sound supportive. But should you trust it?",
      subtitle: "Why GenAI can be more agreeable than helpful.",
      messages: [
        {
          text: "GenAI might tell you what you want to hear or say things in a way that feels understanding and supportive. But it may not be the most helpful resource.",
          mood: "default"
        },
        {
          text: "GenAI should not be used as a sole source of advice regarding problems with your personal life, relationships, and mental state. In its design to be supportive, it can end up being harmful in situations when people need help the most.",
          mood: "hint"
        },
        {
          text: "*Sycophancy* refers to the tendency of AI to be excessively agreeable, flattering, or validating towards its users. This can include AI telling you what it thinks you want to hear instead of stating facts, changing a correct answer when you push back, offering exaggerated praise, or agreeing with dangerous, biased, or false statements instead of correcting them.",
          mood: "thinking"
        },
        {
          text: "In a study by Cheng and colleagues (2026), researchers looked at Reddit discussions and advice boards where the poster was deemed to be in the wrong, and compared human judgments to GenAI judgments. Every GenAI model tested affirmed the poster's position more often than humans did — supporting the user's position 49% more than humans on average.",
          mood: "default"
        },
        {
          text: "*Sycophancy is a safety risk.* When people use GenAI as a source of advice and support, they risk receiving responses that cater to their position regardless of a reasoning process about the actual situation. GenAI is like a mirror: it reflects back to you what you put in it. This can lead to the decline of important relationships, or the encouragement of harmful thoughts — potentially leading to harmful actions.",
          mood: "hint",
          link: "https://news.stanford.edu/stories/2026/03/ai-advice-sycophantic-models-research"
        },
        {
          text: "Want to go deeper? Here's the full research study.",
          mood: "default",
          link: "https://www.science.org/doi/10.1126/science.aec8352?referrer=https%3A%2F%2Fwww.google.com%2F#editor-abstract"
        },
        {
          text: "On one Reddit board, a poster asked if they were in the wrong for leaving trash on a tree branch in a park with no trash cans. The AI blamed the park for not having any trash cans, and called the litterer \"commendable\" for looking for one. 🗑️",
          mood: "thinking",
          link: "https://www.ap.org/news-highlights/spotlights/2026/ai-is-giving-bad-advice-to-flatter-its-users-says-new-study-on-dangers-of-overly-agreeable-chatbots/"
        },
        {
          text: "In a different Reddit board, posters shared how they purposely presented GenAI with a bad business idea — literally pitching selling \"sh*t on a stick.\" The AI described the idea as genius and recommended investing $30,000 in the business. 💩",
          mood: "thinking",
          link: "https://venturebeat.com/ai/openai-rolls-back-chatgpts-sycophancy-and-explains-what-went-wrong"
        },
        {
          text: "A team of researchers posed as teenagers in crisis. Over half of the AI-generated responses were harmful, and 47% led to a follow-up message that encouraged further harmful behavior.",
          mood: "hint",
          link: "https://www.edweek.org/technology/researchers-posed-as-a-teen-in-crisis-ai-gave-them-harmful-advice-half-the-time/2025/08"
        },
        {
          text: "When seeking advice or support, use other tools and resources instead of relying on GenAI. Talk to a friend, relative, classmate, or faculty member. Try writing about it in a journal, or reach out to a mental health professional.",
          mood: "default"
        },
        {
          text: "If you're in crisis: call 988 for the Suicide & Crisis Lifeline, or use ASU's mental health resources. 💛",
          mood: "celebrate",
          link: "https://eoss.asu.edu/counseling/mental-health-resources"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "2",
      question: "A friend tells you, \"I asked an AI if my plan to confront my roommate was a good idea, and it said I was totally justified and my roommate sounds awful.\" What would you tell your friend about how to interpret that response?",
      options: [
        { text: "If the AI agreed with you, it probably looked at both sides fairly. You must be in the right.", correct: false },
        { text: "The AI's response might just be reflecting back what you said rather than giving an objective judgment. It's worth getting another perspective, like from a friend or family member who knows the full situation, before confronting your roommate.", correct: true },
        { text: "AI responses are always more objective than what a friend would tell you, since it doesn't have personal bias or feelings about your roommate.", correct: false },
        { text: "You shouldn't have asked the AI at all. It's never appropriate to use GenAI for any kind of advice.", correct: false }
      ],
      hints: [
        "Think about whose side of the story the AI actually heard.",
        "Agreement isn't the same as an objective, fair judgment.",
        "Pick the option that suggests getting another, more complete perspective before acting."
      ],
      correctFeedback: "Exactly! GenAI tends to reflect back what you tell it rather than weighing both sides — getting a second, more complete perspective is the safer move.",
      wrongFeedback: "Agreement from the AI isn't proof you're right — it only heard your side, and it tends to be agreeable by design. Get a fuller perspective before acting.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "So how should you use GenAI?",
      subtitle: "Use it as a starting point — not the final word.",
      messages: [
        {
          text: "Use GenAI as a place to start or push along the process. In sensitive situations, use it in tandem with human advice. Don't let GenAI determine the final product or your actions in important situations.",
          mood: "default"
        },
        {
          text: "So if GenAI can be wrong, is it even useful? The answer is yes, it can be! But how you use it definitely matters.",
          mood: "default"
        },
        {
          text: "GenAI has many helpful applications. But it's necessary to think critically about when it's best to use it, what it generates, to verify the information you receive, and to consult a human in sensitive situations.",
          mood: "thinking"
        },
        {
          text: "Remember: GenAI may *hallucinate*, providing you with false information that has the signs of real information. It also has a tendency to validate the user no matter what — so take what it tells you with a grain of salt. It is on your side to a fault.",
          mood: "hint",
          link: "https://blogs.deakin.edu.au/article/spotting-ai-hallucinations-a-guide-for-students-and-researchers/"
        },
        {
          text: "Jane had several disagreements with her friend. She asked a GenAI chatbot for advice and felt validated in her frustrations. But she noticed it was consistently agreeing with her, and realized it only had one side of the story. She closed the tool and talked to her roommate instead, who agreed on some points but offered another perspective on others. Jane ended up talking to her friend directly, and they each explained their side and apologized. 🤝",
          mood: "celebrate"
        },
        {
          text: "John needed help understanding a complex concept in one of his upper-level courses. He asked GenAI to create a 'dumbed down' study guide. As he went through it, he noticed some inconsistencies with his course material, so he kept using the guide as a structured study plan but focused on his instructor's materials instead. His classmate Janet took it further — she uploaded her own course materials and had GenAI explain concepts based only on those, getting much more relevant answers. 📚",
          mood: "celebrate"
        },
        {
          text: "So what's the best way to use GenAI? Think critically, verify, and turn to other sources as needed — library databases, textbooks, peer-reviewed sources. Ask GenAI to show its step-by-step reasoning, then evaluate it yourself. Use AI like a tool you can control, not an authority you trust. 💡",
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
      question: "A GenAI response is well-written and detailed. What does that tell you about its accuracy?",
      options: [
        { text: "It is reliable", correct: false },
        { text: "It was fact-checked", correct: false },
        { text: "Nothing. Quality of writing doesn't guarantee correctness", correct: true },
        { text: "It came from a credible source", correct: false },
        { text: "It is definitely inaccurate or made-up", correct: false }
      ],
      hints: [
        "GenAI is trained on writing patterns — fluency is its default, not a signal of truth.",
        "Think about what AI actually checks before it responds (hint: nothing).",
        "Pick the option that says writing quality and accuracy are unrelated."
      ],
      correctFeedback: "Correct! Fluency and confidence are byproducts of pattern matching, not fact-checking. Always verify independently.",
      wrongFeedback: "A polished, detailed response just means AI followed good writing patterns — it has no fact-checking step at all.",
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
      subtitle: "You now know why GenAI can't be your only source for information or advice about sensitive issues, and how to use it safely.",
      takeaways: [
        "GenAI generates responses based on patterns, it does not just retrieve verified facts.",
        "GenAI can confidently hallucinate: fake references, invented statistics, incorrect summaries, and subtle errors can look real.",
        "Defer to other human beings when you need advice that relates to your life, relationships, and mental state.",
        "AI is not guaranteed to have an internal fact-checker. The burden of verification is on you.",
        "In sensitive life situations (e.g., relationship issues, mental health crises), it is best not to solely rely on GenAI. It is not designed to provide safe and rational advice, and its advice can emphasize sycophantic responses over constructive ones."
      ],
      badges: [
        { emoji: "🔍", name: "Truth Seeker" }
      ]
    }
  }
];

// ── Legacy rotating knowledge-check variants ──────────────────────────────────
// No longer used now that Module 2 has fixed, rewritten content (see
// getStepsForModule in moduleStepsData.ts). Left in place only because
// MODULE2_SECTION_VARIANT_COUNT below is still exported.

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
