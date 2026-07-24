const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\saura\\.gemini\antigravity\\brain\\06a71269-bc42-429a-af28-1467d5bd072c';
const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  { src: 'gym_hero_bg_1784039407713.jpg', dest: 'gym_hero.jpg' },
  { src: 'class_hiit_1784039423073.jpg', dest: 'class_hiit.jpg' },
  { src: 'class_yoga_1784039435991.jpg', dest: 'class_yoga.jpg' },
];

files.forEach((f) => {
  const srcPath = path.join(srcDir, f.src);
  const destPath = path.join(destDir, f.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${f.src} -> ${f.dest}`);
  } else {
    console.error(`Source asset not found: ${srcPath}`);
  }
});
