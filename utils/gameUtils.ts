
import { CarObject, Particle } from '../types';
import { CANVAS_WIDTH, LANE_WIDTH } from '../constants';

export const checkCollision = (rect1: CarObject, rect2: CarObject): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

export const getRandomLaneX = (width: number): number => {
  const lane = Math.floor(Math.random() * 4);
  // Center in lane
  return lane * LANE_WIDTH + (LANE_WIDTH - width) / 2;
};

export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

export const drawCar = (ctx: CanvasRenderingContext2D, car: CarObject) => {
  ctx.save();
  
  const w = car.width;
  const h = car.height;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  drawRoundedRect(ctx, car.x + 8, car.y + 8, w, h, 15);

  // Body
  ctx.fillStyle = car.color;
  drawRoundedRect(ctx, car.x, car.y, w, h, 12);

  // Hood Details (Racing Stripe or Vent)
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  drawRoundedRect(ctx, car.x + w * 0.3, car.y + 10, w * 0.4, h * 0.25, 5);

  // Roof/Windshield Area
  ctx.fillStyle = '#1e293b'; // Dark glass
  // Windshield + Roof + Rear Window block
  drawRoundedRect(ctx, car.x + 8, car.y + h * 0.25, w - 16, h * 0.55, 8);
  
  // Roof Highlight (to distinguish glass from roof)
  ctx.fillStyle = car.color; 
  // A slightly smaller rect inside for the painted roof part
  drawRoundedRect(ctx, car.x + 12, car.y + h * 0.35, w - 24, h * 0.3, 5);

  // Headlights (Top)
  ctx.fillStyle = '#fef08a'; // yellow-200
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(car.x + 15, car.y + 10, 6, 0, Math.PI * 2);
  ctx.arc(car.x + w - 15, car.y + 10, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Taillights (Bottom)
  ctx.fillStyle = '#dc2626'; // red-600
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 5;
  ctx.fillRect(car.x + 10, car.y + h - 10, 25, 6);
  ctx.fillRect(car.x + w - 35, car.y + h - 10, 25, 6);
  ctx.shadowBlur = 0;

  ctx.restore();
};

export const createExplosion = (x: number, y: number, color: string): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    particles.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      color: color,
      size: Math.random() * 6 + 3,
    });
  }
  return particles;
};
