const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

async function convertSvgToPng(size) {
    const svgBuffer = fs.readFileSync('icons/icon16.svg');
    
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(`icons/icon${size}.png`);
}

async function generateIcons() {
    // Create icons directory if it doesn't exist
    if (!fs.existsSync('icons')) {
        fs.mkdirSync('icons');
    }

    // Generate different sizes
    await Promise.all([
        convertSvgToPng(16),
        convertSvgToPng(48),
        convertSvgToPng(128)
    ]);

    console.log('Icons generated successfully!');
}

generateIcons().catch(console.error); 