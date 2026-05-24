"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Award, Clock, Star, Heart, CheckCircle2, Eye, Filter } from "lucide-react";
import { mockDashboardData, SkillNode } from "@/lib/mockData";

export default function SkillsPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(mockDashboardData.skills[0]);

  const categories = ["All", "AI/ML", "Frontend", "Systems"];

  const filteredSkills = selectedCategory === "All"
    ? mockDashboardData.skills
    : mockDashboardData.skills.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Skill Ecosystem
          </h2>
          <p className="text-slate-400 text-sm">
            Visual skill matrices mapped directly to standard enterprise capabilities.
          </p>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold py-2 px-4 rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "bg-white/3 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Skill Nodes Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => {
              const isSelected = selectedSkill.name === skill.name;
              
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-40 ${
                    isSelected
                      ? "bg-amber-500/5 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "glass-panel border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{skill.category}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        skill.status === "mastered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {skill.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base truncate">{skill.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Proficiency Level</span>
                      <span className="text-white font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right: Skill Detail Inspector */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6 sticky top-6 hover:shadow-[0_10px_30px_rgba(245,158,11,0.05)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedSkill.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Level {Math.floor(selectedSkill.level / 10)} Index</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time Dedicated
                  </div>
                  <p className="text-sm font-bold text-white">{selectedSkill.hoursSpent} Hours</p>
                </div>
                <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> Mastery Rating
                  </div>
                  <p className="text-sm font-bold text-white">{selectedSkill.level > 80 ? "Advanced" : "Intermediate"}</p>
                </div>
              </div>

              {/* Pathway tips */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Cognitive Target Suggestions
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Deploy a sample project utilizing this skill.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete 2 more quiz nodes under the active roadmap path.</span>
                  </li>
                </ul>
              </div>

              {/* Simulated project details link */}
              <div className="pt-4 border-t border-white/5">
                <button className="w-full text-center text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <Eye className="w-4 h-4" /> View Associated Repos
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
