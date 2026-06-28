import * as THREE from 'three';

// ─── Constants ───────────────────────────────────────────────────────────────
const PLAYER_HEIGHT = 1.7;
const PLAYER_SPEED  = 5;
const GRAVITY       = 20;
const TILE          = 4;       // world units per grid cell
const NPC_COUNT     = 5;
const NPC_SPEED     = 2.2;
const PANEL_INTERACT_DIST = 2.5;
const ELEVATOR_INTERACT_DIST = 2.5;

// ─── Crew colours ─────────────────────────────────────────────────────────────
const CREW_COLORS = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6,
                     0x1abc9c, 0xe67e22, 0xec407a, 0x00bcd4];

// ─── Map definitions ──────────────────────────────────────────────────────────
// Each map: { name, theme, grid, panelCount, spawn, elevatorCell }
// Grid: 2D array, 0=floor, 1=wall, 2=window wall (still solid), S=spawn area

const MAPS = {
  office: {
    name: 'OFFICE',
    floor: 0x607d8b, ceiling: 0xeceff1, wall: 0xb0bec5,
    accent: 0x1565c0, light: 0xfff9c4,
    panelCount: 3,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 2, z: 2 },
    elevator: { x: 9, z: 8 },
  },
  polus: {
    name: 'POLUS',
    floor: 0x455a64, ceiling: 0x1a237e, wall: 0x37474f,
    accent: 0x80cbc4, light: 0xa5d6a7,
    panelCount: 4,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,1,0,1,1,1,0,1,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 2, z: 2 },
    elevator: { x: 11, z: 9 },
  },
  caverns: {
    name: 'CAVERNS',
    floor: 0x3e2723, ceiling: 0x1a1a1a, wall: 0x4e342e,
    accent: 0xff7043, light: 0xff6f00,
    panelCount: 4,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,1],
      [1,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 1, z: 1 },
    elevator: { x: 10, z: 8 },
  },
  lab: {
    name: 'LAB',
    floor: 0xe0f2f1, ceiling: 0xffffff, wall: 0xb2dfdb,
    accent: 0x00e5ff, light: 0xe0f7fa,
    panelCount: 5,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,1,1,0,0,1],
      [1,0,0,1,1,0,0,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,1,1,0,0,1],
      [1,0,0,1,1,0,0,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 1, z: 1 },
    elevator: { x: 12, z: 10 },
  },
  ikea: {
    name: 'IKEA',
    floor: 0xfff8e1, ceiling: 0xffeb3b, wall: 0x0d47a1,
    accent: 0xfdd835, light: 0xfffde7,
    panelCount: 4,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1],
      [1,0,0,0,1,1,1,0,1,1,0,0,0,0,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,1,0,0,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 1, z: 1 },
    elevator: { x: 14, z: 12 },
  },
  carpark: {
    name: 'CAR PARK',
    floor: 0x546e7a, ceiling: 0x37474f, wall: 0x607d8b,
    accent: 0xffee58, light: 0xfff59d,
    panelCount: 3,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,0,1,1,1,0,0,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,0,0,1,1,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,0,1,1,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn: { x: 1, z: 1 },
    elevator: { x: 12, z: 9 },
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
let scene, renderer, camera;
let mapDef, floorNum = 1;
let panels = [], panelsActivated = 0;
let elevatorOpen = false, elevatorDoor = null;
let npcs = [];
let walls = [];            // AABB collision boxes {minX,maxX,minZ,maxZ}
let keys = {};
let velocity = new THREE.Vector3();
let yaw = 0, pitch = 0;
let locked = false;
let lookTarget = null;     // panel/elevator being looked at
let frameId;
let clock = new THREE.Clock();
let ambientLight, pointLights = [];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('canvas');
const overlay       = document.getElementById('overlay');
const startBtn      = document.getElementById('start-btn');
const mapPicker     = document.getElementById('map-picker');
const panelStatus   = document.getElementById('panel-status');
const interactHint  = document.getElementById('interact-hint');
const floorInfo     = document.getElementById('floor-info');
const elevatorFlash = document.getElementById('elevator-flash');
const messageEl     = document.getElementById('message');
const crewDotsEl    = document.getElementById('crew-dots');

// ─── Init renderer ────────────────────────────────────────────────────────────
renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
resize();

window.addEventListener('resize', resize);
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  loadMap(mapPicker.value);
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', e => {
  if (!locked) return;
  yaw   -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
});

document.addEventListener('keydown', e => { keys[e.code] = true; });
document.addEventListener('keyup',   e => { keys[e.code] = false; });

document.addEventListener('keydown', e => {
  if (e.code === 'KeyE') interact();
});

canvas.addEventListener('click', () => {
  if (!locked) canvas.requestPointerLock();
});

// ─── Load map ─────────────────────────────────────────────────────────────────
function loadMap(mapKey) {
  if (scene) { renderer.renderLists.dispose(); scene.clear(); }
  cancelAnimationFrame(frameId);

  mapDef = MAPS[mapKey];
  panelsActivated = 0;
  elevatorOpen = false;
  elevatorDoor = null;
  panels = [];
  npcs = [];
  walls = [];
  pointLights = [];
  lookTarget = null;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  scene.fog = new THREE.Fog(0x111111, 8, 30);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 60);

  buildSceneFromGrid();
  buildNPCs();
  updateHUD();
  updateCrewDots();

  floorInfo.textContent = `FLOOR ${floorNum} — ${mapDef.name}`;

  clock.start();
  loop();
}

// ─── Build scene from grid ────────────────────────────────────────────────────
function buildSceneFromGrid() {
  const grid = mapDef.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // Ambient
  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const floorMat   = new THREE.MeshLambertMaterial({ color: mapDef.floor });
  const ceilMat    = new THREE.MeshLambertMaterial({ color: mapDef.ceiling });
  const wallMat    = new THREE.MeshLambertMaterial({ color: mapDef.wall });

  const floorGeo  = new THREE.PlaneGeometry(TILE, TILE);
  const ceilGeo   = new THREE.PlaneGeometry(TILE, TILE);

  // Collect open floor cells for panel placement
  const openCells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = c * TILE + TILE / 2;
      const wz = r * TILE + TILE / 2;

      if (grid[r][c] === 0) {
        // Floor tile
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(wx, 0, wz);
        floor.receiveShadow = true;
        scene.add(floor);

        // Ceiling tile
        const ceil = new THREE.Mesh(ceilGeo, ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(wx, 3, wz);
        scene.add(ceil);

        openCells.push({ r, c, wx, wz });
      } else {
        // Wall block
        const wallGeo = new THREE.BoxGeometry(TILE, 3, TILE);
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(wx, 1.5, wz);
        wall.castShadow = true;
        wall.receiveShadow = true;
        scene.add(wall);

        walls.push({
          minX: wx - TILE / 2, maxX: wx + TILE / 2,
          minZ: wz - TILE / 2, maxZ: wz + TILE / 2,
        });
      }
    }
  }

  // Ceiling lights every few cells
  for (let r = 1; r < rows - 1; r += 3) {
    for (let c = 1; c < cols - 1; c += 3) {
      if (grid[r][c] === 0) {
        const wx = c * TILE + TILE / 2;
        const wz = r * TILE + TILE / 2;
        const pl = new THREE.PointLight(mapDef.light, 1.2, 12);
        pl.position.set(wx, 2.8, wz);
        pl.castShadow = true;
        scene.add(pl);
        pointLights.push(pl);

        // Light fixture mesh
        const fixtureGeo = new THREE.BoxGeometry(0.6, 0.08, 0.6);
        const fixtureMat = new THREE.MeshBasicMaterial({ color: mapDef.light });
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.set(wx, 2.96, wz);
        scene.add(fixture);
      }
    }
  }

  // ── Elevator ──────────────────────────────────────────────────────────────
  const ec = mapDef.elevator;
  const ex = (ec.x) * TILE + TILE / 2;
  const ez = (ec.z) * TILE + TILE / 2;

  // Elevator shaft (glowing surround)
  const shaftGeo = new THREE.BoxGeometry(TILE - 0.1, 3, TILE - 0.1);
  const shaftMat = new THREE.MeshLambertMaterial({ color: mapDef.accent, emissive: mapDef.accent, emissiveIntensity: 0.1 });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.position.set(ex, 1.5, ez);
  scene.add(shaft);

  // Elevator door (slides up when open)
  const doorGeo = new THREE.BoxGeometry(TILE * 0.7, 2.8, 0.15);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x888888, emissive: 0x444444, emissiveIntensity: 0.3 });
  elevatorDoor = new THREE.Mesh(doorGeo, doorMat);
  // Place door on the side facing player spawn
  const spawnWx = mapDef.spawn.x * TILE + TILE / 2;
  const spawnWz = mapDef.spawn.z * TILE + TILE / 2;
  const dx = ex - spawnWx, dz = ez - spawnWz;
  let doorX = ex, doorZ = ez;
  if (Math.abs(dx) > Math.abs(dz)) {
    doorX = ex - Math.sign(dx) * (TILE / 2 - 0.08);
  } else {
    doorZ = ez - Math.sign(dz) * (TILE / 2 - 0.08);
  }
  elevatorDoor.position.set(doorX, 1.4, doorZ);
  elevatorDoor.userData.closedY = 1.4;
  elevatorDoor.userData.openY   = 4.5;
  scene.add(elevatorDoor);

  // "UP" arrow above elevator
  addElevatorSign(ex, ez);

  // Remove elevator cell from walls (it's open space)
  walls = walls.filter(w => !(w.minX < ex && w.maxX > ex && w.minZ < ez && w.maxZ > ez));

  // ── Panels ────────────────────────────────────────────────────────────────
  // Find wall-adjacent open cells for panel placement on walls
  const wallSides = findWallSides(grid, rows, cols);
  shuffle(wallSides);
  const chosen = wallSides.slice(0, mapDef.panelCount);

  chosen.forEach((ws, i) => {
    addPanel(ws, mapDef.accent);
  });

  // ── Player spawn ──────────────────────────────────────────────────────────
  camera.position.set(spawnWx, PLAYER_HEIGHT, spawnWz);
  yaw = 0; pitch = 0;
}

function findWallSides(grid, rows, cols) {
  const sides = [];
  const dirs = [
    { dr: -1, dc: 0, nx: 0, nz: -1 },
    { dr:  1, dc: 0, nx: 0, nz:  1 },
    { dr:  0, dc:-1, nx:-1, nz:  0 },
    { dr:  0, dc: 1, nx:  1, nz:  0 },
  ];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (grid[r][c] !== 0) continue;
      const wx = c * TILE + TILE / 2;
      const wz = r * TILE + TILE / 2;
      for (const d of dirs) {
        const nr = r + d.dr, nc = c + d.dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] === 1) {
          sides.push({ wx, wz, nx: d.nx, nz: d.nz });
        }
      }
    }
  }
  return sides;
}

function addPanel(ws, color) {
  const panelGroup = new THREE.Group();

  // Panel base
  const baseGeo = new THREE.BoxGeometry(0.5, 0.7, 0.08);
  const baseMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  panelGroup.add(base);

  // Screen
  const screenGeo = new THREE.BoxGeometry(0.38, 0.5, 0.06);
  const screenMat = new THREE.MeshBasicMaterial({ color: color });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.02;
  panelGroup.add(screen);

  // Glow light
  const glow = new THREE.PointLight(color, 0.8, 3);
  glow.position.z = 0.2;
  panelGroup.add(glow);

  // Position on wall
  const offset = 0.06;
  panelGroup.position.set(
    ws.wx + ws.nx * (TILE / 2 - offset),
    1.3,
    ws.wz + ws.nz * (TILE / 2 - offset)
  );
  panelGroup.lookAt(
    ws.wx + ws.nx * 10,
    1.3,
    ws.wz + ws.nz * 10
  );

  panelGroup.userData.activated = false;
  panelGroup.userData.wx = ws.wx;
  panelGroup.userData.wz = ws.wz;
  panelGroup.userData.glow = glow;
  panelGroup.userData.screen = screen;
  panelGroup.userData.screenMat = screenMat;

  scene.add(panelGroup);
  panels.push(panelGroup);
}

function addElevatorSign(ex, ez) {
  // Simple glowing box above elevator
  const signGeo = new THREE.BoxGeometry(0.8, 0.4, 0.1);
  const signMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(ex, 2.8, ez);
  scene.add(sign);
}

// ─── Among Us NPC ─────────────────────────────────────────────────────────────
function makeCrewmate(color) {
  const g = new THREE.Group();

  // Body (rounded cylinder approximation)
  const bodyGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.7, 12);
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.35;
  g.add(body);

  // Head dome
  const headGeo = new THREE.SphereGeometry(0.32, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.y = 0.72;
  g.add(head);

  // Visor
  const visorGeo = new THREE.SphereGeometry(0.22, 12, 8, -0.3, Math.PI * 0.8, 0.3, Math.PI * 0.45);
  const visorMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.85 });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.y = 0.72;
  visor.position.z = 0.12;
  g.add(visor);

  // Backpack
  const packGeo = new THREE.BoxGeometry(0.2, 0.35, 0.18);
  const pack = new THREE.Mesh(packGeo, bodyMat);
  pack.position.set(0, 0.42, -0.28);
  g.add(pack);

  // Legs (two small cylinders)
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 8);
  for (const lx of [-0.12, 0.12]) {
    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.position.set(lx, 0.0, 0);
    g.add(leg);
  }

  g.traverse(m => { if (m.isMesh) { m.castShadow = true; } });
  return g;
}

function buildNPCs() {
  const spawnWx = mapDef.spawn.x * TILE + TILE / 2;
  const spawnWz = mapDef.spawn.z * TILE + TILE / 2;

  for (let i = 0; i < NPC_COUNT; i++) {
    const color = CREW_COLORS[i % CREW_COLORS.length];
    const mesh = makeCrewmate(color);

    const angle = (i / NPC_COUNT) * Math.PI * 2;
    const r = 1.5;
    mesh.position.set(spawnWx + Math.cos(angle) * r, 0, spawnWz + Math.sin(angle) * r);

    scene.add(mesh);

    npcs.push({
      mesh,
      color,
      vel: new THREE.Vector3(),
      target: new THREE.Vector3(spawnWx, 0, spawnWz),
      idleTimer: Math.random() * 3,
      state: 'wander',
    });
  }
}

// ─── Interaction ──────────────────────────────────────────────────────────────
function interact() {
  if (lookTarget && lookTarget.type === 'panel') {
    activatePanel(lookTarget.obj);
  } else if (lookTarget && lookTarget.type === 'elevator' && elevatorOpen) {
    nextFloor();
  }
}

function activatePanel(panel) {
  if (panel.userData.activated) return;
  panel.userData.activated = true;
  panelsActivated++;

  // Turn screen green
  panel.userData.screenMat.color.setHex(0x00ff66);
  panel.userData.glow.color.setHex(0x00ff66);

  // Flash
  flash(0x00ff66, 0.3);

  updateHUD();

  if (panelsActivated >= mapDef.panelCount) {
    openElevator();
  }
}

function openElevator() {
  elevatorOpen = true;
  showMessage('ALL PANELS ACTIVATED!\nFIND THE ELEVATOR!', 2500);
  flash(0x00ffcc, 0.5);

  // Animate door open
  animateDoor();
}

function animateDoor() {
  const door = elevatorDoor;
  const targetY = door.userData.openY;
  const speed = 2;
  function step() {
    door.position.y += speed * 0.016;
    if (door.position.y < targetY) requestAnimationFrame(step);
    else door.position.y = targetY;
  }
  step();
}

function nextFloor() {
  floorNum++;
  flash(0xffffff, 0.8);
  setTimeout(() => {
    // Reload same map (or cycle) for next floor
    const mapKeys = Object.keys(MAPS);
    const nextKey = mapKeys[floorNum % mapKeys.length];
    showMessage(`FLOOR ${floorNum}`, 1500);
    setTimeout(() => loadMap(nextKey), 800);
  }, 400);
}

// ─── Raycasting for look-target ───────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const center    = new THREE.Vector2(0, 0);

function checkLookTarget() {
  raycaster.setFromCamera(center, camera);

  // Check panels
  const panelMeshes = panels.flatMap(p => p.children.filter(c => c.isMesh));
  const panelHit = raycaster.intersectObjects(panelMeshes, false);

  if (panelHit.length > 0 && panelHit[0].distance < PANEL_INTERACT_DIST) {
    const hitPanel = panels.find(p => p.children.includes(panelHit[0].object));
    if (hitPanel && !hitPanel.userData.activated) {
      lookTarget = { type: 'panel', obj: hitPanel };
      interactHint.style.display = 'block';
      interactHint.textContent = '[E] Activate Panel';
      return;
    }
  }

  // Check elevator
  if (elevatorOpen && elevatorDoor) {
    const elevHit = raycaster.intersectObject(elevatorDoor);
    const ex = mapDef.elevator.x * TILE + TILE / 2;
    const ez = mapDef.elevator.z * TILE + TILE / 2;
    const dist = camera.position.distanceTo(new THREE.Vector3(ex, PLAYER_HEIGHT, ez));
    if (dist < ELEVATOR_INTERACT_DIST) {
      lookTarget = { type: 'elevator' };
      interactHint.style.display = 'block';
      interactHint.textContent = '[E] Enter Elevator';
      return;
    }
  }

  lookTarget = null;
  interactHint.style.display = 'none';
}

// ─── NPC AI ───────────────────────────────────────────────────────────────────
function updateNPCs(dt) {
  const openCells = getOpenCells();

  npcs.forEach(npc => {
    npc.idleTimer -= dt;

    if (npc.idleTimer <= 0) {
      // Pick new wander target
      if (Math.random() < 0.3) {
        // Follow player loosely
        const spread = 2;
        npc.target.set(
          camera.position.x + (Math.random() - 0.5) * spread,
          0,
          camera.position.z + (Math.random() - 0.5) * spread
        );
      } else if (openCells.length > 0) {
        const cell = openCells[Math.floor(Math.random() * openCells.length)];
        npc.target.set(cell.wx, 0, cell.wz);
      }
      npc.idleTimer = 1 + Math.random() * 3;
    }

    // Move toward target
    const dir = new THREE.Vector3().subVectors(npc.target, npc.mesh.position);
    dir.y = 0;
    const dist = dir.length();
    if (dist > 0.3) {
      dir.normalize();
      const newPos = npc.mesh.position.clone().addScaledVector(dir, NPC_SPEED * dt);
      if (!collidesWithWalls(newPos.x, newPos.z, 0.3)) {
        npc.mesh.position.copy(newPos);
        npc.mesh.rotation.y = Math.atan2(dir.x, dir.z);
      } else {
        npc.idleTimer = 0; // pick new target next frame
      }
    }

    // Bobbing walk animation
    npc.mesh.position.y = Math.abs(Math.sin(clock.elapsedTime * 4 + npcs.indexOf(npc))) * 0.05;
  });
}

let _openCellsCache = null;
function getOpenCells() {
  if (_openCellsCache) return _openCellsCache;
  const grid = mapDef.grid;
  const cells = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 0) {
        cells.push({ wx: c * TILE + TILE / 2, wz: r * TILE + TILE / 2 });
      }
    }
  }
  _openCellsCache = cells;
  return cells;
}

// ─── Collision ────────────────────────────────────────────────────────────────
const PLAYER_RADIUS = 0.35;

function collidesWithWalls(x, z, radius) {
  return walls.some(w =>
    x + radius > w.minX && x - radius < w.maxX &&
    z + radius > w.minZ && z - radius < w.maxZ
  );
}

// ─── Movement ─────────────────────────────────────────────────────────────────
function updatePlayer(dt) {
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));

  const move = new THREE.Vector3();
  if (keys['KeyW'] || keys['ArrowUp'])    move.add(forward);
  if (keys['KeyS'] || keys['ArrowDown'])  move.sub(forward);
  if (keys['KeyA'] || keys['ArrowLeft'])  move.sub(right);
  if (keys['KeyD'] || keys['ArrowRight']) move.add(right);

  if (move.lengthSq() > 0) move.normalize();

  const speed = PLAYER_SPEED * dt;

  // Slide along walls
  const nx = camera.position.x + move.x * speed;
  const nz = camera.position.z + move.z * speed;

  if (!collidesWithWalls(nx, camera.position.z, PLAYER_RADIUS)) {
    camera.position.x = nx;
  }
  if (!collidesWithWalls(camera.position.x, nz, PLAYER_RADIUS)) {
    camera.position.z = nz;
  }

  camera.position.y = PLAYER_HEIGHT;

  // Apply yaw/pitch to camera
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  panelStatus.textContent = `PANELS: ${panelsActivated} / ${mapDef.panelCount}`;
  const ratio = panelsActivated / mapDef.panelCount;
  panelStatus.style.color = ratio === 1 ? '#00ff66' : '#fff';
}

function updateCrewDots() {
  crewDotsEl.innerHTML = '';
  npcs.forEach((npc, i) => {
    const dot = document.createElement('span');
    dot.className = 'crew-dot';
    dot.style.background = '#' + npc.color.toString(16).padStart(6, '0');
    crewDotsEl.appendChild(dot);
  });
}

function showMessage(text, duration) {
  messageEl.innerHTML = text.replace('\n', '<br>');
  messageEl.style.display = 'block';
  setTimeout(() => messageEl.style.display = 'none', duration);
}

function flash(color, intensity) {
  const hex = '#' + color.toString(16).padStart(6, '0');
  elevatorFlash.style.background = hex;
  elevatorFlash.style.opacity = intensity;
  setTimeout(() => elevatorFlash.style.opacity = 0, 300);
}

// ─── Main loop ────────────────────────────────────────────────────────────────
function loop() {
  frameId = requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (locked) {
    updatePlayer(dt);
    checkLookTarget();
  }

  updateNPCs(dt);

  renderer.render(scene, camera);
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
