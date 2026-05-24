"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Sparkles, CheckCircle2, Circle, PlayCircle, Clock, BookOpen, Layers, Plus } from "lucide-react";
import { mockDashboardData, RoadmapStep } from "@/lib/mockData";

export default function RoadmapPanel() {
  const steps = mockDashboardData.roadmap;
  const [selectedStep, setSelectedStep] = useState<RoadmapStep>(steps[1]); // default to current step
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-400" />
            AI Cognitive Roadmap
          </h2>
          <p className="text-slate-400 text-sm">
            Curated and re-calculated dynamically based on your current performance and quiz scores.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="relative group inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-white font-semibold py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Optimizing Graph...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Recalculate Path</span>
            </>
          )}
        </button>
      </div>

      {/* Main Roadmap Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Roadmap list */}
        <div className="lg:col-span-2 space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isSelected = selectedStep.id === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedStep(step)}
                className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected 
                    ? "bg-purple-500/5 border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                    : "glass-panel border-white/5 hover:border-white/20"
                }`}
              >
                {/* Node Status Mark */}
                <div className="mt-1">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)] animate-pulse">
                      <PlayCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600">
                      <Circle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Unit {idx + 1}</span>
                    {isCurrent && (
                      <span className="text-[9px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 rounded uppercase tracking-wider">
                        Active Node
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-sm md:text-base ${isCompleted ? "text-slate-300" : "text-white"}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{step.description}</p>
                </div>

                {/* Duration Tag */}
                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {step.estimatedMinutes}m
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Node Detail Drawer / Info Card */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6 sticky top-6 hover:shadow-[0_10px_30px_rgba(139,92,246,0.05)] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${
                    selectedStep.status === "completed" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                      : selectedStep.status === "current"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/25"
                        : "bg-slate-900 text-slate-400 border border-white/5"
                  }`}>
                    {selectedStep.status}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedStep.estimatedMinutes} Mins</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedStep.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedStep.description}</p>
              </div>

              {/* Skills unlocked */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Cognitive Capabilities Unlocked
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStep.skillsUnlocked.map((skill) => (
                    <span 
                      key={skill} 
                      className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 py-1 px-2.5 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Lesson CTA */}
              <div className="pt-4 border-t border-white/5">
                {selectedStep.status === "completed" ? (
                  <button className="w-full text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-3 rounded-xl cursor-default flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Lesson Complete
                  </button>
                ) : (
                  <button className="w-full text-center text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Start Study Module
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
