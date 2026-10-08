import type { Step } from "../moduleStepsData";

export const module1Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🤖",
      badge: "Module 1 of 7",
      title: "What is Generative AI, really?",
      highlightWord: "really?",
      subtitle: "Understanding the basics can help you to use GenAI more responsibly and efficiently.",
      learningPoints: [
        "🧠 What GenAI is and how it works",
        "⚖️ What GenAI can do well and where it might fall short",
        "🎨 The different types of GenAI you might encounter and use"
      ],
      info: {
        time: "~12 min",
        sections: "3",
        maxXp: "160 XP",
        badges: "2"
      }
    }
  },

  // ── SECTION 1 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "What is generative AI?",
      subtitle: "AI isn't always generative, and it isn't only a chatbot.",
      messages: [
        {
          text: "You hear that AI is everywhere. It's in your phone, your streaming services, and your search bar. You might have professors warning you against using it for homework and others encouraging you to offload some of your busy work. How are you supposed to know if you should use GenAI or not? And how do you use it effectively?",
          mood: "thinking"
        },
        {
          text: "One of the first things to understand is that AI has been around for a while. *Traditional AI* refers to earlier types of AI that rely on programmed rules and human-defined knowledge. It follows the rules that a human wrote, like the spam filter in your email.",
          mood: "default",
          link: "https://hai.stanford.edu/ai-definitions/what-is-traditional-ai"
        },
        {
          text: "Comparatively, *Generative AI* is … generative. Every time it receives a prompt, it creates new content (text, images, code, audio, etc.) that didn't exist before you asked. Through techniques like machine learning, natural language processing, and deep learning, AI learns from data, recognizes patterns, and completes difficult tasks.",
          mood: "default",
          link: "https://www.sciencedirect.com/science/article/pii/S1472811723000605"
        },
        {
          text: "Some GenAI (like ChatGPT or Claude) rely mostly on Large Language Models (LLMs) to generate linguistic content like answers to questions. Other types of GenAI focus on images, audio, and even protein structures.",
          mood: "default"
        },
        {
          text: "GenAI does not pull from the internet like search engines used to. Instead, it builds from scratch — using the information available to it, it predicts the most likely word, over and over, until it forms a full response.",
          mood: "thinking"
        },
        {
          text: "New capabilities are emerging all the time to allow for more sophisticated processing of your question. One example is *Model Context Protocol (MCP)*, which lets AI applications communicate with external services and tools — resulting in more specialized, self-checking responses.",
          mood: "celebrate",
          link: "https://www.ibm.com/think/topics/model-context-protocol"
        },
        {
          text: "Dev used a grammar checker and a GenAI chatbot in the same afternoon. One flagged errors using pre-programmed rules of grammar, while the other generated a paragraph from scratch. Later, he gave a GenAI tool an image of his friend and prompted it to create a birthday card image of the friend in outer space. All three are examples of AI — but only the last two are generative. 🎂",
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
      multiSelect: true,
      question: "Which of these options is an example of Generative AI? (Select all that apply)",
      options: [
        { text: "A newly-created image based on a prompt", correct: true },
        { text: "Filtering search results to show only specific years", correct: false },
        { text: "A coding assistant that helps to write and debug code on demand", correct: true },
        { text: "An email draft based on a prompt", correct: true },
        { text: "A voice assistant that handles only basic commands", correct: false },
        { text: "A bank algorithm that flags suspicious credit card activity", correct: false }
      ],
      hints: [
        "Ask yourself: did this create brand-new content, or just sort/flag existing information?",
        "Filtering, flagging, and command-following all follow pre-set rules — that's traditional AI, not generative.",
        "Pick the options where new text, code, or images were created from a prompt."
      ],
      correctFeedback: "Exactly! Generating a new image, code, or email draft all involve creating something new from a prompt — that's generative AI.",
      wrongFeedback: "Filtering, flagging, and handling basic commands all follow pre-set rules rather than generating anything new — those are traditional AI, not generative.",
      xpReward: 40
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "What is GenAI good at?",
      subtitle: "Knowing its strengths (and weaknesses!) can help you learn to use it better.",
      messages: [
        {
          text: "GenAI can be useful for some tasks, but other tasks are probably better suited for different tools. What is it good at? And where is it lacking? The following isn't exhaustive, but should give you a better idea of where to start.",
          mood: "default"
        }
      ]
    }
  },
  {
    type: "pros-cons",
    data: {
      title: "GenAI Strengths and Weaknesses",
      strengths: [
        "Automates repetitive tasks, saving time and effort",
        "Creates a personalized experience for its users, which can make services more user friendly",
        "Works as a starting point for creative tasks, like brainstorming ideas for an essay"
      ],
      weaknesses: [
        "Possibility for the creation of harmful and/or false content, like fake news or hallucinated statistics",
        "Quality of GenAI content may be lacking depth, originality, creativity, etc. There are some tasks that will have better quality when completed by a human",
        "Biases and derogatory language may be present due to the data the AI was trained on. Minority voices may be underrepresented and the majority overrepresented.",
        "Environmental and financial costs"
      ],
      sources: [
        { label: "The pros and cons of generative AI — AWS Builder", url: "https://builder.aws.com/content/2p12gt8r9e3SEgc0yPeEuwzj2XF/the-pros-and-cons-of-generative-ai-a-simple-guide" },
        { label: "Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? In Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (pp. 610–623)." }
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "Is GenAI the right tool for the job?",
      subtitle: "Match the task to the tool.",
      messages: [
        {
          text: "GenAI is capable of helping in many different domains. But it's important to consider whether GenAI is actually the tool best suited for the task.",
          mood: "default"
        },
        {
          text: "Jordan wrote an essay using his own research and his own words. When it came to titling the essay, he got stuck — so he used AI to generate 10 possible essay titles, then used his own judgment from there. He used GenAI to help inspire him, not to do all the work. ✍️",
          mood: "celebrate"
        }
      ]
    }
  },
  {
    type: "ranking-check",
    data: {
      section: "2",
      number: "2",
      instructions: "Some tasks GenAI can complete pretty well, but in other areas it might not do a very good job. Rank each of the following tasks according to how well GenAI might complete the task.",
      scale: [
        { value: 1, label: "GenAI would be well-suited for this task in most situations" },
        { value: 2, label: "GenAI could do well at this task as long as the user verifies using other sources" },
        { value: 3, label: "GenAI would most likely not do well at this task" }
      ],
      items: [
        {
          prompt: "Finding a quote from a credible source",
          correctValue: 2,
          feedback: "AI can point you toward real-sounding quotes, but it can also invent ones that look completely legitimate — always verify the quote actually exists before using it."
        },
        {
          prompt: "Explaining a topic you need some clarification on",
          correctValue: 2,
          feedback: "A plain-language explanation can be a great starting point, but double-check any specific facts or figures it includes."
        },
        {
          prompt: "Brainstorming ideas for a group project",
          correctValue: 1,
          feedback: "Open-ended brainstorming is low-stakes — GenAI is great for generating a wide range of starting ideas."
        },
        {
          prompt: "Creating an original piece of art",
          correctValue: 3,
          feedback: "GenAI generates from patterns in existing work, so what it produces isn't truly original — it can mimic styles, not create genuinely new ones."
        },
        {
          prompt: "Making a personalized workout plan",
          correctValue: 1,
          feedback: "This is a low-risk, structured task GenAI can typically handle well based on the details you provide."
        },
        {
          prompt: "Confirming medical or legal information",
          correctValue: 2,
          feedback: "GenAI can offer a starting point, but medical and legal information needs to be verified with a qualified professional or authoritative source."
        },
        {
          prompt: "Receiving advice about a personal life situation",
          correctValue: 2,
          feedback: "GenAI tends to be agreeable rather than objective here — treat its advice as one perspective, not the final word."
        },
        {
          prompt: "Making informed decisions that affect diverse groups of people",
          correctValue: 3,
          feedback: "Decisions with wide-reaching impact need human judgment, accountability, and context that GenAI cannot fully provide."
        }
      ],
      xpReward: 80
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "Not all instances of GenAI do the same thing",
      subtitle: "\"Generative AI\" can include a lot more than just chatbots.",
      messages: [
        {
          text: "Not all GenAI tools do the same thing — here are the main types you'll run into.",
          mood: "default"
        },
        {
          text: "*Text generators* (like chatbots) are powered by Large Language Models (LLMs) to write, summarize, and converse.",
          mood: "default"
        },
        {
          text: "*Image generators* turn written descriptions into a picture. These may use Generative Adversarial Networks (GANs) or Variational Autoencoders (VAEs).",
          mood: "default"
        },
        {
          text: "*Audio and music generators* can create new melodies, harmonize against existing ones, and create realistic sound effects.",
          mood: "default"
        },
        {
          text: "*Video generators* can create frames based on written descriptions or existing video data.",
          mood: "default"
        },
        {
          text: "*Code generators* can create code snippets or debug software.",
          mood: "default",
          link: "https://tudublin.libguides.com/GenAI/typesofgenai"
        },
        {
          text: "Aisha needed to create a multi-media presentation. She used a text generator to draft and iterate on her main points, an image generator for a picture that aligned with her topic, and an audio generator for some engaging sound effects. By matching the tool to the task, she created a fun, informative presentation. 🎤",
          mood: "celebrate"
        },
        {
          text: "John needed to code a basic website from scratch. He asked GenAI to create all of the code, but it didn't run quite right. On his next try, he attempted the code himself and asked GenAI questions as he progressed — this time, it ran how he wanted. He used GenAI to help when he got stuck, not to do all the work for him. 💻",
          mood: "celebrate"
        },
        {
          text: "When you know what tools are available to you, what kind of data they've been trained on, and what their recommended uses are, you can decide which tool is best for your goals. 🎯",
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
      question: "A student wants GenAI to generate new frames for a short clip, either from a written description or from existing footage. What kind of tool fits this need best?",
      options: [
        { text: "Code generator", correct: false },
        { text: "Image generator", correct: false },
        { text: "Video generator", correct: true },
        { text: "Text generator", correct: false }
      ],
      hints: [
        "Think about which type of GenAI tool was described as creating frames from a description or existing footage.",
        "Code and text generators don't produce visual frames at all.",
        "Pick the option built specifically for generating video content."
      ],
      correctFeedback: "Right! Video generators create frames from written descriptions or existing footage — exactly this use case.",
      wrongFeedback: "Code and text generators don't produce video frames, and image generators make single still pictures, not clip frames. A video generator is built for exactly this.",
      xpReward: 40
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 1 Complete!",
      highlightWord: "Complete!",
      subtitle: "You now know what generative AI is, how it generally works, and what it can (and cannot) do.",
      takeaways: [
        "GenAI is one category of AI — the kind that creates new content rather than following strict rules.",
        "GenAI generates from patterns, it does not retrieve answers from the internet.",
        "GenAI is suitable for some tasks but not for others. Think critically about your specific goals and GenAI's abilities to determine if it's the right tool.",
        "GenAI comes in several forms. Knowing which tool fits the task — and what GenAI may not be good at — is the first step to leveraging AI to your advantage."
      ],
      badges: [
        { emoji: "🥇", name: "First Steps" },
        { emoji: "🧠", name: "AI Decoded" }
      ]
    }
  }
];

// ── Legacy rotating knowledge-check variants ──────────────────────────────────
// No longer used now that Module 1 has fixed, rewritten content (see
// getStepsForModule in moduleStepsData.ts). Left in place only because
// MODULE1_SECTION1_VARIANT_COUNT below is still imported as a generic constant.

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
