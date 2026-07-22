import * as THREE from 'three';

// ─── Config ───────────────────────────────────────────────────────────────────
const TILE           = 4;
const WALL_H         = 5;
const PLAYER_SPEED   = 2.8;
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
const MUMMY_SPEED    = 2.0;
const MUMMY_DMG_CD   = 2.5;
const MUMMY_SIGHT    = 14;
const MUMMY_FORGET   = 30;
const TRAP_DMG_CD    = 3.0;
const LADDER_CD      = 2.0;

// ─── PVP constants ────────────────────────────────────────────────────────────
const PVP_AI_SPEED     = 3.4;
const PVP_BULLET_SPEED = 20;
const PVP_PISTOL_AMMO  = 8;
const PVP_SHOOT_CD     = 1.0;
const PVP_MELEE_RANGE  = 1.7;
const PVP_MELEE_CD     = 0.75;
const PVP_PISTOL_RANGE = 15;

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
  { name:'Army',    hex:0x6b8c00 },
];

// ─── Mouth definitions ────────────────────────────────────────────────────────
const MOUTHS = [
  { id:'none',   label:'None',   icon:'🚫' },
  { id:'zigzag', label:'Zigzag', icon:'〰️' },
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

  pyramid:{
    name:'PYRAMID', panelCount:18,
    enemyCount:1, mummyCount:4,
    colors:{ floor:0xc8a96e, ceiling:0x6b4c2a, wall:0xd4b483, trim:0xffd700, light:0xffcc55 },
    grid:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    spawn:{ x:15, z:29 },
    elevator:{ x:13, z:8 },
    ladders:[
      { from:{r:14,c:6},  to:{r:7,c:9}  },
      { from:{r:14,c:25}, to:{r:7,c:22} },
      { from:{r:21,c:15}, to:{r:12,c:15} },
    ],
    traps:[
      {r:9,c:15},{r:10,c:8},{r:10,c:23},
      {r:17,c:10},{r:17,c:21},{r:20,c:16},
      {r:25,c:15},{r:13,c:15},{r:15,c:15},{r:22,c:9},
    ],
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

// ─── Polus map (generated) ────────────────────────────────────────────────────
{
  const R=36,C=54;
  const g=Array.from({length:R},()=>new Array(C).fill(1));
  const o=(r1,c1,r2,c2)=>{for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)g[r][c]=0;};

  // Dropship (top centre)
  o(1,20,8,32);
  // Dropship south corridor → Storage
  o(8,23,13,29);
  // Dropship west arm → Electrical area
  o(5,12,8,20);
  // West arm north spur → Electrical top
  o(8,9,12,12);
  // Dropship east arm → Lab area
  o(5,32,9,41);
  // East arm → Lab connector
  o(9,41,12,46);

  // Security (far left)
  o(12,1,18,6);
  // Security–Electrical connector
  o(14,6,16,7);
  // Electrical
  o(11,7,18,14);
  // Electrical → Storage corridor
  o(14,14,16,21);

  // O2 Upper (adjacent below Security, naturally connected)
  o(19,1,24,6);
  // O2 Upper → Communications connector
  o(21,6,22,12);
  // O2 Upper–Lower connector
  o(24,2,26,5);
  // O2 Lower
  o(25,1,30,6);
  // O2 Lower → Boiler connector
  o(30,2,32,5);
  // Boiler Room
  o(31,1,35,6);

  // Communications
  o(19,12,26,20);
  // Communications → Storage connector
  o(20,20,22,22);
  // Communications → Weapons corridor
  o(26,14,29,17);
  // Weapons
  o(29,10,35,21);

  // Storage (centre, above Office)
  o(13,21,19,31);
  // Office Left (blue carpet)
  o(19,21,28,30);
  // Office Right (tan)
  o(19,30,28,37);
  // Office Right → Specimen Room corridor
  o(22,37,24,47);

  // Admin (below Office)
  o(28,21,34,33);
  // Admin → Decontamination bottom
  o(32,30,35,35);

  // Laboratory West
  o(11,38,20,45);
  // Laboratory East
  o(8,45,20,52);
  // Decontamination East (right side of Lab East)
  o(13,52,20,53);

  // Laboratory → Specimen Room corridor
  o(20,46,23,52);
  // Specimen Room (far right)
  o(23,47,33,53);

  MAPS.polus2={
    name:'POLUS', panelCount:14,
    colors:{floor:0x3d4f60,ceiling:0x0d1520,wall:0x253545,trim:0x80cbc4,light:0x88c8e8},
    grid:g, spawn:{x:26,z:4}, elevator:{x:26,z:31},
  };
}

// ─── Polus vent network ───────────────────────────────────────────────────────
// Each vent: grid col/row, display label, network id, linked vent ids
const POLUS_VENTS = [
  { id:'dropship',   col:26, row:4,  label:'Dropship',      net:0, links:['storage']             },
  { id:'storage',    col:26, row:16, label:'Storage',        net:0, links:['dropship']            },
  { id:'security',   col:3,  row:15, label:'Security',       net:1, links:['o2upper','o2lower']   },
  { id:'o2upper',    col:3,  row:21, label:'O2',             net:1, links:['security','o2lower']  },
  { id:'o2lower',    col:3,  row:27, label:'O2 (Lower)',     net:1, links:['security','o2upper']  },
  { id:'electrical', col:10, row:14, label:'Electrical',     net:2, links:['labwest']             },
  { id:'labwest',    col:41, row:15, label:'Laboratory',     net:2, links:['electrical']          },
  { id:'comms',      col:16, row:22, label:'Communications', net:3, links:['weapons']             },
  { id:'weapons',    col:15, row:32, label:'Weapons',        net:3, links:['comms']               },
  { id:'office',     col:25, row:23, label:'Office',         net:4, links:['admin']               },
  { id:'admin',      col:27, row:31, label:'Admin',          net:4, links:['office']              },
  { id:'specimen',   col:50, row:28, label:'Specimen Room',  net:5, links:['labeast']             },
  { id:'labeast',    col:48, row:14, label:'Laboratory',     net:5, links:['specimen']            },
];

function makeVentMesh(def) {
  const grp = new THREE.Group();
  const grateMat = new THREE.MeshLambertMaterial({ color:0x1a2530 });
  const slatMat  = new THREE.MeshLambertMaterial({ color:0x2e4050 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 1.0), grateMat);
  base.position.y = 0.03;
  grp.add(base);
  for (let i = 0; i < 5; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.07), slatMat);
    slat.position.set(0, 0.06, -0.35 + i * 0.175);
    grp.add(slat);
  }
  const wx = def.col * TILE + TILE / 2;
  const wz = def.row * TILE + TILE / 2;
  grp.position.set(wx, 0, wz);
  grp.userData = { type:'vent', def, worldPos: new THREE.Vector3(wx, 0, wz) };
  scene.add(grp);
  return grp;
}

function spawnVents() {
  vents = POLUS_VENTS.map(def => makeVentMesh(def));
}

function openVentUI(def) {
  if (ventSelection) return;
  if (!def.links.length) return;
  ventSelection = { def, options: def.links, idx: 0 };
  renderVentUI();
  document.getElementById('vent-ui').style.display = 'flex';
}

function renderVentUI() {
  const el = document.getElementById('vent-options');
  el.innerHTML = '';
  ventSelection.options.forEach((id, i) => {
    const d = POLUS_VENTS.find(v => v.id === id);
    const div = document.createElement('div');
    div.className = 'vent-opt' + (i === ventSelection.idx ? ' vent-opt-active' : '');
    div.textContent = d ? d.label : id;
    el.appendChild(div);
  });
}

function closeVentUI() {
  ventSelection = null;
  document.getElementById('vent-ui').style.display = 'none';
}

function ventTravel(targetId) {
  const def = POLUS_VENTS.find(v => v.id === targetId);
  if (!def) return;
  player.pos.set(def.col * TILE + TILE / 2, 0, def.row * TILE + TILE / 2);
  closeVentUI();
}

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
const pvpWeaponEl   = document.getElementById('pvp-weapon');
const pvpTeamsEl    = document.getElementById('pvp-teams');

// ─── Player choices ───────────────────────────────────────────────────────────
let chosenColor  = AU_COLORS[0].hex;
let chosenHat    = 'none';
let chosenMouth  = 'none';

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

const mouthGrid = document.getElementById('mouth-grid');
MOUTHS.forEach(m => {
  const btn = document.createElement('div');
  btn.className = 'hat-btn' + (m.id === chosenMouth ? ' active' : '');
  btn.innerHTML = `<span class="hat-icon">${m.icon}</span><span>${m.label}</span>`;
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mouth-grid .hat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chosenMouth = m.id;
  });
  mouthGrid.appendChild(btn);
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
let scene, mapDef, currentMapKey, floorNum = 1;
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
let mummies = [], ladderPairs = [], trapCells = [];
let keys = {}, locked = false;
let lookTarget = null;
let raf, clock = new THREE.Clock();
let _openCells = null;

// ─── PVP state ────────────────────────────────────────────────────────────────
let pvpMode = false;
let pvpBlue = [], pvpRed = [];
let wPickups = [], bullets = [];
let pvpOver = false;

// ─── Sus (Among Us) state ─────────────────────────────────────────────────────
const SUS_NPC_COUNT     = 14;
const SUS_IMP_COUNT     = 3;
const SUS_KILL_RANGE    = 1.8;
const SUS_KILL_CD       = 25;
const SUS_IMP_KILL_CD   = 20;
const SUS_WITNESS_RANGE = 6;
let susMode      = false;
let playerIsImp  = false;
let susOver      = false;
let susKillCd    = 0;
let susSabotage  = null;
let susMeeting   = null; // { phase:'voting'|'results', timer, votes:{}, playerVoted, entities[], ejected }
let vents        = [];   // vent mesh objects
let ventSelection = null; // { def, options:[id,...], idx } when vent UI is open

// ─── Infection state ──────────────────────────────────────────────────────────
const INFECT_RANGE      = 1.1;
const INFECT_NPC_SPEED  = NPC_SPEED;
let infectionMode      = false;
let playerInfected     = false;
let footprints         = []; // { mesh, life } green trail marks left by infected
let puddles            = []; // permanent green puddles at infection sites (cleared on map change)
let playerInfectLockout = 0;
let activeMinigame     = null;
let infectionOver      = false;

// ─── Input ────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  keys[e.code] = true;

  // Vent UI navigation intercepts everything else
  if (ventSelection) {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      const dir = e.code === 'ArrowDown' ? 1 : -1;
      ventSelection.idx = (ventSelection.idx + dir + ventSelection.options.length) % ventSelection.options.length;
      renderVentUI();
    }
    if (e.code === 'KeyE') ventTravel(ventSelection.options[ventSelection.idx]);
    if (e.code === 'Escape') closeVentUI();
    return;
  }

  if (e.code === 'KeyE') { if (activeMinigame) handleMinigameKey('KeyE'); else interact(); }
  if (e.code === 'KeyV') togglePOV();
  if (e.code === 'Escape' && activeMinigame) cancelMinigame();
  if (activeMinigame && (activeMinigame.type === 'sequence' || activeMinigame.type === 'calibrate') &&
      ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))
    handleMinigameKey(e.code);
  if (e.code === 'KeyK' && susMode && playerIsImp && locked) susPlayerKill();
  if (e.code === 'Tab'  && susMode && playerIsImp && locked) { e.preventDefault(); susTriggerSabotage(); }
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
canvas.addEventListener('click', () => { if (!locked && !susMeeting) canvas.requestPointerLock(); });
canvas.addEventListener('mousedown', e => { if (e.button === 0 && locked && pvpMode) pvpPlayerAttack(); });

// ─── Start ────────────────────────────────────────────────────────────────────
let infectNpcCount   = 5;
let infectStartCount = 1;
let infectShowAnims  = true;

document.querySelectorAll('input[name="gamemode"]').forEach(r => {
  r.addEventListener('change', () => {
    const s = document.getElementById('infect-settings');
    if (s) s.style.display = r.value === 'infection' && r.checked ? 'flex' : (s.style.display === 'flex' && r.checked ? 'none' : s.style.display);
  });
});
// Re-evaluate on any change
document.querySelectorAll('input[name="gamemode"]').forEach(r => {
  r.addEventListener('change', () => {
    const checked = document.querySelector('input[name="gamemode"]:checked')?.value;
    const s = document.getElementById('infect-settings');
    if (s) s.style.display = checked === 'infection' ? 'flex' : 'none';
  });
});

playBtn.addEventListener('click', () => {
  const mode = document.querySelector('input[name="gamemode"]:checked')?.value || 'normal';
  pvpMode        = mode === 'pvp';
  infectionMode  = mode === 'infection';
  susMode        = mode === 'sus';
  if (infectionMode) {
    infectNpcCount   = Math.max(1, parseInt(document.getElementById('npc-count-input')?.value) || 5);
    infectStartCount = Math.max(1, parseInt(document.getElementById('infect-start-input')?.value) || 1);
    infectShowAnims  = document.getElementById('infect-anim-checkbox')?.checked ?? true;
  }
  overlay.style.display = 'none';
  startGame(susMode ? 'polus2' : mapPicker.value);
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

function scaleMapDef(def, f) {
  const og = def.grid;
  const oRows = og.length, oCols = og[0].length;
  const ng = [];
  for (let r = 0; r < oRows; r++) {
    for (let bi = 0; bi < f; bi++) {
      const row = [];
      for (let c = 0; c < oCols; c++)
        for (let bj = 0; bj < f; bj++) row.push(og[r][c]);
      ng.push(row);
    }
  }
  const mid = Math.floor(f / 2);
  const scalePos = p => p ? { x: p.x * f + mid, z: p.z * f + mid } : p;
  const scaleRC  = p => p ? { r: p.r * f + mid, c: p.c * f + mid } : p;
  return {
    ...def,
    grid: ng,
    spawn:    scalePos(def.spawn),
    elevator: scalePos(def.elevator),
    ladders:  def.ladders ? def.ladders.map(l => ({ from: scaleRC(l.from), to: scaleRC(l.to) })) : undefined,
    traps:    def.traps   ? def.traps.map(t => scaleRC(t)) : undefined,
  };
}

function loadMap(mapKey) {
  if (scene) scene.clear();
  scene = new THREE.Scene();

  mapDef = MAPS[mapKey];
  currentMapKey = mapKey;
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
  mummies = []; ladderPairs = []; trapCells = [];
  for (const dh of deadHeads) scene.remove(dh.grp);
  deadHeads = [];
  for (const fp of footprints) scene.remove(fp.mesh);
  footprints = [];
  for (const m of puddles) scene.remove(m);
  puddles = [];
  lookTarget = null;

  const bgColor = 0x0d0d14;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, 16, 50);

  pvpBlue = []; pvpRed = []; wPickups = []; bullets = []; pvpOver = false;
  playerInfected = false; playerInfectLockout = 0; activeMinigame = null; infectionOver = false;
  susOver = false; susKillCd = 0; susSabotage = null; playerIsImp = false; susMeeting = null;
  vents = []; ventSelection = null;
  buildMap();
  spawnPlayer();
  if (pvpMode) {
    initPVP();
  } else if (susMode) {
    spawnNPCs();
    spawnVents();
    initSus();
    updateHUD();
    updateCrewDots();
  } else if (infectionMode) {
    spawnNPCs();
    initInfection();
    updateHUD();
    updateCrewDots();
  } else {
    spawnNPCs();
    spawnEnemies();
    spawnMummies();
    updateHUD();
    updateCrewDots();
  }
  document.getElementById('panel-bar').style.display   = pvpMode  ? 'none' : '';
  document.getElementById('pvp-hud').style.display     = pvpMode  ? 'flex' : 'none';
  document.getElementById('infect-hud').style.display  = infectionMode ? 'flex' : 'none';
  document.getElementById('sus-hud').style.display     = susMode  ? 'flex' : 'none';
  document.getElementById('minigame-ui').style.display = 'none';
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

  // Ceiling lights — step and range scale with map size so light count stays ~constant
  const lightStep = infectionMode ? 15 : 3;
  const lightDist = infectionMode ? 70 : 14;
  for (let r = 1; r < rows-1; r += lightStep) {
    for (let col = 1; col < cols-1; col += lightStep) {
      if (g[r][col] === 0) {
        const wx = col*TILE+TILE/2, wz = r*TILE+TILE/2;
        const pl = new THREE.PointLight(c.light, 1.4, lightDist);
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
  if (!pvpMode) sides.slice(0, mapDef.panelCount).forEach(s => addPanel(s, c.trim));

  // ── Ladders ──────────────────────────────────────────────────────────────────
  ladderPairs = [];
  if (mapDef.ladders) {
    for (const lad of mapDef.ladders) {
      const fp = new THREE.Vector3(lad.from.c*TILE+TILE/2, 0, lad.from.r*TILE+TILE/2);
      const tp = new THREE.Vector3(lad.to.c*TILE+TILE/2, 0, lad.to.r*TILE+TILE/2);
      buildLadderMesh(fp.x, fp.z); buildLadderMesh(tp.x, tp.z);
      ladderPairs.push({ fromPos:fp, toPos:tp, cooldown:0 });
    }
  }

  // ── Spike traps ───────────────────────────────────────────────────────────────
  trapCells = [];
  if (mapDef.traps) {
    for (const t of mapDef.traps) {
      const pos = new THREE.Vector3(t.c*TILE+TILE/2, 0, t.r*TILE+TILE/2);
      buildTrapMesh(pos.x, pos.z);
      trapCells.push({ pos, cooldown:0 });
    }
  }
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
function makeMouth(id) {
  if (id === 'none') return null;
  const grp = new THREE.Group();
  if (id === 'zigzag') {
    const mat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const n = 10, spanX = 0.026, spanY = 0.022;
    const segLen = Math.sqrt(spanX * spanX + spanY * spanY);
    const angle  = Math.atan2(spanY, spanX);
    const startX = -(n * spanX) / 2;
    for (let i = 0; i < n; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(segLen, 0.018, 0.018), mat);
      // All centers at same y so segments meet flush at their endpoints
      seg.position.set(startX + (i + 0.5) * spanX, 0.645, 0.315);
      // i=0 goes down-right (starts high), i=1 goes up-right, alternating
      seg.rotation.z = i % 2 === 0 ? -angle : angle;
      grp.add(seg);
    }
  }
  return grp;
}

function makeCrewmate(color, hatId, mouthId = chosenMouth) {
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
  if (hat) { hat.position.set(0, 1.1, 0); g.add(hat); }

  // Mouth cosmetic
  const mouth = makeMouth(mouthId);
  if (mouth) g.add(mouth);

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
  player.hp = 3; player.stamina = 100; player.dead = false; player.damageCooldown = 0; player.carrying = null; player.weapon = null;

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

  const npcSpawnCount = susMode ? SUS_NPC_COUNT : (infectionMode ? infectNpcCount : NPC_COUNT);
  for (let i=0; i<npcSpawnCount; i++) {
    const col = NPC_COLORS_POOL[i % NPC_COLORS_POOL.length];
    const hat = NPC_HATS[i % NPC_HATS.length];
    const mesh = makeCrewmate(col, hat, 'none');
    const a = (i/npcSpawnCount)*Math.PI*2;
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
  const eCount = mapDef.enemyCount ?? ENEMY_COUNT;
  for (let i=0; i<Math.min(eCount, pool.length); i++) {
    const mesh = makeEnemy();
    mesh.position.set(pool[i].wx, 0, pool[i].wz);
    scene.add(mesh);
    enemies.push({ mesh, path:[], pathStep:0, pathTimer:0, damageCooldown:0, alerted:false, wanderTimer:Math.random()*3 });
  }
}

// ─── HP / damage ─────────────────────────────────────────────────────────────
function updateStaminaHUD() {
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

// ─── Ladder mesh ─────────────────────────────────────────────────────────────
function buildLadderMesh(wx, wz) {
  const woodMat = new THREE.MeshLambertMaterial({ color:0x8B4513 });
  const darkMat = new THREE.MeshLambertMaterial({ color:0x5C2A0A });
  for (const ox of [-0.25, 0.25]) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,WALL_H,6), woodMat);
    rail.position.set(wx+ox, WALL_H/2, wz); scene.add(rail);
  }
  for (let y = 0.4; y < WALL_H-0.1; y += 0.55) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.5,6), darkMat);
    rung.rotation.z = Math.PI/2; rung.position.set(wx, y, wz); scene.add(rung);
  }
  const marker = new THREE.Mesh(new THREE.CircleGeometry(0.55,10),
    new THREE.MeshBasicMaterial({color:0xffdd00, side:THREE.DoubleSide}));
  marker.rotation.x = -Math.PI/2; marker.position.set(wx, 0.02, wz); scene.add(marker);
}

// ─── Trap mesh ────────────────────────────────────────────────────────────────
function buildTrapMesh(wx, wz) {
  const plateMat = new THREE.MeshLambertMaterial({ color:0x444444 });
  const spikeMat = new THREE.MeshLambertMaterial({ color:0xbbbbbb });
  const plate = new THREE.Mesh(new THREE.BoxGeometry(TILE*0.7,0.06,TILE*0.7), plateMat);
  plate.position.set(wx, 0.03, wz); scene.add(plate);
  for (let sx=-1; sx<=1; sx++) for (let sz=-1; sz<=1; sz++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07,0.42,4), spikeMat);
    spike.position.set(wx+sx*0.55, 0.24, wz+sz*0.55); scene.add(spike);
  }
  const warn = new THREE.Mesh(new THREE.RingGeometry(TILE*0.34,TILE*0.39,12),
    new THREE.MeshBasicMaterial({color:0xff2200, side:THREE.DoubleSide}));
  warn.rotation.x = -Math.PI/2; warn.position.set(wx, 0.04, wz); scene.add(warn);
}

// ─── Mummy mesh ───────────────────────────────────────────────────────────────
function buildMummyMesh() {
  const grp    = new THREE.Group();
  const skin   = new THREE.MeshLambertMaterial({ color:0xd4b896 });
  const wrap   = new THREE.MeshLambertMaterial({ color:0xa08060 });
  const eyeMat = new THREE.MeshBasicMaterial({ color:0xff2200 });
  // body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.32,1.0,8), skin);
  body.position.y = 0.5; grp.add(body);
  // bandage strips
  for (let y = 0.15; y < 1.05; y += 0.28) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.31,0.045,4,10), wrap);
    band.rotation.x = Math.PI/2; band.position.y = y; grp.add(band);
  }
  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6), skin);
  head.position.y = 1.22; grp.add(head);
  const headWrap = new THREE.Mesh(new THREE.SphereGeometry(0.24,8,4), wrap);
  headWrap.scale.y = 0.5; headWrap.position.y = 1.22; grp.add(headWrap);
  // eyes
  for (const ox of [-0.08, 0.08]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04,6,4), eyeMat);
    eye.position.set(ox, 1.26, -0.17); grp.add(eye);
  }
  const glow = new THREE.PointLight(0xff1100, 0.6, 3.0);
  glow.position.y = 1.1; grp.add(glow);
  return grp;
}

// ─── Spawn mummies ────────────────────────────────────────────────────────────
function spawnMummies() {
  const count = mapDef.mummyCount || 0;
  if (!count) return;
  const spX = mapDef.spawn.x*TILE+TILE/2, spZ = mapDef.spawn.z*TILE+TILE/2;
  const pool = getOpenCells().filter(c =>
    Math.hypot(c.wx-spX,c.wz-spZ) > TILE*3 &&
    Math.hypot(c.wx-elevatorPos.x,c.wz-elevatorPos.z) > TILE*2
  );
  shuffle(pool);
  for (let i=0; i<Math.min(count,pool.length); i++) {
    const mesh = buildMummyMesh();
    mesh.position.set(pool[i].wx, 0, pool[i].wz); scene.add(mesh);
    mummies.push({ mesh, path:[], pathStep:0, pathTimer:0, damageCooldown:0,
                   alerted:false, wanderTimer:Math.random()*4, alertTarget:null });
  }
}

// ─── Mummy AI ─────────────────────────────────────────────────────────────────
function updateMummies(dt) {
  const allCells = getOpenCells();
  for (const mu of mummies) {
    mu.damageCooldown = Math.max(0, mu.damageCooldown - dt);
    const bob = Math.abs(Math.sin(clock.elapsedTime*4 + mu.damageCooldown))*0.03;

    let sightTarget=null, sightDist=Infinity;
    if (!player.dead) {
      const d = mu.mesh.position.distanceTo(player.pos);
      if (d < MUMMY_SIGHT && d < sightDist) { sightDist=d; sightTarget=player; }
    }
    for (const npc of npcs) {
      if (npc.dead) continue;
      const d = mu.mesh.position.distanceTo(npc.mesh.position);
      if (d < MUMMY_SIGHT && d < sightDist) { sightDist=d; sightTarget=npc; }
    }
    if (sightTarget) { mu.alerted=true; mu.alertTarget=sightTarget; }

    if (!mu.alerted) {
      mu.wanderTimer -= dt;
      if ((mu.wanderTimer<=0 || mu.path.length===0) && allCells.length>0) {
        const cell = allCells[Math.floor(Math.random()*allCells.length)];
        npcComputePath(mu, cell.wx, cell.wz);
        mu.wanderTimer = 4 + Math.random()*5;
      }
      npcFollowPath(mu, dt, bob, MUMMY_SPEED); continue;
    }

    const tgt  = mu.alertTarget;
    const tpos = tgt===player ? player.pos : tgt.mesh.position;
    if (!tgt || tgt.dead || mu.mesh.position.distanceTo(tpos) > MUMMY_FORGET) {
      mu.alerted=false; mu.alertTarget=null; mu.path=[]; continue;
    }
    mu.pathTimer -= dt;
    if (mu.pathTimer<=0 || mu.path.length===0) {
      npcComputePath(mu, tpos.x, tpos.z);
      mu.pathTimer = 1.2 + Math.random()*0.5;
    }
    npcFollowPath(mu, dt, bob, MUMMY_SPEED);

    if (mu.damageCooldown<=0) {
      const hit = !player.dead && mu.mesh.position.distanceTo(player.pos) < 0.75;
      if (hit) {
        damagePlayer(); if (!player.dead) damagePlayer(); // 2 HP
        mu.damageCooldown = MUMMY_DMG_CD;
      } else {
        for (const npc of npcs) {
          if (!npc.dead && mu.mesh.position.distanceTo(npc.mesh.position) < 0.75) {
            damageNPC(npc); damageNPC(npc);
            mu.damageCooldown = MUMMY_DMG_CD; break;
          }
        }
      }
    }
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

  if (!player.dead && !(infectionMode && playerInfectLockout > 0)) {
    if (keys['KeyW'] || (!activeMinigame && keys['ArrowUp']))    move.add(fwd);
    if (keys['KeyS'] || (!activeMinigame && keys['ArrowDown']))  move.sub(fwd);
    if (keys['KeyA'] || (!activeMinigame && keys['ArrowLeft']))  move.sub(rgt);
    if (keys['KeyD'] || (!activeMinigame && keys['ArrowRight'])) move.add(rgt);
  }

  const wantSprint = (keys['ShiftLeft']||keys['ShiftRight']) && !player.dead && !infectionMode;
  const sprinting = wantSprint && player.stamina > 0;
  if (sprinting) {
    player.stamina = Math.max(0, player.stamina - 40 * dt);
  } else {
    player.stamina = Math.min(100, player.stamina + 20 * dt);
  }
  updateStaminaHUD();
  const baseSpd = PLAYER_SPEED;
  const spd = sprinting ? baseSpd * SPRINT_MULT : baseSpd;

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

  // ── Traps ──
  if (!player.dead) {
    for (const trap of trapCells) {
      trap.cooldown = Math.max(0, trap.cooldown - dt);
      if (trap.cooldown<=0 && Math.hypot(player.pos.x-trap.pos.x, player.pos.z-trap.pos.z) < TILE*0.38) {
        damagePlayer(); trap.cooldown = TRAP_DMG_CD;
      }
    }
  }
  // ── Ladders ──
  if (!player.dead) {
    for (const pair of ladderPairs) {
      pair.cooldown = Math.max(0, pair.cooldown - dt);
      if (pair.cooldown > 0) continue;
      if (player.pos.distanceTo(pair.fromPos) < 0.9) {
        player.pos.copy(pair.toPos); pair.cooldown = LADDER_CD; break;
      } else if (player.pos.distanceTo(pair.toPos) < 0.9) {
        player.pos.copy(pair.fromPos); pair.cooldown = LADDER_CD; break;
      }
    }
  }

  // ── PVP weapon auto-pickup + cooldown ──
  if (pvpMode) {
    if (player.weapon) player.weapon.cd = Math.max(0, player.weapon.cd - dt);
    const needsWeapon = !player.weapon || (player.weapon.type === 'pistol' && player.weapon.ammo <= 0);
    if (needsWeapon) {
      for (let i = wPickups.length - 1; i >= 0; i--) {
        if (player.pos.distanceTo(wPickups[i].mesh.position) < 1.3) {
          const wp = wPickups.splice(i, 1)[0];
          player.weapon = { type: wp.type, ammo: wp.type === 'pistol' ? PVP_PISTOL_AMMO : Infinity, cd: 0 };
          scene.remove(wp.mesh);
          showMessage(wp.type === 'pistol' ? `PISTOL ×${PVP_PISTOL_AMMO}` : 'MELEE WEAPON', 1500);
          updateWeaponHUD(); break;
        }
      }
    }
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
  // Block elevator cell while door is closed, and always block trap cells
  let grid = currentGrid;
  if (grid && (!elevatorOpen || trapCells.length > 0)) {
    grid = currentGrid.map(r => [...r]);
    if (!elevatorOpen) grid[elevatorCell.r][elevatorCell.c] = 1;
    for (const trap of trapCells) {
      const tc = worldToCell(trap.pos.x, trap.pos.z);
      if (tc.r >= 0 && tc.r < grid.length && tc.c >= 0 && tc.c < grid[0].length)
        grid[tc.r][tc.c] = 1;
    }
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
    if (infectionMode && npc.infected) continue; // handled by updateInfection
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

    // ── Pick up nearby dead head ──
    if (!npc.carrying) {
      const nearHead = deadHeads.find(dh => !dh.carriedBy &&
        dh.killedBy !== npc &&
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

    // Trap check
    if (!npc.dead) {
      for (const trap of trapCells) {
        if (trap.cooldown<=0 && Math.hypot(npc.mesh.position.x-trap.pos.x, npc.mesh.position.z-trap.pos.z) < TILE*0.38) {
          damageNPC(npc); trap.cooldown = TRAP_DMG_CD; break;
        }
      }
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
        interactHint.textContent = infectionMode ? '[E] Hack Panel' : '[E] Activate Panel';
        interactHint.style.display = 'block';
        return;
      }
    }
  }
  // Check vents (sus mode only)
  if (susMode) {
    for (const v of vents) {
      if (player.pos.distanceTo(v.userData.worldPos) < INTERACT_DIST + 0.5) {
        lookTarget = { type:'vent', obj:v };
        interactHint.textContent = playerIsImp ? '[E] Enter Vent' : '[!] Vent';
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
    if (infectionMode) { if (!playerInfected) startMinigame(lookTarget.obj); }
    else if (susMode) { if (!playerIsImp) startMinigame(lookTarget.obj); }
    else activatePanel(lookTarget.obj);
  } else if (lookTarget.type === 'vent') {
    if (playerIsImp && susMode) openVentUI(lookTarget.obj.userData.def);
  } else if (lookTarget.type === 'head' && !player.carrying) {
    if (susMode) {
      doFlash(0xff8800, 0.5);
      startMeeting();
    } else {
      player.carrying = lookTarget.head;
      lookTarget.head.carriedBy = 'player';
    }
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
  if (susMode && susSabotage) { susFixSabotage(); return; }
  updateHUD();
  if (panelsActivated >= mapDef.panelCount) { if (susMode) checkSusWin(); else openElevator(); }
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

  // Dead and infected entities don't block advancement
  const playerReady = player.dead || (infectionMode && playerInfected) || isInElevator(player.pos);
  if (!playerReady) return;
  const allNpcsReady = npcs.every(n => n.dead || (infectionMode && n.infected) || isInElevator(n.mesh.position));
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

// ─── Infect cutscene ─────────────────────────────────────────────────────────
let csActive = false, csTime = 0;
const CS_DUR = 3.6;
let csScene = null, csCamera = null, csMats = [], csGreenLight = null;

function startInfectCutscene() {
  csScene = new THREE.Scene();
  csScene.background = new THREE.Color(0x000000);
  csScene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.PointLight(0xffffff, 2.0, 10);
  key.position.set(1.5, 3, 2);
  csScene.add(key);
  csGreenLight = new THREE.PointLight(0x33ff66, 0, 8);
  csGreenLight.position.set(-1, 2, 1);
  csScene.add(csGreenLight);

  const mesh = makeCrewmate(chosenColor, chosenHat);
  mesh.position.set(0, 0, 0);
  csScene.userData.char = mesh;
  csScene.add(mesh);

  csMats = [];
  mesh.traverse(child => {
    if (child.isMesh && child.material && child.material.color &&
        !(child.material instanceof THREE.MeshBasicMaterial)) {
      const m = child.material.clone();
      child.material = m;
      csMats.push({ mat: m, orig: m.color.clone() });
    }
  });

  csCamera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 50);
  csCamera.position.set(0, 0.8, 2.6);
  csCamera.lookAt(0, 0.7, 0);

  csActive = true;
  csTime = 0;

  // text overlay timing
  const el = document.getElementById('infect-cutscene');
  if (el) {
    el.style.display = 'none';
    setTimeout(() => {
      el.style.display = 'flex';
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    }, 900);
    setTimeout(() => { el.style.display = 'none'; }, 3200);
  }
}

function updateCutscene(dt) {
  csTime += dt;
  const t = Math.min(csTime / CS_DUR, 1);
  const csType = csScene && csScene.userData.csType;

  // attack cutscene has no .char — handle it before the char guard
  if (csType === 'attack') {
    const { attackerMesh, playerMesh, tongueMesh, roarMouth } = csScene.userData;
    const ct = csTime;

    // Phase 1 (0–0.36s): pause
    // Phase 2 (0.36–1.26s): tongue shoots out
    const tongueT = Math.max(0, Math.min(1, (ct - 0.36) / 0.9));
    const maxLen = 1.98;
    let curLen = Math.max(0.001, tongueT * maxLen);

    // Phase 3 (1.26–2.52s): shake + infect, tongue retracts
    const infectT = Math.max(0, Math.min(1, (ct - 1.26) / 1.26));
    if (infectT > 0) curLen = Math.max(0.001, curLen * (1 - Math.min(1, infectT * 1.67)));

    tongueMesh.scale.x = curLen;
    tongueMesh.position.x = -0.99 + curLen / 2;

    // Phase 4 (2.52–3.3s): player falls
    const fallT = Math.max(0, Math.min(1, (ct - 2.52) / 0.78));
    // Phase 5 (3.3–4.4s): player rises to knees, turns to face camera
    const riseT = Math.max(0, Math.min(1, (ct - 3.3) / 1.1));
    // Phase 6 (4.4–6.0s): creepy roar
    const roarT = Math.max(0, Math.min(1, (ct - 4.4) / 1.6));

    const ease = v => v < 0.5 ? 2*v*v : 1 - Math.pow(-2*v+2,2)/2;
    const shake = infectT < 0.8 && fallT === 0 ? Math.sin(ct * 45) * infectT * 0.07 : 0;

    if (roarT > 0) {
      playerMesh.rotation.y = -Math.PI / 2;
      playerMesh.rotation.z = Math.sin(ct * 28) * roarT * 0.1;
      playerMesh.position.set(1.3, -0.18, 0);
      if (roarMouth) { const o = Math.min(1, roarT * 3); roarMouth.scale.set(o, o, 1); }
    } else if (riseT > 0) {
      // Rise from flat back to profile
      const e = ease(riseT);
      playerMesh.rotation.z = -Math.PI / 2 * (1 - e);
      playerMesh.rotation.y = -Math.PI / 2;
      playerMesh.position.set(1.3, -0.5 + 0.32 * e, 0);
    } else if (fallT > 0) {
      // Recoil backward from the hit (top tilts away from attacker)
      const e = ease(fallT);
      playerMesh.rotation.z = -Math.PI / 2 * e;
      playerMesh.rotation.y = -Math.PI / 2;
      playerMesh.position.set(1.3, -0.5 * e, 0);
    } else {
      playerMesh.rotation.y = -Math.PI / 2;
      playerMesh.position.set(1.3 + shake, 0, 0);
      playerMesh.rotation.z = Math.sin(ct * 38) * infectT * 0.05;
    }

    const green = new THREE.Color(0x33bb44);
    const greenAmt = Math.min(1, infectT * 1.5);
    // During roar pulse the green emissive strongly
    const roarPulse = roarT > 0 ? 0.5 + 0.5 * Math.abs(Math.sin(ct * 12)) : 0;
    for (const { mat, orig } of csMats) {
      mat.color.lerpColors(orig, green, roarT > 0 ? 1 : (fallT > 0 || riseT > 0 ? 1 : greenAmt));
      if (mat.emissive) {
        const em = roarT > 0 ? Math.floor(0x11 + 0x33 * roarPulse) : (greenAmt > 0.3 ? 0x11 : 0);
        mat.emissive.setRGB(0, em / 255, em / 255 * 0.6);
      }
    }
    if (csGreenLight) {
      csGreenLight.intensity = roarT > 0 ? 1.5 + roarPulse * 2.5
        : infectT > 0 ? infectT * 1.2 : 0;
    }

    if (roarT > 0) {
      // Zoom in from front as player faces camera
      const z = Math.min(1, roarT * 1.5);
      csCamera.position.set(1.3, 0.75 + z * 0.15, 4.2 - z * 2.0);
      csCamera.lookAt(1.3, 0.75, 0);
    } else if (riseT > 0) {
      csCamera.position.set(0, 1.1, 3.8);
      csCamera.lookAt(0.8, 0.65, 0);
    } else {
      const zoomIn  = Math.min(1, tongueT * 1.6);
      const zoomOut = Math.max(0, (infectT - 0.7) / 0.3);
      csCamera.position.set(0, 1.1 - zoomIn * 0.2 + zoomOut * 0.15, 4.2 - zoomIn * 1.8 + zoomOut * 1.4);
      csCamera.lookAt(0, 0.65, 0);
    }

    if (ct >= 6.0) {
      tintInfected(playerMesh); // snap to full infected look on final frame
      csActive = false; csScene = null; csMats = []; csGreenLight = null;
    }
    return;
  }

  const mesh = csScene && csScene.userData.char;
  if (!mesh) return;

  const isDeath = csType === 'death';

  if (isDeath) {
    // Character collapses and turns dark red
    const fallStart = 0.3;
    const fall = Math.max(0, Math.min(1, (t - fallStart) / 0.5));
    mesh.rotation.z = fall * -Math.PI / 2;
    mesh.position.y = fall * -0.4;
    mesh.position.x = Math.sin(csTime * 28) * (1 - fall) * 0.03;

    const dark = new THREE.Color(0x330000);
    for (const { mat, orig } of csMats) {
      mat.color.lerpColors(orig, dark, Math.min(1, t * 1.4));
      if (mat.emissive) mat.emissive.setHex(t < 0.4 ? 0x220000 : 0x000000);
    }
    if (csGreenLight) csGreenLight.intensity = (1 - t) * 1.5;
    csCamera.position.z = 2.6 + fall * 0.8;
  } else {
    const tremble = t < 0.25 ? 0 : t < 0.6 ? (t - 0.25) / 0.35 : t < 0.85 ? 1 - (t - 0.6) / 0.25 : 0;
    mesh.position.x = tremble * Math.sin(csTime * 42) * 0.045;
    mesh.position.y = tremble * Math.abs(Math.sin(csTime * 36) * 0.03);
    mesh.rotation.z = tremble * Math.sin(csTime * 30) * 0.045;

    const infect = Math.max(0, Math.min(1, (t - 0.35) / 0.5));
    const green = new THREE.Color(0x33bb44);
    for (const { mat, orig } of csMats) {
      mat.color.lerpColors(orig, green, infect);
      if (mat.emissive) mat.emissive.setHex(infect > 0.4 ? 0x114422 : 0x000000);
    }
    if (csGreenLight) csGreenLight.intensity = infect * 2.0;
    csCamera.position.z = 2.6 - t * 0.2 + (t > 0.82 ? (t - 0.82) * 3 : 0);
  }

  csCamera.lookAt(0, 0.7, 0);

  if (csTime >= CS_DUR) {
    csActive = false;
    csScene = null; csMats = []; csGreenLight = null;
  }
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
function loop() {
  raf = requestAnimationFrame(loop);
  try {
    const dt = Math.min(clock.getDelta(), 0.05);

    if (csActive) {
      updateCutscene(dt);
      if (csScene && csCamera) renderer.render(csScene, csCamera);
      return;
    }

    if (locked) {
      updatePlayer(dt);
      checkLookTarget();
    }
    if (pvpMode) {
      updatePVP(dt);
    } else if (susMode) {
      if (susMeeting) {
        updateMeeting(dt);
      } else {
        updateNPCs(dt);
        updateSus(dt);
        checkElevatorFill();
      }
    } else if (infectionMode) {
      updateNPCs(dt);
      updateInfection(dt);
      checkElevatorFill();
    } else {
      updateNPCs(dt);
      updateEnemies(dt);
      updateMummies(dt);
      checkElevatorFill();
    }
    renderer.render(scene, camera);
  } catch(e) {
    console.error('Loop error:', e);
  }
}

// ─── Infection mode ───────────────────────────────────────────────────────────
const MG_TYPES = ['mash','timing','sequence','hold','calibrate'];

function addInfectedMouth(g) {
  const darkMat  = new THREE.MeshLambertMaterial({ color: 0x050505 });
  const toothMat = new THREE.MeshLambertMaterial({ color: 0xccddcc });
  const tongueMat = new THREE.MeshLambertMaterial({ color: 0xcc1144 });

  // Very wide tall dark mouth hole
  const hole = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.20, 0.07), darkMat);
  hole.position.set(0, 0.63, 0.30);
  g.add(hole);

  // Upper teeth — 3 large downward cones
  for (const [x, r, h] of [[-0.11, 0.07, 0.14], [0.01, 0.075, 0.16], [0.13, 0.065, 0.12]]) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), toothMat);
    tooth.rotation.z = Math.PI; // point downward
    tooth.position.set(x, 0.725 - h * 0.45, 0.31);
    g.add(tooth);
  }

  // Lower teeth — 2 large upward cones
  for (const [x, r, h] of [[-0.08, 0.065, 0.12], [0.09, 0.07, 0.13]]) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), toothMat);
    tooth.position.set(x, 0.535 + h * 0.45, 0.31);
    g.add(tooth);
  }

  // Tongue — flat wide drooping shape
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.15, 0.045), tongueMat);
  tongue.position.set(0.01, 0.495, 0.315);
  tongue.rotation.x = 0.32;
  g.add(tongue);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.056, 8, 6), tongueMat);
  tip.scale.set(1, 0.6, 0.8);
  tip.position.set(0.01, 0.42, 0.345);
  g.add(tip);
}

function tintInfected(mesh) {
  mesh.traverse(child => {
    if (child.isMesh && child.material) {
      const m = child.material.clone();
      m.color.setHex(0x33bb44); if (m.emissive) m.emissive.setHex(0x114422);
      child.material = m;
    }
  });
  addInfectedMouth(mesh);
}

function spawnInfectPuddle(x, z) {
  const geo = new THREE.CircleGeometry(0.9 + Math.random() * 0.4, 18);
  const mat = new THREE.MeshBasicMaterial({ color: 0x22cc44 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.015, z);
  scene.add(mesh);
  puddles.push(mesh);
}

function infectEntity(entity, isFirst = false, attacker = null) {
  if (entity === 'player') {
    if (playerInfected) return;
    playerInfected = true;
    playerInfectLockout = 15;
    tintInfected(player.mesh);
    if (activeMinigame) cancelMinigame();
    spawnInfectPuddle(player.pos.x, player.pos.z);
    if (isFirst && infectShowAnims) showInfectCutscene();
    else if (attacker && !csActive && infectShowAnims) startInfectAttackCutscene(attacker.color, attacker.hat || 'none');
    else doFlash(0x00ff44, 0.7);
  } else {
    if (entity.infected) return;
    entity.infected = true;
    entity.infectLockout = 15;
    tintInfected(entity.mesh);
    if (infectShowAnims) entity.infectAnim = { t: 0 };
    spawnInfectPuddle(entity.mesh.position.x, entity.mesh.position.z);
  }
  updateInfectionHUD();
  checkInfectionEnd();
}

function showInfectCutscene() {
  startInfectCutscene();
}

function startInfectAttackCutscene(attackerColor, attackerHat) {
  csScene = new THREE.Scene();
  csScene.background = new THREE.Color(0x010802);
  csScene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.PointLight(0xffffff, 2.0, 14);
  key.position.set(0, 4, 2);
  csScene.add(key);
  csGreenLight = new THREE.PointLight(0x33ff66, 1.2, 8);
  csGreenLight.position.set(-1.3, 1.5, 1);
  csScene.add(csGreenLight);

  // Attacker (infected NPC) on the left, rotated to face right (+X) toward player
  const attackerMesh = makeCrewmate(attackerColor, attackerHat, 'none');
  tintInfected(attackerMesh);
  attackerMesh.position.set(-1.3, 0, 0);
  attackerMesh.rotation.y = Math.PI / 2; // face right
  csScene.add(attackerMesh);

  // Player on the right, rotated to face left (-X) toward attacker
  const playerMesh = makeCrewmate(chosenColor, chosenHat, chosenMouth);
  playerMesh.position.set(1.3, 0, 0);
  playerMesh.rotation.y = -Math.PI / 2; // face left
  csScene.add(playerMesh);

  // Tongue — BoxGeometry(1,…), scale.x + position.x updated per frame to extend rightward
  // With rotation.y=PI/2, attacker face (local z=0.31) → world x = -1.3+0.31 = -0.99
  const tongueMat = new THREE.MeshLambertMaterial({ color: 0xcc1144, emissive: 0x661122 });
  const tongueMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 0.07, 0.07), tongueMat);
  tongueMesh.position.set(-0.99, 0.63, 0);
  tongueMesh.scale.x = 0.001;
  csScene.add(tongueMesh);

  // Roar mouth — on the front face of the head, visible when rotation.y=0 (facing camera).
  const roarMouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.21, 0.07),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  roarMouth.position.set(0, 0.70, 0.33);
  roarMouth.scale.set(0, 0, 1);
  playerMesh.add(roarMouth);

  csMats = [];
  playerMesh.traverse(child => {
    if (child.isMesh && child.material && child.material.color &&
        !(child.material instanceof THREE.MeshBasicMaterial)) {
      const m = child.material.clone();
      child.material = m;
      csMats.push({ mat: m, orig: m.color.clone() });
    }
  });

  csCamera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.05, 50);
  // Camera slightly to the side so both profiles are clearly visible
  csCamera.position.set(0, 1.1, 4.2);
  csCamera.lookAt(0, 0.65, 0);

  csScene.userData = { csType:'attack', attackerMesh, playerMesh, tongueMesh, roarMouth };
  csActive = true;
  csTime = 0;

  const el = document.getElementById('infect-cutscene');
  if (el) {
    el.style.display = 'none';
    setTimeout(() => {
      el.style.display = 'flex';
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    }, 4800);
    setTimeout(() => { el.style.display = 'none'; }, 6200);
  }
}

function initInfection() {
  const types = MG_TYPES;
  panels.forEach((p, i) => { p.userData.minigameType = types[i % types.length]; });
  const pool = ['player', ...npcs];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const count = Math.min(infectStartCount, pool.length);
  for (let i = 0; i < count; i++) infectEntity(shuffled[i], i === 0);
  updateInfectionHUD();
}

function updateInfectionHUD() {
  const el = document.getElementById('infect-count');
  if (!el) return;
  const total = npcs.length + 1;
  const inf = npcs.filter(n => n.infected).length + (playerInfected ? 1 : 0);
  el.innerHTML = `<span style="color:#33bb44">⬤</span> INFECTED ${inf} / ${total}`;
}

function checkInfectionEnd() {
  if (infectionOver) return;
  const allInfected = playerInfected && npcs.every(n => n.infected || n.dead);
  if (allInfected) {
    infectionOver = true;
    showMessage('ALL INFECTED', 4500);
    setTimeout(() => {
      const mapKeys = Object.keys(MAPS);
      const next = mapKeys[(mapKeys.indexOf(currentMapKey) + 1) % mapKeys.length];
      loadMap(next);
    }, 5000);
  }
}

function updateInfection(dt) {
  if (infectionOver) return;
  updateMinigame(dt);
  if (playerInfectLockout > 0) playerInfectLockout = Math.max(0, playerInfectLockout - dt);

  // Non-infected NPCs flee from nearest infected entity
  for (const npc of npcs) {
    if (npc.infected || npc.dead) continue;
    let nearDist = Infinity, nearPos = null;
    if (playerInfected) {
      const d = npc.mesh.position.distanceTo(player.pos);
      if (d < nearDist) { nearDist = d; nearPos = player.pos.clone(); }
    }
    for (const other of npcs) {
      if (!other.infected || other.dead) continue;
      const d = npc.mesh.position.distanceTo(other.mesh.position);
      if (d < nearDist) { nearDist = d; nearPos = other.mesh.position.clone(); }
    }
    if (nearPos && nearDist < 8) {
      const away = npc.mesh.position.clone().sub(nearPos).setY(0).normalize();
      const fleeTarget = npc.mesh.position.clone().add(away.multiplyScalar(6));
      npc.fleeTimer = (npc.fleeTimer || 0) - dt;
      if (npc.fleeTimer <= 0 || npc.path.length === 0) {
        npcComputePath(npc, fleeTarget.x, fleeTarget.z);
        npc.fleeTimer = 0.6 + Math.random() * 0.3;
      }
      npcFollowPath(npc, dt, 0, NPC_SPEED);
    }
  }

  for (const npc of npcs) {
    if (!npc.infected || npc.dead) continue;
    if (npc.infectAnim) continue; // frozen during fall/roar animation
    npc.damageCooldown = Math.max(0, (npc.damageCooldown || 0) - dt);
    if (npc.infectLockout > 0) { npc.infectLockout -= dt; continue; }

    // Find nearest non-infected target
    let nearDist = Infinity, nearPos = null, nearEntity = null;
    if (!playerInfected) {
      const d = npc.mesh.position.distanceTo(player.pos);
      if (d < nearDist) { nearDist = d; nearPos = player.pos; nearEntity = 'player'; }
    }
    for (const other of npcs) {
      if (other.infected || other.dead) continue;
      const d = npc.mesh.position.distanceTo(other.mesh.position);
      if (d < nearDist) { nearDist = d; nearPos = other.mesh.position; nearEntity = other; }
    }

    if (nearPos) {
      npc.pathTimer = (npc.pathTimer || 0) - dt;
      if (npc.pathTimer <= 0 || npc.path.length === 0) {
        npcComputePath(npc, nearPos.x, nearPos.z);
        npc.pathTimer = 0.5 + Math.random() * 0.3;
      }
      npcFollowPath(npc, dt, 0, INFECT_NPC_SPEED);
      if (nearDist < INFECT_RANGE && npc.damageCooldown <= 0) {
        infectEntity(nearEntity, false, npc);
        npc.damageCooldown = 1.5;
      }
    }
  }

  // Player infected → can spread by walking into others (after lockout)
  if (playerInfected && playerInfectLockout <= 0) {
    for (const npc of npcs) {
      if (!npc.infected && !npc.dead && player.pos.distanceTo(npc.mesh.position) < INFECT_RANGE)
        infectEntity(npc);
    }
  }

  // In-world fall/roar animation for newly infected NPCs
  updateInfectAnims(dt);

  // Green footprint trail for all infected entities
  updateFootprints(dt);
}

function updateInfectAnims(dt) {
  const ease = v => v < 0.5 ? 2*v*v : 1 - Math.pow(-2*v+2,2)/2;
  for (const npc of npcs) {
    if (!npc.infectAnim) continue;
    npc.infectAnim.t += dt;
    const ct = npc.infectAnim.t;
    const m = npc.mesh;
    const fallT  = Math.max(0, Math.min(1, ct / 0.7));
    const riseT  = Math.max(0, Math.min(1, (ct - 0.7) / 0.9));
    const roarT  = Math.max(0, Math.min(1, (ct - 1.6) / 1.2));

    if (roarT > 0) {
      m.rotation.z = Math.sin(ct * 28) * roarT * 0.18;
      m.position.y = -0.2 + 0.2 * Math.min(1, roarT * 2);
    } else if (riseT > 0) {
      const e = ease(riseT);
      m.rotation.z = -Math.PI / 2 * (1 - e);
      m.position.y = -0.5 + 0.3 * e;
    } else {
      const e = ease(fallT);
      m.rotation.z = -Math.PI / 2 * e;
      m.position.y = -0.5 * e;
    }

    if (ct >= 2.8) {
      // reset pose and clear anim
      m.rotation.z = 0;
      m.position.y = 0;
      npc.infectAnim = null;
    }
  }
}

const FOOTPRINT_INTERVAL = 0.18; // seconds between prints
const FOOTPRINT_LIFE     = 3.5;  // seconds before fade-out
const fpMat = new THREE.MeshBasicMaterial({ color: 0x22cc55, transparent: true, opacity: 0.75 });

function spawnFootprint(x, z) {
  const geo = new THREE.PlaneGeometry(0.22, 0.32);
  const mesh = new THREE.Mesh(geo, fpMat.clone());
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = Math.random() * Math.PI * 2;
  mesh.position.set(x + (Math.random() - 0.5) * 0.15, 0.01, z + (Math.random() - 0.5) * 0.15);
  scene.add(mesh);
  footprints.push({ mesh, life: FOOTPRINT_LIFE });
}

function updateFootprints(dt) {
  // Spawn for player
  if (playerInfected) {
    player._fpTimer = (player._fpTimer || 0) - dt;
    if (player._fpTimer <= 0) {
      spawnFootprint(player.pos.x, player.pos.z);
      player._fpTimer = FOOTPRINT_INTERVAL;
    }
  }
  // Spawn for infected NPCs
  for (const npc of npcs) {
    if (!npc.infected || npc.dead) continue;
    npc._fpTimer = (npc._fpTimer || 0) - dt;
    if (npc._fpTimer <= 0) {
      spawnFootprint(npc.mesh.position.x, npc.mesh.position.z);
      npc._fpTimer = FOOTPRINT_INTERVAL;
    }
  }
  // Fade and remove old prints
  for (let i = footprints.length - 1; i >= 0; i--) {
    const fp = footprints[i];
    fp.life -= dt;
    fp.mesh.material.opacity = Math.max(0, (fp.life / FOOTPRINT_LIFE) * 0.75);
    if (fp.life <= 0) {
      scene.remove(fp.mesh);
      footprints.splice(i, 1);
    }
  }
}

// ─── Minigame system ──────────────────────────────────────────────────────────
function startMinigame(panel) {
  if (activeMinigame || panel.userData.activated) return;
  const type = panel.userData.minigameType || 'mash';
  let state;
  if (type === 'mash') {
    state = { count:0, required:12, timer:7.0 };
  } else if (type === 'timing') {
    const zs = 0.2 + Math.random() * 0.35;
    state = { cursor:0, dir:1, speed:1.0 + Math.random()*0.9, zoneStart:zs, zoneEnd:zs+0.22, misses:0 };
  } else if (type === 'sequence') {
    const DIRS = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    const len = 4 + Math.floor(Math.random() * 3);
    state = { seq: Array.from({length:len}, ()=>DIRS[Math.floor(Math.random()*4)]), index:0 };
  } else if (type === 'hold') {
    state = { held:0, required:3.0 };
  } else {
    // calibrate: 3 sliders, move with left/right, E to lock each
    state = { sliders: Array.from({length:3}, () => ({
      pos: 0.1 + Math.random() * 0.5,
      target: 0.3 + Math.random() * 0.4,
      locked: false
    })), current:0 };
  }
  activeMinigame = { panel, type, state };
  renderMinigameUI();
  document.getElementById('minigame-ui').style.display = 'flex';
}

function renderMinigameUI() {
  const mg = activeMinigame;
  const arrows = {ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'};
  const el = document.getElementById('mg-content');
  if (mg.type === 'mash') {
    el.innerHTML = `<div class="mg-label">MASH [E]!</div>
      <div class="mg-bar-wrap"><div class="mg-bar-fill" id="mg-fill" style="width:0%"></div></div>
      <div id="mg-count">0 / ${mg.state.required}</div>
      <div id="mg-timer">${mg.state.timer.toFixed(1)}s</div>`;
  } else if (mg.type === 'timing') {
    const zl = mg.state.zoneStart*100, zw = (mg.state.zoneEnd-mg.state.zoneStart)*100;
    el.innerHTML = `<div class="mg-label">PRESS [E] IN THE ZONE!</div>
      <div class="mg-timing-wrap">
        <div class="mg-timing-zone" id="mg-zone" style="left:${zl}%;width:${zw}%"></div>
        <div class="mg-timing-cursor" id="mg-cursor" style="left:0%"></div>
      </div>
      <div id="mg-misses">3 attempts left</div>`;
  } else if (mg.type === 'sequence') {
    const seqKeys = mg.state.seq.map((k,i)=>
      `<span class="mg-seq-key ${i===0?'mg-seq-active':''}">${arrows[k]}</span>`).join('');
    el.innerHTML = `<div class="mg-label">PRESS THE SEQUENCE!</div>
      <div id="mg-seq-row">${seqKeys}</div>
      <div class="mg-hint">Use arrow keys</div>`;
  } else if (mg.type === 'hold') {
    el.innerHTML = `<div class="mg-label">HOLD [E]!</div>
      <div class="mg-bar-wrap"><div class="mg-bar-fill" id="mg-fill" style="width:0%"></div></div>
      <div class="mg-hint">Keep holding to fill</div>`;
  } else {
    // calibrate
    const s = mg.state;
    const sliderHTML = s.sliders.map((sl, i) => {
      const pct = sl.pos * 100;
      const tl  = sl.target * 100, tw = 8;
      const active = i === s.current && !sl.locked;
      return `<div class="mg-label" style="font-size:11px;margin-bottom:2px">SENSOR ${i+1}${sl.locked?' ✓':active?' ←→':''}</div>
        <div class="mg-timing-wrap" style="margin-bottom:8px">
          <div class="mg-timing-zone" style="left:${tl}%;width:${tw}%;background:rgba(0,255,100,0.45)"></div>
          <div class="mg-timing-cursor" style="left:${pct}%;background:${sl.locked?'#00ff88':active?'#fff':'#555'}"></div>
        </div>`;
    }).join('');
    el.innerHTML = `<div class="mg-label">ALIGN SENSORS</div>${sliderHTML}
      <div class="mg-hint">← → to move · E to lock</div>`;
  }
}

function updateMinigame(dt) {
  if (!activeMinigame) return;
  const mg = activeMinigame;
  if (player.pos.distanceTo(mg.panel.userData.worldPos) > INTERACT_DIST * 1.6) {
    cancelMinigame(); return;
  }
  if (mg.type === 'mash') {
    mg.state.timer -= dt;
    const t = document.getElementById('mg-timer');
    if (t) t.textContent = Math.max(0, mg.state.timer).toFixed(1) + 's';
    if (mg.state.timer <= 0) { cancelMinigame(); showMessage('TOO SLOW!', 1200); }
  } else if (mg.type === 'timing') {
    mg.state.cursor = Math.max(0, Math.min(1, mg.state.cursor + mg.state.dir * mg.state.speed * dt));
    if (mg.state.cursor >= 1) mg.state.dir = -1;
    if (mg.state.cursor <= 0) mg.state.dir = 1;
    const c = document.getElementById('mg-cursor');
    if (c) c.style.left = (mg.state.cursor * 100) + '%';
  } else if (mg.type === 'hold') {
    if (keys['KeyE']) {
      mg.state.held = Math.min(mg.state.required, mg.state.held + dt);
    } else {
      mg.state.held = Math.max(0, mg.state.held - dt * 0.5);
    }
    const pct = mg.state.held / mg.state.required * 100;
    const f = document.getElementById('mg-fill');
    if (f) f.style.width = pct + '%';
    if (mg.state.held >= mg.state.required) completeMinigame();
  } else if (mg.type === 'calibrate') {
    const s = mg.state;
    if (s.current < s.sliders.length && !s.sliders[s.current].locked) {
      const speed = 0.5 * dt;
      if (keys['ArrowLeft'])  s.sliders[s.current].pos = Math.max(0, s.sliders[s.current].pos - speed);
      if (keys['ArrowRight']) s.sliders[s.current].pos = Math.min(1, s.sliders[s.current].pos + speed);
      renderMinigameUI();
    }
  }
}

function handleMinigameKey(code) {
  if (!activeMinigame) return;
  const mg = activeMinigame;
  if (mg.type === 'mash' && code === 'KeyE') {
    mg.state.count++;
    const pct = Math.min(100, mg.state.count / mg.state.required * 100);
    const f = document.getElementById('mg-fill'); if (f) f.style.width = pct + '%';
    const c = document.getElementById('mg-count'); if (c) c.textContent = `${mg.state.count} / ${mg.state.required}`;
    if (mg.state.count >= mg.state.required) completeMinigame();
  } else if (mg.type === 'timing' && code === 'KeyE') {
    const { cursor, zoneStart, zoneEnd } = mg.state;
    if (cursor >= zoneStart && cursor <= zoneEnd) {
      completeMinigame();
    } else {
      mg.state.misses++;
      doFlash(0xff2200, 0.2);
      if (mg.state.misses >= 3) { cancelMinigame(); showMessage('MISSED!', 1200); }
      else {
        const m = document.getElementById('mg-misses');
        if (m) m.textContent = (3 - mg.state.misses) + ' attempts left';
      }
    }
  } else if (mg.type === 'calibrate' && code === 'KeyE') {
    const s = mg.state;
    const sl = s.sliders[s.current];
    if (!sl) return;
    const inZone = sl.pos >= sl.target && sl.pos <= sl.target + 0.08;
    if (inZone) {
      sl.locked = true;
      s.current++;
      if (s.current >= s.sliders.length) { completeMinigame(); return; }
      renderMinigameUI();
    } else {
      doFlash(0xff2200, 0.2);
    }
  } else if (mg.type === 'sequence') {
    const expected = mg.state.seq[mg.state.index];
    if (code === expected) {
      mg.state.index++;
      document.querySelectorAll('.mg-seq-key').forEach((el,i) => {
        el.classList.toggle('mg-seq-active', i === mg.state.index);
        el.classList.toggle('mg-seq-done', i < mg.state.index);
      });
      if (mg.state.index >= mg.state.seq.length) completeMinigame();
    } else {
      mg.state.index = 0;
      document.querySelectorAll('.mg-seq-key').forEach((el,i) => {
        el.classList.toggle('mg-seq-active', i === 0);
        el.classList.remove('mg-seq-done');
      });
      doFlash(0xff2200, 0.2);
    }
  }
}

function completeMinigame() {
  const panel = activeMinigame.panel;
  document.getElementById('minigame-ui').style.display = 'none';
  activeMinigame = null;
  activatePanel(panel);
}

function cancelMinigame() {
  document.getElementById('minigame-ui').style.display = 'none';
  activeMinigame = null;
}

// ─── Sus (Among Us) mode ──────────────────────────────────────────────────────
function initSus() {
  // Assign minigame types to panels for crew tasks
  shuffle(panels);
  panels.forEach((p, i) => { p.userData.minigameType = MG_TYPES[i % MG_TYPES.length]; });

  const pool = [...npcs];
  shuffle(pool);
  for (let i = 0; i < SUS_IMP_COUNT; i++) {
    pool[i].isImp = true;
    pool[i].killCd = SUS_IMP_KILL_CD * (0.5 + Math.random());
  }
  playerIsImp = Math.random() < SUS_IMP_COUNT / (SUS_NPC_COUNT + 1);
  if (playerIsImp) {
    showMessage('YOU ARE AN\nIMPOSTOR', 5000);
    doFlash(0xff0000, 0.8);
  } else {
    showMessage('YOU ARE A\nCREWMATE', 4000);
    doFlash(0x0055ff, 0.5);
  }
  updateSusHUD();
}

function susKillPlayer(killer = null) {
  if (player.dead) return;
  player.dead = true;
  player.mesh.visible = false;
  const head = makeDeadHead(chosenColor);
  head.position.copy(player.pos).setY(0.5);
  scene.add(head);
  deadHeads.push({ grp: head, carriedBy: null, killedBy: null });
  startSusDeathCutscene(killer ? killer.color : null);
  checkSusWin();
  updateSusHUD();
  updateCrewDots();
}

function startSusDeathCutscene(killerColor) {
  // Reuse 3D cutscene infrastructure with red death theme
  csScene = new THREE.Scene();
  csScene.background = new THREE.Color(0x080000);
  csScene.add(new THREE.AmbientLight(0x441111, 1.0));
  const key = new THREE.PointLight(0xff2200, 2.5, 10);
  key.position.set(1.5, 3, 2);
  csScene.add(key);
  csGreenLight = new THREE.PointLight(0xff0000, 0, 8);
  csGreenLight.position.set(-1, 2, 1);
  csScene.add(csGreenLight);

  const mesh = makeCrewmate(chosenColor, chosenHat);
  mesh.position.set(0, 0, 0);
  csScene.userData.char = mesh;
  csScene.userData.csType = 'death';
  csScene.add(mesh);

  csMats = [];
  mesh.traverse(child => {
    if (child.isMesh && child.material && child.material.color &&
        !(child.material instanceof THREE.MeshBasicMaterial)) {
      const m = child.material.clone();
      child.material = m;
      csMats.push({ mat: m, orig: m.color.clone() });
    }
  });

  csCamera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 50);
  csCamera.position.set(0, 0.8, 2.6);
  csCamera.lookAt(0, 0.7, 0);
  csActive = true;
  csTime = 0;

  const el = document.getElementById('sus-death-cs');
  if (el) {
    const byEl = document.getElementById('sus-death-by');
    if (byEl) {
      if (killerColor != null) {
        const hex = '#' + killerColor.toString(16).padStart(6, '0');
        byEl.innerHTML = `killed by <span style="color:${hex}">${colorNameOf(killerColor)}</span>`;
      } else {
        byEl.textContent = '';
      }
    }
    el.style.display = 'none';
    setTimeout(() => {
      el.style.display = 'flex';
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    }, 600);
    setTimeout(() => { el.style.display = 'none'; }, 3400);
  }
}

function susKillNPC(npc, killer = null) {
  npc.dead = true;
  npc.mesh.visible = false;
  const head = makeDeadHead(npc.color);
  head.position.copy(npc.mesh.position).setY(0.5);
  scene.add(head);
  deadHeads.push({ grp: head, carriedBy: null, killedBy: killer });
  updateCrewDots();
  checkSusWin();
  updateSusHUD();
}

function susPlayerKill() {
  if (!playerIsImp || susKillCd > 0 || player.dead || susOver) return;
  let nearest = null, nearDist = SUS_KILL_RANGE;
  for (const npc of npcs) {
    if (npc.isImp || npc.dead) continue;
    const d = player.pos.distanceTo(npc.mesh.position);
    if (d < nearDist) { nearDist = d; nearest = npc; }
  }
  if (!nearest) { showMessage('NO TARGET', 600); return; }
  susKillNPC(nearest);
  susKillCd = SUS_KILL_CD;
  doFlash(0xff0000, 0.6);
}

function susTriggerSabotage() {
  if (susSabotage || susOver) return;
  susSabotage = { timer: 45 };
  scene.fog = new THREE.Fog(0x000000, 1, 4);
  showMessage('LIGHTS SABOTAGED!\nFix at a panel [E]', 4000);
  updateSusHUD();
}

function susFixSabotage() {
  susSabotage = null;
  scene.fog = new THREE.Fog(0x0d0d14, 3, 10);
  showMessage('LIGHTS RESTORED!', 2000);
  updateSusHUD();
}

function checkSusWin() {
  if (susOver) return;
  const liveImps = npcs.filter(n => n.isImp && !n.dead).length + (playerIsImp && !player.dead ? 1 : 0);
  const liveCrew = npcs.filter(n => !n.isImp && !n.dead).length + (!playerIsImp && !player.dead ? 1 : 0);
  if (liveImps === 0) {
    susOver = true;
    showMessage('ALL IMPOSTORS FOUND\nCREWMATES WIN!', 6000);
    doFlash(0x0055ff, 0.8); openElevator();
  } else if (liveImps >= liveCrew) {
    susOver = true;
    showMessage('IMPOSTORS WIN!', 6000);
    doFlash(0xff0000, 0.8);
  } else if (panelsActivated >= mapDef.panelCount) {
    susOver = true;
    showMessage('ALL TASKS DONE\nCREWMATES WIN!', 6000);
    doFlash(0x0055ff, 0.8); openElevator();
  }
}

function updateSusHUD() {
  const hud = document.getElementById('sus-hud');
  if (!hud) return;
  const liveImps = npcs.filter(n => n.isImp && !n.dead).length + (playerIsImp && !player.dead ? 1 : 0);
  const liveCrew = npcs.filter(n => !n.isImp && !n.dead).length + (!playerIsImp && !player.dead ? 1 : 0);
  const roleEl = document.getElementById('sus-role');
  roleEl.textContent = playerIsImp ? '⚠ IMPOSTOR' : '✓ CREWMATE';
  roleEl.style.color  = playerIsImp ? '#ff4444' : '#44ff88';
  document.getElementById('sus-counts').textContent = `Crew ${liveCrew}  ·  Imps ${liveImps}`;
  const killEl = document.getElementById('sus-kill-info');
  if (playerIsImp) {
    killEl.style.display = '';
    if (susKillCd > 0) { killEl.textContent = `[K] KILL — ${Math.ceil(susKillCd)}s`; killEl.style.color = '#888'; }
    else { killEl.textContent = '[K] KILL — READY'; killEl.style.color = '#ff4444'; }
    const sabEl = document.getElementById('sus-sab-info');
    if (susKillCd <= 0 && !susSabotage) { sabEl.textContent = '[Tab] LIGHTS'; sabEl.style.display = ''; }
    else sabEl.style.display = 'none';
  } else {
    killEl.style.display = 'none';
    document.getElementById('sus-sab-info').style.display = 'none';
  }
  const sabBar = document.getElementById('sus-sabotage-bar');
  if (susSabotage) {
    sabBar.style.display = '';
    sabBar.innerHTML = `<span style="color:#ff8800">LIGHTS OUT — Fix at panel! ${Math.ceil(susSabotage.timer)}s</span>`;
  } else {
    sabBar.style.display = 'none';
  }
}

function updateSus(dt) {
  if (susOver) return;
  if (susKillCd > 0) susKillCd = Math.max(0, susKillCd - dt);
  if (susSabotage) {
    susSabotage.timer -= dt;
    if (susSabotage.timer <= 0) {
      susOver = true; showMessage('SABOTAGE FAILED — IMPOSTORS WIN!', 5000); doFlash(0xff0000, 0.9);
    }
  }
  // NPC impostors occasionally vent to reposition
  if (vents.length) {
    for (const npc of npcs) {
      if (!npc.isImp || npc.dead) continue;
      npc.ventCd = (npc.ventCd || 15 + Math.random() * 20) - dt;
      if (npc.ventCd <= 0) {
        npc.ventCd = 20 + Math.random() * 25;
        // Find nearest vent
        let nearDef = null, nearDist = Infinity;
        for (const v of vents) {
          const d = npc.mesh.position.distanceTo(v.userData.worldPos);
          if (d < nearDist) { nearDist = d; nearDef = v.userData.def; }
        }
        if (nearDef && nearDef.links.length && nearDist < TILE * 5) {
          const destId = nearDef.links[Math.floor(Math.random() * nearDef.links.length)];
          const dest = POLUS_VENTS.find(v => v.id === destId);
          if (dest) {
            npc.mesh.position.x = dest.col * TILE + TILE / 2;
            npc.mesh.position.z = dest.row * TILE + TILE / 2;
            npc.path = null;
          }
        }
      }
    }
  }
  // NPC impostors kill lone crewmates (and the player)
  for (const npc of npcs) {
    if (!npc.isImp || npc.dead) continue;
    npc.killCd = Math.max(0, (npc.killCd || 0) - dt);
    if (npc.killCd > 0) continue;

    // Try to kill the player first if they're in range and unwitnessed
    if (!player.dead && !playerIsImp) {
      if (npc.mesh.position.distanceTo(player.pos) <= SUS_KILL_RANGE) {
        const crewWitness = npcs.some(n => !n.isImp && !n.dead &&
          n.mesh.position.distanceTo(npc.mesh.position) < SUS_WITNESS_RANGE);
        if (!crewWitness) {
          susKillPlayer(npc);
          npc.killCd = SUS_IMP_KILL_CD;
          continue;
        }
      }
    }

    for (const target of npcs) {
      if (target.isImp || target.dead) continue;
      if (npc.mesh.position.distanceTo(target.mesh.position) > SUS_KILL_RANGE) continue;
      const playerWitness = !player.dead && player.pos.distanceTo(npc.mesh.position) < SUS_WITNESS_RANGE;
      const crewWitness = npcs.some(n => !n.isImp && !n.dead && n !== target &&
        n.mesh.position.distanceTo(npc.mesh.position) < SUS_WITNESS_RANGE);
      if (!playerWitness && !crewWitness) {
        susKillNPC(target, npc);
        npc.killCd = SUS_IMP_KILL_CD;
        break;
      }
    }
  }

  // NPC crewmates report dead bodies they walk near
  if (!susMeeting && !susOver) {
    for (const npc of npcs) {
      if (npc.isImp || npc.dead) continue;
      for (const dh of deadHeads) {
        if (dh.carriedBy) continue;
        const d = Math.hypot(
          npc.mesh.position.x - dh.grp.position.x,
          npc.mesh.position.z - dh.grp.position.z
        );
        if (d < 2.5) {
          showMessage(`${colorNameOf(npc.color).toUpperCase()} REPORTED A BODY!`, 2000);
          doFlash(0xff8800, 0.5);
          startMeeting();
          break;
        }
      }
      if (susMeeting) break;
    }
  }

  updateSusHUD();
}

// ─── Sus meeting / voting ─────────────────────────────────────────────────────
function colorNameOf(hex) {
  return (AU_COLORS.find(c => c.hex === hex) || {name:'???'}).name;
}

function meetingEntities() {
  const list = [];
  list.push({ id:'player', color:chosenColor, label:'You', isImp:playerIsImp, dead:player.dead });
  npcs.forEach((n,i) => list.push({ id:`npc${i}`, color:n.color, label:colorNameOf(n.color), isImp:n.isImp, dead:n.dead, npc:n }));
  return list;
}

function startMeeting() {
  if (susMeeting) return;
  susMeeting = { phase:'voting', timer:15, votes:{}, playerVoted:false, ejected:null };
  susMeeting.entities = meetingEntities().filter(e => !e.dead);

  for (const dh of deadHeads) scene.remove(dh.grp);
  deadHeads = [];

  renderMeetingUI();
  document.getElementById('meeting-ui').style.display = 'flex';
  document.exitPointerLock();

  // Schedule NPC votes (random delay 2-9s)
  for (const e of susMeeting.entities) {
    if (e.id === 'player') continue;
    const delay = 2000 + Math.random() * 7000;
    setTimeout(() => {
      if (!susMeeting || susMeeting.phase !== 'voting') return;
      const others = susMeeting.entities.filter(o => o.id !== e.id);
      if (!others.length) return;
      // Imps vote for a random crewmate; crew vote randomly
      const pool = e.isImp ? others.filter(o => !o.isImp) : others;
      const pick  = (pool.length ? pool : others)[Math.floor(Math.random() * (pool.length || others.length))];
      castVote(e.id, pick.id);
    }, delay);
  }
}

function renderMeetingUI() {
  const grid = document.getElementById('meeting-grid');
  grid.innerHTML = '';
  for (const e of susMeeting.entities) {
    const tile = document.createElement('div');
    tile.className = 'mtile';
    tile.dataset.eid = e.id;
    tile.innerHTML = `
      <div class="mtile-avatar" style="background:#${e.color.toString(16).padStart(6,'0')}"></div>
      <div class="mtile-name">${e.label}</div>
      <div class="mtile-votes" id="mvotes-${e.id}"></div>`;
    if (e.id !== 'player') {
      tile.addEventListener('click', () => {
        if (!susMeeting || susMeeting.playerVoted || susMeeting.phase !== 'voting') return;
        castVote('player', e.id);
      });
    }
    grid.appendChild(tile);
  }
  document.getElementById('meeting-result-text').textContent = '';
  document.getElementById('meeting-timer-display').textContent = '15';
  document.getElementById('meeting-skip-btn').onclick = () => {
    if (!susMeeting || susMeeting.playerVoted || susMeeting.phase !== 'voting') return;
    castVote('player', 'skip');
  };
}

function castVote(voterId, targetId) {
  if (!susMeeting) return;
  susMeeting.votes[voterId] = targetId;
  if (voterId === 'player') susMeeting.playerVoted = true;
  refreshVoteTiles();
}

function refreshVoteTiles() {
  if (!susMeeting) return;
  // Count votes per target
  const counts = {};
  for (const t of Object.values(susMeeting.votes)) counts[t] = (counts[t]||0) + 1;
  for (const e of susMeeting.entities) {
    const el = document.getElementById(`mvotes-${e.id}`);
    if (el) el.textContent = '●'.repeat(counts[e.id]||0);
  }
  // Highlight player's choice
  document.querySelectorAll('.mtile').forEach(t => t.classList.remove('mtile-chosen'));
  if (susMeeting.playerVoted) {
    const chosen = susMeeting.votes['player'];
    const tile = document.querySelector(`.mtile[data-eid="${chosen}"]`);
    if (tile) tile.classList.add('mtile-chosen');
  }
}

function endVoting() {
  if (!susMeeting) return;
  susMeeting.phase = 'results';
  susMeeting.timer = 5;

  const counts = {};
  for (const t of Object.values(susMeeting.votes)) counts[t] = (counts[t]||0) + 1;
  // Find highest vote count (excluding 'skip')
  let maxVotes = 0, ejectedId = null;
  for (const [id, n] of Object.entries(counts)) {
    if (id === 'skip') continue;
    if (n > maxVotes) { maxVotes = n; ejectedId = id; }
    else if (n === maxVotes) ejectedId = null; // tie
  }

  const skipCount = counts['skip'] || 0;
  if (skipCount > maxVotes) ejectedId = null;

  susMeeting.ejected = ejectedId;
  const resultEl = document.getElementById('meeting-result-text');
  document.getElementById('meeting-skip-btn').style.display = 'none';
  document.getElementById('meeting-timer-display').textContent = '';

  if (!ejectedId) {
    resultEl.textContent = 'No one was ejected.';
  } else {
    const e = susMeeting.entities.find(x => x.id === ejectedId);
    const wasImp = e ? e.isImp : false;
    resultEl.innerHTML = `<span style="color:#${e ? e.color.toString(16).padStart(6,'0') : 'fff'}">${e ? e.label : '?'}</span> was ejected.<br>${wasImp ? 'They were an Impostor.' : 'They were not an Impostor.'}`;
  }

  // Tint chosen tile
  document.querySelectorAll('.mtile').forEach(t => {
    const eid = t.dataset.eid;
    if (eid === ejectedId) t.classList.add('mtile-ejected');
  });
}

function endMeeting() {
  const ejectedId = susMeeting ? susMeeting.ejected : null;
  susMeeting = null;
  document.getElementById('meeting-ui').style.display = 'none';
  document.getElementById('meeting-skip-btn').style.display = '';
  canvas.requestPointerLock();

  if (ejectedId) {
    if (ejectedId === 'player') {
      player.dead = true;
      player.mesh.visible = false;
      showMessage('YOU WERE EJECTED', 3000);
    } else {
      const idx = parseInt(ejectedId.replace('npc',''));
      const npc = npcs[idx];
      if (npc) { npc.dead = true; npc.mesh.visible = false; }
    }
  }
  checkSusWin();
  updateSusHUD();
  updateCrewDots();
}

function updateMeeting(dt) {
  if (!susMeeting) return;
  susMeeting.timer -= dt;
  const timerEl = document.getElementById('meeting-timer-display');
  if (susMeeting.phase === 'voting') {
    if (timerEl) timerEl.textContent = Math.ceil(Math.max(0, susMeeting.timer));
    if (susMeeting.timer <= 0) endVoting();
  } else {
    if (susMeeting.timer <= 0) endMeeting();
  }
}

// ─── PVP ──────────────────────────────────────────────────────────────────────
function makeWeaponMesh(type) {
  const grp = new THREE.Group();
  if (type === 'pistol') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.18,0.12,0.35),
      new THREE.MeshLambertMaterial({color:0xddbb00}));
    body.position.y = 0.06;
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.25,6),
      new THREE.MeshLambertMaterial({color:0x888888}));
    barrel.rotation.x = Math.PI/2; barrel.position.set(0,0.06,0.28);
    grp.add(body, barrel);
    grp.add(new THREE.PointLight(0xffdd00,0.8,2));
  } else {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.45,7),
      new THREE.MeshLambertMaterial({color:0x7b3f0e}));
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.07,0.25,7),
      new THREE.MeshLambertMaterial({color:0xb05a20}));
    club.position.y = 0.35; grp.add(handle, club);
    grp.add(new THREE.PointLight(0xff8800,0.8,2));
  }
  return grp;
}

function fireBullet(pos, dir, team) {
  const col = team === 'blue' ? 0x44aaff : 0xff2200;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09,5,4),
    new THREE.MeshBasicMaterial({color:col}));
  const light = new THREE.PointLight(col,1.5,3);
  mesh.add(light); mesh.position.copy(pos); scene.add(mesh);
  bullets.push({ mesh, vel: dir.clone().multiplyScalar(PVP_BULLET_SPEED), team, ttl:1.4 });
}

function damagePVPFighter(f) {
  if (f.dead || f.damageCooldown > 0) return;
  f.hp--; f.damageCooldown = 0.5;
  if (f.hp <= 0) {
    f.dead = true;
    const dh = makeDeadHead(f.color);
    dh.position.copy(f.mesh.position); dh.position.y = 0.4;
    scene.add(dh); f.mesh.visible = false;
    updatePVPTeamHUD(); checkPVPWin();
  }
}

function spawnPVPWeapons() {
  const spX = mapDef.spawn.x*TILE+TILE/2, spZ = mapDef.spawn.z*TILE+TILE/2;
  const open = getOpenCells().filter(c =>
    Math.hypot(c.wx-spX, c.wz-spZ) > TILE*2 &&
    !trapCells.some(t => Math.hypot(c.wx-t.pos.x, c.wz-t.pos.z) < TILE)
  );
  shuffle(open);
  const types = ['pistol','pistol','pistol','pistol','pistol','pistol',
                  'melee','melee','melee','melee','melee','melee'];
  for (let i = 0; i < Math.min(types.length, open.length); i++) {
    const mesh = makeWeaponMesh(types[i]);
    mesh.position.set(open[i].wx, 0.25, open[i].wz);
    scene.add(mesh);
    wPickups.push({ mesh, type: types[i] });
  }
}

function initPVP() {
  const spX = mapDef.spawn.x*TILE+TILE/2, spZ = mapDef.spawn.z*TILE+TILE/2;
  const open = getOpenCells().filter(c => Math.hypot(c.wx-spX,c.wz-spZ) > TILE);
  shuffle(open);
  for (let i = 0; i < 4 && i < open.length; i++) {
    const mesh = makeCrewmate(chosenColor, 'none');
    mesh.position.set(open[i].wx, 0, open[i].wz); scene.add(mesh);
    pvpBlue.push({ mesh, team:'blue', color:chosenColor,
      hp:3, dead:false, damageCooldown:0, weapon:null, path:[], pathStep:0, pathTimer:0 });
  }
  for (let i = 4; i < 9 && i < open.length; i++) {
    const mesh = makeCrewmate(0xc51111, 'none');
    mesh.position.set(open[i].wx, 0, open[i].wz); scene.add(mesh);
    pvpRed.push({ mesh, team:'red', color:0xc51111,
      hp:3, dead:false, damageCooldown:0, weapon:null, path:[], pathStep:0, pathTimer:0 });
  }
  spawnPVPWeapons();
  player.weapon = { type: 'pistol', ammo: PVP_PISTOL_AMMO, cd: 0 };
  updateWeaponHUD(); updatePVPTeamHUD();
}

function pvpPathTo(f, x, z, dt) {
  f.pathTimer = (f.pathTimer||0) - dt;
  if (f.pathTimer <= 0 || f.path.length === 0) {
    npcComputePath(f, x, z);
    f.pathTimer = 0.8 + Math.random()*0.4;
  }
  npcFollowPath(f, dt, 0, PVP_AI_SPEED);
}

function updatePVPFighter(f, dt) {
  if (f.dead) return;
  f.damageCooldown = Math.max(0, f.damageCooldown - dt);
  if (f.weapon) f.weapon.cd = Math.max(0, f.weapon.cd - dt);

  const enemyList = f.team === 'blue' ? pvpRed : pvpBlue;
  let nearTarget = null, nearDist = Infinity, targetPlayer = false;
  for (const e of enemyList) {
    if (e.dead) continue;
    const d = f.mesh.position.distanceTo(e.mesh.position);
    if (d < nearDist) { nearDist = d; nearTarget = e; }
  }
  if (f.team === 'red' && !player.dead) {
    const d = f.mesh.position.distanceTo(player.pos);
    if (d < nearDist) { nearDist = d; nearTarget = null; targetPlayer = true; }
  }
  const nearPos = targetPlayer ? player.pos : (nearTarget ? nearTarget.mesh.position : null);

  if (!f.weapon) {
    if (wPickups.length > 0) {
      let best = null, bestD = Infinity;
      for (const wp of wPickups) {
        const d = f.mesh.position.distanceTo(wp.mesh.position);
        if (d < bestD) { bestD = d; best = wp; }
      }
      if (bestD < 1.3) {
        f.weapon = { type: best.type, ammo: best.type === 'pistol' ? PVP_PISTOL_AMMO : Infinity, cd: 0 };
        scene.remove(best.mesh); wPickups.splice(wPickups.indexOf(best), 1);
      } else { pvpPathTo(f, best.mesh.position.x, best.mesh.position.z, dt); }
    } else if (nearPos) { pvpPathTo(f, nearPos.x, nearPos.z, dt); }
    return;
  }

  if (!nearPos) return;

  if (f.weapon.type === 'pistol') {
    if (f.weapon.ammo <= 0) { f.weapon = null; return; }
    if (nearDist <= PVP_PISTOL_RANGE && f.weapon.cd <= 0) {
      const dir = new THREE.Vector3().subVectors(nearPos, f.mesh.position).setY(0).normalize();
      fireBullet(f.mesh.position.clone().setY(0.8), dir, f.team);
      f.weapon.ammo--; f.weapon.cd = PVP_SHOOT_CD;
      f.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    } else if (nearDist > PVP_PISTOL_RANGE * 0.6) {
      pvpPathTo(f, nearPos.x, nearPos.z, dt);
    }
  } else {
    if (nearDist < PVP_MELEE_RANGE && f.weapon.cd <= 0) {
      if (nearTarget) damagePVPFighter(nearTarget);
      else damagePlayer();
      f.weapon.cd = PVP_MELEE_CD;
    } else { pvpPathTo(f, nearPos.x, nearPos.z, dt); }
  }
}

function pvpPlayerAttack() {
  if (!pvpMode || player.dead || !player.weapon || player.weapon.cd > 0) return;
  const aimDir = new THREE.Vector3(Math.sin(camYaw), 0, Math.cos(camYaw));
  if (player.weapon.type === 'pistol') {
    if (player.weapon.ammo <= 0) { showMessage('EMPTY!', 800); return; }
    const firePos = player.pos.clone().add(aimDir.clone().multiplyScalar(0.6)).setY(0.8);
    fireBullet(firePos, aimDir, 'blue');
    player.weapon.ammo--; player.weapon.cd = PVP_SHOOT_CD;
    doFlash(0x88ccff, 0.1);
  } else {
    let hit = false;
    for (const f of pvpRed) {
      if (!f.dead && player.pos.distanceTo(f.mesh.position) < PVP_MELEE_RANGE) {
        damagePVPFighter(f); hit = true;
      }
    }
    if (!hit) showMessage('MISS', 600);
    player.weapon.cd = PVP_MELEE_CD;
    doFlash(0xffaa00, 0.12);
  }
  updateWeaponHUD();
}

function updatePVP(dt) {
  for (const wp of wPickups) wp.mesh.rotation.y += dt * 1.5;

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.ttl -= dt; b.mesh.position.addScaledVector(b.vel, dt);
    let hit = b.ttl <= 0 || blocked(b.mesh.position.x, b.mesh.position.z, 0.12);
    if (!hit) {
      const targets = b.team === 'blue' ? pvpRed : pvpBlue;
      for (const t of targets) {
        if (!t.dead && Math.hypot(b.mesh.position.x-t.mesh.position.x, b.mesh.position.z-t.mesh.position.z) < 1.0) {
          damagePVPFighter(t); hit = true; break;
        }
      }
      if (!hit && b.team === 'red' && !player.dead &&
          Math.hypot(b.mesh.position.x-player.pos.x, b.mesh.position.z-player.pos.z) < 1.0) {
        damagePlayer(); hit = true;
      }
    }
    if (hit) { scene.remove(b.mesh); bullets.splice(i, 1); }
  }

  for (const f of pvpBlue) updatePVPFighter(f, dt);
  for (const f of pvpRed)  updatePVPFighter(f, dt);

  for (const trap of trapCells) {
    trap.cooldown = Math.max(0, trap.cooldown - dt);
    if (trap.cooldown > 0) continue;
    for (const f of [...pvpBlue, ...pvpRed]) {
      if (!f.dead && Math.hypot(f.mesh.position.x-trap.pos.x, f.mesh.position.z-trap.pos.z) < TILE*0.38) {
        damagePVPFighter(f); trap.cooldown = TRAP_DMG_CD; break;
      }
    }
  }

  updateWeaponHUD(); updatePVPTeamHUD();
}

function updateWeaponHUD() {
  if (!pvpWeaponEl) return;
  if (!player.weapon) pvpWeaponEl.textContent = '— no weapon —';
  else if (player.weapon.type === 'pistol') pvpWeaponEl.textContent = `PISTOL  ×${player.weapon.ammo}`;
  else pvpWeaponEl.textContent = 'MELEE';
}

function updatePVPTeamHUD() {
  if (!pvpTeamsEl) return;
  const bAlive = pvpBlue.filter(f=>!f.dead).length + (player.dead ? 0 : 1);
  const rAlive = pvpRed.filter(f=>!f.dead).length;
  pvpTeamsEl.innerHTML =
    `<span style="color:#44aaff">BLUE ${bAlive}</span>  vs  <span style="color:#ff4444">RED ${rAlive}</span>`;
}

function checkPVPWin() {
  if (pvpOver) return;
  if (pvpRed.every(f=>f.dead)) {
    pvpOver = true; showMessage('BLUE TEAM WINS!', 5000); openElevator();
  } else if (pvpBlue.every(f=>f.dead) && player.dead) {
    pvpOver = true; showMessage('RED TEAM WINS!', 5000); openElevator();
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
