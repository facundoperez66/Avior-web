const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const pngToIco = require('png-to-ico').default || require('png-to-ico').imagesToIco;

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'assets', 'avior-icon.svg');
const svg = fs.readFileSync(svgPath);

function renderPng(size) {
  var resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true }
  });
  return resvg.render().asPng();
}

var sizes = [
  { size: 16,  out: 'assets/favicon-16x16.png' },
  { size: 32,  out: 'assets/favicon-32x32.png' },
  { size: 180, out: 'assets/apple-touch-icon.png' },
  { size: 192, out: 'assets/android-chrome-192x192.png' },
  { size: 512, out: 'assets/android-chrome-512x512.png' }
];

for (var i = 0; i < sizes.length; i++) {
  var entry = sizes[i];
  var png = renderPng(entry.size);
  fs.writeFileSync(path.join(root, entry.out), png);
  console.log('✓ ' + entry.out + ' (' + (png.length / 1024).toFixed(1) + ' KB)');
}

// .ico bundle (16+32) en la raíz
(function () {
  var png16 = renderPng(16);
  var png32 = renderPng(32);
  pngToIco([png16, png32]).then(function (ico) {
    fs.writeFileSync(path.join(root, 'favicon.ico'), ico);
    console.log('✓ favicon.ico (' + (ico.length / 1024).toFixed(1) + ' KB)');
  });
})();
