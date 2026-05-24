"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  ChevronRight
} from "lucide-react";
import { mockDashboardData } from "@/lib/mockData";

interface DashboardPanelProps {
  onNavigateToTab: (tab: "mentor" | "roadmap" | "skills" | "communities" | "analytics") => void;
}

export default function DashboardPanel({ onNavigateToTab }: DashboardPanelProps) {
  const data = mockDashboardData;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto pb-10"
    >
      {/* 1. Welcome Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Glow backdrop orbs */}
        <div className="absolute top-0 right-1/4 w-[300px] h-[150px] orb-glow-purple -z-10 rounded-full" />
        <div className="absolute bottom-0 right-0 w-[200px] h-[100px] orb-glow-blue -z-10 rounded-full" />

        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Engineered Learning Active
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{data.user.name}</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Your cognitive pathways are firing efficiently today. You are in the top <span className="text-cyan-400 font-semibold">8%</span> of developers studying Neural Architectures this week.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Level {data.user.level} {data.user.rankName}</span>
            </div>
            <div className="text-xs text-slate-400">
              EXP: <span className="text-purple-400 font-bold">{data.user.exp}</span> / {data.user.nextLevelExp}
            </div>
          </div>
        </div>

        {/* Hero Quick Start Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateToTab("mentor")}
          className="relative group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
        >
          <span>Ask AI Mentor</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Grid Layout: Top widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Personalized Learning Progress Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(168, 85, 247, 0.3)" }}
          className="lg:col-span-2 rounded-2xl glass-panel p-6 flex flex-col justify-between border border-white/5 hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Active Course</p>
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors text-base md:text-lg line-clamp-1">
                    {data.progress.currentCourse}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300">
                {data.progress.lessonsCompleted}/{data.progress.totalLessons} Lessons
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Overall Completion</span>
                <span className="text-purple-400 font-bold">{data.progress.overallCompletion}%</span>
              </div>
              <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.progress.overallCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Next Lesson Preview */}
            <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Next AI-Targeted Unit
              </div>
              <p className="text-xs font-semibold text-white truncate">{data.progress.nextLesson}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated {data.progress.lastActive}
            </span>
            <button 
              onClick={() => onNavigateToTab("roadmap")}
              className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-1 group cursor-pointer"
            >
              Resume Journey <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* 3. Current Learning Streak Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(239, 68, 68, 0.3)" }}
          className="rounded-2xl glass-panel p-6 flex flex-col justify-between border border-white/5 hover:shadow-[0_10px_30px_rgba(239,68,68,0.05)] transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <Flame className="w-5 h-5 flame-animation" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Weekly Momentum</h3>
                  <p className="text-xs text-slate-400">Keep the neural pathways firing</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-red-500">{data.streak.current}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Day Streak</span>
              </div>
            </div>

            {/* Weekly Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {data.streak.weekly.map((day, i) => (
                <div key={day.day} className="flex flex-col items-center gap-1.5">
                  <div className="text-[10px] text-slate-400 font-semibold">{day.day}</div>
                  <div 
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      day.active 
                        ? i === 6 
                          ? "bg-red-500/20 border-red-500 text-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                          : "bg-gradient-to-br from-red-600/30 to-orange-500/20 border-red-500/40 text-red-400 font-semibold"
                        : "bg-slate-950/60 border-white/5 text-slate-600"
                    }`}
                  >
                    {day.active ? (
                      <Flame className={`w-4 h-4 ${i === 6 ? "flame-animation" : ""}`} />
                    ) : (
                      <span className="text-[10px]">-</span>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-500">{day.value}m</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-white/5 pt-4 text-center">
            Max Streak: <span className="text-white font-semibold">{data.streak.max} Days</span>. Focus target today is 30m.
          </div>
        </motion.div>
      </div>

      {/* Grid Layout: Mid widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 4. AI-Generated Roadmap Preview */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(168, 85, 247, 0.3)" }}
          className="lg:col-span-2 rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Active Roadmap Nodes</h3>
                  <p className="text-xs text-slate-400">Dynamic sequential pathway optimized by NeuroLearn AI</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab("roadmap")}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Full View <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual connected nodes preview */}
            <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-4 py-4 md:px-2">
              {/* Connector line for large screens */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 hidden md:block -translate-y-1/2 z-0" />
              
              {data.roadmap.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";
                
                return (
                  <div key={step.id} className="relative z-10 flex-1 flex md:flex-col items-center gap-3 md:gap-2.5 text-left md:text-center">
                    {/* Node circle */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs shadow-md transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                          : isCurrent 
                            ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse" 
                            : "bg-slate-900 border-white/10 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${isCurrent ? "text-purple-300" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">
                        {step.estimatedMinutes} min • {step.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Estimated time to milestone: <b>4.5 hrs</b></span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              3 Skills Unlocking Next
            </span>
          </div>
        </motion.div>

        {/* 5. Skill Progress Visualization */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.3)" }}
          className="rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(6,182,212,0.05)] transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Key Capabilities</h3>
                  <p className="text-xs text-slate-400">Core neural clusters</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab("skills")}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Expand
              </button>
            </div>

            {/* Skill list miniature */}
            <div className="space-y-3">
              {data.skills.slice(0, 3).map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate">{skill.name}</span>
                    <span className="text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        skill.category === "AI/ML" 
                          ? "from-purple-500 to-indigo-500" 
                          : "from-blue-500 to-cyan-500"
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-white/5 pt-4">
            Strengths: <span className="text-white font-semibold">Frontend Architecture & React</span>
          </div>
        </motion.div>
      </div>

      {/* Grid Layout: Bottom panels (Communities, Events) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 6. Recommended Communities Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(217, 70, 239, 0.3)" }}
          className="rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(217,70,239,0.05)] transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Recommended Hubs</h3>
                  <p className="text-xs text-slate-400">Collaborative learning networks</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab("communities")}
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
              >
                Browse All
              </button>
            </div>

            <div className="divide-y divide-white/5 space-y-3">
              {data.communities.slice(0, 2).map((community) => (
                <div key={community.id} className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{community.image}</span>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{community.name}</h4>
                      <p className="text-[10px] text-slate-400">{community.tag} • {community.membersCount} Members</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigateToTab("communities")}
                    className="text-[11px] font-semibold text-white bg-white/5 border border-white/10 hover:border-pink-500/40 hover:text-pink-400 py-1 px-3.5 rounded-lg transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center border-t border-white/5 pt-4">
            Join group channels for study milestones and resource sharing.
          </div>
        </motion.div>

        {/* 7. Upcoming Events Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(16, 185, 129, 0.3)" }}
          className="rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)] transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Upcoming Events</h3>
                  <p className="text-xs text-slate-400">Sync with cohort sessions</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Active Cohort
              </span>
            </div>

            <div className="space-y-3">
              {data.events.slice(0, 2).map((event) => (
                <div key={event.id} className="p-3 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{event.type}</span>
                    <h4 className="text-xs font-semibold text-white truncate">{event.title}</h4>
                    <p className="text-[10px] text-slate-400">{event.date} at {event.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 font-bold">{event.attendees} active</div>
                    <button className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 mt-1 cursor-pointer">
                      Remind Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center border-t border-white/5 pt-4">
            Next workshop is hosted by the AI Lead in 2 days.
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
