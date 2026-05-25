"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Clock, CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp,
  BookOpen, Zap, Shield, Target, GitBranch, Award, Timer, BarChart3,
  Container, Server, Network, Package, Activity, GitMerge, Layers3,
  Lock, Cpu, TrendingUp, Star
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";
type Status = "completed" | "current" | "upcoming" | "locked";

interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  type: "video" | "lab" | "quiz" | "article";
  completed: boolean;
}

interface RoadmapSection {
  id: string;
  week: number;
  title: string;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  status: Status;
  progressPct: number;
  estimatedHours: number;
  skillsUnlocked: string[];
  dependencies: string[]; // ids of sections this depends on
  lessons: Lesson[];
  icon: React.ElementType;
  color: string; // tailwind gradient from-to
  glowColor: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const sections: RoadmapSection[] = [
  {
    id: "docker-basics",
    week: 1,
    title: "Docker Basics",
    subtitle: "Week 1–2",
    description:
      "Master containerization fundamentals. Learn to build, run, and publish Docker images. Understand the Docker daemon, client, registry, and networking model.",
    difficulty: "Beginner",
    status: "completed",
    progressPct: 100,
    estimatedHours: 12,
    skillsUnlocked: ["Containerization", "Dockerfile", "Docker CLI", "Registry"],
    dependencies: [],
    icon: Container,
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59,130,246,0.3)",
    lessons: [
      { id: "d1", title: "What is Docker & Why Containers?", durationMin: 20, type: "video", completed: true },
      { id: "d2", title: "Installing Docker Desktop", durationMin: 15, type: "article", completed: true },
      { id: "d3", title: "Your First Dockerfile", durationMin: 30, type: "lab", completed: true },
      { id: "d4", title: "Docker Hub & Image Registries", durationMin: 25, type: "video", completed: true },
      { id: "d5", title: "Docker Networking & Volumes", durationMin: 35, type: "lab", completed: true },
      { id: "d6", title: "Docker Basics Quiz", durationMin: 15, type: "quiz", completed: true },
    ],
  },
  {
    id: "containers",
    week: 3,
    title: "Containers Deep Dive",
    subtitle: "Week 3–4",
    description:
      "Go beyond the basics. Explore multi-stage builds, Docker Compose for local orchestration, environment management, and security best practices.",
    difficulty: "Beginner",
    status: "completed",
    progressPct: 100,
    estimatedHours: 14,
    skillsUnlocked: ["Docker Compose", "Multi-stage Builds", "Container Security"],
    dependencies: ["docker-basics"],
    icon: Layers3,
    color: "from-cyan-500 to-teal-500",
    glowColor: "rgba(6,182,212,0.3)",
    lessons: [
      { id: "c1", title: "Multi-Stage Docker Builds", durationMin: 30, type: "lab", completed: true },
      { id: "c2", title: "Docker Compose Orchestration", durationMin: 45, type: "lab", completed: true },
      { id: "c3", title: "Container Security Principles", durationMin: 20, type: "video", completed: true },
      { id: "c4", title: "Environment & Secrets Management", durationMin: 25, type: "article", completed: true },
      { id: "c5", title: "Containers Deep Dive Quiz", durationMin: 15, type: "quiz", completed: true },
    ],
  },
  {
    id: "k8s-architecture",
    week: 5,
    title: "Kubernetes Architecture",
    subtitle: "Week 5–6",
    description:
      "Understand the control plane and worker nodes. Deep dive into the API Server, etcd, Scheduler, Controller Manager, Kubelet, and kube-proxy.",
    difficulty: "Intermediate",
    status: "current",
    progressPct: 62,
    estimatedHours: 16,
    skillsUnlocked: ["Control Plane", "etcd", "Kubelet", "kube-proxy", "kubectl"],
    dependencies: ["containers"],
    icon: Server,
    color: "from-violet-500 to-purple-600",
    glowColor: "rgba(139,92,246,0.4)",
    lessons: [
      { id: "k1", title: "Kubernetes Architecture Overview", durationMin: 35, type: "video", completed: true },
      { id: "k2", title: "Control Plane Deep Dive", durationMin: 40, type: "video", completed: true },
      { id: "k3", title: "Setting up a Local Cluster (minikube)", durationMin: 30, type: "lab", completed: true },
      { id: "k4", title: "kubectl Crash Course", durationMin: 50, type: "lab", completed: false },
      { id: "k5", title: "Cluster Networking Model", durationMin: 30, type: "article", completed: false },
      { id: "k6", title: "Architecture Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "pods",
    week: 7,
    title: "Pods & Workloads",
    subtitle: "Week 7–8",
    description:
      "Master the smallest deployable unit in Kubernetes. Learn Pod lifecycle, init containers, sidecar patterns, resource requests & limits.",
    difficulty: "Intermediate",
    status: "upcoming",
    progressPct: 0,
    estimatedHours: 14,
    skillsUnlocked: ["Pod Design", "Init Containers", "Resource Management", "YAML"],
    dependencies: ["k8s-architecture"],
    icon: Cpu,
    color: "from-indigo-500 to-blue-600",
    glowColor: "rgba(99,102,241,0.3)",
    lessons: [
      { id: "p1", title: "Pod Spec & Lifecycle", durationMin: 30, type: "video", completed: false },
      { id: "p2", title: "Multi-Container Pods & Sidecar Pattern", durationMin: 35, type: "lab", completed: false },
      { id: "p3", title: "ConfigMaps & Secrets", durationMin: 25, type: "lab", completed: false },
      { id: "p4", title: "Resource Requests & Limits", durationMin: 20, type: "article", completed: false },
      { id: "p5", title: "Pod Scheduling & Affinity", durationMin: 30, type: "video", completed: false },
      { id: "p6", title: "Pods Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "deployments",
    week: 9,
    title: "Deployments & ReplicaSets",
    subtitle: "Week 9–10",
    description:
      "Handle application rollouts and rollbacks. Implement rolling updates, canary deployments, and horizontal auto-scaling strategies.",
    difficulty: "Intermediate",
    status: "upcoming",
    progressPct: 0,
    estimatedHours: 16,
    skillsUnlocked: ["Rolling Updates", "Canary Deployments", "HPA", "Rollback"],
    dependencies: ["pods"],
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    glowColor: "rgba(168,85,247,0.3)",
    lessons: [
      { id: "dep1", title: "Deployments vs ReplicaSets", durationMin: 25, type: "video", completed: false },
      { id: "dep2", title: "Rolling Update Strategies", durationMin: 35, type: "lab", completed: false },
      { id: "dep3", title: "Horizontal Pod Autoscaler", durationMin: 30, type: "lab", completed: false },
      { id: "dep4", title: "Canary & Blue-Green Deployments", durationMin: 40, type: "lab", completed: false },
      { id: "dep5", title: "Deployments Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "services",
    week: 11,
    title: "Services & Networking",
    subtitle: "Week 11–12",
    description:
      "Expose pods to traffic reliably. Understand ClusterIP, NodePort, LoadBalancer, and Ingress controllers. Configure DNS and network policies.",
    difficulty: "Advanced",
    status: "locked",
    progressPct: 0,
    estimatedHours: 18,
    skillsUnlocked: ["ClusterIP", "Ingress", "Network Policies", "Service Mesh"],
    dependencies: ["deployments"],
    icon: Network,
    color: "from-pink-500 to-rose-600",
    glowColor: "rgba(236,72,153,0.3)",
    lessons: [
      { id: "s1", title: "ClusterIP vs NodePort vs LoadBalancer", durationMin: 35, type: "video", completed: false },
      { id: "s2", title: "Ingress Controllers (NGINX)", durationMin: 45, type: "lab", completed: false },
      { id: "s3", title: "DNS & Service Discovery", durationMin: 25, type: "article", completed: false },
      { id: "s4", title: "Network Policies", durationMin: 30, type: "lab", completed: false },
      { id: "s5", title: "Intro to Service Mesh (Istio)", durationMin: 40, type: "video", completed: false },
      { id: "s6", title: "Services Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "helm",
    week: 13,
    title: "Helm & Package Management",
    subtitle: "Week 13–14",
    description:
      "Use Helm to template, version, and distribute Kubernetes manifests. Build custom charts, manage releases, and integrate with artifact registries.",
    difficulty: "Advanced",
    status: "locked",
    progressPct: 0,
    estimatedHours: 12,
    skillsUnlocked: ["Helm Charts", "Templating", "Release Management", "OCI Registry"],
    dependencies: ["services"],
    icon: Package,
    color: "from-orange-500 to-amber-500",
    glowColor: "rgba(249,115,22,0.3)",
    lessons: [
      { id: "h1", title: "Helm Architecture & Concepts", durationMin: 25, type: "video", completed: false },
      { id: "h2", title: "Creating Your First Helm Chart", durationMin: 40, type: "lab", completed: false },
      { id: "h3", title: "Helm Templating & Values", durationMin: 35, type: "lab", completed: false },
      { id: "h4", title: "Managing Releases & Rollbacks", durationMin: 30, type: "lab", completed: false },
      { id: "h5", title: "Helm Repositories & OCI", durationMin: 20, type: "article", completed: false },
      { id: "h6", title: "Helm Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "monitoring",
    week: 15,
    title: "Monitoring & Observability",
    subtitle: "Week 15–16",
    description:
      "Set up production-grade monitoring with Prometheus and Grafana. Implement distributed tracing with Jaeger and centralized logging with Loki.",
    difficulty: "Advanced",
    status: "locked",
    progressPct: 0,
    estimatedHours: 20,
    skillsUnlocked: ["Prometheus", "Grafana", "Alerting", "Tracing", "Log Aggregation"],
    dependencies: ["helm"],
    icon: Activity,
    color: "from-emerald-500 to-green-600",
    glowColor: "rgba(16,185,129,0.3)",
    lessons: [
      { id: "mon1", title: "Prometheus Metrics & Scraping", durationMin: 35, type: "lab", completed: false },
      { id: "mon2", title: "Building Grafana Dashboards", durationMin: 45, type: "lab", completed: false },
      { id: "mon3", title: "Alertmanager Rules", durationMin: 30, type: "lab", completed: false },
      { id: "mon4", title: "Distributed Tracing with Jaeger", durationMin: 35, type: "video", completed: false },
      { id: "mon5", title: "Log Aggregation with Loki", durationMin: 30, type: "lab", completed: false },
      { id: "mon6", title: "Observability Quiz", durationMin: 15, type: "quiz", completed: false },
    ],
  },
  {
    id: "cicd",
    week: 17,
    title: "CI/CD & GitOps",
    subtitle: "Week 17–18",
    description:
      "Build production-ready pipelines with GitHub Actions and ArgoCD. Implement GitOps workflows, automated testing, and multi-environment deployments.",
    difficulty: "Expert",
    status: "locked",
    progressPct: 0,
    estimatedHours: 24,
    skillsUnlocked: ["GitHub Actions", "ArgoCD", "GitOps", "Pipeline Design", "IaC"],
    dependencies: ["monitoring"],
    icon: GitMerge,
    color: "from-rose-500 to-red-600",
    glowColor: "rgba(244,63,94,0.3)",
    lessons: [
      { id: "ci1", title: "CI/CD Principles & Design", durationMin: 30, type: "video", completed: false },
      { id: "ci2", title: "GitHub Actions for Kubernetes", durationMin: 50, type: "lab", completed: false },
      { id: "ci3", title: "ArgoCD GitOps Workflow", durationMin: 45, type: "lab", completed: false },
      { id: "ci4", title: "Multi-Environment Deployments", durationMin: 40, type: "lab", completed: false },
      { id: "ci5", title: "Secrets Management in CI/CD", durationMin: 25, type: "article", completed: false },
      { id: "ci6", title: "CI/CD Final Capstone Project", durationMin: 90, type: "lab", completed: false },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const difficultyConfig: Record<Difficulty, { color: string; bg: string; border: string }> = {
  Beginner:     { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Intermediate: { color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
  Advanced:     { color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/30"  },
  Expert:       { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30"    },
};

const lessonTypeConfig = {
  video:   { label: "Video",   color: "text-blue-400",    bg: "bg-blue-500/10",    icon: "▶" },
  lab:     { label: "Lab",     color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "⚗" },
  quiz:    { label: "Quiz",    color: "text-amber-400",   bg: "bg-amber-500/10",   icon: "✦" },
  article: { label: "Article", color: "text-violet-400",  bg: "bg-violet-500/10",  icon: "◎" },
};

const totalHours = sections.reduce((a, s) => a + s.estimatedHours, 0);
const completedSections = sections.filter(s => s.status === "completed").length;
const overallPct = Math.round(
  sections.reduce((a, s) => a + s.progressPct, 0) / sections.length
);

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatPill = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/3 border border-white/6 backdrop-blur-sm">
    <Icon className={`w-4 h-4 ${color}`} />
    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  </div>
);

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const cfg = difficultyConfig[difficulty];
  const stars = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 }[difficulty];
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {"★".repeat(stars)} {difficulty}
    </span>
  );
};

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "completed") return <div className="w-8 h-8 rounded-full bg-emerald-500/15 border-2 border-emerald-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>;
  if (status === "current")   return <div className="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-400/70 flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.5)] animate-pulse"><PlayCircle className="w-4 h-4 text-purple-300" /></div>;
  if (status === "locked")    return <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/8 flex items-center justify-center"><Lock className="w-3.5 h-3.5 text-slate-600" /></div>;
  return <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center"><Circle className="w-4 h-4 text-slate-500" /></div>;
};

interface SectionCardProps {
  section: RoadmapSection;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

const SectionCard = ({ section, index, isExpanded, onToggle, onSelect, isSelected }: SectionCardProps) => {
  const diff = difficultyConfig[section.difficulty];
  const isLocked = section.status === "locked";
  const completedLessons = section.lessons.filter(l => l.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative"
    >
      {/* Vertical connector line */}
      {index < sections.length - 1 && (
        <div className="absolute left-[19px] top-[60px] w-[2px] h-[calc(100%-20px)] z-0 overflow-hidden">
          <div
            className={`w-full h-full ${section.status === "completed" ? "bg-gradient-to-b from-emerald-500/60 to-purple-500/40" : "bg-white/6"}`}
            style={{ backgroundImage: section.status !== "completed" ? "repeating-linear-gradient(180deg,rgba(255,255,255,0.08) 0,rgba(255,255,255,0.08) 4px,transparent 4px,transparent 10px)" : undefined }}
          />
        </div>
      )}

      <div
        className={`relative z-10 ml-12 mb-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isSelected
            ? "border-purple-500/50 shadow-[0_0_24px_rgba(139,92,246,0.15)]"
            : isLocked
              ? "border-white/4 opacity-60"
              : "border-white/7 hover:border-white/15 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        } ${isLocked ? "" : "bg-[rgba(9,7,24,0.5)] backdrop-blur-md"} bg-[rgba(9,7,24,0.4)] backdrop-blur-md`}
        style={isSelected ? { boxShadow: `0 0 30px ${section.glowColor}` } : undefined}
        onClick={() => { if (!isLocked) { onSelect(); } }}
      >
        {/* Progress glow top border */}
        {section.status !== "locked" && section.progressPct > 0 && (
          <div className="absolute top-0 left-0 h-[2px] rounded-t-2xl overflow-hidden w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${section.progressPct}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${section.color}`}
            />
          </div>
        )}

        <div className="p-5">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {/* Icon with gradient */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} p-2.5 shrink-0 shadow-lg`} style={{ boxShadow: `0 4px 14px ${section.glowColor}` }}>
              <section.icon className="w-full h-full text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">{section.subtitle}</span>
                <DifficultyBadge difficulty={section.difficulty} />
                {section.status === "current" && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full animate-pulse">● Active</span>
                )}
              </div>
              <h3 className="font-bold text-white text-sm md:text-base leading-tight">{section.title}</h3>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{section.estimatedHours}h total</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{completedLessons}/{section.lessons.length} lessons</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {section.status !== "locked" && (
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{section.progressPct}%</div>
                  <div className="text-[9px] text-slate-500">done</div>
                </div>
              )}
              {!isLocked && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  className="p-1 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {section.status !== "locked" && (
            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${section.progressPct}%` }}
                transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${section.color} rounded-full`}
              />
            </div>
          )}

          {/* Expandable Lessons */}
          <AnimatePresence>
            {isExpanded && !isLocked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/6 space-y-2">
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{section.description}</p>

                  {/* Skills unlocked */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {section.skillsUnlocked.map(skill => (
                      <span key={skill} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${diff.color} ${diff.bg} ${diff.border}`}>
                        + {skill}
                      </span>
                    ))}
                  </div>

                  {/* Lesson list */}
                  <div className="space-y-1.5">
                    {section.lessons.map((lesson, li) => {
                      const typeConf = lessonTypeConfig[lesson.type];
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: li * 0.05 }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            lesson.completed
                              ? "bg-emerald-500/5 border-emerald-500/15"
                              : "bg-white/2 border-white/5 hover:bg-white/4"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            lesson.completed
                              ? "bg-emerald-500/20 border border-emerald-500/40"
                              : "bg-white/5 border border-white/10"
                          }`}>
                            {lesson.completed
                              ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              : <Circle className="w-3 h-3 text-slate-600" />}
                          </div>
                          <span className={`text-xs flex-1 ${lesson.completed ? "text-slate-400 line-through decoration-slate-600" : "text-slate-300"}`}>
                            {lesson.title}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeConf.color} ${typeConf.bg}`}>
                            {typeConf.icon} {typeConf.label}
                          </span>
                          <span className="text-[9px] text-slate-600 font-medium">{lesson.durationMin}m</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* CTA button */}
                  <div className="pt-3">
                    {section.status === "completed" ? (
                      <button className="w-full text-center text-xs font-bold text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 py-2.5 rounded-xl cursor-default flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Section Complete — Review Available
                      </button>
                    ) : (
                      <button className={`w-full text-center text-xs font-bold text-white bg-gradient-to-r ${section.color} py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-90 hover:shadow-lg`}
                        style={{ boxShadow: `0 4px 16px ${section.glowColor}` }}>
                        <PlayCircle className="w-4 h-4" /> Continue Learning
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Node icon on the vertical line */}
      <div className="absolute left-0 top-5 z-20">
        <StatusIcon status={section.status} />
      </div>
    </motion.div>
  );
};

// ── Dependency Graph ───────────────────────────────────────────────────────────

const DependencyGraph = ({ selected }: { selected: RoadmapSection | null }) => {
  const nodes = sections.map(s => ({
    id: s.id,
    label: s.title.split(" ")[0],
    status: s.status,
    color: s.color,
    glowColor: s.glowColor,
  }));

  return (
    <div className="rounded-2xl glass-panel border border-white/7 p-5 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <GitBranch className="w-3.5 h-3.5 text-purple-400" /> Skill Dependency Map
      </h3>
      <div className="relative flex flex-col items-center gap-2">
        {nodes.map((node, i) => {
          const isSelected = selected?.id === node.id;
          const isDep = selected?.dependencies.includes(node.id);
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="relative w-full"
            >
              {i > 0 && (
                <div className="absolute left-1/2 -top-2 w-[2px] h-2 bg-white/10 -translate-x-1/2" />
              )}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                isSelected
                  ? `border-purple-500/60 bg-purple-500/10 shadow-[0_0_12px_rgba(139,92,246,0.2)]`
                  : isDep
                    ? "border-cyan-500/40 bg-cyan-500/5"
                    : node.status === "completed"
                      ? "border-emerald-500/25 bg-emerald-500/5"
                      : node.status === "locked"
                        ? "border-white/4 opacity-50"
                        : "border-white/6 bg-white/2"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  node.status === "completed" ? "bg-emerald-400" :
                  node.status === "current" ? "bg-purple-400 animate-pulse" :
                  node.status === "locked" ? "bg-slate-700" : "bg-slate-500"
                }`} />
                <span className={`text-[10px] font-semibold ${isSelected ? "text-purple-300" : isDep ? "text-cyan-300" : "text-slate-400"}`}>
                  {node.label}
                </span>
                {isDep && <span className="ml-auto text-[8px] text-cyan-500 font-bold uppercase">required</span>}
                {isSelected && <span className="ml-auto text-[8px] text-purple-400 font-bold uppercase">active</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
      {selected && selected.dependencies.length > 0 && (
        <p className="text-[10px] text-slate-600 text-center">
          {selected.title} requires completing {selected.dependencies.length} prerequisite{selected.dependencies.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

// ── Overview Milestones ────────────────────────────────────────────────────────

const milestones = [
  { week: 4,  label: "Container Foundations",    badge: "🏅", achieved: true  },
  { week: 8,  label: "K8s Fundamentals",          badge: "🎖️", achieved: false },
  { week: 14, label: "Production Ready",          badge: "🏆", achieved: false },
  { week: 18, label: "DevOps Engineer Certified", badge: "👑", achieved: false },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export default function RoadmapPanel() {
  const [expandedId, setExpandedId] = useState<string | null>("k8s-architecture");
  const [selectedId, setSelectedId] = useState<string>("k8s-architecture");

  const selectedSection = sections.find(s => s.id === selectedId) ?? null;

  const toggleExpand = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/8 p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(9,7,24,0.8) 0%, rgba(30,20,60,0.6) 100%)",
          boxShadow: "0 0 60px rgba(139,92,246,0.1)",
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 left-[30%] w-40 h-40 rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)", filter: "blur(30px)" }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Generated Learning Path
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Learn Kubernetes in{" "}
              <span className="gradient-text">90 Days</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg">
              A structured, hands-on journey from Docker fundamentals to production-grade GitOps pipelines. Designed by NeuroLearn AI based on your skill profile.
            </p>
          </div>

          {/* Circular overall progress */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <motion.circle
                  cx="40" cy="40" r="33"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 33}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 33 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 33 * (1 - overallPct / 100) }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-white">{overallPct}%</span>
                <span className="text-[8px] text-slate-500 uppercase">done</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">Progress</div>
              <div className="text-sm font-bold text-white">{completedSections} / {sections.length} sections</div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] text-emerald-400 font-semibold">On track</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat pills row */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6">
          <StatPill icon={Timer} label="Duration" value="90 Days" color="text-violet-400" />
          <StatPill icon={Clock} label="Total Hours" value={`${totalHours}h`} color="text-cyan-400" />
          <StatPill icon={BookOpen} label="Sections" value={sections.length} color="text-blue-400" />
          <StatPill icon={Target} label="Completed" value={completedSections} color="text-emerald-400" />
          <StatPill icon={Award} label="Difficulty" value="Advanced" color="text-purple-400" />
          <StatPill icon={BarChart3} label="XP Reward" value="8,400 XP" color="text-amber-400" />
        </div>
      </motion.div>

      {/* ── Weekly Milestones Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-panel rounded-2xl border border-white/7 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400" /> Weekly Milestones
          </h3>
        </div>
        <div className="relative flex items-center">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-emerald-500/30 via-purple-500/20 to-white/5 -translate-y-1/2" />
          <div className="relative flex justify-between w-full">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`text-xl ${m.achieved ? "" : "grayscale opacity-40"}`}>{m.badge}</div>
                <div className={`text-[9px] font-bold text-center max-w-[60px] ${m.achieved ? "text-white" : "text-slate-600"}`}>
                  {m.label}
                </div>
                <div className={`text-[8px] uppercase tracking-wide ${m.achieved ? "text-emerald-400" : "text-slate-600"}`}>
                  Wk {m.week}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Main Content Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline / Roadmap List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Learning Timeline
            </h3>
            <div className="flex gap-2 text-[9px] font-semibold">
              <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400" />Completed</span>
              <span className="flex items-center gap-1 text-purple-400"><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />Active</span>
              <span className="flex items-center gap-1 text-slate-600"><div className="w-2 h-2 rounded-full bg-slate-700" />Locked</span>
            </div>
          </div>

          <div className="relative">
            {sections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                index={idx}
                isExpanded={expandedId === section.id}
                isSelected={selectedId === section.id}
                onToggle={() => toggleExpand(section.id)}
                onSelect={() => setSelectedId(section.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Detail + Dependency Graph */}
        <div className="lg:col-span-1 space-y-4">

          {/* Section Detail Card */}
          <AnimatePresence mode="wait">
            {selectedSection && (
              <motion.div
                key={selectedSection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl glass-panel border border-white/8 p-5 space-y-5 sticky top-4"
                style={{ boxShadow: `0 0 30px ${selectedSection.glowColor}` }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedSection.color} p-2.5 shrink-0`} style={{ boxShadow: `0 4px 14px ${selectedSection.glowColor}` }}>
                    <selectedSection.icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <DifficultyBadge difficulty={selectedSection.difficulty} />
                    </div>
                    <h3 className="text-sm font-bold text-white">{selectedSection.title}</h3>
                    <p className="text-[10px] text-slate-500">{selectedSection.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{selectedSection.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Duration", value: `${selectedSection.estimatedHours}h`, icon: Clock },
                    { label: "Progress", value: `${selectedSection.progressPct}%`, icon: BarChart3 },
                    { label: "Lessons", value: `${selectedSection.lessons.length}`, icon: BookOpen },
                    { label: "Skills", value: `+${selectedSection.skillsUnlocked.length}`, icon: Zap },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/5">
                      <stat.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div>
                        <div className="text-[8px] text-slate-600 uppercase tracking-wide">{stat.label}</div>
                        <div className="text-xs font-bold text-white">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills unlocked */}
                <div className="space-y-2">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-cyan-400" /> Skills Unlocked
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSection.skillsUnlocked.map(skill => (
                      <span key={skill} className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div>
                  {selectedSection.status === "completed" ? (
                    <button className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Completed — Review Lessons
                    </button>
                  ) : selectedSection.status === "locked" ? (
                    <button className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-white/2 border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" /> Complete Prerequisites First
                    </button>
                  ) : (
                    <button
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${selectedSection.color} flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity`}
                      style={{ boxShadow: `0 4px 16px ${selectedSection.glowColor}` }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {selectedSection.status === "current" ? "Continue Learning" : "Start Section"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dependency Graph */}
          <DependencyGraph selected={selectedSection} />
        </div>
      </div>
    </div>
  );
}
