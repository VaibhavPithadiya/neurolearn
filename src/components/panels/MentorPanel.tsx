"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, User, ArrowLeftRight, Check, RefreshCw } from "lucide-react";
import { initialMentorChat, MentorMessage } from "@/lib/mockData";

export default function MentorPanel() {
  const [messages, setMessages] = useState<MentorMessage[]>(initialMentorChat);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "";
      let suggestions: string[] = [];

      if (text.toLowerCase().includes("self-attention") || text.toLowerCase().includes("transformer")) {
        aiText = "The Self-Attention mechanism computes representation of input sequences by relating different positions of a single sequence. Mathematically: Attention(Q, K, V) = softmax(QKᵀ / √d_k)V. The term QKᵀ computes raw compatibility scores between queries and keys. Dividing by √d_k (dimension of keys) prevents the softmax function from pushing gradients into extremely flat regions. The softmax outputs attention weights, which scale the values V. This allows the model to dynamic-focus on different parts of the input context!";
        suggestions = ["How does Multi-Head Attention differ?", "Show code for attention mechanism"];
      } else if (text.toLowerCase().includes("quiz") || text.toLowerCase().includes("neural")) {
        aiText = "Here is a quick Neuro-Quiz: Why do we use ReLU instead of Sigmoid as an activation function in deep neural networks? \n\n1) Sigmoid is computationally slower. \n2) ReLU prevents the vanishing gradient problem in deep networks. \n3) ReLU matches biological brain activation better.\n\nReply with the correct answer!";
        suggestions = ["Answer is 2", "Explain the vanishing gradient problem"];
      } else if (text.toLowerCase().includes("vector") || text.toLowerCase().includes("search")) {
        aiText = "To optimize vector search, you should: 1) Use HNSW (Hierarchical Navigable Small World) index graphs for fast approximate nearest neighbors (ANN). 2) Quantize vectors (Scalar or Product Quantization) to fit in memory. 3) Choose Cosine Similarity if magnitude is irrelevant, or Dot Product if vectors are normalized. What volume of vector embeddings are you querying?";
        suggestions = ["What is HNSW?", "Explain Product Quantization"];
      } else {
        aiText = `Fascinating query! In modern machine learning, optimization is crucial. To best assist your study, we should map this to your roadmap. Would you like to write some TypeScript code to model this, or do you want to explore the mathematical proofs behind it?`;
        suggestions = ["Show code representation", "Explain the core equations"];
      }

      const aiMsg: MentorMessage = {
        id: `ai-${Date.now()}`,
        sender: "mentor",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto rounded-2xl glass-panel border border-white/5 overflow-hidden">
      {/* Mentor Header */}
      <div className="p-4 border-b border-white/5 bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-purple-500/10 border border-purple-500/25 text-purple-400 rounded-xl">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-1.5">
              NeuroMentor AI <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </h3>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Active Session • Cohort Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMessages(initialMentorChat)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-all text-slate-400 cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === "mentor";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3.5 ${isAI ? "" : "flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-semibold ${
                  isAI 
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                }`}
              >
                {isAI ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className={`space-y-1.5 max-w-[80%] ${isAI ? "" : "items-end"}`}>
                <div 
                  className={`p-3.5 rounded-2xl border text-sm leading-relaxed ${
                    isAI 
                      ? "bg-white/3 border-white/5 text-slate-100 rounded-tl-sm" 
                      : "bg-purple-600/20 border-purple-500/30 text-white rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <div className={`text-[10px] text-slate-500 flex items-center gap-1 ${isAI ? "" : "justify-end"}`}>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Suggestions block */}
                {isAI && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
                        className="text-xs font-medium text-slate-300 hover:text-white bg-white/3 border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/10 py-1.5 px-3 rounded-xl transition-all cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/3 border border-white/5 rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about Deep Learning, WebGPU, or algorithms..."
            className="flex-1 glass-input px-4 py-3 text-sm focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
