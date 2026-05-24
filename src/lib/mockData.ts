export interface SkillNode {
  name: string;
  level: number; // 0 to 100
  category: "AI/ML" | "Frontend" | "Systems" | "Design" | "Core CS";
  status: "mastered" | "learning" | "locked";
  hoursSpent: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  estimatedMinutes: number;
  skillsUnlocked: string[];
}

export interface Community {
  id: string;
  name: string;
  membersCount: number;
  tag: string;
  activityRate: "high" | "moderate" | "new";
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Workshop" | "Hackathon" | "AI Study Session" | "Mentor QA";
  attendees: number;
}

export interface MentorMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const mockDashboardData = {
  user: {
    name: "John Doe",
    level: 14,
    exp: 4200,
    nextLevelExp: 5000,
    rankName: "Synaptic Architect",
    avatar: "/avatars/avatar.png",
  },
  streak: {
    current: 18,
    max: 42,
    weekly: [
      { day: "Mon", active: true, value: 45 },
      { day: "Tue", active: true, value: 60 },
      { day: "Wed", active: true, value: 30 },
      { day: "Thu", active: true, value: 90 },
      { day: "Fri", active: true, value: 40 },
      { day: "Sat", active: true, value: 120 },
      { day: "Sun", active: true, value: 15 }, // today
    ]
  },
  progress: {
    currentCourse: "Deep Learning Foundations & Neural Architectures",
    overallCompletion: 68, // %
    lessonsCompleted: 17,
    totalLessons: 25,
    lastActive: "2 hours ago",
    nextLesson: "Transformer Models & Self-Attention Mechanisms"
  },
  skills: [
    { name: "Neural Networks", level: 75, category: "AI/ML", status: "learning", hoursSpent: 28 },
    { name: "Next.js & Server Components", level: 90, category: "Frontend", status: "mastered", hoursSpent: 42 },
    { name: "TypeScript", level: 85, category: "Frontend", status: "mastered", hoursSpent: 35 },
    { name: "Distributed Systems", level: 45, category: "Systems", status: "learning", hoursSpent: 14 },
    { name: "LLM Fine-tuning", level: 30, category: "AI/ML", status: "learning", hoursSpent: 8 },
    { name: "Framer Motion", level: 60, category: "Frontend", status: "learning", hoursSpent: 12 },
  ] as SkillNode[],
  roadmap: [
    {
      id: "step-1",
      title: "Introduction to Synaptic Coding",
      description: "Understand the biological foundations of neural networks and how they map to artificial nodes.",
      status: "completed",
      estimatedMinutes: 45,
      skillsUnlocked: ["Neural Basics"]
    },
    {
      id: "step-2",
      title: "Custom Attention Mechanism from Scratch",
      description: "Deep dive into matrix multiplication and softmax normalization to build multi-head attention.",
      status: "current",
      estimatedMinutes: 120,
      skillsUnlocked: ["Self-Attention", "Transformers"]
    },
    {
      id: "step-3",
      title: "Vector Database Setup & Optimization",
      description: "Learn how to store, query, and optimize embeddings using Cosine Similarity and HNSW graphs.",
      status: "upcoming",
      estimatedMinutes: 90,
      skillsUnlocked: ["Vector DBs", "RAG"]
    },
    {
      id: "step-4",
      title: "Edge Model Deployment & WebGPU",
      description: "Host model inference directly on the client's machine using WebGPU and ONNX Runtime.",
      status: "upcoming",
      estimatedMinutes: 150,
      skillsUnlocked: ["Client-side AI", "WebGPU"]
    }
  ] as RoadmapStep[],
  communities: [
    {
      id: "c-1",
      name: "Transformers & LLMs Club",
      membersCount: 1420,
      tag: "Deep Learning",
      activityRate: "high",
      image: "🤖"
    },
    {
      id: "c-2",
      name: "Vector Search Alchemists",
      membersCount: 890,
      tag: "Databases",
      activityRate: "moderate",
      image: "⚡"
    },
    {
      id: "c-3",
      name: "WebGPU Hackers",
      membersCount: 540,
      tag: "Performance",
      activityRate: "high",
      image: "🌌"
    }
  ] as Community[],
  events: [
    {
      id: "e-1",
      title: "Live Q&A: Fine-Tuning Llama-3.1 on Edge Devices",
      date: "May 26, 2026",
      time: "18:00 UTC",
      type: "Mentor QA",
      attendees: 342
    },
    {
      id: "e-2",
      title: "Global Cognitive Roadmap Hackathon",
      date: "June 2-4, 2026",
      time: "09:00 UTC",
      type: "Hackathon",
      attendees: 1205
    },
    {
      id: "e-3",
      title: "Interactive Study: Transformer Architectures",
      date: "May 28, 2026",
      time: "15:30 UTC",
      type: "AI Study Session",
      attendees: 88
    }
  ] as EventItem[]
};

export const initialMentorChat: MentorMessage[] = [
  {
    id: "m-1",
    sender: "mentor",
    text: "Welcome to NeuroLearn AI. I am your cognitive co-pilot. I have scanned your skill profile and created a custom roadmap focusing on Transformer models and WebGPU deployment. What would you like to build or understand today?",
    timestamp: "10:14 AM",
    suggestions: [
      "Explain the self-attention formula in transformers",
      "Generate a practice quiz on neural networks",
      "Help me optimize my vector search queries"
    ]
  }
];
