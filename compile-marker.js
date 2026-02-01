const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Patch global for mind-ar's browser-oriented code
global.document = {
  createElement: (tag) => {
    if (tag === 'canvas') {
      const c = createCanvas(1, 1);
      c.style = {};
      return c;
    }
    return {};
  }
};
global.window = global;
global.navigator = { userAgent: 'node' };
global.self = global;
global.Image = class {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }
};

async function compile() {
  console.log('Loading image...');
  const imgPath = path.join(__dirname, 'public', 'ar-marker.png');
  const img = await loadImage(imgPath);

  // Create canvas from image
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  console.log(`Image loaded: ${img.width}x${img.height}`);

  // Try to use mind-ar compiler
  let Compiler;
  try {
    const mindAr = require('mind-ar/dist/mindar-image.prod.js');
    Compiler = mindAr.Compiler || (global.MINDAR && global.MINDAR.IMAGE && global.MINDAR.IMAGE.Compiler);
  } catch(e) {
    // Try alternate path
    try {
      require('mind-ar/dist/mindar-image.prod.js');
      Compiler = global.MINDAR.IMAGE.Compiler;
    } catch(e2) {
      console.log('Trying alternate import...');
    }
  }

  if (!Compiler) {
    // Fallback: use the src compiler directly
    try {
      const { Compiler: SrcCompiler } = require('mind-ar/src/image-target/compiler');
      Compiler = SrcCompiler;
    } catch(e) {
      console.error('Cannot find MindAR compiler. Trying different path...');
      // List available files
      const distPath = path.join(__dirname, 'node_modules', 'mind-ar', 'dist');
      if (fs.existsSync(distPath)) {
        console.log('dist/ contents:', fs.readdirSync(distPath));
      }
      const srcPath = path.join(__dirname, 'node_modules', 'mind-ar', 'src');
      if (fs.existsSync(srcPath)) {
        console.log('src/ contents:', fs.readdirSync(srcPath));
      }
      process.exit(1);
    }
  }

  console.log('Compiling target...');
  const compiler = new Compiler();

  // The compiler expects image elements with width/height and drawable to canvas
  const fakeImg = {
    width: img.width,
    height: img.height,
    _canvas: canvas,
  };

  // Override the internal _loadImage if needed
  const data = await compiler.compileImageTargets([img], (progress) => {
    process.stdout.write(`\rProgress: ${Math.round(progress * 100)}%`);
  });

  console.log('\nExporting...');
  const buffer = await compiler.exportData();
  const outPath = path.join(__dirname, 'public', 'targets.mind');
  fs.writeFileSync(outPath, Buffer.from(buffer));
  console.log('Saved:', outPath, `(${Buffer.from(buffer).length} bytes)`);
}

compile().catch(e => {
  console.error('Compile failed:', e.message);
  process.exit(1);
});
