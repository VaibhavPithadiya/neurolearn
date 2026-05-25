"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle, Globe, BookOpen, Rss, GraduationCap, Code2,
  Sparkles, TrendingUp, Star, ExternalLink, Zap, Users, GitFork,
  Eye, ThumbsUp, ChevronRight, Search, Filter, Award, ArrowRight,
  Flame, Shield, Radio
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | "YouTube"
  | "GitHub"
  | "Reddit"
  | "Documentation"
  | "Blogs"
  | "Courses"
  | "Open Source";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

interface Resource {
  id: string;
  title: string;
  author: string;
  description: string;
  url: string;
  category: Category;
  difficulty: Difficulty;
  qualityScore: number; // 0-100
  trending: boolean;
  aiRecommended: boolean;
  tags: string[];
  meta: string; // e.g. "1.2M subs", "42k stars", "380k members"
  metaIcon: React.ElementType;
}

interface EcosystemNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  glow: string;
  size: number; // radius
  description: string;
  connections: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ECOSYSTEM_NODES: EcosystemNode[] = [
  { id: "linux",      label: "Linux",      x: 12,  y: 50, color: "#f97316", glow: "rgba(249,115,22,0.5)",   size: 28, description: "OS fundamentals & kernel", connections: ["docker"] },
  { id: "docker",     label: "Docker",     x: 30,  y: 30, color: "#06b6d4", glow: "rgba(6,182,212,0.5)",   size: 32, description: "Container runtime & images", connections: ["kubernetes", "linux"] },
  { id: "kubernetes", label: "Kubernetes", x: 52,  y: 50, color: "#8b5cf6", glow: "rgba(139,92,246,0.6)",  size: 40, description: "Container orchestration", connections: ["cloud", "cncf", "devops"] },
  { id: "cloud",      label: "Cloud",      x: 72,  y: 28, color: "#3b82f6", glow: "rgba(59,130,246,0.5)",  size: 30, description: "AWS · GCP · Azure", connections: ["devops"] },
  { id: "devops",     label: "DevOps",     x: 80,  y: 60, color: "#10b981", glow: "rgba(16,185,129,0.5)",  size: 32, description: "CI/CD & automation", connections: ["cncf"] },
  { id: "cncf",       label: "CNCF",       x: 60,  y: 80, color: "#ec4899", glow: "rgba(236,72,153,0.5)",  size: 26, description: "Cloud Native ecosystem", connections: [] },
];

const RESOURCES: Resource[] = [
  // YouTube
  {
    id: "yt-1",
    title: "TechWorld with Nana",
    author: "Nana Janashia",
    description: "The most comprehensive Kubernetes & DevOps tutorial channel. Covers K8s from scratch to production with hands-on demos.",
    url: "#",
    category: "YouTube",
    difficulty: "Beginner",
    qualityScore: 97,
    trending: true,
    aiRecommended: true,
    tags: ["K8s", "Docker", "DevOps", "CI/CD"],
    meta: "1.2M subscribers",
    metaIcon: Users,
  },
  {
    id: "yt-2",
    title: "KubeSimplify",
    author: "Saiyam Pathak",
    description: "Deep-dive Kubernetes walkthroughs. Covers CKA exam prep, Helm, ArgoCD, and CNCF landscape projects in detail.",
    url: "#",
    category: "YouTube",
    difficulty: "Intermediate",
    qualityScore: 91,
    trending: false,
    aiRecommended: true,
    tags: ["CKA", "Helm", "ArgoCD", "CNCF"],
    meta: "188K subscribers",
    metaIcon: Users,
  },
  {
    id: "yt-3",
    title: "That DevOps Guy",
    author: "Marcel Dempers",
    description: "Practical Kubernetes production setups, security hardening, monitoring with Prometheus, and GitOps patterns.",
    url: "#",
    category: "YouTube",
    difficulty: "Advanced",
    qualityScore: 88,
    trending: false,
    aiRecommended: false,
    tags: ["Production", "Security", "Prometheus"],
    meta: "265K subscribers",
    metaIcon: Users,
  },
  // GitHub
  {
    id: "gh-1",
    title: "kelseyhightower/kubernetes-the-hard-way",
    author: "Kelsey Hightower",
    description: "Bootstrap Kubernetes the hard way — manually, from scratch, on GCP. The gold standard for understanding how K8s actually works internally.",
    url: "#",
    category: "GitHub",
    difficulty: "Expert",
    qualityScore: 99,
    trending: true,
    aiRecommended: true,
    tags: ["From Scratch", "GCP", "Deep Learning"],
    meta: "41.2k stars",
    metaIcon: Star,
  },
  {
    id: "gh-2",
    title: "kubernetes/kubernetes",
    author: "kubernetes org",
    description: "The official Kubernetes source code. Essential for contributors, core concept understanding, and tracking upcoming features.",
    url: "#",
    category: "GitHub",
    difficulty: "Expert",
    qualityScore: 98,
    trending: false,
    aiRecommended: false,
    tags: ["Source Code", "Go", "Core"],
    meta: "112k stars",
    metaIcon: Star,
  },
  {
    id: "gh-3",
    title: "awesome-kubernetes",
    author: "ramitsurana",
    description: "Curated list of awesome Kubernetes tools, frameworks, libraries, and resources. Community-maintained and always updated.",
    url: "#",
    category: "GitHub",
    difficulty: "Beginner",
    qualityScore: 92,
    trending: true,
    aiRecommended: true,
    tags: ["Curated", "Tools", "Resources"],
    meta: "15.3k stars",
    metaIcon: Star,
  },
  // Reddit
  {
    id: "rd-1",
    title: "r/kubernetes",
    author: "Community",
    description: "The primary Reddit community for Kubernetes discussions. From beginner questions to production incidents and release announcements.",
    url: "#",
    category: "Reddit",
    difficulty: "Beginner",
    qualityScore: 85,
    trending: true,
    aiRecommended: true,
    tags: ["Community", "Q&A", "News"],
    meta: "247K members",
    metaIcon: Users,
  },
  {
    id: "rd-2",
    title: "r/devops",
    author: "Community",
    description: "Broader DevOps ecosystem discussions. Kubernetes is heavily featured alongside CI/CD, IaC, and platform engineering topics.",
    url: "#",
    category: "Reddit",
    difficulty: "Intermediate",
    qualityScore: 82,
    trending: false,
    aiRecommended: false,
    tags: ["DevOps", "IaC", "Platform Eng"],
    meta: "380K members",
    metaIcon: Users,
  },
  // Documentation
  {
    id: "doc-1",
    title: "Kubernetes Official Docs",
    author: "kubernetes.io",
    description: "The definitive source of truth for Kubernetes. Comprehensive API references, tutorials, and concept guides.",
    url: "#",
    category: "Documentation",
    difficulty: "Intermediate",
    qualityScore: 100,
    trending: false,
    aiRecommended: true,
    tags: ["Official", "API Ref", "Tutorials"],
    meta: "Official source",
    metaIcon: Shield,
  },
  {
    id: "doc-2",
    title: "CNCF Landscape",
    author: "CNCF",
    description: "Interactive map of the entire cloud-native ecosystem. Essential for understanding how Kubernetes fits into the broader landscape.",
    url: "#",
    category: "Documentation",
    difficulty: "Beginner",
    qualityScore: 96,
    trending: true,
    aiRecommended: true,
    tags: ["Ecosystem", "Cloud Native", "Map"],
    meta: "Official source",
    metaIcon: Shield,
  },
  // Blogs
  {
    id: "bl-1",
    title: "learnk8s.io",
    author: "Daniele Polencic",
    description: "Premium Kubernetes articles with professional diagrams. Topics include resource limits, networking, multi-cluster patterns, and security.",
    url: "#",
    category: "Blogs",
    difficulty: "Advanced",
    qualityScore: 94,
    trending: true,
    aiRecommended: true,
    tags: ["In-depth", "Diagrams", "Networking"],
    meta: "Est. 2018",
    metaIcon: Rss,
  },
  {
    id: "bl-2",
    title: "iximiuz.com",
    author: "Ivan Velichko",
    description: "Deep technical deep-dives into containers and Kubernetes internals. Visual, precise, and refreshingly honest about complexity.",
    url: "#",
    category: "Blogs",
    difficulty: "Expert",
    qualityScore: 97,
    trending: false,
    aiRecommended: true,
    tags: ["Internals", "Containers", "Visual"],
    meta: "Est. 2020",
    metaIcon: Rss,
  },
  // Courses
  {
    id: "co-1",
    title: "Certified Kubernetes Administrator (CKA)",
    author: "Linux Foundation",
    description: "The industry-standard Kubernetes certification. Hands-on exam covering cluster setup, workloads, services, storage, and troubleshooting.",
    url: "#",
    category: "Courses",
    difficulty: "Advanced",
    qualityScore: 99,
    trending: true,
    aiRecommended: true,
    tags: ["CKA", "Certification", "Exam"],
    meta: "Industry cert",
    metaIcon: GraduationCap,
  },
  {
    id: "co-2",
    title: "Kubernetes for Absolute Beginners",
    author: "Mumshad Mannambeth",
    description: "KodeKloud's beginner-friendly Kubernetes course with built-in browser labs. No local setup needed — learn by doing.",
    url: "#",
    category: "Courses",
    difficulty: "Beginner",
    qualityScore: 93,
    trending: false,
    aiRecommended: true,
    tags: ["Hands-on", "Labs", "KodeKloud"],
    meta: "230K+ enrolled",
    metaIcon: GraduationCap,
  },
  // Open Source
  {
    id: "os-1",
    title: "Argo CD",
    author: "Argo Project",
    description: "Declarative GitOps continuous delivery for Kubernetes. Sync your Git repo to your cluster automatically. CNCF Graduated project.",
    url: "#",
    category: "Open Source",
    difficulty: "Advanced",
    qualityScore: 96,
    trending: true,
    aiRecommended: true,
    tags: ["GitOps", "CI/CD", "CNCF"],
    meta: "16.8k stars",
    metaIcon: GitFork,
  },
  {
    id: "os-2",
    title: "K9s",
    author: "derailed",
    description: "Terminal-based UI for Kubernetes clusters. Dramatically speeds up cluster navigation, resource management, and log inspection.",
    url: "#",
    category: "Open Source",
    difficulty: "Intermediate",
    qualityScore: 95,
    trending: true,
    aiRecommended: true,
    tags: ["Terminal", "UI", "Productivity"],
    meta: "28.1k stars",
    metaIcon: GitFork,
  },
  {
    id: "os-3",
    title: "Helm",
    author: "Helm org",
    description: "The package manager for Kubernetes. Define, install, and upgrade complex K8s applications with versioned, reusable charts.",
    url: "#",
    category: "Open Source",
    difficulty: "Intermediate",
    qualityScore: 98,
    trending: false,
    aiRecommended: true,
    tags: ["Package Mgr", "Charts", "CNCF"],
    meta: "27.3k stars",
    metaIcon: GitFork,
  },
];

// ─── Config maps ──────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; bg: string; border: string; glow: string }> = {
  YouTube:       { icon: PlayCircle,   color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     glow: "rgba(239,68,68,0.3)"   },
  GitHub:        { icon: GitFork,      color: "text-slate-300",   bg: "bg-slate-500/10",   border: "border-slate-500/30",   glow: "rgba(148,163,184,0.2)" },
  Reddit:        { icon: Radio,        color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30",  glow: "rgba(249,115,22,0.3)"  },
  Documentation: { icon: BookOpen,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30",    glow: "rgba(59,130,246,0.3)"  },
  Blogs:         { icon: Rss,          color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   glow: "rgba(245,158,11,0.3)"  },
  Courses:       { icon: GraduationCap,color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "rgba(16,185,129,0.3)"  },
  "Open Source": { icon: Code2,        color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30",  glow: "rgba(139,92,246,0.3)"  },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bg: string; border: string }> = {
  Beginner:     { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  Intermediate: { color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/25"    },
  Advanced:     { color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/25"  },
  Expert:       { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/25"    },
};

const ALL_CATEGORIES: (Category | "All")[] = [
  "All", "YouTube", "GitHub", "Reddit", "Documentation", "Blogs", "Courses", "Open Source",
];

// ─── Ecosystem Graph ──────────────────────────────────────────────────────────

const EcosystemGraph = ({ activeNode, onNodeClick }: { activeNode: string | null; onNodeClick: (id: string) => void }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Build connections as SVG lines
  const lines: { x1: number; y1: number; x2: number; y2: number; active: boolean }[] = [];
  ECOSYSTEM_NODES.forEach(node => {
    node.connections.forEach(targetId => {
      const target = ECOSYSTEM_NODES.find(n => n.id === targetId);
      if (!target) return;
      const isActive =
        activeNode === node.id || activeNode === targetId ||
        hoveredNode === node.id || hoveredNode === targetId;
      lines.push({ x1: node.x, y1: node.y, x2: target.x, y2: target.y, active: isActive });
    });
  });

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/7 glass-panel p-4"
         style={{ minHeight: 220 }}>
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-purple-400" /> Skill Ecosystem Graph
        </h3>
        <span className="text-[9px] text-slate-600">Click a node to filter</span>
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full"
        style={{ height: 180 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {ECOSYSTEM_NODES.map(n => (
            <radialGradient key={n.id} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="rgba(255,255,255,0.15)" />
          </marker>
        </defs>

        {/* Connection lines */}
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.06)"}
            strokeWidth={l.active ? "0.8" : "0.4"}
            strokeDasharray={l.active ? "none" : "2,2"}
            markerEnd="url(#arrow)"
            style={{ transition: "all 0.3s" }}
          />
        ))}

        {/* Nodes */}
        {ECOSYSTEM_NODES.map((node) => {
          const isActive = activeNode === node.id || hoveredNode === node.id;
          const r = node.size / 10;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => onNodeClick(node.id === activeNode ? "" : node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Glow halo */}
              <circle
                r={r * 2.5}
                fill={`url(#glow-${node.id})`}
                opacity={isActive ? 1 : 0.3}
                style={{ transition: "opacity 0.3s" }}
              />
              {/* Main circle */}
              <circle
                r={r}
                fill={isActive ? node.color : "rgba(15,12,30,0.9)"}
                stroke={node.color}
                strokeWidth={isActive ? "0.8" : "0.4"}
                style={{ transition: "all 0.3s", filter: isActive ? `drop-shadow(0 0 4px ${node.color})` : "none" }}
              />
              {/* Label */}
              <text
                textAnchor="middle"
                dy={r + 3.5}
                fontSize="3.5"
                fill={isActive ? "white" : "rgba(148,163,184,0.8)"}
                fontWeight={isActive ? "700" : "500"}
                style={{ transition: "all 0.3s", userSelect: "none" }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Resource Card ─────────────────────────────────────────────────────────────

const ResourceCard = ({ resource, index }: { resource: Resource; index: number }) => {
  const [liked, setLiked] = useState(false);
  const catConf = CATEGORY_CONFIG[resource.category];
  const diffConf = DIFFICULTY_CONFIG[resource.difficulty];
  const CatIcon = catConf.icon;
  const MetaIcon = resource.metaIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl border border-white/6 glass-panel overflow-hidden cursor-default transition-all duration-300 hover:border-white/15 flex flex-col"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
    >
      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ background: `linear-gradient(to right, transparent, ${catConf.glow.replace("0.3", "0.8")}, transparent)` }} />

      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${catConf.bg} ${catConf.border} shrink-0`}
                 style={{ boxShadow: `0 0 12px ${catConf.glow}` }}>
              <CatIcon className={`w-4 h-4 ${catConf.color}`} />
            </div>
            <div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${catConf.color}`}>{resource.category}</div>
              <div className="text-[10px] text-slate-500">{resource.author}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {resource.aiRecommended && (
              <div className="flex items-center gap-1 text-[8px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> AI Pick
              </div>
            )}
            {resource.trending && (
              <div className="flex items-center gap-1 text-[8px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
                <Flame className="w-2.5 h-2.5" /> Trending
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-bold text-white text-sm leading-snug group-hover:text-purple-200 transition-colors">
            {resource.title}
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
            {resource.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {resource.tags.map(tag => (
            <span key={tag} className="text-[9px] font-semibold text-slate-500 bg-white/3 border border-white/6 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-black/10">
        <div className="flex items-center gap-3">
          {/* Quality score */}
          <div className="flex items-center gap-1">
            <div className="relative w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resource.qualityScore}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${catConf.glow.replace("0.3","0.9")}, white)` }}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-400">{resource.qualityScore}</span>
          </div>

          {/* Difficulty */}
          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${diffConf.color} ${diffConf.bg} ${diffConf.border}`}>
            {resource.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-slate-600">
            <MetaIcon className="w-3 h-3" />
            <span>{resource.meta}</span>
          </div>
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => setLiked(l => !l)}
              className={`p-1 rounded-md transition-all cursor-pointer ${liked ? "text-rose-400" : "text-slate-700 hover:text-rose-400"}`}
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <a href={resource.url} className="p-1 rounded-md text-slate-700 hover:text-white transition-colors cursor-pointer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SkillsPanel() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeNode, setActiveNode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIOnly, setShowAIOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  // Map ecosystem node id → relevant categories
  const NODE_CATEGORY_MAP: Record<string, (Category | "All")[]> = {
    docker:     ["Docker" as Category, "GitHub", "YouTube", "Courses"],
    linux:      ["Documentation", "Blogs"],
    kubernetes: ["All"],
    cloud:      ["Courses", "Documentation"],
    devops:     ["Blogs", "Open Source", "GitHub"],
    cncf:       ["Open Source"],
  };

  const filteredResources = RESOURCES.filter(r => {
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = searchQuery.trim() === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchAI = !showAIOnly || r.aiRecommended;
    const matchTrend = !showTrendingOnly || r.trending;
    return matchCat && matchSearch && matchAI && matchTrend;
  });

  const handleNodeClick = (nodeId: string) => {
    setActiveNode(nodeId);
    if (nodeId && NODE_CATEGORY_MAP[nodeId]) {
      setActiveCategory(NODE_CATEGORY_MAP[nodeId][0]);
    } else {
      setActiveCategory("All");
    }
  };

  const stats = {
    total: RESOURCES.length,
    aiPicks: RESOURCES.filter(r => r.aiRecommended).length,
    trending: RESOURCES.filter(r => r.trending).length,
    avgScore: Math.round(RESOURCES.reduce((a, r) => a + r.qualityScore, 0) / RESOURCES.length),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-white/7 p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, rgba(9,7,24,0.85) 0%, rgba(20,15,50,0.7) 100%)" }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute bottom-[-20%] left-[20%] w-60 h-60 rounded-full opacity-10 pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> AI Ecosystem Discovery
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Skill Ecosystem:{" "}
              <span className="gradient-text">Kubernetes</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg">
              Every resource you need — curated, ranked, and mapped by NeuroLearn AI. From YouTube channels to open-source tools, your complete learning universe.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {[
              { label: "Resources",  value: stats.total,    icon: Globe,     color: "text-blue-400"    },
              { label: "AI Picks",   value: stats.aiPicks,  icon: Sparkles,  color: "text-purple-400"  },
              { label: "Trending",   value: stats.trending, icon: Flame,     color: "text-rose-400"    },
              { label: "Avg Quality",value: stats.avgScore, icon: Award,     color: "text-amber-400"   },
            ].map(s => (
              <div key={s.label} className="px-4 py-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wide">{s.label}</div>
                  <div className="text-sm font-bold text-white">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* ── Left Sidebar ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Ecosystem Graph */}
          <EcosystemGraph activeNode={activeNode} onNodeClick={handleNodeClick} />

          {/* Active node info */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {(() => {
                  const node = ECOSYSTEM_NODES.find(n => n.id === activeNode);
                  if (!node) return null;
                  return (
                    <div className="rounded-2xl border border-white/7 glass-panel p-4 space-y-2"
                         style={{ boxShadow: `0 0 20px ${node.glow}` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: node.color, boxShadow: `0 0 6px ${node.color}` }} />
                        <span className="text-sm font-bold text-white">{node.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{node.description}</p>
                      {node.connections.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {node.connections.map(c => {
                            const cn = ECOSYSTEM_NODES.find(n => n.id === c);
                            return cn ? (
                              <span key={c} className="text-[9px] font-bold text-slate-500 bg-white/3 border border-white/6 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <ArrowRight className="w-2.5 h-2.5" /> {cn.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      <button onClick={() => { setActiveNode(""); setActiveCategory("All"); }}
                              className="text-[9px] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer mt-1">
                        ✕ Clear filter
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category list */}
          <div className="glass-panel rounded-2xl border border-white/7 p-4 space-y-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-1.5">
              <Filter className="w-3 h-3" /> Resource Categories
            </h3>
            {ALL_CATEGORIES.map(cat => {
              const conf = cat !== "All" ? CATEGORY_CONFIG[cat] : null;
              const Icon = conf ? conf.icon : Globe;
              const count = cat === "All" ? RESOURCES.length : RESOURCES.filter(r => r.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? conf
                        ? `${conf.bg} ${conf.border} ${conf.color}`
                        : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/3"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    {cat}
                  </span>
                  <span className="text-[9px] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Search & filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources, tools, authors..."
                className="w-full glass-input pl-9 pr-4 py-2.5 text-sm focus:outline-none rounded-xl"
              />
            </div>
            <button
              onClick={() => setShowAIOnly(p => !p)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                showAIOnly
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                  : "bg-white/3 border-white/7 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Picks
            </button>
            <button
              onClick={() => setShowTrendingOnly(p => !p)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                showTrendingOnly
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                  : "bg-white/3 border-white/7 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Trending
            </button>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Showing <strong className="text-white">{filteredResources.length}</strong> resources
              {activeCategory !== "All" && <> in <strong className="text-white">{activeCategory}</strong></>}
              {searchQuery && <> matching <strong className="text-white">"{searchQuery}"</strong></>}
            </span>
            {(activeCategory !== "All" || searchQuery || showAIOnly || showTrendingOnly) && (
              <button
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); setShowAIOnly(false); setShowTrendingOnly(false); setActiveNode(""); }}
                className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer ml-1"
              >
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* Category section groups */}
          {activeCategory === "All" ? (
            // Grouped view
            (Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
              const catResources = filteredResources.filter(r => r.category === cat);
              if (catResources.length === 0) return null;
              const conf = CATEGORY_CONFIG[cat];
              const CatIcon = conf.icon;
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`flex items-center gap-2 text-sm font-bold ${conf.color}`}>
                      <CatIcon className="w-4 h-4" />
                      {cat}
                      <span className="text-[9px] font-bold text-slate-600 bg-white/3 border border-white/5 px-1.5 py-0.5 rounded-full">{catResources.length}</span>
                    </h3>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                      {catResources.slice(0, 2).map((r, i) => (
                        <ResourceCard key={r.id} resource={r} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          ) : (
            // Flat filtered grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredResources.length > 0
                  ? filteredResources.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)
                  : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 py-16 text-center text-slate-600"
                    >
                      <Eye className="w-8 h-8 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No resources found for these filters</p>
                      <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="text-xs text-purple-400 mt-2 cursor-pointer">Clear filters</button>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
