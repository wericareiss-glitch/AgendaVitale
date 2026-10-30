import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG with Luxury Instituto Vitale Logo
// Standard 512x512
const standardSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1A1813"/>
      <stop offset="60%" stop-color="#0E0D0C"/>
      <stop offset="100%" stop-color="#060607"/>
    </radialGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4"/>
      <stop offset="35%" stop-color="#E5C158"/>
      <stop offset="70%" stop-color="#B8861B"/>
      <stop offset="100%" stop-color="#80570E"/>
    </linearGradient>
    <linearGradient id="goldLight" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#FDF0CD"/>
      <stop offset="100%" stop-color="#AA7A1E"/>
    </linearGradient>
    <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#D4AF37" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="110" fill="url(#bgGlow)"/>
  
  <!-- Outer Decorative Ring -->
  <circle cx="256" cy="256" r="224" stroke="url(#goldGradient)" stroke-width="2.5" stroke-opacity="0.4" stroke-dasharray="14 10"/>
  <circle cx="256" cy="256" r="214" stroke="url(#goldLight)" stroke-width="1.5" stroke-opacity="0.8"/>
  <circle cx="256" cy="256" r="198" stroke="url(#goldGradient)" stroke-width="0.75" stroke-opacity="0.3"/>

  <!-- Golden 4-point Diamond Stars around ring -->
  <path d="M 256 30 L 259 42 L 271 42 L 261 49 L 265 61 L 256 54 L 247 61 L 251 49 L 241 42 L 253 42 Z" fill="url(#goldLight)"/>
  <path d="M 256 451 L 259 463 L 271 463 L 261 470 L 265 482 L 256 475 L 247 482 L 251 470 L 241 463 L 253 463 Z" fill="url(#goldLight)"/>
  <circle cx="42" cy="256" r="4" fill="url(#goldLight)"/>
  <circle cx="470" cy="256" r="4" fill="url(#goldLight)"/>

  <!-- Center Emblem Group with Gold Filter -->
  <g filter="url(#goldShadow)">
    <!-- Central Luxury Emblem: Stylized Shield / Diamond Contour -->
    <path d="M 256 95 L 366 185 C 366 280 295 350 256 375 C 217 350 146 280 146 185 Z" fill="#121110" stroke="url(#goldGradient)" stroke-width="3"/>
    <path d="M 256 112 L 350 190 C 350 268 290 330 256 354 C 222 330 162 268 162 190 Z" stroke="url(#goldLight)" stroke-width="1.2" stroke-opacity="0.5"/>

    <!-- Central "V" Monogram -->
    <path d="M 205 160 L 256 295 L 307 160 L 332 160 L 268 325 L 244 325 L 180 160 Z" fill="url(#goldLight)"/>

    <!-- Medical/Aesthetic Diamond Sparkle in Upper Center -->
    <path d="M 256 135 C 256 150 260 156 272 156 C 260 156 256 162 256 177 C 256 162 252 156 240 156 C 252 156 256 150 256 135 Z" fill="url(#goldGradient)"/>

    <!-- Elegant Aesthetic Leaf/Wing Flairs -->
    <path d="M 256 260 C 278 240 318 240 338 220 C 318 228 288 232 256 260 Z" fill="url(#goldLight)" opacity="0.85"/>
    <path d="M 256 260 C 234 240 194 240 174 220 C 194 228 224 232 256 260 Z" fill="url(#goldLight)" opacity="0.85"/>
  </g>

  <!-- Typography at bottom: VITALE -->
  <text x="256" y="415" font-family="'Outfit', 'Cinzel', 'Trajan Pro', serif, sans-serif" font-size="34" font-weight="700" letter-spacing="8" fill="url(#goldLight)" text-anchor="middle">VITALE</text>
  <text x="256" y="435" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="500" letter-spacing="4" fill="#C5A059" text-anchor="middle" opacity="0.9">ESTÉTICA AVANÇADA</text>
</svg>
`;

// Maskable version: Safe zone requires that all essential content fits within an inner 80% circle (radius = 204px).
// Background is full edge-to-edge square with no rounded border so Android can clip it into any shape (squircle, circle, rounded rect).
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlowM" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#1A1813"/>
      <stop offset="60%" stop-color="#0E0D0C"/>
      <stop offset="100%" stop-color="#060607"/>
    </radialGradient>
    <linearGradient id="goldGradientM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4"/>
      <stop offset="35%" stop-color="#E5C158"/>
      <stop offset="70%" stop-color="#B8861B"/>
      <stop offset="100%" stop-color="#80570E"/>
    </linearGradient>
    <linearGradient id="goldLightM" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#FDF0CD"/>
      <stop offset="100%" stop-color="#AA7A1E"/>
    </linearGradient>
    <filter id="goldShadowM" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#D4AF37" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Solid edge-to-edge background for maskable -->
  <rect width="512" height="512" fill="url(#bgGlowM)"/>

  <!-- Scaled content centered within safe zone (scale 0.76) -->
  <g transform="translate(61.44, 61.44) scale(0.76)">
    <!-- Decorative Ring -->
    <circle cx="256" cy="256" r="224" stroke="url(#goldGradientM)" stroke-width="3" stroke-opacity="0.4" stroke-dasharray="14 10"/>
    <circle cx="256" cy="256" r="214" stroke="url(#goldLightM)" stroke-width="2" stroke-opacity="0.8"/>

    <g filter="url(#goldShadowM)">
      <!-- Shield -->
      <path d="M 256 95 L 366 185 C 366 280 295 350 256 375 C 217 350 146 280 146 185 Z" fill="#121110" stroke="url(#goldGradientM)" stroke-width="3.5"/>
      <path d="M 256 112 L 350 190 C 350 268 290 330 256 354 C 222 330 162 268 162 190 Z" stroke="url(#goldLightM)" stroke-width="1.5" stroke-opacity="0.5"/>

      <!-- "V" Monogram -->
      <path d="M 205 160 L 256 295 L 307 160 L 332 160 L 268 325 L 244 325 L 180 160 Z" fill="url(#goldLightM)"/>

      <!-- Diamond Sparkle -->
      <path d="M 256 135 C 256 150 260 156 272 156 C 260 156 256 162 256 177 C 256 162 252 156 240 156 C 252 156 256 150 256 135 Z" fill="url(#goldGradientM)"/>
      <path d="M 256 260 C 278 240 318 240 338 220 C 318 228 288 232 256 260 Z" fill="url(#goldLightM)" opacity="0.85"/>
      <path d="M 256 260 C 234 240 194 240 174 220 C 194 228 224 232 256 260 Z" fill="url(#goldLightM)" opacity="0.85"/>
    </g>

    <text x="256" y="418" font-family="'Outfit', serif, sans-serif" font-size="36" font-weight="700" letter-spacing="8" fill="url(#goldLightM)" text-anchor="middle">VITALE</text>
    <text x="256" y="440" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" letter-spacing="4" fill="#C5A059" text-anchor="middle">ESTÉTICA</text>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardSvg);

  const stdBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  console.log('Generating PWA icons...');

  // 1. pwa-512x512.png
  await sharp(stdBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('pwa-512x512.png generated.');

  // 2. pwa-192x192.png
  await sharp(stdBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('pwa-192x192.png generated.');

  // 3. pwa-maskable-512x512.png
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('pwa-maskable-512x512.png generated.');

  // 4. apple-touch-icon.png (180x180)
  await sharp(stdBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png generated.');

  // 5. favicon-32x32.png
  await sharp(stdBuffer)
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('favicon-32x32.png generated.');

  console.log('All PWA icons generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
