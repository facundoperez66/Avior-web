const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '..', 'assets', 'og-image.svg');
const pngPath = path.join(__dirname, '..', 'assets', 'og-image.png');

const svg = fs.readFileSync(svgPath);
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true }
});
const pngData = resvg.render().asPng();
fs.writeFileSync(pngPath, pngData);
console.log('✓ assets/og-image.png generado (' + (pngData.length / 1024).toFixed(1) + ' KB)');
