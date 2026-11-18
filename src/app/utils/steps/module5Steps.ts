import type { Step } from "../moduleStepsData";

// Module 4 (internal id "module-5"): GenAI and Bias.
// Built from the page-by-page draft for Halle. Every source has a reference (the magnifying glass shows it) and, where there is a
// web page, a link that opens it. Story characters keep the cast they were written with: Dev, Jordan and Aisha (he, he, she).

// Reference lists for the magnifying glasses. *Asterisks* make the journal or book title italic.
const NIST = {
  link: "https://doi.org/10.6028/NIST.SP.1270",
  citation:
    "Schwartz, R., Vassilev, A., Greene, K., Perine, L., Burt, A., & Hall, P. (2022). *Towards a standard for identifying and managing bias in artificial intelligence* (NIST Special Publication 1270). National Institute of Standards and Technology.",
};
const OBERMEYER = {
  link: "https://chmi.berkeley.edu/news/dissecting-racial-bias-in-an-algorithm-used-to-manage-the-health-of-populations",
  citation:
    "Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science, 366*(6464).",
};
const DANESHJOU = {
  link: "https://pubmed.ncbi.nlm.nih.gov/35960806/",
  citation:
    "Daneshjou, R., et al. (2022). Disparities in dermatology AI performance on a diverse, curated clinical image set. *Science Advances, 8*(32).",
};
const LIANG = {
  link: "https://www.timeshighereducation.com/news/ai-text-detectors-biased-against-non-native-english-speakers?site=cn",
  citation:
    "Liang, W., Yuksekgonul, M., Mao, Y., Wu, E., & Zou, J. (2023). GPT detectors are biased against non-native English writers. *Patterns*.",
};
const WAN = {
  link: "https://arxiv.org/html/2310.09219v5",
  citation:
    "Wan, Y., et al. (2023). \"Kelly is a warm person, Joseph is a role model\": Gender biases in LLM-generated reference letters. *Findings of the Association for Computational Linguistics: EMNLP 2023*.",
};
const AMAZON = {
  link: "https://www.cnbc.com/2018/10/10/amazon-scraps-a-secret-ai-recruiting-tool-that-showed-bias-against-women.html",
  citation:
    "Dastin, J. (2018, October 10). Amazon scraps secret AI recruiting tool that showed bias against women. *Reuters*.",
};

export const module5Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "⚖️",
      badge: "Module 4",
      title: "GenAI and Bias",
      highlightWord: "Bias",
      subtitle: "Understand AI bias, unequal representation, and why trust in AI needs to be earned, not assumed.",
      learningPoints: [
        "⚖️ How algorithmic bias shapes AI outputs, even without intent",
        "🏫 Why neither rejecting nor blindly accepting AI serves students well",
        "🔍 How to evaluate AI tools critically and earn trust through evidence"
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
      title: "Not everyone gets the same AI",
      subtitle: "AI output reflects the data it was trained on, and that data carries the biases of the world that produced it.",
      messages: [
        {
          text: "This is called algorithmic bias: when patterns in training data cause AI to produce outputs that are skewed, unrepresentative, or unfair. Researchers describe three kinds: systemic (built into institutions and society), statistical (gaps or skews in the data), and human (the choices people make). ⚖️",
          mood: "thinking",
          link: NIST.link,
          citation: NIST.citation,
          example: false
        },
        {
          text: "It shows up in ways like: certain names or faces associated with certain roles, some languages handled better than others, and historical inequalities quietly reinforced.",
          mood: "default"
        }
      ]
    }
  },
  {
    type: "web-map",
    data: {
      section: "1 of 3",
      title: "Where can bias enter?",
      subtitle: "Bias can creep in at every stage, from the data to the way a tool is used.",
      center: "Bias in GenAI",
      waveMessage: "Bias doesn't come from one place. Take a look at how many points along the way can shape what a tool produces.",
      nodes: [
        { lines: ["Training", "data"], tone: "maroon" },
        { lines: ["Who labels", "the data"], tone: "pink" },
        { lines: ["Design", "choices"], tone: "teal" },
        { lines: ["Who builds", "the tool"], tone: "gold" },
        { lines: ["How it", "is used"], tone: "maroon" },
        { lines: ["Feedback", "loops"], tone: "pink" }
      ],
      links: [
        {
          label: "NIST Special Publication 1270: Towards a Standard for Identifying and Managing Bias in Artificial Intelligence",
          url: NIST.link
        }
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "Not everyone gets the same AI",
      subtitle: "",
      messages: [
        {
          text: "A hospital algorithm used past health spending to decide which patients needed extra care. On average, less money is spent on Black patients at the same level of illness, so the algorithm scored them as healthier than equally sick white patients, and fewer of them were flagged for extra care. 🏥",
          mood: "hint",
          link: OBERMEYER.link,
          citation: OBERMEYER.citation
        },
        {
          text: "Skin-condition AI models did well in their original tests but did worse on images of dark skin. Researchers found their accuracy score dropped by 27 to 36 percent on a more diverse set of images. A model can look accurate overall and still fail some groups. 🔬",
          mood: "thinking",
          link: DANESHJOU.link,
          citation: DANESHJOU.citation
        },
        {
          text: "Dev is working on a class project and checks the photo dataset his group downloaded. Most of the faces belong to one group of people. He realizes a model trained on it may work better for some people than for others, so he raises it with his group before they build anything.",
          mood: "celebrate"
        },
        {
          text: "The AI isn't making a deliberate choice. But the pattern is still there, and worth noticing. Assuming AI outputs are neutral is the mistake. Recognizing that they reflect the gaps in training data is the skill. 💡",
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
      question: "What is algorithmic bias in GenAI?",
      options: [
        { text: "When AI intentionally favors certain users", correct: false, feedback: "AI doesn't make deliberate choices about users. The skew comes from patterns in the data it learned from." },
        { text: "When users misuse AI tools in unfair ways", correct: false, feedback: "That's about how people use a tool. Algorithmic bias is about patterns inside the tool's training data." },
        { text: "When patterns in training data cause AI outputs to be skewed or unrepresentative", correct: true },
        { text: "When AI produces random errors that affect some topics more than others", correct: false, feedback: "Bias isn't random. It follows patterns in the data, which is why it keeps affecting the same groups." }
      ],
      hints: [
        "Think about where the skew comes from: the AI's intentions or the data it learned from?",
        "Bias isn't about intent and it isn't random. It follows patterns.",
        "Pick the option about patterns in training data."
      ],
      correctFeedback: "Right! Bias in AI is inherited from data, not intent. The impact on people is still real.",
      wrongFeedback: "Algorithmic bias isn't intentional, user misuse, or random. It comes from patterns in training data that cause outputs to be skewed or unrepresentative.",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "2",
      question: "Amazon built a résumé-scoring tool trained on ten years of past résumés, most from men. It began to penalize résumés that included the word “women’s.” Why?",
      options: [
        { text: "Engineers programmed it to prefer men", correct: false, feedback: "Nobody told the tool to do this. It learned the pattern from the data." },
        { text: "It learned patterns from past hiring data that reflected who had been hired before", correct: true },
        { text: "Women’s résumés were shorter than men’s", correct: false, feedback: "Length isn’t what the tool picked up on. It picked up on patterns in who had been hired before." },
        { text: "The tool couldn’t read certain words", correct: false, feedback: "The tool read the words fine. The problem was what it learned to do with them." }
      ],
      hints: [
        "Think about what the tool learned from: ten years of past résumés.",
        "Nobody had to intend it for the pattern to be learned.",
        "Pick the option about learning from past hiring data."
      ],
      correctFeedback: "Right! The tool learned from past data, so it repeated the past. Nobody had to intend it. (Source: Dastin, 2018, Reuters.)",
      wrongFeedback: "Nobody programmed the tool to prefer men. It learned from ten years of past hiring data, most of it from men, and repeated that pattern. (Source: Dastin, 2018, Reuters.)",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "3",
      question: "Why can an AI tool with high overall accuracy still be unfair?",
      options: [
        { text: "Overall accuracy is always calculated wrongly", correct: false, feedback: "The number can be calculated correctly and still hide a problem." },
        { text: "An average can hide groups that the tool gets wrong more often", correct: true },
        { text: "Accurate tools can’t be biased", correct: false, feedback: "A tool can be accurate for most people and still fail some groups, as the skin-condition models did." },
        { text: "Accuracy only matters for image tools", correct: false, feedback: "Accuracy matters for every kind of tool, and so does asking who it works well for." }
      ],
      hints: [
        "Think about the skin-condition models. They scored well overall.",
        "An average blends everyone together.",
        "Pick the option about the average hiding groups."
      ],
      correctFeedback: "Right! An average can hide who a tool fails. That’s why it’s worth asking how a tool performs for different groups.",
      wrongFeedback: "A high overall score is an average, and an average can hide groups the tool gets wrong more often. It's worth asking how a tool performs for different groups.",
      xpReward: 25
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
          text: "On one side, resistance: worries that AI lets students bypass real learning, undermines independent thinking, and is hard to assess fairly. On the other, uncritical adoption: accepting AI outputs without asking whether information is accurate, the framing is fair, or the use is even appropriate. 📢",
          mood: "thinking"
        },
        {
          text: "Tools built to protect fairness in school can be unfair too. Researchers tested seven AI-text detectors on 91 essays written by non-native English speakers for the TOEFL exam. On average, the detectors wrongly flagged 61.3% of them as AI-generated. 🔎",
          mood: "hint",
          link: LIANG.link,
          citation: LIANG.citation
        },
        {
          text: "Jordan sees a classmate whose first language isn't English get a message that her essay “looks AI-generated.” The essay is entirely her own work. Jordan wonders how many other students get flagged for the way they write, not for cheating.",
          mood: "default"
        },
        {
          text: "When researchers asked ChatGPT and another model to write recommendation letters, letters for women described warmth and likability while letters for men emphasized leadership. A busy reader could easily miss that pattern. ✉️",
          mood: "thinking",
          link: WAN.link,
          citation: WAN.citation
        },
        {
          text: "Aisha's seminar group debates whether AI should be allowed for essay planning. One student says it's cheating. Another says it's just a tool, like spell-check. Aisha lands somewhere in the middle, thinking it depends entirely on how it's used, and that this is exactly the conversation they should be having.",
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
      number: "4",
      question: "What's the problem with banning AI in education outright?",
      options: [
        { text: "Students fall behind technically", correct: false, feedback: "The bigger issue isn't technical skill. It's the chance to engage with AI critically." },
        { text: "It prevents students from developing informed, critical engagement with tools they'll encounter everywhere", correct: true },
        { text: "It makes teaching harder for educators", correct: false, feedback: "Teaching workload isn't the main concern here. What students miss out on is." },
        { text: "AI tools improve through use, so avoiding them slows development", correct: false, feedback: "That isn't the concern here. The problem is what students miss, not how the tools improve." }
      ],
      hints: [
        "It's not about technical skills or teaching workload.",
        "Think about what students miss out on when they never engage with AI critically.",
        "Pick the option about losing the chance to develop informed engagement."
      ],
      correctFeedback: "Right! Opting out doesn't make students safer. It just means they meet AI later without the skills to question it.",
      wrongFeedback: "Banning AI doesn't protect students. It denies them the chance to develop informed, critical engagement with tools they'll encounter everywhere.",
      xpReward: 25
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Earning trust, staying critical",
      subtitle: "Trust in AI, like trust in any source, should be earned through evaluation. Not assumed by default.",
      messages: [
        {
          text: "Here are four questions worth asking about any AI tool. Click each one to see why it matters. 🔍",
          mood: "thinking"
        }
      ]
    }
  },
  {
    type: "process",
    data: {
      section: "3 of 3",
      title: "Four questions to ask about any AI tool",
      subtitle: "Click each question to see why it matters.",
      itemWord: "question",
      waveMessage: "These four questions are worth keeping handy. Click each one to read why it matters.",
      steps: [
        {
          icon: "database",
          title: "What was it trained on?",
          summary: "Training data shapes what a tool does well and who it leaves out.",
          paragraphs: [
            "Training data is where an AI tool learns its patterns. If the data leaves out certain groups, languages, or viewpoints, the tool is likely to handle them less well.",
            "Many tools don't share exactly what they were trained on. Not knowing is itself useful information, and a good reason to double-check what they produce."
          ],
          link: NIST.link,
          citation: NIST.citation
        },
        {
          icon: "building",
          title: "Who built it, and for what purpose?",
          summary: "The builders' goals and choices shape the tool.",
          paragraphs: [
            "Every tool reflects choices made by the people and companies behind it: what data to use, what to aim for, and what to test. A tool built to sell products, to teach, or to moderate content will be shaped differently.",
            "Knowing who is behind a tool helps you judge whose needs it was designed around."
          ],
          link: NIST.link,
          citation: NIST.citation
        },
        {
          icon: "people",
          title: "Does it represent my context, my language, my community?",
          summary: "A tool can work well for some people and poorly for others.",
          paragraphs: [
            "AI tools often perform better for the people best represented in their training data. For example, AI-text detectors wrongly flagged non-native English writing as AI-generated far more often than native writing.",
            "Ask whether the tool has been tested with people, languages, and situations like yours."
          ],
          link: LIANG.link,
          citation: LIANG.citation
        },
        {
          icon: "alert",
          title: "What happens when it gets something wrong?",
          summary: "Can you check it, correct it, or report it?",
          paragraphs: [
            "Every AI tool makes mistakes. What matters is whether you can spot them, whether there is a person to appeal to, and whether anyone is checking how the tool performs for different groups.",
            "In the skin-condition study, models that did poorly on dark skin improved after researchers trained them further on a more diverse set of images. Problems can be found and fixed, but only if someone looks."
          ],
          link: DANESHJOU.link,
          citation: DANESHJOU.citation
        }
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Earning trust, staying critical",
      subtitle: "",
      messages: [
        {
          text: "These questions don't have easy answers, but asking them is exactly what critical AI use looks like. 🔍",
          mood: "default"
        },
        {
          text: "Dev is writing a policy brief and considers using AI to summarize sources. Before he does, he thinks: Is this tool known to handle this topic well? Does it reflect diverse perspectives? What would he do if it produced something biased? He uses it, but keeps those questions live throughout.",
          mood: "thinking"
        },
        {
          text: "Try it yourself: in an AI tool that your course or ASU allows, ask for a short recommendation letter for “Kelly,” then ask again for “Joseph” with the same details. Compare the words each letter uses. Use made-up names only, never real people or private information. 🧪",
          mood: "hint"
        },
        {
          text: "Not anti-AI. Just not switching his brain off. That's the goal. The aim across all these modules has been the same: not to make you fear AI, not to make you love it, but to make you think clearly about it. That's AI literacy. 🎯",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "5",
      question: "What does it mean to earn trust in an AI tool rather than assume it?",
      options: [
        { text: "Completing a tutorial before using it", correct: false, feedback: "A tutorial teaches you how to use a tool. It doesn't tell you whether the tool deserves your trust." },
        { text: "Only using tools recommended by experts", correct: false, feedback: "Recommendations can help, but trust comes from evaluating the tool yourself." },
        { text: "Actively evaluating what the tool was trained on, who built it, and whether it fits your context", correct: true },
        { text: "Using the tool repeatedly until you understand its patterns", correct: false, feedback: "Familiarity isn't evidence. A tool can be consistently wrong in the same way." }
      ],
      hints: [
        "Trust based on familiarity or recommendations isn't the same as trust based on evidence.",
        "Think about the four questions you just read.",
        "Pick the option about actively evaluating training, builders, and context."
      ],
      correctFeedback: "Right! Trust based on evaluation is meaningful. Trust based on assumption is a risk.",
      wrongFeedback: "Tutorials, expert endorsements, and repeated use don't tell you whether an AI tool fits your context. Evaluating it does.",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "6",
      question: "Dev reads an AI summary and suspects it leaves out some perspectives. What's the best next step?",
      options: [
        { text: "Trust it, since an AI wrote it", correct: false, feedback: "A summary being produced by a machine doesn't make it complete or neutral." },
        { text: "Stop using AI for good", correct: false, feedback: "Dev's goal isn't to avoid AI. It's to use it with care." },
        { text: "Check it against other sources and ask the tool what viewpoints might be missing", correct: true },
        { text: "Ask the same question again and use whichever answer sounds best", correct: false, feedback: "A smoother-sounding answer isn't a more complete one." }
      ],
      hints: [
        "Dev isn't looking to avoid AI, and he isn't going to trust it blindly.",
        "Think about how to find out what a summary might be missing.",
        "Pick the option about checking other sources and asking what's missing."
      ],
      correctFeedback: "Right! Checking against other sources and asking what's missing is what critical use looks like.",
      wrongFeedback: "Trusting blindly, quitting AI, or picking the smoothest answer all skip the real step: checking other sources and asking what viewpoints might be missing.",
      xpReward: 25
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 4 Complete!",
      highlightWord: "Complete!",
      subtitle: "You can now spot bias, navigate the AI-in-education debate, and earn trust through evaluation.",
      takeaways: [
        "Algorithmic bias isn't intentional, but its effects are real. Training data shapes what AI produces and who it represents.",
        "Bias can enter at many points: the data, who labels it, design choices, how it's used, and feedback loops.",
        "A high overall accuracy can hide the groups a tool fails.",
        "Neither banning AI nor accepting it uncritically serves students. Critical, context-aware engagement is the goal.",
        "Trust in AI should be earned through evaluation, not assumed because a machine produced it.",
        "Ask: what was it trained on? Who built it? Does it represent my context? Stay critical throughout."
      ],
      badges: [
        { emoji: "⚖️", name: "Bias Buster" }
      ]
    }
  }
];

// This module now carries fixed content (no rotating question variants), like Modules 0 to 3.
export const MODULE5_SECTION_VARIANT_COUNT = 1;
