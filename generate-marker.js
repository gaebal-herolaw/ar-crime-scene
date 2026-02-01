const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1024, H = 1024;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ===== Pure white background =====
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, W, H);

// ===== Thick black outer border =====
ctx.fillStyle = '#000000';
// Top bar
ctx.fillRect(0, 0, W, 40);
// Bottom bar
ctx.fillRect(0, H - 40, W, 40);
// Left bar
ctx.fillRect(0, 0, 40, H);
// Right bar
ctx.fillRect(W - 40, 0, 40, H);

// ===== Giant "518" — the dominant feature =====
ctx.fillStyle = '#000000';
ctx.font = 'bold 320px "Arial Black", "Impact", sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('518', W / 2, H / 2 - 30);

// ===== Horizontal bars above and below the number =====
ctx.fillRect(80, 200, W - 160, 16);
ctx.fillRect(80, H - 240, W - 160, 16);

// ===== Asymmetric corner blocks (each unique for orientation) =====
// Top-left: large solid square
ctx.fillRect(60, 60, 80, 80);

// Top-right: circle
ctx.beginPath();
ctx.arc(W - 100, 100, 40, 0, Math.PI * 2);
ctx.fill();

// Bottom-left: triangle pointing up
ctx.beginPath();
ctx.moveTo(100, H - 60);
ctx.lineTo(60, H - 140);
ctx.lineTo(140, H - 140);
ctx.closePath();
ctx.fill();

// Bottom-right: diamond
ctx.beginPath();
ctx.moveTo(W - 100, H - 60);
ctx.lineTo(W - 60, H - 100);
ctx.lineTo(W - 100, H - 140);
ctx.lineTo(W - 140, H - 100);
ctx.closePath();
ctx.fill();

// ===== Scattered asymmetric dots for feature richness =====
const dots = [
  // Left column
  [70, 280, 8], [90, 350, 5], [65, 420, 10], [85, 490, 6],
  // Right column
  [W-70, 280, 10], [W-90, 370, 6], [W-65, 450, 8], [W-85, 510, 5],
  // Top row
  [250, 80, 7], [380, 90, 5], [520, 75, 9], [650, 85, 6], [780, 80, 8],
  // Bottom row
  [200, H-80, 6], [350, H-90, 8], [500, H-75, 5], [680, H-85, 9], [820, H-80, 7],
  // Around numbers - asymmetric scatter
  [180, 320, 7], [250, 420, 5], [150, 530, 8],
  [830, 350, 6], [870, 450, 9], [810, 540, 5],
];
dots.forEach(([x, y, r]) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
});

// ===== Small geometric shapes (adds unique features) =====
// Small crosses
const crosses = [[200, 170, 12], [750, 170, 10], [300, H-200, 11], [700, H-190, 9]];
crosses.forEach(([cx, cy, s]) => {
  ctx.fillRect(cx - s, cy - 2, s * 2, 4);
  ctx.fillRect(cx - 2, cy - s, 4, s * 2);
});

// Small L-shapes
ctx.fillRect(160, 240, 30, 5);
ctx.fillRect(160, 240, 5, 25);

ctx.fillRect(W - 190, 240, 30, 5);
ctx.fillRect(W - 165, 240, 5, 25);

// ===== Thin vertical lines (asymmetric spacing) =====
ctx.fillRect(200, 230, 3, 560);
ctx.fillRect(W - 203, 230, 3, 560);

// ===== Date text under number =====
ctx.font = 'bold 36px "Arial", sans-serif';
ctx.textAlign = 'center';
ctx.fillText('1980. 5. 18', W / 2, H / 2 + 170);

// ===== Small label at bottom =====
ctx.font = '18px monospace';
ctx.fillStyle = '#000000';
ctx.fillText('AR MARKER', W / 2, H - 55);

// ===== Save =====
const buffer = canvas.toBuffer('image/png');
const outPath = path.join(__dirname, 'public', 'ar-marker.png');
fs.writeFileSync(outPath, buffer);
console.log('Marker saved:', outPath, `(${buffer.length} bytes)`);
