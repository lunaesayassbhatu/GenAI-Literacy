import type { Step } from "../moduleStepsData";

export const module3Steps: Step[] = [
  {
    type: "intro",
    data: {
      emoji: "🧬",
      badge: "Module 3",
      title: "How does GenAI ‘learn’?",
      highlightWord: "‘learn’?",
      subtitle: "Understand how AI outputs are shaped by training data and what that means for quality and transparency.",
      learningPoints: [
        "📦 Where AI gets its knowledge and the limits of that knowledge",
        "🔲 How AI outputs lack transparency (the black box problem)",
        "🧐 How to critically assess AI responses"
      ],
      info: {
        time: "~20 min",
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
      title: "Where does AI’s knowledge come from?",
      subtitle: "GenAI is trained on massive datasets of human data, including webpages, literature, fine art, and music. The inferences GenAI makes about relationships and patterns within the data shape the way it functions in the real-world.",
      messages: [
        {
          text: "In module 1, you learned that GenAI generates outputs based on training data and patterns. But what exactly is training data? And how does it learn these patterns?",
          mood: "thinking"
        },
        {
          text: "The process of AI learning typically involves these major pieces:",
          mood: "default"
        }
      ]
    }
  },
  {
    type: "process",
    data: {
      section: "1 of 3",
      title: "The process of AI learning",
      steps: [
        "Training data collection and preparation",
        "Model and algorithm selection",
        "Model training",
        "Validation and testing",
        "Implementation and monitoring"
      ]
    }
  },
  {
    type: "wave-talk",
    data: {
      section: "1 of 3",
      title: "Where does AI’s knowledge come from?",
      subtitle: "",
      messages: [
        {
          text: "*Training data collection and preparation:* Data is the foundation of AI learning. First, relevant training data that models can learn language and information patterns from must be collected. This process requires a lot of time and resources, relying on the data that humans have created throughout history (e.g., books, catalogs, online resources, works of art). Then, the data must be processed and cleaned.",
          mood: "default"
        },
        {
          text: "GenAI companies scrape the internet and history of content produced by humans to generate these datasets.",
          mood: "default"
        },
        {
          text: "Even after the data is selected, the data must be annotated by human workers. Data annotators manually label data so that a computer can “understand” it. Unfortunately, many data annotator positions are created in a way that is harmful for its workers. Often sourced from countries in economic distress, data annotators tend to be underpaid, making between $1.46 and $3.74 an hour. Additionally, in some positions, like content moderation, workers are exposed to traumatic material, such as graphic violence, harassment or hate speech, and sexual behaviors (Hao, 2025).\nHao, K. (2025). Empire of AI: Dreams and Nightmares in Sam Altman’s OpenAI. Penguin Press, New York.",
          mood: "thinking"
        },
        {
          text: "*Model and algorithm selection:* Depending on the available data and expectations of the model, the appropriate model and algorithm for learning must be selected.",
          mood: "default"
        },
        {
          text: "*Model training:* The model is then fed the training data and its prediction parameters are adjusted as needed. This is often an iterative process that requires large datasets. Training can differ depending on the goals of the model (i.e., linguistic, visual, auditory), but the general process is the same.",
          mood: "default"
        },
        {
          text: "As models train, they map out categories of data, relationships between pieces of data, etc. Different models are likely to make different inferences about relationships between data.",
          mood: "default"
        },
        {
          text: "*Validation and testing:* The chosen model must be tested on previously unseen data to ensure it works appropriately. Otherwise, additional iterations of training occur.",
          mood: "default"
        },
        {
          text: "*Implementation and monitoring:* Final model is implemented in a real world environment. It must be monitored and regularly updated until the next version comes out.",
          mood: "default",
          link: "https://www.univio.com/blog/how-does-artificial-intelligence-learn/",
          example: false
        },
        {
          text: "What data are GenAI models trained on? The answer depends on the AI model. Many of the popular LLMs are trained on publicly available data. This includes anything you might be able to find on the internet, like information from articles, blogs, discussion forums, images, videos, and more.",
          mood: "thinking"
        },
        {
          text: "Sometimes, AI companies have been found to source data through illegal means. For example, in 2025 Anthropic lost a lawsuit against authors and publishers for using “7 million digitized books that it ‘knew had been pirated’” to train its GenAI model.",
          mood: "hint",
          link: "https://www.npr.org/2025/09/05/g-s1-87367/anthropic-authors-settlement-pirated-chatbot-training-material"
        },
        {
          text: "Now, GenAI companies are legally able to purchase one copy of a book to scan into their models without paying anything extra or acknowledging their use of someone else’s intellectual property. This raises ethical implications regarding “stealing” art and the ethical use of intellectual property.",
          mood: "hint",
          link: "https://www.nytimes.com/2026/08/24/opinion/claude-pirated-books-ai.html"
        },
        {
          text: "As you have probably experienced first-hand, the internet or manual human search does not always provide accurate or helpful information; and even those types of information are often biased to highlight certain people and facts over others. If an AI model is trained on inaccurate, biased, or incomplete information, then its outputs risk the chance of being inaccurate, biased, or incomplete.",
          mood: "thinking"
        },
        {
          text: "One example of this occurs when data reflects historical inequalities that existed during the data collection. If an AI model was trained on historical employment data (ex. 1980 to now), then the model may portray women and people of color as underrepresented in high-level jobs, which might lead to the model perpetuating this inequality. This is only one example of how bias may exist within GenAI. See the module “GenAI and Bias” for further information.",
          mood: "hint",
          link: "https://www.ibm.com/think/topics/data-bias"
        },
        {
          text: "Jordan asked GenAI to develop personas as part of the research for an app idea he was working on. He asked for one persona to be from the upper-middle class with a white collar profession. The AI suggested a few different options, but Jordan realized that the options were overrepresentative of male doctors. He refined his query to make sure his personas would be representative of the larger population, including other demographic backgrounds and professions.",
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
      question: "True or false. AI training data is always verified before being fed to an AI model, meaning that AI responses are always accurate, complete, and unbiased.",
      options: [
        { text: "True.", correct: false, feedback: "Training data is collected from huge sources and isn't always verified. It can be inaccurate, incomplete, or biased, and that can show up in the answers." },
        { text: "False.", correct: true }
      ],
      hints: [
        "Think about where training data comes from. Is every piece of it checked?",
        "Data scraped from the internet and from history can contain errors and biases.",
        "If the data isn't always verified, can the answers always be accurate, complete, and unbiased?"
      ],
      correctFeedback: "Right! Training data isn't always verified, so responses can be inaccurate, incomplete, or biased.",
      wrongFeedback: "Training data isn't always verified before it's fed to a model, so AI responses aren't always accurate, complete, or unbiased.",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "2",
      question: "True or false. The outputs AI provides are unbiased.",
      options: [
        { text: "True.", correct: false, feedback: "Even though AI itself is not alive, able to think, or be personally biased, the humans that created the training data are. As such, human biases from the training data are likely to pop up implicitly or explicitly in AI’s outputs." },
        { text: "False.", correct: true }
      ],
      hints: [
        "Think about who created the data the AI learned from.",
        "Human biases can end up in the training data.",
        "If the data contains biases, what might show up in the outputs?"
      ],
      correctFeedback: "Right! Even though AI itself is not alive, able to think, or be personally biased, the humans that created the training data are. As such, human biases from the training data are likely to pop up implicitly or explicitly in AI’s outputs.",
      wrongFeedback: "Even though AI itself is not alive, able to think, or be personally biased, the humans that created the training data are. As such, human biases from the training data are likely to pop up implicitly or explicitly in AI’s outputs.",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "1",
      number: "3",
      multiSelect: true,
      question: "Markus used GenAI to generate an image for their art class assignment, what might be potential issues with submitting the generated item? (select all that apply).",
      options: [
        { text: "Markus’ submission will be very similar to others’ who used GenAI", correct: true, partialFeedback: "Yes! Many people get similar results from the same tools. But there are more issues to find." },
        { text: "The submission may be too inspired by another artist", correct: true, partialFeedback: "Yes! GenAI generates from patterns in existing work, so it can lean heavily on other artists. But there are more issues to find." },
        { text: "The image file will be too low resolution to submit, since GenAI tools can’t produce high-quality images.", correct: false, feedback: "GenAI tools can produce high-quality images, so resolution isn't the real issue here." },
        { text: "Markus will not engage with the task and learn to develop their own style and creativity", correct: true, partialFeedback: "Yes! Skipping the task means skipping the chance to develop a style and creativity. But there is one more issue to find." },
        { text: "The image will be flagged by every plagiarism checker, so Markus will definitely be caught.", correct: false, feedback: "Plagiarism checkers won't necessarily flag a generated image, and the real issues here are about originality and learning, not about getting caught." }
      ],
      hints: [
        "Think about what GenAI learned from, and what happens when lots of people use the same tool.",
        "Two of the issues are about originality. One is about what Markus misses out on.",
        "The issues about resolution and being caught by every plagiarism checker are not the real problems."
      ],
      partialFeedback: "You're on the right track! There's still at least one more issue to find. Look through the options again.",
      correctFeedback: "Exactly! The submission may be very similar to others’ work or too inspired by another artist, and Markus won't develop their own style and creativity.",
      wrongFeedback: "Resolution isn't the problem, and a plagiarism checker won't necessarily flag the image. The real issues are about originality and about Markus not engaging with the task.",
      xpReward: 25
    }
  },

  // ── SECTION 2 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "2 of 3",
      title: "Have you ever tried to trace back where an AI response came from? It’s more difficult than you might think.",
      subtitle: "This relates to the black box problem, the idea that AI inferencing and sources are not visible to us.",
      messages: [
        {
          text: "When a human engages in reasoning and problem solving, they are able to explain how they came to a conclusion. They can trace back their thinking process and cite their sources. For most GenAI models, this is not the case.",
          mood: "thinking",
          link: "https://www.gsb.stanford.edu/insights/explainer-black-box-problem",
          example: false
        },
        {
          text: "When using GenAI, we can see what goes in (the prompt) and what comes out (the response). What we can’t see is what happens in between. This is the black box. AI’s reasoning is not possible to trace, which also makes it difficult to verify.",
          mood: "default",
          link: "https://www.ibm.com/think/topics/black-box-ai",
          example: false
        },
        {
          text: "Why does the black box exist? How come humans can’t always understand how GenAI produces an output? One reason for this are parameters, which is an internal variable within an AI model that is learned and adjusted during the training phase. It represents the knowledge that the model has extracted from the training data and remains fixed even when the model makes predictions on new data. An AI model can have billions, or even trillions, of parameters that are interconnected to each other. The complexity of parameters and their relationships within the system makes it difficult to identify how an AI model produced an output.",
          mood: "thinking"
        },
        {
          text: "Most of today’s LLMs are black box AIs. These models train on massive data sets through complex learning processes. Often, even their own creators do not fully understand how they work. While it may be more difficult to assess internal processes, black box models are widely used because they deliver higher levels of accuracy and tend to outperform more transparent models.",
          mood: "default",
          link: "https://www.ewsolutions.com/understanding-black-box-ai/",
          example: false
        },
        {
          text: "Another reason for the black box are the proprietary properties of LLMs from competing companies and their lack of desire for other companies to steal how they function (ironic).",
          mood: "hint"
        },
        {
          text: "Aisha tried to fact-check an AI-generated paragraph for a classmate, but she was unable to trace back where the information came from. When she searched independently, she found conflicting information. Aisha is not sure whether the paragraph relies on real information, or is a hallucination. A lack of transparency means that verification is the responsibility of the user, and that it should take place to make sure the generated content is valid. That’s an important skill to build. 💡",
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
      question: "What is the ‘black box problem’ with GenAI?",
      options: [
        { text: "AI tools are too expensive for most users", correct: false, feedback: "Cost isn't what the black box problem is about. It's about what we can't see." },
        { text: "Users can’t see the reasoning or sources behind a model’s outputs", correct: true },
        { text: "AI responses are often too technical to understand", correct: false, feedback: "The problem isn't that the answers are too technical. It's that we can't see how the model reached them." },
        { text: "AI works better for some subjects than others", correct: false, feedback: "That's true, but it's a different issue. The black box problem is about not being able to see how an answer was produced." }
      ],
      hints: [
        "Think about what you can see (the prompt and the response) and what you can't.",
        "The 'black box' is the part in between.",
        "Pick the option about reasoning and sources that you can't see."
      ],
      correctFeedback: "Exactly! We can see the prompt and the response, but not the reasoning or sources in between.",
      wrongFeedback: "The black box problem is that users can't see the reasoning or sources behind a model's output.",
      xpReward: 25
    }
  },

  // ── SECTION 3 ──────────────────────────────────────────────────────────────
  {
    type: "wave-talk",
    data: {
      section: "3 of 3",
      title: "If GenAI outputs run the risk of being inaccurate and biased without a way to reliably understand its reasoning, what does that mean for you?",
      subtitle: "GenAI responses should be critically assessed.",
      messages: [
        {
          text: "The first step is understanding how GenAI generalizes information and generates responses, which you have already started doing in this module! The next step is thinking critically about the responses you receive from GenAI.",
          mood: "default"
        },
        {
          text: "You should not immediately accept all GenAI responses. Take a second to consider where the response might be sourced from. Consider the response as a first draft or a stepping stone, rather than the final answer. Ask yourself: does this claim seem plausible? Can I verify it elsewhere?",
          mood: "thinking"
        },
        {
          text: "Be especially skeptical of specific details, like numbers, names, quotes, and dates. Also, know your tool. Is the training data current and up-to-date? Does it cite sources?",
          mood: "hint"
        },
        {
          text: "Remember the black box problem and be aware that you will most likely be unable to directly identify how GenAI created a response. Make sure to check with other sources before accepting the GenAI outputs.",
          mood: "default"
        },
        {
          text: "Dev is writing a report on a historical cultural practice. First, he asks GenAI to explain it to him. After reading the response, he wonders where it got the data from. He questions its accuracy and completeness. He finds an article written by a practicing member of that culture. The article provides more details that he would have missed if he had only relied on the GenAI response. Dev managed to write a better report by critically considering how the AI might have generated the response, and making sure to verify before accepting any answers. 🎯",
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
      question: "What does it mean to assess AI critically?",
      options: [
        { text: "Fixing grammar and spelling in AI responses", correct: false, feedback: "Editing the writing doesn't check whether the content is right." },
        { text: "Rewriting AI outputs in your own words before submitting", correct: false, feedback: "Rewording doesn't check whether the content is accurate. You'd just be repeating any mistakes in your own words." },
        { text: "Actively questioning, checking, and improving what AI produces rather than accepting it", correct: true },
        { text: "Only using AI for creative tasks where accuracy doesn’t matter", correct: false, feedback: "Avoiding AI for factual tasks isn't the same as assessing it critically." }
      ],
      hints: [
        "Think about the difference between accepting an answer and examining it.",
        "Critical assessment is about the content, not the wording.",
        "Pick the option about questioning and checking."
      ],
      correctFeedback: "Right! Assessing AI critically means actively questioning, checking, and improving what it produces rather than accepting it.",
      wrongFeedback: "Critical assessment is about questioning and checking the content, not editing the wording or avoiding factual tasks.",
      xpReward: 25
    }
  },
  {
    type: "knowledge-check",
    data: {
      section: "3",
      number: "6",
      multiSelect: true,
      question: "How can you verify the information GenAI gives you about a topic? (check all that apply)",
      options: [
        { text: "Asking another GenAI model", correct: false, feedback: "Another GenAI model can make the same kinds of mistakes, so it isn't a reliable check." },
        { text: "Finding a reliable source", correct: true, partialFeedback: "Yes! A reliable source is an independent check. But there are more ways to verify." },
        { text: "Asking GenAI to cite its sources", correct: false, feedback: "GenAI can make up citations that look real, so a citation alone doesn't verify anything." },
        { text: "Consulting with an expert (like a professor or mentor)", correct: true, partialFeedback: "Yes! An expert can check what the AI told you. But there is one more way to verify." },
        { text: "Questioning where the GenAI output might have gotten its information from", correct: true, partialFeedback: "Yes! Questioning the source of a claim is a good habit. But there are more ways to verify." }
      ],
      hints: [
        "Think about checks that don't depend on the same AI that gave you the answer.",
        "A citation from the AI can itself be made up.",
        "Look for the options that bring in an independent source, a person, or your own questioning."
      ],
      partialFeedback: "You're on the right track! There's still at least one more way to verify. Look through the options again.",
      correctFeedback: "Exactly! A reliable source, an expert, and questioning where the output came from are all good ways to verify.",
      wrongFeedback: "Asking another GenAI model or asking GenAI to cite its sources doesn't give you an independent check. Use a reliable source, an expert, or question where the output came from.",
      xpReward: 25
    }
  },

  // ── COMPLETION ─────────────────────────────────────────────────────────────
  {
    type: "completion",
    data: {
      emoji: "🎉",
      title: "Module 3 Complete!",
      highlightWord: "Complete!",
      subtitle: "You now have tools to better understand where AI’s knowledge comes from and how to evaluate it.",
      takeaways: [
        "GenAI is trained on massive datasets that risk containing inaccurate or biased information. This information can appear in the outputs that you receive when using GenAI.",
        "The black box problem means that you do not get to see the reasoning or sources behind an AI response.",
        "When using AI, think critically. Question specific details and always verify before trusting and using that information."
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
