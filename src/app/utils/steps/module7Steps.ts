import type { Step } from "../moduleStepsData";

export const module7Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🌍",
      badge: "Module 7 of 7",
      title: "GenAI and the Environment",
      highlightWord: "Environment",
      subtitle: "Understand the real environmental impact of GenAI — and what it means to be an intentional user.",
      learningPoints: [
        "⚡ The real energy and resource costs behind every AI interaction",
        "📊 What the environmental impact actually looks like — and why it's growing",
        "🎯 How to be an intentional GenAI user without giving it up entirely"
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
      title: "It's not as invisible as it seems",
      subtitle: "Typing a prompt feels weightless. But somewhere, a data center is working hard to answer you.",
      messages: [
        {
          text: "GenAI doesn't run on air. Every time you use it, it requires significant computing power, energy to run and cool data centers, and large amounts of water for cooling systems. Training a large AI model can produce as much carbon as several transatlantic flights — and that's before anyone's even used it. ⚡",
          mood: "thinking"
        },
        {
          text: "Aisha assumes that because she's just typing into a chatbox, her AI use has a pretty small footprint. She's surprised to learn that data centers running GenAI tools consume massive amounts of energy and water — and that usage, not just training, adds up too.",
          mood: "default"
        },
        {
          text: "The interface is simple. What's behind it isn't. Assuming digital = low impact is the mistake. Recognising that GenAI has real, physical resource costs is the first step. 💡",
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
      question: "Why was Aisha wrong to assume her AI use had a small footprint?",
      options: [
        { text: "The computing power behind every AI interaction requires significant energy and resources", correct: true },
        { text: "She was using an outdated AI tool", correct: false },
        { text: "She used AI too frequently", correct: false },
        { text: "Digital tools only have an impact when used for large tasks", correct: false }
      ],
      hints: [
        "The simplicity of a chatbox hides what's running behind it.",
        "Think about what infrastructure is needed to respond to every single query.",
        "Pick the option about energy and resource costs behind every interaction."
      ],
      correctFeedback: "Right! Every interaction with GenAI draws on energy-intensive infrastructure. The simplicity of the interface doesn't reflect the scale of what's running behind it.",
      wrongFeedback: "It's not about frequency or the specific tool — every AI interaction requires significant computing power and energy, regardless of how simple it looks.",
      xpReward: 50
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What does the impact actually look like?",
      subtitle: "'Uses a lot of energy' is easy to brush off. The details are harder to ignore.",
      messages: [
        {
          text: "Carbon emissions: training large AI models can emit as much carbon as multiple transatlantic flights — and every query adds to ongoing emissions. Water consumption: data centers use water to stay cool, and a single conversation can use a surprising amount. As GenAI becomes more widely used, these costs scale with it. 📊",
          mood: "thinking"
        },
        {
          text: "Dev is researching tech sustainability. He's surprised to find that the environmental costs aren't just about training — ongoing use at scale has a measurable impact too. He starts thinking differently about when he reaches for AI versus other tools.",
          mood: "default"
        },
        {
          text: "This isn't about guilt. It's about being informed. Knowing the cost doesn't mean stopping — it means choosing more deliberately. 🎯",
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
      question: "What surprised Dev about the environmental impact of GenAI?",
      options: [
        { text: "That training models is completely carbon neutral", correct: false },
        { text: "That only older AI models have a significant environmental cost", correct: false },
        { text: "That ongoing usage at scale also has a measurable environmental impact, not just training", correct: true },
        { text: "That data centers don't use water", correct: false }
      ],
      hints: [
        "Most people only think about training costs — if they think about it at all.",
        "Think about what happens every time anyone uses GenAI, not just when models are built.",
        "Pick the option about ongoing usage adding to the impact."
      ],
      correctFeedback: "Exactly! Most people think about training costs, if they think about it at all. But usage at scale adds up too — and that's something every user contributes to.",
      wrongFeedback: "Training isn't the only cost — ongoing use at scale also has a measurable environmental impact. Dev was surprised to learn users contribute to this too.",
      xpReward: 50
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Being an intentional user",
      subtitle: "You don't have to stop using AI. But knowing the cost changes how you use it.",
      messages: [
        {
          text: "Being intentional doesn't mean avoiding GenAI. It means using it when it genuinely adds value — not out of habit or convenience — thinking about whether a simpler tool would do the job, and being aware that scale matters. Your usage is one of millions. 🌍",
          mood: "default"
        },
        {
          text: "Jordan used to reach for AI automatically for almost every task. After learning about its footprint, he doesn't stop — but he starts asking himself whether it's actually the right tool. Sometimes it is. Sometimes a quick search or his own thinking does the job just as well.",
          mood: "thinking"
        },
        {
          text: "Intentional use isn't about doing less. It's about doing it with your eyes open. That's the same critical mindset you've been building across every module — apply it here too. 🎯",
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
      question: "What changed about Jordan's AI use after learning about its environmental impact?",
      options: [
        { text: "He stopped using AI altogether", correct: false },
        { text: "He became more deliberate about when and why he reaches for AI", correct: true },
        { text: "He switched to a more eco-friendly AI tool", correct: false },
        { text: "He started using AI less frequently for every type of task", correct: false }
      ],
      hints: [
        "Jordan didn't quit — awareness changed his approach, not his access.",
        "Think about what intentional use looks like in practice.",
        "Pick the option about being more deliberate, not about stopping."
      ],
      correctFeedback: "Right! Awareness doesn't have to mean avoidance. The goal is intentional use — choosing AI when it genuinely helps, not just by default.",
      wrongFeedback: "Jordan didn't stop or switch tools — he became more deliberate about when AI is actually the right choice. That's the goal.",
      xpReward: 50
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 7 Complete!",
      highlightWord: "Complete!",
      subtitle: "You've finished all 7 modules. You're not just an AI user — you're an informed, critical one.",
      takeaways: [
        "GenAI has real physical costs: energy, carbon, and water. The simple interface hides the scale of what's behind it.",
        "Environmental impact comes from training AND ongoing use — and it grows as adoption scales.",
        "Individual usage is one of millions. Collective habits shape the real-world footprint of these systems.",
        "Intentional use means choosing AI when it genuinely helps — not by habit, but by choice."
      ],
      badges: [
        { emoji: "🌍", name: "Conscious AI User" }
      ]
    }
  }
];

// ── Section knowledge-check variants (3 rotating per section) ────────────────

export const module7Section1Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "Why was Aisha wrong to assume her AI use had a small footprint?",
      options: [
        { text: "The computing power behind every AI interaction requires significant energy and resources", correct: true },
        { text: "She was using an outdated AI tool", correct: false },
        { text: "She used AI too frequently", correct: false },
        { text: "Digital tools only have an impact when used for large tasks", correct: false }
      ],
      hints: [
        "The simplicity of a chatbox hides what's running behind it.",
        "Think about what infrastructure is needed to respond to every single query.",
        "Pick the option about energy and resource costs behind every interaction."
      ],
      correctFeedback: "Right! Every interaction with GenAI draws on energy-intensive infrastructure. The simplicity of the interface doesn't reflect the scale of what's running behind it.",
      wrongFeedback: "It's not about frequency or the specific tool — every AI interaction requires significant computing power and energy, regardless of how simple it looks.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "What makes the environmental impact of GenAI significant compared to other digital tools?",
      options: [
        { text: "GenAI uses older, less efficient technology", correct: false },
        { text: "GenAI requires more user devices to run", correct: false },
        { text: "The scale of computing power needed for training and running GenAI models is substantial and growing", correct: true },
        { text: "GenAI stores more data than other tools", correct: false }
      ],
      hints: [
        "It's not about the technology being outdated or the number of devices.",
        "Think about what's different about the sheer scale of what GenAI requires.",
        "Pick the option about the scale of computing power for training and running models."
      ],
      correctFeedback: "Right! It's not just that AI uses resources — it's the scale. Training and running large models demands far more energy and water than most everyday digital tools.",
      wrongFeedback: "It's not about storage or device count — it's the scale of computing power required that sets GenAI apart from most everyday digital tools.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1", number: "1",
      question: "A student thinks that because AI companies are working on sustainability, their own usage doesn't matter. What's the flaw in that thinking?",
      options: [
        { text: "AI companies aren't actually working on sustainability", correct: false },
        { text: "Individual usage across millions of users adds up to a significant collective impact", correct: true },
        { text: "Students use AI too infrequently for it to matter", correct: false },
        { text: "Sustainability efforts only apply to training, not usage", correct: false }
      ],
      hints: [
        "Corporate efforts and individual habits aren't mutually exclusive.",
        "Think about what happens when millions of people each make small choices.",
        "Pick the option about collective impact from individual usage."
      ],
      correctFeedback: "Right! Corporate efforts and individual habits both matter. Millions of users making thoughtless choices adds up — just as millions making intentional ones does too.",
      wrongFeedback: "Corporate sustainability efforts don't cancel out individual impact. Millions of users each making small choices adds up to a significant collective footprint.",
      xpReward: 50
    }
  }
];

export const module7Section2Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "What surprised Dev about the environmental impact of GenAI?",
      options: [
        { text: "That training models is completely carbon neutral", correct: false },
        { text: "That only older AI models have a significant environmental cost", correct: false },
        { text: "That ongoing usage at scale also has a measurable environmental impact, not just training", correct: true },
        { text: "That data centers don't use water", correct: false }
      ],
      hints: [
        "Most people only think about training costs — if they think about it at all.",
        "Think about what happens every time anyone uses GenAI, not just when models are built.",
        "Pick the option about ongoing usage adding to the impact."
      ],
      correctFeedback: "Exactly! Most people think about training costs, if they think about it at all. But usage at scale adds up too — and that's something every user contributes to.",
      wrongFeedback: "Training isn't the only cost — ongoing use at scale also has a measurable environmental impact. Dev was surprised to learn users contribute to this too.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "Why is water consumption a lesser-known environmental cost of GenAI?",
      options: [
        { text: "It only affects regions with water shortages", correct: false },
        { text: "AI companies are required to hide this information", correct: false },
        { text: "Water usage is too small to be worth measuring", correct: false },
        { text: "It happens invisibly in data centers, far removed from the user's experience", correct: true }
      ],
      hints: [
        "Users only see the interface — not what's behind it.",
        "Think about why something that's invisible to users is easy to forget.",
        "Pick the option about physical infrastructure being hidden from users."
      ],
      correctFeedback: "Right! Users only see the interface. The physical infrastructure — including water-intensive cooling systems — is invisible, which makes it easy to overlook.",
      wrongFeedback: "It's not about regional impact or secrecy — water use happens in data centers that are completely invisible to users, making it easy to forget.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2", number: "2",
      question: "A student argues that since AI companies are big polluters, individual users can't make a difference. What's the strongest counterpoint?",
      options: [
        { text: "Individual users pollute more than AI companies", correct: false },
        { text: "AI companies have already solved their emissions problem", correct: false },
        { text: "Collective user habits shape demand, which influences how and how much these systems are run", correct: true },
        { text: "Students don't use AI frequently enough to contribute meaningfully", correct: false }
      ],
      hints: [
        "It's not about individual users vs companies — it's about the relationship between demand and scale.",
        "Think about what drives how much these systems need to run.",
        "Pick the option about collective habits shaping demand."
      ],
      correctFeedback: "Right! Demand drives scale. Users aren't powerless — the choices of millions of people collectively shape how much these systems need to run.",
      wrongFeedback: "Individual users don't outpollute companies, but collective habits drive demand — and demand shapes how much these systems operate.",
      xpReward: 50
    }
  }
];

export const module7Section3Variants: Step[] = [
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "What changed about Jordan's AI use after learning about its environmental impact?",
      options: [
        { text: "He stopped using AI altogether", correct: false },
        { text: "He became more deliberate about when and why he reaches for AI", correct: true },
        { text: "He switched to a more eco-friendly AI tool", correct: false },
        { text: "He started using AI less frequently for every type of task", correct: false }
      ],
      hints: [
        "Jordan didn't quit — awareness changed his approach, not his access.",
        "Think about what intentional use looks like in practice.",
        "Pick the option about being more deliberate, not about stopping."
      ],
      correctFeedback: "Right! Awareness doesn't have to mean avoidance. The goal is intentional use — choosing AI when it genuinely helps, not just by default.",
      wrongFeedback: "Jordan didn't stop or switch tools — he became more deliberate about when AI is actually the right choice. That's the goal.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Which best describes an intentional GenAI user?",
      options: [
        { text: "Someone who avoids AI to minimise their environmental impact", correct: false },
        { text: "Someone who uses AI freely because companies are responsible for sustainability", correct: false },
        { text: "Someone who considers whether AI is the right tool for the task before using it", correct: true },
        { text: "Someone who only uses AI for large or complex tasks", correct: false }
      ],
      hints: [
        "It's not about guilt or avoidance — and it's not about leaving it entirely to companies.",
        "Think about what asking 'is this the right tool?' looks like as a habit.",
        "Pick the option about awareness and choice before each use."
      ],
      correctFeedback: "Exactly! Intentional use is about awareness and choice — not guilt or avoidance. Asking 'is this the right tool?' is a habit worth building.",
      wrongFeedback: "Intentional use isn't about avoiding AI or restricting it to big tasks — it's about pausing to ask whether it's actually the right tool before you reach for it.",
      xpReward: 50
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3", number: "3",
      question: "Why does individual AI usage matter environmentally, even if it feels small?",
      options: [
        { text: "GenAI is used by millions of people, so individual habits contribute to a significant collective footprint", correct: true },
        { text: "Each individual query has a large direct impact on carbon emissions", correct: false },
        { text: "AI tools track and report individual usage to environmental agencies", correct: false },
        { text: "Individual usage affects the quality of AI outputs over time", correct: false }
      ],
      hints: [
        "No single query breaks the planet — but think about what millions of them do.",
        "It's not about direct impact per query, it's about aggregate scale.",
        "Pick the option about collective habits and scale."
      ],
      correctFeedback: "Right! No single query breaks the planet. But GenAI operates at a massive scale — and collective habits shape the real-world impact of these systems.",
      wrongFeedback: "Individual queries don't have large direct impacts — but GenAI runs at a scale where millions of small choices add up to a significant collective footprint.",
      xpReward: 50
    }
  }
];

export const MODULE7_SECTION_VARIANT_COUNT = 3;
