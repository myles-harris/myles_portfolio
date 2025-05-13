import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'film');
    const files = await fs.readdir(publicDir);
    
    // Filter for image files and create proper paths
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|tif|tiff)$/i.test(file))
      .map(file => {
        // Convert .tif/.tiff extensions to .jpg for the URL
        const ext = path.extname(file).toLowerCase();
        if (ext === '.tif' || ext === '.tiff') {
          const baseName = path.basename(file, ext);
          return `/film/${baseName}.jpg`;
        }
        return `/film/${file}`;
      });

    console.log('Available images:', images);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
} 