const fs = require('fs');
const path = require('path');

const filmDir = path.join(__dirname, '../public/film');
const files = fs.readdirSync(filmDir);
const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
fs.writeFileSync(
  path.join(filmDir, 'images.json'),
  JSON.stringify(images, null, 2)
);
console.log('Generated images.json with', images.length, 'images');
