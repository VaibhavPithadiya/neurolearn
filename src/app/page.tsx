"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Search, Sparkles, ShieldCheck } from "lucide-react";
import Sidebar, { TabType } from "@/components/Sidebar";
import DashboardPanel from "@/components/panels/DashboardPanel";
import MentorPanel from "@/components/panels/MentorPanel";
import RoadmapPanel from "@/components/panels/RoadmapPanel";
import SkillsPanel from "@/components/panels/SkillsPanel";
import CommunitiesPanel from "@/components/panels/CommunitiesPanel";
import AnalyticsPanel from "@/components/panels/AnalyticsPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigateToTab = (tab: "mentor" | "roadmap" | "skills" | "communities" | "analytics") => {
    setActiveTab(tab);
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPanel onNavigateToTab={handleNavigateToTab} />;
      case "mentor":
        return <MentorPanel />;
      case "roadmap":
        return <RoadmapPanel />;
      case "skills":
        return <SkillsPanel />;
      case "communities":
        return <CommunitiesPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      default:
        return <DashboardPanel onNavigateToTab={handleNavigateToTab} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "NeuroLearn Ecosystem";
      case "mentor": return "Synaptic AI Mentor";
      case "roadmap": return "Cognitive Learning Roadmap";
      case "skills": return "Skill Tree & Capabilities";
      case "communities": return "Cohort Communities";
      case "analytics": return "Performance Analytics";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans relative">
      
      {/* Ambient background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] orb-glow-purple -z-10 rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] orb-glow-blue -z-10 rounded-full" />

      {/* Desktop Sidebar (hidden on small/medium mobile screen sizes, shown on md and up) */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Sidebar content container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative w-[280px] h-full"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }} 
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-[-50px] p-2 rounded-xl bg-slate-900/80 border border-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 border-b border-white/5 bg-slate-950/20 backdrop-blur-md px-4 md:px-8 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              {getPageTitle()}
            </h2>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar (Hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 text-slate-400 focus-within:border-purple-500/50 transition-all w-60">
              <Search className="w-4 h-4 shrink-0" />
              <input
                type="text"
                placeholder="Search resources... (⌘K)"
                className="bg-transparent border-none text-xs focus:outline-none text-white w-full placeholder-slate-500"
              />
            </div>

            {/* Neural sync status tag */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Synaptic Link: Online</span>
            </div>

            {/* Notification bell */}
            <button className="relative p-2.5 rounded-xl bg-white/3 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </button>
          </div>
        </header>

        {/* Content body container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {renderActivePanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
