import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Settings, X, Plus, Play, Code2, Bot, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export function NanoAgentsOverlay({ bots, activeBotId, filter, onClose, onSelectBot, onFilterChange }: any) {
  return (
    <div className="fixed inset-y-0 right-0 z-[60] flex h-full bg-background/95 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 w-full lg:w-[85vw] xl:w-[75vw]">
      {/* LEFT PANE: Bots List (250px) */}
      <div className="w-[250px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-background/50">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-500" />
            <h3 className="font-bold text-sm">Deployed Agents</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex gap-1 bg-zinc-50 dark:bg-zinc-900/50">
          {['all', 'idle', 'active'].map(f => (
            <button key={f} onClick={() => onFilterChange(f)} className={`flex-1 text-[11px] font-medium py-1 rounded-md capitalize transition-colors ${filter === f ? 'bg-white dark:bg-zinc-700 shadow-sm text-foreground' : 'text-zinc-500 hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {bots.map((bot: any) => (
            <button key={bot.id} onClick={() => onSelectBot(bot.id)} className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-3 ${activeBotId === bot.id ? 'bg-violet-500/10 border border-violet-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                {bot.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] truncate text-foreground">{bot.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{bot.task}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE PANE: Active Chat (350px) */}
      <div className="w-[350px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-background relative">
        {activeBotId ? (
          <>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs">
                  {bots.find((b:any) => b.id === activeBotId)?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{bots.find((b:any) => b.id === activeBotId)?.name}</h3>
                  <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              <div className="text-center text-xs text-muted-foreground my-4">Chat started</div>
            </div>
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-background">
              <div className="relative flex items-center">
                <input type="text" placeholder="Message agent..." className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full pl-4 pr-10 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all text-foreground" />
                <button className="absolute right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-violet-500 hover:bg-violet-600 text-white transition-colors">
                  <Send className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Sparkles className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm">Select an agent from the left to start collaborating.</p>
          </div>
        )}
      </div>

      {/* RIGHT PANE: Code Preview (Fluid) */}
      <div className="flex-1 flex flex-col bg-[#0d1117] relative">
        <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-[#010409]">
          <div className="flex items-center gap-2 text-white/70">
            <Code2 className="w-4 h-4" />
            <span className="text-xs font-mono">Workspace Preview</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-white/20">
          <div className="text-center">
            <Code2 className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-sm font-mono">Code preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
