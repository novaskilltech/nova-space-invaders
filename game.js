const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

window.onerror = function(msg, url, line, col, error) {
  console.error("Global Error:", msg, "at", line, ":", col);
  const overlay = document.getElementById("overlay");
  const msgEl = document.getElementById("overlayMessage");
  if (overlay && msgEl) {
    overlay.style.display = "flex";
    msgEl.innerText = "ERREUR SYSTÈME :\n" + msg + "\nLigne: " + line;
    msgEl.style.color = "#ff6474";
  }
};

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  
  if (type === 'shoot') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'explosion') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.2);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'powerup') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.1);
    osc.frequency.setValueAtTime(880, now + 0.2);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'enemyShoot') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.1);
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

function getBottomSafeMargin() {
  return window.innerWidth <= 900 ? 128 : 16;
}

function resizeCanvas() {
  const area = canvas.parentElement;
  const w = area.clientWidth;
  const h = area.clientHeight;
  canvas.width = Math.max(320, w);
  canvas.height = Math.max(360, h);
  
  if (player) {
    const safeBottom = getBottomSafeMargin();
    player.x = Math.max(16, Math.min(canvas.width - player.width - 16, canvas.width / 2 - player.width / 2));
    player.y = canvas.height - player.height - safeBottom - 10;
  }
}

window.addEventListener("resize", resizeCanvas);

const ui = {
  score: document.getElementById("score"),
  highScore: document.getElementById("highScore"),
  lives: document.getElementById("lives"),
  wave: document.getElementById("wave"),
  weapon: document.getElementById("weapon"),
  weaponTimer: document.getElementById("weaponTimer"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayMessage: document.getElementById("overlayMessage"),
  startButton: document.getElementById("startButton"),
  pauseButton: document.getElementById("pauseButton"),
};

const imagePaths = {
  player: null,
  enemy: null,
  boss: null,
};

const keys = new Set();
const STAR_COUNT = 90;
const SHIPS = {
  nova: { id: "nova", color: "#00f2ff", speed: 420, invul: 1200, width: 78, height: 78, weapon: "normal" },
  viper: { id: "viper", color: "#ff00ff", speed: 540, invul: 1000, width: 68, height: 84, weapon: "rapid" },
  goliath: { id: "goliath", color: "#ffb84d", speed: 320, invul: 1800, width: 90, height: 70, weapon: "spread" },
  phantom: { id: "phantom", color: "#c264ff", speed: 480, invul: 1400, width: 72, height: 72, weapon: "plasma" },
  orion: { id: "orion", color: "#7af2ff", speed: 380, invul: 1600, width: 84, height: 80, weapon: "triple" }
};
let selectedGameMode = "space"; // "space" (Nova Space Invaders 3D) ou "tank" (Nova Tank Assault 360°)
let selectedShipId = "nova";
let selectedTankId = "grizzly";
let selectedTankThemeId = "ww2";
let selectedWeaponId = "normal";
let selectedBiomeId = "campagne";
let selectedDifficulty = 5; // Valeur de 1 à 10
let selectedStartWave = 1;
let terrainOffset3D = 0;

// ======================================================
// CONFIGURATION JEU 2 : NOVA TANK ASSAULT (360° & 8 ÉCRANS)
// ======================================================
const TANKS = {
  grizzly: {
    id: "grizzly",
    name: "M4 Grizzly",
    hullColor: "#4d7c0f",
    trimColor: "#a3e635",
    speed: 330,
    livesBonus: 1,
    width: 68,
    height: 82,
    weapon: "normal",
    forwardGun: true, // Tire aussi droit devant en plus de la tourelle 360°
    barrels: 1
  },
  vulcan: {
    id: "vulcan",
    name: "Vulcan Hellfire",
    hullColor: "#b45309",
    trimColor: "#fbbf24",
    speed: 410,
    livesBonus: 0,
    width: 64,
    height: 78,
    weapon: "rapid",
    forwardGun: true,
    barrels: 2
  },
  mammoth: {
    id: "mammoth",
    name: "Mammoth Titan",
    hullColor: "#334155",
    trimColor: "#f97316",
    speed: 270,
    livesBonus: 3,
    width: 80,
    height: 92,
    weapon: "plasma",
    forwardGun: true,
    barrels: 2
  },
  tesla: {
    id: "tesla",
    name: "Tesla Prism",
    hullColor: "#0e7490",
    trimColor: "#00f2ff",
    speed: 350,
    livesBonus: 1,
    width: 68,
    height: 82,
    weapon: "railgun",
    forwardGun: false,
    barrels: 1
  },
  cerberus: {
    id: "cerberus",
    name: "Cerberus Hydra",
    hullColor: "#581c87",
    trimColor: "#c084fc",
    speed: 370,
    livesBonus: 1,
    width: 72,
    height: 84,
    weapon: "triple",
    forwardGun: true,
    barrels: 3
  }
};

const TANK_THEMES = {
  ww2: {
    id: "ww2",
    label: "🪖 WW2 1944",
    sectorTitle: "Front Normandie // Bocage & Bunkers",
    freq: "RADIO: 42.6 MHz // ALLIED-HQ",
    enemyName: "GÉNÉRAL IRON-KREUZ // PANZER",
    enemyAvatar: "warlord_kaelen.png",
    pilotName: "SGT. MILLER // DIVISION BLINDÉE",
    pilotAvatar: "pilot_valentin.png",
    groundColor: "#2d3a24",
    roadColor: "#4a4336",
    roadBorder: "#6b604c",
    bankColor: "#1f2b16",
    accentColor: "#a3e635",
    taunts: [
      "Nos bunkers du Mur de l'Atlantique et nos chars Tigre stopperont votre colonne !",
      "Les canons antichars Pak-40 sont embusqués dans chaque haie du bocage !",
      "Votre blindé ne franchira jamais les 8 kilomètres jusqu'à notre QG !",
      "Alerte générale ! Déployez le train blindé et les divisions Panzer !"
    ],
    pilotQuotes: [
      "Tourelle parée à 360° ! On va percer vos lignes jusqu'au dernier bunker !",
      "Escadrille de bombardiers B-17 en attente sur canal radio !",
      "En avant toute ! Les canons latéraux ne nous arrêteront pas !"
    ],
    enemyReactions: [
      "Impossible ! Son canon balaye nos tranchées sur les deux flancs !",
      "Attention, il appelle un tapis de bombes allié ! À couvert !",
      "Repliez les Panzers vers la forteresse de fin de secteur !"
    ]
  },
  desert: {
    id: "desert",
    label: "🏜️ Désert",
    sectorTitle: "Opération Tempête de Sable // Dunes",
    freq: "SAT-COM: 215.0 MHz // DESERT-STORM",
    enemyName: "WARLORD SCORPION // DUNE-CORPS",
    enemyAvatar: "warlord_kaelen.png",
    pilotName: "CAPT. REYES // SCORPION-1",
    pilotAvatar: "pilot_valentin.png",
    groundColor: "#9a6b32",
    roadColor: "#b88a4d",
    roadBorder: "#d6a868",
    bankColor: "#7c511e",
    accentColor: "#fbbf24",
    taunts: [
      "Les dunes brûlantes engloutiront vos chenilles avant l'oasis fortifiée !",
      "Nos buggies lance-missiles et tourelles SAM vous encerclent de tous côtés !",
      "La tempête du désert cache nos escadrons blindés lourds !",
      "Vous n'atteindrez jamais le puits central vivant !"
    ],
    pilotQuotes: [
      "Filtres à sable activés, canon rotatif verrouillé sur vos buggies !",
      "A-10 Thunderbolt prêt pour une frappe aérienne sur les dunes !",
      "On roule à plein régime, rien n'arrête la colonne blindée Nova !"
    ],
    enemyReactions: [
      "Il tire en roulant dans toutes les directions ! Dispersion !",
      "Nos raffineries brûlent ! Envoyez les hélicoptères d'assaut !",
      "Maudit blindé ! Le Goliath du Désert va t'écraser !"
    ]
  },
  alien: {
    id: "alien",
    label: "🛸 Alien Xéno",
    sectorTitle: "Zone Xéno-Tech // Cratères Plasma",
    freq: "XENO-WAVE: 990.4 THz // ORBIT-GRID",
    enemyName: "ARCHON XYLOS // NEXUS-MÈRE",
    enemyAvatar: "warlord_thalassor.png",
    pilotName: "CDR. VALENTIN // XENO-HUNTER",
    pilotAvatar: "pilot_morgan.png",
    groundColor: "#140b29",
    roadColor: "#231542",
    roadBorder: "#00f2ff",
    bankColor: "#0a0417",
    accentColor: "#00f2ff",
    taunts: [
      "Vos chenilles primitives profanent notre réseau de pylônes plasma !",
      "Nos Tripodes et drones arachnides vont désintégrer votre blindage !",
      "La ruche technologique s'étend sur 8 secteurs, vous êtes condamné !",
      "Contemplez la puissance des citadelles antigravité !"
    ],
    pilotQuotes: [
      "Blindage réactif chargé ! On va éteindre vos pylônes un par un !",
      "Frégates orbitales parées au largage de bombes antimatière !",
      "Votre technologie alien ne résiste pas au calibre Nova !"
    ],
    enemyReactions: [
      "Anomalie ! Ce char terrestre détruit nos tripodes sur 360 degrés !",
      "Alerte orbitale ! Bombardement massif détecté sur la grille !",
      "Activez le Léviathan Xéno à la fin du couloir !"
    ]
  },
  predator: {
    id: "predator",
    label: "🩸 Predator Hunt",
    sectorTitle: "Jungle Bio-Hunt // Ruche & Chasseurs",
    freq: "THERMAL: 66.6 MHz // BIO-TRACKER",
    enemyName: "YAUTJA-PRIME // CLAN ALPHA",
    enemyAvatar: "warlord_thalassor.png",
    pilotName: "MAJ. DUTCH // JUNGLE-TANK",
    pilotAvatar: "pilot_morgan.png",
    groundColor: "#0d2618",
    roadColor: "#1d3828",
    roadBorder: "#ef4444",
    bankColor: "#06170e",
    accentColor: "#ef4444",
    taunts: [
      "Nos chasseurs camouflés vous observent depuis la jungle avec leurs viseurs tri-laser...",
      "Votre char fait un beau trophée de chasse pour le Clan Alpha !",
      "Dans cette jungle acide, vous êtes la proie et nous sommes les prédateurs !",
      "Si ça saigne ou si ça perd de l'huile... nous pouvons le tuer !"
    ],
    pilotQuotes: [
      "Scanner thermique activé ! Vos capes d'invisibilité ne vous sauveront pas !",
      "Largage de napalm aérien imminent sur toute la jungle !",
      "Approchez, les monstres, ma tourelle tourne plus vite que vos griffes !"
    ],
    enemyReactions: [
      "Rrrrgh ! Il a repéré nos chasseurs furtifs dans les arbres !",
      "Le ciel brûle ! Leurs bombardiers rasent nos totems de chasse !",
      "Le Seigneur Alpha Predator t'attend au bout de la piste !"
    ]
  }
};

const BIOMES = {
  campagne: {
    id: "campagne",
    label: "🌾 Campagne 3D",
    sectorTitle: "Secteur Beauce // Golden Hour",
    freq: "FREQ: 142.80 MHz // BIO-SWARM",
    enemyName: "QUEEN-VESPA-IX // ESSAIM",
    enemyAvatar: "warlord_kaelen.png",
    pilotName: "LT. VALENTIN // ALOUETTE",
    pilotAvatar: "pilot_valentin.png",
    skyTop: "#120c18",
    skyBottom: "#45230e",
    gridColor: "rgba(245, 158, 11, 0.32)",
    horizonGlow: "rgba(245, 158, 11, 0.55)",
    enemyTypes: ["wasp_drone", "harvester_mech", "beetle_tank", "locust_swarm"],
    taunts: [
      "Vos pâturages bucoliques alimenteront nos moteurs larvaires, humain !",
      "Les moissonneuses-mécas vont raser vos collines jusqu'au dernier épi !",
      "L'essaim bio-mécanique couvre le soleil couchant. Rendez-vous !",
      "Vos moulins ne tourneront plus jamais après notre passage !"
    ],
    pilotQuotes: [
      "Pas sur ma garde, les insectes ! Goûtez au plasma !",
      "Ciblage du vaisseau-moissonneur verrouillé. Feu à volonté !",
      "Quittez nos champs immédiatement ou subissez la foudre Nova !"
    ],
    enemyReactions: [
      "Krrrzz ! Vos tirs ne font qu'irriter la ruche mère !",
      "Alerte essaim ! Ce pilote résiste, déployez les Guêpes Blindées !",
      "Insolent Terrien ! Nos carapaces absorberont ton énergie !"
    ]
  },
  montagne: {
    id: "montagne",
    label: "🏔️ Montagne 3D",
    sectorTitle: "Secteur Mont-Blanc // 4 810m",
    freq: "FREQ: 288.40 MHz // CRYO-LINK",
    enemyName: "WARLORD KAELEN // CRYO",
    enemyAvatar: "warlord_kaelen.png",
    pilotName: "LT. VALENTIN // ALPINE",
    pilotAvatar: "pilot_valentin.png",
    skyTop: "#030914",
    skyBottom: "#0c2540",
    gridColor: "rgba(56, 189, 248, 0.35)",
    horizonGlow: "rgba(56, 189, 248, 0.5)",
    enemyTypes: ["frost_wyvern", "rock_golem", "stealth_raptor", "ice_shard"],
    taunts: [
      "Les crêtes glacées du Mont-Blanc deviendront le tombeau de votre escadron !",
      "Nos Golems de roche et Wyvernes de givre règnent sur les sommets !",
      "La tempête alpine gèlera vos réacteurs avant la vague suivante !",
      "Abandonnez les cols ou soyez ensevelis sous une avalanche de plasma !"
    ],
    pilotQuotes: [
      "Les Alpes appartiennent à l'humanité, Kaelen ! Voyons si tu résistes à l'acier !",
      "Propulseurs cryo à pleine puissance ! Verrouillage du croiseur ennemi !",
      "Repliez-vous au-delà de la stratosphère ou soyez pulvérisés !"
    ],
    enemyReactions: [
      "Impossible ! Comment ton vaisseau résiste-t-il au froid absolu ?!",
      "Wyvernes de givre, en piqué immédiat sur cet intercepteur !",
      "La montagne tremble... mais notre flotte de glace est éternelle !"
    ]
  },
  ocean: {
    id: "ocean",
    label: "🌊 Océan 3D",
    sectorTitle: "Fosse des Mariannes // -3 450m",
    freq: "SONAR: 88.20 kHz // ABYSS-LINK",
    enemyName: "THALASSOR // KRAKEN",
    enemyAvatar: "warlord_thalassor.png",
    pilotName: "CDR. MORGAN // SIREN",
    pilotAvatar: "pilot_morgan.png",
    skyTop: "#010710",
    skyBottom: "#002b3d",
    gridColor: "rgba(0, 242, 255, 0.32)",
    horizonGlow: "rgba(0, 242, 255, 0.55)",
    enemyTypes: ["manta_ray", "leviathan_mech", "kraken_drone", "jelly_mine"],
    taunts: [
      "Insolent respirateur d'air ! La pression des abysses écrasera ta coque !",
      "Nos Léviathans et Raies-Mantas bio-électriques dominent les océans !",
      "Les courants bioluminescents seront votre dernier spectacle !",
      "Cédez les sources hydrothermales ou sombrez dans les ténèbres !"
    ],
    pilotQuotes: [
      "Nos coques sont forgées pour les abysses, Thalassor ! Torpilles parées !",
      "Arcs Tesla chargés à 880V. Ciblage des tentacules du Kraken !",
      "Retourne dans les fosses tectoniques, monstre des profondeurs !"
    ],
    enemyReactions: [
      "Grrrgl ! Ses armes de cavitation percent nos écailles blindées !",
      "Lâchez les Mines-Méduses et encerclez ce chasseur amphibie !",
      "La colère de l'Océan t'engloutira tôt ou tard, Commandant Morgan !"
    ]
  }
};

const PLAYER_FIRE_DELAY = 190;
const ENEMY_FIRE_BASE = 0.0028;

const state = {
  running: false,
  paused: false,
  score: 0,
  highScore: 0,
  lives: 3,
  wave: 1,
  stars: [],
  lastFrame: 0,
  lastShotAt: 0,
  enemyDirection: 1,
  enemySpeed: 30,
  enemyDropDistance: 18,
  enemyShots: [],
  shots: [],
  particles: [],
  images: {},
  boss: null,
  teaseBoss: null,
  playerInvulnerableUntil: 0,
  powerups: [],
  showingQuestion: false,
  currentQuestion: null,
  currentWaveBonus: 0,
  flawless: true,
  isCinematic: false,
  lastCommAt: 0,
  mouseActive: false,
  mouseTargetX: 0,
  mouseTargetY: 0,
  mouseDown: false,
  // État Tank Assault (Défilement 8 écrans + Tourelle 360° + Bombardiers)
  tankDistance: 0,
  tankTargetDistance: 4800,
  tankSpawnCursor: 0,
  tankProps: [],
  tankTracks: [],
  airstrikes: 2,
  bomberRun: null,
  turretAngle: -Math.PI / 2,
  lastForwardShotAt: 0,
};

const WEAPONS = {
  normal: { name: "Agro-Laser / Obus", color: "#00f2ff", delay: 185, speed: 580, width: 6 },
  rapid: { name: "Twin Gatling", color: "#ffb84d", delay: 95, speed: 680, width: 5 },
  triple: { name: "Triple Harpon", color: "#10b981", delay: 215, speed: 540, width: 5 },
  spread: { name: "Cryo-Faisceau", color: "#38bdf8", delay: 260, speed: 500, width: 8 },
  plasma: { name: "Canon Plasma", color: "#c264ff", delay: 320, speed: 440, width: 14 },
  railgun: { name: "Railgun Tesla", color: "#00ffcc", delay: 270, speed: 880, width: 10, pierce: true },
  deflagration: { name: "Torpille / Obus HE", color: "#ff4422", delay: 420, speed: 360, width: 18, explosion: true },
  bomb: { name: "Méga Bombe", color: "#ffaa00", delay: 580, speed: 300, width: 48, height: 48, explosion: true, explosionHeight: 80 },
  fragbomb: { name: "Cluster Bomb", color: "#ffffff", delay: 460, speed: 340, width: 12, frag: true },
};

const powerupTypes = ["rapid", "triple", "spread", "plasma", "railgun", "deflagration", "bomb", "fragbomb", "invincibility", "clone", "airstrike"];

const player = {
  width: 78,
  height: 78,
  x: canvas.width / 2 - 39,
  y: canvas.height - 108,
  vxTilt: 0,
  turretAngle: -Math.PI / 2,
  weapon: "normal",
  weaponTime: 0,
  cloneTime: 0,
  speed: 420,
  invul: 1200,
  color: "#00f2ff"
};

function applyShipSelection() {
  if (selectedGameMode === "tank") {
    const tank = TANKS[selectedTankId] || TANKS.grizzly;
    player.width = tank.width;
    player.height = tank.height;
    player.speed = tank.speed;
    player.invul = 1400;
    player.color = tank.trimColor;
    player.hullColor = tank.hullColor;
    player.id = tank.id;
    player.forwardGun = tank.forwardGun;
    player.barrels = tank.barrels || 1;
    const chosenWpn = selectedWeaponId && WEAPONS[selectedWeaponId] ? selectedWeaponId : tank.weapon;
    player.baseWeapon = chosenWpn;
    player.weapon = chosenWpn;
    return;
  }
  const ship = SHIPS[selectedShipId] || SHIPS.nova;
  player.width = ship.width;
  player.height = ship.height;
  player.speed = ship.speed;
  player.invul = ship.invul;
  player.color = ship.color;
  player.id = ship.id;
  const chosenWpn = selectedWeaponId && WEAPONS[selectedWeaponId] ? selectedWeaponId : ship.weapon;
  player.baseWeapon = chosenWpn;
  player.weapon = chosenWpn;
}

let enemies = [];

function makeStars() {
  state.stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 18 + 10,
    twinkleSpeed: Math.random() * 3 + 1,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function bootstrapAssets() {
  const v = "?v=5";
  state.images.nova = await loadImage("ship_nova.png" + v);
  state.images.viper = await loadImage("ship_swift.png" + v);
  state.images.goliath = await loadImage("ship_titan.png" + v);
  state.images.phantom = await loadImage("ship_ghost.png" + v);
  state.images.orion = await loadImage("ship_orion.png" + v);

  // Décors 3D 4K par Biome
  state.images.bg_campagne = await loadImage("bg_campagne_4k.jpg" + v);
  state.images.bg_montagne = await loadImage("bg_montagne_4k.jpg" + v);
  state.images.bg_ocean = await loadImage("bg_ocean_4k.jpg" + v);

  // Ennemis 3D 4K détourés par Biome
  state.images.wasp_drone = await loadImage("enemy_campagne_wasp_4k.png" + v);
  state.images.locust_swarm = state.images.wasp_drone;
  state.images.harvester_mech = await loadImage("enemy_campagne_harvester_4k.png" + v);
  state.images.beetle_tank = state.images.harvester_mech;

  state.images.frost_wyvern = await loadImage("enemy_montagne_wyvern_4k.png" + v);
  state.images.stealth_raptor = state.images.frost_wyvern;
  state.images.rock_golem = await loadImage("enemy_montagne_golem_4k.png" + v);
  state.images.ice_shard = state.images.rock_golem;

  state.images.manta_ray = await loadImage("enemy_ocean_manta_4k.png" + v);
  state.images.leviathan_mech = state.images.manta_ray;
  state.images.kraken_drone = await loadImage("enemy_ocean_kraken_4k.png" + v);
  state.images.jelly_mine = state.images.kraken_drone;

  state.images.squid = await loadImage("enemy_squid.png" + v);
  state.images.crab = await loadImage("enemy_crab.png" + v);
  state.images.octopus = await loadImage("enemy_octopus.png" + v);
  state.images.boss = await loadImage("boss_ship.png" + v);
  state.images.kamikaze = await loadImage("enemy_nova.png" + v);
  state.images.interceptor = await loadImage("enemy_nova.png" + v);

  // ======================================================
  // ASSETS 3D 4K PHOTORÉALISTES — NOVA TANK ASSAULT
  // ======================================================
  state.images.bg_tank_ww2 = await loadImage("bg_tank_ww2_4k.jpg" + v);
  state.images.bg_tank_desert = await loadImage("bg_tank_desert_4k.jpg" + v);
  state.images.bg_tank_alien = await loadImage("bg_tank_alien_4k.jpg" + v);
  state.images.bg_tank_predator = await loadImage("bg_tank_predator_4k.jpg" + v);

  state.images.tank_chassis = await loadImage("tank_chassis_4k.png" + v);
  state.images.tank_turret = await loadImage("tank_turret_4k.png" + v);
  state.images.tank_enemy_panzer = await loadImage("tank_enemy_panzer_4k.png" + v);
  state.images.tank_enemy_predator = await loadImage("tank_enemy_predator_4k.png" + v);
  state.images.tank_bomber = await loadImage("tank_bomber_4k.png" + v);
  state.images.tank_boss = await loadImage("tank_boss_4k.png" + v);
  draw();
}

function resetPlayer() {
  const safeBottom = getBottomSafeMargin();
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - safeBottom - 10;
  player.vxTilt = 0;
  state.mouseActive = false;
}

function isPlayerInvulnerable(timestamp) {
  return timestamp < state.playerInvulnerableUntil;
}

function createEnemyWave(wave) {
  const enemyList = [];
  const width = 40;
  const height = 38;
  const padding = 14;
  const enemiesPerRow = Math.max(1, Math.floor((canvas.width - 120) / 72));
  const numRows = Math.max(1, Math.min(6, 2 + Math.floor(wave / 3)));
  
  const totalWidth = enemiesPerRow * width + (enemiesPerRow - 1) * padding;
  const startX = (canvas.width - totalWidth) / 2;
  const startY = Math.min(185, 80 + (wave * 10));

  const biome = BIOMES[selectedBiomeId] || BIOMES.campagne;
  const bTypes = biome.enemyTypes;

  for (let row = 0; row < numRows; row += 1) {
    let type = "squid"; 
    if (row === 1 || row === 2) type = "crab";
    if (row >= 3) type = "octopus";

    const biomeClass = bTypes[row % bTypes.length];

    for (let col = 0; col < enemiesPerRow; col += 1) {
      let finalType = type;
      if (wave >= 3) {
        const rand = Math.random();
        if (rand < 0.12) finalType = "kamikaze";
        else if (rand < 0.24) finalType = "interceptor";
      }

      const depth3D = 0.88 + (row / Math.max(1, numRows)) * 0.24;

      enemyList.push({
        x: startX + col * (width + padding),
        y: startY + row * (height + padding),
        width: Math.round((finalType === "squid" ? 48 : finalType === "crab" ? 56 : finalType === "kamikaze" ? 44 : 58) * depth3D),
        height: Math.round((finalType === "squid" ? 48 : finalType === "crab" ? 46 : finalType === "kamikaze" ? 48 : 46) * depth3D),
        type: finalType,
        biomeClass,
        depth3D,
        phaseOffset: (row * 1.3) + (col * 0.7),
        hp: (finalType === "interceptor" || biomeClass === "harvester_mech" || biomeClass === "rock_golem" || biomeClass === "leviathan_mech") ? 3 : 1,
        dead: false,
        freeRoaming: finalType === "kamikaze" ? true : Math.random() < 0.06,
        vx: (Math.random() - 0.5) * 110,
        vy: 20 + Math.random() * 30,
        charging: false
      });
    }
  }

  let speedMult = 0.5 + (selectedDifficulty / 10);
  state.enemySpeed = (20 + (wave * 4)) * speedMult;
  state.enemyDropDistance = 20;
  state.enemyDirection = 1;
  return enemyList;
}

function spawnBoss() {
  const wave = state.wave;
  let name, hp, speed, fireChance, w, h;

  if (wave === 5) {
    name = "Crabe Titan";
    hp = 50;
    speed = 80;
    fireChance = 0.025;
    w = 240; h = 180;
    state.boss = {
      name, type: "crab", x: canvas.width / 2 - w / 2, y: 70, width: w, height: h,
      health: hp, maxHealth: hp, speed, direction: 1, fireChance, phase: 1, attackTimer: 0,
      lives: 2
    };
    return;
  }

  if (wave === 10) { 
    state.boss = {
      name: "Escadron Éclipse",
      type: "boss",
      isSquad: true,
      entities: [],
      speed: 180,
      fireChance: 0.03,
      invulnerable: false,
      maxTotalHP: 100
    };
    for (let i = 0; i < 5; i++) {
      state.boss.entities.push({
        x: 100 + i * (canvas.width - 200) / 4,
        y: 80,
        width: 60,
        height: 60,
        health: 20,
        maxHealth: 20,
        dead: false,
        phase: 1,
        stealth: false,
        stealthTimer: 0,
        direction: 1
      });
    }
    return;
  }

  if (wave === 15) { 
    name = "Kraken Spectral";
    hp = 100;
    speed = 160;
    fireChance = 0.05;
    w = 220; h = 220;
    state.boss = {
      name, type: "octopus", x: canvas.width / 2 - w / 2, y: 70, width: w, height: h,
      health: hp, maxHealth: hp, speed, direction: 1, fireChance, phase: 1, attackTimer: 0,
      lives: 2, multiShot: true
    };
    return;
  }

  if (wave === 20) { 
    name = "Calamar du Vide";
    hp = 150;
    speed = 220;
    fireChance = 0.06;
    w = 180; h = 260;
    state.boss = {
      name, type: "squid", x: canvas.width / 2 - w / 2, y: 70, width: w, height: h,
      health: hp, maxHealth: hp, speed, direction: 1, fireChance, phase: 1, attackTimer: 0,
      lives: 3, dash: true
    };
    return;
  }

  // Fallback
  state.boss = {
    name: "Dreadnought X",
    type: "boss",
    x: canvas.width / 2 - 200 / 2,
    y: 70,
    width: 200,
    height: 140,
    health: hp,
    maxHealth: hp,
    speed,
    direction: 1,
    fireChance,
    phase: 1,
    attackTimer: 0,
    lives: 2
  };
}

function initTankLevel(level) {
  const safeLevel = Math.max(1, Math.min(5, level));
  state.wave = safeLevel;
  state.tankDistance = 0;
  // Exactement 8 écrans de distance !
  state.tankTargetDistance = canvas.height * 8;
  state.tankSpawnCursor = 240;
  state.tankProps = [];
  state.tankTracks = [];
  state.bomberRun = null;
  state.airstrikes = Math.max(state.airstrikes || 2, 2);
  player.turretAngle = -Math.PI / 2;
  enemies = [];
  state.boss = null;

  // Pré-remplir les décors latéraux initiaux sur l'écran
  for (let y = 60; y < canvas.height; y += 110) {
    spawnTankSceneryPair(y);
  }
  // Premiers ennemis de patrouille
  spawnTankEncounter(safeLevel, 120);
}

function spawnTankSceneryPair(yPos) {
  const w = canvas.width;
  const roadMargin = Math.max(58, Math.min(130, w * 0.17));
  const theme = selectedTankThemeId;
  const typesByTheme = {
    ww2: ["bunker", "trench", "hedgerow", "crater"],
    desert: ["dune", "palm", "oilrig", "ruin"],
    alien: ["pylon", "crystal", "pod", "crater"],
    predator: ["jungle_tree", "totem", "hive", "acid_pool"]
  };
  const pool = typesByTheme[theme] || typesByTheme.ww2;

  // Rive gauche
  state.tankProps.push({
    side: "left",
    x: 10 + Math.random() * Math.max(16, roadMargin - 46),
    y: yPos,
    w: 36 + Math.random() * 18,
    h: 36 + Math.random() * 20,
    type: pool[Math.floor(Math.random() * pool.length)],
    seed: Math.random()
  });

  // Rive droite
  state.tankProps.push({
    side: "right",
    x: w - roadMargin + 8 + Math.random() * Math.max(16, roadMargin - 46),
    y: yPos + (Math.random() * 30 - 15),
    w: 36 + Math.random() * 18,
    h: 36 + Math.random() * 20,
    type: pool[Math.floor(Math.random() * pool.length)],
    seed: Math.random()
  });
}

function spawnTankEncounter(level, yStart = -50) {
  const w = canvas.width;
  const roadMargin = Math.max(58, Math.min(130, w * 0.17));
  const roadLeft = roadMargin + 14;
  const roadWidth = Math.max(140, w - roadMargin * 2 - 28);

  // 1. Tourelles ou embuscades sur les bas-côtés (qui obligent à tourner le canon à gauche/droite !)
  if (Math.random() < 0.78) {
    const leftSide = Math.random() < 0.5;
    const sideX = leftSide ? Math.max(10, roadMargin - 48) : Math.min(w - 54, w - roadMargin + 6);
    enemies.push({
      x: sideX,
      y: yStart,
      width: 46,
      height: 46,
      type: "side_turret",
      tankRole: "flank_turret",
      side: leftSide ? "left" : "right",
      hp: 2 + Math.floor(level / 2),
      maxHp: 2 + Math.floor(level / 2),
      dead: false,
      vx: 0,
      vy: 0,
      aimAngle: leftSide ? 0.4 : Math.PI - 0.4,
      cloaked: selectedTankThemeId === "predator" && Math.random() < 0.55
    });
  }

  // 2. Escouade sur la route ou les flancs (2 à 4 unités)
  const count = Math.min(4, 2 + Math.floor(Math.random() * 2) + Math.floor(level / 2));
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let role = "trooper";
    let hp = 1 + Math.floor(level / 3);
    let ew = 44;
    let eh = 44;
    if (roll < 0.32) {
      role = "light_vehicle";
      hp = 2 + Math.floor(level / 2);
      ew = 48;
      eh = 52;
    } else if (roll < 0.58) {
      role = "heavy_tank";
      hp = 4 + level;
      ew = 56;
      eh = 62;
    } else if (selectedTankThemeId === "predator" || roll < 0.75) {
      role = "hunter";
      hp = 3 + Math.floor(level / 2);
      ew = 46;
      eh = 48;
    }

    const ex = roadLeft + (i + 0.5) * (roadWidth / count) - ew / 2 + (Math.random() * 20 - 10);
    enemies.push({
      x: Math.max(roadLeft, Math.min(roadLeft + roadWidth - ew, ex)),
      y: yStart - i * 38,
      width: ew,
      height: eh,
      type: role === "heavy_tank" ? "crab" : role === "hunter" ? "kamikaze" : "squid",
      tankRole: role,
      hp,
      maxHp: hp,
      dead: false,
      vx: (Math.random() - 0.5) * (role === "light_vehicle" ? 130 : 55),
      vy: role === "light_vehicle" ? 75 : role === "hunter" ? 95 : 35,
      aimAngle: Math.PI / 2,
      cloaked: selectedTankThemeId === "predator" && role === "hunter",
      phaseOffset: Math.random() * Math.PI * 2
    });
  }
}

function spawnTankBoss(level) {
  const safeLevel = Math.max(1, Math.min(5, level));
  const bossConfigs = {
    1: { name: "BOSS NIV.1 — TRAIN BLINDÉ & BUNKER", hp: 70, w: 230, h: 120, speed: 95, fireChance: 0.035, lives: 2, style: "bunker_train" },
    2: { name: "BOSS NIV.2 — ESCADRON FAUCON NOIR", hp: 95, w: 210, h: 115, speed: 155, fireChance: 0.045, lives: 2, style: "gunship_duo" },
    3: { name: "BOSS NIV.3 — MASTODONTE GOLIATH MK-IV", hp: 130, w: 220, h: 135, speed: 115, fireChance: 0.05, lives: 2, style: "super_tank" },
    4: { name: "BOSS NIV.4 — SEIGNEUR ALPHA PREDATOR", hp: 160, w: 190, h: 130, speed: 185, fireChance: 0.06, lives: 2, style: "predator_lord" },
    5: { name: "BOSS FINAL NIV.5 — CITADELLE APOCALYPSE", hp: 220, w: 260, h: 150, speed: 130, fireChance: 0.07, lives: 3, style: "apocalypse_citadel" }
  };
  const cfg = bossConfigs[safeLevel] || bossConfigs[1];
  state.boss = {
    name: cfg.name,
    type: "boss",
    tankBossStyle: cfg.style,
    x: canvas.width / 2 - cfg.w / 2,
    y: 68,
    width: cfg.w,
    height: cfg.h,
    health: cfg.hp,
    maxHealth: cfg.hp,
    speed: cfg.speed,
    direction: 1,
    fireChance: cfg.fireChance,
    phase: 1,
    attackTimer: 0,
    lives: cfg.lives
  };
  playSound("powerup");
}

function triggerAirstrike() {
  if (selectedGameMode !== "tank" || !state.running || state.paused) return;
  if (state.airstrikes <= 0 || state.bomberRun) return;

  state.airstrikes -= 1;
  playSound("powerup");

  const w = canvas.width;
  const h = canvas.height;
  state.bomberRun = {
    y: h + 120,
    speed: 520,
    bombers: [
      { x: w * 0.22, offsetY: 40 },
      { x: w * 0.5, offsetY: 0 },
      { x: w * 0.78, offsetY: 40 }
    ],
    lastBombWaveY: h + 100
  };

  const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
  updateCommLinkBiome(
    tTheme.enemyReactions[1] || "Alerte bombardement aérien !",
    "Escadrille de bombardiers en approche ! Largage du tapis de bombes !"
  );
  syncUi();
}

function initGame() {
  state.score = 0;
  const baseLives = Math.max(2, 6 - Math.floor(selectedDifficulty / 2));
  const tankBonus = selectedGameMode === "tank" && TANKS[selectedTankId] ? TANKS[selectedTankId].livesBonus : 0;
  state.lives = baseLives + tankBonus;
  state.wave = selectedGameMode === "tank" ? Math.min(5, Math.max(1, selectedStartWave)) : selectedStartWave;
  state.shots = [];
  state.enemyShots = [];
  state.particles = [];
  state.boss = null;
  state.playerInvulnerableUntil = 0;
  state.powerups = [];
  state.showingQuestion = false;
  state.currentQuestion = null;
  state.airstrikes = 2;
  player.weapon = player.baseWeapon || "normal";
  player.weaponTime = 0;
  resetPlayer();

  if (selectedGameMode === "tank") {
    initTankLevel(state.wave);
  } else if (state.wave % 5 === 0) {
    spawnBoss();
    enemies = [];
  } else {
    enemies = createEnemyWave(state.wave);
  }
  makeStars();
  syncUi();
}

function syncUi() {
  ui.score.textContent = String(state.score);
  ui.highScore.textContent = String(state.highScore);
  ui.lives.textContent = String(state.lives);
  ui.wave.textContent = selectedGameMode === "tank" ? `${state.wave}/5` : String(state.wave);
  
  const biomeDisplay = document.getElementById("biomeDisplay");
  const waveLabel = document.getElementById("waveLabel");
  const sectorLabel = document.getElementById("sectorLabel");
  const airstrikeHudBox = document.getElementById("airstrikeHudBox");
  const airstrikeCount = document.getElementById("airstrikeCount");
  const mobAirCount = document.getElementById("mobAirCount");
  const tankMobileTurret = document.getElementById("tankMobileTurretControls");
  const switchGameMenuBtn = document.getElementById("switchGameMenuBtn");

  if (selectedGameMode === "tank") {
    const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
    if (biomeDisplay) biomeDisplay.textContent = tTheme.label;
    if (waveLabel) waveLabel.textContent = "Niveau";
    if (sectorLabel) sectorLabel.textContent = "Théâtre";
    if (airstrikeHudBox && window.innerWidth > 900) airstrikeHudBox.style.display = "block";
    if (airstrikeCount) airstrikeCount.textContent = String(state.airstrikes || 0);
    if (mobAirCount) mobAirCount.textContent = String(state.airstrikes || 0);
    if (tankMobileTurret) tankMobileTurret.style.display = "flex";
  } else {
    const biome = BIOMES[selectedBiomeId] || BIOMES.campagne;
    if (biomeDisplay) biomeDisplay.textContent = biome.label;
    if (waveLabel) waveLabel.textContent = "Vague";
    if (sectorLabel) sectorLabel.textContent = "Secteur 3D";
    if (airstrikeHudBox) airstrikeHudBox.style.display = "none";
    if (tankMobileTurret) tankMobileTurret.style.display = "none";
  }

  if (switchGameMenuBtn) {
    switchGameMenuBtn.style.display = (state.paused || !state.running) ? "inline-block" : "none";
  }

  if (ui.weapon) {
    const weapon = WEAPONS[player.weapon] || WEAPONS.normal;
    ui.weapon.textContent = weapon.name;
    ui.weapon.style.color = weapon.color;
    
    if (ui.weaponTimer && player.weaponTime > 0) {
      const remaining = player.weaponTime - performance.now();
      const percent = Math.max(0, remaining / 8000 * 100);
      ui.weaponTimer.style.width = percent + "%";
      ui.weaponTimer.style.backgroundColor = weapon.color;
    } else if (ui.weaponTimer) {
      ui.weaponTimer.style.width = "100%";
      ui.weaponTimer.style.backgroundColor = weapon.color;
    }
  }

  // Synchroniser les boutons d'armes du HUD
  document.querySelectorAll(".hud-wpn-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-weapon") === player.weapon);
  });
}

function updateCommLinkBiome(customEnemyLine, customPilotLine) {
  const activeSource = selectedGameMode === "tank"
    ? (TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2)
    : (BIOMES[selectedBiomeId] || BIOMES.campagne);

  document.body.setAttribute("data-biome", activeSource.id);
  document.body.setAttribute("data-game", selectedGameMode);

  const enemyAvatar = document.getElementById("commEnemyAvatar");
  const enemyName = document.getElementById("commEnemyName");
  const enemyText = document.getElementById("commEnemyText");
  const pilotAvatar = document.getElementById("commPilotAvatar");
  const pilotName = document.getElementById("commPilotName");
  const pilotText = document.getElementById("commPilotText");
  const freqEl = document.getElementById("commFreq");
  const sectorHint = document.getElementById("sectorHint");

  if (enemyAvatar) enemyAvatar.src = activeSource.enemyAvatar;
  if (enemyName) enemyName.textContent = activeSource.enemyName;
  if (enemyText) {
    const line = customEnemyLine || activeSource.taunts[(state.wave - 1) % activeSource.taunts.length];
    enemyText.textContent = `"${line}"`;
  }
  if (pilotAvatar) pilotAvatar.src = activeSource.pilotAvatar;
  if (pilotName) pilotName.textContent = activeSource.pilotName;
  if (pilotText && customPilotLine) {
    pilotText.textContent = `"${customPilotLine}"`;
  }
  if (freqEl) freqEl.textContent = activeSource.freq;
  if (sectorHint) sectorHint.textContent = activeSource.sectorTitle;

  const replyBtns = document.querySelectorAll(".comm-reply-btn");
  replyBtns.forEach((btn, idx) => {
    if (activeSource.pilotQuotes[idx]) {
      const icon = idx === 0 ? "⚡ " : idx === 1 ? "🎯 " : "🛡️ ";
      btn.textContent = icon + `"${activeSource.pilotQuotes[idx].slice(0, 34)}..."`;
    }
  });
}

function startGame() {
  console.log("startGame() called");
  try {
    if (!selectedShipId || !SHIPS[selectedShipId]) {
      selectedShipId = "nova";
    }
    applyShipSelection();
    initGame();
    updateCommLinkBiome();
    state.running = true;
    state.paused = false;
    state.lastFrame = performance.now();
    state.lastShotAt = 0;
    hideOverlay();
    syncUi();
    console.log("Starting game with", enemies.length, "enemies");
    requestAnimationFrame(loop);
    console.log("Game loop started");
  } catch (err) {
    console.error("Error in startGame:", err);
    throw err; // Will be caught by window.onerror
  }
}

function endGame(title, message) {
  state.running = false;
  state.paused = false;
  syncUi();
  showOverlay(title, message, "Relancer la mission");
}

function showOverlay(title, message, buttonLabel) {
  ui.overlayTitle.textContent = title;
  ui.overlayMessage.textContent = message;
  ui.startButton.textContent = buttonLabel;
  ui.overlay.style.display = "flex"; // Force l'affichage via inline style
  ui.overlay.classList.remove("hidden");
  
  const mob = document.getElementById("mobileControls");
  if (mob) mob.style.display = "none";
}

function hideOverlay() {
  ui.overlay.style.display = "none";
  ui.overlay.classList.add("hidden");
  
  const mob = document.getElementById("mobileControls");
  if (mob && window.innerWidth <= 900) mob.style.display = "flex";
}

function togglePause() {
  if (!state.running) {
    return;
  }

  state.paused = !state.paused;
  if (!state.paused) {
    state.lastFrame = performance.now();
    hideOverlay();
    requestAnimationFrame(loop);
  } else {
    showOverlay("Pause tactique", "Appuie sur P pour reprendre la bataille.", "Reprendre");
  }
  syncUi();
}

function firePlayerShot(timestamp) {
  const weapon = WEAPONS[player.weapon] || WEAPONS.normal;
  if (timestamp - state.lastShotAt < weapon.delay) {
    return;
  }
  
  playSound('shoot');

  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;
  const baseY = player.y + 6;
  const wpnKey = player.weapon;

  // MODE JEU 2 : NOVA TANK ASSAULT (Tourelle Rotative 360° + Canon Frontal)
  if (selectedGameMode === "tank") {
    const angle = typeof player.turretAngle === "number" ? player.turretAngle : -Math.PI / 2;
    const muzzleDist = 34;
    const mx = cx + Math.cos(angle) * muzzleDist;
    const my = cy + Math.sin(angle) * muzzleDist;
    const spd = weapon.speed;

    const pushDirectionalShot = (angOffset, speedMult = 1, extra = {}) => {
      const a = angle + angOffset;
      state.shots.push({
        x: mx - weapon.width / 2,
        y: my - weapon.width / 2,
        width: extra.width || weapon.width + 2,
        height: extra.height || weapon.width + 2,
        speed: spd * speedMult,
        vx: Math.cos(a) * spd * speedMult,
        vy: Math.sin(a) * spd * speedMult,
        angle: a,
        isTankShot: true,
        pierce: Boolean(weapon.pierce || extra.pierce),
        explosion: Boolean(weapon.explosion || extra.explosion),
        explosionRadius: extra.explosionRadius || (weapon.explosion ? 78 : 0),
        explosionHeight: weapon.explosionHeight || 0,
        frag: Boolean(weapon.frag || extra.frag),
        weapon: wpnKey
      });
    };

    if (wpnKey === "triple" || player.barrels === 3) {
      pushDirectionalShot(-0.18);
      pushDirectionalShot(0);
      pushDirectionalShot(0.18);
    } else if (wpnKey === "spread") {
      [-0.32, -0.16, 0, 0.16, 0.32].forEach(off => pushDirectionalShot(off, 0.94));
    } else if (wpnKey === "rapid" || player.barrels === 2) {
      const perpX = Math.cos(angle + Math.PI / 2) * 7;
      const perpY = Math.sin(angle + Math.PI / 2) * 7;
      state.shots.push({
        x: mx - perpX - 3, y: my - perpY - 3, width: 6, height: 6,
        speed: spd, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        angle, isTankShot: true, weapon: wpnKey
      });
      state.shots.push({
        x: mx + perpX - 3, y: my + perpY - 3, width: 6, height: 6,
        speed: spd, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        angle, isTankShot: true, weapon: wpnKey
      });
    } else {
      pushDirectionalShot(0);
    }

    // Arme de Châssis Frontale (tire tout droit pendant que la tourelle tourne à gauche/droite !)
    if (player.forwardGun && Math.abs(angle - (-Math.PI / 2)) > 0.18) {
      state.shots.push({
        x: cx - 3,
        y: player.y - 4,
        width: 6,
        height: 16,
        speed: 560,
        vx: 0,
        vy: -560,
        angle: -Math.PI / 2,
        isTankShot: true,
        weapon: wpnKey
      });
    }

    state.lastShotAt = timestamp;
    return;
  }

  if (wpnKey === "triple") {
    state.shots.push({ x: cx - 14, y: baseY, width: weapon.width, height: 18, speed: weapon.speed, vx: -65, weapon: wpnKey });
    state.shots.push({ x: cx - 2, y: baseY, width: weapon.width, height: 18, speed: weapon.speed, vx: 0, weapon: wpnKey });
    state.shots.push({ x: cx + 10, y: baseY, width: weapon.width, height: 18, speed: weapon.speed, vx: 65, weapon: wpnKey });
  } else if (wpnKey === "spread") {
    state.shots.push({ x: cx - 20, y: baseY + 4, width: weapon.width, height: 14, speed: weapon.speed * 0.9, vx: -140, weapon: wpnKey });
    state.shots.push({ x: cx - 10, y: baseY + 2, width: weapon.width, height: 15, speed: weapon.speed * 0.95, vx: -70, weapon: wpnKey });
    state.shots.push({ x: cx - 2, y: baseY, width: weapon.width, height: 18, speed: weapon.speed, vx: 0, weapon: wpnKey });
    state.shots.push({ x: cx + 8, y: baseY + 2, width: weapon.width, height: 15, speed: weapon.speed * 0.95, vx: 70, weapon: wpnKey });
    state.shots.push({ x: cx + 16, y: baseY + 4, width: weapon.width, height: 14, speed: weapon.speed * 0.9, vx: 140, weapon: wpnKey });
  } else if (wpnKey === "plasma") {
    state.shots.push({ x: cx - 7, y: baseY, width: weapon.width, height: 26, speed: weapon.speed, weapon: wpnKey });
  } else if (wpnKey === "railgun") {
    state.shots.push({ x: cx - 5, y: baseY - 10, width: weapon.width, height: 38, speed: weapon.speed, pierce: true, weapon: wpnKey });
  } else if (wpnKey === "deflagration") {
    state.shots.push({ x: cx - 9, y: baseY, width: weapon.width, height: 28, speed: weapon.speed, explosion: true, explosionRadius: 72, weapon: wpnKey });
  } else if (wpnKey === "bomb") {
    state.shots.push({ x: cx - weapon.width / 2, y: baseY - weapon.height + 10, width: weapon.width, height: weapon.height, speed: weapon.speed, explosion: true, explosionHeight: weapon.explosionHeight, weapon: wpnKey });
  } else if (wpnKey === "fragbomb") {
    state.shots.push({ x: cx - weapon.width / 2, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, frag: true, weapon: wpnKey });
  } else if (wpnKey === "rapid") {
    state.shots.push({ x: cx - 14, y: baseY + 4, width: weapon.width, height: 16, speed: weapon.speed, weapon: wpnKey });
    state.shots.push({ x: cx + 10, y: baseY + 4, width: weapon.width, height: 16, speed: weapon.speed, weapon: wpnKey });
  } else {
    state.shots.push({ x: cx - 3, y: baseY, width: weapon.width, height: 18, speed: weapon.speed, weapon: wpnKey });
  }
  
  if (player.cloneTime > performance.now()) {
    state.shots.push({ x: cx - 42, y: baseY + 10, width: weapon.width, height: 16, speed: weapon.speed, weapon: wpnKey });
    state.shots.push({ x: cx + 42, y: baseY + 10, width: weapon.width, height: 16, speed: weapon.speed, weapon: wpnKey });
  }

  state.lastShotAt = timestamp;
}

function fireEnemyShot(x, y, speed = 280, isBoss = false) {
  playSound('enemyShoot');
  state.enemyShots.push({
    x,
    y,
    width: 6,
    height: 18,
    speed,
  });
}

function addExplosion(x, y, color) {
  playSound('explosion');
  for (let index = 0; index < 12; index += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 180,
      vy: (Math.random() - 0.5) * 180,
      life: 0.55,
      color,
    });
  }
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function advanceWave() {
  state.levelCompleteAnimation = true;
  state.levelCompleteStartTime = performance.now();
  playSound('powerup');
  state.shots = [];
  state.enemyShots = [];
  state.powerups = [];
}

function showWaveComplete(wave) {
  let bonus = wave * 100;
  let subMsg = "";
  
  if (state.flawless) {
    const flawlessBonus = Math.floor(bonus * 0.5);
    bonus += flawlessBonus;
    subMsg = `\n⭐ BONUS FLAWLESS : +${flawlessBonus} pts (x1.5) ⭐`;
  }
  
  state.score += bonus;
  state.flawless = true; // Reset for next wave
  
  if (state.highScore === undefined || state.score > state.highScore) {
    state.highScore = state.score;
  }

  if (selectedGameMode === "tank") {
    if (wave >= 5) {
      state.paused = false;
      state.running = false;
      const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
      showOverlay(
        `🏆 VICTOIRE TOTALE — CAMPAGNE ${tTheme.label} TERMINÉE !`,
        `Tu as conquis les 5 Niveaux (40 écrans) et détruit la Citadelle Apocalypse !\nScore Final : ${state.score} | Record : ${state.highScore}${subMsg}`,
        "REJOUER LA CAMPAGNE"
      );
      state.wave = 1;
      return;
    }
    const nextLvl = wave + 1;
    state.airstrikes = (state.airstrikes || 0) + 1;
    updateCommLinkBiome();
    const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
    const msg = `Score: ${state.score} | Record: ${state.highScore}${subMsg}\n+1 Support Aérien (Bombardiers) accordé !\n\nNiveau ${nextLvl}/5 (8 écrans) prêt dans ${tTheme.label}.`;
    state.paused = true;
    state.showingQuestion = false;
    showOverlay(`Niveau ${wave}/5 Conquis ! +${bonus} pts`, msg, `Lancer Niveau ${nextLvl}/5`);
    return;
  }
  
  const nextWave = wave + 1;
  updateCommLinkBiome();
  const biome = BIOMES[selectedBiomeId] || BIOMES.campagne;
  let msg = `Score: ${state.score}\nRecord: ${state.highScore}${subMsg}\n\n`;
  msg += `Vague ${nextWave} : En approche dans ${biome.label}...\nTu peux aussi changer de Biome 3D ou d'Arme ci-dessous !`;
  
  state.paused = true;
  state.showingQuestion = false;
  showOverlay(`Vague ${wave} terminée ! +${bonus} pts`, msg, "Continuer");
}

const TAUNT_MESSAGES = [
  "Pauvre Terrien... Ta flotte ne t'a pas préparé à ça.",
  "Vous pensiez pouvoir survivre ? Quelle blague.",
  "La galaxie nous appartient. Prépare-toi à mourir.",
  "Ton petit vaisseau ne fera pas le poids face à mon Dreadnought."
];

function levelCompleteContinue() {
  hideOverlay();

  if (selectedGameMode === "tank") {
    state.running = true;
    state.paused = false;
    state.lastFrame = performance.now();
    state.shots = [];
    state.enemyShots = [];
    state.powerups = [];
    initTankLevel(state.wave);
    resetPlayer();
    syncUi();
    requestAnimationFrame(loop);
    return;
  }
  
  if (state.wave % 5 === 0) {
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("overlayTitle").style.display = "none";
    document.getElementById("overlayMessage").style.display = "none";
    if(document.getElementById("shipSelection")) document.getElementById("shipSelection").style.display = "none";
    if(document.getElementById("difficultySelection")) document.getElementById("difficultySelection").style.display = "none";
    if(document.getElementById("waveSelection")) document.getElementById("waveSelection").style.display = "none";
    if(document.getElementById("startButton")) document.getElementById("startButton").style.display = "none";
    
    const bossType = (state.wave / 5) === 1 ? "crab" : (state.wave / 5) === 2 ? "boss" : (state.wave / 5) === 3 ? "octopus" : "squid";
    const imgEl = document.querySelector(".taunt-portrait");
    const nameEl = document.querySelector(".taunt-name");
    
    if (bossType === "crab") nameEl.innerText = "Crabe Titan";
    else if (bossType === "octopus") nameEl.innerText = "Kraken Spectral";
    else if (bossType === "squid") nameEl.innerText = "Calamar du Vide";
    else nameEl.innerText = "Commandant Alien";

    imgEl.src = state.images[bossType] ? state.images[bossType].src : "boss_ship.png";

    const msg = TAUNT_MESSAGES[Math.floor(Math.random() * TAUNT_MESSAGES.length)];
    const textEl = document.getElementById("tauntText");
    textEl.innerHTML = "";
    
    let i = 0;
    const typeInterval = setInterval(() => {
      textEl.innerHTML += msg[i];
      i++;
      if (i >= msg.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          startBossLevel();
        }, 2000);
      }
    }, 50);
  } else {
    startNormalLevel();
  }
}

function startBossLevel() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("bossTaunt").style.display = "none";
  
  document.getElementById("overlayTitle").style.display = "block";
  document.getElementById("overlayMessage").style.display = "block";
  if(document.getElementById("shipSelection")) document.getElementById("shipSelection").style.display = "flex";
  if(document.getElementById("difficultySelection")) document.getElementById("difficultySelection").style.display = "block";
  if(document.getElementById("waveSelection")) document.getElementById("waveSelection").style.display = "block";
  if(document.getElementById("startButton")) document.getElementById("startButton").style.display = "block";
  
  state.running = true;
  state.paused = false;
  state.lastFrame = performance.now();
  state.shots = [];
  state.powerups = [];
  state.showingQuestion = false;
  
  state.teaseBoss = null;
  enemies = [];
  
  spawnBoss(); // Utilise la logique dynamique définie précédemment
  
  resetPlayer();
  syncUi();
  requestAnimationFrame(loop);
}

function startNormalLevel() {
  state.running = true;
  state.paused = false;
  state.lastFrame = performance.now();
  state.shots = [];
  state.powerups = [];
  state.showingQuestion = false;
  
  state.boss = null;
  state.teaseBoss = null;
  
  if (state.wave % 5 === 4) {
    enemies = createEnemyWave(state.wave);
    state.teaseBoss = {
      x: -200,
      y: 10,
      width: 160,
      height: 120,
      speed: 150 + (state.wave * 10)
    };
  } else {
    enemies = createEnemyWave(state.wave);
  }
  
  resetPlayer();
  syncUi();
  requestAnimationFrame(loop);
}

function handlePlayerHit() {
  state.lives -= 1;
  state.flawless = false;
  addExplosion(player.x + player.width / 2, player.y + player.height / 2, "#ff6474");
  if (state.lives <= 0) {
    endGame(
      "Mission perdue",
      `Score final : ${state.score}. Appuie sur R ou utilise le bouton pour relancer une nouvelles tentative.`
    );
    return;
  }

  resetPlayer();
  state.enemyShots = [];
  state.playerInvulnerableUntil = performance.now() + player.invul;
  keys.clear(); // Évite les touches bloquées après un choc
  syncUi();
}

function updateStars(delta) {
  const dt = delta / 1000;
  terrainOffset3D = (terrainOffset3D + dt * 95) % 80;

  state.stars.forEach((star) => {
    if (selectedBiomeId === "ocean") {
      // Dans l'océan, les bulles bioluminescentes remontent des abysses !
      star.y -= star.speed * 1.15 * dt;
      star.x += Math.sin(performance.now() * 0.002 + star.twinkleOffset) * 12 * dt;
      if (star.y < -10) {
        star.y = canvas.height + 10;
        star.x = Math.random() * canvas.width;
      }
    } else if (selectedBiomeId === "montagne") {
      // En montagne, les flocons de blizzard tombent en diagonale
      star.y += star.speed * 2.2 * dt;
      star.x -= star.speed * 0.65 * dt;
      if (star.y > canvas.height) {
        star.y = -star.size;
        star.x = Math.random() * canvas.width;
      }
      if (star.x < 0) star.x = canvas.width;
    } else {
      // Campagne : pollen doré & lucioles au crépuscule
      star.y += star.speed * 0.9 * dt;
      star.x += Math.cos(performance.now() * 0.0015 + star.twinkleOffset) * 8 * dt;
      if (star.y > canvas.height) {
        star.y = -star.size;
        star.x = Math.random() * canvas.width;
      }
    }
  });
}

function updatePlayer(delta, timestamp) {
  const dt = delta / 1000;
  const movingLeft = keys.has("ArrowLeft") || keys.has("q") || keys.has("Q");
  const movingRight = keys.has("ArrowRight") || keys.has("d") || keys.has("D");
  const movingUp = keys.has("ArrowUp") || keys.has("w") || keys.has("W") || keys.has("z") || keys.has("Z");
  const movingDown = keys.has("ArrowDown") || keys.has("s") || keys.has("S");

  // Touches de rotation du canon de la tourelle (A / E ou boutons mobiles ⟲ / ⟳)
  const turretTurnLeft = keys.has("a") || keys.has("A") || keys.has("TurretLeft");
  const turretTurnRight = keys.has("e") || keys.has("E") || keys.has("TurretRight");

  const anyDirectionKey = movingLeft || movingRight || movingUp || movingDown;

  let targetTilt = 0;

  if (selectedGameMode === "tank") {
    // En mode Tank : le tank roule sur la route centrale (ZQSD / Flèches) OU suit souplement si on glisse
    const roadMargin = Math.max(58, Math.min(130, canvas.width * 0.17));
    if (anyDirectionKey) {
      if (movingLeft) {
        player.x -= player.speed * dt;
        targetTilt = -0.14;
      }
      if (movingRight) {
        player.x += player.speed * dt;
        targetTilt = 0.14;
      }
      if (movingUp) {
        player.y -= player.speed * dt;
      }
      if (movingDown) {
        player.y += player.speed * dt;
      }
    } else if (state.mouseActive && state.mouseDown && window.innerWidth <= 900) {
      // Sur mobile en glissant sur l'écran : le tank s'aligne doucement tout en orientant le canon vers le doigt
      const desiredX = state.mouseTargetX - player.width / 2;
      player.x += (desiredX - player.x) * Math.min(1, dt * 4.5);
    }

    // Rotation de la tourelle à 360° (Souris/Doigt OU touches A/E / ⟲/⟳)
    if (turretTurnLeft) {
      player.turretAngle = (player.turretAngle || -Math.PI / 2) - 3.0 * dt;
      state.mouseActive = false;
    } else if (turretTurnRight) {
      player.turretAngle = (player.turretAngle || -Math.PI / 2) + 3.0 * dt;
      state.mouseActive = false;
    } else if (state.mouseActive) {
      const cx = player.x + player.width / 2;
      const cy = player.y + player.height / 2;
      player.turretAngle = Math.atan2(state.mouseTargetY - cy, state.mouseTargetX - cx);
    }

    // Traces de chenilles au sol pendant que le tank avance
    if (Math.random() < 0.45) {
      state.tankTracks.push({
        x: player.x + 10,
        y: player.y + player.height - 8,
        w: player.width - 20,
        life: 1.0
      });
    }

    const safeBottom = getBottomSafeMargin();
    player.x = Math.max(roadMargin - 8, Math.min(canvas.width - roadMargin - player.width + 8, player.x));
    player.y = Math.max(78, Math.min(canvas.height - player.height - safeBottom, player.y));
  } else {
    if (anyDirectionKey) {
      state.mouseActive = false;
    }

    if (state.mouseActive) {
      const desiredX = state.mouseTargetX - player.width / 2;
      const desiredY = state.mouseTargetY - player.height / 2;
      const dx = desiredX - player.x;
      const dy = desiredY - player.y;

      const followFactor = Math.min(1, dt * 16);
      player.x += dx * followFactor;
      player.y += dy * followFactor;

      targetTilt = Math.max(-0.28, Math.min(0.28, dx * 0.0045));
    } else {
      if (movingLeft || keys.has("a") || keys.has("A")) {
        player.x -= player.speed * dt;
        targetTilt = -0.22;
      }
      if (movingRight) {
        player.x += player.speed * dt;
        targetTilt = 0.22;
      }
      if (movingUp) {
        player.y -= player.speed * dt;
      }
      if (movingDown) {
        player.y += player.speed * dt;
      }
    }

    player.vxTilt = (player.vxTilt || 0) + (targetTilt - (player.vxTilt || 0)) * Math.min(1, dt * 12);

    const safeBottom = getBottomSafeMargin();
    player.x = Math.max(12, Math.min(canvas.width - player.width - 12, player.x));
    player.y = Math.max(58, Math.min(canvas.height - player.height - safeBottom, player.y));
  }

  // Tir hybride : Barre Espace OU Clic gauche de la souris / Tactile maintenu
  if (keys.has(" ") || keys.has("Spacebar") || state.mouseDown) {
    firePlayerShot(timestamp);
  }
}

function updateProjectiles(delta) {
  const dt = delta / 1000;

  state.shots = state.shots.filter((shot) => {
    if (typeof shot.vy === "number") {
      shot.y += shot.vy * dt;
    } else {
      shot.y -= shot.speed * dt;
    }
    if (shot.vx) {
      shot.x += shot.vx * dt;
    }
    const sh = shot.height || 18;
    return shot.y + sh > -40 && shot.y < canvas.height + 40 && shot.x > -60 && shot.x < canvas.width + 60;
  });

  state.enemyShots = state.enemyShots.filter((shot) => {
    if (typeof shot.vy === "number") {
      shot.y += shot.vy * dt;
    } else {
      shot.y += shot.speed * dt;
    }
    if (shot.vx) {
      shot.x += shot.vx * dt;
    }
    const sh = shot.height || 18;
    return shot.y + sh > -40 && shot.y < canvas.height + sh + 40 && shot.x > -60 && shot.x < canvas.width + 60;
  });
}

function updateBoss(delta) {
  const dt = delta / 1000;
  const boss = state.boss;
  if (!boss) return;

  if (boss.isSquad) {
    boss.entities.forEach(ent => {
      if (ent.dead) return;
      
      // Mouvement sinusoïdal individuel + direction globale
      ent.x += boss.speed * ent.direction * dt;
      ent.y = 80 + Math.sin(performance.now() * 0.002 + ent.x * 0.01) * 30;
      
      if (ent.x <= 50 || ent.x + ent.width >= canvas.width - 50) {
        ent.direction *= -1;
      }
      
      // Furtivité aléatoire
      if (performance.now() > ent.stealthTimer) {
        ent.stealth = !ent.stealth;
        ent.stealthTimer = performance.now() + (ent.stealth ? 2000 : 4000);
      }
      
      // Tir (Fréquence réduite pour équilibrage)
      const squadFireMult = 0.3 + (selectedDifficulty / 15);
      if (Math.random() < boss.fireChance * dt * 30 * squadFireMult) {
        fireEnemyShot(ent.x + ent.width / 2, ent.y + ent.height, 300, true);
      }
    });
    
    // Nettoyage et fin du boss
    boss.entities = boss.entities.filter(e => !e.dead);
    if (boss.entities.length === 0) {
      state.boss = null;
      if (!state.bossDefeatedDialog) {
        showBossDefeatedDialog("Escadron éliminé. Passage en hyper-espace imminent.");
      }
    }
    return;
  }

  // Comportement Boss Standard (Juggernaut, etc.)
  if (boss.invulnerable) {
    const elapsed = performance.now() - boss.transitionStart;
    const angle = (elapsed / 1000) * Math.PI * 2;
    boss.x = canvas.width / 2 - boss.width / 2 + Math.cos(angle) * 150;
    boss.y = 120 + Math.sin(angle * 2) * 50;
    
    if (elapsed > 3000) {
      boss.invulnerable = false;
    }
    return;
  }

  boss.x += boss.speed * boss.direction * dt;
  if (boss.x <= 50 || boss.x + boss.width >= canvas.width - 50) {
    boss.direction *= -1;
    if (boss.dash) {
      boss.x += boss.direction * 50; // Petit bond
      boss.speed = 300; // Accélération après le mur
      setTimeout(() => { if(state.boss) state.boss.speed = 220; }, 500);
    }
  }

  const fireMult = 0.4 + (selectedDifficulty / 12);
  if (Math.random() < boss.fireChance * fireMult) {
    if (boss.type === "crab") {
      // Tir des pinces
      fireEnemyShot(boss.x + 20, boss.y + boss.height * 0.7, 300, true);
      fireEnemyShot(boss.x + boss.width - 20, boss.y + boss.height * 0.7, 300, true);
    } else if (boss.type === "octopus") {
      // Tir en éventail
      for(let i = -1; i <= 1; i++) {
        state.enemyShots.push({
          x: boss.x + boss.width / 2,
          y: boss.y + boss.height - 20,
          width: 6, height: 18, speed: 280, vx: i * 80
        });
      }
    } else if (boss.type === "squid") {
      // Tir focalisé rapide
      fireEnemyShot(boss.x + boss.width / 2, boss.y + boss.height - 10, 450, true);
    } else {
      fireEnemyShot(boss.x + boss.width / 2, boss.y + boss.height - 10, 320, true);
    }
    
    if (boss.phase === 2 && Math.random() < 0.3) {
      const spreadChance = 0.2 + (selectedDifficulty / 15);
      if (Math.random() < spreadChance) {
        const vxSpread = 70 + (selectedDifficulty * 12);
        state.enemyShots.push({ x: boss.x + 15, y: boss.y + boss.height * 0.6, width: 6, height: 20, speed: 280, vx: -vxSpread });
        state.enemyShots.push({ x: boss.x + boss.width - 15, y: boss.y + boss.height * 0.6, width: 6, height: 20, speed: 280, vx: vxSpread });
      }
    }
  }
}

function updateTeaseBoss(delta) {
  const dt = delta / 1000;
  if (!state.teaseBoss) return;
  state.teaseBoss.x += state.teaseBoss.speed * dt;
  if (Math.random() < 0.03 + (state.wave * 0.002)) {
    fireEnemyShot(state.teaseBoss.x + state.teaseBoss.width / 2, state.teaseBoss.y + state.teaseBoss.height, 350, true);
  }
  if (state.teaseBoss.x > canvas.width + 50) {
    state.teaseBoss = null;
  }
}

function updateBomberRun(delta) {
  if (!state.bomberRun) return;
  const dt = delta / 1000;
  const run = state.bomberRun;
  run.y -= run.speed * dt;

  // Tapis de bombes pendant le survol des 3 bombardiers
  if (run.lastBombWaveY - run.y >= 65 && run.y > -40 && run.y < canvas.height + 40) {
    run.lastBombWaveY = run.y;
    run.bombers.forEach((b) => {
      const bx = b.x + (Math.random() * 60 - 30);
      const by = run.y + b.offsetY;
      addExplosion(bx, by, "#ffaa00");
      addExplosion(bx + 14, by - 10, "#ff4422");
    });

    // Détruire ou endommager lourdement tous les ennemis dans la bande de bombardement
    enemies.forEach((e) => {
      if (Math.abs((e.y + e.height / 2) - run.y) < 130) {
        e.hp -= 5;
        if (e.hp <= 0) {
          e.dead = true;
          state.score += 50;
          addExplosion(e.x + e.width / 2, e.y + e.height / 2, "#ffaa00");
        }
      }
    });
    enemies = enemies.filter((e) => !e.dead);

    // Nettoyer les tirs ennemis proches
    state.enemyShots = state.enemyShots.filter((s) => Math.abs(s.y - run.y) > 120);

    // Dégâts massifs au Boss s'il est présent
    if (state.boss && Math.abs((state.boss.y + state.boss.height / 2) - run.y) < 120) {
      damageBoss(8, state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#ffaa00");
    }
  }

  if (run.y < -180) {
    state.bomberRun = null;
  }
}

function updateEnemies(delta) {
  const dt = delta / 1000;

  // ======================================================
  // MODE JEU 2 : NOVA TANK ASSAULT (Défilement 8 écrans)
  // ======================================================
  if (selectedGameMode === "tank") {
    const scrollSpeed = state.boss ? 35 : 155;
    if (!state.boss) {
      state.tankDistance = Math.min(state.tankTargetDistance, state.tankDistance + scrollSpeed * dt);
    }

    // Faire défiler les décors latéraux et en générer de nouveaux
    state.tankProps.forEach((p) => {
      p.y += scrollSpeed * dt;
    });
    state.tankProps = state.tankProps.filter((p) => p.y < canvas.height + 90);
    if (Math.random() < dt * 2.4) {
      spawnTankSceneryPair(-60);
    }

    // Faire défiler les traces de chenilles
    state.tankTracks.forEach((t) => {
      t.y += scrollSpeed * dt;
      t.life -= dt * 0.65;
    });
    state.tankTracks = state.tankTracks.filter((t) => t.life > 0 && t.y < canvas.height + 40);

    // Générer des vagues d'ennemis tout au long des 8 écrans
    if (!state.boss && state.tankDistance < state.tankTargetDistance - 240) {
      if (state.tankDistance >= state.tankSpawnCursor || enemies.length === 0) {
        spawnTankEncounter(state.wave, -55);
        state.tankSpawnCursor = state.tankDistance + Math.max(230, 390 - state.wave * 22);
      }
    }

    // Arrivée au bout du 8ème écran (Distance 100%) -> Apparition du Boss de fin de niveau !
    if (!state.boss && state.tankDistance >= state.tankTargetDistance) {
      spawnTankBoss(state.wave);
    }

    const fireMult = 0.35 + selectedDifficulty / 7;
    const pCx = player.x + player.width / 2;
    const pCy = player.y + player.height / 2;

    enemies.forEach((enemy) => {
      const eCx = enemy.x + enemy.width / 2;
      const eCy = enemy.y + enemy.height / 2;
      enemy.aimAngle = Math.atan2(pCy - eCy, pCx - eCx);

      if (enemy.tankRole === "flank_turret") {
        // Tourelle fixe sur les bas-côtés : défile avec le terrain et vise le tank à 360°
        enemy.y += scrollSpeed * dt;
      } else if (enemy.tankRole === "hunter") {
        // Monstre / Chasseur style Predator : bondit vers le tank
        enemy.y += (scrollSpeed * 0.55 + enemy.vy) * dt;
        enemy.x += Math.cos(enemy.aimAngle) * 85 * dt;
      } else {
        // Blindé ou buggy ennemi sur la route
        enemy.y += (scrollSpeed * 0.42 + enemy.vy) * dt;
        enemy.x += enemy.vx * dt;
        const roadMargin = Math.max(58, Math.min(130, canvas.width * 0.17));
        if (enemy.x <= roadMargin + 6 || enemy.x + enemy.width >= canvas.width - roadMargin - 6) {
          enemy.vx *= -1;
        }
      }

      // Tir directionnel vers le tank du joueur
      if (enemy.y > 10 && enemy.y < canvas.height - 90 && Math.random() < 0.0042 * fireMult) {
        const spd = 250 + state.wave * 15;
        playSound("enemyShoot");
        state.enemyShots.push({
          x: eCx - 4,
          y: eCy - 4,
          width: 8,
          height: 8,
          speed: spd,
          vx: Math.cos(enemy.aimAngle) * spd,
          vy: Math.sin(enemy.aimAngle) * spd
        });
      }
    });

    enemies = enemies.filter((e) => !e.dead && e.y < canvas.height + 80);
    return true;
  }

  let shouldDrop = false;
  let lowestEnemyY = 0;

  enemies.forEach((enemy) => {
    if (enemy.type === "interceptor") {
      const targetX = player.x + (player.width / 2) - (enemy.width / 2);
      const lerpSpeed = 1.8;
      enemy.x += (targetX - enemy.x) * lerpSpeed * dt;
      // Interceptor doesn't drop, stays at fixed height
    } else if (enemy.type === "kamikaze") {
      const dx = (player.x + player.width/2) - (enemy.x + enemy.width/2);
      const dy = (player.y + player.height/2) - (enemy.y + enemy.height/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 350 || enemy.charging) {
        if (!enemy.charging) {
          enemy.charging = true;
          enemy.chargeAngle = Math.atan2(dy, dx);
        }
        enemy.x += Math.cos(enemy.chargeAngle) * (state.enemySpeed * 3) * dt;
        enemy.y += Math.sin(enemy.chargeAngle) * (state.enemySpeed * 3) * dt;
      } else {
        enemy.x += state.enemyDirection * state.enemySpeed * dt;
      }
    } else if (enemy.freeRoaming) {
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.vx *= -1;
      }
    } else {
      enemy.x += state.enemyDirection * state.enemySpeed * dt;
    }
    
    lowestEnemyY = Math.max(lowestEnemyY, enemy.y + enemy.height);
    
    if (enemy.type !== "interceptor" && !enemy.freeRoaming && (enemy.x <= 20 || enemy.x + enemy.width >= canvas.width - 20)) {
      shouldDrop = true;
    }

    let fireMult = 0.2 + (selectedDifficulty / 5);

    if (Math.random() < (ENEMY_FIRE_BASE + state.wave * 0.00015) * fireMult) {
      fireEnemyShot(enemy.x + enemy.width / 2, enemy.y + enemy.height - 8, 220 + state.wave * 8);
    }
  });

  if (shouldDrop) {
    state.enemyDirection *= -1;
    enemies.forEach((enemy) => {
      if (!enemy.freeRoaming) {
        enemy.y += state.enemyDropDistance;
      }
    });
  }

  const defenseLineY = canvas.height - getBottomSafeMargin();
  if (lowestEnemyY >= defenseLineY && enemies.length > 0) {
    endGame("Base submergée", "Les envahisseurs ont franchi la ligne de défense. Relance la mission.");
    return false;
  }

  return true;
}

function updateParticles(delta) {
  const dt = delta / 1000;

  state.particles = state.particles.filter((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    return particle.life > 0;
  });
}

function updatePowerups(delta) {
  const dt = delta / 1000;

  state.powerups = state.powerups.filter((pu) => {
    pu.y += 60 * dt;
    return pu.y < canvas.height + pu.height;
  });
}

function resolvePowerupCollisions() {
  state.powerups = state.powerups.filter((pu) => {
    if (rectsOverlap(pu, player)) {
      playSound('powerup');
      if (pu.type === "invincibility") {
        state.playerInvulnerableUntil = performance.now() + 8000;
        state.score += 100;
      } else if (pu.type === "clone") {
        player.cloneTime = performance.now() + 10000;
        state.score += 100;
      } else if (pu.type === "airstrike") {
        state.airstrikes = (state.airstrikes || 0) + 1;
        state.score += 150;
        syncUi();
      } else {
        player.weapon = pu.type;
        player.weaponTime = performance.now() + 8000;
      }
      return false;
    }
    return true;
  });
}

function drawPowerups() {
  state.powerups.forEach((pu) => {
    let color = "#ffffff";
    let text = pu.type[0].toUpperCase();
    if (WEAPONS[pu.type]) {
      color = WEAPONS[pu.type].color;
    } else if (pu.type === "invincibility") {
      color = "#ffff00";
      text = "I";
    } else if (pu.type === "clone") {
      color = "#00ffff";
      text = "C";
    } else if (pu.type === "airstrike") {
      color = "#f97316";
      text = "✈️";
    }
    
    const pulse = Math.sin(performance.now() * 0.008) * 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15 + pulse;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pu.x + pu.width / 2, pu.y);
    ctx.lineTo(pu.x + pu.width, pu.y + pu.height * 0.7);
    ctx.lineTo(pu.x + pu.width * 0.7, pu.y + pu.height);
    ctx.lineTo(pu.x + pu.width * 0.3, pu.y + pu.height);
    ctx.lineTo(pu.x, pu.y + pu.height * 0.7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, pu.x + pu.width / 2, pu.y + 16);

    ctx.shadowBlur = 0;
  });
}

function showBossDefeatedDialog(customMsg) {
  state.score += 1500;
  state.lives += 1;
  if (state.boss && !state.boss.isSquad) {
    addExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#4df2c2");
  }
  state.boss = null;

  if (selectedGameMode === "tank") {
    advanceWave();
    return;
  }

  state.bossDefeatedDialog = true;
  
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlayTitle").style.display = "none";
  document.getElementById("overlayMessage").style.display = "none";
  if(document.getElementById("shipSelection")) document.getElementById("shipSelection").style.display = "none";
  if(document.getElementById("difficultySelection")) document.getElementById("difficultySelection").style.display = "none";
  if(document.getElementById("waveSelection")) document.getElementById("waveSelection").style.display = "none";
  if(document.getElementById("startButton")) document.getElementById("startButton").style.display = "none";
  
  document.getElementById("bossTaunt").style.display = "flex";
  
  const msg = customMsg || "Notre monde est libre. La galaxie ne vous appartient pas !";
  const textEl = document.getElementById("tauntText");
  const nameEl = document.querySelector(".taunt-name");
  const imgEl = document.querySelector(".taunt-portrait");
  
  nameEl.innerText = "Pilote Nova";
  imgEl.src = state.images[player.id] ? state.images[player.id].src : "ship_vanguard.png";
  textEl.style.color = "#4df2c2";
  
  textEl.innerHTML = "";
  
  let i = 0;
  const typeInterval = setInterval(() => {
    textEl.innerHTML += msg[i];
    i++;
    if (i >= msg.length) {
      clearInterval(typeInterval);
      setTimeout(async () => {
        nameEl.innerText = "Commandant Alien";
        const bossType = (state.wave / 5) === 1 ? "crab" : (state.wave / 5) === 2 ? "boss" : (state.wave / 5) === 3 ? "octopus" : "squid";
        imgEl.src = state.images[bossType] ? state.images[bossType].src : "boss_ship.png";
        
        textEl.style.color = "#ffcccc";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("bossTaunt").style.display = "none";
        
        document.getElementById("overlayTitle").style.display = "block";
        document.getElementById("overlayMessage").style.display = "block";
        if(document.getElementById("shipSelection")) document.getElementById("shipSelection").style.display = "flex";
        if(document.getElementById("difficultySelection")) document.getElementById("difficultySelection").style.display = "block";
        if(document.getElementById("waveSelection")) document.getElementById("waveSelection").style.display = "block";
        if(document.getElementById("startButton")) document.getElementById("startButton").style.display = "block";
        
        state.bossDefeatedDialog = false;
        
        // Nouvelle cinématique de saut galactique
        await playGalaxyCinematic();
        
        advanceWave();
      }, 3000);
    }
  }, 50);
}

async function playGalaxyCinematic() {
  state.isCinematic = true;
  const overlay = document.getElementById("cutsceneOverlay");
  const ship = document.getElementById("cinematicShip");
  const text = document.getElementById("cinematicText");
  
  overlay.classList.remove("hidden");
  text.innerText = "Calcul du saut intergalactique...";
  
  await new Promise(r => setTimeout(r, 2000));
  
  text.innerText = "Saut vers le Secteur Saturne lancé !";
  ship.classList.add("ship-jump");
  
  await new Promise(r => setTimeout(r, 2500));
  
  overlay.classList.add("hidden");
  ship.classList.remove("ship-jump");
  state.isCinematic = false;
}

function damageBoss(amount, hitX, hitY, hitColor) {
  if (!state.boss) return;
  if (state.boss.invulnerable) return; // Prevent damage during loop
  
  state.boss.health -= amount;
  addExplosion(hitX, hitY, hitColor || "#ffb84d");
  if (state.boss.health <= 0) {
    if (state.boss.lives > 1) {
      state.boss.lives -= 1;
      state.boss.health = state.boss.maxHealth;
      state.boss.phase = 2;
      state.boss.speed *= 1.3;
      state.boss.fireChance *= 1.5;
      
      state.boss.invulnerable = true;
      state.boss.transitionStart = performance.now();
      
      for (let i = 0; i < 8; i++) {
        addExplosion(state.boss.x + Math.random() * state.boss.width, state.boss.y + Math.random() * state.boss.height, "#ff6474");
      }
    } else {
      showBossDefeatedDialog();
    }
  }
}

function resolveShotCollisions() {
  state.shots.forEach((shot) => {
    if (state.boss) {
      if (state.boss.isSquad) {
        state.boss.entities.forEach(ent => {
          if (!shot.hit && !ent.dead && rectsOverlap(shot, ent)) {
            shot.hit = true;
            ent.health -= 1;
            addExplosion(shot.x, shot.y, "#ffb84d");
            if (ent.health <= 0) {
              ent.dead = true;
              state.score += 500;
              for(let i=0; i<10; i++) addExplosion(ent.x + Math.random()*ent.width, ent.y + Math.random()*ent.height, "#ff6474");
            }
          }
        });
      } else if (rectsOverlap(shot, state.boss)) {
        shot.hit = true;
        damageBoss(1, shot.x, shot.y, "#ffb84d");
      }
    }

    enemies.forEach((enemy) => {
      if (!shot.hit && rectsOverlap(shot, enemy)) {
        if (!shot.pierce) {
          shot.hit = true;
        }
        
        if (shot.explosion && shot.explosionHeight) {
          const expY = shot.explosionHeight;
          const expCenterY = shot.y + shot.height / 2;
          const expCenterX = shot.x + shot.width / 2;
          const weaponColor = shot.weapon && WEAPONS[shot.weapon] ? WEAPONS[shot.weapon].color : "#ffaa00";
          
          const killedEnemies = [];
          for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            const inVerticalBand = e.y + e.height > shot.y && e.y < shot.y + expY;
            if (inVerticalBand) {
              killedEnemies.push(e);
            }
          }
          
          killedEnemies.forEach((e) => {
            e.dead = true;
            state.score += 100;
            addExplosion(e.x + e.width / 2, e.y + e.height / 2, weaponColor);
          });
          
          if (state.boss && shot.y < state.boss.y + state.boss.height && shot.y + expY > state.boss.y) {
            damageBoss(10, expCenterX, expCenterY, weaponColor);
          }
        } else if (shot.explosion && shot.explosionRadius) {
          const expRadius = shot.explosionRadius;
          const expX = shot.x + shot.width / 2;
          const expY = shot.y + shot.height / 2;
          const weaponColor = shot.weapon && WEAPONS[shot.weapon] ? WEAPONS[shot.weapon].color : "#ff4422";
          
          const killedEnemies = [];
          for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            const dist = Math.hypot((e.x + e.width / 2) - expX, (e.y + e.height / 2) - expY);
            if (dist < expRadius) {
              killedEnemies.push(e);
            }
          }
          
          killedEnemies.forEach((e) => {
            e.dead = true;
            state.score += 100;
            addExplosion(e.x + e.width / 2, e.y + e.height / 2, weaponColor);
          });
          
          if (state.boss) {
            const distBoss = Math.hypot((state.boss.x + state.boss.width / 2) - expX, (state.boss.y + state.boss.height / 2) - expY);
            if (distBoss < expRadius) {
              damageBoss(15, expX, expY, weaponColor);
            }
          }
        } else {
          enemy.hp -= 1;
          if (enemy.hp <= 0) {
            enemy.dead = true;
            let pts = 10;
            if (enemy.type === "squid") pts = 30;
            if (enemy.type === "crab") pts = 20;
            if (enemy.freeRoaming) pts *= 2;
            state.score += pts;
            addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, "#4df2c2");
          } else {
            addExplosion(shot.x, shot.y, "#ffffff");
          }
          if (shot.frag) {
            for(let i=0; i<8; i++) {
              const angle = (Math.PI * 2 / 8) * i;
              state.shots.push({
                x: enemy.x + enemy.width/2,
                y: enemy.y + enemy.height/2,
                width: 6,
                height: 6,
                speed: 300,
                vx: Math.cos(angle) * 200,
                vy: Math.sin(angle) * 200,
              });
            }
          }
        }

        if (enemy.dead && Math.random() < 0.18) {
          const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
          state.powerups.push({
            x: enemy.x + enemy.width / 2 - 12,
            y: enemy.y + enemy.height / 2,
            width: 24,
            height: 24,
            type,
          });
        }
      }
    });
  });

  enemies = enemies.filter((enemy) => !enemy.dead);
  state.shots = state.shots.filter((shot) => !shot.hit);

  if (selectedGameMode === "space") {
    if (!state.boss && enemies.length === 0 && !state.bossDefeatedDialog && !state.levelCompleteAnimation) {
      advanceWave();
    }
  }
}

function resolvePlayerCollisions(timestamp) {
  if (isPlayerInvulnerable(timestamp)) {
    state.enemyShots = state.enemyShots.filter((shot) => !rectsOverlap(shot, player));
    return;
  }

  let playerWasHit = false;

  state.enemyShots.forEach((shot) => {
    if (!playerWasHit && rectsOverlap(shot, player)) {
      shot.hit = true;
      playerWasHit = true;
      handlePlayerHit();
    }
  });
  state.enemyShots = state.enemyShots.filter((shot) => !shot.hit);

  if (!playerWasHit && state.boss && rectsOverlap(state.boss, player)) {
    playerWasHit = true;
    handlePlayerHit();
  }

  if (!playerWasHit) {
    enemies.forEach((enemy) => {
      if (!playerWasHit && rectsOverlap(enemy, player)) {
        playerWasHit = true;
        handlePlayerHit();
      }
    });
  }
}

function update(delta, timestamp) {
  if (!state.running || state.paused || state.isCinematic) {
    return;
  }

  if (state.levelCompleteAnimation) {
    const elapsed = timestamp - state.levelCompleteStartTime;
    const dt = delta / 1000;
    
    player.y -= (250 + elapsed * 2) * dt; // Un peu plus rapide
    keys.clear(); // Verrouille les contrôles pendant l'animation
    
    for (let i = 0; i < 2; i++) {
      state.particles.push({
        x: player.x + Math.random() * player.width,
        y: player.y + player.height,
        vx: (Math.random() - 0.5) * 50,
        vy: 800 + Math.random() * 400,
        life: 0.2,
        color: "#ffffff"
      });
    }

    if (player.y + player.height < -50 || elapsed > 2000) {
      state.levelCompleteAnimation = false;
      const completedWave = state.wave;
      state.wave += 1;
      state.running = false;
      showWaveComplete(completedWave);
    }
    
    updateStars(delta);
    updateParticles(delta);
    return;
  }

  if (player.weaponTime > 0 && timestamp > player.weaponTime) {
    player.weapon = player.baseWeapon || "normal";
    player.weaponTime = 0;
  }

  updateStars(delta);
  updatePlayer(delta, timestamp);
  updateProjectiles(delta);
  updatePowerups(delta);
  updateTeaseBoss(delta);
  updateBomberRun(delta);

  if (state.boss) {
    updateBoss(delta);
    if (selectedGameMode === "tank") {
      updateEnemies(delta);
    }
  } else if (!updateEnemies(delta)) {
    return;
  }

  updateParticles(delta);
  resolveShotCollisions();
  resolvePowerupCollisions();
  resolvePlayerCollisions(timestamp);
  syncUi();
}

function drawTankBattlefield(w, h, now) {
  const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
  const roadMargin = Math.max(58, Math.min(130, w * 0.17));
  const roadWidth = w - roadMargin * 2;
  const bgImg = state.images["bg_tank_" + selectedTankThemeId];
  const scrollY = (state.tankDistance || 0) % h;

  if (bgImg) {
    // 1. Défilement vertical continu (8 écrans) du décor 3D 4K photoréaliste !
    const panX = ((player.x + player.width / 2 - w / 2) / Math.max(1, w)) * -22;
    ctx.drawImage(bgImg, panX - 18, scrollY - h, w + 36, h + 2);
    ctx.drawImage(bgImg, panX - 18, scrollY, w + 36, h + 2);

    // Voile de profondeur cinématique pour faire ressortir les tirs et les blindés 3D
    const vignette = ctx.createLinearGradient(0, 0, w, 0);
    vignette.addColorStop(0, "rgba(4, 8, 16, 0.45)");
    vignette.addColorStop(0.2, "rgba(4, 8, 16, 0.12)");
    vignette.addColorStop(0.5, "rgba(4, 8, 16, 0.05)");
    vignette.addColorStop(0.8, "rgba(4, 8, 16, 0.12)");
    vignette.addColorStop(1, "rgba(4, 8, 16, 0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Lignes holographiques subtiles délimitant le couloir de roulage central
    ctx.strokeStyle = tTheme.accentColor;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(roadMargin, 0);
    ctx.lineTo(roadMargin, h);
    ctx.moveTo(w - roadMargin, 0);
    ctx.lineTo(w - roadMargin, h);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    // Fallback pendant le chargement initial
    const scrollOffset = (state.tankDistance || 0) % 80;
    ctx.fillStyle = tTheme.bankColor;
    ctx.fillRect(0, 0, w, h);
    const roadGrad = ctx.createLinearGradient(roadMargin, 0, w - roadMargin, 0);
    roadGrad.addColorStop(0, tTheme.bankColor);
    roadGrad.addColorStop(0.1, tTheme.roadColor);
    roadGrad.addColorStop(0.5, tTheme.groundColor);
    roadGrad.addColorStop(0.9, tTheme.roadColor);
    roadGrad.addColorStop(1, tTheme.bankColor);
    ctx.fillStyle = roadGrad;
    ctx.fillRect(roadMargin, 0, roadWidth, h);
    ctx.strokeStyle = tTheme.roadBorder;
    ctx.lineWidth = 2;
    for (let y = -80 + scrollOffset; y < h + 80; y += 80) {
      ctx.beginPath();
      ctx.moveTo(w * 0.5, y);
      ctx.lineTo(w * 0.5, y + 36);
      ctx.stroke();
    }
  }

  // 2. Traces de chenilles 3D laissées par le Tank au sol
  state.tankTracks.forEach((tr) => {
    ctx.fillStyle = `rgba(8, 12, 18, ${Math.max(0, tr.life * 0.52)})`;
    ctx.fillRect(tr.x + 4, tr.y, 12, 7);
    ctx.fillRect(tr.x + tr.w - 16, tr.y, 12, 7);
  });

  // 3. Particules d'ambiance 3D (Braises WW2, Sable du désert, Spores Predator, Énergie Alien)
  state.stars.forEach((star) => {
    const twinkle = 0.45 + Math.sin(now * 0.003 * star.twinkleSpeed + star.twinkleOffset) * 0.4;
    ctx.fillStyle = selectedTankThemeId === "alien"
      ? `rgba(0, 242, 255, ${twinkle})`
      : selectedTankThemeId === "predator"
      ? `rgba(132, 204, 22, ${twinkle})`
      : selectedTankThemeId === "desert"
      ? `rgba(251, 191, 36, ${twinkle})`
      : `rgba(249, 115, 22, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 1.25, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Barre de Progression des 8 Écrans (Kilométrage & Niveau)
  const progRatio = Math.min(1, (state.tankDistance || 0) / Math.max(1, state.tankTargetDistance || 4800));
  const currentScreen = Math.min(8, Math.floor(progRatio * 8) + 1);
  const barW = Math.min(340, w * 0.62);
  const barX = w / 2 - barW / 2;
  const barY = 58;

  ctx.save();
  ctx.fillStyle = "rgba(5, 10, 20, 0.84)";
  ctx.fillRect(barX - 8, barY - 14, barW + 16, 26);
  ctx.strokeStyle = tTheme.accentColor;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(barX - 8, barY - 14, barW + 16, 26);

  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(barX, barY, barW, 6);
  ctx.fillStyle = tTheme.accentColor;
  ctx.fillRect(barX, barY, barW * progRatio, 6);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  const statusTxt = state.boss
    ? `⚠️ ZONE BOSS ATTEINTE (ÉCRAN 8/8) — NIVEAU ${state.wave}/5`
    : `NIVEAU ${state.wave}/5 • PROGRESSION : ÉCRAN ${currentScreen}/8 (${Math.round(progRatio * 100)}%) • [B] BOMBARDIERS: ${state.airstrikes}`;
  ctx.fillText(statusTxt, w / 2, barY - 3);
  ctx.restore();
}

function drawPlayerTank(entity, now) {
  const cx = entity.x + entity.width / 2;
  const cy = entity.y + entity.height / 2;
  const w = entity.width;
  const h = entity.height;
  const tankCfg = TANKS[selectedTankId] || TANKS.grizzly;
  const chassisImg = state.images.tank_chassis;
  const turretImg = state.images.tank_turret;
  const angle = typeof player.turretAngle === "number" ? player.turretAngle : -Math.PI / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // 1. Ombre portée 3D réaliste au sol + Halo tactique de la couleur du blindé choisi
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  ctx.beginPath();
  ctx.ellipse(0, 6, w * 0.54, h * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = tankCfg.trimColor;
  ctx.shadowBlur = 14;

  // 2. Châssis 3D 4K (avec inclinaison légère quand le tank tourne à gauche/droite)
  ctx.save();
  const tilt = player.vxTilt || 0;
  ctx.rotate(tilt * 0.35);
  if (chassisImg) {
    ctx.drawImage(chassisImg, -w * 0.62, -h * 0.58, w * 1.24, h * 1.16);
  } else {
    ctx.fillStyle = tankCfg.hullColor;
    ctx.fillRect(-w * 0.42, -h * 0.45, w * 0.84, h * 0.9);
  }
  // Flamme des turbines arrière du blindé
  const exhaustH = 10 + Math.sin(now * 0.05) * 4;
  ctx.fillStyle = tankCfg.trimColor;
  ctx.beginPath();
  ctx.arc(-w * 0.18, h * 0.48, 4, 0, Math.PI * 2);
  ctx.arc(w * 0.18, h * 0.48, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 180, 50, 0.75)";
  ctx.fillRect(-w * 0.21, h * 0.48, 6, exhaustH);
  ctx.fillRect(w * 0.15, h * 0.48, 6, exhaustH);
  ctx.restore();

  // 3. Tourelle Rotative 360° 3D 4K (tourne indépendamment vers la cible !)
  ctx.save();
  ctx.rotate(angle);

  // Ligne laser de visée 360°
  ctx.strokeStyle = tankCfg.trimColor;
  ctx.globalAlpha = 0.38;
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(150, 0);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  if (turretImg) {
    // Le sprite tank_turret_4k pointe vers le HAUT (-PI/2), donc on tourne de +PI/2 pour l'aligner avec l'axe 0 radian
    ctx.rotate(Math.PI / 2);
    const tw = w * 1.18;
    const th = h * 1.18;
    ctx.drawImage(turretImg, -tw / 2, -th * 0.62, tw, th);
  } else {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(8, -4.5, 38, 9);
    ctx.fillStyle = tankCfg.hullColor;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawTankEnemy(entity, now) {
  const cx = entity.x + entity.width / 2;
  const cy = entity.y + entity.height / 2;
  const w = entity.width;
  const h = entity.height;
  const panzerImg = state.images.tank_enemy_panzer;
  const predatorImg = state.images.tank_enemy_predator;
  const turretImg = state.images.tank_turret;

  ctx.save();
  ctx.translate(cx, cy);

  // Ombre portée 3D au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
  ctx.beginPath();
  ctx.ellipse(0, 5, w * 0.48, h * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Effet Camouflage Optique + Viseur Tri-Laser Rouge pour le thème Predator !
  if (entity.cloaked) {
    ctx.globalAlpha = 0.38 + Math.sin(now * 0.012) * 0.18;
  }

  if (entity.tankRole === "flank_turret") {
    // Tourelle d'artillerie 3D 4K sur les bas-côtés qui pivote vers le joueur
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.rotate((entity.aimAngle || Math.PI / 2) + Math.PI / 2);
    if (turretImg) {
      ctx.drawImage(turretImg, -w * 0.62, -h * 0.68, w * 1.24, h * 1.24);
    } else {
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-4, -w * 0.55, 8, w * 0.55);
    }
  } else if (entity.tankRole === "hunter" || selectedTankThemeId === "predator") {
    // Monstre / Chasseur Predator 3D 4K ou Drone Alien 3D 4K
    const sprite = predatorImg || state.images.kraken_drone;
    const lookAngle = (entity.aimAngle || Math.PI / 2) - Math.PI / 2;
    ctx.rotate(lookAngle * 0.35);
    if (sprite) {
      ctx.drawImage(sprite, -w * 0.62, -h * 0.62, w * 1.24, h * 1.24);
    } else {
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Les 3 points rouges du viseur laser Predator
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ff0033";
    ctx.shadowColor = "#ff0033";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -7, 3, 0, Math.PI * 2);
    ctx.arc(-5, 2, 3, 0, Math.PI * 2);
    ctx.arc(5, 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    // Char Panzer / Blindé Ennemi 3D 4K (ou Méca Alien 4K en thème Alien)
    const sprite = selectedTankThemeId === "alien"
      ? (state.images.harvester_mech || panzerImg)
      : panzerImg;
    if (sprite) {
      ctx.drawImage(sprite, -w * 0.6, -h * 0.6, w * 1.2, h * 1.2);
    } else {
      ctx.fillStyle = "#52525b";
      ctx.fillRect(-w * 0.4, -h * 0.4, w * 0.8, h * 0.8);
    }
  }

  ctx.restore();
}

function drawBomberSquadron() {
  if (!state.bomberRun) return;
  const run = state.bomberRun;
  const bomberImg = state.images.tank_bomber;

  run.bombers.forEach((b) => {
    const bx = b.x;
    const by = run.y + b.offsetY;

    ctx.save();
    // Ombre portée au sol du bombardier 3D
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(bx + 36, by + 28, 62, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(bx, by);
    if (bomberImg) {
      ctx.shadowColor = "#00f2ff";
      ctx.shadowBlur = 18;
      ctx.drawImage(bomberImg, -78, -72, 156, 144);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "#334155";
      ctx.fillRect(-68, -10, 136, 22);
      ctx.fillRect(-10, -42, 20, 84);
    }
    ctx.restore();
  });
}

function drawBackground() {
  const w = canvas.width;
  const h = canvas.height;
  const now = performance.now();

  if (selectedGameMode === "tank") {
    drawTankBattlefield(w, h, now);
    return;
  }

  const biome = BIOMES[selectedBiomeId] || BIOMES.campagne;

  // 1. Décor 3D 4K Photoréaliste avec parallaxe 3D fluide
  const bgImg = state.images["bg_" + selectedBiomeId];
  if (bgImg) {
    const panX = ((player.x + player.width / 2 - w / 2) / Math.max(1, w)) * -28;
    const panY = Math.sin(now * 0.0005) * 8;
    ctx.drawImage(bgImg, panX - 24, panY - 14, w + 48, h + 28);

    // Voile atmosphérique subtil pour garantir la lisibilité parfaite des tirs néon
    const vignette = ctx.createLinearGradient(0, 0, 0, h);
    vignette.addColorStop(0, "rgba(4, 8, 16, 0.42)");
    vignette.addColorStop(0.5, "rgba(4, 8, 16, 0.16)");
    vignette.addColorStop(1, "rgba(4, 8, 16, 0.52)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Fallback dégradé pendant le chargement initial
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, biome.skyTop);
    skyGrad.addColorStop(0.55, biome.skyBottom);
    skyGrad.addColorStop(1, "#040810");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
  }

  const horizonY = h * 0.48;

  // 2. Grille de Terrain Perspective 3D Holographique en défilement continu
  ctx.save();
  ctx.strokeStyle = biome.gridColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = bgImg ? 0.42 : 0.85;
  const vanishX = w * 0.5 - (player.x + player.width / 2 - w * 0.5) * 0.18;

  // Lignes longitudinales fuyant vers l'horizon 3D
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(vanishX + i * 18, horizonY);
    ctx.lineTo(w * 0.5 + i * 135, h);
    ctx.stroke();
  }

  // Lignes transversales animées avec perspective exponentielle
  for (let z = 0; z < 9; z++) {
    const normZ = ((z * 8 + (terrainOffset3D % 8)) / 72);
    const perspY = horizonY + Math.pow(normZ, 1.85) * (h - horizonY);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 48) {
      let waveH = 0;
      if (selectedBiomeId === "ocean") {
        waveH = Math.sin(x * 0.02 + now * 0.004 + z) * 6 * normZ;
      } else if (selectedBiomeId === "montagne") {
        waveH = Math.abs(Math.cos(x * 0.015 + z)) * -10 * normZ;
      } else {
        waveH = Math.sin(x * 0.012 + z * 0.5) * 4 * normZ;
      }
      if (x === 0) ctx.moveTo(x, perspY + waveH);
      else ctx.lineTo(x, perspY + waveH);
    }
    ctx.stroke();
  }
  ctx.restore();

  // 3. Particules météo 3D (Pollen doré, Blizzard alpin ou Bulles bioluminescentes)
  state.stars.forEach((star) => {
    const twinkle = 0.55 + Math.sin(now * 0.002 * star.twinkleSpeed + star.twinkleOffset) * 0.4;
    if (selectedBiomeId === "ocean") {
      ctx.strokeStyle = `rgba(0, 242, 255, ${twinkle})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.6, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedBiomeId === "montagne") {
      ctx.fillStyle = `rgba(224, 242, 254, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `rgba(253, 230, 138, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

const waveColors = ["#00f2ff", "#ff00ff", "#ffb84d", "#ff4d4d", "#c264ff", "#7af2ff"];
const waveBossColors = ["#ff00ff", "#00f2ff", "#ffb84d", "#ff4d4d", "#c264ff", "#7af2ff"];

function drawBiomeEnemy3D(entity, now) {
  const cx = entity.x + entity.width / 2;
  const cy = entity.y + entity.height / 2;
  const w = entity.width;
  const h = entity.height;
  const bClass = entity.biomeClass || "wasp_drone";
  const sway = Math.sin(now * 0.005 + (entity.phaseOffset || 0)) * 0.11;
  const bobY = Math.cos(now * 0.006 + (entity.phaseOffset || 0)) * 3;

  // Priorité aux nouveaux sprites 3D 4K ultra-détaillés !
  const sprite4K = state.images[bClass] || state.images[entity.type];
  if (sprite4K) {
    ctx.save();
    ctx.translate(cx, cy + bobY);
    ctx.rotate(sway);

    // Ombre portée 3D sous l'ennemi pour l'effet de relief aérien
    ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
    ctx.beginPath();
    ctx.ellipse(0, h * 0.56, w * 0.34, h * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(sprite4K, -w / 2, -h / 2, w, h);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(sway);

  // Ombre portée 3D au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, h * 0.62, w * 0.35, h * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  if (bClass === "wasp_drone" || bClass === "locust_swarm") {
    // Drone Insectoïde 3D (Campagne) : ailes vibrantes + abdomen ambre/noir
    const wingFlutter = Math.sin(now * 0.03 + (entity.phaseOffset || 0)) * 6;
    ctx.fillStyle = "rgba(6, 182, 212, 0.55)";
    ctx.beginPath();
    ctx.ellipse(-w * 0.35, -2, w * 0.28, Math.max(3, h * 0.18 + wingFlutter * 0.3), -0.3, 0, Math.PI * 2);
    ctx.ellipse(w * 0.35, -2, w * 0.28, Math.max(3, h * 0.18 + wingFlutter * 0.3), 0.3, 0, Math.PI * 2);
    ctx.fill();

    const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    bodyGrad.addColorStop(0, "#fbbf24");
    bodyGrad.addColorStop(0.5, "#d97706");
    bodyGrad.addColorStop(1, "#451a03");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.45);
    ctx.lineTo(w * 0.26, 0);
    ctx.lineTo(0, h * 0.5);
    ctx.lineTo(-w * 0.26, 0);
    ctx.closePath();
    ctx.fill();
  } else if (bClass === "harvester_mech" || bClass === "beetle_tank") {
    // Moissonneur Méca Blindé 3D (Campagne) avec lames rotatives
    ctx.fillStyle = "#b45309";
    ctx.fillRect(-w * 0.38, -h * 0.32, w * 0.76, h * 0.64);
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 2;
    ctx.strokeRect(-w * 0.38, -h * 0.32, w * 0.76, h * 0.64);
    // Scies circulaires avant
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(-w * 0.28, h * 0.35, 6, 0, Math.PI * 2);
    ctx.arc(w * 0.28, h * 0.35, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (bClass === "frost_wyvern" || bClass === "stealth_raptor") {
    // Wyverne de Givre / Raptor 3D (Montagne)
    const iceGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    iceGrad.addColorStop(0, "#e0f2fe");
    iceGrad.addColorStop(0.5, "#38bdf8");
    iceGrad.addColorStop(1, "#0369a1");
    ctx.fillStyle = iceGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.48);
    ctx.lineTo(w * 0.5, -h * 0.2);
    ctx.lineTo(w * 0.18, -h * 0.45);
    ctx.lineTo(0, -h * 0.15);
    ctx.lineTo(-w * 0.18, -h * 0.45);
    ctx.lineTo(-w * 0.5, -h * 0.2);
    ctx.closePath();
    ctx.fill();
  } else if (bClass === "rock_golem" || bClass === "ice_shard") {
    // Croiseur Golem de Roche / Cristal 3D (Montagne)
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.45);
    ctx.lineTo(w * 0.45, -h * 0.15);
    ctx.lineTo(w * 0.35, h * 0.45);
    ctx.lineTo(-w * 0.35, h * 0.45);
    ctx.lineTo(-w * 0.45, -h * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (bClass === "manta_ray" || bClass === "leviathan_mech") {
    // Raie-Manta / Léviathan Hydro 3D (Océan)
    const hydroGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    hydroGrad.addColorStop(0, "#00f2ff");
    hydroGrad.addColorStop(0.6, "#0284c7");
    hydroGrad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = hydroGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.46);
    ctx.quadraticCurveTo(w * 0.55, 0, w * 0.48, -h * 0.35);
    ctx.lineTo(0, -h * 0.18);
    ctx.lineTo(-w * 0.48, -h * 0.35);
    ctx.quadraticCurveTo(-w * 0.55, 0, 0, h * 0.46);
    ctx.fill();
  } else {
    // Drone Kraken / Mine Méduse Bioluminescente 3D (Océan)
    ctx.fillStyle = "rgba(168, 85, 247, 0.85)";
    ctx.beginPath();
    ctx.arc(0, -h * 0.1, w * 0.34, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 2;
    for (let t = -2; t <= 2; t++) {
      ctx.beginPath();
      ctx.moveTo(t * 5, -h * 0.1);
      ctx.lineTo(t * 7 + Math.sin(now * 0.008 + t) * 4, h * 0.42);
      ctx.stroke();
    }
  }

  // Noyau lumineux 3D commun
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSprite(img, entity, fallbackColor, type) {
  const now = performance.now();

  if (selectedGameMode === "tank") {
    if (type === "player") {
      drawPlayerTank(entity, now);
      return;
    }
    if (type === "enemy") {
      drawTankEnemy(entity, now);
      return;
    }
    if (type === "boss" && state.images.tank_boss) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.ellipse(entity.x + entity.width / 2, entity.y + entity.height * 0.58, entity.width * 0.52, entity.height * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 18;
      ctx.drawImage(state.images.tank_boss, entity.x, entity.y, entity.width, entity.height);
      ctx.restore();
      return;
    }
  }

  if (type === "player" && img) {
    ctx.save();
    const cx = entity.x + entity.width / 2;
    const cy = entity.y + entity.height / 2;
    ctx.translate(cx, cy);
    // Effet d'inclinaison 3D (banking roll) lors du déplacement !
    const tilt = player.vxTilt || 0;
    ctx.rotate(tilt * 0.65);
    ctx.scale(1 - Math.abs(tilt) * 0.45, 1);

    // Jet de réacteur 3D animé sous le vaisseau
    const flameH = 14 + Math.sin(now * 0.04) * 6;
    const flameGrad = ctx.createLinearGradient(0, entity.height * 0.32, 0, entity.height * 0.32 + flameH);
    flameGrad.addColorStop(0, "#ffffff");
    flameGrad.addColorStop(0.5, player.color || "#00f2ff");
    flameGrad.addColorStop(1, "rgba(0, 242, 255, 0)");
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-8, entity.height * 0.3);
    ctx.lineTo(8, entity.height * 0.3);
    ctx.lineTo(0, entity.height * 0.36 + flameH);
    ctx.closePath();
    ctx.fill();

    ctx.drawImage(img, -entity.width / 2, -entity.height / 2, entity.width, entity.height);
    ctx.restore();
    return;
  }

  if (type === "enemy") {
    // Rendu 3D diversifié par biome + superposition subtile du sprite si souhaité
    drawBiomeEnemy3D(entity, now);
    return;
  }

  if (img) {
    ctx.drawImage(img, entity.x, entity.y, entity.width, entity.height);
    return;
  }

  const cx = entity.x + entity.width / 2;
  const cy = entity.y + entity.height / 2;
  const w = entity.width;
  const h = entity.height;
  const wave = state.wave || 1;

  if (type === "enemy") {
    fallbackColor = waveColors[(wave - 1) % waveColors.length];
  } else if (type === "boss") {
    fallbackColor = waveBossColors[(wave - 1) % waveBossColors.length];
  }

  if (type === "player") {
    fallbackColor = player.color;
    
    const grad = ctx.createLinearGradient(entity.x, entity.y, entity.x, entity.y + h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.3, fallbackColor);
    grad.addColorStop(1, "#0a1a2a");

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = grad;
    ctx.beginPath();
    
    if (player.id === "viper") {
      ctx.moveTo(cx, entity.y);
      ctx.lineTo(entity.x + w * 0.8, entity.y + h);
      ctx.lineTo(cx, entity.y + h * 0.8);
      ctx.lineTo(entity.x + w * 0.2, entity.y + h);
    } else if (player.id === "goliath") {
      ctx.moveTo(entity.x + w * 0.2, entity.y);
      ctx.lineTo(entity.x + w * 0.8, entity.y);
      ctx.lineTo(entity.x + w, entity.y + h * 0.6);
      ctx.lineTo(entity.x + w * 0.8, entity.y + h);
      ctx.lineTo(entity.x + w * 0.2, entity.y + h);
      ctx.lineTo(entity.x, entity.y + h * 0.6);
    } else if (player.id === "phantom") {
      ctx.moveTo(cx, entity.y);
      ctx.lineTo(entity.x + w, entity.y + h * 0.5);
      ctx.lineTo(cx, entity.y + h);
      ctx.lineTo(entity.x, entity.y + h * 0.5);
    } else if (player.id === "orion") {
      ctx.moveTo(cx, entity.y);
      ctx.lineTo(entity.x + w, entity.y + h * 0.7);
      ctx.quadraticCurveTo(cx, entity.y + h * 1.2, entity.x, entity.y + h * 0.7);
    } else {
      ctx.moveTo(cx, entity.y);
      ctx.lineTo(entity.x + w, entity.y + h);
      ctx.lineTo(entity.x + w * 0.7, entity.y + h * 0.65);
      ctx.lineTo(cx, entity.y + h);
      ctx.lineTo(entity.x + w * 0.3, entity.y + h * 0.65);
      ctx.lineTo(entity.x, entity.y + h);
    }
    
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    
    if (player.id === "viper") {
      ctx.moveTo(cx, entity.y + h * 0.2);
      ctx.lineTo(entity.x + w * 0.6, entity.y + h * 0.6);
      ctx.lineTo(entity.x + w * 0.4, entity.y + h * 0.6);
    } else if (player.id === "goliath") {
      ctx.fillRect(entity.x + w * 0.3, entity.y + h * 0.2, w * 0.4, h * 0.2);
    } else if (player.id === "phantom") {
      ctx.ellipse(cx, entity.y + h * 0.5, w * 0.15, h * 0.2, 0, 0, Math.PI * 2);
    } else if (player.id === "orion") {
      ctx.arc(cx, entity.y + h * 0.4, w * 0.15, 0, Math.PI * 2);
    } else {
      ctx.moveTo(cx, entity.y + h * 0.15);
      ctx.lineTo(entity.x + w * 0.65, entity.y + h * 0.5);
      ctx.lineTo(entity.x + w * 0.35, entity.y + h * 0.5);
    }
    
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    return;
  }

  if (type === "boss") {
    const phase = state.boss ? state.boss.phase : 1;
    const pulse = Math.sin(performance.now() * 0.005 * phase) * 5;
    const bossColor = waveBossColors[(wave - 1) % waveBossColors.length];
    const altColor = phase === 2 ? "#ffffff" : (phase === 3 ? "#ff2222" : bossColor);
    
    const grad = ctx.createLinearGradient(entity.x, entity.y, entity.x, entity.y + h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.4, bossColor);
    grad.addColorStop(1, "#110000");

    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 20 + pulse;
    ctx.shadowOffsetY = 15;
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, entity.y);
    ctx.lineTo(entity.x + w, entity.y + h * 0.3);
    ctx.lineTo(entity.x + w * 0.85, entity.y + h);
    ctx.lineTo(entity.x + w * 0.15, entity.y + h);
    ctx.lineTo(entity.x, entity.y + h * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = altColor;
    ctx.beginPath();
    ctx.arc(cx, entity.y + h * 0.4, w * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - w * 0.08, entity.y + h * 0.25, w * 0.16, h * 0.08);

    ctx.fillStyle = bossColor;
    ctx.fillRect(entity.x + w * 0.1, entity.y + h * 0.6, w * 0.08, h * 0.25);
    ctx.fillRect(entity.x + w * 0.82, entity.y + h * 0.6, w * 0.08, h * 0.25);
    
    if (phase >= 2) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(entity.x + w * 0.3, entity.y);
      ctx.lineTo(entity.x + w * 0.35, entity.y - h * 0.2);
      ctx.lineTo(entity.x + w * 0.4, entity.y);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(entity.x + w * 0.6, entity.y);
      ctx.lineTo(entity.x + w * 0.65, entity.y - h * 0.2);
      ctx.lineTo(entity.x + w * 0.7, entity.y);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    return;
  }

  const enemyGrad = ctx.createLinearGradient(entity.x, entity.y, entity.x, entity.y + h);
  enemyGrad.addColorStop(0, "#ffffff");
  enemyGrad.addColorStop(0.3, fallbackColor);
  enemyGrad.addColorStop(1, "#221100");

  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = enemyGrad;
  ctx.beginPath();
  ctx.moveTo(cx, entity.y);
  ctx.lineTo(entity.x + w, entity.y + h);
  ctx.lineTo(entity.x + w * 0.7, entity.y + h * 0.7);
  ctx.lineTo(cx, entity.y + h);
  ctx.lineTo(entity.x + w * 0.3, entity.y + h * 0.7);
  ctx.lineTo(entity.x, entity.y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, entity.y + h * 0.4, w * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

function drawShots() {
  state.shots.forEach((shot) => {
    if (shot.explosionHeight) {
      const weapon = WEAPONS.bomb;
      ctx.shadowColor = weapon.color;
      ctx.shadowBlur = 25;
      ctx.fillStyle = weapon.color;
      ctx.beginPath();
      ctx.ellipse(shot.x + shot.width / 2, shot.y + shot.height / 2, shot.width / 2, shot.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffee88";
      ctx.beginPath();
      ctx.ellipse(shot.x + shot.width / 2, shot.y + shot.height / 2, shot.width / 3, shot.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shot.explosion && shot.explosionRadius) {
      const weapon = shot.weapon && WEAPONS[shot.weapon] ? WEAPONS[shot.weapon] : WEAPONS.deflagration;
      ctx.shadowColor = weapon.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = weapon.color;
      ctx.beginPath();
      ctx.arc(shot.x + shot.width / 2, shot.y + shot.height / 2, shot.width / 2 + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffcc";
      ctx.beginPath();
      ctx.arc(shot.x + shot.width / 2, shot.y + shot.height / 2, shot.width / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const weapon = WEAPONS[shot.weapon || "normal"];
      const shotGrad = ctx.createLinearGradient(shot.x, shot.y, shot.x + shot.width, shot.y);
      shotGrad.addColorStop(0, "#ffffff");
      shotGrad.addColorStop(0.5, weapon.color);
      shotGrad.addColorStop(1, "#ffffff");

      ctx.shadowColor = weapon.color;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = shotGrad;
      ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });

  state.enemyShots.forEach((shot) => {
    const shotGrad = ctx.createLinearGradient(shot.x, shot.y, shot.x + shot.width, shot.y);
    shotGrad.addColorStop(0, "#ffffff");
    shotGrad.addColorStop(0.5, "#ff6474");
    shotGrad.addColorStop(1, "#ffffff");

    ctx.shadowColor = "#ff6474";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = shotGrad;
    ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillRect(particle.x, particle.y, 4, 4);
    ctx.globalAlpha = 1;
  });
}

function drawBossHealth() {
  if (!state.boss) return;

  const boss = state.boss;
  const width = 240;
  const x = canvas.width / 2 - width / 2;
  const y = 30;
  const barHeight = 8;
  const gap = 4;

  if (boss.isSquad) {
    const totalHP = boss.entities.reduce((acc, e) => acc + e.health, 0);
    const maxTotalHP = boss.maxTotalHP || 100; 
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${boss.name.toUpperCase()} - UNITÉS : ${boss.entities.length}`, x + width / 2, y - 8);
    
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(x, y, width, 10);
    ctx.fillStyle = "#ff6474";
    ctx.fillRect(x, y, width * (Math.max(0, totalHP) / maxTotalHP), 10);
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.strokeRect(x, y, width, 10);
    return;
  }
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${boss.name.toUpperCase()} - PHASE ${boss.phase}`, x + width / 2, y - 8);

  // Bar 1 (Phase 1)
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(x, y, width, barHeight);
  if (boss.lives > 1) {
    ctx.fillStyle = "#ffb84d";
    ctx.fillRect(x, y, width * (Math.max(0, boss.health) / boss.maxHealth), barHeight);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.strokeRect(x, y, width, barHeight);

  // Bar 2 (Phase 2)
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(x, y + barHeight + gap, width, barHeight);
  if (boss.lives > 1) {
    ctx.fillStyle = "#ff6474";
    ctx.fillRect(x, y + barHeight + gap, width, barHeight); // Full
  } else if (boss.lives === 1) {
    ctx.fillStyle = "#ff6474";
    ctx.fillRect(x, y + barHeight + gap, width * (Math.max(0, boss.health) / boss.maxHealth), barHeight);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.strokeRect(x, y + barHeight + gap, width, barHeight);
}

function draw() {
  const now = performance.now();

  drawBackground();
  if (!isPlayerInvulnerable(now) || Math.floor(now / 100) % 2 === 0) {
    drawSprite(state.images[player.id], player, player.color, "player");
  }
  enemies.forEach((enemy) => {
    let col = "#ff6474";
    if (enemy.type === "squid") col = "#c264ff";
    if (enemy.type === "crab") col = "#ffb84d";
    drawSprite(state.images[enemy.type], enemy, col, "enemy");
  });
  if (state.boss) {
    if (state.boss.isSquad) {
      state.boss.entities.forEach(ent => {
        if (!ent.dead) {
          ctx.globalAlpha = ent.stealth ? 0.2 : 1;
          drawSprite(state.images.boss, ent, "#ff6474", "boss");
          ctx.globalAlpha = 1;
        }
      });
    } else {
      drawSprite(state.images[state.boss.type || "boss"], state.boss, "#ff6474", "boss");
    }
    drawBossHealth();
  }
  drawShots();
  drawPowerups();

  if (state.teaseBoss) {
    drawSprite(state.images.boss, state.teaseBoss, "#ffb84d", "boss");
  }

  drawBomberSquadron();
  drawParticles();
}

function loop(timestamp) {
  if (!state.running || state.paused) {
    return;
  }

  let delta = timestamp - state.lastFrame;
  if (delta > 100 || state.isCinematic) {
    delta = 16;
  }
  state.lastFrame = timestamp;
  update(delta, timestamp);
  draw();

  if (state.running && !state.paused) {
    requestAnimationFrame(loop);
  }
}

function handleKeydown(event) {
  keys.add(event.key);

  // Raccourcis clavier 1-8 pour changer d'arme principale à tout moment
  const wpnKeys = {
    "1": "normal",
    "2": "rapid",
    "3": "triple",
    "4": "spread",
    "5": "plasma",
    "6": "railgun",
    "7": "deflagration",
    "8": "fragbomb"
  };
  if (wpnKeys[event.key]) {
    selectedWeaponId = wpnKeys[event.key];
    player.baseWeapon = selectedWeaponId;
    player.weapon = selectedWeaponId;
    player.weaponTime = 0;
    syncUi();
  }

  if (event.key === "p" || event.key === "P" || event.key === "Escape") {
    togglePause();
  }

  // Touche B ou Maj pour déclencher le Support Aérien (Bombardiers) en mode Tank
  if (event.key === "b" || event.key === "B" || event.key === "Shift") {
    triggerAirstrike();
  }

  if ((event.key === "Enter" || event.key === "r" || event.key === "R") && !state.running && state.paused && state.wave > 1) {
    levelCompleteContinue();
    return;
  }

  if ((event.key === "r" || event.key === "R") && !state.running && state.lives <= 0) {
    startGame();
  }
}

function handleKeyup(event) {
  keys.delete(event.key);
}

function runSelfChecks() {
  return true;
}

function handleStartClick() {
  console.log("Start button clicked, running:", state.running, "paused:", state.paused);
  
  // Reprendre l'AudioContext sur mobile
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (state.paused && !state.running && state.wave > 1) {
    levelCompleteContinue();
    return;
  }
  
  if (!state.running) {
    try {
      const input = document.getElementById("startWaveInput");
      selectedStartWave = input ? (parseInt(input.value) || 1) : 1;
    } catch (e) {
      selectedStartWave = 1;
    }
    startGame();
  } else if (state.paused) {
    togglePause();
  }
}

ui.startButton.addEventListener("click", handleStartClick);
ui.startButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleStartClick();
});
ui.pauseButton.addEventListener("click", () => {
  if (state.running) {
    togglePause();
  }
});

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// 0. Sélecteur de Jeu (Hub 2-en-1 : Space Invaders 3D vs Tank Assault 360°)
const gameModeCards = document.querySelectorAll(".game-mode-card");
const spaceConfigPanel = document.getElementById("spaceConfigPanel");
const tankConfigPanel = document.getElementById("tankConfigPanel");

function setGameMode(mode) {
  selectedGameMode = mode === "tank" ? "tank" : "space";
  gameModeCards.forEach(c => c.classList.toggle("active", c.getAttribute("data-gamemode") === selectedGameMode));
  if (spaceConfigPanel) spaceConfigPanel.style.display = selectedGameMode === "space" ? "flex" : "none";
  if (tankConfigPanel) tankConfigPanel.style.display = selectedGameMode === "tank" ? "flex" : "none";

  const waveInput = document.getElementById("startWaveInput");
  const waveInputLabel = document.getElementById("waveInputLabel");
  if (selectedGameMode === "tank") {
    if (waveInput) {
      waveInput.max = "5";
      if (parseInt(waveInput.value, 10) > 5) waveInput.value = "1";
    }
    if (waveInputLabel) waveInputLabel.textContent = "Niveau (1-5) :";
    if (ui.startButton && !state.running) ui.startButton.textContent = "LANCER L'ASSAUT BLINDÉ";
  } else {
    if (waveInput) waveInput.max = "50";
    if (waveInputLabel) waveInputLabel.textContent = "Vague (1-50) :";
    if (ui.startButton && !state.running) ui.startButton.textContent = "DÉMARRER LA MISSION 3D";
  }

  applyShipSelection();
  updateCommLinkBiome();
  syncUi();
  draw();
}

gameModeCards.forEach(card => {
  const chooseMode = () => {
    setGameMode(card.getAttribute("data-gamemode") || "space");
  };
  card.addEventListener("click", chooseMode);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    chooseMode();
  });
});

// Sélection du Thème Terrestre (WW2, Désert, Alien, Predator)
const tankThemeCards = document.querySelectorAll(".tank-theme-card");
tankThemeCards.forEach(card => {
  const selectTankTheme = () => {
    tankThemeCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedTankThemeId = card.getAttribute("data-tanktheme") || "ww2";
    updateCommLinkBiome();
    syncUi();
    draw();
  };
  card.addEventListener("click", selectTankTheme);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    selectTankTheme();
  });
});

// Sélection du Tank Blindé
const tankCards = document.querySelectorAll(".tank-card");
tankCards.forEach(card => {
  const selectTank = () => {
    tankCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedTankId = card.getAttribute("data-tank") || "grizzly";
    applyShipSelection();
    syncUi();
    draw();
  };
  card.addEventListener("click", selectTank);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    selectTank();
  });
});

// Bouton "Changer de Jeu" dans le menu Pause / Fin
const switchGameMenuBtn = document.getElementById("switchGameMenuBtn");
if (switchGameMenuBtn) {
  const returnToHub = () => {
    state.running = false;
    state.paused = false;
    setGameMode(selectedGameMode === "space" ? "tank" : "space");
    showOverlay(
      "NOVA DUAL WARFARE // HUB ARCADE",
      "Choisis ton Jeu (Space Invaders 3D ou Tank Assault 360°), ton Thème, ton Véhicule et ton Armement !",
      selectedGameMode === "tank" ? "LANCER L'ASSAUT BLINDÉ" : "DÉMARRER LA MISSION 3D"
    );
    syncUi();
  };
  switchGameMenuBtn.addEventListener("click", returnToHub);
  switchGameMenuBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    returnToHub();
  });
}

// Boutons Support Aérien (HUD Desktop + Dock Mobile) & Rotation Tourelle Mobile
const hudAirstrikeBtn = document.getElementById("hudAirstrikeBtn");
if (hudAirstrikeBtn) {
  hudAirstrikeBtn.addEventListener("click", triggerAirstrike);
  hudAirstrikeBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerAirstrike();
  });
}
const btnAirstrikeMobile = document.getElementById("btnAirstrikeMobile");
if (btnAirstrikeMobile) {
  btnAirstrikeMobile.addEventListener("click", triggerAirstrike);
  btnAirstrikeMobile.addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerAirstrike();
  });
}
const btnTurretLeft = document.getElementById("btnTurretLeft");
const btnTurretRight = document.getElementById("btnTurretRight");
if (btnTurretLeft) {
  btnTurretLeft.addEventListener("touchstart", (e) => { e.preventDefault(); keys.add("TurretLeft"); });
  btnTurretLeft.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("TurretLeft"); });
  btnTurretLeft.addEventListener("mousedown", () => keys.add("TurretLeft"));
  btnTurretLeft.addEventListener("mouseup", () => keys.delete("TurretLeft"));
}
if (btnTurretRight) {
  btnTurretRight.addEventListener("touchstart", (e) => { e.preventDefault(); keys.add("TurretRight"); });
  btnTurretRight.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("TurretRight"); });
  btnTurretRight.addEventListener("mousedown", () => keys.add("TurretRight"));
  btnTurretRight.addEventListener("mouseup", () => keys.delete("TurretRight"));
}

const shipCards = document.querySelectorAll(".ship-card");
shipCards.forEach(card => {
  const selectShip = () => {
    shipCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedShipId = card.getAttribute("data-ship");
  };
  card.addEventListener("click", selectShip);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    selectShip();
  });
});

// 1. Sélection du Thème / Biome 3D
const biomeCards = document.querySelectorAll(".biome-card");
biomeCards.forEach(card => {
  const selectBiome = () => {
    biomeCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedBiomeId = card.getAttribute("data-biome") || "campagne";
    updateCommLinkBiome();
    syncUi();
    draw();
  };
  card.addEventListener("click", selectBiome);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    selectBiome();
  });
});

// 2. Sélection de l'Armement Indépendant (Overlay + Dock HUD)
const weaponCards = document.querySelectorAll(".weapon-card");
weaponCards.forEach(card => {
  const selectWeapon = () => {
    weaponCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedWeaponId = card.getAttribute("data-weapon") || "normal";
    player.baseWeapon = selectedWeaponId;
    player.weapon = selectedWeaponId;
    syncUi();
  };
  card.addEventListener("click", selectWeapon);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    selectWeapon();
  });
});

const hudWeaponBtns = document.querySelectorAll(".hud-wpn-btn");
hudWeaponBtns.forEach(btn => {
  const switchHudWeapon = () => {
    const wpn = btn.getAttribute("data-weapon") || "normal";
    selectedWeaponId = wpn;
    player.baseWeapon = wpn;
    player.weapon = wpn;
    player.weaponTime = 0;
    weaponCards.forEach(c => c.classList.toggle("active", c.getAttribute("data-weapon") === wpn));
    playSound("powerup");
    syncUi();
  };
  btn.addEventListener("click", switchHudWeapon);
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    switchHudWeapon();
  });
});

// 3. Boîte de Dialogue Interactive (Comm-Link Ennemis <-> Personnage)
const commReplyBtns = document.querySelectorAll(".comm-reply-btn");
commReplyBtns.forEach(btn => {
  const handleReply = () => {
    const idx = parseInt(btn.getAttribute("data-reply") || "0", 10);
    const activeSource = selectedGameMode === "tank"
      ? (TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2)
      : (BIOMES[selectedBiomeId] || BIOMES.campagne);
    const pQuote = activeSource.pilotQuotes[idx] || activeSource.pilotQuotes[0];
    const eReact = activeSource.enemyReactions[idx] || activeSource.enemyReactions[0];
    playSound("powerup");
    updateCommLinkBiome(eReact, pQuote);
  };
  btn.addEventListener("click", handleReply);
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleReply();
  });
});

const difficultySlider = document.getElementById("difficultySlider");
const diffValueDisplay = document.getElementById("diffValueDisplay");
const startWaveInput = document.getElementById("startWaveInput");

if (difficultySlider) {
  difficultySlider.addEventListener("input", () => {
    selectedDifficulty = parseInt(difficultySlider.value);
    const labels = ["Facile", "Débutant", "Soldat", "Moyen", "Vétéran", "Difficile", "Élite", "Maître", "Légende", "NOVA"];
    if (diffValueDisplay) diffValueDisplay.textContent = labels[selectedDifficulty - 1] || selectedDifficulty;
  });
}

if (startWaveInput) {
  startWaveInput.addEventListener("change", () => {
    selectedStartWave = parseInt(startWaveInput.value) || 1;
  });
}

// Start Audio Context on first interaction
document.body.addEventListener('touchstart', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

document.body.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

// Mobile Touch Controls
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnFire = document.getElementById("btnFire");

// Contrôles Hybrides Souris (Déplacement + Tir + Molette d'Armes)
function updateMouseCoords(e) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  state.mouseTargetX = (e.clientX - rect.left) * scaleX;
  state.mouseTargetY = (e.clientY - rect.top) * scaleY;
  state.mouseActive = true;
}

canvas.addEventListener("mousemove", (e) => {
  if (!state.running || state.paused) return;
  updateMouseCoords(e);
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    if (state.running && !state.paused) {
      updateMouseCoords(e);
      state.mouseDown = true;
      firePlayerShot(performance.now());
    }
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    state.mouseDown = false;
  }
});

canvas.addEventListener("mouseleave", () => {
  state.mouseDown = false;
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Pilotage Tactile Direct sur l'écran (Glisser le doigt = Déplacement + Tir auto au-dessus du doigt)
function updateTouchCoords(touch) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  state.mouseTargetX = (touch.clientX - rect.left) * scaleX;
  // Décalage de -55px au-dessus du doigt pour que le doigt ne cache jamais le vaisseau
  state.mouseTargetY = (touch.clientY - rect.top) * scaleY - 55;
  state.mouseActive = true;
}

canvas.addEventListener("touchstart", (e) => {
  if (!state.running || state.paused) return;
  if (e.touches.length > 0) {
    e.preventDefault();
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    updateTouchCoords(e.touches[0]);
    state.mouseDown = true;
    firePlayerShot(performance.now());
  }
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  if (!state.running || state.paused) return;
  if (e.touches.length > 0) {
    e.preventDefault();
    updateTouchCoords(e.touches[0]);
    state.mouseDown = true;
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  state.mouseDown = false;
});

canvas.addEventListener("touchcancel", () => {
  state.mouseDown = false;
});

// Molette de la souris pour faire défiler les 8 armes principales à une main
const weaponOrder = ["normal", "rapid", "triple", "spread", "plasma", "railgun", "deflagration", "fragbomb"];
canvas.addEventListener("wheel", (e) => {
  if (!state.running || state.paused) return;
  e.preventDefault();
  const currentIdx = Math.max(0, weaponOrder.indexOf(player.weapon));
  const dir = e.deltaY > 0 ? 1 : -1;
  const nextIdx = (currentIdx + dir + weaponOrder.length) % weaponOrder.length;
  selectedWeaponId = weaponOrder[nextIdx];
  player.baseWeapon = selectedWeaponId;
  player.weapon = selectedWeaponId;
  player.weaponTime = 0;
  document.querySelectorAll(".weapon-card").forEach(c => c.classList.toggle("active", c.getAttribute("data-weapon") === selectedWeaponId));
  playSound("powerup");
  syncUi();
}, { passive: false });

if (btnLeft) {
  btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); state.mouseActive = false; keys.add("ArrowLeft"); });
  btnLeft.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("ArrowLeft"); });
}
if (btnRight) {
  btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); state.mouseActive = false; keys.add("ArrowRight"); });
  btnRight.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("ArrowRight"); });
}
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
if (btnUp) {
  btnUp.addEventListener("touchstart", (e) => { e.preventDefault(); state.mouseActive = false; keys.add("ArrowUp"); });
  btnUp.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("ArrowUp"); });
}
if (btnDown) {
  btnDown.addEventListener("touchstart", (e) => { e.preventDefault(); state.mouseActive = false; keys.add("ArrowDown"); });
  btnDown.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete("ArrowDown"); });
}
if (btnFire) {
  btnFire.addEventListener("touchstart", (e) => { e.preventDefault(); keys.add(" "); });
  btnFire.addEventListener("touchend", (e) => { e.preventDefault(); keys.delete(" "); });
}

(function init() {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  makeStars();
  resizeCanvas();
  updateCommLinkBiome();
  draw();
  bootstrapAssets();
  if (!runSelfChecks()) {
    return;
  }
  showOverlay(
    "CHAMP DE TIR 3D // MISSION NOVA",
    "Choisis ton Biome 3D (Campagne, Montagne, Océan), ton Vaisseau et ton Armement !",
    "DÉMARRER LA MISSION 3D"
  );
  syncUi();
})();
