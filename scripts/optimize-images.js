const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filmDir = path.join(__dirname, '../public/film');
const optimizedDir = path.join(filmDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Get all image files (jpg, jpeg, tiff, etc.)
const files = fs.readdirSync(filmDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.tiff', '.tif'].includes(ext) && !file.includes('optimized');
});

console.log(`Found ${files.length} images to optimize...`);

async function optimizeImages() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(filmDir, file);
    const outputPath = path.join(optimizedDir, file);
    
    console.log(`Optimizing ${i + 1}/${files.length}: ${file}`);
    
    try {
      const originalSize = fs.statSync(inputPath).size;
      
      // Use Sharp to optimize the image
      await sharp(inputPath)
        .resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85, 
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
      console.log(`  Optimized: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
      console.log(`  Savings: ${savings}%`);
      console.log('');
      
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
  console.log(`Optimized images are in: ${optimizedDir}`);
}

optimizeImages().catch(console.error); 