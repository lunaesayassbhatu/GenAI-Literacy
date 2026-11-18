export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Module {
  id: string;
  /** The number shown to learners: Module 0 (GenAI Literacy) up to Module 6. The id stays the same so saved progress is kept. */
  number: number;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  xpReward: number;
  timeEstimate: string;
  lessons: Lesson[];
  locked: boolean;
}

export const MODULES: Module[] = [
  {
    id: "module-4",
    number: 0,
    name: "GenAI Literacy",
    description: "AI literacy is becoming an increasingly important skillset for everyone to learn",
    icon: "📖",
    iconColor: "#8B1A2E",
    xpReward: 150,
    timeEstimate: "15 min",
    lessons: [
      { id: "m4-l1", title: "GenAI literacy is an important skill", completed: false },
      { id: "m4-l2", title: "What happens when people stay on the sidelines?", completed: false },
      { id: "m4-l3", title: "Building your GenAI literacy", completed: false },
      { id: "m4-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-1",
    number: 1,
    name: "What is GenAI?",
    description: "Understanding the basics can help you to use GenAI more responsibly and efficiently",
    icon: "🤖",
    iconColor: "#4AB7C4",
    xpReward: 160,
    timeEstimate: "15 min",
    lessons: [
      { id: "m1-l1", title: "What is generative AI?", completed: false },
      { id: "m1-l2", title: "What is GenAI good at?", completed: false },
      { id: "m1-l3", title: "Not all GenAI does the same thing", completed: false },
      { id: "m1-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-2",
    number: 2,
    name: "Trust in GenAI",
    description: "Understand why GenAI can't be treated as a reliable source of truth or support",
    icon: "🔍",
    iconColor: "#E8547A",
    xpReward: 150,
    timeEstimate: "15 min",
    lessons: [
      { id: "m2-l1", title: "GenAI can sound right. But is it actually?", completed: false },
      { id: "m2-l2", title: "It might sound supportive. But should you trust it?", completed: false },
      { id: "m2-l3", title: "So how should you use GenAI?", completed: false },
      { id: "m2-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-3",
    number: 3,
    name: "How does GenAI 'learn'?",
    description: "Understand how AI outputs are shaped by training data and what that means for quality and transparency",
    icon: "🧬",
    iconColor: "#FFC627",
    xpReward: 150,
    timeEstimate: "20 min",
    lessons: [
      { id: "m3-l1", title: "Where does AI's knowledge come from?", completed: false },
      { id: "m3-l2", title: "What's in the black box?", completed: false },
      { id: "m3-l3", title: "Critically assessing GenAI outputs", completed: false },
      { id: "m3-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-5",
    number: 4,
    name: "GenAI and Bias",
    description: "Understand AI bias, unequal representation, and why trust in AI needs to be earned — not assumed",
    icon: "⚖️",
    iconColor: "#9D4EDD",
    xpReward: 150,
    timeEstimate: "15 min",
    lessons: [
      { id: "m5-l1", title: "Not Everyone Gets the Same AI", completed: false },
      { id: "m5-l2", title: "AI in Education: A Question of Trust", completed: false },
      { id: "m5-l3", title: "Earning Trust, Staying Critical", completed: false },
      { id: "m5-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-6",
    number: 5,
    name: "Getting AI to Do What You Want",
    description: "Learn how to communicate with AI effectively so it actually helps you",
    icon: "💬",
    iconColor: "#06B6D4",
    xpReward: 150,
    timeEstimate: "10 min",
    lessons: [
      { id: "m6-l1", title: "It Doesn't Understand You. It Predicts You.", completed: false },
      { id: "m6-l2", title: "What You Put In Shapes What You Get Out", completed: false },
      { id: "m6-l3", title: "When the Output Isn't Right, Adjust", completed: false },
      { id: "m6-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-7",
    number: 6,
    name: "GenAI and the Environment",
    description: "Understand the real environmental impact of GenAI — and what it means to be an intentional user",
    icon: "🌍",
    iconColor: "#2E7D32",
    xpReward: 150,
    timeEstimate: "10 min",
    lessons: [
      { id: "m7-l1", title: "It's Not as Invisible as It Seems", completed: false },
      { id: "m7-l2", title: "What Does the Impact Actually Look Like?", completed: false },
      { id: "m7-l3", title: "Being an Intentional User", completed: false },
      { id: "m7-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  }
];

/** The Argonia trials are numbered 1-7 like the module ids. This gives the number learners see for that module (Module 0 is GenAI Literacy). */
export function moduleNumberForTrial(trial: number): number {
  return MODULES.find((m) => m.id === `module-${trial}`)?.number ?? trial;
}

export function getModuleProgress(module: Module): { completed: number; total: number; percentage: number } {
  const completed = module.lessons.filter(l => l.completed).length;
  const total = module.lessons.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return { completed, total, percentage };
}

export function getCurrentModule(): Module | null {
  // Find first module with incomplete lessons
  for (const module of MODULES) {
    if (!module.locked) {
      const progress = getModuleProgress(module);
      if (progress.completed < progress.total) {
        return module;
      }
    }
  }
  return null;
}

export function getCurrentLesson(module: Module): Lesson | null {
  return module.lessons.find(l => !l.completed) || null;
}
