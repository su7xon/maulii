const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BG_COLOR = { r: 20, g: 20, b: 20, alpha: 1 }; // #141414

async function createCenteredIcon(srcCroppedEmblem, canvasSize, emblemFraction, outputPath) {
  const emblemSize = Math.round(canvasSize * emblemFraction);
  const offset = Math.round((canvasSize - emblemSize) / 2);

  const resizedEmblem = await sharp(srcCroppedEmblem)
    .resize(emblemSize, emblemSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: BG_COLOR
    }
  })
    .composite([
      {
        input: resizedEmblem,
        top: offset,
        left: offset
      }
    ])
    .png()
    .toFile(outputPath);

  console.log(`Generated ${outputPath} (${canvasSize}x${canvasSize}, emblem: ${emblemSize}x${emblemSize}, offset: ${offset})`);
}

async function main() {
  const logoPath = path.join(__dirname, 'public', 'mauli-logo.png');

  // Exact bounds of the circular gold emblem in mauli-logo.png
  // minX: 20, maxX: 446 (width 426)
  // minY: 13, maxY: 439 (height 426)
  // Center is exactly at (233, 226)
  const croppedEmblem = await sharp(logoPath)
    .extract({ left: 20, top: 13, width: 426, height: 426 })
    .toBuffer();

  console.log('Successfully cropped circular emblem to 426x426 perfectly centered.');

  // 1. PWA & Web Icons
  await createCenteredIcon(croppedEmblem, 512, 0.65, path.join(__dirname, 'public', 'icon-512.png'));
  await createCenteredIcon(croppedEmblem, 192, 0.65, path.join(__dirname, 'public', 'icon-192.png'));
  await createCenteredIcon(croppedEmblem, 512, 0.65, path.join(__dirname, 'android_app', 'store_icon.png'));

  // 2. Android mipmaps
  const mipmaps = [
    { dir: 'mipmap-mdpi', launcher: 48, maskable: 82 },
    { dir: 'mipmap-hdpi', launcher: 72, maskable: 123 },
    { dir: 'mipmap-xhdpi', launcher: 96, maskable: 164 },
    { dir: 'mipmap-xxhdpi', launcher: 144, maskable: 246 },
    { dir: 'mipmap-xxxhdpi', launcher: 192, maskable: 328 },
  ];

  for (const m of mipmaps) {
    const resDir = path.join(__dirname, 'android_app', 'app', 'src', 'main', 'res', m.dir);
    // ic_launcher (standard launcher icon)
    await createCenteredIcon(croppedEmblem, m.launcher, 0.72, path.join(resDir, 'ic_launcher.png'));
    // ic_maskable (adaptive icon layer)
    await createCenteredIcon(croppedEmblem, m.maskable, 0.58, path.join(resDir, 'ic_maskable.png'));
  }

  // 3. Android Splash screens
  const splashes = [
    { dir: 'drawable-mdpi', size: 300 },
    { dir: 'drawable-hdpi', size: 450 },
    { dir: 'drawable-xhdpi', size: 600 },
    { dir: 'drawable-xxhdpi', size: 900 },
    { dir: 'drawable-xxxhdpi', size: 1200 },
  ];

  for (const s of splashes) {
    const resDir = path.join(__dirname, 'android_app', 'app', 'src', 'main', 'res', s.dir);
    await createCenteredIcon(croppedEmblem, s.size, 0.5, path.join(resDir, 'splash.png'));
  }

  console.log('All icons generated with pixel-perfect centering!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
