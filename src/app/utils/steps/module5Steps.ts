import type { Step } from "../moduleStepsData";

export const module5Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "⚖️",
      badge: "Module 5 of 7",
      title: "GenAI and Bias",
      highlightWord: "Bias",
      subtitle: "Understand AI bias, unequal representation, and why trust in AI needs to be earned — not assumed.",
      learningPoints: [
        "⚖️ How algorithmic bias shapes AI outputs — even without intent",
        "🏫 Why neither rejecting nor blindly accepting AI serves students well",
        "🔍 How to evaluate AI tools critically and earn trust through evidence"
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
      title: "Not everyone gets the same AI",
      subtitle: "AI outputs reflect the data they were trained on — and that data carries the biases of the world that produced it.",
      messages: [
        {
          text: "This is called algorithmic bias — when patterns in training data cause AI to produce outputs that are skewed, unrepresentative, or unfair. It shows up in ways like: certain names or faces associated with certain roles, some languages handled better than others, and historical inequalities quietly reinforced. ⚖️",
          mood: "thinking"
        },
        {
          text: "Jordan is using an AI writing tool for a creative project. He notices that professional characters are consistently described using certain names and demographics — unless he specifies otherwise. He starts wondering who wasn't well-represented in the training data.",
          mood: "default"
        },
        {
          text: "The AI isn't making a deliberate choice. But the pattern is still there — and worth noticing. Assuming AI outputs are neutral is the mistake. Recognising they reflect the gaps in training data is the skill. 💡",
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
      question: "What does Jordan's observation suggest about the AI tool he's using?",
      options: [
        { text: "The training data likely underrepresented certain groups, shaping the model's defaults", correct: true },
        { text: "The tool was poorly designed", correct: false },
        { text: "Jordan wasn't prompting it correctly", correct: false },
        { text: "Creative writing tools aren't suitable for professional use", correct: false }
      ],
      hints: [
        "The issue isn't Jordan's prompting — it's what the AI defaults to.",
        "Default outputs reveal what was — and wasn't — well represented in training data.",
        "Pick the option about training data and representation."
      ],
      correctFeedback: "Exactly! Default outputs reveal what was — and wasn't — well represented in training data. Noticing this is the first step to pushing back.",
      wrongFeedback: "It's not about prompting or tool design — Jordan's observation points to what was underrepresented in the training data shaping the model's defaults.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "AI in education: a question of trust",
      subtitle: "Some educators distrust AI completely. Others adopt it without question. Both extremes miss the point.",
      messages: [
        {
          text: "On one side — resistance: worries that AI lets students bypass real learning, undermines independent thinking, and is hard to assess fairly. On the other — uncritical adoption: accepting AI outputs without asking whether information is accurate, the framing is fair, or the use is even appropriate. 📢",
          mood: "thinking"
        },
        {
          text: "Aisha's seminar group debates whether AI should be allowed for essay planning. One student says it's cheating. Another says it's just a tool, like spell-check. Aisha lands somewhere in the middle — thinking it depends entirely on how it's used, and that this is exactly the conversation they should be having.",
          mood: "default"
        },
        {
          text: "The most important skill isn't having the answer. It's knowing how to think through the question. 🧠",
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
      question: "Aisha thinks the answer to AI in education depends on how it's used. What does this reflect?",
      options: [
        { text: "She hasn't formed a strong enough opinion yet", correct: false },
        { text: "She is avoiding taking a side to keep the peace", correct: false },
        { text: "She understands that context and critical engagement matter more than blanket rules", correct: true },
        { text: "She thinks AI should only be used in certain subjects", correct: false }
      ],
      hints: [
        "Aisha isn't undecided — she's thought it through.",
        "Neither outright rejection nor uncritical acceptance is the right call.",
        "Pick the option about context and critical engagement."
      ],
      correctFeedback: "Exactly! Neither outright rejection nor uncritical acceptance serves students well — thoughtful, context-aware engagement is the goal.",
      wrongFeedback: "Aisha isn't indecisive or conflict-averse — she understands that blanket rules miss the point. Context and critical engagement matter more.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Earning trust, staying critical",
      subtitle: "Trust in AI — like trust in any source — should be earned through evaluation. Not assumed by default.",
      messages: [
        {
          text: "Questions worth asking about any AI tool: What was it trained on? Who built it, and for what purpose? Does it represent my context, my language, my community? What happens when it gets something wrong? These don't have easy answers — but asking them is exactly what critical AI use looks like. 🔍",
          mood: "default"
        },
        {
          text: "Dev is writing a policy brief and considers using AI to summarise sources. Before he does, he thinks: Is this tool known to handle this topic well? Does it reflect diverse perspectives? What would he do if it produced something biased? He uses it — but keeps those questions live throughout.",
          mood: "thinking"
        },
        {
          text: "Not anti-AI. Just not switching his brain off. That's the goal. The aim across all these modules has been the same: not to make you fear AI, not to make you love it — but to make you think clearly about it. That's AI literacy. 🎯",
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
      question: "Dev uses AI to help with his policy brief but keeps questioning its outputs throughout. What does this demonstrate?",
      options: [
        { text: "He is using AI as a resource while maintaining critical oversight", correct: true },
        { text: "He doesn't trust AI enough to use it effectively", correct: false },
        { text: "He is wasting time by second-guessing a reliable tool", correct: false },
        { text: "He should have chosen a different tool for the task", correct: false }
      ],
      hints: [
        "He chose to use AI — so it's not about distrust.",
        "Staying critical while using a tool isn't inefficiency.",
        "Pick the option about using AI while maintaining judgment."
      ],
      correctFeedback: "Right! Staying critical while using AI isn't a sign of distrust — it's exactly what responsible, literate AI use looks like.",
      wrongFeedback: "Dev isn't wasting time or using the wrong tool — he's using AI as a resource while keeping his judgment active. That's the goal.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 5 Complete!",
      highlightWord: "Complete!",
      subtitle: "You can now spot bias, navigate the AI-in-education debate, and earn trust through evaluation.",
      takeaways: [
        "Algorithmic bias isn't intentional — but its effects are real. Training data shapes what AI produces and who it represents.",
        "Neither banning AI nor accepting it uncritically serves students. Critical, context-aware engagement is the goal.",
        "Trust in AI should be earned through evaluation — not assumed because a machine produced it.",
        "Ask: what was it trained on? Who built it? Does it represent my context? Stay critical throughout."
      ],
      badges: [
        { emoji: "⚖️", name: "Bias Buster" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module5Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What does Jordan's observation suggest about the AI tool he's using?",
      options: [
        { text: "The training data likely underrepresented certain groups, shaping the model's defaults", correct: true },
        { text: "The tool was poorly designed", correct: false },
        { text: "Jordan wasn't prompting it correctly", correct: false },
        { text: "Creative writing tools aren't suitable for professional use", correct: false }
      ],
      hints: [
        "The issue isn't Jordan's prompting — it's what the AI defaults to.",
        "Default outputs reveal what was — and wasn't — well represented in training data.",
        "Pick the option about training data and representation."
      ],
      correctFeedback: "Exactly! Default outputs reveal what was — and wasn't — well represented in training data. Noticing this is the first step to pushing back.",
      wrongFeedback: "It's not about prompting or tool design — Jordan's observation points to what was underrepresented in the training data shaping the model's defaults.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What is algorithmic bias in GenAI?",
      options: [
        { text: "When AI intentionally favours certain users", correct: false },
        { text: "When users misuse AI tools in unfair ways", correct: false },
        { text: "When patterns in training data cause AI outputs to be skewed or unrepresentative", correct: true },
        { text: "When AI produces random errors that affect some topics more than others", correct: false }
      ],
      hints: [
        "Algorithmic bias isn't about intent — it's about what gets learned from data.",
        "Think about where the bias comes from: the AI's choices, or the data it trained on?",
        "Pick the option about patterns in training data producing skewed outputs."
      ],
      correctFeedback: "Right! Bias in AI is inherited from data, not intent. But the real-world impact is still significant.",
      wrongFeedback: "Algorithmic bias isn't intentional or random — it comes from patterns in training data that cause outputs to be skewed or unrepresentative.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student assumes AI outputs are neutral because they're generated by a machine, not a human. What's wrong with that assumption?",
      options: [
        { text: "Machines are actually more biased than humans", correct: false },
        { text: "AI outputs reflect the biases present in the data they were trained on", correct: true },
        { text: "Neutrality depends on how the student phrases their prompt", correct: false },
        { text: "Only some AI tools are affected by bias", correct: false }
      ],
      hints: [
        "Being generated by a machine doesn't automatically mean something is neutral.",
        "Think about where AI knowledge comes from — and what that data contains.",
        "Pick the option about training data carrying bias into outputs."
      ],
      correctFeedback: "Right! Being generated by a machine doesn't make something neutral — bias gets baked in through training data, not intent.",
      wrongFeedback: "Machines don't guarantee neutrality. AI outputs reflect the biases present in the data they were trained on — regardless of who or what produced them.",
      xpReward: 50
    }
  }
];

export const module5Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Aisha thinks the answer to AI in education depends on how it's used. What does this reflect?",
      options: [
        { text: "She hasn't formed a strong enough opinion yet", correct: false },
        { text: "She is avoiding taking a side to keep the peace", correct: false },
        { text: "She understands that context and critical engagement matter more than blanket rules", correct: true },
        { text: "She thinks AI should only be used in certain subjects", correct: false }
      ],
      hints: [
        "Aisha isn't undecided — she's thought it through.",
        "Neither outright rejection nor uncritical acceptance is the right call.",
        "Pick the option about context and critical engagement."
      ],
      correctFeedback: "Exactly! Neither outright rejection nor uncritical acceptance serves students well — thoughtful, context-aware engagement is the goal.",
      wrongFeedback: "Aisha isn't indecisive or conflict-averse — she understands that blanket rules miss the point. Context and critical engagement matter more.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What's the problem with banning AI in education outright?",
      options: [
        { text: "Students fall behind technically", correct: false },
        { text: "It prevents students from developing informed, critical engagement with tools they'll encounter everywhere", correct: true },
        { text: "It makes teaching harder for educators", correct: false },
        { text: "AI tools improve through use, so avoiding them slows development", correct: false }
      ],
      hints: [
        "It's not about technical skills or teaching workload.",
        "Think about what students miss out on when they never engage with AI critically.",
        "Pick the option about losing the opportunity to develop informed engagement."
      ],
      correctFeedback: "Right! Opting out doesn't make students safer — it just means they engage with AI without the skills to do so critically.",
      wrongFeedback: "Banning AI doesn't protect students — it denies them the chance to develop informed, critical engagement with tools they'll encounter everywhere.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What's the problem with uncritical acceptance of AI outputs in education?",
      options: [
        { text: "It creates too much work for students", correct: false },
        { text: "It reduces AI quality over time", correct: false },
        { text: "It makes it harder for educators to give feedback", correct: false },
        { text: "It bypasses the development of judgment, critical thinking, and independent verification", correct: true }
      ],
      hints: [
        "It's not about workload or feedback — it's about what students stop practising.",
        "Think about what skills education is meant to build.",
        "Pick the option about bypassing critical thinking and judgment."
      ],
      correctFeedback: "Right! Accepting AI outputs without evaluation undermines exactly the skills education is meant to build.",
      wrongFeedback: "The problem with uncritical acceptance isn't practical difficulty — it's that it bypasses the development of judgment, critical thinking, and independent verification.",
      xpReward: 50
    }
  }
];

export const module5Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Dev uses AI to help with his policy brief but keeps questioning its outputs throughout. What does this demonstrate?",
      options: [
        { text: "He is using AI as a resource while maintaining critical oversight", correct: true },
        { text: "He doesn't trust AI enough to use it effectively", correct: false },
        { text: "He is wasting time by second-guessing a reliable tool", correct: false },
        { text: "He should have chosen a different tool for the task", correct: false }
      ],
      hints: [
        "He chose to use AI — so it's not about distrust.",
        "Staying critical while using a tool isn't inefficiency.",
        "Pick the option about using AI while maintaining judgment."
      ],
      correctFeedback: "Right! Staying critical while using AI isn't a sign of distrust — it's exactly what responsible, literate AI use looks like.",
      wrongFeedback: "Dev isn't wasting time or using the wrong tool — he's using AI as a resource while keeping his judgment active. That's the goal.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "What does it mean to earn trust in an AI tool rather than assume it?",
      options: [
        { text: "Completing a tutorial before using it", correct: false },
        { text: "Only using tools recommended by experts", correct: false },
        { text: "Actively evaluating what the tool was trained on, who built it, and whether it fits your context", correct: true },
        { text: "Using the tool repeatedly until you understand its patterns", correct: false }
      ],
      hints: [
        "Trust based on familiarity or recommendations isn't the same as trust based on evidence.",
        "Think about what questions help you evaluate whether a tool is suitable.",
        "Pick the option about actively evaluating training, purpose, and context."
      ],
      correctFeedback: "Right! Trust based on evaluation is meaningful. Trust based on assumption is a risk.",
      wrongFeedback: "Tutorials, expert endorsements, and repeated use don't tell you whether an AI tool is suited to your context. Evaluation does.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Which best reflects a critically literate AI user?",
      options: [
        { text: "Someone who avoids AI until it's proven completely accurate", correct: false },
        { text: "Someone who uses AI freely because it's faster than doing research manually", correct: false },
        { text: "Someone who only uses AI for creative tasks where accuracy doesn't matter", correct: false },
        { text: "Someone who uses AI while actively questioning its outputs, limitations, and potential biases", correct: true }
      ],
      hints: [
        "Critical literacy isn't about fear or blind trust.",
        "Think about what staying engaged and in control looks like in practice.",
        "Pick the option about using AI while actively questioning it."
      ],
      correctFeedback: "Exactly! Critical literacy isn't about fear or blind trust — it's about staying engaged, questioning, and in control.",
      wrongFeedback: "Avoidance and uncritical use are both extremes. Critical literacy means using AI while actively questioning its outputs, limitations, and biases.",
      xpReward: 50
    }
  }
];

export const MODULE5_SECTION_VARIANT_COUNT = 3;
