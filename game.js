import * as THREE from 'three';

// ─── Config ───────────────────────────────────────────────────────────────────
const TILE           = 4;
const WALL_H         = 5;
const PLAYER_SPEED   = 6;
const NPC_SPEED      = 2.8;
const NPC_COUNT      = 5;
const CAM_DIST       = 4.5;
const CAM_MIN_PITCH  = 0.05;
const CAM_MAX_PITCH  = 0.65;
const INTERACT_DIST  = 2.8;
const PANEL_ACTIVATE_TIME = 1.8;
const ENEMY_COUNT    = 2;
const ENEMY_SPEED    = 3.6;
const ENEMY_DMG_CD   = 1.2;
const SPRINT_MULT    = 1.75;
const ENEMY_SIGHT    = 12;
const ENEMY_FORGET   = 22;
const NPC_PANEL_SIGHT = 10;

// ─── Among Us colours ─────────────────────────────────────────────────────────
const AU_COLORS = [
  { name:'Red',     hex:0xc51111 },
  { name:'Blue',    hex:0x132ed2 },
  { name:'Green',   hex:0x117f2d },
  { name:'Purple',  hex:0x6b2fbb },
  { name:'Yellow',  hex:0xc9d42b },
  { name:'Orange',  hex:0xf07d0c },
  { name:'Pink',    hex:0xec54bb },
  { name:'Brown',   hex:0x71491e },
  { name:'Cyan',    hex:0x38fedc },
  { name:'Lime',    hex:0x50ef39 },
  { name:'Maroon',  hex:0x6b2737 },
  { name:'Coral',   hex:0xff8d6b },
  { name:'Black',   hex:0x3f474e },
  { name:'White',   hex:0xd6e0f0 },
  { name:'Teal',    hex:0x00827f },
  { name:'Rose',    hex:0xff63d4 },
  { name:'Banana',  hex:0xffff7a },
  { name:'Olive',   hex:0x847a37 },
];

// ─── Hat definitions ──────────────────────────────────────────────────────────
const HATS = [
  { id:'none',     label:'None',      icon:'🚫' },
  { id:'cap',      label:'Cap',       icon:'🧢' },
  { id:'tophat',   label:'Top Hat',   icon:'🎩' },
  { id:'party',    label:'Party Hat', icon:'🎉' },
  { id:'crown',    label:'Crown',     icon:'👑' },
  { id:'beanie',   label:'Beanie',    icon:'🪖' },
  { id:'hardhat',  label:'Hard Hat',  icon:'⛑️'  },
  { id:'flower',   label:'Flower',    icon:'🌸' },
];

// ─── Maps ─────────────────────────────────────────────────────────────────────
// 0=floor, 1=wall
const MAPS = {
  office: {
    name:'OFFICE', panelCount:6,
    colors:{ floor:0x607d8b, ceiling:0xeceff1, wall:0xb0bec5, trim:0x1565c0, light:0xfff9e7 },
    // 16×12 open-plan office with cubicle bays, a boardroom and corridors
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,1,0,0,1,1,0,1,0,0,1],
      [1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
      [1,1,0,1,1,1,1,0,0,1,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:2, z:2 },
    elevator:{ x:13, z:10 },
  },

  // Polus — modelled on the Among Us Polus map layout
  polus:{
    name:'POLUS', panelCount:8,
    colors:{ floor:0x2d4a5c, ceiling:0x0d1f2d, wall:0x1e3a4a, trim:0x80cbc4, light:0x7ec8e3 },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1],
      [1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:2, z:2 },
    elevator:{ x:25, z:15 },
  },

  caverns:{
    name:'CAVERNS', panelCount:7,
    colors:{ floor:0x2e1503, ceiling:0x0a0a0a, wall:0x3e2003, trim:0xff6f00, light:0xff4500 },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,1,0,1],
      [1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1],
      [1,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1],
      [1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1],
      [1,0,1,0,0,1,1,0,0,0,0,1,1,0,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:1, z:1 },
    elevator:{ x:16, z:12 },
  },

  lab:{
    name:'LAB', panelCount:8,
    colors:{ floor:0xe8f5e9, ceiling:0xffffff, wall:0xb2dfdb, trim:0x00e5ff, light:0xe0f7fa },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,1,0,1,1,1,1,0,1,0,1,0,0,1],
      [1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1],
      [1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1],
      [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
      [1,0,0,1,0,1,0,1,1,1,1,0,1,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:1, z:1 },
    elevator:{ x:16, z:12 },
  },

  ikea:{
    name:'IKEA', panelCount:7,
    colors:{ floor:0xfff9e5, ceiling:0xffeb3b, wall:0x0d47a1, trim:0xfdd835, light:0xfffde7 },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
      [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:1, z:1 },
    elevator:{ x:18, z:13 },
  },

  carpark:{
    name:'CAR PARK', panelCount:6,
    colors:{ floor:0x4a5568, ceiling:0x2d3748, wall:0x5a6a7a, trim:0xffee58, light:0xfff59d },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
      [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
      [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
      [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:1, z:1 },
    elevator:{ x:16, z:12 },
  },
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('canvas');
const overlay       = document.getElementById('overlay');
const playBtn       = document.getElementById('play-btn');
const mapPicker     = document.getElementById('map-picker');
const colorGrid     = document.getElementById('color-grid');
const hatGrid       = document.getElementById('hat-grid');
const floorLabel    = document.getElementById('floor-label');
const panelLabel    = document.getElementById('panel-label');
const panelTrack    = document.getElementById('panel-track');
const interactHint  = document.getElementById('interact-hint');
const crewDotsEl    = document.getElementById('crew-dots');
const messageEl     = document.getElementById('message');
const flashEl       = document.getElementById('flash');
const carryHint     = document.getElementById('carry-hint');
const spSegs        = [0,1,2].map(i => document.getElementById(`sp-${i}`));

// ─── Player choices ───────────────────────────────────────────────────────────
let chosenColor = AU_COLORS[0].hex;
let chosenHat   = 'none';

// ─── Build character creator UI ───────────────────────────────────────────────
AU_COLORS.forEach(c => {
  const sw = document.createElement('div');
  sw.className = 'color-swatch' + (c.hex === chosenColor ? ' active' : '');
  sw.style.background = '#' + c.hex.toString(16).padStart(6,'0');
  sw.title = c.name;
  sw.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    chosenColor = c.hex;
  });
  colorGrid.appendChild(sw);
});

HATS.forEach(h => {
  const btn = document.createElement('div');
  btn.className = 'hat-btn' + (h.id === chosenHat ? ' active' : '');
  btn.innerHTML = `<span class="hat-icon">${h.icon}</span><span>${h.label}</span>`;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.hat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chosenHat = h.id;
  });
  hatGrid.appendChild(btn);
});

// ─── Renderer ─────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = false;

const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.05, 100);
resize();
window.addEventListener('resize', resize);
function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

// ─── State ────────────────────────────────────────────────────────────────────
let scene, mapDef, floorNum = 1;
let player = { pos: new THREE.Vector3(), angle: 0, mesh: null, speed: 0, hp: 3, dead: false, damageCooldown: 0, carrying: null };
let camYaw = Math.PI, camPitch = 0.18;
let firstPerson = false;
let fpPitch = 0;
let walls = [];
let panels = [], panelsActivated = 0;
let elevatorDoor = null, elevatorOpen = false, elevatorFilling = false;
let elevatorPos = new THREE.Vector3();
let elevatorEntryPos = new THREE.Vector3();
let elevatorCell = { r:0, c:0 };
let currentGrid = null;
let elevatorDoorCollider = null;
let npcs = [];
let enemies = [], deadHeads = [];
let keys = {}, locked = false;
let lookTarget = null;
let raf, clock = new THREE.Clock();
let _openCells = null;

// ─── Input ────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyE') interact();
  if (e.code === 'KeyV') togglePOV();
});
document.addEventListener('keyup', e => keys[e.code] = false);

document.addEventListener('mousemove', e => {
  if (!locked) return;
  camYaw -= e.movementX * 0.0015;
  if (firstPerson) {
    fpPitch -= e.movementY * 0.0025;
    fpPitch = Math.max(-1.1, Math.min(1.1, fpPitch));
  } else {
    camPitch -= e.movementY * 0.0025;
    camPitch = Math.max(CAM_MIN_PITCH, Math.min(CAM_MAX_PITCH, camPitch));
  }
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
});
canvas.addEventListener('click', () => { if (!locked) canvas.requestPointerLock(); });

// ─── Start ────────────────────────────────────────────────────────────────────
playBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  startGame(mapPicker.value);
  canvas.requestPointerLock();
});

function startGame(mapKey) {
  if (raf) cancelAnimationFrame(raf);
  floorNum = 1;
  try {
    loadMap(mapKey);
  } catch(e) {
    document.body.innerHTML = `<div style="position:fixed;inset:0;background:#000;color:#f55;padding:24px;font-family:monospace;font-size:13px;white-space:pre-wrap;overflow:auto;z-index:999">CRASH IN loadMap:\n\n${e.message}\n\n${e.stack}</div>`;
  }
}

function loadMap(mapKey) {
  if (scene) scene.clear();
  scene = new THREE.Scene();

  mapDef = MAPS[mapKey];
  _openCells = null;
  currentGrid = null;
  panels = [];
  panelsActivated = 0;
  elevatorOpen = false;
  elevatorFilling = false;
  elevatorDoor = null;
  elevatorDoorCollider = null;
  walls = [];
  npcs = [];
  enemies = [];
  for (const dh of deadHeads) scene.remove(dh.grp);
  deadHeads = [];
  lookTarget = null;

  const bgColor = 0x0d0d14;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, 16, 50);

  buildMap();
  spawnPlayer();
  spawnNPCs();
  spawnEnemies();
  updateHUD();
  updateCrewDots();
  floorLabel.textContent = `FLOOR ${floorNum} — ${mapDef.name}`;

  clock.start();
  loop();
}

// ─── Pick a random wall cell with one open neighbour for the elevator ─────────
function pickElevatorCell(g, rows, cols) {
  const DIRS4 = [[-1,0],[1,0],[0,-1],[0,1]];
  const singles = [];
  for (let r = 1; r < rows-1; r++) {
    for (let c = 1; c < cols-1; c++) {
      if (g[r][c] !== 1) continue;
      const openD = DIRS4.filter(([dr,dc]) => g[r+dr]?.[c+dc] === 0);
      // Only use cells with exactly 1 open neighbour so there's one way in/out
      if (openD.length === 1) {
        const [dr, dc] = openD[0];
        singles.push({ r, c, dr, dc, nx: dc, nz: dr });
      }
    }
  }
  if (singles.length > 0) return singles[Math.floor(Math.random()*singles.length)];
  // Fallback
  const ev = mapDef.elevator;
  return { r: ev.z, c: ev.x, dr: 0, dc: -1, nx: -1, nz: 0 };
}

// ─── Map builder ──────────────────────────────────────────────────────────────
function buildMap() {
  // Work on a grid copy so we can mark the elevator cell as walkable
  const g    = mapDef.grid.map(row => [...row]);
  const rows = g.length, cols = g[0].length;
  const c    = mapDef.colors;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const floorMat = new THREE.MeshLambertMaterial({ color: c.floor });
  const ceilMat  = new THREE.MeshLambertMaterial({ color: c.ceiling });
  const wallMat  = new THREE.MeshLambertMaterial({ color: c.wall });
  const trimMat  = new THREE.MeshLambertMaterial({ color: c.trim, emissive: c.trim, emissiveIntensity: 0.25 });

  const fGeo = new THREE.PlaneGeometry(TILE, TILE);
  const wGeo = new THREE.BoxGeometry(TILE, WALL_H, TILE);
  const cGeo = new THREE.PlaneGeometry(TILE, TILE);

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const wx = col * TILE + TILE/2, wz = r * TILE + TILE/2;
      if (g[r][col] === 0) {
        const floor = new THREE.Mesh(fGeo, floorMat);
        floor.rotation.x = -Math.PI/2;
        floor.position.set(wx, 0, wz);
        floor.receiveShadow = false;
        scene.add(floor);

        const ceil = new THREE.Mesh(cGeo, ceilMat);
        ceil.rotation.x = Math.PI/2;
        ceil.position.set(wx, WALL_H, wz);
        scene.add(ceil);
      } else {
        const wall = new THREE.Mesh(wGeo, wallMat);
        wall.position.set(wx, WALL_H/2, wz);
        wall.castShadow = false;
        wall.receiveShadow = false;
        scene.add(wall);
        walls.push({ minX: wx-TILE/2, maxX: wx+TILE/2, minZ: wz-TILE/2, maxZ: wz+TILE/2 });
      }
    }
  }

  // Ceiling lights
  for (let r = 1; r < rows-1; r += 3) {
    for (let col = 1; col < cols-1; col += 3) {
      if (g[r][col] === 0) {
        const wx = col*TILE+TILE/2, wz = r*TILE+TILE/2;
        const pl = new THREE.PointLight(c.light, 1.4, 14);
        pl.position.set(wx, WALL_H-0.1, wz);
        pl.castShadow = false;
        scene.add(pl);
        const fix = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.07,0.5),
          new THREE.MeshBasicMaterial({ color: c.light }));
        fix.position.set(wx, WALL_H-0.04, wz);
        scene.add(fix);
      }
    }
  }

  // ── Elevator: door inset into a random wall ──────────────────────────────────
  const elev = pickElevatorCell(g, rows, cols);
  const evR = elev.r, evC = elev.c;
  const doorDir = elev; // .dr .dc .nx .nz

  // Mark elevator cell as walkable so BFS can route through it
  g[evR][evC] = 0;
  currentGrid = g;

  const ex = evC*TILE+TILE/2, ez = evR*TILE+TILE/2;
  elevatorPos.set(ex, 0, ez);
  elevatorCell = { r: evR, c: evC };
  elevatorEntryPos.set((evC + doorDir.dc)*TILE + TILE/2, 0, (evR + doorDir.dr)*TILE + TILE/2);

  // Replace wall mesh for this cell with elevator floor + ceiling
  walls = walls.filter(w => !(w.minX < ex+0.1 && w.maxX > ex-0.1 && w.minZ < ez+0.1 && w.maxZ > ez-0.1));
  // Remove the wall mesh from scene (it was already added in main loop as a wall)
  scene.children.filter(o => o.isMesh && Math.abs(o.position.x-ex)<0.1 && Math.abs(o.position.z-ez)<0.1 && Math.abs(o.position.y-WALL_H/2)<0.1)
    .forEach(o => scene.remove(o));

  const evFloor = new THREE.Mesh(new THREE.PlaneGeometry(TILE,TILE), new THREE.MeshLambertMaterial({color:c.trim}));
  evFloor.rotation.x = -Math.PI/2; evFloor.position.set(ex,0,ez); scene.add(evFloor);
  const evCeil  = new THREE.Mesh(new THREE.PlaneGeometry(TILE,TILE), new THREE.MeshLambertMaterial({color:c.ceiling}));
  evCeil.rotation.x = Math.PI/2;   evCeil.position.set(ex,WALL_H,ez); scene.add(evCeil);

  // Thin walls on the 3 sides that face other wall cells (avoids z-fighting; only build if adj is open)
  const doorCands = [{dr:-1,dc:0,nx:0,nz:-1},{dr:1,dc:0,nx:0,nz:1},{dr:0,dc:-1,nx:-1,nz:0},{dr:0,dc:1,nx:1,nz:0}];
  const evWallMat = new THREE.MeshLambertMaterial({color:c.trim});
  for (const d of doorCands) {
    if (d.nx === doorDir.nx && d.nz === doorDir.nz) continue;
    if (g[evR+d.dr]?.[evC+d.dc] === 0) {
      const isX = d.nx !== 0;
      const wp = new THREE.Mesh(new THREE.BoxGeometry(isX?0.15:TILE, WALL_H, isX?TILE:0.15), evWallMat);
      wp.position.set(ex+d.nx*(TILE/2-0.075), WALL_H/2, ez+d.nz*(TILE/2-0.075));
      scene.add(wp);
      walls.push({ minX:wp.position.x-(isX?0.15:TILE)/2, maxX:wp.position.x+(isX?0.15:TILE)/2,
                   minZ:wp.position.z-(isX?TILE:0.15)/2,  maxZ:wp.position.z+(isX?TILE:0.15)/2 });
    }
  }

  // Door mesh — sits at the entrance face, slides up when opened
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const isXDoor = doorDir.nx !== 0;
  elevatorDoor = new THREE.Mesh(
    new THREE.BoxGeometry(isXDoor ? 0.15 : TILE*0.9, WALL_H, isXDoor ? TILE*0.9 : 0.15),
    doorMat
  );
  elevatorDoor.position.set(
    ex + doorDir.nx*(TILE/2 - 0.08),
    WALL_H/2,
    ez + doorDir.nz*(TILE/2 - 0.08)
  );
  elevatorDoor.userData.openY   = WALL_H + WALL_H/2 + 0.5;
  elevatorDoor.userData.closedY = WALL_H/2;
  scene.add(elevatorDoor);

  // Door collider — blocks entrance until opened
  elevatorDoorCollider = {
    minX: elevatorDoor.position.x - (isXDoor ? 0.2 : TILE/2),
    maxX: elevatorDoor.position.x + (isXDoor ? 0.2 : TILE/2),
    minZ: elevatorDoor.position.z - (isXDoor ? TILE/2 : 0.2),
    maxZ: elevatorDoor.position.z + (isXDoor ? TILE/2 : 0.2),
  };
  walls.push(elevatorDoorCollider);

  // Glowing sign above door
  const signMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.08), signMat);
  sign.position.set(
    ex + doorDir.nx*(TILE/2 - 0.05),
    WALL_H - 0.25,
    ez + doorDir.nz*(TILE/2 - 0.05)
  );
  scene.add(sign);

  // Elevator point light
  const evLight = new THREE.PointLight(c.trim, 1.2, 8);
  evLight.position.set(ex, WALL_H-0.3, ez);
  scene.add(evLight);

  // ── Panels ──────────────────────────────────────────────────────────────────
  const sides = findWallSides(g, rows, cols).filter(
    s => Math.hypot(s.wx - elevatorPos.x, s.wz - elevatorPos.z) > TILE
  );
  shuffle(sides);
  sides.slice(0, mapDef.panelCount).forEach(s => addPanel(s, c.trim));
}

function findWallSides(g, rows, cols) {
  const dirs = [
    {dr:-1,dc:0,nx:0,nz:-1},{dr:1,dc:0,nx:0,nz:1},
    {dr:0,dc:-1,nx:-1,nz:0},{dr:0,dc:1,nx:1,nz:0},
  ];
  const out = [];
  for (let r=1; r<rows-1; r++) {
    for (let c=1; c<cols-1; c++) {
      if (g[r][c] !== 0) continue;
      for (const d of dirs) {
        if (g[r+d.dr]?.[c+d.dc] === 1) {
          out.push({ wx: c*TILE+TILE/2, wz: r*TILE+TILE/2, nx: d.nx, nz: d.nz });
        }
      }
    }
  }
  return out;
}

function addPanel(ws, accentColor) {
  const grp = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.75, 0.09),
    new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
  );
  grp.add(base);

  const screenMat = new THREE.MeshBasicMaterial({ color: accentColor });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.07), screenMat);
  screen.position.z = 0.015;
  grp.add(screen);

  const glow = new THREE.PointLight(accentColor, 0.9, 3.5);
  glow.position.z = 0.25;
  grp.add(glow);

  // Buttons row
  for (let i = -1; i <= 1; i++) {
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04,0.04,0.03,8),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );
    btn.rotation.x = Math.PI/2;
    btn.position.set(i*0.1, -0.28, 0.06);
    grp.add(btn);
  }

  const offset = 0.07;
  grp.position.set(
    ws.wx + ws.nx*(TILE/2 - offset),
    1.35,
    ws.wz + ws.nz*(TILE/2 - offset)
  );
  grp.lookAt(ws.wx + ws.nx*100, 1.35, ws.wz + ws.nz*100);

  grp.userData = {
    activated: false,
    screenMat, glow,
    worldPos: new THREE.Vector3(ws.wx, 0, ws.wz),
  };

  scene.add(grp);
  panels.push(grp);
}

// ─── Crewmate mesh ────────────────────────────────────────────────────────────
function makeCrewmate(color, hatId) {
  const g = new THREE.Group();
  const mat  = new THREE.MeshLambertMaterial({ color });
  const dark = new THREE.MeshLambertMaterial({ color: new THREE.Color(color).multiplyScalar(0.5) });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.28,0.72,14), mat);
  body.position.y = 0.36;
  g.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34,14,10), mat);
  head.position.y = 0.78;
  g.add(head);

  // Visor
  const visorMat = new THREE.MeshBasicMaterial({ color:0x88ccff, transparent:true, opacity:0.85 });
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.25,12,8,0.2,2.6,0.4,1.2), visorMat);
  visor.position.set(0, 0.8, 0.18);
  g.add(visor);

  // Backpack
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.38,0.2), mat);
  pack.position.set(0, 0.44, -0.3);
  g.add(pack);

  // Legs
  for (const lx of [-0.13, 0.13]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.09,0.28,8), mat);
    leg.position.set(lx, -0.01, 0);
    g.add(leg);
  }

  // Hat
  const hat = makeHat(hatId, color);
  if (hat) {
    hat.position.set(0, 1.1, 0);
    g.add(hat);
  }

  g.traverse(m => { if (m.isMesh && m !== visor) m.castShadow = false; });
  return g;
}

function makeHat(id, baseColor) {
  if (id === 'none') return null;
  const grp = new THREE.Group();
  const col  = new THREE.Color(baseColor);
  const dark = col.clone().multiplyScalar(0.5);
  const mat  = (c) => new THREE.MeshLambertMaterial({ color: c });

  switch (id) {
    case 'cap': {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.05,14), mat(dark));
      const top  = new THREE.Mesh(new THREE.CylinderGeometry(0.23,0.26,0.2,14), mat(col));
      top.position.y = 0.12;
      brim.position.y = 0.02;
      grp.add(brim,top);
      break;
    }
    case 'tophat': {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.04,14), mat(0x111111));
      const top  = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.42,14), mat(0x111111));
      top.position.y = 0.23;
      grp.add(brim,top);
      break;
    }
    case 'party': {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22,0.5,14), mat(0xff44aa));
      cone.position.y = 0.25;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.22,0.03,8,20), mat(0xffff00));
      band.position.y = 0.02;
      grp.add(cone,band);
      break;
    }
    case 'crown': {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.32,0.12,14), mat(0xffd700));
      base.position.y = 0.06;
      grp.add(base);
      for (let i=0; i<5; i++) {
        const a = (i/5)*Math.PI*2;
        const pt = new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,6), mat(0xffd700));
        pt.position.set(Math.sin(a)*0.22, 0.22, Math.cos(a)*0.22);
        grp.add(pt);
      }
      break;
    }
    case 'beanie': {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.3,14,8,0,Math.PI*2,0,1.1), mat(0xff3333));
      body.position.y = 0.08;
      const pom  = new THREE.Mesh(new THREE.SphereGeometry(0.09,8,8), mat(0xffffff));
      pom.position.y = 0.32;
      grp.add(body,pom);
      break;
    }
    case 'hardhat': {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.32,14,8,0,Math.PI*2,0,0.75), mat(0xffcc00));
      dome.position.y = 0.06;
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,0.05,14), mat(0xffcc00));
      brim.position.y = 0.02;
      grp.add(dome,brim);
      break;
    }
    case 'flower': {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.25,8), mat(0x228B22));
      stem.position.y = 0.12;
      const centre = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), mat(0xffff00));
      centre.position.y = 0.28;
      grp.add(stem,centre);
      for (let i=0; i<6; i++) {
        const a = (i/6)*Math.PI*2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6), mat(0xff69b4));
        petal.position.set(Math.sin(a)*0.18, 0.28, Math.cos(a)*0.18);
        grp.add(petal);
      }
      break;
    }
  }
  return grp;
}

// ─── Spawn player ─────────────────────────────────────────────────────────────
function spawnPlayer() {
  const sp = mapDef.spawn;
  const wx = sp.x*TILE+TILE/2, wz = sp.z*TILE+TILE/2;
  player.pos.set(wx, 0, wz);
  player.angle = 0;
  player.hp = 3; player.stamina = 100; player.dead = false; player.damageCooldown = 0; player.carrying = null;

  if (player.mesh) scene.remove(player.mesh);
  player.mesh = makeCrewmate(chosenColor, chosenHat);
  player.mesh.position.copy(player.pos);
  scene.add(player.mesh);
  updateStaminaHUD();
}

// ─── Spawn NPCs ───────────────────────────────────────────────────────────────
const NPC_COLORS_POOL = AU_COLORS.filter(c => c.hex !== chosenColor).map(c=>c.hex);
const NPC_HATS = ['none','cap','tophat','party','beanie','hardhat','flower'];

function spawnNPCs() {
  const sp = mapDef.spawn;
  const bx = sp.x*TILE+TILE/2, bz = sp.z*TILE+TILE/2;

  for (let i=0; i<NPC_COUNT; i++) {
    const col = NPC_COLORS_POOL[i % NPC_COLORS_POOL.length];
    const hat = NPC_HATS[i % NPC_HATS.length];
    const mesh = makeCrewmate(col, hat);
    const a = (i/NPC_COUNT)*Math.PI*2;
    mesh.position.set(bx+Math.cos(a)*1.6, 0, bz+Math.sin(a)*1.6);
    scene.add(mesh);

    npcs.push({
      mesh, color: col,
      targetPanel: null,
      activateTimer: 0,
      path: [], pathStep: 0,
      wanderTarget: new THREE.Vector3(bx,0,bz),
      wanderTimer: 1 + Math.random()*2,
      elevatorTarget: false,
      hp: 3, dead: false, damageCooldown: 0, carrying: null,
    });
  }
}

// ─── Enemy mesh ───────────────────────────────────────────────────────────────
function makeEnemy() {
  const grp = new THREE.Group();
  const bMat = new THREE.MeshLambertMaterial({ color: 0xbb1100, emissive: 0x440000, emissiveIntensity: 1 });
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffee00 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.4), bMat);
  body.position.y = 0.38; grp.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.44, 0.48), bMat);
  head.position.y = 0.86; grp.add(head);
  [-0.13, 0.13].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 5), eMat);
    eye.position.set(ex, 0.9, 0.23); grp.add(eye);
  });
  [-0.14, 0.14].forEach(lx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.28, 0.19), bMat);
    leg.position.set(lx, 0.04, 0); grp.add(leg);
  });
  [-0.42, 0.42].forEach(ax => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.14), bMat);
    arm.position.set(ax, 0.44, 0); grp.add(arm);
  });
  const glow = new THREE.PointLight(0xff1100, 0.8, 3.5);
  glow.position.y = 0.9; grp.add(glow);
  return grp;
}

// ─── Dead head mesh ───────────────────────────────────────────────────────────
function makeDeadHead(color) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 10), mat);
  const visorMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.85 });
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8, 0.2, 2.6, 0.4, 1.2), visorMat);
  visor.position.set(0, 0.02, 0.18); grp.add(head, visor);
  const glow = new THREE.PointLight(color, 0.4, 2.5); grp.add(glow);
  return grp;
}

// ─── Spawn enemies ────────────────────────────────────────────────────────────
function spawnEnemies() {
  const spX = mapDef.spawn.x*TILE+TILE/2, spZ = mapDef.spawn.z*TILE+TILE/2;
  const pool = getOpenCells().filter(cell =>
    Math.hypot(cell.wx-spX, cell.wz-spZ) > TILE*2 &&
    Math.hypot(cell.wx-elevatorPos.x, cell.wz-elevatorPos.z) > TILE*2
  );
  shuffle(pool);
  for (let i=0; i<Math.min(ENEMY_COUNT, pool.length); i++) {
    const mesh = makeEnemy();
    mesh.position.set(pool[i].wx, 0, pool[i].wz);
    scene.add(mesh);
    enemies.push({ mesh, path:[], pathStep:0, pathTimer:0, damageCooldown:0, alerted:false, wanderTimer:Math.random()*3 });
  }
}

// ─── HP / damage ─────────────────────────────────────────────────────────────
function updateStaminaHUD() {
  // Segments 0..hp-1 are available; within those, sprint level fills from left.
  // States: cyan (sprint available), depleted (sprint empty), lost/red (HP gone).
  const litSprint = Math.ceil(player.stamina / 100 * player.hp);
  spSegs.forEach((s, i) => {
    const hpLost = i >= player.hp;
    s.classList.toggle('lost',     hpLost);
    s.classList.toggle('depleted', !hpLost && i >= litSprint);
  });
}

function damagePlayer() {
  if (player.dead || player.damageCooldown > 0) return;
  player.hp = Math.max(0, player.hp - 1);
  player.damageCooldown = ENEMY_DMG_CD;
  doFlash(0xff1100, 0.45);
  updateStaminaHUD();
  if (player.hp <= 0) killPlayer();
}

function killPlayer() {
  player.dead = true;
  player.mesh.visible = false;
  const grp = makeDeadHead(chosenColor);
  grp.position.set(player.pos.x, 0.34, player.pos.z);
  scene.add(grp);
  deadHeads.push({ grp, source:'player', entity:null, carriedBy:null });
  showMessage('YOU DIED\nGet carried to the elevator', 3500);
}

function damageNPC(npc) {
  if (npc.dead || npc.damageCooldown > 0) return;
  npc.hp = Math.max(0, (npc.hp??3) - 1);
  npc.damageCooldown = ENEMY_DMG_CD;
  if (npc.hp <= 0) killNPC(npc);
}

function killNPC(npc) {
  npc.dead = true;
  npc.mesh.visible = false;
  const grp = makeDeadHead(npc.color);
  grp.position.set(npc.mesh.position.x, 0.34, npc.mesh.position.z);
  scene.add(grp);
  deadHeads.push({ grp, source:'npc', entity:npc, carriedBy:null });
}

function revive(dh) {
  const idx = deadHeads.indexOf(dh);
  if (idx !== -1) deadHeads.splice(idx, 1);
  scene.remove(dh.grp);
  if (dh.source === 'player') {
    player.dead = false; player.hp = 3; player.mesh.visible = true;
    player.pos.set(dh.grp.position.x, 0, dh.grp.position.z);
    player.mesh.position.copy(player.pos);
    updateStaminaHUD();
    showMessage('REVIVED!', 1500);
  } else if (dh.entity) {
    const npc = dh.entity;
    npc.dead = false; npc.hp = 3; npc.mesh.visible = true;
    npc.mesh.position.set(dh.grp.position.x, 0, dh.grp.position.z);
  }
}

// ─── Enemy AI ─────────────────────────────────────────────────────────────────
function updateEnemies(dt) {
  const allCells = getOpenCells();
  const wanderCells = elevatorOpen ? allCells : allCells.filter(
    cell => Math.hypot(cell.wx - elevatorPos.x, cell.wz - elevatorPos.z) > TILE
  );

  for (const en of enemies) {
    en.damageCooldown = Math.max(0, en.damageCooldown - dt);
    const bob = Math.abs(Math.sin(clock.elapsedTime*9 + en.damageCooldown))*0.04;

    // Check if any living target is in sight range
    let sightTarget = null, sightDist = Infinity;
    if (!player.dead) {
      const d = en.mesh.position.distanceTo(player.pos);
      if (d < ENEMY_SIGHT && d < sightDist) { sightDist = d; sightTarget = player; }
    }
    for (const npc of npcs) {
      if (npc.dead) continue;
      const d = en.mesh.position.distanceTo(npc.mesh.position);
      if (d < ENEMY_SIGHT && d < sightDist) { sightDist = d; sightTarget = npc; }
    }

    if (sightTarget) {
      en.alerted = true;
      en.alertTarget = sightTarget;
    }

    if (!en.alerted) {
      // Wander
      en.wanderTimer -= dt;
      if ((en.wanderTimer <= 0 || en.path.length === 0) && wanderCells.length > 0) {
        const cell = wanderCells[Math.floor(Math.random()*wanderCells.length)];
        npcComputePath(en, cell.wx, cell.wz);
        en.wanderTimer = 3 + Math.random()*4;
      }
      npcFollowPath(en, dt, bob, ENEMY_SPEED);
      continue;
    }

    // Chasing
    const tgt = en.alertTarget;
    const tpos = tgt === player ? player.pos : tgt.mesh.position;

    if (!tgt || tgt.dead || en.mesh.position.distanceTo(tpos) > ENEMY_FORGET) {
      en.alerted = false;
      en.alertTarget = null;
      en.path = [];
      continue;
    }

    en.pathTimer -= dt;
    if (en.pathTimer <= 0 || en.path.length === 0) {
      npcComputePath(en, tpos.x, tpos.z);
      en.pathTimer = 0.9 + Math.random()*0.4;
    }
    npcFollowPath(en, dt, bob, ENEMY_SPEED);

    // deal damage on contact
    if (en.damageCooldown <= 0) {
      if (!player.dead && en.mesh.position.distanceTo(player.pos) < 0.75) {
        damagePlayer(); en.damageCooldown = ENEMY_DMG_CD;
      } else {
        for (const npc of npcs) {
          if (!npc.dead && en.mesh.position.distanceTo(npc.mesh.position) < 0.75) {
            damageNPC(npc); en.damageCooldown = ENEMY_DMG_CD; break;
          }
        }
      }
    }
  }
}

// ─── Collision ────────────────────────────────────────────────────────────────
const PR = 0.35;
function blocked(x, z, r) {
  return walls.some(w =>
    x+r > w.minX && x-r < w.maxX &&
    z+r > w.minZ && z-r < w.maxZ
  );
}

// ─── Player update ────────────────────────────────────────────────────────────
function updatePlayer(dt) {
  player.damageCooldown = Math.max(0, player.damageCooldown - dt);

  const fwd = new THREE.Vector3( Math.sin(camYaw), 0,  Math.cos(camYaw));
  const rgt = new THREE.Vector3(-Math.cos(camYaw), 0,  Math.sin(camYaw));
  const move = new THREE.Vector3();

  if (!player.dead) {
    if (keys['KeyW']||keys['ArrowUp'])    move.add(fwd);
    if (keys['KeyS']||keys['ArrowDown'])  move.sub(fwd);
    if (keys['KeyA']||keys['ArrowLeft'])  move.sub(rgt);
    if (keys['KeyD']||keys['ArrowRight']) move.add(rgt);
  }

  const wantSprint = (keys['ShiftLeft']||keys['ShiftRight']) && !player.dead;
  const sprinting = wantSprint && player.stamina > 0;
  if (sprinting) {
    player.stamina = Math.max(0, player.stamina - 40 * dt);
  } else {
    player.stamina = Math.min(100, player.stamina + 20 * dt);
  }
  updateStaminaHUD();
  const spd = sprinting ? PLAYER_SPEED * SPRINT_MULT : PLAYER_SPEED;

  if (move.lengthSq() > 0) {
    move.normalize();
    player.angle = Math.atan2(move.x, move.z);
    player.speed = spd;
    const nx = player.pos.x + move.x * spd * dt;
    const nz = player.pos.z + move.z * spd * dt;
    if (!blocked(nx, player.pos.z, PR)) player.pos.x = nx;
    if (!blocked(player.pos.x, nz, PR)) player.pos.z = nz;
  } else {
    player.speed = 0;
  }

  // Update carried head position
  if (player.carrying) {
    player.carrying.grp.position.set(player.pos.x, 1.7, player.pos.z);
    carryHint.style.display = 'block';
  } else {
    carryHint.style.display = 'none';
  }

  player.mesh.position.copy(player.pos);
  player.mesh.rotation.y = player.angle;

  // Walk bob
  if (player.speed > 0) {
    player.mesh.position.y = Math.abs(Math.sin(clock.elapsedTime * 7)) * 0.06;
  }

  // Camera
  if (firstPerson) {
    if (player.mesh) player.mesh.visible = false;
    const eyeY = player.pos.y + 1.55;
    camera.position.set(player.pos.x, eyeY, player.pos.z);
    // Use lookAt so rotation is always correct regardless of camYaw value
    const lookTarget3D = new THREE.Vector3(
      player.pos.x + Math.sin(camYaw),
      eyeY + Math.sin(fpPitch),
      player.pos.z + Math.cos(camYaw)
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(lookTarget3D);
  } else {
    if (player.mesh) player.mesh.visible = true;
    // Walk camera back from player, collide with walls
    let safeDist = 0.5;
    for (let d = 0.5; d <= CAM_DIST; d += 0.25) {
      const tx = player.pos.x - Math.sin(camYaw) * d * Math.cos(camPitch);
      const tz = player.pos.z - Math.cos(camYaw) * d * Math.cos(camPitch);
      if (blocked(tx, tz, 0.15)) break;
      safeDist = d;
    }
    const camX = player.pos.x - Math.sin(camYaw) * safeDist * Math.cos(camPitch);
    const camZ = player.pos.z - Math.cos(camYaw) * safeDist * Math.cos(camPitch);
    const camY = Math.min(player.pos.y + 0.9 + Math.sin(camPitch) * safeDist, WALL_H - 0.4);
    camera.position.set(camX, camY, camZ);
    camera.rotation.order = 'XYZ';
    camera.lookAt(player.pos.x, player.pos.y + 0.9, player.pos.z);
  }
}

// ─── BFS pathfinding ──────────────────────────────────────────────────────────
function aStar(grid, sr, sc, gr, gc) {
  const rows = grid.length, cols = grid[0].length;
  if (grid[sr]?.[sc] !== 0 || grid[gr]?.[gc] !== 0) return null;
  if (sr === gr && sc === gc) return [];
  const K = (r,c) => r * cols + c;
  const visited = new Uint8Array(rows * cols);
  const par = new Int32Array(rows * cols).fill(-1);
  const queue = [sr, sc];
  visited[K(sr,sc)] = 1;
  const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];
  let head = 0;
  while (head < queue.length) {
    const r = queue[head++], c = queue[head++];
    if (r === gr && c === gc) {
      const path = [];
      let kr = r, kc = c;
      while (kr !== sr || kc !== sc) {
        path.unshift({ x: kc*TILE+TILE/2, z: kr*TILE+TILE/2 });
        const p = par[K(kr,kc)];
        kr = Math.floor(p / cols);
        kc = p % cols;
      }
      return path;
    }
    for (const [dr,dc] of DIRS) {
      const nr=r+dr, nc=c+dc;
      if (nr<0||nr>=rows||nc<0||nc>=cols||grid[nr][nc]!==0||visited[K(nr,nc)]) continue;
      visited[K(nr,nc)] = 1;
      par[K(nr,nc)] = K(r,c);
      queue.push(nr, nc);
    }
  }
  return null;
}

function worldToCell(x, z) {
  return { r: Math.floor(z/TILE), c: Math.floor(x/TILE) };
}

function npcComputePath(npc, destX, destZ) {
  const from = worldToCell(npc.mesh.position.x, npc.mesh.position.z);
  const to   = worldToCell(destX, destZ);
  // Block elevator cell in pathfinding while door is closed
  let grid = currentGrid;
  if (!elevatorOpen && grid) {
    grid = currentGrid.map(r => [...r]);
    grid[elevatorCell.r][elevatorCell.c] = 1;
  }
  const path = aStar(grid, from.r, from.c, to.r, to.c);
  npc.path = path || [];
  npc.pathStep = 0;
}

// ─── NPC update ───────────────────────────────────────────────────────────────
function updateNPCs(dt) {
  const allCells = getOpenCells();
  const cells = elevatorOpen ? allCells : allCells.filter(
    cell => Math.hypot(cell.wx - elevatorPos.x, cell.wz - elevatorPos.z) > TILE
  );

  for (let i=0; i<npcs.length; i++) {
    const npc = npcs[i];
    npc.damageCooldown = Math.max(0, (npc.damageCooldown||0) - dt);

    if (npc.dead) continue;

    const bob = Math.abs(Math.sin(clock.elapsedTime*6 + i*1.3)) * 0.05;

    // Update carried head
    if (npc.carrying) {
      npc.carrying.grp.position.set(npc.mesh.position.x, 1.7, npc.mesh.position.z);
    }

    // ── Activating panel ──
    if (npc.activateTimer > 0) {
      npc.activateTimer -= dt;
      if (npc.activateTimer <= 0 && npc.targetPanel && !npc.targetPanel.userData.activated) {
        activatePanel(npc.targetPanel);
        npc.targetPanel = null;
        npc.path = [];
      }
      continue;
    }

    // ── Inside elevator — stay put ──
    if (elevatorOpen && isInElevator(npc.mesh.position)) {
      npc.mesh.position.y = bob;
      continue;
    }

    // ── Go to elevator ──
    if (elevatorOpen && elevatorFilling) {
      if (!npc.path || npc.path.length === 0 || npc.elevatorTarget !== true) {
        npcComputePath(npc, elevatorEntryPos.x, elevatorEntryPos.z);
        npc.elevatorTarget = true;
      }
      npcFollowPath(npc, dt, bob);
      continue;
    }
    npc.elevatorTarget = false;

    // ── Pick up nearby dead head when elevator is open ──
    if (elevatorOpen && !npc.carrying) {
      const nearHead = deadHeads.find(dh => !dh.carriedBy &&
        Math.hypot(npc.mesh.position.x-dh.grp.position.x, npc.mesh.position.z-dh.grp.position.z) < 1.5);
      if (nearHead) { nearHead.carriedBy = 'npc'; npc.carrying = nearHead; }
    }

    // ── Seek panel ──
    if (!npc.carrying && (!npc.targetPanel || npc.targetPanel.userData.activated)) {
      npc.targetPanel = null;
      // Only target a panel if it's within detection range (wander-until-detect)
      const nearPanel = findPanelInRange(npc.mesh.position, NPC_PANEL_SIGHT);
      if (nearPanel) {
        npc.targetPanel = nearPanel;
        const wp = nearPanel.userData.worldPos;
        npcComputePath(npc, wp.x, wp.z);
      }
    }

    if (npc.targetPanel) {
      const wp = npc.targetPanel.userData.worldPos;
      const dist = Math.hypot(npc.mesh.position.x - wp.x, npc.mesh.position.z - wp.z);
      if (dist < 1.5) {
        npc.activateTimer = PANEL_ACTIVATE_TIME;
        npc.path = [];
        continue;
      }
      npcFollowPath(npc, dt, bob);
    } else {
      // Wander
      npc.wanderTimer = (npc.wanderTimer||0) - dt;
      if (npc.wanderTimer <= 0 && cells.length > 0) {
        const cell = cells[Math.floor(Math.random()*cells.length)];
        npcComputePath(npc, cell.wx, cell.wz);
        npc.wanderTimer = 3 + Math.random()*4;
      }
      npcFollowPath(npc, dt, bob);
    }
  }
}

function npcFollowPath(npc, dt, bob, speed = NPC_SPEED) {
  if (!npc.path || npc.path.length === 0) return;
  if (npc.pathStep >= npc.path.length) { npc.path = []; return; }

  const wp = npc.path[npc.pathStep];
  const dx = wp.x - npc.mesh.position.x;
  const dz = wp.z - npc.mesh.position.z;
  const dist = Math.hypot(dx, dz);

  if (dist < 0.35) { npc.pathStep++; return; }

  const nx = npc.mesh.position.x + (dx/dist)*speed*dt;
  const nz = npc.mesh.position.z + (dz/dist)*speed*dt;
  if (!blocked(nx, npc.mesh.position.z, 0.28)) npc.mesh.position.x = nx;
  if (!blocked(npc.mesh.position.x, nz, 0.28)) npc.mesh.position.z = nz;
  npc.mesh.rotation.y = Math.atan2(dx, dz);
  npc.mesh.position.y = bob;
}

function findNearestPanel(pos) {
  let best=null, bestDist=Infinity;
  for (const p of panels) {
    if (p.userData.activated) continue;
    const d = Math.hypot(pos.x-p.userData.worldPos.x, pos.z-p.userData.worldPos.z);
    if (d<bestDist) { bestDist=d; best=p; }
  }
  return best;
}

function findPanelInRange(pos, range) {
  let best=null, bestDist=Infinity;
  for (const p of panels) {
    if (p.userData.activated) continue;
    const d = Math.hypot(pos.x-p.userData.worldPos.x, pos.z-p.userData.worldPos.z);
    if (d < range && d < bestDist) { bestDist=d; best=p; }
  }
  return best;
}

function isInElevator(pos) {
  // Accept elevator cell OR the entry cell just outside the door
  return (Math.abs(pos.x-elevatorPos.x) < TILE/2+0.3 &&
          Math.abs(pos.z-elevatorPos.z) < TILE/2+0.3) ||
         (Math.abs(pos.x-elevatorEntryPos.x) < TILE/2-0.1 &&
          Math.abs(pos.z-elevatorEntryPos.z) < TILE/2-0.1);
}

function getOpenCells() {
  if (_openCells) return _openCells;
  const g = currentGrid || mapDef.grid, out = [];
  for (let r=0; r<g.length; r++)
    for (let c=0; c<g[0].length; c++)
      if (g[r][c] === 0) out.push({ wx: c*TILE+TILE/2, wz: r*TILE+TILE/2 });
  _openCells = out;
  return out;
}

// ─── Raycasting / look target ─────────────────────────────────────────────────
const ray = new THREE.Raycaster();
const centre = new THREE.Vector2(0, 0);

function checkLookTarget() {
  ray.setFromCamera(centre, camera);
  const panelObjs = panels.flatMap(p => p.children.filter(c=>c.isMesh));
  const hit = ray.intersectObjects(panelObjs);
  if (hit.length) {
    const p = panels.find(p => p.children.includes(hit[0].object));
    if (p && !p.userData.activated) {
      const playerDist = player.pos.distanceTo(p.userData.worldPos);
      if (playerDist < INTERACT_DIST) {
        lookTarget = { type:'panel', obj:p };
        interactHint.textContent = '[E] Activate Panel';
        interactHint.style.display = 'block';
        return;
      }
    }
  }
  // Check dead heads
  for (const dh of deadHeads) {
    if (dh.carriedBy) continue;
    if (player.pos.distanceTo(dh.grp.position) < INTERACT_DIST) {
      lookTarget = { type:'head', head:dh };
      interactHint.textContent = '[E] Pick up';
      interactHint.style.display = 'block';
      return;
    }
  }

  if (elevatorOpen && isInElevator(player.pos)) {
    interactHint.textContent = 'Waiting for crew...';
    interactHint.style.display = 'block';
    return;
  }
  lookTarget = null;
  interactHint.style.display = 'none';
}

// ─── Interact ─────────────────────────────────────────────────────────────────
function interact() {
  if (!lookTarget) return;
  if (lookTarget.type === 'panel') {
    activatePanel(lookTarget.obj);
  } else if (lookTarget.type === 'head' && !player.carrying) {
    player.carrying = lookTarget.head;
    lookTarget.head.carriedBy = 'player';
  }
}

function activatePanel(panel) {
  if (panel.userData.activated) return;
  panel.userData.activated = true;
  panelsActivated++;
  panel.userData.screenMat.color.setHex(0x00ff66);
  panel.userData.glow.color.setHex(0x00ff66);
  panel.userData.glow.intensity = 1.5;
  doFlash(0x00ff66, 0.25);
  updateHUD();
  if (panelsActivated >= mapDef.panelCount) openElevator();
}

function openElevator() {
  elevatorOpen = true;
  elevatorFilling = true;
  // Remove door collider so entities can walk through
  if (elevatorDoorCollider) walls = walls.filter(w => w !== elevatorDoorCollider);
  showMessage('ALL PANELS ACTIVATED!\nGET TO THE ELEVATOR!', 2800);
  doFlash(0x00ffcc, 0.6);
  animateDoor();
}

function animateDoor() {
  const door = elevatorDoor;
  const target = door.userData.openY;
  function step() {
    door.position.y += 0.1;
    if (door.position.y < target) requestAnimationFrame(step);
    else door.position.y = target;
  }
  step();
}

function nextFloor() {
  elevatorFilling = false;
  floorNum++;
  doFlash(0xffffff, 0.9);
  const mapKeys = Object.keys(MAPS);
  const next = mapKeys[floorNum % mapKeys.length];
  setTimeout(() => {
    showMessage(`FLOOR ${floorNum}`, 1500);
    loadMap(next);
  }, 600);
}

function checkElevatorFill() {
  if (!elevatorOpen || !elevatorFilling) return;

  // Revive any carried heads inside elevator
  if (player.carrying && isInElevator(player.pos)) {
    revive(player.carrying); player.carrying = null;
  }
  for (const npc of npcs) {
    if (npc.carrying && isInElevator(npc.mesh.position)) {
      revive(npc.carrying); npc.carrying = null;
    }
  }

  // Dead entities don't block advancement
  const playerReady = player.dead || isInElevator(player.pos);
  if (!playerReady) return;
  const allNpcsReady = npcs.every(n => n.dead || isInElevator(n.mesh.position));
  if (allNpcsReady) nextFloor();
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  panelLabel.textContent = `PANELS: ${panelsActivated} / ${mapDef.panelCount}`;
  panelLabel.style.color  = panelsActivated >= mapDef.panelCount ? '#00ff66' : '#fff';
  panelTrack.innerHTML = '';
  for (let i=0; i<mapDef.panelCount; i++) {
    const pip = document.createElement('div');
    pip.className = 'panel-pip' + (i < panelsActivated ? ' done' : '');
    panelTrack.appendChild(pip);
  }
}

function updateCrewDots() {
  crewDotsEl.innerHTML = '';
  for (const npc of npcs) {
    const d = document.createElement('div');
    d.className = 'crew-dot';
    d.style.background = '#' + npc.color.toString(16).padStart(6,'0');
    crewDotsEl.appendChild(d);
  }
}

function showMessage(text, dur) {
  messageEl.innerHTML = text.replace('\n','<br>');
  messageEl.style.display = 'block';
  setTimeout(() => messageEl.style.display = 'none', dur);
}

function doFlash(color, strength) {
  flashEl.style.background = '#' + color.toString(16).padStart(6,'0');
  flashEl.style.opacity = strength;
  setTimeout(() => flashEl.style.opacity = 0, 350);
}

// ─── POV toggle ───────────────────────────────────────────────────────────────
function togglePOV() {
  firstPerson = !firstPerson;
  if (firstPerson) fpPitch = 0;
  else if (player.mesh) player.mesh.visible = true;
  showMessage(firstPerson ? 'FIRST PERSON' : 'THIRD PERSON', 900);
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
function loop() {
  raf = requestAnimationFrame(loop);
  try {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (locked) {
      updatePlayer(dt);
      checkLookTarget();
    }
    updateNPCs(dt);
    updateEnemies(dt);
    checkElevatorFill();
    renderer.render(scene, camera);
  } catch(e) {
    console.error('Loop error:', e);
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function shuffle(a) {
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
