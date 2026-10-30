import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function updatePwaIconsFromNewLogo() {
  const publicDir = path.resolve('public');
  const publicAssetsDir = path.join(publicDir, 'assets');
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true });
  }

  const squareIconSrc = path.resolve('src/assets/images/vitale_icon_square_1793382102405.jpg');
  const wideLogoSrc = path.resolve('src/assets/images/vitale_logo_luxury_1793382085201.jpg');

  // 1. Copy wide logo and square icon to /public/assets for reliable client access
  fs.copyFileSync(wideLogoSrc, path.join(publicAssetsDir, 'vitale_logo_luxury.jpg'));
  fs.copyFileSync(squareIconSrc, path.join(publicAssetsDir, 'vitale_icon_square.jpg'));

  console.log('Copied luxury logos to /public/assets');

  // 2. Generate crisp PWA 512x512 icon
  await sharp(squareIconSrc)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('pwa-512x512.png created');

  // 3. Generate crisp PWA 192x192 icon
  await sharp(squareIconSrc)
    .resize(192, 192, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('pwa-192x192.png created');

  // 4. Generate Apple Touch Icon 180x180
  await sharp(squareIconSrc)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png created');

  // 5. Generate Favicon 32x32
  await sharp(squareIconSrc)
    .resize(32, 32, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('favicon-32x32.png created');

  // 6. Generate Maskable icon 512x512 with safe-zone padding
  // Maskable safe zone is inner 80% circle (radius ~204px). We resize icon to 410x410 and composite on 512x512 #080809 background.
  const innerResized = await sharp(squareIconSrc)
    .resize(420, 420, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 8, g: 8, b: 9, alpha: 1 }
    }
  })
  .composite([
    {
      input: innerResized,
      top: 46,
      left: 46
    }
  ])
  .png({ quality: 100 })
  .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('pwa-maskable-512x512.png created');

  console.log('All PWA icons upgraded to official Instituto Vitale logo!');
}

updatePwaIconsFromNewLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
