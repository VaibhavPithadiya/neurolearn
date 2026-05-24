"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Hash, Send, User, MessageSquare, Plus, Check } from "lucide-react";
import { mockDashboardData, Community } from "@/lib/mockData";

interface ForumPost {
  id: string;
  author: string;
  avatarInitials: string;
  role: string;
  content: string;
  likes: number;
  replies: number;
  time: string;
  channel: string;
}

const mockPosts: ForumPost[] = [
  {
    id: "p-1",
    author: "Alice Vance",
    avatarInitials: "AV",
    role: "AI Researcher",
    content: "Has anyone successfully run QLoRA fine-tuning on a local WebGPU stack? I am running into VRAM allocation limits on the edge runtime when processing long context lengths (>4096 tokens). Would appreciate any quantization pointers!",
    likes: 12,
    replies: 4,
    time: "25 min ago",
    channel: "#webgpu-hackers"
  },
  {
    id: "p-2",
    author: "Bob Miller",
    avatarInitials: "BM",
    role: "System Engineer",
    content: "Just finished Unit 2 of the Deep Learning path! Re-writing the self-attention equations in pure TypeScript matrix utilities was a mind-bending exercise. The softmax scaling factor makes complete sense once you inspect raw matrices.",
    likes: 8,
    replies: 2,
    time: "1 hour ago",
    channel: "#transformers"
  },
  {
    id: "p-3",
    author: "Elena Rostova",
    avatarInitials: "ER",
    role: "Product Designer",
    content: "If you're studying vector embeddings, check out HNSW graphs vs flat indexing. Finding out that HNSW is essentially a multi-layer skip list for multidimensional spaces made the indexing concept click instantly for me.",
    likes: 15,
    replies: 5,
    time: "3 hours ago",
    channel: "#general-ai"
  }
];

export default function CommunitiesPanel() {
  const [activeChannel, setActiveChannel] = useState("#general-ai");
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [newPostText, setNewPostText] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(["c-1", "c-3"]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      author: "John Doe",
      avatarInitials: "JD",
      role: "Synaptic Architect",
      content: newPostText,
      likes: 0,
      replies: 0,
      time: "Just now",
      channel: activeChannel
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const toggleJoin = (id: string) => {
    if (joinedCommunities.includes(id)) {
      setJoinedCommunities(joinedCommunities.filter(c => c !== id));
    } else {
      setJoinedCommunities([...joinedCommunities, id]);
    }
  };

  const channels = ["#general-ai", "#transformers", "#webgpu-hackers", "#resources", "#announcements"];

  return (
    <div className="max-w-7xl mx-auto pb-10 flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      
      {/* Left Sidebar: Channels & Hubs */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        {/* Joined Hubs */}
        <div className="rounded-2xl glass-panel p-4 border border-white/5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            Your Learning Hubs
          </h3>
          <div className="space-y-2">
            {mockDashboardData.communities.map((c) => {
              const isJoined = joinedCommunities.includes(c.id);
              return (
                <div key={c.id} className="flex items-center justify-between gap-2 p-2 hover:bg-white/3 rounded-xl transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{c.image}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <p className="text-[9px] text-slate-500 truncate">{c.membersCount} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleJoin(c.id)}
                    className={`p-1 rounded-lg border transition-all cursor-pointer ${
                      isJoined
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        : "bg-white/5 border-white/10 hover:border-white/20 text-slate-400"
                    }`}
                  >
                    {isJoined ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel list */}
        <div className="rounded-2xl glass-panel p-4 border border-white/5 space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Study Rooms
          </h3>
          <div className="space-y-1">
            {channels.map((chan) => {
              const isActive = activeChannel === chan;
              return (
                <button
                  key={chan}
                  onClick={() => setActiveChannel(chan)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-500/10 border border-purple-500/25 text-purple-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/2"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span>{chan.replace("#", "")}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle/Right: Discussion Feed & Post form */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        {/* Active room indicator */}
        <div className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base capitalize">{activeChannel.replace("#", "")} Discussion</h3>
          </div>
          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider">
            Cohort Stream
          </span>
        </div>

        {/* Input box */}
        <div className="rounded-2xl glass-panel p-4 border border-white/5 bg-slate-950/10">
          <form onSubmit={handlePost} className="flex gap-2">
            <input
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share a resource or question in ${activeChannel}...`}
              className="flex-1 glass-input px-4 py-2.5 text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newPostText.trim()}
              className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-xl shadow-md transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>

        {/* Discussion posts */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <AnimatePresence mode="popLayout">
            {posts
              .filter(p => p.channel === activeChannel)
              .map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3 hover:border-white/10 transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {post.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{post.author}</h4>
                        <p className="text-[10px] text-slate-500">{post.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{post.time}</span>
                  </div>

                  {/* Body Content */}
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/3 text-[11px] text-slate-500">
                    <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-pointer">
                      <span>👍</span> <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> <span>{post.replies} Replies</span>
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          {posts.filter(p => p.channel === activeChannel).length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              No discussions in {activeChannel} yet. Be the first to post!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
