const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1024, H = 1024;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ===== WHITE BACKGROUND for high contrast =====
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, W, H);

// Thick black border
ctx.strokeStyle = '#000000';
ctx.lineWidth = 12;
ctx.strokeRect(15, 15, W - 30, H - 30);

// Inner red border
ctx.strokeStyle = '#cc0000';
ctx.lineWidth = 4;
ctx.strokeRect(40, 40, W - 80, H - 80);

// ===== TITLE AREA =====
// Dark header bar
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(40, 40, W - 80, 120);

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 52px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('HISTORICAL SITE', W / 2, 115);

ctx.font = '20px sans-serif';
ctx.fillStyle = '#cc0000';
ctx.fillText('CRIME SCENE RECONSTRUCTION', W / 2, 150);

// ===== LARGE ASYMMETRIC CROSSHAIR =====
const cx = W * 0.38, cy = H * 0.45;

// Crosshair lines - thick black
ctx.strokeStyle = '#000000';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(cx, 180);
ctx.lineTo(cx, H - 120);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(60, cy);
ctx.lineTo(W - 60, cy);
ctx.stroke();

// Concentric circles - alternating black and red
for (let r = 30; r <= 130; r += 20) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = r % 40 === 10 ? '#cc0000' : '#000000';
  ctx.lineWidth = r % 40 === 10 ? 4 : 2;
  ctx.stroke();
}

// Filled center dot
ctx.beginPath();
ctx.arc(cx, cy, 8, 0, Math.PI * 2);
ctx.fillStyle = '#cc0000';
ctx.fill();

// Small crosshair at center - white on red
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); ctx.stroke();
ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12); ctx.stroke();

// ===== BULLET HOLE (right side) =====
const bx = W * 0.72, by = H * 0.55;

// Impact crater - dark circle with cracks
ctx.beginPath();
ctx.arc(bx, by, 25, 0, Math.PI * 2);
ctx.fillStyle = '#000000';
ctx.fill();

// Outer ring
ctx.beginPath();
ctx.arc(bx, by, 35, 0, Math.PI * 2);
ctx.strokeStyle = '#333333';
ctx.lineWidth = 3;
ctx.stroke();

// Radial crack lines - thick and visible
const angles = [0.2, 0.7, 1.3, 1.9, 2.4, 3.0, 3.6, 4.2, 4.7, 5.4];
angles.forEach(a => {
  const len = 40 + Math.sin(a * 3) * 25;
  ctx.beginPath();
  ctx.moveTo(bx + Math.cos(a) * 25, by + Math.sin(a) * 25);
  ctx.lineTo(bx + Math.cos(a) * len, by + Math.sin(a) * len);
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 2.5;
  ctx.stroke();
});

// Spiderweb cracks (arcs connecting radials)
ctx.strokeStyle = '#555555';
ctx.lineWidth = 1.5;
for (let r = 45; r <= 65; r += 20) {
  ctx.beginPath();
  ctx.arc(bx, by, r, 0.2, 2.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bx, by, r, 3.0, 5.4);
  ctx.stroke();
}

// ===== EVIDENCE MARKERS (high contrast shapes) =====

// Triangle evidence marker (bottom left)
ctx.fillStyle = '#cc0000';
ctx.beginPath();
ctx.moveTo(120, H - 130);
ctx.lineTo(180, H - 130);
ctx.lineTo(150, H - 190);
ctx.closePath();
ctx.fill();
// Number on it
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('1', 150, H - 143);

// Square evidence marker (bottom right)
ctx.fillStyle = '#cc0000';
ctx.fillRect(W - 160, H - 170, 55, 55);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 28px sans-serif';
ctx.fillText('2', W - 133, H - 133);

// ===== ASYMMETRIC PATTERNS (feature-rich) =====

// Top-right: starburst pattern
const sx = W * 0.78, sy = H * 0.25;
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  const len = i % 2 === 0 ? 50 : 30;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + Math.cos(a) * len, sy + Math.sin(a) * len);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();
}
ctx.beginPath();
ctx.arc(sx, sy, 12, 0, Math.PI * 2);
ctx.fillStyle = '#000000';
ctx.fill();

// ===== SCATTERED HIGH-CONTRAST DOTS (asymmetric) =====
const dotPositions = [
  // Cluster A (upper right)
  [680, 320, 7], [720, 290, 5], [750, 340, 8], [700, 370, 4], [760, 300, 6],
  // Cluster B (lower center)
  [450, 680, 6], [490, 710, 8], [430, 740, 5], [510, 690, 7], [470, 750, 4],
  // Cluster C (scattered)
  [350, 350, 5], [550, 300, 4], [600, 600, 6], [300, 580, 5],
  [850, 500, 7], [870, 550, 5], [830, 530, 4],
  [200, 450, 5], [220, 500, 6],
];
dotPositions.forEach(([x, y, r]) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
});

// ===== DASHED LINES (diagonal, for more features) =====
ctx.setLineDash([10, 8]);
ctx.strokeStyle = '#888888';
ctx.lineWidth = 2;
// Diagonal 1
ctx.beginPath();
ctx.moveTo(500, 200);
ctx.lineTo(900, 400);
ctx.stroke();
// Diagonal 2
ctx.beginPath();
ctx.moveTo(100, 700);
ctx.lineTo(400, 500);
ctx.stroke();
ctx.setLineDash([]);

// ===== CORNER MARKERS (each unique) =====
// Top-left: L-bracket (black)
ctx.fillStyle = '#000000';
ctx.fillRect(55, 55, 60, 8);
ctx.fillRect(55, 55, 8, 60);

// Top-right: three dots descending
[{ x: W - 75, y: 75, r: 12 }, { x: W - 100, y: 100, r: 8 }, { x: W - 68, y: 118, r: 5 }].forEach(d => {
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
});

// Bottom-left: triangle already done above

// Bottom-right: filled square already done above

// ===== EVIDENCE TAG =====
ctx.fillStyle = '#000000';
ctx.font = 'bold 72px monospace';
ctx.textAlign = 'right';
ctx.fillText('E-01', W - 70, H - 195);

// ===== SCALE BAR =====
ctx.strokeStyle = '#000000';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(100, H - 80);
ctx.lineTo(500, H - 80);
ctx.stroke();

// Alternating filled segments for visibility
for (let i = 0; i < 8; i++) {
  const x = 100 + i * 50;
  if (i % 2 === 0) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, H - 90, 50, 20);
  }
}

ctx.fillStyle = '#000000';
ctx.font = '14px monospace';
ctx.textAlign = 'center';
ctx.fillText('0       50      100     150     200     250    300    350 cm', 300, H - 55);

// ===== BOTTOM LABEL =====
ctx.fillStyle = '#666666';
ctx.font = '16px monospace';
ctx.textAlign = 'center';
ctx.fillText('AR MARKER — DO NOT REMOVE', W / 2, H - 30);

// ===== SAVE =====
const buffer = canvas.toBuffer('image/png');
const outPath = path.join(__dirname, 'public', 'ar-marker.png');
fs.writeFileSync(outPath, buffer);
console.log('Marker saved:', outPath, `(${buffer.length} bytes)`);
