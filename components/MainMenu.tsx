import React from 'react';
import { GameMode } from '../types';
import { Trophy, Clock, Zap, CarFront, Info } from 'lucide-react';

interface MainMenuProps {
  onStart: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-6 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full" />
        
        {/* Grid Floor Effect */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-blue-900/20 to-transparent" 
             style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
             <div className="w-full h-full absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,.3)_25%,rgba(59,130,246,.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,.3)_75%,rgba(59,130,246,.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(59,130,246,.3)_25%,rgba(59,130,246,.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,.3)_75%,rgba(59,130,246,.3)_76%,transparent_77%,transparent)] bg-[length:50px_50px] opacity-20 transform rotateX(60deg) origin-bottom" />
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 italic tracking-tighter transform -skew-x-12 drop-shadow-lg font-[Orbitron]">
            NEON<br/>
            <span className="text-blue-500">VELOCITY</span>
          </h1>
        </div>

        <div className="grid gap-4 w-full">
          <button 
            onClick={() => onStart('TRAFFIC')}
            className="group relative bg-slate-900/50 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] text-left overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center justify-between relative z-10">
               <div>
                 <div className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                    <CarFront className="text-blue-400" />
                    <span>TRAFFIC RUN</span>
                 </div>
                 <p className="text-slate-400 text-sm">Dodge endless traffic. Survive as long as you can.</p>
               </div>
               <Zap className="text-slate-600 group-hover:text-blue-400 transition-colors" size={32} />
             </div>
          </button>

          <button 
            onClick={() => onStart('TIME_TRIAL')}
            className="group relative bg-slate-900/50 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-500 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] text-left overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center justify-between relative z-10">
               <div>
                 <div className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                    <Clock className="text-purple-400" />
                    <span>TIME ATTACK</span>
                 </div>
                 <p className="text-slate-400 text-sm">Race against the clock. Reach the furthest distance.</p>
               </div>
               <Trophy className="text-slate-600 group-hover:text-purple-400 transition-colors" size={32} />
             </div>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 text-sm bg-slate-900/50 py-2 px-4 rounded-full border border-slate-800 backdrop-blur-sm">
          <Info size={14} />
          <span>Use Arrow Keys or WASD to drive</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;