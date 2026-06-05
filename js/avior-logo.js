/* ============================================================
   AVIOR — generador de la mascota (bulldog inglés geométrico)
   window.aviorMascot(opts) -> string SVG (inner, viewBox 0 0 256 256)
   opts: { mode:'line'|'solid', line, nose, fill, feat, bg, sw }
   ============================================================ */
(function () {
  function spline(pts, k) {
    k = k || 1 / 6;
    const n = pts.length, P = i => pts[((i % n) + n) % n];
    let d = `M${P(0)[0]} ${P(0)[1]} `;
    for (let i = 0; i < n; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
      const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]} `;
    }
    return d + 'Z';
  }
  const mir = d => d.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, (m, x, y) => `${(256 - parseFloat(x)).toFixed(1)} ${y}`);

  // Broad bulldog head (smooth dome, heavy jowls) — no ear spikes
  const HEAD = spline([
    [128, 66], [156, 68], [178, 80], [191, 106], [197, 140], [190, 172],
    [171, 198], [148, 210], [128, 200], [108, 210], [85, 198], [66, 172],
    [59, 140], [65, 106], [78, 80], [100, 68],
  ]);
  // Floppy ears — petals folding down-out at the top sides
  const EAR_R = spline([[170, 78], [193, 76], [206, 96], [206, 122], [193, 135], [181, 127], [177, 108], [173, 90]]);
  const EAR_L = mir(EAR_R);

  // Features
  const FURROW_L = 'M121 90 L120 108';
  const FURROW_R = 'M135 90 L136 108';
  const BROW_L = 'M80 128 C92 119 108 120 118 129';
  const BROW_R = 'M138 129 C148 120 164 119 176 128';
  const EYE_L = { cx: 99, cy: 143, r: 8 };
  const EYE_R = { cx: 157, cy: 143, r: 8 };
  const NOSE = 'M103 158 C103 177 153 177 153 158 C153 155 150 153 147 153 L109 153 C106 153 103 155 103 158 Z';
  const MOUTH_STEM = 'M128 177 L128 187';
  const MOUTH = 'M97 191 C110 201 122 189 128 187 C134 189 146 201 159 191';

  window.aviorMascot = function (o) {
    o = o || {};
    const mode = o.mode || 'line';
    const sw = o.sw || 9;
    let p = '';

    if (mode === 'solid') {
      const fill = o.fill || '#c9543b';
      const feat = o.feat || '#131110';
      const nose = o.nose || '#131110';
      // unified silhouette: head + ears filled
      p += `<path d="${HEAD}" fill="${fill}" stroke="${fill}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      p += `<path d="${EAR_R}" fill="${fill}" stroke="${fill}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      p += `<path d="${EAR_L}" fill="${fill}" stroke="${fill}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      // knocked-out features
      p += `<path d="${FURROW_L}" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${FURROW_R}" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${BROW_L}" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${BROW_R}" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<circle cx="${EYE_L.cx}" cy="${EYE_L.cy}" r="${EYE_L.r}" fill="${feat}"/>`;
      p += `<circle cx="${EYE_R.cx}" cy="${EYE_R.cy}" r="${EYE_R.r}" fill="${feat}"/>`;
      p += `<path d="${NOSE}" fill="${nose}"/>`;
      p += `<path d="${MOUTH_STEM}" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${MOUTH}" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      const line = o.line || '#ede7da';
      const nose = o.nose || '#c9543b';
      const bg = o.bg || '#131110';
      p += `<path d="${HEAD}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      // ears flop over the head: bg fill hides the head line behind, cream stroke draws the ear
      p += `<path d="${EAR_R}" fill="${bg}" stroke="${line}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      p += `<path d="${EAR_L}" fill="${bg}" stroke="${line}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      p += `<path d="${FURROW_L}" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${FURROW_R}" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${BROW_L}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${BROW_R}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<circle cx="${EYE_L.cx}" cy="${EYE_L.cy}" r="${EYE_L.r}" fill="${line}"/>`;
      p += `<circle cx="${EYE_R.cx}" cy="${EYE_R.cy}" r="${EYE_R.r}" fill="${line}"/>`;
      p += `<path d="${NOSE}" fill="${nose}"/>`;
      p += `<path d="${MOUTH_STEM}" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>`;
      p += `<path d="${MOUTH}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return p;
  };

  window.aviorMascotSVG = function (size, o) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">${window.aviorMascot(o)}</svg>`;
  };
})();
