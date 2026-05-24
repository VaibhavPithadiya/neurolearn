"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock, TrendingUp, Brain, Award, Zap, ChevronUp, Activity } from "lucide-react";
import { mockDashboardData } from "@/lib/mockData";

export default function AnalyticsPanel() {
  const data = mockDashboardData;

  // Visualizing custom chart heights
  const weeklyAnalytics = [
    { day: "Mon", mins: 45, height: "h-[35%]" },
    { day: "Tue", mins: 60, height: "h-[48%]" },
    { day: "Wed", mins: 30, height: "h-[24%]" },
    { day: "Thu", mins: 90, height: "h-[72%]" },
    { day: "Fri", mins: 40, height: "h-[32%]" },
    { day: "Sat", mins: 120, height: "h-[95%]" },
    { day: "Sun", mins: 15, height: "h-[12%]" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Cognitive Analytics
        </h2>
        <p className="text-slate-400 text-sm">
          Deep diagnostic metrics analyzing your memory retention and cognitive velocity.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Weekly study time</span>
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">6.7 Hrs</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
              <ChevronUp className="w-3 h-3" /> +14% vs last week
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cognitive Velocity</span>
            <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">88 pts</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
              <ChevronUp className="w-3 h-3" /> +3% learning rate
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Focus Factor</span>
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">92%</h3>
            <p className="text-[10px] text-slate-500">Steady focus metrics</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Milestones Met</span>
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">18 Goals</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
              <ChevronUp className="w-3 h-3" /> +4 this cycle
            </p>
          </div>
        </div>

      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly study graph */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between h-96">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-base">Study Activity</h3>
                <p className="text-xs text-slate-400">Minutes logged daily</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 border border-white/10 px-2.5 py-1 rounded-xl">
              May 18 - May 24
            </span>
          </div>

          {/* Graph columns container */}
          <div className="flex-1 flex items-end justify-between gap-4 px-2 md:px-6 py-6 border-b border-white/5">
            {weeklyAnalytics.map((item, idx) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                {/* Floating tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 border border-white/10 px-2 py-1 rounded-lg text-[10px] text-white font-bold mb-1 shadow-md">
                  {item.mins}m
                </div>

                {/* Column bar */}
                <div className="w-full relative rounded-t-xl overflow-hidden h-full flex items-end">
                  {/* Background track */}
                  <div className="absolute inset-0 bg-white/2 rounded-t-xl" />
                  {/* Colored filler */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: item.mins / 125 * 100 + "%" }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-cyan-600 via-blue-500 to-purple-600 rounded-t-xl z-10 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:brightness-110 transition-all"
                  />
                </div>

                {/* Label */}
                <span className="text-[11px] text-slate-400 font-semibold">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 px-2">
            <span>Average focus depth: <b>42 minutes</b></span>
            <span>Total focus blocks: <b>14 units</b></span>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="lg:col-span-1 rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between h-96">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base">Category Allocation</h3>
            <p className="text-xs text-slate-400">Distribution of study blocks across topic fields</p>

            <div className="space-y-4 pt-2">
              {[
                { name: "Deep Learning & AI", pct: 45, color: "bg-purple-500" },
                { name: "Frontend & Architecture", pct: 35, color: "bg-blue-500" },
                { name: "Systems & Databases", pct: 15, color: "bg-emerald-500" },
                { name: "General CS Foundations", pct: 5, color: "bg-slate-500" }
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-white">{cat.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-white/5 pt-4 text-center">
            AI optimizes allocation suggestions every 24 hours.
          </div>
        </div>

      </div>
    </div>
  );
}
