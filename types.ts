export type GameMode = 'TRAFFIC' | 'TIME_TRIAL';
export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CarObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number; // relative speed
  color: string;
  type: 'PLAYER' | 'ENEMY' | 'CIVILIAN';
  lane: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface GameStats {
  score: number;
  distance: number;
  speed: number;
  timeLeft: number;
  highScore: number;
}
