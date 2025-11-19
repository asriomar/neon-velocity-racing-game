export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;
export const LANE_COUNT = 4;
export const LANE_WIDTH = CANVAS_WIDTH / LANE_COUNT;

export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 100;
export const CAR_WIDTH = 60;
export const CAR_HEIGHT = 100;

export const FPS = 60;
export const TIME_STEP = 1000 / FPS;

export const INITIAL_SPEED = 8;
export const MAX_SPEED = 25;
export const ACCELERATION = 0.2;
export const BRAKING = 0.4;
export const TURN_SPEED = 8;

export const SPAWN_RATE_TRAFFIC = 60; // Frames between spawns
export const TIME_TRIAL_DURATION = 60; // Seconds

export const COLORS = {
  PLAYER: '#3b82f6', // blue-500
  ENEMY_1: '#ef4444', // red-500
  ENEMY_2: '#f97316', // orange-500
  ENEMY_3: '#10b981', // emerald-500
  ROAD: '#1e293b', // slate-800
  MARKER: '#cbd5e1', // slate-300
  GRASS: '#064e3b', // emerald-900
};
