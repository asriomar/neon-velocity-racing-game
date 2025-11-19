import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameLoop from './components/GameLoop';
import { GameMode, GameState, GameStats } from './types';
import { RefreshCw, Home } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<GameState>('MENU');
  const [mode, setMode] = useState<GameMode>('TRAFFIC');
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setView('PLAYING');
  };

  const handleGameOver = (stats: GameStats) => {
    setLastStats(stats);
    setView('GAME_OVER');
  };

  const exitToMenu = () => {
    setView('MENU');
  };

  const restartGame = () => {
    setView('PLAYING');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans select-none">
      {view === 'MENU' && <MainMenu onStart={startGame} />}
      
      {view === 'PLAYING' && (
        <GameLoop 
          mode={mode} 
          onGameOver={handleGameOver} 
          onExit={exitToMenu} 
        />
      )}

      {view === 'GAME_OVER' && lastStats && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-slate-800 border border-slate-600 p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden">
            
            {/* Animated background stripe */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />

            <h2 className="text-5xl font-black text-white mb-2 italic uppercase">
              {mode === 'TIME_TRIAL' && lastStats.timeLeft <= 0 ? 'TIME UP!' : 'CRASHED!'}
            </h2>
            <p className="text-slate-400 mb-8">Race Terminated</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Distance</div>
                <div className="text-2xl font-mono font-bold text-blue-400">{(lastStats.distance / 100).toFixed(2)}km</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Score</div>
                <div className="text-2xl font-mono font-bold text-yellow-400">{lastStats.score.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={restartGame}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <RefreshCw size={20} /> Play Again
              </button>
              <button 
                onClick={exitToMenu}
                className="w-full py-4 bg-transparent border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Home size={20} /> Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;