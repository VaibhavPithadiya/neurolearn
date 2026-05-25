"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Send, Sparkles, User, RefreshCw, Mic, MicOff,
  Lightbulb, Image, HelpCircle, Globe, Zap, TrendingUp,
  BarChart3, BookOpen, ChevronDown, ChevronRight,
  Copy, ThumbsUp, ThumbsDown, Volume2, Code2, Eye
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LearningStyle = "Visual" | "Analytical" | "Practical" | "Conceptual";
type ResponseType  = "explanation" | "quiz" | "visual" | "example" | "deep-dive" | "default";

interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  responseType?: ResponseType;
  suggestions?: string[];
  codeBlock?: string;
  visualData?: { label: string; value: number; color: string }[];
  quizOptions?: { label: string; correct: boolean }[];
  confidence?: number; // 0-100
}

interface LearnerProfile {
  understanding: number;
  confidence: number;
  style: LearningStyle;
  sessionQueries: number;
  xpEarned: number;
}

// ─── Mock AI Response Engine ──────────────────────────────────────────────────

const TOPICS: Record<string, { text: string; code?: string; suggestions: string[]; type: ResponseType; confidence: number }> = {
  "self-attention": {
    type: "explanation",
    confidence: 92,
    text: "**Self-Attention** computes relationships between all positions in a sequence simultaneously.\n\nThe formula is: **Attention(Q, K, V) = softmax(QKᵀ / √d_k) × V**\n\n• **Q (Query)** — what we're looking for\n• **K (Key)** — what each token advertises\n• **V (Value)** — the actual information to aggregate\n\nDividing by √d_k prevents softmax from saturating in high-dimensional spaces, keeping gradients healthy during training.",
    code: `function scaledDotAttention(Q, K, V, d_k) {\n  const scores = matMul(Q, transpose(K));\n  const scaled = scores.map(r => r.map(v => v / Math.sqrt(d_k)));\n  const weights = softmax(scaled);\n  return matMul(weights, V);\n}`,
    suggestions: ["How does Multi-Head Attention work?", "Quiz me on Transformers", "Show a visual explanation"],
  },
  "kubernetes": {
    type: "explanation",
    confidence: 88,
    text: "**Kubernetes** is a container orchestration platform that automates deployment, scaling, and management of containerized applications.\n\nKey concepts:\n• **Pod** — smallest deployable unit (1+ containers)\n• **Node** — worker machine running pods\n• **Control Plane** — manages the cluster state (API Server, etcd, Scheduler)\n• **Service** — stable network endpoint to pods\n• **Namespace** — virtual cluster isolation",
    suggestions: ["Explain pods deeper", "Quiz me on K8s architecture", "Real-world K8s example"],
  },
  "docker": {
    type: "explanation",
    confidence: 95,
    text: "**Docker** packages your app and all its dependencies into a portable **container**.\n\nA Dockerfile is the recipe:\n1. Choose a base image (`FROM`)\n2. Install dependencies (`RUN`)\n3. Copy your code (`COPY`)\n4. Define startup command (`CMD`)\n\nContainers are isolated but share the host OS kernel, making them far lighter than VMs.",
    code: `FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]`,
    suggestions: ["Explain multi-stage builds", "Docker vs VMs visual", "Quiz me on containers"],
  },
  "quiz": {
    type: "quiz",
    confidence: 78,
    text: "**Quick Knowledge Check!** Let's test your understanding of Kubernetes Pods:",
    suggestions: ["Explain pods again", "Try a harder question", "Move to next topic"],
  },
  "visual": {
    type: "visual",
    confidence: 90,
    text: "Here's a **visual breakdown** of your current skill distribution across the Kubernetes learning path. Your strengths are in containerization fundamentals — the orchestration layer needs reinforcement.",
    suggestions: ["Focus on my weak areas", "Generate a study plan", "Deep dive into Services"],
  },
  "example": {
    type: "example",
    confidence: 87,
    text: "**Real-world scenario:** A fintech company (like Stripe) uses Kubernetes to run their payment processing microservices.\n\n• **Challenge:** 10,000 transactions/sec with zero downtime during deploys\n• **Solution:** Rolling deployments + HPA (auto-scales pods 2→50 based on CPU)\n• **Result:** 99.99% uptime, zero-downtime releases, cost reduced 40%\n\nTheir pods auto-heal — if a payment service crashes, K8s restarts it within seconds.",
    suggestions: ["Show me the YAML for HPA", "Another real-world example", "Deep dive into HPA"],
  },
  "deep": {
    type: "deep-dive",
    confidence: 85,
    text: "**Deep Dive: etcd — The Brain of Kubernetes**\n\netcd is a distributed key-value store using the **Raft consensus algorithm**.\n\n**Why Raft?** It ensures strong consistency — every write is committed only if a majority of etcd nodes agree (quorum).\n\n**Write path:**\n1. Client → API Server (validates + authn/authz)\n2. API Server → etcd (persists desired state)\n3. Controller Manager detects drift, reconciles\n4. Scheduler assigns pods to nodes\n5. Kubelet creates containers via container runtime\n\nThis **reconciliation loop** is what makes K8s self-healing.",
    code: `# etcd health check\netcdctl endpoint health \\\n  --endpoints=https://127.0.0.1:2379 \\\n  --cacert=/etc/etcd/ca.crt \\\n  --cert=/etc/etcd/etcd.crt \\\n  --key=/etc/etcd/etcd.key`,
    suggestions: ["How does Raft work?", "etcd backup strategies", "Compare to ZooKeeper"],
  },
  "simpler": {
    type: "explanation",
    confidence: 96,
    text: "Let me break this down simply 🎯\n\n**Kubernetes** is like a **robot manager for your apps.**\n\nImagine you run a pizza shop:\n• **Docker** = the pizza box (packages everything neatly)\n• **Pod** = a pizza box being delivered\n• **Node** = a delivery person\n• **Kubernetes** = the manager who decides which delivery person carries which box, watches for problems, and reorders if something goes wrong\n\nWhen a delivery person gets sick (node fails), the manager automatically reassigns their boxes (reschedules pods) to another person. 🍕",
    suggestions: ["That makes sense! Next topic", "Quiz me on this", "Make it even simpler"],
  },
};

function getAIResponse(input: string): typeof TOPICS[string] {
  const l = input.toLowerCase();
  if (l.includes("self-attention") || l.includes("transformer") || l.includes("attention")) return TOPICS["self-attention"];
  if (l.includes("kubernetes") || l.includes("k8s") || l.includes("pod") || l.includes("cluster")) return TOPICS["kubernetes"];
  if (l.includes("docker") || l.includes("container") || l.includes("dockerfile")) return TOPICS["docker"];
  if (l.includes("quiz") || l.includes("test") || l.includes("question")) return TOPICS["quiz"];
  if (l.includes("visual") || l.includes("chart") || l.includes("graph")) return TOPICS["visual"];
  if (l.includes("example") || l.includes("real-world") || l.includes("use case")) return TOPICS["example"];
  if (l.includes("deep") || l.includes("advanced") || l.includes("internals")) return TOPICS["deep"];
  if (l.includes("simpler") || l.includes("simple") || l.includes("easier") || l.includes("explain")) return TOPICS["simpler"];
  return {
    type: "default",
    confidence: 82,
    text: `Great question! Let me analyze your query in the context of your current Kubernetes learning path.\n\nBased on your progress (Week 5–6, Architecture module), I recommend focusing on how this concept connects to **etcd's watch API** and **controller reconciliation loops**. These form the foundation for everything you'll learn in Pods and Deployments next.\n\nWould you like me to map this concept to your roadmap specifically?`,
    suggestions: ["Map to my roadmap", "Start from K8s basics", "Quiz me first"],
  };
}

const QUIZ_OPTIONS = [
  { label: "A pod is a group of VMs that share storage", correct: false },
  { label: "A pod is the smallest deployable unit in K8s, containing 1+ containers", correct: true },
  { label: "A pod is a Kubernetes namespace", correct: false },
  { label: "Pods are permanent and never recreated", correct: false },
];

const VISUAL_DATA = [
  { label: "Docker Basics", value: 100, color: "#06b6d4" },
  { label: "Containers",    value: 100, color: "#10b981" },
  { label: "K8s Arch",      value: 62,  color: "#8b5cf6" },
  { label: "Pods",          value: 0,   color: "#6366f1" },
  { label: "Deployments",   value: 0,   color: "#a855f7" },
  { label: "Services",      value: 0,   color: "#ec4899" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-center gap-1 py-0.5">
    {[0, 150, 300].map((delay) => (
      <motion.span
        key={delay}
        className="w-2 h-2 rounded-full bg-purple-400"
        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: delay / 1000 }}
      />
    ))}
  </div>
);

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/8">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Code</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-white transition-colors cursor-pointer">
          {copied ? <><ThumbsUp className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-3 text-[11px] font-mono leading-relaxed text-emerald-300 bg-black/30 overflow-x-auto whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const QuizCard = ({ options, onAnswer }: { options: { label: string; correct: boolean }[]; onAnswer: (correct: boolean) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(options[idx].correct);
  };
  return (
    <div className="mt-3 space-y-2">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Select the correct answer:</p>
      {options.map((opt, i) => {
        const isSelected = selected === i;
        const reveal = selected !== null;
        return (
          <motion.button
            key={i}
            whileHover={selected === null ? { x: 4 } : {}}
            onClick={() => handleSelect(i)}
            className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              reveal
                ? opt.correct
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                  : isSelected
                    ? "bg-rose-500/15 border-rose-500/50 text-rose-300"
                    : "bg-white/2 border-white/5 text-slate-600"
                : "bg-white/3 border-white/8 text-slate-300 hover:bg-purple-500/10 hover:border-purple-500/40"
            }`}
          >
            <span className="font-bold mr-2">{["A", "B", "C", "D"][i]}.</span> {opt.label}
            {reveal && opt.correct && <span className="ml-2 text-emerald-400">✓ Correct</span>}
            {reveal && isSelected && !opt.correct && <span className="ml-2 text-rose-400">✗ Wrong</span>}
          </motion.button>
        );
      })}
    </div>
  );
};

const VisualChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => (
  <div className="mt-3 space-y-2">
    {data.map((d, i) => (
      <div key={d.label} className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-slate-400 font-medium">{d.label}</span>
          <span className="text-slate-500 font-bold">{d.value}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${d.value}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}80` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i} className="text-slate-300">{part}</span>
      )}
    </p>
  );
};

const MentorAvatar = () => (
  <div className="relative shrink-0">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-700/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.3)]">
      <Brain className="w-4.5 h-4.5 text-purple-300" style={{ width: 18, height: 18 }} />
    </div>
    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030014] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
  </div>
);

const UserAvatar = () => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-700/30 border border-cyan-500/40 flex items-center justify-center shrink-0">
    <User className="text-cyan-300" style={{ width: 16, height: 16 }} />
  </div>
);

// ─── Learning Controls ─────────────────────────────────────────────────────────

const LEARNING_CONTROLS = [
  { id: "simpler",  label: "Explain Simpler", icon: Lightbulb, color: "text-amber-400",  border: "hover:border-amber-500/40",  bg: "hover:bg-amber-500/8",  prompt: "Explain it simpler" },
  { id: "visual",   label: "Visual Chart",    icon: Eye,       color: "text-cyan-400",   border: "hover:border-cyan-500/40",   bg: "hover:bg-cyan-500/8",   prompt: "Show a visual explanation" },
  { id: "quiz",     label: "Quiz Me",         icon: HelpCircle,color: "text-emerald-400",border: "hover:border-emerald-500/40",bg: "hover:bg-emerald-500/8",prompt: "Quiz me on this topic" },
  { id: "example",  label: "Real-world",      icon: Globe,     color: "text-blue-400",   border: "hover:border-blue-500/40",   bg: "hover:bg-blue-500/8",   prompt: "Give me a real-world example" },
  { id: "deep",     label: "Deep Dive",       icon: Zap,       color: "text-purple-400", border: "hover:border-purple-500/40", bg: "hover:bg-purple-500/8", prompt: "Give me a deep dive" },
];

// ─── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "mentor",
    text: "**Welcome back, John!** 👋\n\nI've analysed your Kubernetes Architecture module progress (62% complete) and detected you're a **Visual + Analytical** learner. I'll adapt my explanations accordingly.\n\nYou're currently on: *kubectl Crash Course*. Want to continue from where you left off, or is there something specific you'd like to explore?",
    timestamp: "Session start",
    responseType: "explanation",
    confidence: 94,
    suggestions: [
      "Continue kubectl lesson",
      "Explain Kubernetes pods",
      "Quiz me on architecture",
      "Show my progress visually",
    ],
  },
];

const INITIAL_PROFILE: LearnerProfile = {
  understanding: 74,
  confidence: 81,
  style: "Visual",
  sessionQueries: 0,
  xpEarned: 0,
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MentorPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [profile, setProfile]   = useState<LearnerProfile>(INITIAL_PROFILE);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showProfile, setShowProfile]  = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setQuizAnswered(false);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const resp = getAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "mentor",
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        responseType: resp.type as ResponseType,
        suggestions: resp.suggestions,
        codeBlock: resp.code,
        visualData: resp.type === "visual" ? VISUAL_DATA : undefined,
        quizOptions: resp.type === "quiz" ? QUIZ_OPTIONS : undefined,
        confidence: resp.confidence,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setProfile(prev => ({
        ...prev,
        sessionQueries: prev.sessionQueries + 1,
        xpEarned: prev.xpEarned + 15,
        understanding: Math.min(100, prev.understanding + Math.floor(Math.random() * 3)),
        style: text.toLowerCase().includes("visual") ? "Visual" :
               text.toLowerCase().includes("quiz")   ? "Analytical" :
               text.toLowerCase().includes("example")? "Practical" : prev.style,
      }));
    }, delay);
  }, [isTyping]);

  const handleQuizAnswer = (correct: boolean) => {
    setQuizAnswered(true);
    setProfile(prev => ({
      ...prev,
      understanding: correct ? Math.min(100, prev.understanding + 5) : Math.max(0, prev.understanding - 2),
      confidence: correct ? Math.min(100, prev.confidence + 4) : Math.max(0, prev.confidence - 3),
      xpEarned: prev.xpEarned + (correct ? 25 : 5),
    }));
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setProfile(INITIAL_PROFILE);
    setInput("");
    setIsTyping(false);
    setQuizAnswered(false);
  };

  const responseTypeStyle: Record<ResponseType, { label: string; color: string; icon: React.ElementType }> = {
    explanation: { label: "Explanation",  color: "text-violet-400",  icon: BookOpen },
    quiz:        { label: "Quiz",         color: "text-amber-400",   icon: HelpCircle },
    visual:      { label: "Visual",       color: "text-cyan-400",    icon: Eye },
    example:     { label: "Real-world",   color: "text-blue-400",    icon: Globe },
    "deep-dive": { label: "Deep Dive",    color: "text-purple-400",  icon: Zap },
    default:     { label: "Analysis",     color: "text-slate-400",   icon: Brain },
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] max-w-7xl mx-auto gap-4 overflow-hidden">

      {/* ── Left: Learner Profile Panel ── */}
      <AnimatePresence>
        {showProfile && (
          <motion.aside
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 280 }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex flex-col gap-4 shrink-0 overflow-hidden"
            style={{ width: 280 }}
          >
            {/* AI Profile Header */}
            <div className="glass-panel rounded-2xl border border-white/7 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-purple-400" /> Learner Profile
                </h3>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              {/* Understanding score */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Understanding</span>
                  <span className="font-bold text-white">{profile.understanding}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${profile.understanding}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                    style={{ boxShadow: "0 0 8px rgba(139,92,246,0.5)" }}
                  />
                </div>
              </div>

              {/* Confidence level */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Confidence</span>
                  <span className="font-bold text-white">{profile.confidence}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${profile.confidence}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                    style={{ boxShadow: "0 0 8px rgba(6,182,212,0.4)" }}
                  />
                </div>
              </div>

              {/* Learning style detected */}
              <div className="pt-1 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Style Detected</span>
                <motion.span
                  key={profile.style}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full"
                >
                  ◈ {profile.style}
                </motion.span>
              </div>
            </div>

            {/* Session stats */}
            <div className="glass-panel rounded-2xl border border-white/7 p-5 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3 text-cyan-400" /> Session Stats
              </h3>
              {[
                { label: "Queries Asked",   value: profile.sessionQueries, color: "text-blue-400" },
                { label: "XP Earned",       value: `+${profile.xpEarned}`, color: "text-amber-400" },
                { label: "Streak",          value: "18 days 🔥",           color: "text-orange-400" },
                { label: "Current Topic",   value: "K8s Architecture",     color: "text-purple-400" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{stat.label}</span>
                  <motion.span
                    key={`${stat.label}-${stat.value}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* Context Card */}
            <div className="glass-panel rounded-2xl border border-white/7 p-5 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> AI Context
              </h3>
              <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                  <span>Currently studying <strong className="text-white">kubectl & cluster management</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Weak areas: <strong className="text-white">Networking, etcd internals</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Next milestone: <strong className="text-white">Pods & Workloads</strong></span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Center: Chat Interface ── */}
      <div className="flex-1 flex flex-col rounded-2xl glass-panel border border-white/7 overflow-hidden min-w-0">

        {/* Chat Header */}
        <div
          className="px-5 py-4 border-b border-white/5 shrink-0 flex items-center justify-between"
          style={{ background: "linear-gradient(to right, rgba(9,7,24,0.8), rgba(30,20,60,0.4))" }}
        >
          <div className="flex items-center gap-3">
            <MentorAvatar />
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                NeuroMentor
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest">AI v3</span>
              </h3>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Session · Kubernetes Tutor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(p => !p)}
              className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white bg-white/3 hover:bg-white/6 border border-white/8 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {showProfile ? "Hide" : "Show"} Profile
            </button>
            <button
              onClick={() => setVoiceActive(v => !v)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                voiceActive
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                  : "bg-white/3 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"
              }`}
              title={voiceActive ? "Stop voice" : "Start voice input"}
            >
              {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/3 border border-white/8 text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning Controls Bar */}
        <div className="px-4 py-2.5 border-b border-white/4 bg-black/10 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest shrink-0">Quick controls:</span>
            {LEARNING_CONTROLS.map(ctrl => (
              <motion.button
                key={ctrl.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSend(ctrl.prompt)}
                disabled={isTyping}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/3 border border-white/6 ${ctrl.color} ${ctrl.border} ${ctrl.bg} transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap`}
              >
                <ctrl.icon className="w-3 h-3" />
                {ctrl.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Voice active banner */}
        <AnimatePresence>
          {voiceActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden shrink-0"
            >
              <div className="mx-4 my-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                />
                <div className="flex items-end gap-0.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 8 + Math.random() * 16, 4] }}
                      transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.08 }}
                      className="w-1 bg-rose-400 rounded-full"
                      style={{ height: 4 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-rose-300 font-semibold">Listening — speak now...</span>
                <button onClick={() => setVoiceActive(false)} className="ml-auto text-[10px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer">
                  Stop
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAI = msg.sender === "mentor";
              const typeInfo = msg.responseType ? responseTypeStyle[msg.responseType] : null;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}
                >
                  {isAI ? <MentorAvatar /> : <UserAvatar />}

                  <div className={`flex-1 min-w-0 space-y-2 ${isAI ? "" : "flex flex-col items-end"}`}>
                    {/* Response type tag */}
                    {isAI && typeInfo && (
                      <div className="flex items-center gap-1.5">
                        <typeInfo.icon className={`w-3 h-3 ${typeInfo.color}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${typeInfo.color}`}>{typeInfo.label}</span>
                        {msg.confidence && (
                          <span className="text-[9px] text-slate-600 font-medium ml-1">· {msg.confidence}% confidence</span>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl p-4 max-w-[90%] border ${
                        isAI
                          ? "bg-[rgba(15,10,35,0.6)] border-white/7 rounded-tl-sm backdrop-blur-sm"
                          : "bg-gradient-to-br from-purple-600/25 to-indigo-700/20 border-purple-500/30 rounded-tr-sm"
                      }`}
                      style={isAI ? { boxShadow: "0 4px 24px rgba(0,0,0,0.3)" } : undefined}
                    >
                      <FormattedText text={msg.text} />

                      {/* Code block */}
                      {msg.codeBlock && <CodeBlock code={msg.codeBlock} />}

                      {/* Quiz */}
                      {msg.quizOptions && !quizAnswered && (
                        <QuizCard options={msg.quizOptions} onAnswer={handleQuizAnswer} />
                      )}
                      {msg.quizOptions && quizAnswered && (
                        <div className="mt-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-300 font-medium flex items-center gap-2">
                          <ThumbsUp className="w-3.5 h-3.5" /> Answer recorded — profile updated!
                        </div>
                      )}

                      {/* Visual chart */}
                      {msg.visualData && <VisualChart data={msg.visualData} />}
                    </div>

                    {/* Meta row */}
                    <div className={`flex items-center gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
                      <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                      {isAI && (
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-emerald-400 transition-colors cursor-pointer" title="Helpful">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-rose-400 transition-colors cursor-pointer" title="Not helpful">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-blue-400 transition-colors cursor-pointer" title="Read aloud">
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {isAI && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.suggestions.map(s => (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSend(s)}
                            disabled={isTyping}
                            className="text-[11px] font-medium text-slate-300 hover:text-white bg-white/3 hover:bg-purple-500/10 border border-white/7 hover:border-purple-500/40 py-1.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-start gap-3"
              >
                <MentorAvatar />
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[rgba(15,10,35,0.6)] border border-white/7 backdrop-blur-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-white/5 bg-black/20 shrink-0">
          <form
            onSubmit={e => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Kubernetes, Docker, CI/CD, or any concept..."
                disabled={isTyping}
                className="w-full glass-input px-4 py-3 pr-10 text-sm focus:outline-none text-white placeholder-slate-600 rounded-xl"
              />
              {input.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-mono">
                  {input.length}
                </div>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[9px] text-slate-600">
              NeuroMentor adapts to your learning style · Context-aware · Kubernetes expert mode
            </p>
            <div className="flex items-center gap-1 text-[9px] text-slate-600">
              <Code2 className="w-3 h-3" />
              <span>Code · Visuals · Quizzes supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
