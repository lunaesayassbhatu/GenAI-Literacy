import type { Step } from "../moduleStepsData";

export const module4Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🌍",
      badge: "Module 0",
      title: "What is GenAI literacy?",
      highlightWord: "GenAI literacy?",
      subtitle: "AI literacy is becoming an increasingly important skillset for everyone to learn.",
      learningPoints: [
        "🙋 What GenAI literacy means",
        "🌐 Who can benefit from GenAI literacy and why it might matter to you",
        "⚠️ What happens when people don’t use AI or trust it blindly",
        "🌱 How to build your own AI literacy over time"
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
      title: "GenAI literacy is an important skill.",
      subtitle: "What is it? And why should you care?",
      messages: [
        {
          text: "As AI becomes further integrated into our lives, it is important to develop the ability to use GenAI in a useful and safe way. GenAI is present in many of the tools that we use, like our search engines, virtual assistants, social media sites, and streaming platforms. Developing GenAI literacy allows you to better understand how GenAI works, what data GenAI collects, how GenAI use might influence behavior (your own and others), and how to promote ethical GenAI use. Additionally, AI skills are becoming increasingly relevant in the workforce and in academic contexts. By developing your AI literacy skills now, you can be better equipped to know if, when, and how to use it.",
          mood: "default"
        },
        {
          text: "GenAI literacy includes the essential knowledge and skills to understand, interact with, and evaluate AI outputs. It is not a skill reserved for people in tech, but should be (and can be!) learned by everyone.",
          mood: "hint"
        },
        {
          text: "Researchers have developed a few varying frameworks for identifying the components of AI literacy. Just like GenAI, AI literacy is still a new and developing concept. Here are some of the major pieces of AI literacy that have been identified so far:",
          mood: "thinking"
        }
      ]
    }
  },
  {
    type: "framework-table",
    data: {
      section: "1 of 3",
      title: "What is Generative AI Literacy?",
      columns: [
        {
          title: "Understanding what GenAI is and how it works",
          tone: "maroon",
          items: [
            "Recognizing GenAI in the world",
            "Understanding different types of GenAI",
            "Understanding GenAI strengths and weaknesses",
            "Knowing how GenAI models are built and trained"
          ]
        },
        {
          title: "Knowing how to effectively use GenAI",
          tone: "grey",
          items: [
            "Knowing how to effectively prompt and communicate with GenAI",
            "Understanding humans’ role in GenAI",
            "Understanding the different uses of GenAI",
            "Understanding how to interpret GenAI responses",
            "Knowing when to avoid GenAI"
          ]
        },
        {
          title: "Navigating the ethics of GenAI",
          tone: "gold",
          items: [
            "Understanding the potential for bias and privacy concerns of GenAI",
            "Being aware of the environmental impacts of GenAI",
            "Examining the values and assumptions embedded in AI",
            "Being able to reflect on your own role within the GenAI ecosystem"
          ]
        }
      ],
      links: [
        { label: "https://ciddl.org/conceptualizing-ai-literacy-a-critical-skill-for-the-21st-century/", url: "https://ciddl.org/conceptualizing-ai-literacy-a-critical-skill-for-the-21st-century/" },
        { label: "https://crln.acrl.org/index.php/crlnews/article/view/26704/34626", url: "https://crln.acrl.org/index.php/crlnews/article/view/26704/34626" }
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "GenAI literacy is an important skill.",
      subtitle: "What is it? And why should you care?",
      messages: [
        {
          text: "Aisha is encountering GenAI more everyday. She is unsure how to use it and if it is a technology that is even applicable to her. In one of her classes, her professor introduces the idea of GenAI literacy, and stresses that GenAI literacy is an important skill for everyone to learn. Aisha decides that she should develop her own AI literacy, and starts by educating herself about what GenAI is and trying to understand whether and how she might want to apply it in her own life, including understanding the potential benefits and harms",
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
      question: "Which best describes AI literacy?",
      options: [
        { text: "A technical skill that can only be learned through rigorous training", correct: false, feedback: "AI literacy isn't reserved for people in tech. It can be learned by everyone." },
        { text: "A mindset that AI is a threat to be avoided, so the safest approach is to limit its use whenever possible", correct: false, feedback: "AI literacy isn't about avoiding AI. It's about knowing if, when, and how to use it." },
        { text: "A one-time certification that, once earned, covers all current and future AI tools", correct: false, feedback: "AI keeps changing, so AI literacy isn't a one-time certification. It's an ongoing process." },
        { text: "The ability to write code and build AI models from scratch", correct: false, feedback: "You don't need to build AI to be AI literate. AI literacy is about understanding, using, and evaluating it." },
        { text: "A skill that can be developed over time that includes core competencies like understanding what AI is, how it works, how to use it, and potential ethical considerations", correct: true }
      ],
      hints: [
        "AI literacy is not reserved for people in tech.",
        "Think about whether AI literacy is something you finish once or keep building.",
        "Pick the option that mentions understanding, using, and the ethical side of AI."
      ],
      correctFeedback: "Right! AI literacy is a skill that you can develop over time, covering what AI is, how it works, how to use it, and its ethical considerations.",
      wrongFeedback: "AI literacy isn't a technical-only skill, a one-time certificate, or a reason to avoid AI. It's a skill that can be developed over time.",
      xpReward: 30
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What happens when people stay on the sidelines?",
      subtitle: "When GenAI literacy gets treated as a tech specialty and not something everyone should engage with, the consequences might impact you and society around you.",
      messages: [
        {
          text: "AI literacy is not limited to specific technical experts. You don’t need to know how a car engine works to be a good driver, and the same idea applies here. You don’t need a comprehensive knowledge of the inner workings of AI to be an effective AI user.",
          mood: "default"
        },
        {
          text: "Additionally, there is a risk when many people disengage from AI: passive consumption rises, a narrow group shapes the tool for everyone, and critical voices from education, healthcare, law, and the arts get left out.",
          mood: "thinking"
        },
        {
          text: "To put this in perspective, imagine if your school made decisions only based on the feedback from one group of students, like only business majors or only physics majors. This could lead to decisions that only benefit the people who are making them, leaving out other important groups.",
          mood: "hint"
        },
        {
          text: "Dev is surprised to find that some of his non-technical friends are the most thoughtful AI users he knows. His roommate, a journalism student, excels at spotting AI-generated misinformation. A peer in his group project, a political science student, questions who benefits from automated decisions and who doesn't. Diverse perspectives make for better AI literacy.",
          mood: "celebrate"
        },
        {
          text: "AI literacy does not require a coding expert, it only requires thoughtful individuals who are willing to educate themselves, ask questions, and think critically. For example:",
          mood: "default"
        },
        {
          scenario: true,
          text: "John was using his AI tool to get sources for a paper he was writing. After completing the second module of this resource, he realized that he shouldn't just trust the sources he gets from the tool, but needs to check elsewhere (e.g., google scholar) or ask the tool to provide citations (and then check them), before relying on these sources for assignments. When he went back to check the AI-provided citations, he realized that a few of them cited sources that didn’t exist.",
          mood: "celebrate"
        },
        {
          text: "Jordan was using their GenAI tool like it was google, thinking they can just find answers to any questions. But after doing module 3 about how GenAI trains and produces outputs, they realized that GenAI generates answers, rather than finding them, which means that they may or may not be true. Jordan now knows that the tool can't be used exactly like a search engine, so they modified their use accordingly.",
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
      multiSelect: true,
      question: "What’s the risk when non-technical people assume AI isn’t for them? (check all that apply)",
      options: [
        { text: "AI tools become less effective without diverse users", correct: false, feedback: "The risk described in this module isn't that the tools become less effective. It's about what happens to the people who opt out, and to who shapes the tools." },
        { text: "They may become passive consumers rather than informed, critical users", correct: true, partialFeedback: "Yes! Opting out can turn people into passive consumers. But there's another risk to find." },
        { text: "They may experience GenAI harms (bad advice, face academic integrity issues, unknowingly do things that do not align with their values)", correct: true, partialFeedback: "Yes! Without literacy, people are more exposed to GenAI harms. But there's another risk to find." },
        { text: "Technical users end up doing more work", correct: false, feedback: "That isn't one of the risks this module describes." },
        { text: "AI development slows down", correct: false, feedback: "That isn't one of the risks this module describes." }
      ],
      hints: [
        "Think about what happens to the people who opt out.",
        "Two of the options are about people becoming passive and being exposed to harms.",
        "The options about technical users doing more work and AI development slowing down aren't the risks described."
      ],
      partialFeedback: "You're on the right track! There's still one more risk to find. Look through the options again.",
      correctFeedback: "Exactly! People who opt out may become passive consumers, and they may experience GenAI harms.",
      wrongFeedback: "The risks are about the people who opt out: becoming passive consumers rather than critical users, and experiencing GenAI harms.",
      xpReward: 40
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "2",
      number: "3",
      question: "Which person demonstrates GenAI literacy?",
      options: [
        { text: "A journalism student who identifies AI-generated misinformation in news articles", correct: true },
        { text: "A developer who builds machine learning tools", correct: false, feedback: "Building AI tools is a technical skill, and GenAI literacy is about understanding, using, and evaluating AI. A developer can be literate, but building tools alone doesn't show it." },
        { text: "A data scientist who trains language models", correct: false, feedback: "Training models is a technical skill. GenAI literacy is about critical use, not technical background." },
        { text: "An engineer who works on AI safety systems", correct: false, feedback: "That's a technical role. GenAI literacy is about critical use, not technical background." }
      ],
      hints: [
        "GenAI literacy is about critical use, not technical background.",
        "Three of the options are technical roles. One is about evaluating AI outputs.",
        "Pick the person who is critically evaluating what AI produces."
      ],
      correctFeedback: "Right! GenAI literacy is about critical use. Spotting AI-generated misinformation is a great example, and it doesn't require a technical background.",
      wrongFeedback: "GenAI literacy is about critical use, not technical background. The journalism student who spots AI-generated misinformation shows it.",
      xpReward: 40
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Building your GenAI literacy",
      subtitle: "You’re off to a great start, let’s keep improving!",
      messages: [
        {
          text: "How can you develop your GenAI literacy? You can start by exploring resources (like this one!). There are also other sources of information out there, some of which are linked throughout this resource.",
          mood: "default"
        },
        {
          text: "Understand what Gen AI is, how it works, and who built it. Learn how to effectively use GenAI and experiment with different models, assessing their outputs as you go. Educate yourself about the ethical implications of GenAI, and consider your place and role within it.",
          mood: "hint"
        }
      ]
    }
  },
  {
    type: "web-map",
    data: {
      section: "3 of 3",
      title: "Generative AI & Ethical Issues",
      subtitle: "Every one of these issues connects back to how GenAI is built and used.",
      center: "Generative AI",
      // Listed clockwise from the top; colours just keep neighbouring circles apart.
      nodes: [
        { lines: ["Perpetuating", "Bias and", "Discrimination"], tone: "maroon" },
        { lines: ["Misinformation", "(hallucinations", "& deep fakes)"], tone: "pink" },
        { lines: ["Academic", "Integrity"], tone: "teal" },
        { lines: ["Use of", "Intellectual", "Property"], tone: "gold" },
        { lines: ["Human", "Labor"], tone: "maroon" },
        { lines: ["Data Safety", "and Privacy", "Concerns"], tone: "teal" },
        { lines: ["Environmental", "Impact"], tone: "gold" },
        { lines: ["Personal", "Integrity"], tone: "pink" },
        { lines: ["Sycophancy &", "encouraging", "harmful", "behavior"], tone: "gold" },
        { lines: ["Black Box", "and", "Transparency"], tone: "maroon" },
        { lines: ["AI", "Companies"], tone: "teal" }
      ],
      links: [
        { label: "https://guides.library.ualberta.ca/generative-ai/ethics", url: "https://guides.library.ualberta.ca/generative-ai/ethics" }
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Building your GenAI literacy",
      subtitle: "You’re off to a great start, let’s keep improving!",
      messages: [
        {
          text: "GenAI literacy is an ongoing process. AI is changing fast, and staying literate means staying curious.",
          mood: "default"
        },
        {
          text: "It is important to build and grow your GenAI literacy habits. Ask ‘how does this work?’ before using it. Ask ‘who made this, and what assumptions did they bring?’ When AI surprises you, ask why. Don’t just accept or dismiss it.",
          mood: "hint"
        },
        {
          text: "Aisha follows through on the commitment she made to herself to develop her own AI literacy skills. She reads articles, looks into AI prompting tips, and watches videos by experts. By the end of it, she feels like she has a pretty good grasp of AI literacy. But, she recognizes the ever-changing atmosphere of GenAI and knows she needs to remain up to date as new advancements are made. She keeps an eye out for news articles, actively listens to other’s experience with GenAI, and continues to consider all the implications her use of GenAI might have.",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "4",
      multiSelect: true,
      question: "Which person best represents treating GenAI Literacy as an ongoing process? (Select all that apply).",
      options: [
        { text: "Herb takes an AI course required at his job, gets a certificate, and takes no further actions.", correct: false, feedback: "A one-time course with no follow-up isn't an ongoing process." },
        { text: "Jasmine learns some information about GenAI on social media. She decides to educate herself more about it by looking at reliable sources. Whenever she has any other questions about GenAI, she does her research.", correct: true, partialFeedback: "Yes! Jasmine keeps learning and goes to reliable sources whenever she has questions. But there's another person to find." },
        { text: "Leo starts using GenAI to help him with his schoolwork, but he gets some outputs that don’t make a lot of sense. He looks into why this happens, and then learns a better way to use GenAI. He continues to keep up to date with GenAI advancements.", correct: true, partialFeedback: "Yes! Leo investigates why it happened and keeps up to date. But there's another person to find." },
        { text: "Marie starts using GenAI to help her in her school and personal life. She uses the tool often, but doesn’t understand much about how it works.", correct: false, feedback: "Using a tool often isn't the same as building literacy. Marie doesn't try to understand how it works." }
      ],
      hints: [
        "An ongoing process means you keep learning, not just that you keep using the tool.",
        "Look for people who investigate and keep up to date.",
        "A one-time course and frequent use without understanding are not ongoing learning."
      ],
      partialFeedback: "You're on the right track! There's still one more person to find. Look through the options again.",
      correctFeedback: "Exactly! Jasmine and Leo both keep learning, check reliable sources, and keep up to date. That's an ongoing process.",
      wrongFeedback: "Herb stops after a one-time course, and Marie uses the tool without understanding it. An ongoing process means continuing to learn and stay curious.",
      xpReward: 40
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 0 Complete!",
      highlightWord: "Complete!",
      subtitle: "You now have a better understanding of GenAI literacy and are more equipped to engage AI critically, regardless of your background.",
      takeaways: [
        "GenAI literacy includes the essential knowledge and skills to understand, interact with, and evaluate GenAI use and outputs.",
        "GenAI literacy is about critical use, not technical background.",
        "When people completely opt out of educating themselves about GenAI, they become passive consumers who are more vulnerable to misinformation.",
        "Diverse perspectives about GenAI across fields are essential for holding AI accountable, ensuring a variety of voices are heard, and preventing one narrow group from making decisions for everyone.",
        "GenAI literacy is a practice, not a destination. Stay curious and keep learning and questioning!"
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
