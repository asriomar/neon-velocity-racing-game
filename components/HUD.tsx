import React from 'react';
import { GameMode, GameStats } from '../types';
import { Gauge, Timer, Trophy, Play } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  mode: GameMode;
  isPaused: boolean;
}

const HUD: React.FC<HUDProps> = ({ stats, mode, isPaused }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-10">
      <div className="flex justify-between items-start max-w-3xl mx-auto">
        
        {/* Left: Score/Distance */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-blue-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] text-blue-50 transform transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-yellow-400" />
            <span className="text-xs uppercase tracking-wider text-slate-400">Score</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {Math.floor(stats.score).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Dist: {(stats.distance / 100).toFixed(1)} km
          </div>
        </div>

        {/* Center: Timer (Time Trial Only) */}
        {mode === 'TIME_TRIAL' && (
          <div className={`
            bg-slate-900/80 backdrop-blur-md border p-4 rounded-2xl shadow-lg flex flex-col items-center
            ${stats.timeLeft < 10 ? 'border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-slate-700'}
          `}>
            <Timer size={24} className={stats.timeLeft < 10 ? 'text-red-500' : 'text-blue-400'} />
            <div className={`text-3xl font-black font-mono mt-1 ${stats.timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
              {Math.ceil(stats.timeLeft)}s
            </div>
          </div>
        )}

        {/* Right: Speedometer */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-50">
          <div className="flex items-center gap-2 mb-1 justify-end">
            <span className="text-xs uppercase tracking-wider text-slate-400">Speed</span>
            <Gauge size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-right">
            {Math.floor(stats.speed * 10)} <span className="text-sm text-slate-500 font-normal">km/h</span>
          </div>
          {/* Speed Bar */}
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-100"
              style={{ width: `${Math.min((stats.speed / 25) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {isPaused && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black px-4 py-1 rounded font-bold tracking-widest uppercase animate-pulse">
           Paused
         </div>
      )}
    </div>
  );
};

export default HUD;