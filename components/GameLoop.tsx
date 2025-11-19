
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameMode, GameState, CarObject, GameStats, Particle } from '../types';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, FPS, 
  PLAYER_WIDTH, PLAYER_HEIGHT, CAR_WIDTH, CAR_HEIGHT,
  MAX_SPEED, ACCELERATION, BRAKING, TURN_SPEED,
  LANE_WIDTH, COLORS, TIME_TRIAL_DURATION, LANE_COUNT
} from '../constants';
import { drawCar, checkCollision, createExplosion } from '../utils/gameUtils';
import HUD from './HUD';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Play } from 'lucide-react';

interface GameLoopProps {
  mode: GameMode;
  onGameOver: (stats: GameStats) => void;
  onExit: () => void;
}

const GRASS_WIDTH = 10;

const GameLoop: React.FC<GameLoopProps> = ({ mode, onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  
  // Game State Refs (Mutable for performance)
  // Start player in Lane 2 (Index 1)
  const playerRef = useRef<CarObject>({
    id: 0,
    x: LANE_WIDTH * 1 + (LANE_WIDTH - PLAYER_WIDTH) / 2,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: 0,
    color: COLORS.PLAYER,
    type: 'PLAYER',
    lane: 1
  });
  
  const opponentsRef = useRef<CarObject[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const roadOffsetRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  // Stats State for HUD (updated less frequently or via refs logic)
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    speed: 0,
    timeLeft: TIME_TRIAL_DURATION,
    highScore: 0
  });
  
  // Mutable stats for loop
  const statsRef = useRef<GameStats>({
    score: 0,
    distance: 0,
    speed: 0,
    timeLeft: TIME_TRIAL_DURATION,
    highScore: 0
  });

  // Mobile Controls
  const handleTouchStart = (action: string) => {
    if (gameState !== 'PLAYING') return;
    keysPressed.current[action] = true;
  };
  const handleTouchEnd = (action: string) => {
    keysPressed.current[action] = false;
  };

  // Input Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      if (e.code === 'Escape') {
        setGameState(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Spawning Logic
  const spawnTimerRef = useRef(0);

  const spawnOpponent = () => {
    // 1. Identify lanes that are safe to spawn in (not occupied by a car near the top)
    const safeLanes: number[] = [];
    
    for (let i = 0; i < LANE_COUNT; i++) {
      // Check if this lane has a car near the spawn zone (top of screen)
      // With larger cars, we need a larger buffer check
      const isLaneBlocked = opponentsRef.current.some(o => 
        o.lane === i && o.y < CAR_HEIGHT * 1.5 
      );
      
      if (!isLaneBlocked) {
        safeLanes.push(i);
      }
    }

    if (safeLanes.length > 0) {
      // Pick a random safe lane
      const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
      
      // Strictly center the car in the lane
      const laneX = lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
      
      const type = Math.random() > 0.5 ? 'ENEMY' : 'CIVILIAN';
      // Enemy goes fast, Civilian goes slow
      const speed = type === 'ENEMY' ? Math.random() * 5 + 10 : Math.random() * 5 + 5;
      const color = type === 'ENEMY' 
        ? [COLORS.ENEMY_1, COLORS.ENEMY_2, COLORS.ENEMY_3][Math.floor(Math.random() * 3)] 
        : '#94a3b8'; // slate-400

      // Add a random vertical offset
      const startY = -CAR_HEIGHT - Math.random() * 200;

      opponentsRef.current.push({
        id: Date.now() + Math.random(),
        x: laneX,
        y: startY,
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
        speed: speed, // Absolute speed of opponent
        color: color,
        type: 'ENEMY',
        lane: lane
      });
    }
  };

  // Update Loop
  const update = useCallback((deltaTime: number) => {
    if (gameState !== 'PLAYING') return;

    const player = playerRef.current;
    const dt = deltaTime / 16.67; // Normalize to ~60fps

    // 1. Player Movement Logic
    if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW'] || keysPressed.current['TouchAccel']) {
      player.speed += ACCELERATION * dt;
    } else if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS'] || keysPressed.current['TouchBrake']) {
      player.speed -= BRAKING * dt;
    } else {
      // Natural drag
      player.speed *= 0.98;
    }

    // Clamp Speed
    player.speed = Math.max(0, Math.min(player.speed, MAX_SPEED));

    // Steering
    if (player.speed > 0.5) {
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA'] || keysPressed.current['TouchLeft']) {
          player.x -= TURN_SPEED * dt;
        }
        if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD'] || keysPressed.current['TouchRight']) {
          player.x += TURN_SPEED * dt;
        }
    }

    // Wall Collision
    if (player.x < GRASS_WIDTH) {
        player.x = GRASS_WIDTH;
        player.speed *= 0.9; // Friction on wall
    }
    if (player.x > CANVAS_WIDTH - player.width - GRASS_WIDTH) {
        player.x = CANVAS_WIDTH - player.width - GRASS_WIDTH;
        player.speed *= 0.9;
    }

    // 2. Road Movement
    // The road moves based on player speed
    roadOffsetRef.current += player.speed * 2 * dt;
    if (roadOffsetRef.current >= 100) roadOffsetRef.current = 0;

    // 3. Opponents Movement & Spawning
    spawnTimerRef.current += dt;
    // Spawn difficulty ramps up with speed
    const spawnThreshold = Math.max(20, 100 - player.speed * 2); 
    if (spawnTimerRef.current > spawnThreshold) {
      spawnOpponent();
      spawnTimerRef.current = 0;
    }

    opponentsRef.current.forEach(opp => {
      // Relative movement: Opponent moves down if player is faster than them
      const relativeSpeed = player.speed - (opp.speed * 0.6); 
      opp.y += relativeSpeed * 2 * dt;
    });

    // Remove off-screen opponents
    opponentsRef.current = opponentsRef.current.filter(opp => opp.y < CANVAS_HEIGHT + 200);

    // 4. Collision Detection
    for (let opp of opponentsRef.current) {
      if (checkCollision(player, opp)) {
        // Crash
        setGameState('GAME_OVER');
        particlesRef.current.push(...createExplosion(player.x + player.width/2, player.y + player.height/2, player.color));
        onGameOver(statsRef.current);
        return;
      }
    }

    // 5. Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt + (player.speed * 2 * dt); // Move particles with road
      p.life -= 0.02 * dt;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // 6. Stats Update
    statsRef.current.distance += player.speed * 0.1 * dt;
    statsRef.current.speed = player.speed;
    statsRef.current.score = Math.floor(statsRef.current.distance);

    if (mode === 'TIME_TRIAL') {
      statsRef.current.timeLeft -= (deltaTime / 1000);
      if (statsRef.current.timeLeft <= 0) {
        setGameState('GAME_OVER');
        onGameOver(statsRef.current);
      }
    }

    // Sync stats to state for HUD every 10 frames to save renders
    if (Math.floor(statsRef.current.distance) % 5 === 0) {
       setStats({...statsRef.current});
    }

  }, [gameState, mode, onGameOver]);

  // Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f172a'; // bg-slate-900
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Road (Grass sides)
    ctx.fillStyle = COLORS.GRASS;
    ctx.fillRect(0, 0, GRASS_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - GRASS_WIDTH, 0, GRASS_WIDTH, CANVAS_HEIGHT);

    // Lane Markers
    ctx.strokeStyle = COLORS.MARKER;
    ctx.lineWidth = 4;
    ctx.setLineDash([40, 60]);
    ctx.lineDashOffset = -roadOffsetRef.current;
    
    for (let i = 1; i < LANE_COUNT; i++) {
      ctx.beginPath();
      const x = i * LANE_WIDTH;
      ctx.moveTo(x, -100);
      ctx.lineTo(x, CANVAS_HEIGHT + 100);
      ctx.stroke();
    }

    // Draw Opponents
    opponentsRef.current.forEach(opp => drawCar(ctx, opp));

    // Draw Player
    drawCar(ctx, playerRef.current);

    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Speed Lines (Effect)
    if (playerRef.current.speed > 15) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        for(let i=0; i<10; i++) {
            const x = Math.random() * CANVAS_WIDTH;
            const y = Math.random() * CANVAS_HEIGHT;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + (playerRef.current.speed * 2));
            ctx.stroke();
        }
    }

  }, []);

  // Animation Frame
  const loop = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    update(deltaTime);
    render();

    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, render]); 

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <HUD stats={stats} mode={mode} isPaused={gameState === 'PAUSED'} />
        
        {/* Game Canvas */}
        <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="max-h-[100vh] w-full max-w-[600px] object-contain shadow-2xl"
        />

        {/* Mobile Controls Overlay */}
        <div className="absolute bottom-8 w-full max-w-[600px] px-6 flex justify-between pointer-events-auto sm:hidden">
            <div className="flex gap-4">
                <button 
                    className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-600 backdrop-blur active:bg-blue-500/50 flex items-center justify-center text-white transition-colors"
                    onTouchStart={(e) => { e.preventDefault(); handleTouchStart('TouchLeft'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('TouchLeft'); }}
                >
                    <ArrowLeft />
                </button>
                <button 
                    className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-600 backdrop-blur active:bg-blue-500/50 flex items-center justify-center text-white transition-colors"
                    onTouchStart={(e) => { e.preventDefault(); handleTouchStart('TouchRight'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('TouchRight'); }}
                >
                    <ArrowRight />
                </button>
            </div>
            <div className="flex flex-col gap-4">
                 <button 
                    className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-600 backdrop-blur active:bg-emerald-500/50 flex items-center justify-center text-white transition-colors"
                    onTouchStart={(e) => { e.preventDefault(); handleTouchStart('TouchAccel'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('TouchAccel'); }}
                >
                    <ArrowUp />
                </button>
                 <button 
                    className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-600 backdrop-blur active:bg-red-500/50 flex items-center justify-center text-white transition-colors"
                    onTouchStart={(e) => { e.preventDefault(); handleTouchStart('TouchBrake'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('TouchBrake'); }}
                >
                    <ArrowDown />
                </button>
            </div>
        </div>

        {/* Pause Overlay */}
        {gameState === 'PAUSED' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6 font-mono">PAUSED</h2>
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => setGameState('PLAYING')}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-bold transition-all"
                        >
                            <Play size={20} fill="currentColor" /> Resume
                        </button>
                        <button 
                             onClick={onExit}
                             className="text-slate-400 hover:text-white transition-colors py-2"
                        >
                            Quit to Menu
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default GameLoop;
