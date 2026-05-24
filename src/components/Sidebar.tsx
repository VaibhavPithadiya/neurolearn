"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Brain, 
  Map, 
  Layers, 
  Users, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "dashboard" | "mentor" | "roadmap" | "skills" | "communities" | "analytics";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

interface SidebarItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-400" },
    { id: "mentor", label: "AI Mentor", icon: Brain, color: "text-purple-400" },
    { id: "roadmap", label: "Learning Roadmap", icon: Map, color: "text-emerald-400" },
    { id: "skills", label: "Skill Ecosystem", color: "text-amber-400", icon: Layers },
    { id: "communities", label: "Communities", color: "text-pink-400", icon: Users },
    { id: "analytics", label: "Analytics", color: "text-cyan-400", icon: BarChart3 },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "glass-panel-heavy border-r border-white/10 h-screen sticky top-0 flex flex-col justify-between z-30",
        "shadow-[10px_0_30px_rgba(3,0,20,0.8)]"
      )}
    >
      <div className="flex flex-col flex-1 py-6 overflow-hidden">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between px-4 mb-8">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  <Sparkles className="w-5 h-5 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-md font-bold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    NEUROLEARN
                  </h1>
                  <p className="text-[10px] text-purple-400 font-semibold tracking-widest uppercase">
                    AI Platform
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-all text-slate-400 cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative flex items-center w-full py-3 px-3.5 rounded-xl transition-all group overflow-hidden cursor-pointer",
                  isActive 
                    ? "text-white" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {/* Active Hover Glow / Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-purple-500 to-blue-500 rounded-r" />
                  </motion.div>
                )}

                {/* Icon wrapper */}
                <div className="relative z-10 mr-3">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? item.color : "text-slate-400 group-hover:text-slate-200"
                  )} />
                </div>

                {/* Text Label */}
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[14px] font-medium tracking-wide z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Hover bubble */}
                <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5 p-1 rounded-md">
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section / Collapse Bottom */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-cyan-400">
                JD
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-950 rounded-full" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 overflow-hidden"
              >
                <h4 className="text-xs font-semibold text-white truncate">John Doe</h4>
                <p className="text-[10px] text-slate-400 truncate">Cognitive Rank #142</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
