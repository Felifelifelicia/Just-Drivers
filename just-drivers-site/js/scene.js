/* =========================================================
   首页插画：蜡笔质感、童趣、故意“不够流畅”的开车小场景
   - 每秒只画 12 帧，线条每帧轻微抖动（定格动画的手作感）
   - 鼠标左右移动：车跟着移动，越往右开得越快
   - 点击画面：小车按喇叭
   ========================================================= */
(function () {
  const PAL = {
    ink: "#4b3527", red: "#c9573f", redDark: "#a8432f", mustard: "#e3aa3e",
    hillFar: "#c3cf9f", hillNear: "#a3b986", leaf: "#7fa262", leafDark: "#5f8449",
    trunk: "#8b5d3d", road: "#a69686", roadLine: "#f6ecd8", grass: "#b7c98f",
    cloud: "#fffaf1", sky: "#a9cbd8", window: "#d7e8ec", skin: "#f1c9a6",
    hair: "#3e2c22", flower: "#e8907d", flower2: "#f2c14e", tire: "#4b3a30"
  };

  function rngFrom(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(n) { return rngFrom(n * 9301 + 49297)(); }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.min(255, r + amt * 255)); g = Math.max(0, Math.min(255, g + amt * 255)); b = Math.max(0, Math.min(255, b + amt * 255));
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }

  function mount(canvas, opts) {
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const honkText = (opts && opts.honkText) || (() => "嘀嘀！");
    const handFont = (opts && opts.handFont) || "cursive";
    let W = 0, H = 0, dpr = 1;
    let rng = Math.random;
    let boil = 0;

    /* 蜡笔颗粒纹理 */
    const gcv = document.createElement("canvas");
    gcv.width = gcv.height = 96;
    const gctx = gcv.getContext("2d");
    const img = gctx.createImageData(96, 96);
    const gr = rngFrom(7);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = gr();
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 0;
      img.data[i + 3] = v > 0.62 ? (v - 0.62) * 600 : 0;
    }
    gctx.putImageData(img, 0, 0);
    const grain = ctx.createPattern(gcv, "repeat");

    /* 场景状态 */
    const S = {
      dist: 0, speed: 2.2, targetSpeed: 2.2,
      carX: 0, targetX: 0, honk: 0, puffs: [], lastPuff: 0, hair: 0
    };

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(280, r.width); H = Math.max(180, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!S.carX) { S.carX = S.targetX = W * 0.38; }
    }

    /* ---------- 手绘工具 ---------- */
    function seed(id) { rng = rngFrom(id * 131 + boil * 977 + 3); }
    function j(v) { return (rng() - 0.5) * v; }

    function smoothPath(pts, closed) {
      ctx.beginPath();
      if (pts.length < 2) return;
      const n = pts.length;
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (closed) {
        let m = mid(pts[n - 1], pts[0]);
        ctx.moveTo(m[0], m[1]);
        for (let i = 0; i < n; i++) {
          const p = pts[i], q = pts[(i + 1) % n], mm = mid(p, q);
          ctx.quadraticCurveTo(p[0], p[1], mm[0], mm[1]);
        }
        ctx.closePath();
      } else {
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < n - 1; i++) {
          const mm = mid(pts[i], pts[i + 1]);
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], mm[0], mm[1]);
        }
        ctx.lineTo(pts[n - 1][0], pts[n - 1][1]);
      }
    }
    function circlePts(cx, cy, r, n, jit) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rr = r * (1 + j(jit));
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      return pts;
    }
    /* 蜡笔填色：底色 + 同色系斜向笔触 + 颗粒 */
    function crayon(pathFn, color, box, o) {
      o = o || {};
      ctx.save();
      pathFn();
      ctx.globalAlpha = o.alpha == null ? 0.95 : o.alpha;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.clip();
      const [x, y, w, h] = box;
      ctx.globalAlpha = o.hatch == null ? 0.22 : o.hatch;
      ctx.strokeStyle = shade(color, o.hatchShade == null ? -0.12 : o.hatchShade);
      ctx.lineWidth = 1.3;
      ctx.lineCap = "round";
      const step = o.step || 5;
      for (let k = -h; k < w + h; k += step) {
        ctx.beginPath();
        ctx.moveTo(x + k + j(2), y + h + j(2));
        ctx.lineTo(x + k + h * 0.55 + j(3), y + j(2));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = o.grain == null ? 0.55 : o.grain;
      ctx.fillStyle = grain;
      ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
      ctx.restore();
    }
    function outline(pathFn, width, alpha) {
      ctx.save();
      ctx.strokeStyle = PAL.ink;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.globalAlpha = alpha == null ? 0.75 : alpha;
      ctx.lineWidth = width || 2;
      pathFn();
      ctx.stroke();
      ctx.restore();
    }

    /* ---------- 场景元素 ---------- */
    const groundY = () => H * 0.66;

    function drawSky() {
      seed(1);
      ctx.save();
      ctx.strokeStyle = PAL.sky; ctx.lineCap = "round";
      for (let i = 0; i < 9; i++) {
        const x = rng() * W, y = 14 + rng() * (groundY() * 0.55), len = 40 + rng() * 120;
        ctx.globalAlpha = 0.18 + rng() * 0.12;
        ctx.lineWidth = 3 + rng() * 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + len * 0.5, y - 6 + j(8), x + len, y + j(6));
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawSun(t) {
      const r = Math.min(W, H) * 0.085, cx = W * 0.84, cy = H * 0.2;
      seed(2);
      const pts = circlePts(cx, cy, r, 14, 0.08);
      crayon(() => smoothPath(pts, true), PAL.mustard, [cx - r, cy - r, r * 2, r * 2]);
      outline(() => smoothPath(pts, true), 1.6, 0.5);
      const rot = reduce ? 0 : Math.floor(t / 400) * 0.12;
      ctx.save();
      ctx.strokeStyle = PAL.mustard; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.globalAlpha = 0.85;
      for (let i = 0; i < 10; i++) {
        const a = rot + (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 1.3 + j(2), cy + Math.sin(a) * r * 1.3 + j(2));
        ctx.lineTo(cx + Math.cos(a) * r * (1.62 + j(0.1)), cy + Math.sin(a) * r * (1.62 + j(0.1)));
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawClouds() {
      const span = W + 320;
      for (let i = 0; i < 3; i++) {
        const base = i * span / 3 + 80;
        const x = ((base - S.dist * 0.12) % span + span) % span - 160;
        const y = H * (0.13 + 0.08 * i);
        const s = Math.min(W, H) * (0.07 + 0.015 * i);
        seed(10 + i);
        const pts = [];
        const n = 26;
        for (let k = 0; k < n; k++) {
          const a = (k / n) * Math.PI * 2;
          const bump = 1 + 0.22 * Math.abs(Math.sin(a * 3.5 + i)) + j(0.06);
          pts.push([x + Math.cos(a) * s * 1.7 * bump, y + Math.sin(a) * s * 0.75 * bump]);
        }
        crayon(() => smoothPath(pts, true), PAL.cloud, [x - s * 2.2, y - s * 1.2, s * 4.4, s * 2.4], { hatch: 0.14, hatchShade: -0.1, grain: 0.3 });
        outline(() => smoothPath(pts, true), 1.6, 0.45);
      }
    }

    function hillLayer(id, speed, baseY, amp, freq, color) {
      const off = S.dist * speed;
      seed(id);
      const pts = [[-30, H]];
      for (let x = -30; x <= W + 30; x += 22) {
        const wx = x + off;
        const y = baseY - amp * (0.6 * Math.sin(wx * freq) + 0.4 * Math.sin(wx * freq * 2.3 + 1.7)) + j(2.5);
        pts.push([x, y]);
      }
      pts.push([W + 30, H]);
      crayon(() => smoothPath(pts, true), color, [-30, baseY - amp * 1.2, W + 60, H - baseY + amp * 1.2]);
      outline(() => smoothPath(pts.slice(1, -1), false), 1.8, 0.55);
    }

    function drawTrees(speed, y0) {
      const gap = 230;
      const off = S.dist * speed;
      const first = Math.floor((off - 100) / gap);
      for (let k = first; k < first + Math.ceil(W / gap) + 3; k++) {
        if (hash(k) < 0.25) continue;
        const x = k * gap - off + hash(k + 99) * 90;
        const size = 26 + hash(k + 7) * 22;
        const pine = hash(k + 3) > 0.62;
        seed(500 + k);
        // 树干
        const tr = [[x - 4 + j(2), y0], [x - 3 + j(2), y0 - size * 1.1], [x + 3 + j(2), y0 - size * 1.1], [x + 4 + j(2), y0]];
        crayon(() => smoothPath(tr, true), PAL.trunk, [x - 6, y0 - size * 1.2, 12, size * 1.2], { hatch: 0.2 });
        outline(() => smoothPath(tr, true), 1.4, 0.6);
        if (pine) {
          const tp = [[x, y0 - size * 2.4 + j(3)], [x + size * 0.75 + j(3), y0 - size * 0.85], [x - size * 0.75 + j(3), y0 - size * 0.85]];
          crayon(() => smoothPath(tp, true), PAL.leafDark, [x - size, y0 - size * 2.5, size * 2, size * 1.8]);
          outline(() => smoothPath(tp, true), 1.6, 0.6);
        } else {
          const cp = circlePts(x, y0 - size * 1.55, size * 0.75, 12, 0.12);
          crayon(() => smoothPath(cp, true), PAL.leaf, [x - size, y0 - size * 2.4, size * 2, size * 1.8]);
          outline(() => smoothPath(cp, true), 1.6, 0.6);
        }
      }
    }

    function drawGround() {
      const gy = groundY(), roadTop = gy + H * 0.07, roadBot = H * 0.93;
      seed(40);
      const grass = [[-20, gy + j(3)], [W * 0.5, gy + j(4)], [W + 20, gy + j(3)], [W + 20, H + 5], [-20, H + 5]];
      crayon(() => { ctx.beginPath(); ctx.moveTo(grass[0][0], grass[0][1]); grass.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); }, PAL.grass, [-20, gy - 5, W + 40, H - gy + 10], { hatch: 0.25 });
      seed(41);
      const road = [[-20, roadTop + j(3)], [W * 0.33, roadTop + j(4)], [W * 0.66, roadTop + j(4)], [W + 20, roadTop + j(3)], [W + 20, roadBot + j(3)], [W * 0.5, roadBot + j(4)], [-20, roadBot + j(3)]];
      const rp = () => { ctx.beginPath(); ctx.moveTo(road[0][0], road[0][1]); road.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); };
      crayon(rp, PAL.road, [-20, roadTop - 5, W + 40, roadBot - roadTop + 10], { hatch: 0.28, step: 4 });
      outline(() => { ctx.beginPath(); ctx.moveTo(-20, road[0][1]); ctx.lineTo(W + 20, road[3][1]); }, 2, 0.6);
      outline(() => { ctx.beginPath(); ctx.moveTo(-20, road[6][1]); ctx.lineTo(W + 20, road[4][1]); }, 2, 0.6);
      // 路中间的虚线
      const midY = (roadTop + roadBot) / 2, gap = 110, off = S.dist;
      ctx.save();
      ctx.strokeStyle = PAL.roadLine; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.globalAlpha = 0.9;
      for (let x = -(off % gap) - gap; x < W + gap; x += gap) {
        seed(700 + Math.round((x + off) / gap));
        ctx.beginPath(); ctx.moveTo(x + j(3), midY + j(2)); ctx.lineTo(x + 50 + j(4), midY + j(2)); ctx.stroke();
      }
      ctx.restore();
      // 小花
      const fgap = 60, foff = S.dist;
      for (let x = -(foff % fgap) - fgap; x < W + fgap; x += fgap) {
        const k = Math.round((x + foff) / fgap);
        if (hash(k + 300) < 0.5) continue;
        const fx = x + hash(k) * 40, fy = gy + 6 + hash(k + 1) * (H * 0.05);
        seed(900 + k);
        const c = hash(k + 2) > 0.5 ? PAL.flower : PAL.flower2;
        const fp = circlePts(fx, fy, 3.2, 6, 0.3);
        crayon(() => smoothPath(fp, true), c, [fx - 5, fy - 5, 10, 10], { hatch: 0.1, grain: 0.25 });
      }
      return { roadTop, roadBot };
    }

    function drawCar(t, road) {
      const sc = Math.min(W / 900, H / 300) * 1.15 + 0.35;
      const cw = 150 * sc, ch = 70 * sc;
      const bob = reduce ? 0 : [0, -1.6, 0.8][boil] * sc;
      const x = S.carX - cw / 2;
      const by = (road.roadTop + road.roadBot) / 2 + ch * 0.05 + bob;
      const top = by - ch;
      seed(60);
      // 车身
      const body = [
        [x + j(3), by - ch * 0.15], [x + cw * 0.02 + j(3), by - ch * 0.48], [x + cw * 0.22 + j(3), by - ch * 0.55],
        [x + cw * 0.32 + j(3), top + ch * 0.05], [x + cw * 0.68 + j(3), top + j(2)], [x + cw * 0.8 + j(3), by - ch * 0.55],
        [x + cw * 0.98 + j(3), by - ch * 0.48], [x + cw + j(3), by - ch * 0.12], [x + cw * 0.5, by + j(2)]
      ];
      crayon(() => smoothPath(body, true), PAL.red, [x - 4, top - 4, cw + 8, ch + 8], { hatch: 0.3, hatchShade: -0.18 });
      outline(() => smoothPath(body, true), 2.4, 0.85);
      // 车窗
      seed(61);
      const win = [[x + cw * 0.36 + j(2), by - ch * 0.56], [x + cw * 0.4 + j(2), top + ch * 0.18], [x + cw * 0.66 + j(2), top + ch * 0.14], [x + cw * 0.74 + j(2), by - ch * 0.56]];
      crayon(() => smoothPath(win, true), PAL.window, [x + cw * 0.34, top + ch * 0.1, cw * 0.42, ch * 0.5], { hatch: 0.15, grain: 0.35 });
      // 车里的她：头 + 甩起来的马尾
      const hx = x + cw * 0.6, hy = by - ch * 0.66;
      const hr = ch * 0.13;
      seed(62);
      ctx.save();
      smoothPath(win, true); ctx.clip();
      const sw = Math.sin(S.hair) * 4 * sc;
      const tail = [[hx - hr * 0.8, hy - hr * 0.6], [hx - hr * 2.2 + j(2), hy - hr * 0.9 + sw], [hx - hr * 2.9 + j(2), hy - hr * 0.2 + sw * 1.4], [hx - hr * 1.2, hy - hr * 0.1]];
      crayon(() => smoothPath(tail, true), PAL.hair, [hx - hr * 3.2, hy - hr * 1.6, hr * 3, hr * 2.4], { hatch: 0.2 });
      const head = circlePts(hx, hy, hr, 10, 0.08);
      crayon(() => smoothPath(head, true), PAL.skin, [hx - hr, hy - hr, hr * 2, hr * 2], { hatch: 0.12, grain: 0.3 });
      const hairCap = [[hx - hr * 1.05, hy - hr * 0.1], [hx - hr * 0.6, hy - hr * 1.1], [hx + hr * 0.6, hy - hr * 1.15], [hx + hr * 0.95, hy - hr * 0.35], [hx + hr * 0.1, hy - hr * 0.55]];
      crayon(() => smoothPath(hairCap, true), PAL.hair, [hx - hr * 1.2, hy - hr * 1.3, hr * 2.4, hr * 1.4], { hatch: 0.2 });
      ctx.fillStyle = PAL.ink; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(hx + hr * 0.5, hy + hr * 0.05, 1.3 * sc, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      outline(() => smoothPath(win, true), 1.8, 0.7);
      // 车门线、车灯
      outline(() => { ctx.beginPath(); ctx.moveTo(x + cw * 0.55 + j(2), by - ch * 0.55); ctx.lineTo(x + cw * 0.56 + j(2), by - ch * 0.12); }, 1.5, 0.55);
      seed(63);
      const lamp = circlePts(x + cw * 0.95, by - ch * 0.36, ch * 0.06, 7, 0.15);
      crayon(() => smoothPath(lamp, true), PAL.mustard, [x + cw * 0.9, by - ch * 0.45, ch * 0.2, ch * 0.2], { hatch: 0.1 });
      // 轮子
      const wr = ch * 0.2;
      [x + cw * 0.24, x + cw * 0.76].forEach((wx, k) => {
        seed(70 + k);
        const wp = circlePts(wx, by, wr, 11, 0.07);
        crayon(() => smoothPath(wp, true), PAL.tire, [wx - wr, by - wr, wr * 2, wr * 2], { hatch: 0.2, hatchShade: 0.15 });
        outline(() => smoothPath(wp, true), 2, 0.8);
        const hub = circlePts(wx, by, wr * 0.42, 8, 0.1);
        crayon(() => smoothPath(hub, true), PAL.roadLine, [wx - wr * 0.5, by - wr * 0.5, wr, wr], { hatch: 0.1, grain: 0.3 });
        const rot = S.dist / wr;
        ctx.save(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.7; ctx.lineCap = "round";
        ctx.fillStyle = PAL.ink;
        for (let s = 0; s < 4; s++) {
          const a = rot + s * Math.PI / 2;
          ctx.beginPath(); ctx.arc(wx + Math.cos(a) * wr * 0.24, by + Math.sin(a) * wr * 0.24, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
      // 尾气
      S.puffs.forEach(p => {
        seed(800 + p.id);
        const pp = circlePts(p.x, p.y, p.r, 8, 0.15);
        crayon(() => smoothPath(pp, true), PAL.cloud, [p.x - p.r, p.y - p.r, p.r * 2, p.r * 2], { alpha: p.a, hatch: 0.1, grain: 0.3 });
        outline(() => smoothPath(pp, true), 1.2, p.a * 0.4);
      });
      // 喇叭
      if (S.honk > 0) {
        const bx = x + cw * 0.95, byy = top - ch * 0.35;
        ctx.save();
        ctx.globalAlpha = Math.min(1, S.honk / 300);
        ctx.font = Math.round(22 * sc + 6) + "px " + handFont;
        ctx.fillStyle = PAL.ink;
        ctx.textAlign = "center";
        ctx.translate(bx, byy); ctx.rotate(-0.08 + j(0.04));
        ctx.fillText(honkText(), 0, 0);
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.lineCap = "round";
        [-1, 0, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(-cw * 0.08 + k * 10, ch * 0.18); ctx.lineTo(-cw * 0.12 + k * 14, ch * 0.32); ctx.stroke(); });
        ctx.restore();
      }
      return { x, top, cw, ch, by };
    }

    /* ---------- 主循环 ---------- */
    let carBox = null;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      drawSky();
      drawSun(t);
      drawClouds();
      hillLayer(30, 0.18, H * 0.5, H * 0.08, 0.0042, PAL.hillFar);
      hillLayer(31, 0.38, H * 0.6, H * 0.06, 0.0065, PAL.hillNear);
      drawTrees(0.62, groundY() + 4);
      const road = drawGround();
      carBox = drawCar(t, road);
    }

    let raf = 0, last = 0, lastFrame = 0, running = true, visible = true;
    const FRAME = 1000 / 12;
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) { last = now; return; }
      const dt = Math.min(100, now - (last || now)); last = now;
      S.speed += (S.targetSpeed - S.speed) * 0.04;
      S.carX += (S.targetX - S.carX) * 0.05;
      S.dist += S.speed * dt * 0.09;
      S.hair += dt * 0.012 * (0.6 + S.speed * 0.25);
      if (S.honk > 0) S.honk -= dt;
      if (now - S.lastPuff > 520 && carBox) {
        S.lastPuff = now;
        S.puffs.push({ id: (now | 0), x: carBox.x - 4, y: carBox.by - carBox.ch * 0.22, r: 5, a: 0.8 });
      }
      S.puffs.forEach(p => { p.x -= S.speed * dt * 0.06; p.y -= dt * 0.01; p.r += dt * 0.012; p.a -= dt * 0.0011; });
      S.puffs = S.puffs.filter(p => p.a > 0.05);
      if (now - lastFrame >= FRAME) {
        lastFrame = now;
        boil = (boil + 1) % 3;
        draw(now);
      }
    }

    function pointer(e) {
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left);
      S.targetX = Math.max(W * 0.16, Math.min(W * 0.78, mx));
      S.targetSpeed = 1.2 + (mx / W) * 4;
    }
    function leave() { S.targetX = W * 0.38; S.targetSpeed = 2.2; }
    function honk() { S.honk = 1200; if (reduce) { draw(0); setTimeout(() => { S.honk = 0; draw(0); }, 1200); } }

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); });
    ro.observe(canvas);
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; });
    io.observe(canvas);
    canvas.addEventListener("pointermove", pointer);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", honk);
    canvas.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); honk(); } });

    if (reduce) draw(0); else raf = requestAnimationFrame(tick);

    return function stop() {
      running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      void running;
    };
  }

  window.HW_SCENE = { mount };
})();
