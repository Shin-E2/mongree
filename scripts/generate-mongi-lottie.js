#!/usr/bin/env node
/**
 * PNG 이미지를 외부 참조하는 Lottie JSON 생성 스크립트
 * 각 MongiState = 타임라인 구간 + 해당 PNG + 애니메이션 키프레임
 * 실행: node scripts/generate-mongi-lottie.js
 */

const fs = require('fs');
const path = require('path');

const W = 240, H = 240, FPS = 30;
const IMG_W = 1254, IMG_H = 1254;
// 캐릭터를 캔버스 200x200에 맞춤 (위아래 여백 20px씩)
const S = parseFloat(((200 / IMG_W) * 100).toFixed(4)); // 15.9490
const CX = 120, CY = 128;  // 캐릭터 중심 (아래 여백 더 줌)
const AX = IMG_W / 2, AY = IMG_H / 2; // 앵커 = 이미지 중심

// ── 이징 ──────────────────────────────────────────────
const IO  = { i: { x: [0.5], y: [1.0] }, o: { x: [0.5], y: [0.0] } };
const SPR = { i: { x: [0.2], y: [1.6] }, o: { x: [0.7], y: [0.0] } };
const OUT = { i: { x: [0.2], y: [1.0] }, o: { x: [0.8], y: [0.0] } };

// ── 키프레임 헬퍼 ──────────────────────────────────────
const p  = (t, x, y, e = IO) => ({ ...e, t, s: [x, y, 0] });
const sc = (t, sx, sy, e = IO) => ({ ...e, t, s: [sx, sy, 100] });
const r  = (t, deg, e = IO)   => ({ ...e, t, s: [deg] });
const last = (t, v) => ({ t, s: v }); // 마지막 KF (이징 없음)

const staticVal  = (v) => ({ a: 0, k: v });
const anchor     = staticVal([AX, AY, 0]);
const opaque     = staticVal(100);
const noRot      = staticVal(0);
const baseScale  = staticVal([S, S, 100]);
const basePos    = staticVal([CX, CY, 0]);

// ── 애니메이션 함수 ────────────────────────────────────

/** idle: 부드러운 위아래 부유 (루프) */
function floatAnim(ip, op) {
  const mid = ip + Math.round((op - ip) / 2);
  return {
    p: { a: 1, k: [p(ip, CX, CY, IO), p(mid, CX, CY - 7, IO), last(op, [CX, CY, 0])] },
    s: { a: 1, k: [sc(ip, S, S, IO), sc(mid, S * 0.99, S * 1.01, IO), last(op, [S, S, 100])] },
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** greeting: 통통 튀기 (2회 바운스) */
function bounceAnim(ip, op) {
  const d = op - ip;
  return {
    p: { a: 1, k: [
      p(ip,            CX, CY,      OUT),
      p(ip + d * 0.30, CX, CY - 26, IO),
      { ...SPR, t: ip + d * 0.50, s: [CX, CY + 5, 0] },
      p(ip + d * 0.72, CX, CY - 13, IO),
      last(op, [CX, CY, 0]),
    ]},
    s: { a: 1, k: [
      sc(ip,            S,            S,            OUT),
      sc(ip + d * 0.30, S * 0.93,     S * 1.11,     IO),
      sc(ip + d * 0.50, S * 1.10,     S * 0.93,     IO),
      sc(ip + d * 0.72, S * 0.96,     S * 1.07,     IO),
      last(op, [S, S, 100]),
    ]},
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** listening: 좌우 흔들기 */
function swayAnim(ip, op) {
  const d = op - ip;
  const q = Math.round(d / 3);
  return {
    p: { a: 1, k: [
      p(ip,      CX,     CY,     IO),
      p(ip + q,  CX - 6, CY - 3, IO),
      p(ip + q*2,CX + 6, CY - 3, IO),
      last(op, [CX, CY, 0]),
    ]},
    s: baseScale,
    r: { a: 1, k: [r(ip, 0, IO), r(ip + q, -5, IO), r(ip + q*2, 5, IO), last(op, [0])] },
    o: opaque,
    a: anchor,
  };
}

/** react_happy: 두 번 흥분 점프 */
function exciteAnim(ip, op) {
  const d = op - ip;
  return {
    p: { a: 1, k: [
      p(ip,            CX, CY,      OUT),
      p(ip + d * 0.20, CX, CY - 22, IO),
      { ...SPR, t: ip + d * 0.35, s: [CX, CY + 4, 0] },
      p(ip + d * 0.55, CX, CY - 20, IO),
      { ...SPR, t: ip + d * 0.70, s: [CX, CY + 3, 0] },
      last(op, [CX, CY, 0]),
    ]},
    s: { a: 1, k: [
      sc(ip,            S,        S,        OUT),
      sc(ip + d * 0.20, S * 0.94, S * 1.11, IO),
      sc(ip + d * 0.35, S * 1.10, S * 0.93, IO),
      sc(ip + d * 0.55, S * 0.94, S * 1.10, IO),
      sc(ip + d * 0.70, S * 1.09, S * 0.93, IO),
      last(op, [S, S, 100]),
    ]},
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** react_soft: 살짝 내려앉음 */
function sinkAnim(ip, op) {
  const d = op - ip;
  return {
    p: { a: 1, k: [
      p(ip,            CX, CY,     IO),
      p(ip + d * 0.40, CX, CY + 8, IO),
      p(ip + d * 0.70, CX, CY + 5, IO),
      last(op, [CX, CY, 0]),
    ]},
    s: { a: 1, k: [
      sc(ip,            S,        S,        IO),
      sc(ip + d * 0.40, S * 1.04, S * 0.96, IO),
      last(op, [S, S, 100]),
    ]},
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** reward: 큰 점프 */
function jumpAnim(ip, op) {
  const d = op - ip;
  return {
    p: { a: 1, k: [
      p(ip,            CX, CY,      OUT),
      p(ip + d * 0.27, CX, CY - 40, IO),
      { ...SPR, t: ip + d * 0.50, s: [CX, CY + 7, 0] },
      p(ip + d * 0.72, CX, CY - 18, IO),
      last(op, [CX, CY, 0]),
    ]},
    s: { a: 1, k: [
      sc(ip,            S,        S,        OUT),
      sc(ip + d * 0.27, S * 0.91, S * 1.13, IO),
      sc(ip + d * 0.50, S * 1.13, S * 0.90, IO),
      sc(ip + d * 0.72, S * 0.95, S * 1.08, IO),
      last(op, [S, S, 100]),
    ]},
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** sleepy: 천천히 축 늘어짐 */
function droopAnim(ip, op) {
  const mid = ip + Math.round((op - ip) * 0.55);
  return {
    p: { a: 1, k: [p(ip, CX, CY, IO), p(mid, CX, CY + 5, IO), last(op, [CX, CY, 0])] },
    s: { a: 1, k: [sc(ip, S, S, IO), sc(mid, S * 1.02, S * 0.98, IO), last(op, [S, S, 100])] },
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** celebrate: 세 번 점프 */
function celebrateAnim(ip, op) {
  const d = op - ip;
  return {
    p: { a: 1, k: [
      p(ip,             CX, CY,      OUT),
      p(ip + d * 0.16,  CX, CY - 32, IO),
      { ...SPR, t: ip + d * 0.28, s: [CX, CY + 5, 0] },
      p(ip + d * 0.44,  CX, CY - 28, IO),
      { ...SPR, t: ip + d * 0.56, s: [CX, CY + 4, 0] },
      p(ip + d * 0.72,  CX, CY - 22, IO),
      { ...SPR, t: ip + d * 0.83, s: [CX, CY + 3, 0] },
      last(op, [CX, CY, 0]),
    ]},
    s: { a: 1, k: [
      sc(ip,             S,        S,        OUT),
      sc(ip + d * 0.16,  S * 0.92, S * 1.12, IO),
      sc(ip + d * 0.28,  S * 1.11, S * 0.91, IO),
      sc(ip + d * 0.44,  S * 0.92, S * 1.11, IO),
      sc(ip + d * 0.56,  S * 1.10, S * 0.92, IO),
      sc(ip + d * 0.72,  S * 0.93, S * 1.10, IO),
      sc(ip + d * 0.83,  S * 1.08, S * 0.93, IO),
      last(op, [S, S, 100]),
    ]},
    r: noRot,
    o: opaque,
    a: anchor,
  };
}

/** equip: 스케일 팝 + 흔들기 */
function equipAnim(ip, op) {
  const d = op - ip;
  return {
    p: basePos,
    s: { a: 1, k: [
      sc(ip,            S,        S,        IO),
      sc(ip + d * 0.30, S * 1.14, S * 1.14, IO),
      sc(ip + d * 0.55, S * 0.96, S * 0.96, IO),
      sc(ip + d * 0.75, S * 1.04, S * 1.04, IO),
      last(op, [S, S, 100]),
    ]},
    r: { a: 1, k: [r(ip, 0, IO), r(ip + d * 0.2, 18, IO), r(ip + d * 0.4, -12, IO), r(ip + d * 0.65, 6, IO), last(op, [0])] },
    o: opaque,
    a: anchor,
  };
}

// ── 상태 정의 ──────────────────────────────────────────
const STATES = [
  { id: 'idle',         img: 'idle.png',      ip: 0,   op: 90,  fn: floatAnim },
  { id: 'greeting',     img: 'greeting.png',  ip: 90,  op: 150, fn: bounceAnim },
  { id: 'listening',    img: 'listening.png', ip: 150, op: 210, fn: swayAnim },
  { id: 'react_happy',  img: 'happy.png',     ip: 210, op: 270, fn: exciteAnim },
  { id: 'react_soft',   img: 'calm.png',      ip: 270, op: 330, fn: sinkAnim },
  { id: 'reward',       img: 'reward.png',    ip: 330, op: 390, fn: jumpAnim },
  { id: 'sleepy',       img: 'sleepy.png',    ip: 390, op: 450, fn: droopAnim },
  { id: 'celebrate',    img: 'excited.png',   ip: 450, op: 540, fn: celebrateAnim },
  { id: 'equip',        img: 'happy.png',     ip: 540, op: 590, fn: equipAnim },
];

// ── 빌드 ───────────────────────────────────────────────
const assets = STATES.map((s) => ({
  id: `img_${s.id}`,
  u: '/characters/mongi/',
  p: s.img,
  e: 0,
  w: IMG_W,
  h: IMG_H,
}));

const layers = STATES.map((s, i) => {
  const ks = s.fn(s.ip, s.op);
  return {
    ddd: 0,
    ind: i + 1,
    ty: 2,
    nm: s.id,
    refId: `img_${s.id}`,
    sr: 1,
    ks: { o: ks.o, r: ks.r, p: ks.p, a: ks.a, s: ks.s },
    ao: 0,
    ip: s.ip,
    op: s.op,
    st: 0,
    bm: 0,
  };
});

const markers = STATES.map((s) => ({
  tm: s.ip,
  cm: `${s.id}_start`,
  dr: s.op - s.ip,
}));

const lottie = {
  v: '5.12.1',
  fr: FPS,
  ip: 0,
  op: 590,
  w: W,
  h: H,
  nm: 'mongi',
  ddd: 0,
  assets,
  layers,
  markers,
};

const outPath = path.join(__dirname, '../public/lottie/mongi.json');
fs.writeFileSync(outPath, JSON.stringify(lottie));
const kb = Math.round(fs.statSync(outPath).size / 1024);
console.log(`✓ 생성 완료: ${outPath} (${kb}KB)`);
STATES.forEach((s) => console.log(`  ${s.id.padEnd(12)} → frames ${s.ip}-${s.op}  (${s.img})`));
