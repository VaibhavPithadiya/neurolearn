"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MapPin, Calendar, Plus, Check, Search, Filter,
  Sparkles, Flame, GraduationCap, Map as MapIcon, Layers,
  Compass, ExternalLink, Info, Award, Bell, Shield, ArrowRight,
  ChevronRight, Laptop, CheckCircle2, UserPlus, Heart
} from "lucide-react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Community {
  id: string;
  name: string;
  location: string;
  membersCount: number;
  trending: boolean;
  aiRecommended: boolean;
  logo: string; // Emoji or shorthand symbol
  description: string;
  tags: string[];
  color: string;
  coordinates: { x: number; y: number }; // Percentage coords on SVG map
  heatmapIntensity: number; // 0.1 to 1.0
  activeSkill: string;
}

interface Event {
  id: string;
  title: string;
  communityId: string;
  communityName: string;
  date: string;
  time: string;
  type: "Meetup" | "Workshop" | "Hackathon";
  location: string;
  spotsLeft: number;
  rsvpCount: number;
  tag: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "gdg-ahmedabad",
    name: "GDG Ahmedabad",
    location: "Ahmedabad, Gujarat",
    membersCount: 4200,
    trending: true,
    aiRecommended: true,
    logo: "⚡",
    description: "Official Google Developer Group. Hosting meetups on Web, Cloud, AI, and Android tech stacks.",
    tags: ["Google Cloud", "AI/ML", "Android", "WebGPU"],
    color: "#4285F4",
    coordinates: { x: 35, y: 45 },
    heatmapIntensity: 0.9,
    activeSkill: "AI & Web",
  },
  {
    id: "cncf-gujarat",
    name: "CNCF Gujarat",
    location: "Gujarat Region",
    membersCount: 2800,
    trending: true,
    aiRecommended: true,
    logo: "☸️",
    description: "Cloud Native Computing Foundation chapter focusing on Kubernetes, Prometheus, Helm, and GitOps.",
    tags: ["Kubernetes", "DevOps", "CNCF", "Docker"],
    color: "#326CE5",
    coordinates: { x: 55, y: 30 },
    heatmapIntensity: 0.8,
    activeSkill: "Kubernetes & DevOps",
  },
  {
    id: "flutter-ahmedabad",
    name: "Flutter Ahmedabad",
    location: "Ahmedabad",
    membersCount: 1900,
    trending: false,
    aiRecommended: true,
    logo: "💙",
    description: "Cross-platform mobile and web application developers group. Regular hack days and app showcases.",
    tags: ["Flutter", "Dart", "Mobile", "UI/UX"],
    color: "#02569B",
    coordinates: { x: 28, y: 65 },
    heatmapIntensity: 0.6,
    activeSkill: "Flutter Dev",
  },
  {
    id: "aws-user-group",
    name: "AWS User Group Ahmedabad",
    location: "Ahmedabad, Gujarat",
    membersCount: 3100,
    trending: true,
    aiRecommended: false,
    logo: "☁️",
    description: "Amazon Web Services enthusiasts. Deep-dives on serverless, cloud architecture, and security.",
    tags: ["AWS", "Serverless", "IaC", "Cloud Architect"],
    color: "#FF9900",
    coordinates: { x: 70, y: 55 },
    heatmapIntensity: 0.85,
    activeSkill: "AWS Serverless",
  },
  {
    id: "reactjs-ahmedabad",
    name: "ReactJS Ahmedabad",
    location: "Ahmedabad",
    membersCount: 3500,
    trending: false,
    aiRecommended: false,
    logo: "⚛️",
    description: "Frontend developer circle focusing on React, Next.js, SolidJS, and performant web technologies.",
    tags: ["React", "Next.js", "TypeScript", "Performance"],
    color: "#61DAFB",
    coordinates: { x: 48, y: 72 },
    heatmapIntensity: 0.75,
    activeSkill: "React & Next.js",
  },
];

const MOCK_EVENTS: Event[] = [
  {
    id: "ev-1",
    title: "Google I/O Extended 2026",
    communityId: "gdg-ahmedabad",
    communityName: "GDG Ahmedabad",
    date: "June 15, 2026",
    time: "09:00 AM - 05:00 PM",
    type: "Meetup",
    location: "Tech Center Auditorium, SG Highway",
    spotsLeft: 42,
    rsvpCount: 258,
    tag: "AI & Cloud",
  },
  {
    id: "ev-2",
    title: "Kubernetes Production Patterns & ArgoCD",
    communityId: "cncf-gujarat",
    communityName: "CNCF Gujarat",
    date: "June 22, 2026",
    time: "02:00 PM - 06:00 PM",
    type: "Workshop",
    location: "Co-Working Hub, Prahladnagar",
    spotsLeft: 15,
    rsvpCount: 110,
    tag: "Kubernetes",
  },
  {
    id: "ev-3",
    title: "Gujarat Cloud Native Hackathon 2026",
    communityId: "cncf-gujarat",
    communityName: "CNCF Gujarat",
    date: "July 10-12, 2026",
    time: "48 Hours Continuous",
    type: "Hackathon",
    location: "Innovation Campus, Gandhinagar",
    spotsLeft: 20, // team spots
    rsvpCount: 340,
    tag: "Hackathon",
  },
  {
    id: "ev-4",
    title: "Building Microservices with AWS CDK",
    communityId: "aws-user-group",
    communityName: "AWS User Group Ahmedabad",
    date: "June 29, 2026",
    time: "04:00 PM - 07:00 PM",
    type: "Workshop",
    location: "AWS Dev Office, Ashram Road",
    spotsLeft: 8,
    rsvpCount: 95,
    tag: "Serverless",
  },
];

export default function CommunitiesPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("gdg-ahmedabad");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(["gdg-ahmedabad"]);
  const [rsvpedEvents, setRsvpedEvents] = useState<string[]>(["ev-1"]);
  const [mapLayer, setMapLayer] = useState<"standard" | "heatmap">("heatmap");
  const [mapZoom, setMapZoom] = useState(1);

  // Filters
  const [filterTrending, setFilterTrending] = useState(false);
  const [filterAIPicks, setFilterAIPicks] = useState(false);

  const toggleJoin = (id: string) => {
    if (joinedCommunities.includes(id)) {
      setJoinedCommunities(joinedCommunities.filter(c => c !== id));
    } else {
      setJoinedCommunities([...joinedCommunities, id]);
    }
  };

  const toggleRsvp = (id: string) => {
    if (rsvpedEvents.includes(id)) {
      setRsvpedEvents(rsvpedEvents.filter(e => e !== id));
    } else {
      setRsvpedEvents([...rsvpedEvents, id]);
    }
  };

  const filteredCommunities = MOCK_COMMUNITIES.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTrending = !filterTrending || c.trending;
    const matchAIPicks = !filterAIPicks || c.aiRecommended;
    return matchSearch && matchTrending && matchAIPicks;
  });

  const selectedCommunity = MOCK_COMMUNITIES.find(c => c.id === selectedCommunityId) || MOCK_COMMUNITIES[0];
  const communityEvents = MOCK_EVENTS.filter(e => e.communityId === selectedCommunity.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* ── Page Header & Quick Overview ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" />
            Communities & Cohorts
          </h2>
          <p className="text-slate-400 text-sm">
            Discover local tech clusters, active learning groups, and upcoming workshops around you.
          </p>
        </div>

        {/* Sync / recommendations highlight */}
        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 px-4 py-2 rounded-2xl">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">AI Recommendation Matcher</div>
            <div className="text-xs text-white font-semibold">Matched 3 communities to your skill tree</div>
          </div>
        </div>
      </div>

      {/* ── Main Panel Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Column: Communities List & Search (5/12) ── */}
        <div className="lg:col-span-5 space-y-4 flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
          
          {/* Filters Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search local meetups, tech tags..."
                className="w-full glass-input pl-10 pr-4 py-2.5 text-xs focus:outline-none rounded-xl"
              />
            </div>
            
            <button
              onClick={() => setFilterAIPicks(p => !p)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                filterAIPicks
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                  : "bg-white/3 border-white/5 text-slate-400 hover:text-slate-200"
              }`}
              title="AI Recommended"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => setFilterTrending(p => !p)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                filterTrending
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                  : "bg-white/3 border-white/5 text-slate-400 hover:text-slate-200"
              }`}
              title="Trending Only"
            >
              <Flame className="w-4 h-4" />
            </button>
          </div>

          {/* Communities Cards Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {filteredCommunities.map((c) => {
                const isSelected = selectedCommunityId === c.id;
                const isJoined = joinedCommunities.includes(c.id);
                return (
                  <motion.div
                    key={c.id}
                    layoutId={`community-card-${c.id}`}
                    onClick={() => setSelectedCommunityId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-purple-500/5 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                        : "glass-panel border-white/5 hover:border-white/15"
                    }`}
                  >
                    {/* Active focus indicator line */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-l-2xl" />
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{c.logo}</span>
                          <div>
                            <h3 className="font-bold text-white text-sm">{c.name}</h3>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-600" /> {c.location}
                            </p>
                          </div>
                        </div>

                        {/* Top corner recommendation/trending pills */}
                        <div className="flex items-center gap-1 shrink-0">
                          {c.aiRecommended && (
                            <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                              AI Match
                            </span>
                          )}
                          {c.trending && (
                            <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                              Hot
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[9px] font-semibold text-slate-500 bg-white/3 border border-white/6 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-medium">
                          <strong>{c.membersCount}</strong> members
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJoin(c.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            isJoined
                              ? "bg-purple-500/10 border-purple-500/35 text-purple-400"
                              : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                          }`}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredCommunities.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                No matching communities found. Try broadening your tags.
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Interactive Map & Event Hub (7/12) ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Interactive Map Visual */}
          <div className="rounded-3xl border border-white/7 glass-panel overflow-hidden relative flex flex-col min-h-[300px]">
            {/* Map Top Bar */}
            <div className="p-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Local Cohort Heatmap</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Map mode switcher */}
                <div className="bg-white/3 border border-white/5 p-0.5 rounded-lg flex">
                  <button
                    onClick={() => setMapLayer("standard")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      mapLayer === "standard" ? "bg-white/5 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Pins
                  </button>
                  <button
                    onClick={() => setMapLayer("heatmap")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      mapLayer === "heatmap" ? "bg-purple-500/20 text-purple-300 border border-purple-500/10" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Heatmap
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Simulated Interactive Map */}
            <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,rgba(15,10,35,0.95)_0%,rgba(5,5,15,1)_100%)] h-80 overflow-hidden flex items-center justify-center">
              
              {/* Map grid pattern lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Geographic contour/network roads mock lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0,50 Q 25,20 50,50 T 100,50" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" />
                <path d="M 20,0 Q 50,50 80,100" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5" />
                <path d="M 0,20 Q 50,30 100,80" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              </svg>

              {/* Skill Density Heatmap Layer */}
              {mapLayer === "heatmap" && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {MOCK_COMMUNITIES.map(c => (
                      <radialGradient key={`grad-${c.id}`} id={`grad-${c.id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={c.color} stopOpacity={0.6 * c.heatmapIntensity} />
                        <stop offset="40%" stopColor={c.color} stopOpacity={0.3 * c.heatmapIntensity} />
                        <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                      </radialGradient>
                    ))}
                  </defs>
                  {MOCK_COMMUNITIES.map(c => (
                    <circle
                      key={`heatmap-blob-${c.id}`}
                      cx={c.coordinates.x}
                      cy={c.coordinates.y}
                      r={15 + c.heatmapIntensity * 10}
                      fill={`url(#grad-${c.id})`}
                      className="animate-pulse"
                      style={{ animationDuration: `${3 + c.heatmapIntensity * 2}s` }}
                    />
                  ))}
                </svg>
              )}

              {/* Interactive City Pins */}
              {MOCK_COMMUNITIES.map((c) => {
                const isSelected = selectedCommunityId === c.id;
                return (
                  <button
                    key={`pin-${c.id}`}
                    onClick={() => setSelectedCommunityId(c.id)}
                    className="absolute group transition-transform duration-300"
                    style={{
                      left: `${c.coordinates.x}%`,
                      top: `${c.coordinates.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    {/* Ring pulsing animation */}
                    {isSelected && (
                      <div className="absolute inset-[-12px] rounded-full border border-purple-500/50 animate-ping opacity-60" />
                    )}

                    {/* Outer glow ring */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isSelected
                          ? "bg-purple-900/90 text-white scale-125 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                          : "bg-slate-950/80 text-slate-400 hover:text-white hover:scale-115 border-white/10"
                      }`}
                    >
                      <span className="text-xs leading-none">{c.logo}</span>
                    </div>

                    {/* Mini popover on hover */}
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-white/10 px-2 py-1 rounded-lg text-[9px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl">
                      {c.name}
                      <span className="block text-[8px] text-slate-500 font-normal">Active skill: {c.activeSkill}</span>
                    </div>
                  </button>
                );
              })}

              {/* Legend scale in heatmap mode */}
              {mapLayer === "heatmap" && (
                <div className="absolute bottom-3 left-4 bg-slate-950/85 border border-white/5 px-2.5 py-1.5 rounded-xl flex items-center gap-2 pointer-events-none text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Skill Density:</span>
                  <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500" />
                  <span>High</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Hub Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Events hosted by {selectedCommunity.name}
              </h3>
              <span className="text-[10px] text-slate-500">
                {communityEvents.length} events scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityEvents.map((ev) => {
                const isRsvped = rsvpedEvents.includes(ev.id);
                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between hover:border-white/10 transition-all gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          ev.type === "Hackathon"
                            ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                            : ev.type === "Workshop"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        }`}>
                          {ev.type}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">{ev.tag}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{ev.title}</h4>
                      
                      <div className="space-y-1 text-[10px] text-slate-400">
                        <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-600" /> {ev.date} at {ev.time}</p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-600" /> {ev.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                      <span className="text-[9px] text-slate-500">
                        <strong>{ev.rsvpCount}</strong> attending · <strong>{ev.spotsLeft}</strong> left
                      </span>

                      <button
                        onClick={() => toggleRsvp(ev.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer ${
                          isRsvped
                            ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                            : "bg-purple-600 hover:bg-purple-500 border border-transparent text-white"
                        }`}
                      >
                        {isRsvped ? "RSVP'd ✓" : "RSVP Now"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {communityEvents.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-500 text-xs">
                  No upcoming events for this community. Check back soon!
                </div>
              )}
            </div>
          </div>

          {/* Workshop & Hackathon Recommendations Grid */}
          <div className="rounded-3xl border border-white/7 glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Ecosystem Opportunities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1.5">
                <span className="text-[8px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">Featured Hackathon</span>
                <h4 className="text-xs font-bold text-white">Gujarat Cloud Native Hackathon</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">48h challenge to solve real-world orchestrations. CNCF certificates for participants.</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-slate-600">Starts July 10, 2026</span>
                  <button onClick={() => setSelectedCommunityId("cncf-gujarat")} className="text-[9px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer">
                    View CNCF <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1.5">
                <span className="text-[8px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">Workshop Match</span>
                <h4 className="text-xs font-bold text-white">AWS CDK Masterclass</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Infrastructure as Code using TypeScript. Best suited for backend system architects.</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-slate-600">Starts June 29, 2026</span>
                  <button onClick={() => setSelectedCommunityId("aws-user-group")} className="text-[9px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer">
                    View AWS <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
