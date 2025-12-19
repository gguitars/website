const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');

async function convertImages() {
  console.log('Starting image conversion...');
  try {
    const files = await fs.readdir(assetsDir);
    console.log(`Found ${files.length} files in ${assetsDir}`);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.avif') {
        const inputFile = path.join(assetsDir, file);
        const outputFile = path.join(assetsDir, path.basename(file, '.avif') + '.webp');
        try {
          console.log(`Converting ${inputFile} to ${outputFile}`);
          await sharp(inputFile).toFile(outputFile);
          console.log(`Converted ${file} to ${path.basename(outputFile)}`);
          await fs.unlink(inputFile);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error reading assets directory:', err);
  }
  console.log('Image conversion finished.');
}

convertImages();