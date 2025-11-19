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
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  drawRoundedRect(ctx, car.x + 5, car.y + 5, car.width, car.height, 10);

  // Body
  ctx.fillStyle = car.color;
  drawRoundedRect(ctx, car.x, car.y, car.width, car.height, 8);

  // Roof/Windshield
  ctx.fillStyle = '#1e293b';
  drawRoundedRect(ctx, car.x + 5, car.y + 20, car.width - 10, car.height - 40, 5);

  // Headlights (if facing forward, but here all cars face 'up' relative to movement except obstacles which are just cars)
  // Let's assume player faces up (y decreases visually?), actually in vertical scroller:
  // Objects move DOWN (y increases). Player stays fixed Y. 
  // So everyone faces UP (towards top of screen).
  
  // Headlights (Top)
  ctx.fillStyle = '#fef08a'; // yellow-200
  ctx.beginPath();
  ctx.arc(car.x + 10, car.y + 5, 3, 0, Math.PI * 2);
  ctx.arc(car.x + car.width - 10, car.y + 5, 3, 0, Math.PI * 2);
  ctx.fill();

  // Taillights (Bottom)
  ctx.fillStyle = '#dc2626'; // red-600
  ctx.fillRect(car.x + 8, car.y + car.height - 5, 10, 3);
  ctx.fillRect(car.x + car.width - 18, car.y + car.height - 5, 10, 3);

  ctx.restore();
};

export const createExplosion = (x: number, y: number, color: string): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    particles.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      color: color,
      size: Math.random() * 4 + 2,
    });
  }
  return particles;
};
