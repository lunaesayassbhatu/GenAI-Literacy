export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Module {
  id: string;
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
    id: "module-1",
    name: "What is GenAI?",
    description: "Learn the basics of Generative AI and how it works",
    icon: "🤖",
    iconColor: "#4AB7C4",
    xpReward: 100,
    timeEstimate: "15 min",
    lessons: [
      { id: "m1-l1", title: "Introduction to AI", completed: true },
      { id: "m1-l2", title: "Types of GenAI", completed: true },
      { id: "m1-l3", title: "How GenAI Works", completed: true },
      { id: "m1-l4", title: "Common AI Tools", completed: true },
      { id: "m1-l5", title: "AI Capabilities", completed: false },
      { id: "m1-l6", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-2",
    name: "Trust in GenAI",
    description: "Understand why GenAI can't be treated as a reliable source of truth",
    icon: "🔍",
    iconColor: "#E8547A",
    xpReward: 150,
    timeEstimate: "10 min",
    lessons: [
      { id: "m2-l1", title: "It Sounds Right. But Is It?", completed: false },
      { id: "m2-l2", title: "Why Does It Get Things Wrong?", completed: false },
      { id: "m2-l3", title: "So When Can You Trust It?", completed: false },
      { id: "m2-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-3",
    name: "How does GenAI 'learn'?",
    description: "Understand how AI outputs are shaped by training data — and what that means for quality",
    icon: "🧬",
    iconColor: "#FFC627",
    xpReward: 150,
    timeEstimate: "10 min",
    lessons: [
      { id: "m3-l1", title: "Where Does AI's Knowledge Come From?", completed: false },
      { id: "m3-l2", title: "What's in the Black Box?", completed: false },
      { id: "m3-l3", title: "Critically Assessing GenAI Outputs", completed: false },
      { id: "m3-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-4",
    name: "Using GenAI Responsibly",
    description: "AI literacy is for everyone — not just those with technical backgrounds",
    icon: "🌍",
    iconColor: "#8B1A2E",
    xpReward: 150,
    timeEstimate: "10 min",
    lessons: [
      { id: "m4-l1", title: "Who Gets to Understand AI?", completed: false },
      { id: "m4-l2", title: "What Happens When People Stay on the Sidelines?", completed: false },
      { id: "m4-l3", title: "Building Your Own AI Literacy", completed: false },
      { id: "m4-l4", title: "Knowledge Check", completed: false },
    ],
    locked: false
  },
  {
    id: "module-5",
    name: "GenAI and Bias",
    description: "Understand AI bias, unequal representation, and why trust in AI needs to be earned — not assumed",
    icon: "⚖️",
    iconColor: "#9D4EDD",
    xpReward: 150,
    timeEstimate: "10 min",
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
