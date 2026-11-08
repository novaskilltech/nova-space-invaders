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
  try {
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
    } else if (type === 'hit' || type === 'deflect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
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
  } else if (type === 'punch') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'kick') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    gainNode.gain.setValueAtTime(0.22, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'hadouken') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(560, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.linearRampToValueAtTime(0.24, now + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'saber') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.14);
    gainNode.gain.setValueAtTime(0.14, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'shield') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.linearRampToValueAtTime(680, now + 0.15);
    osc.frequency.linearRampToValueAtTime(1020, now + 0.3);
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.start(now);
    osc.stop(now + 0.38);
  } else if (type === 'crowd') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.35);
    osc.frequency.linearRampToValueAtTime(310, now + 0.7);
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.linearRampToValueAtTime(0.16, now + 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  } else if (type === 'ko') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.65);
    gainNode.gain.setValueAtTime(0.35, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.start(now);
    osc.stop(now + 0.65);
  }
  } catch (audioErr) {
    // Évite tout blocage en cas de limitation audio du navigateur
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
let selectedGameMode = "space"; // "space" (Nova Space Invaders 3D), "tank" (Nova Tank Assault 360°), ou "slug" (Metal Slug 1 Remake)
let selectedShipId = "nova";
let selectedTankId = "grizzly";
let selectedTankThemeId = "ww2";
let selectedSlugCommando = "marco"; // "marco" ou "tarma"
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
    forwardGun: true,
    barrels: 1,
    chassisKey: "tank_grizzly_chassis",
    turretKey: "tank_grizzly_turret",
    iconKey: "tank_grizzly"
  },
  vulcan: {
    id: "vulcan",
    name: "Vulcan Hellfire",
    hullColor: "#b45309",
    trimColor: "#fbbf24",
    speed: 415,
    livesBonus: 0,
    width: 58,
    height: 72,
    weapon: "rapid",
    forwardGun: true,
    barrels: 2,
    chassisKey: "tank_vulcan_chassis",
    turretKey: "tank_vulcan_turret",
    iconKey: "tank_vulcan"
  },
  mammoth: {
    id: "mammoth",
    name: "Mammoth Titan",
    hullColor: "#334155",
    trimColor: "#f97316",
    speed: 260,
    livesBonus: 3,
    width: 92,
    height: 104,
    weapon: "plasma",
    forwardGun: true,
    barrels: 2,
    chassisKey: "tank_mammoth_chassis",
    turretKey: "tank_mammoth_turret",
    iconKey: "tank_mammoth"
  },
  tesla: {
    id: "tesla",
    name: "Tesla Prism",
    hullColor: "#0e7490",
    trimColor: "#00f2ff",
    speed: 350,
    livesBonus: 1,
    width: 66,
    height: 80,
    weapon: "railgun",
    forwardGun: false,
    barrels: 1,
    chassisKey: "tank_tesla_chassis",
    turretKey: "tank_tesla_turret",
    iconKey: "tank_tesla"
  },
  cerberus: {
    id: "cerberus",
    name: "Cerberus Hydra",
    hullColor: "#581c87",
    trimColor: "#c084fc",
    speed: 360,
    livesBonus: 1,
    width: 82,
    height: 90,
    weapon: "triple",
    forwardGun: true,
    barrels: 3,
    chassisKey: "tank_cerberus_chassis",
    turretKey: "tank_cerberus_turret",
    iconKey: "tank_cerberus"
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
  floatingTexts: [],
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
  shieldsLeft: 3,
  shieldActiveTime: 0,
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

  // 5 Châssis & Tourelles 3D Dédiés (Tailles & Silhouettes distinctes)
  state.images.tank_grizzly_chassis = await loadImage("tank_grizzly_chassis.png" + v);
  state.images.tank_grizzly_turret = await loadImage("tank_grizzly_turret.png" + v);
  state.images.tank_vulcan_chassis = await loadImage("tank_vulcan_chassis.png" + v);
  state.images.tank_vulcan_turret = await loadImage("tank_vulcan_turret.png" + v);
  state.images.tank_mammoth_chassis = await loadImage("tank_mammoth_chassis.png" + v);
  state.images.tank_mammoth_turret = await loadImage("tank_mammoth_turret.png" + v);
  state.images.tank_tesla_chassis = await loadImage("tank_tesla_chassis.png" + v);
  state.images.tank_tesla_turret = await loadImage("tank_tesla_turret.png" + v);
  state.images.tank_cerberus_chassis = await loadImage("tank_cerberus_chassis.png" + v);
  state.images.tank_cerberus_turret = await loadImage("tank_cerberus_turret.png" + v);

  state.images.tank_chassis = state.images.tank_grizzly_chassis;
  state.images.tank_turret = state.images.tank_grizzly_turret;
  state.images.tank_enemy_panzer = await loadImage("tank_enemy_panzer_4k.png" + v);
  state.images.tank_enemy_predator = await loadImage("tank_enemy_predator_4k.png" + v);
  state.images.tank_bomber = await loadImage("tank_bomber_4k.png" + v);
  state.images.tank_boss = await loadImage("tank_boss_4k.png" + v);

  // ======================================================
  // ASSETS 64-BIT RETRO DÉDIÉS — METAL SLUG 1 REMAKE
  // ======================================================
  state.images.slug_bg = await loadImage("slug_bg_mission1_64bit.jpg" + v);
  state.images.slug_vehicles = await loadImage("slug_vehicules_64bit.jpg" + v);
  state.images.slug_characters = await loadImage("slug_personnages_64bit.jpg" + v);
  state.images.slug_weapons = await loadImage("slug_armes_64bit.jpg" + v);
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

// Calcule la position X du centre de la route sinueuse à n'importe quelle hauteur d'écran (screenY)
function getTankRoadCenterX(screenY) {
  const w = canvas.width;
  const distAtY = (state.tankDistance || 0) + (canvas.height - screenY);
  const progress = distAtY / Math.max(1, state.tankTargetDistance || 4800);

  // Au début (départ) et à la toute fin (arène du Boss, >90%), la route se recentre proprement
  let taper = 1;
  if (progress < 0.05) taper = progress / 0.05;
  else if (progress > 0.88) taper = Math.max(0, (0.96 - progress) / 0.08);

  const maxSwing = Math.min(w * 0.24, Math.max(70, (w - 280) * 0.42));
  const lvlSeed = (state.wave || 1) * 1.35;
  const curve = Math.sin(distAtY * 0.0023 + lvlSeed) * 0.68 + Math.cos(distAtY * 0.0049 - lvlSeed) * 0.32;
  return w * 0.5 + curve * maxSwing * taper;
}

function getTankRoadHalfWidth() {
  return Math.max(96, Math.min(165, canvas.width * 0.23));
}

function spawnTankRoadBonus(yPos = -30) {
  const roadCx = getTankRoadCenterX(yPos);
  const halfW = getTankRoadHalfWidth() * 0.55;
  const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
  state.powerups.push({
    x: roadCx + (Math.random() * 2 - 1) * halfW - 14,
    y: yPos,
    width: 28,
    height: 28,
    type,
    onRoad: true
  });
}

function initTankLevel(level) {
  const safeLevel = Math.max(1, Math.min(5, level));
  state.wave = safeLevel;
  state.tankDistance = 0;
  // Exactement 8 écrans de distance !
  state.tankTargetDistance = canvas.height * 8;
  state.tankSpawnCursor = 240;
  state.tankBonusCursor = 320;
  state.tankProps = [];
  state.tankTracks = [];
  state.bomberRun = null;
  state.airstrikes = Math.max(state.airstrikes || 2, 2);
  player.turretAngle = -Math.PI / 2;
  enemies = [];
  state.boss = null;

  // Positionner le tank au centre du départ de la route
  player.x = getTankRoadCenterX(player.y) - player.width / 2;

  // Pré-remplir les décors latéraux initiaux le long des berges de la route sinueuse
  for (let y = 60; y < canvas.height; y += 110) {
    spawnTankSceneryPair(y);
  }
  // Première caisse bonus directement sur la route devant le tank !
  spawnTankRoadBonus(canvas.height * 0.42);
  // Premiers ennemis de patrouille
  spawnTankEncounter(safeLevel, 110);
}

function spawnTankSceneryPair(yPos) {
  const w = canvas.width;
  const roadCx = getTankRoadCenterX(yPos);
  const halfRoad = getTankRoadHalfWidth();
  const theme = selectedTankThemeId;
  const typesByTheme = {
    ww2: ["bunker", "trench", "hedgerow", "crater"],
    desert: ["dune", "palm", "oilrig", "ruin"],
    alien: ["pylon", "crystal", "pod", "crater"],
    predator: ["jungle_tree", "totem", "hive", "acid_pool"]
  };
  const pool = typesByTheme[theme] || typesByTheme.ww2;

  // Rive gauche (à gauche du virage de la route)
  const leftEdge = roadCx - halfRoad - 52;
  if (leftEdge > 12) {
    state.tankProps.push({
      side: "left",
      x: 10 + Math.random() * Math.max(10, leftEdge - 14),
      y: yPos,
      w: 38 + Math.random() * 16,
      h: 38 + Math.random() * 16,
      type: pool[Math.floor(Math.random() * pool.length)],
      seed: Math.random()
    });
  }

  // Rive droite (à droite du virage de la route)
  const rightStart = roadCx + halfRoad + 14;
  if (rightStart < w - 52) {
    state.tankProps.push({
      side: "right",
      x: rightStart + Math.random() * Math.max(10, w - rightStart - 50),
      y: yPos + (Math.random() * 24 - 12),
      w: 38 + Math.random() * 16,
      h: 38 + Math.random() * 16,
      type: pool[Math.floor(Math.random() * pool.length)],
      seed: Math.random()
    });
  }
}

function spawnTankEncounter(level, yStart = -50) {
  const w = canvas.width;
  const roadCx = getTankRoadCenterX(yStart);
  const halfRoad = getTankRoadHalfWidth();

  // 1. Tourelles ou embuscades sur les bas-côtés de la route sinueuse (obligent à tourner le canon à gauche/droite !)
  if (Math.random() < 0.78) {
    const leftSide = Math.random() < 0.5;
    const sideX = leftSide
      ? Math.max(12, roadCx - halfRoad - 48)
      : Math.min(w - 56, roadCx + halfRoad + 8);
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

  // 2. Escouade blindée qui suit la route sinueuse (2 à 3 unités)
  const count = Math.min(3, 2 + Math.floor(level / 3));
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let role = "trooper";
    let hp = 1 + Math.floor(level / 3);
    let ew = 44;
    let eh = 44;
    if (roll < 0.35) {
      role = "light_vehicle";
      hp = 2 + Math.floor(level / 2);
      ew = 48;
      eh = 52;
    } else if (roll < 0.62) {
      role = "heavy_tank";
      hp = 4 + level;
      ew = 56;
      eh = 62;
    } else if (selectedTankThemeId === "predator" || roll < 0.8) {
      role = "hunter";
      hp = 3 + Math.floor(level / 2);
      ew = 46;
      eh = 48;
    }

    const spawnY = yStart - i * 48;
    const centerAtSpawn = getTankRoadCenterX(spawnY);
    const laneOffset = (i - (count - 1) / 2) * 58 + (Math.random() * 16 - 8);
    enemies.push({
      x: Math.max(24, Math.min(w - ew - 24, centerAtSpawn + laneOffset - ew / 2)),
      y: spawnY,
      laneOffset,
      width: ew,
      height: eh,
      type: role === "heavy_tank" ? "crab" : role === "hunter" ? "kamikaze" : "squid",
      tankRole: role,
      hp,
      maxHp: hp,
      dead: false,
      vx: (Math.random() - 0.5) * 45,
      vy: role === "light_vehicle" ? 65 : role === "hunter" ? 80 : 35,
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
  state.floatingTexts = [];
  state.boss = null;
  state.playerInvulnerableUntil = 0;
  state.powerups = [];
  state.showingQuestion = false;
  state.currentQuestion = null;
  state.airstrikes = 2;
  player.shieldsLeft = 3;
  player.shieldActiveTime = 0;
  player.weapon = player.baseWeapon || "normal";
  player.weaponTime = 0;
  resetPlayer();

  if (selectedGameMode === "slug") {
    initSlugMission(1);
  } else if (selectedGameMode === "tank") {
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
  const slugMobile = document.getElementById("slugMobileControls");
  const switchGameMenuBtn = document.getElementById("switchGameMenuBtn");

  if (slugMobile) {
    slugMobile.style.display = (selectedGameMode === "slug" && state.running && !state.paused) ? "flex" : "none";
  }

  if (selectedGameMode === "slug") {
    if (biomeDisplay) biomeDisplay.textContent = "🌴 Jungle Fluviale";
    if (waveLabel) waveLabel.textContent = "Mission";
    if (sectorLabel) sectorLabel.textContent = "Opération";
    if (airstrikeHudBox) airstrikeHudBox.style.display = "none";
    if (tankMobileTurret) tankMobileTurret.style.display = "none";
    ui.wave.textContent = "1/6";
    if (ui.score && typeof slugGame !== "undefined" && slugGame.active) {
      ui.score.textContent = String(slugGame.player.score || 0);
    }
  } else if (selectedGameMode === "tank") {
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

  const shieldCount = document.getElementById("shieldCount");
  const mobShieldCount = document.getElementById("mobShieldCount");
  if (shieldCount) shieldCount.textContent = String(player.shieldsLeft ?? 3);
  if (mobShieldCount) mobShieldCount.textContent = String(player.shieldsLeft ?? 3);
}

function createFloatingText(text, x, y, color = "#ffffff") {
  if (!state.floatingTexts) state.floatingTexts = [];
  state.floatingTexts.push({
    text: String(text),
    x: Number(x) || (canvas.width / 2),
    y: Number(y) || (canvas.height / 2),
    color: color || "#ffffff",
    vy: -45,
    life: 1.15,
    maxLife: 1.15,
    opacity: 1
  });
}

function updateFloatingTexts(dt) {
  if (!state.floatingTexts || state.floatingTexts.length === 0) return;
  state.floatingTexts.forEach((ft) => {
    ft.y += ft.vy * dt;
    ft.life -= dt;
    ft.opacity = Math.max(0, ft.life / ft.maxLife);
  });
  state.floatingTexts = state.floatingTexts.filter((ft) => ft.life > 0);
}

function drawFloatingTexts() {
  if (!state.floatingTexts || state.floatingTexts.length === 0) return;
  ctx.save();
  state.floatingTexts.forEach((ft) => {
    ctx.font = "900 13px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.globalAlpha = ft.opacity;
    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  });
  ctx.restore();
}

function activateShield() {
  if (!state.running || state.paused || (typeof versusDuel !== "undefined" && versusDuel.active)) return;
  if ((player.shieldsLeft || 0) <= 0) {
    createFloatingText("BOUCLIER ÉPUISÉ !", player.x + player.width / 2, player.y - 12, "#ff6474");
    return;
  }
  if ((player.shieldActiveTime || 0) > 0) return;
  player.shieldsLeft--;
  player.shieldActiveTime = 3.0;
  playSound("shield");
  createFloatingText("🛡️ BOUCLIER 3s ACTIF !", player.x + player.width / 2, player.y - 16, "#38bdf8");
  syncUi();
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

  // Si l'utilisateur a une préférence enregistrée dans localStorage, la respecter ; sinon sur mobile rétracter par défaut
  try {
    const saved = localStorage.getItem("nova_sidebar_collapsed");
    if (saved !== null) {
      toggleSidebar(saved === "true");
    } else if (window.innerWidth <= 900) {
      toggleSidebar(true);
    }
  } catch (e) {
    if (window.innerWidth <= 900) toggleSidebar(true);
  }
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
  requestFullscreenMode();
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
  if ((player.shieldActiveTime || 0) > 0) return;
  state.lives -= 1;
  state.flawless = false;
  try {
    addExplosion(player.x + player.width / 2, player.y + player.height / 2, "#ff6474");
  } catch (expErr) {
    console.warn("Player hit explosion error", expErr);
  }
  
  if (state.lives <= 0) {
    endGame(
      "Mission perdue",
      `Score final : ${state.score}. Appuie sur R ou utilise le bouton pour relancer une nouvelles tentative.`
    );
    return;
  }

  resetPlayer();
  state.enemyShots = [];
  state.playerInvulnerableUntil = performance.now() + (player.invul || 1400);
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
    // En mode Tank : le blindé peut se déplacer librement à gauche/droite pour suivre les virages de la route
    // et ramasser les caisses de bonus (ZQSD / Flèches OU glisser sur mobile)
    const roadCenter = getTankRoadCenterX(player.y + player.height / 2);
    const halfRoad = getTankRoadHalfWidth();
    const distFromRoad = Math.abs((player.x + player.width / 2) - roadCenter);
    const offRoadFactor = distFromRoad > halfRoad + 22 ? 0.78 : 1.0;

    if (anyDirectionKey) {
      if (movingLeft) {
        player.x -= player.speed * offRoadFactor * dt;
        targetTilt = -0.22;
      }
      if (movingRight) {
        player.x += player.speed * offRoadFactor * dt;
        targetTilt = 0.22;
      }
      if (movingUp) {
        player.y -= player.speed * offRoadFactor * dt;
      }
      if (movingDown) {
        player.y += player.speed * offRoadFactor * dt;
      }
    } else if (state.mouseActive && state.mouseDown && window.innerWidth <= 900) {
      // Sur mobile en glissant sur l'écran : le tank suit le doigt sur la route tout en orientant le canon
      const desiredX = state.mouseTargetX - player.width / 2;
      const dx = desiredX - player.x;
      player.x += dx * Math.min(1, dt * 6.0);
      targetTilt = Math.max(-0.22, Math.min(0.22, dx * 0.005));
    }

    player.vxTilt = (player.vxTilt || 0) + (targetTilt - (player.vxTilt || 0)) * Math.min(1, dt * 10);

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

    // Traces de chenilles au sol pendant que le tank avance sur la route
    if (Math.random() < 0.5) {
      state.tankTracks.push({
        x: player.x + 10,
        y: player.y + player.height - 8,
        w: player.width - 20,
        life: 1.0
      });
    }

    const safeBottom = getBottomSafeMargin();
    player.x = Math.max(18, Math.min(canvas.width - player.width - 18, player.x));
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
      // Générer régulièrement des caisses de bonus sur la route sinueuse (faciles à ramasser !)
      if (state.tankDistance >= (state.tankBonusCursor || 260)) {
        spawnTankRoadBonus(-35);
        state.tankBonusCursor = state.tankDistance + 310;
      }
    }

    // Arrivée au bout du 8ème écran (Distance 100%) -> Apparition du Boss de fin de niveau !
    if (!state.boss && state.tankDistance >= state.tankTargetDistance) {
      spawnTankBoss(state.wave);
    }

    const fireMult = 0.35 + selectedDifficulty / 7;
    const pCx = player.x + player.width / 2;
    const pCy = player.y + player.height / 2;
    const halfRoad = getTankRoadHalfWidth();

    enemies.forEach((enemy) => {
      const eCx = enemy.x + enemy.width / 2;
      const eCy = enemy.y + enemy.height / 2;
      enemy.aimAngle = Math.atan2(pCy - eCy, pCx - eCx);

      if (enemy.tankRole === "flank_turret") {
        // Tourelle fixe sur les bas-côtés de la route : défile avec le terrain et vise le tank à 360°
        enemy.y += scrollSpeed * dt;
      } else if (enemy.tankRole === "hunter") {
        // Monstre / Chasseur style Predator : bondit vers le tank
        enemy.y += (scrollSpeed * 0.55 + enemy.vy) * dt;
        enemy.x += Math.cos(enemy.aimAngle) * 85 * dt;
      } else {
        // Blindé ou buggy ennemi qui suit les virages de la route sinueuse !
        enemy.y += (scrollSpeed * 0.42 + enemy.vy) * dt;
        const rCenter = getTankRoadCenterX(enemy.y);
        enemy.laneOffset = (enemy.laneOffset || 0) + (enemy.vx || 0) * dt * 0.45;
        const maxLane = Math.max(30, halfRoad - enemy.width * 0.6);
        if (enemy.laneOffset < -maxLane || enemy.laneOffset > maxLane) {
          enemy.vx = -(enemy.vx || 35);
          enemy.laneOffset = Math.max(-maxLane, Math.min(maxLane, enemy.laneOffset));
        }
        const desiredEnemyX = rCenter + enemy.laneOffset - enemy.width / 2;
        enemy.x += (desiredEnemyX - enemy.x) * Math.min(1, dt * 4.5);
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
  const pCx = player.x + player.width / 2;
  const pCy = player.y + player.height / 2;

  state.powerups = state.powerups.filter((pu) => {
    if (selectedGameMode === "tank") {
      // Les caisses de bonus sont posées sur la route et défilent vers le tank
      const roadScroll = state.boss ? 55 : 132;
      pu.y += roadScroll * dt;

      // Maintenir la caisse accessible sur la route sinueuse
      if (typeof pu.roadOffset === "number") {
        const targetRoadX = getTankRoadCenterX(pu.y) + pu.roadOffset - pu.width / 2;
        pu.x += (targetRoadX - pu.x) * Math.min(1, dt * 4.0);
      }

      // Attraction magnétique quand le tank s'approche de la caisse de bonus (< 130px)
      const puCx = pu.x + pu.width / 2;
      const puCy = pu.y + pu.height / 2;
      const dist = Math.hypot(pCx - puCx, pCy - puCy);
      if (dist < 130 && dist > 1) {
        const pull = (1 - dist / 130) * 260;
        pu.x += ((pCx - puCx) / dist) * pull * dt;
        pu.y += ((pCy - puCy) / dist) * pull * dt;
      }
    } else {
      pu.y += 60 * dt;
    }
    return pu.y < canvas.height + pu.height + 20;
  });
}

function resolvePowerupCollisions() {
  state.powerups = state.powerups.filter((pu) => {
    // Zone de ramassage généreuse en mode Tank pour ne jamais rater un bonus sur la route
    const pad = selectedGameMode === "tank" ? 12 : 0;
    const hitBox = {
      x: pu.x - pad,
      y: pu.y - pad,
      width: pu.width + pad * 2,
      height: pu.height + pad * 2
    };
    if (rectsOverlap(hitBox, player)) {
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
        player.weaponTime = performance.now() + 10000;
      }
      syncUi();
      return false;
    }
    return true;
  });
}

function drawPowerups() {
  state.powerups.forEach((pu) => {
    let color = "#38bdf8";
    let text = pu.type[0].toUpperCase();
    if (WEAPONS[pu.type]) {
      color = WEAPONS[pu.type].color;
    } else if (pu.type === "invincibility") {
      color = "#fde047";
      text = "🛡️";
    } else if (pu.type === "clone") {
      color = "#00ffff";
      text = "C";
    } else if (pu.type === "airstrike") {
      color = "#f97316";
      text = "✈️";
    }

    const pulse = Math.sin(performance.now() * 0.008) * 4;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 16 + pulse;

    if (selectedGameMode === "tank") {
      // Caisse tactique de ravitaillement haute visibilité posée sur la route !
      const cx = pu.x + pu.width / 2;
      const cy = pu.y + pu.height / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, pu.width * 0.72 + pulse * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(8, 15, 28, 0.9)";
      ctx.fillRect(pu.x, pu.y, pu.width, pu.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(pu.x, pu.y, pu.width, pu.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cx, cy + 1);
    } else {
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
    }

    ctx.restore();
  });
}

function showBossDefeatedDialog(customMsg) {
  state.score += 1500;
  state.lives += 1;
  if (state.boss && !state.boss.isSquad) {
    addExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#4df2c2");
  }
  state.boss = null;

  // Déclenchement du duel post-boss façon Street Fighter (Ken Masters vs Commandant Xéno)
  startVersusDuel(state.wave);
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

        if (enemy.dead && Math.random() < (selectedGameMode === "tank" ? 0.32 : 0.18)) {
          const pool = selectedGameMode === "tank"
            ? ["rapid", "triple", "spread", "plasma", "railgun", "deflagration", "fragbomb", "invincibility", "airstrike", "airstrike"]
            : powerupTypes;
          const type = pool[Math.floor(Math.random() * pool.length)];
          const dropX = selectedGameMode === "tank"
            ? Math.max(45, Math.min(canvas.width - 65, getTankRoadCenterX(enemy.y) + (Math.random() * 90 - 45)))
            : enemy.x + enemy.width / 2 - 12;
          state.powerups.push({
            x: dropX,
            y: enemy.y + enemy.height / 2,
            width: selectedGameMode === "tank" ? 28 : 24,
            height: selectedGameMode === "tank" ? 28 : 24,
            type,
            roadOffset: selectedGameMode === "tank" ? (dropX - getTankRoadCenterX(enemy.y)) : undefined
          });
        }
      }
    });
  });

  // Interception et annulation mutuelle : Tirs joueur vs Tirs / Missiles ennemis
  state.shots.forEach((shot) => {
    if (shot.hit) return;
    state.enemyShots.forEach((eShot) => {
      if (eShot.hit) return;
      if (rectsOverlap(shot, eShot)) {
        shot.hit = true;
        eShot.hit = true;
        addExplosion((shot.x + eShot.x) / 2, (shot.y + eShot.y) / 2, "#38bdf8");
        playSound("hit");
        createFloatingText("INTERCEPTÉ ! +50", (shot.x + eShot.x) / 2, (shot.y + eShot.y) / 2, "#38bdf8");
        state.score += 50;
      }
    });
  });
  state.enemyShots = state.enemyShots.filter((shot) => !shot.hit);

  enemies = enemies.filter((enemy) => !enemy.dead);
  state.shots = state.shots.filter((shot) => !shot.hit);

  if (selectedGameMode === "space") {
    if (!state.boss && enemies.length === 0 && !state.bossDefeatedDialog && !state.levelCompleteAnimation) {
      advanceWave();
    }
  }
}

function resolvePlayerCollisions(timestamp) {
  // Bouclier d'urgence actif : absorbe et désintègre tous les tirs ennemis
  if ((player.shieldActiveTime || 0) > 0) {
    state.enemyShots.forEach((shot) => {
      if (rectsOverlap(shot, player)) {
        shot.hit = true;
        try {
          addExplosion(shot.x + shot.width / 2, shot.y + shot.height / 2, "#38bdf8");
          playSound("hit");
        } catch (e) {}
        createFloatingText("DEFLECT !", shot.x, shot.y, "#7dd3fc");
      }
    });
    state.enemyShots = state.enemyShots.filter((shot) => !shot.hit);
    return;
  }

  if (isPlayerInvulnerable(timestamp)) {
    state.enemyShots = state.enemyShots.filter((shot) => !rectsOverlap(shot, player));
    return;
  }

  let playerWasHit = false;

  for (let i = 0; i < state.enemyShots.length; i++) {
    const shot = state.enemyShots[i];
    if (!shot.hit && rectsOverlap(shot, player)) {
      shot.hit = true;
      playerWasHit = true;
      handlePlayerHit();
      break;
    }
  }
  state.enemyShots = state.enemyShots.filter((shot) => !shot.hit);

  if (!playerWasHit && state.boss && rectsOverlap(state.boss, player)) {
    playerWasHit = true;
    handlePlayerHit();
  }

  if (!playerWasHit && Array.isArray(enemies)) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.dead && rectsOverlap(enemy, player)) {
        playerWasHit = true;
        handlePlayerHit();
        break;
      }
    }
  }
}

function update(delta, timestamp) {
  if (!state.running || state.paused || state.isCinematic) {
    return;
  }

  const dt = delta / 1000;
  if ((player.shieldActiveTime || 0) > 0) {
    player.shieldActiveTime = Math.max(0, player.shieldActiveTime - dt);
  }

  if (selectedGameMode === "slug" && typeof slugGame !== "undefined" && slugGame.active) {
    updateSlugMission(dt, timestamp);
    return;
  }

  if (typeof versusDuel !== "undefined" && versusDuel.active) {
    updateVersusDuel(delta, timestamp);
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
  updateFloatingTexts(dt);
  resolveShotCollisions();
  resolvePowerupCollisions();
  resolvePlayerCollisions(timestamp);
  syncUi();
}

function drawSceneryProp(p, now) {
  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

  // Ombre portée au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.ellipse(3, 4, p.w * 0.45, p.h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (p.type) {
    case "bunker":
      // Bunker fortifié en béton armé
      ctx.fillStyle = "#334155";
      ctx.fillRect(-p.w * 0.42, -p.h * 0.42, p.w * 0.84, p.h * 0.84);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.strokeRect(-p.w * 0.42, -p.h * 0.42, p.w * 0.84, p.h * 0.84);
      // Meurtrière de tir
      ctx.fillStyle = "#020617";
      ctx.fillRect(-p.w * 0.28, -p.h * 0.12, p.w * 0.56, p.h * 0.24);
      break;

    case "trench":
      // Tranchée en zigzag
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-p.w * 0.4, -p.h * 0.35);
      ctx.lineTo(0, 0);
      ctx.lineTo(-p.w * 0.35, p.h * 0.35);
      ctx.stroke();
      break;

    case "hedgerow":
    case "jungle_tree":
      // Végétation vue du dessus (bocage / canopée dense)
      const foliageColor = p.type === "jungle_tree" ? "#14532d" : "#166534";
      ctx.fillStyle = foliageColor;
      ctx.beginPath();
      ctx.arc(0, 0, p.w * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.type === "jungle_tree" ? "#22c55e" : "#4ade80";
      ctx.beginPath();
      ctx.arc(-p.w * 0.12, -p.h * 0.12, p.w * 0.24, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "crater":
      // Cratère d'impact d'obus avec terre brûlée
      ctx.fillStyle = "#0c0a09";
      ctx.beginPath();
      ctx.arc(0, 0, p.w * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = 3;
      ctx.stroke();
      break;

    case "dune":
      // Crête de dune de sable
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w * 0.46, p.h * 0.25, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "palm":
      // Palmier vu d'au-dessus (5 palmes)
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * p.w * 0.44, Math.sin(a) * p.h * 0.44);
        ctx.stroke();
      }
      ctx.fillStyle = "#854d0e";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "crystal":
    case "pylon":
      // Obélisque extraterrestre ou cristal luminescent
      const crystalColor = selectedTankThemeId === "alien" ? "#06b6d4" : "#a855f7";
      ctx.shadowColor = crystalColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = crystalColor;
      ctx.beginPath();
      ctx.moveTo(0, -p.h * 0.45);
      ctx.lineTo(p.w * 0.35, 0);
      ctx.lineTo(0, p.h * 0.45);
      ctx.lineTo(-p.w * 0.35, 0);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      break;

    case "acid_pool":
      // Mare d'acide toxique bouillonnante (thème Predator)
      const bubble = Math.sin(now * 0.005 + p.seed * 10) * 2;
      ctx.fillStyle = "rgba(132, 204, 22, 0.85)";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w * 0.42 + bubble, p.h * 0.3 + bubble, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#a3e635";
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    default:
      ctx.fillStyle = "#475569";
      ctx.fillRect(-p.w * 0.35, -p.h * 0.35, p.w * 0.7, p.h * 0.7);
  }

  ctx.restore();
}

function drawTankBattlefield(w, h, now) {
  const tTheme = TANK_THEMES[selectedTankThemeId] || TANK_THEMES.ww2;
  const halfRoad = getTankRoadHalfWidth();
  const bgImg = state.images["bg_tank_" + selectedTankThemeId];
  const scrollY = (state.tankDistance || 0) % h;

  // 1. Défilement vertical continu (8 écrans) du sol 100% vue aérienne 90° (ZÉRO CIEL)
  const panX = ((player.x + player.width / 2 - w / 2) / Math.max(1, w)) * -24;
  if (bgImg) {
    ctx.drawImage(bgImg, panX - 18, scrollY - h, w + 36, h + 2);
    ctx.drawImage(bgImg, panX - 18, scrollY, w + 36, h + 2);
  } else {
    ctx.fillStyle = tTheme.bankColor || "#1e293b";
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Tracé de la Route Sinueuse 3D suivant getTankRoadCenterX(y)
  const stepY = 16;
  const roadPoints = [];
  for (let y = -20; y <= h + 20; y += stepY) {
    roadPoints.push({ y, cx: getTankRoadCenterX(y) });
  }

  ctx.save();
  // A. Épaulière / Bordure extérieure de la route (terre tassée, rochers ou berme)
  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xL = pt.cx - halfRoad - 12;
    if (i === 0) ctx.moveTo(xL, pt.y);
    else ctx.lineTo(xL, pt.y);
  });
  for (let i = roadPoints.length - 1; i >= 0; i--) {
    const xR = roadPoints[i].cx + halfRoad + 12;
    ctx.lineTo(xR, roadPoints[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = tTheme.roadBorder || "rgba(15, 23, 42, 0.75)";
  ctx.fill();

  // B. Chaussée de la route (Asphalte dégradé, terre battue, sable damé ou plaques alien)
  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xL = pt.cx - halfRoad;
    if (i === 0) ctx.moveTo(xL, pt.y);
    else ctx.lineTo(xL, pt.y);
  });
  for (let i = roadPoints.length - 1; i >= 0; i--) {
    const xR = roadPoints[i].cx + halfRoad;
    ctx.lineTo(xR, roadPoints[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = tTheme.roadColor || "rgba(30, 41, 59, 0.88)";
  ctx.fill();

  // Lignes de rive latérales (bordures peintes ou guides lumineux)
  ctx.strokeStyle = tTheme.accentColor || "#f59e0b";
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xL = pt.cx - halfRoad + 3;
    if (i === 0) ctx.moveTo(xL, pt.y);
    else ctx.lineTo(xL, pt.y);
  });
  ctx.stroke();

  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xR = pt.cx + halfRoad - 3;
    if (i === 0) ctx.moveTo(xR, pt.y);
    else ctx.lineTo(xR, pt.y);
  });
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // C. Ornières de chenilles / Bandes sombres de passage intensif
  ctx.strokeStyle = "rgba(10, 15, 22, 0.55)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xTrackL = pt.cx - halfRoad * 0.48;
    if (i === 0) ctx.moveTo(xTrackL, pt.y);
    else ctx.lineTo(xTrackL, pt.y);
  });
  ctx.stroke();

  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    const xTrackR = pt.cx + halfRoad * 0.48;
    if (i === 0) ctx.moveTo(xTrackR, pt.y);
    else ctx.lineTo(xTrackR, pt.y);
  });
  ctx.stroke();

  // D. Ligne médiane discontinue (Pointillés défilant avec l'avancement !)
  const dashOffset = (state.tankDistance || 0) % 48;
  ctx.strokeStyle = selectedTankThemeId === "alien" ? "#00f2ff" : selectedTankThemeId === "predator" ? "#84cc16" : "#fef08a";
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.72;
  ctx.setLineDash([20, 28]);
  ctx.lineDashOffset = -dashOffset;
  ctx.beginPath();
  roadPoints.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.cx, pt.y);
    else ctx.lineTo(pt.cx, pt.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // 3. Éléments de décor tactiques (bunkers, cratères, palmiers, cristaux) sur les berges
  state.tankProps.forEach((prop) => {
    drawSceneryProp(prop, now);
  });

  // 4. Traces de chenilles laissées en temps réel par le tank du joueur
  state.tankTracks.forEach((tr) => {
    ctx.fillStyle = `rgba(8, 12, 18, ${Math.max(0, tr.life * 0.52)})`;
    ctx.fillRect(tr.x + 4, tr.y, 12, 7);
    ctx.fillRect(tr.x + tr.w - 16, tr.y, 12, 7);
  });

  // 5. Particules d'ambiance 3D (Braises WW2, Sable du désert, Spores Predator, Énergie Alien)
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

  // 6. Barre de Progression des 8 Écrans (Kilométrage & Niveau)
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
  const chassisImg = (tankCfg.chassisKey && state.images[tankCfg.chassisKey]) || state.images.tank_chassis;
  const turretImg = (tankCfg.turretKey && state.images[tankCfg.turretKey]) || state.images.tank_turret;
  const angle = typeof player.turretAngle === "number" ? player.turretAngle : -Math.PI / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // 1. Ombre portée 3D réaliste au sol + Halo tactique de la couleur du blindé choisi
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  ctx.beginPath();
  if (selectedTankId === "mammoth") {
    ctx.ellipse(0, 8, w * 0.58, h * 0.54, 0, 0, Math.PI * 2);
  } else if (selectedTankId === "tesla") {
    // Effet de lévitation / hover : ombre légèrement décalée et plus douce
    ctx.ellipse(0, 14, w * 0.46, h * 0.44, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(0, 6, w * 0.52, h * 0.5, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.shadowColor = tankCfg.trimColor;
  ctx.shadowBlur = selectedTankId === "tesla" ? 22 : 14;

  // 2. Châssis 3D Dédié (avec inclinaison légère selon la direction de braquage)
  ctx.save();
  const tilt = player.vxTilt || 0;
  ctx.rotate(tilt * 0.35);

  // Effet d'ondulation de suspension ou de lévitation hover
  if (selectedTankId === "tesla") {
    const hoverBob = Math.sin(now * 0.006) * 3;
    ctx.translate(0, hoverBob);

    // Halo d'énergie cyan sous les 4 répulseurs aéro-hover
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6 + Math.sin(now * 0.01) * 0.3;
    ctx.beginPath();
    ctx.arc(-w * 0.32, -h * 0.3, 10, 0, Math.PI * 2);
    ctx.arc(w * 0.32, -h * 0.3, 10, 0, Math.PI * 2);
    ctx.arc(-w * 0.32, h * 0.3, 10, 0, Math.PI * 2);
    ctx.arc(w * 0.32, h * 0.3, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  if (chassisImg) {
    ctx.drawImage(chassisImg, -w * 0.62, -h * 0.58, w * 1.24, h * 1.16);
  } else {
    ctx.fillStyle = tankCfg.hullColor;
    ctx.fillRect(-w * 0.42, -h * 0.45, w * 0.84, h * 0.9);
  }

  // Échappements & Réacteurs selon le type de blindé
  if (selectedTankId === "vulcan") {
    // Flammes doubles vives du buggy rapide
    const exh = 12 + Math.sin(now * 0.08) * 6;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(-w * 0.24, h * 0.46, 5, exh);
    ctx.fillRect(w * 0.16, h * 0.46, 5, exh);
  } else if (selectedTankId !== "tesla") {
    const exhaustH = 8 + Math.sin(now * 0.05) * 4;
    ctx.fillStyle = tankCfg.trimColor;
    ctx.beginPath();
    ctx.arc(-w * 0.18, h * 0.48, 3.5, 0, Math.PI * 2);
    ctx.arc(w * 0.18, h * 0.48, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 180, 50, 0.75)";
    ctx.fillRect(-w * 0.21, h * 0.48, 6, exhaustH);
    ctx.fillRect(w * 0.15, h * 0.48, 6, exhaustH);
  }
  ctx.restore();

  // 3. Tourelle Rotative 360° Dédiée (tourne indépendamment vers la cible !)
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
    // Le sprite de tourelle pointe vers le HAUT (-PI/2), on tourne de +PI/2 pour l'aligner avec l'axe 0 radian
    ctx.rotate(Math.PI / 2);
    const tw = w * 1.18;
    const th = h * 1.18;
    ctx.drawImage(turretImg, -tw / 2, -th * 0.62, tw, th);

    // Effet d'arc électrique pour la tourelle Tesla
    if (selectedTankId === "tesla") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sparkY = -th * 0.45;
      ctx.moveTo(0, sparkY);
      ctx.lineTo((Math.random() - 0.5) * 14, sparkY - 12);
      ctx.stroke();
    }
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

  if (selectedGameMode === "slug" && typeof slugGame !== "undefined" && slugGame.active) {
    drawSlugMission(canvas.width, canvas.height, now);
    return;
  }

  if (typeof versusDuel !== "undefined" && versusDuel.active) {
    drawVersusDuel();
    return;
  }

  drawBackground();
  if (!isPlayerInvulnerable(now) || Math.floor(now / 100) % 2 === 0) {
    drawSprite(state.images[player.id], player, player.color, "player");
  }

  // Dôme énergétique du Bouclier d'urgence
  if ((player.shieldActiveTime || 0) > 0) {
    ctx.save();
    const cx = player.x + player.width / 2;
    const cy = player.y + player.height / 2;
    const rad = Math.max(player.width, player.height) * 0.72 + Math.sin(now * 0.015) * 4;

    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();

    const shieldGrad = ctx.createRadialGradient(cx, cy, rad * 0.2, cx, cy, rad);
    shieldGrad.addColorStop(0, "rgba(56, 189, 248, 0.06)");
    shieldGrad.addColorStop(0.7, "rgba(14, 165, 233, 0.22)");
    shieldGrad.addColorStop(1, "rgba(125, 211, 252, 0.5)");
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    for (let i = 0; i < 4; i++) {
      const arcAngle = (now * 0.003) + (i * Math.PI / 2);
      ctx.beginPath();
      ctx.arc(cx, cy, rad - 3, arcAngle, arcAngle + 0.55);
      ctx.stroke();
    }

    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillStyle = "#7dd3fc";
    ctx.textAlign = "center";
    ctx.fillText(`🛡️ ${(player.shieldActiveTime).toFixed(1)}s`, cx, cy - rad - 8);
    ctx.restore();
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
  drawFloatingTexts();
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

  try {
    update(delta, timestamp);
    draw();
  } catch (loopErr) {
    console.error("Frame loop recovery:", loopErr);
  }

  if (state.running && !state.paused) {
    requestAnimationFrame(loop);
  }
}

function handleKeydown(event) {
  keys.add(event.key);

  // Mode Metal Slug 1 Remake
  if (selectedGameMode === "slug" && typeof slugGame !== "undefined" && slugGame.active) {
    if (event.key === " " || event.key === "j" || event.key === "J" || event.key === "f" || event.key === "F") {
      triggerSlugAction("fire");
      return;
    }
    if (event.key === "k" || event.key === "K" || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      triggerSlugAction("jump");
      return;
    }
    if (event.key === "l" || event.key === "L" || event.key === "g" || event.key === "G" || event.key === "b" || event.key === "B") {
      triggerSlugAction("bomb");
      return;
    }
    if (event.key === "x" || event.key === "X") {
      triggerSlugAction("knife");
      return;
    }
  }

  // Mode Duel Versus Street Fighter (Ken Masters)
  if (typeof versusDuel !== "undefined" && versusDuel.active) {
    if (event.key === "a" || event.key === "A" || event.key === "j" || event.key === "J") {
      performDuelAction("punch");
      return;
    }
    if (event.key === "z" || event.key === "Z" || event.key === "k" || event.key === "K") {
      performDuelAction("kick");
      return;
    }
    if (event.key === "e" || event.key === "E" || event.key === "l" || event.key === "L") {
      performDuelAction("hadouken");
      return;
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W" || event.key === " ") {
      performDuelAction("jump");
      return;
    }
  }

  // Raccourci Bouclier d'urgence 3s : Touches X, C ou B (en mode spatial)
  if (event.key === "x" || event.key === "X" || event.key === "c" || event.key === "C" || (selectedGameMode === "space" && (event.key === "b" || event.key === "B"))) {
    activateShield();
  }

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

  // Raccourci M pour rétracter / déployer le menu de gauche (sidebar)
  if (event.key === "m" || event.key === "M") {
    toggleSidebar();
  }

  if (event.key === "p" || event.key === "P" || event.key === "Escape") {
    togglePause();
  }

  // Touche B ou Maj pour déclencher le Support Aérien (Bombardiers) en mode Tank
  if (selectedGameMode === "tank" && (event.key === "b" || event.key === "B" || event.key === "Shift")) {
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

// ==============================================================
// GESTION DU MENU LATÉRAL RÉRACTABLE (PC, TABLETTE & MOBILE)
// ==============================================================
function toggleSidebar(forceState) {
  const isCurrentlyCollapsed = document.body.classList.contains("sidebar-collapsed");
  const willCollapse = typeof forceState === "boolean" ? forceState : !isCurrentlyCollapsed;
  
  document.body.classList.toggle("sidebar-collapsed", willCollapse);
  try {
    localStorage.setItem("nova_sidebar_collapsed", willCollapse ? "true" : "false");
  } catch (e) {}
  updateSidebarToggleButtons(willCollapse);
  setTimeout(resizeCanvas, 320);
}

function updateSidebarToggleButtons(isCollapsed) {
  const floatIcon = document.getElementById("floatingToggleIcon");
  const floatText = document.querySelector(".floating-btn-text");
  const overlayIcon = document.getElementById("overlaySidebarToggleIcon");
  const overlayText = document.getElementById("overlaySidebarToggleText");
  const sideCollapseBtn = document.getElementById("sidebarCollapseHeaderBtn");

  const icon = isCollapsed ? "▶" : "◀";
  const label = isCollapsed ? "Afficher Menu" : "Masquer Menu";

  if (floatIcon) floatIcon.textContent = icon;
  if (floatText) floatText.textContent = isCollapsed ? "Stats" : "Menu";
  if (overlayIcon) overlayIcon.textContent = icon;
  if (overlayText) overlayText.textContent = label;
  if (sideCollapseBtn) sideCollapseBtn.textContent = isCollapsed ? "▶" : "◀";
}

function requestFullscreenMode() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    requestFullscreenMode();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn(err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

document.addEventListener("fullscreenchange", () => {
  const icon = document.getElementById("fullscreenIcon");
  const text = document.getElementById("fullscreenText");
  const isFull = !!document.fullscreenElement;
  if (icon) icon.textContent = isFull ? "🗗" : "⛶";
  if (text) text.textContent = isFull ? "Quitter" : "Plein Écran";
  setTimeout(resizeCanvas, 200);
});

// Écouteurs pour les boutons de rétractation du menu
const overlaySidebarToggle = document.getElementById("overlaySidebarToggle");
if (overlaySidebarToggle) {
  overlaySidebarToggle.addEventListener("click", () => toggleSidebar());
  overlaySidebarToggle.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleSidebar();
  });
}

const floatingSidebarToggle = document.getElementById("floatingSidebarToggle");
if (floatingSidebarToggle) {
  floatingSidebarToggle.addEventListener("click", () => toggleSidebar());
  floatingSidebarToggle.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleSidebar();
  });
}

const sidebarCollapseHeaderBtn = document.getElementById("sidebarCollapseHeaderBtn");
if (sidebarCollapseHeaderBtn) {
  sidebarCollapseHeaderBtn.addEventListener("click", () => toggleSidebar());
  sidebarCollapseHeaderBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleSidebar();
  });
}

const fullscreenToggleBtn = document.getElementById("fullscreenToggleBtn");
if (fullscreenToggleBtn) {
  fullscreenToggleBtn.addEventListener("click", toggleFullscreen);
  fullscreenToggleBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleFullscreen();
  });
}

function runSelfChecks() {
  return true;
}

function handleStartClick() {
  console.log("Start button clicked, running:", state.running, "paused:", state.paused);
  
  // Activer automatiquement le mode Plein Écran au lancement de la mission
  requestFullscreenMode();

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

// 0. Sélecteur de Jeu (Trilogie Arcade : Space Invaders 3D vs Tank Assault 360° vs Metal Slug 1 Remake)
const gameModeCards = document.querySelectorAll(".game-mode-card");
const spaceConfigPanel = document.getElementById("spaceConfigPanel");
const tankConfigPanel = document.getElementById("tankConfigPanel");
const slugConfigPanel = document.getElementById("slugConfigPanel");
const weaponSelectionPanel = document.getElementById("weaponSelection");

function setGameMode(mode) {
  if (mode === "slug") {
    selectedGameMode = "slug";
  } else if (mode === "tank") {
    selectedGameMode = "tank";
  } else {
    selectedGameMode = "space";
  }

  gameModeCards.forEach(c => c.classList.toggle("active", c.getAttribute("data-gamemode") === selectedGameMode));
  if (spaceConfigPanel) spaceConfigPanel.style.display = selectedGameMode === "space" ? "flex" : "none";
  if (tankConfigPanel) tankConfigPanel.style.display = selectedGameMode === "tank" ? "flex" : "none";
  if (slugConfigPanel) slugConfigPanel.style.display = selectedGameMode === "slug" ? "flex" : "none";
  if (weaponSelectionPanel) weaponSelectionPanel.style.display = selectedGameMode === "slug" ? "none" : "block";

  const waveInput = document.getElementById("startWaveInput");
  const waveInputLabel = document.getElementById("waveInputLabel");
  if (selectedGameMode === "slug") {
    if (waveInput) {
      waveInput.max = "1";
      waveInput.value = "1";
    }
    if (waveInputLabel) waveInputLabel.textContent = "Mission :";
    if (ui.startButton && !state.running) ui.startButton.textContent = "DÉMARRER METAL SLUG (MISSION 1)";
  } else if (selectedGameMode === "tank") {
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

// Sélection du Commando d'Élite Metal Slug (Marco Rossi / Tarma Roving)
const slugCommandoCards = document.querySelectorAll(".slug-commando-card");
slugCommandoCards.forEach(card => {
  const chooseCommando = () => {
    slugCommandoCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedSlugCommando = card.getAttribute("data-commando") || "marco";
    syncUi();
    draw();
  };
  card.addEventListener("click", chooseCommando);
  card.addEventListener("touchstart", (e) => {
    e.preventDefault();
    chooseCommando();
  });
});

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

// ==============================================================
// SOUS-MOTEUR "NOVA FIGHTER" (DUEL 2D STREET FIGHTER POST-BOSS)
// KEN MASTERS (JOUEUR) VS COMMANDANT XÉNO (BOSS PILOT)
// ==============================================================
const versusDuel = {
  active: false,
  wave: 1,
  phase: "intro", // "intro", "fight", "ko", "victory"
  timer: 60,
  phaseTimer: 0,
  flashTimer: 0,
  player: {
    name: "Ken Masters",
    x: 180,
    y: 440,
    groundY: 440,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    isGrounded: true,
    facing: 1,
    state: "idle", // "idle", "walk", "jump", "punch", "kick", "hadouken", "hit", "win"
    stateTime: 0,
    attackCooldown: 0,
    combo: 0
  },
  enemy: {
    name: "Commandant Xéno",
    x: 740,
    y: 440,
    groundY: 440,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    isGrounded: true,
    facing: -1,
    state: "idle", // "idle", "walk", "jump", "slash", "shoot", "hit", "ko"
    stateTime: 0,
    aiTimer: 0,
    saberActive: false,
    attackCooldown: 0
  },
  projectiles: [],
  particles: [],
  confetti: [],
  spectators: []
};

function initDuelSpectators() {
  versusDuel.spectators = [];
  const gy = canvas.height - 105;
  // Planche 1 : Foule Populaire & Supporters Gourmands (10 spectateurs uniques et animés)
  // Gauche : 5 supporters populaires terrestres
  versusDuel.spectators.push(
    { id: "fries", side: "human", ratioX: 0.032, y: gy - 8, baseY: gy - 8, phase: 0.2, jacket: "#0284c7", hair: "#b45309" },
    { id: "child", side: "human", ratioX: 0.072, y: gy - 6, baseY: gy - 6, phase: 1.4, shirt: "#dc2626", cap: "#ef4444", scale: 0.72 },
    { id: "balloon", side: "human", ratioX: 0.112, y: gy - 7, baseY: gy - 7, phase: 2.8, dress: "#ec4899", hair: "#f59e0b", scale: 0.78 },
    { id: "soda", side: "human", ratioX: 0.152, y: gy - 9, baseY: gy - 9, phase: 3.9, jacket: "#10b981", hair: "#334155" },
    { id: "flag", side: "human", ratioX: 0.192, y: gy - 10, baseY: gy - 10, phase: 5.1, shirt: "#2563eb", hair: "#fde047" }
  );
  // Droite : 5 supporters de la garnison & hangar militaire
  versusDuel.spectators.push(
    { id: "burger", side: "human", ratioX: 0.808, y: gy - 10, baseY: gy - 10, phase: 0.8, shirt: "#b91c1c", hair: "#1e293b" },
    { id: "beer", side: "human", ratioX: 0.848, y: gy - 9, baseY: gy - 9, phase: 2.1, jacket: "#15803d", hair: "#94a3b8", beret: "#166534" },
    { id: "sign", side: "human", ratioX: 0.888, y: gy - 11, baseY: gy - 11, phase: 3.4, shirt: "#f59e0b", hair: "#475569" },
    { id: "popcorn", side: "human", ratioX: 0.928, y: gy - 8, baseY: gy - 8, phase: 4.6, jacket: "#78350f", hair: "#d97706" },
    { id: "megaphone", side: "human", ratioX: 0.968, y: gy - 9, baseY: gy - 9, phase: 5.8, shirt: "#ea580c", hair: "#1e293b" }
  );
}

function startVersusDuel(wave) {
  state.paused = false;
  state.running = true;
  state.shots = [];
  state.enemyShots = [];
  state.powerups = [];
  
  versusDuel.active = true;
  versusDuel.wave = wave || 1;
  versusDuel.phase = "intro";
  versusDuel.timer = 60;
  versusDuel.phaseTimer = 0;
  versusDuel.flashTimer = 0;
  versusDuel.projectiles = [];
  versusDuel.particles = [];
  versusDuel.confetti = [];

  const gy = canvas.height - 105;
  versusDuel.player.x = Math.max(90, canvas.width * 0.22);
  versusDuel.player.y = gy;
  versusDuel.player.groundY = gy;
  versusDuel.player.vx = 0;
  versusDuel.player.vy = 0;
  versusDuel.player.hp = 100;
  versusDuel.player.maxHp = 100;
  versusDuel.player.facing = 1;
  versusDuel.player.state = "idle";
  versusDuel.player.stateTime = 0;
  versusDuel.player.combo = 0;

  versusDuel.enemy.x = Math.min(canvas.width - 90, canvas.width * 0.78);
  versusDuel.enemy.y = gy;
  versusDuel.enemy.groundY = gy;
  versusDuel.enemy.vx = 0;
  versusDuel.enemy.vy = 0;
  versusDuel.enemy.hp = 100;
  versusDuel.enemy.maxHp = 100;
  versusDuel.enemy.facing = -1;
  versusDuel.enemy.state = "idle";
  versusDuel.enemy.stateTime = 0;
  versusDuel.enemy.aiTimer = 0;
  versusDuel.enemy.saberActive = false;

  initDuelSpectators();
  playSound("crowd");

  // Masquer les contrôles tank/space mobile et afficher les boutons tactiles de combat
  const tankControls = document.getElementById("tankMobileTurretControls");
  if (tankControls) tankControls.style.display = "none";
  const duelMob = document.getElementById("duelMobileControls");
  if (duelMob) duelMob.style.display = "flex";
}

function performDuelAction(action) {
  if (!versusDuel.active || versusDuel.phase !== "fight") return;
  const p = versusDuel.player;
  const e = versusDuel.enemy;

  if (action === "jump" && p.isGrounded) {
    p.vy = -490;
    p.isGrounded = false;
    p.state = "jump";
    p.stateTime = 0;
    return;
  }

  if (p.attackCooldown > 0) return;

  if (action === "punch") {
    p.state = "punch";
    p.stateTime = 0;
    p.attackCooldown = 0.24;
    playSound("punch");

    const dist = Math.abs((p.x + (p.facing * 35)) - e.x);
    if (dist < 65 && Math.abs(p.y - e.y) < 50) {
      e.hp = Math.max(0, e.hp - 12);
      e.state = "hit";
      e.stateTime = 0;
      e.vx = p.facing * 160;
      p.combo++;
      addDuelSparks((p.x + e.x) / 2, e.y - 35, "#ffea00", 12);
      playSound("hit");
      if (e.hp <= 0) triggerDuelKO();
    }
  } else if (action === "kick") {
    p.state = "kick";
    p.stateTime = 0;
    p.attackCooldown = 0.32;
    playSound("kick");

    const dist = Math.abs((p.x + (p.facing * 45)) - e.x);
    if (dist < 85 && Math.abs(p.y - e.y) < 55) {
      e.hp = Math.max(0, e.hp - 18);
      e.state = "hit";
      e.stateTime = 0;
      e.vx = p.facing * 220;
      p.combo++;
      addDuelSparks((p.x + e.x) / 2, e.y - 45, "#f97316", 16);
      playSound("hit");
      if (e.hp <= 0) triggerDuelKO();
    }
  } else if (action === "hadouken") {
    p.state = "hadouken";
    p.stateTime = 0;
    p.attackCooldown = 0.55;
    playSound("hadouken");

    versusDuel.projectiles.push({
      x: p.x + p.facing * 42,
      y: p.y - 40,
      vx: p.facing * 540,
      radius: 20,
      type: "hadouken",
      color: "#38bdf8",
      owner: "player"
    });
  }
}

function addDuelSparks(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 60 + Math.random() * 220;
    versusDuel.particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 60,
      life: 0.35 + Math.random() * 0.25,
      maxLife: 0.5,
      color: color || "#ffea00",
      size: 2.5 + Math.random() * 3.5
    });
  }
}

function triggerDuelKO() {
  versusDuel.phase = "ko";
  versusDuel.phaseTimer = 0;
  versusDuel.flashTimer = 0.4;
  versusDuel.enemy.state = "ko";
  versusDuel.enemy.stateTime = 0;
  versusDuel.player.state = "win";
  playSound("ko");
  playSound("crowd");

  addDuelSparks(versusDuel.enemy.x, versusDuel.enemy.y - 30, "#ef4444", 30);

  versusDuel.confetti = [];
  for (let i = 0; i < 90; i++) {
    versusDuel.confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 80,
      vy: 120 + Math.random() * 140,
      color: ["#f59e0b", "#38bdf8", "#ef4444", "#10b981", "#ec4899", "#ffffff"][Math.floor(Math.random() * 6)],
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 6
    });
  }
}

function endVersusDuelVictory() {
  versusDuel.active = false;
  state.score += 50000;
  createFloatingText("⭐ VICTOIRE DUEL : +50 000 PTS ⭐", canvas.width / 2, canvas.height / 2, "#fbbf24");
  syncUi();

  const duelMob = document.getElementById("duelMobileControls");
  if (duelMob) duelMob.style.display = "none";
  const tankControls = document.getElementById("tankMobileTurretControls");
  if (tankControls && selectedGameMode === "tank") tankControls.style.display = "flex";

  advanceWave();
}

function updateVersusDuel(delta, timestamp) {
  const dt = delta / 1000;
  const p = versusDuel.player;
  const e = versusDuel.enemy;
  const gy = canvas.height - 105;
  p.groundY = gy;
  e.groundY = gy;

  versusDuel.phaseTimer += dt;
  if (versusDuel.flashTimer > 0) versusDuel.flashTimer -= dt;

  if (versusDuel.phase === "intro") {
    if (versusDuel.phaseTimer > 1.8) {
      versusDuel.phase = "fight";
      versusDuel.phaseTimer = 0;
      playSound("hadouken");
    }
  } else if (versusDuel.phase === "fight") {
    versusDuel.timer = Math.max(0, versusDuel.timer - dt);
    if (versusDuel.timer <= 0) {
      if (p.hp >= e.hp) triggerDuelKO();
      else {
        p.hp = 0;
        versusDuel.phase = "ko";
      }
    }
  } else if (versusDuel.phase === "ko") {
    if (versusDuel.phaseTimer > 1.5) {
      versusDuel.phase = "victory";
      versusDuel.phaseTimer = 0;
    }
  } else if (versusDuel.phase === "victory") {
    if (versusDuel.phaseTimer > 3.2) {
      endVersusDuelVictory();
      return;
    }
  }

  if (p.attackCooldown > 0) p.attackCooldown -= dt;
  p.stateTime += dt;

  if (versusDuel.phase === "fight" && p.state !== "punch" && p.state !== "kick" && p.state !== "hadouken") {
    let moveDir = 0;
    if (keys.has("ArrowLeft") || keys.has("q") || keys.has("Q")) moveDir -= 1;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) moveDir += 1;

    p.vx = moveDir * 230;
    if (moveDir !== 0) {
      p.facing = moveDir;
      if (p.isGrounded) p.state = "walk";
    } else if (p.isGrounded) {
      p.state = "idle";
    }
  }

  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (!p.isGrounded) {
    p.vy += 1200 * dt;
    if (p.y >= p.groundY) {
      p.y = p.groundY;
      p.vy = 0;
      p.isGrounded = true;
      if (p.state === "jump") p.state = "idle";
    }
  }
  p.x = Math.max(40, Math.min(canvas.width - 40, p.x));

  if ((p.state === "punch" && p.stateTime > 0.22) ||
      (p.state === "kick" && p.stateTime > 0.28) ||
      (p.state === "hadouken" && p.stateTime > 0.38) ||
      (p.state === "hit" && p.stateTime > 0.26)) {
    p.state = p.isGrounded ? "idle" : "jump";
  }

  e.stateTime += dt;
  e.aiTimer += dt;
  if (e.attackCooldown > 0) e.attackCooldown -= dt;

  if (versusDuel.phase === "fight" && e.hp > 0) {
    const dx = p.x - e.x;
    e.facing = dx >= 0 ? 1 : -1;
    const dist = Math.abs(dx);

    if (e.aiTimer > 0.8 && e.attackCooldown <= 0) {
      e.aiTimer = 0;
      if (dist < 90) {
        e.state = "slash";
        e.stateTime = 0;
        e.saberActive = true;
        e.attackCooldown = 0.65;
        playSound("saber");
        if (dist < 75 && Math.abs(p.y - e.y) < 45) {
          p.hp = Math.max(0, p.hp - 15);
          p.state = "hit";
          p.stateTime = 0;
          p.vx = e.facing * 180;
          p.combo = 0;
          addDuelSparks((p.x + e.x) / 2, p.y - 35, "#a855f7", 14);
          playSound("hit");
          if (p.hp <= 0) triggerDuelKO();
        }
      } else if (dist > 180 && Math.random() < 0.6) {
        e.state = "shoot";
        e.stateTime = 0;
        e.attackCooldown = 0.8;
        playSound("enemyShoot");
        versusDuel.projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 40,
          vx: e.facing * 430,
          radius: 12,
          type: "laser",
          color: "#22c55e",
          owner: "enemy"
        });
      } else {
        e.vx = e.facing * 130;
        e.state = "walk";
      }
    } else if (e.state === "walk") {
      e.vx *= 0.95;
      if (Math.abs(e.vx) < 10) e.state = "idle";
    }

    if (e.state === "slash" && e.stateTime > 0.35) {
      e.state = "idle";
      e.saberActive = false;
    }
    if (e.state === "shoot" && e.stateTime > 0.3) {
      e.state = "idle";
    }
    if (e.state === "hit" && e.stateTime > 0.28) {
      e.state = "idle";
    }
  }

  e.x += e.vx * dt;
  e.y += e.vy * dt;
  if (!e.isGrounded) {
    e.vy += 1200 * dt;
    if (e.y >= e.groundY) {
      e.y = e.groundY;
      e.vy = 0;
      e.isGrounded = true;
    }
  }
  e.x = Math.max(50, Math.min(canvas.width - 50, e.x));

  versusDuel.projectiles.forEach((proj) => {
    proj.x += proj.vx * dt;
  });

  for (let i = versusDuel.projectiles.length - 1; i >= 0; i--) {
    const p1 = versusDuel.projectiles[i];
    if (p1.dead) continue;
    for (let j = i - 1; j >= 0; j--) {
      const p2 = versusDuel.projectiles[j];
      if (p2.dead || p1.owner === p2.owner) continue;
      if (Math.hypot(p1.x - p2.x, p1.y - p2.y) < p1.radius + p2.radius) {
        p1.dead = true;
        p2.dead = true;
        addDuelSparks((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, "#38bdf8", 22);
        playSound("hit");
      }
    }
  }

  versusDuel.projectiles.forEach((proj) => {
    if (proj.dead) return;
    if (proj.owner === "player") {
      if (Math.hypot(proj.x - e.x, proj.y - (e.y - 40)) < proj.radius + 30) {
        proj.dead = true;
        e.hp = Math.max(0, e.hp - 25);
        e.state = "hit";
        e.stateTime = 0;
        e.vx = p.facing * 240;
        p.combo++;
        addDuelSparks(proj.x, proj.y, "#38bdf8", 25);
        playSound("punch");
        playSound("hit");
        if (e.hp <= 0) triggerDuelKO();
      }
    } else if (proj.owner === "enemy") {
      if (Math.hypot(proj.x - p.x, proj.y - (p.y - 40)) < proj.radius + 25) {
        proj.dead = true;
        p.hp = Math.max(0, p.hp - 14);
        p.state = "hit";
        p.stateTime = 0;
        p.vx = e.facing * 180;
        p.combo = 0;
        addDuelSparks(proj.x, proj.y, "#22c55e", 18);
        playSound("hit");
        if (p.hp <= 0) triggerDuelKO();
      }
    }
  });

  versusDuel.projectiles = versusDuel.projectiles.filter((proj) => !proj.dead && proj.x > -40 && proj.x < canvas.width + 40);

  versusDuel.particles.forEach((pt) => {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.life -= dt;
  });
  versusDuel.particles = versusDuel.particles.filter((pt) => pt.life > 0);

  versusDuel.confetti.forEach((c) => {
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    c.rot += c.rotSpd * dt;
  });
  versusDuel.confetti = versusDuel.confetti.filter((c) => c.y < canvas.height + 40);
}

function drawVersusDuel() {
  const now = performance.now();
  const w = canvas.width;
  const h = canvas.height;
  const gy = canvas.height - 105;

  ctx.save();

  // 1. DÉCOR C : ASTRO-HANGAR MILITAIRE TERRIEN (128-BIT 4K)
  // Mur d'arrière-plan en plaques de blindage rivetées
  const wallGrad = ctx.createLinearGradient(0, 0, 0, gy);
  wallGrad.addColorStop(0, "#080c14");
  wallGrad.addColorStop(0.3, "#0f172a");
  wallGrad.addColorStop(0.7, "#1e293b");
  wallGrad.addColorStop(1, "#111827");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, w, h);

  // Verrière industrielle supérieure & Ciel crépusculaire d'alerte
  const winH = gy * 0.38;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, winH);
  skyGrad.addColorStop(0, "#1e293b");
  skyGrad.addColorStop(0.5, "#334155");
  skyGrad.addColorStop(1, "#475569");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(w * 0.08, 12, w * 0.84, winH);

  // Volutes de fumée de champ de bataille derrière la verrière
  ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
  for (let sm = 0; sm < 6; sm++) {
    const smX = (w * 0.12) + ((sm * 160 + now * 0.015) % (w * 0.76));
    const smY = 25 + Math.sin(sm * 2 + now * 0.001) * 15;
    ctx.beginPath();
    ctx.arc(smX, smY, 32 + sm * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Châssis métallique en croisillons de la verrière (Industrial Windowpanes)
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 4;
  ctx.strokeRect(w * 0.08, 12, w * 0.84, winH);
  const paneStep = (w * 0.84) / 7;
  for (let p = 1; p < 7; p++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.08 + p * paneStep, 12);
    ctx.lineTo(w * 0.08 + p * paneStep, 12 + winH);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(w * 0.08, 12 + winH * 0.5);
  ctx.lineTo(w * 0.92, 12 + winH * 0.5);
  ctx.stroke();

  // Poutres et charpente supérieure en acier rivetée (Trusses)
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, w, 24);
  // Bandes de sécurité diagonales jaune & noir sur la poutre maîtresse
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, 12);
  ctx.clip();
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(0, 0, w, 12);
  ctx.fillStyle = "#0f172a";
  for (let bz = -20; bz < w + 40; bz += 30) {
    ctx.beginPath();
    ctx.moveTo(bz, 0);
    ctx.lineTo(bz + 14, 0);
    ctx.lineTo(bz - 2, 12);
    ctx.lineTo(bz - 16, 12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Rivets industriels sur la traverse
  ctx.fillStyle = "#64748b";
  for (let rv = 25; rv < w; rv += 45) {
    ctx.beginPath();
    ctx.arc(rv, 18, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Silhouette du Blindé Lourd M4 Grizzly / Mammoth en maintenance en arrière-plan
  const tankX = w * 0.5;
  const tankY = gy - 32;
  ctx.save();
  // Chenilles du char d'arrière-plan
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(tankX - 110, tankY - 14, 220, 30, 6);
  ctx.fill();
  // Châssis massif et plaques de blindage
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(tankX - 100, tankY - 12);
  ctx.lineTo(tankX - 85, tankY - 48);
  ctx.lineTo(tankX + 85, tankY - 48);
  ctx.lineTo(tankX + 100, tankY - 12);
  ctx.closePath();
  ctx.fill();
  // Tourelle lourde & double canon de 105mm
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.roundRect(tankX - 55, tankY - 78, 110, 34, [10, 10, 4, 4]);
  ctx.fill();
  // Fût de canon pointé vers la gauche
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(tankX - 145, tankY - 68, 92, 12);
  ctx.fillRect(tankX - 152, tankY - 71, 9, 18); // Frein de bouche
  // Câbles d'alimentation haute tension jaunes et bleus au sol
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tankX - 70, tankY - 8);
  ctx.bezierCurveTo(tankX - 110, tankY + 12, tankX - 150, tankY - 4, tankX - 210, tankY + 14);
  ctx.stroke();
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(tankX + 65, tankY - 8);
  ctx.bezierCurveTo(tankX + 105, tankY + 15, tankX + 160, tankY - 2, tankX + 220, tankY + 14);
  ctx.stroke();

  // Étincelles cinématiques de soudure industrielle (Arc Welding Flash)
  const isWelding = (Math.floor(now / 1600) % 2 === 0) && (now % 1600 < 550);
  if (isWelding) {
    const weldX = tankX + 48;
    const weldY = tankY - 44;
    // Halo lumineux dynamique bleu/blanc
    const weldGrad = ctx.createRadialGradient(weldX, weldY, 4, weldX, weldY, 95);
    weldGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    weldGrad.addColorStop(0.35, "rgba(56, 189, 248, 0.65)");
    weldGrad.addColorStop(0.8, "rgba(2, 132, 199, 0.2)");
    weldGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
    ctx.fillStyle = weldGrad;
    ctx.beginPath();
    ctx.arc(weldX, weldY, 95, 0, Math.PI * 2);
    ctx.fill();

    // Éclats d'étincelles qui jaillissent
    ctx.fillStyle = "#ffffff";
    for (let spk = 0; spk < 12; spk++) {
      const spkAngle = (spk * 0.52 + now * 0.05) % (Math.PI * 2);
      const spkDist = 12 + (spk * 7) % 36;
      ctx.fillRect(weldX + Math.cos(spkAngle) * spkDist, weldY + Math.sin(spkAngle) * spkDist, 2.5, 2.5);
    }
  }
  ctx.restore();

  // Projecteurs halogènes de chantier montés au plafond (Spotlights)
  for (let hl = 0; hl < 2; hl++) {
    const hlX = hl === 0 ? w * 0.28 : w * 0.72;
    // Faisceau volumétrique jaune chaud
    ctx.save();
    const beamGrad = ctx.createLinearGradient(hlX, 24, hlX + (hl === 0 ? 55 : -55), gy);
    beamGrad.addColorStop(0, "rgba(254, 240, 138, 0.35)");
    beamGrad.addColorStop(0.5, "rgba(254, 240, 138, 0.12)");
    beamGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(hlX - 16, 24);
    ctx.lineTo(hlX - 110, gy);
    ctx.lineTo(hlX + 110, gy);
    ctx.lineTo(hlX + 16, 24);
    ctx.closePath();
    ctx.fill();

    // Boîtier du projecteur de chantier
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(hlX - 16, 18, 32, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(hlX - 12, 28, 24, 4);
    ctx.restore();
  }

  // Bannière Militaire d'Arène 4K
  const bannerY = gy - 95;
  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(w * 0.18, bannerY, w * 0.64, 22);
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.strokeRect(w * 0.18, bannerY, w * 0.64, 22);
  ctx.fillStyle = "#fbbf24";
  ctx.font = "900 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 10;
  ctx.fillText("⚡ HANGAR D'ASSAUT MILITAIRE // SECTEUR 12 // DUEL DE COMMANDEMENT 4K ⚡", w * 0.5, bannerY + 15);
  ctx.restore();

  // 3. SOL INDUSTRIEL EN BÉTON ARMÉ & TRACES DE CHENILLES
  const floorGrad = ctx.createLinearGradient(0, gy, 0, h);
  floorGrad.addColorStop(0, "#27303f");
  floorGrad.addColorStop(0.15, "#1e2532");
  floorGrad.addColorStop(0.65, "#111827");
  floorGrad.addColorStop(1, "#030712");
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, gy, w, h - gy);

  // Zébrures d'avertissement de sécurité (Hazard Stripes) le long du plateau
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, gy, w, 14);
  ctx.clip();
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(0, gy, w, 14);
  ctx.fillStyle = "#0f172a";
  for (let hz = -20; hz < w + 40; hz += 26) {
    ctx.beginPath();
    ctx.moveTo(hz, gy);
    ctx.lineTo(hz + 14, gy);
    ctx.lineTo(hz - 2, gy + 14);
    ctx.lineTo(hz - 16, gy + 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Traces de chenilles de chars incrustées dans le sol
  ctx.fillStyle = "rgba(10, 15, 26, 0.55)";
  for (let trk = 25; trk < w - 25; trk += 18) {
    if ((trk > w * 0.22 && trk < w * 0.38) || (trk > w * 0.62 && trk < w * 0.78)) {
      ctx.fillRect(trk, gy + 18, 12, 6);
      ctx.fillRect(trk, gy + 32, 12, 6);
    }
  }

  // Grilles de ventilation au sol & vapeur montante
  for (let vg = 0; vg < 2; vg++) {
    const vgX = vg === 0 ? w * 0.16 : w * 0.84;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(vgX - 25, gy + 20, 50, 12);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    for (let vl = -20; vl < 25; vl += 8) {
      ctx.beginPath();
      ctx.moveTo(vgX + vl, gy + 20);
      ctx.lineTo(vgX + vl, gy + 32);
      ctx.stroke();
    }
    // Volutes de vapeur blanche
    ctx.fillStyle = "rgba(241, 245, 249, 0.18)";
    for (let vp = 0; vp < 3; vp++) {
      const vY = gy + 14 - ((now * 0.03 + vp * 16) % 45);
      const vR = 7 + (gy + 14 - vY) * 0.28;
      ctx.beginPath();
      ctx.arc(vgX + Math.sin(vY * 0.1) * 8, vY, vR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. PLANCHE 1 : FOULE POPULAIRE & SUPPORTERS GOURMANDS (10 SPECTATEURS ULTRA-DÉTAILLÉS)
  const isWinning = versusDuel.phase === "victory" || versusDuel.phase === "ko";
  versusDuel.spectators.forEach((sp) => {
    const spX = sp.ratioX ? (sp.ratioX * w) : sp.x;
    const baseAmp = sp.id === "child" ? 14 : 6;
    const jumpAmp = isWinning ? (baseAmp + 10) : baseAmp;
    const jumpY = (sp.baseY || (gy - 8)) - Math.abs(Math.sin(now * 0.007 + sp.phase)) * jumpAmp;

    ctx.save();
    ctx.translate(spX, jumpY);
    if (sp.scale) ctx.scale(sp.scale, sp.scale);

    // Ombre portée sous le spectateur
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rendu spécifique selon le personnage de la Planche 1
    if (sp.id === "fries") {
      // 1. MANGEUR DE FRITES : Bleus de travail, cornet rouge de frites & ketchup
      // Corps
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      // Tête & Casquette
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#b45309";
      ctx.fillRect(-7, -35, 14, 5); // Casquette marron
      // Cornet de frites tenu dans la main gauche
      ctx.fillStyle = "#ef4444"; // Cornet rouge
      ctx.beginPath();
      ctx.moveTo(-14, -14);
      ctx.lineTo(-7, -14);
      ctx.lineTo(-9, -4);
      ctx.lineTo(-12, -4);
      ctx.closePath();
      ctx.fill();
      // Bâtonnets de frites dorées
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(-13, -19, 2.5, 6);
      ctx.fillRect(-10, -21, 2.5, 8);
      ctx.fillRect(-7, -18, 2.5, 5);
      // Goutte de ketchup
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath();
      ctx.arc(-9, -17, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Bras droit portant une frite à la bouche
      const fryCycle = Math.sin(now * 0.004 + sp.phase);
      const handY = -22 + fryCycle * 6;
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(6, -18);
      ctx.lineTo(8, handY);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(7, handY - 4, 2, 5); // Frite tenue
    } else if (sp.id === "child") {
      // 2. ENFANT BONDISSANT : Casquette rouge à l'envers, t-shirt Ken, double poings levés
      // Corps t-shirt bleu
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(-7, -22, 14, 20, 3);
      ctx.fill();
      // Logo étoile sur le t-shirt
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, -13, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Tête
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -28, 6.5, 0, Math.PI * 2);
      ctx.fill();
      // Casquette rouge à l'envers (visière pointée vers l'arrière)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -31, 6.5, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(4, -31, 6, 3); // Visière arrière
      // Double bras levés au ciel avec poings jubilatoires
      const cheerArm = Math.sin(now * 0.015 + sp.phase) * 4;
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-6, -18);
      ctx.lineTo(-12, -36 + cheerArm);
      ctx.moveTo(6, -18);
      ctx.lineTo(12, -36 - cheerArm);
      ctx.stroke();
      // Poings fermés
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(-12, -37 + cheerArm, 2.8, 0, Math.PI * 2);
      ctx.arc(12, -37 - cheerArm, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (sp.id === "balloon") {
      // 3. PETITE FILLE AU BALLON ROUGE 3D : Robe rose, cheveux blonds & ficelle de ballon
      // Robe rose bonbon
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.moveTo(-7, -8);
      ctx.lineTo(7, -8);
      ctx.lineTo(9, 6);
      ctx.lineTo(-9, 6);
      ctx.closePath();
      ctx.fill();
      // Tête & couettes blondes
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -15, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b"; // Cheveux blonds
      ctx.beginPath();
      ctx.arc(-6, -16, 3.5, 0, Math.PI * 2);
      ctx.arc(6, -16, 3.5, 0, Math.PI * 2);
      ctx.arc(0, -19, 5, 0, Math.PI * 2);
      ctx.fill();
      // Ficelle ondulante du ballon
      const balSway = Math.sin(now * 0.003 + sp.phase) * 8;
      const balX = -10 + balSway;
      const balY = -56;
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -8);
      ctx.quadraticCurveTo(-14 + balSway * 0.5, -34, balX, balY + 12);
      ctx.stroke();
      // Ballon 3D rouge brillant
      ctx.save();
      const balGrad = ctx.createRadialGradient(balX - 3, balY - 3, 2, balX, balY, 13);
      balGrad.addColorStop(0, "#ffffff"); // Reflet spéculaire
      balGrad.addColorStop(0.25, "#f87171");
      balGrad.addColorStop(0.7, "#dc2626");
      balGrad.addColorStop(1, "#991b1b");
      ctx.fillStyle = balGrad;
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(balX, balY, 11, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Nœud du ballon
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath();
      ctx.moveTo(balX - 2, balY + 12);
      ctx.lineTo(balX + 2, balY + 12);
      ctx.lineTo(balX, balY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (sp.id === "soda") {
      // 4. BUVEUR DE SODA : Veste verte, gobelet rayé avec couvercle & paille jaune coudée
      // Corps
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      // Tête
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      // Gobelet de soda rayé tenu à deux mains
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-5, -17, 10, 14);
      // Rayures rouges sur le gobelet
      ctx.fillStyle = "#e11d48";
      ctx.fillRect(-5, -14, 10, 3);
      ctx.fillRect(-5, -8, 10, 3);
      // Couvercle blanc
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(-6, -19, 12, 3);
      // Paille jaune fluo coudée allant à la bouche
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -19);
      ctx.lineTo(1, -26);
      ctx.lineTo(0, -28); // Dans la bouche
      ctx.stroke();
    } else if (sp.id === "flag") {
      // 5. SUPPORTER AUX 2 DRAPEAUX : Agite vigoureusement deux fanions NOVA (bleu et or)
      // Corps
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      // Tête & Bandana
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fde047";
      ctx.fillRect(-7, -33, 14, 4); // Bandana front
      // Bras agitant les 2 drapeaux
      const flagWave = Math.sin(now * 0.009 + sp.phase);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      // Hampe drapeau 1 (Gauche - Bleu NOVA)
      ctx.beginPath();
      ctx.moveTo(-6, -18);
      ctx.lineTo(-18 + flagWave * 3, -44);
      ctx.stroke();
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath();
      ctx.moveTo(-18 + flagWave * 3, -44);
      ctx.lineTo(-34 + flagWave * 5, -36);
      ctx.lineTo(-18 + flagWave * 3, -28);
      ctx.closePath();
      ctx.fill();
      // Hampe drapeau 2 (Droite - Or NOVA)
      ctx.beginPath();
      ctx.moveTo(6, -18);
      ctx.lineTo(18 - flagWave * 3, -44);
      ctx.stroke();
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.moveTo(18 - flagWave * 3, -44);
      ctx.lineTo(34 - flagWave * 5, -36);
      ctx.lineTo(18 - flagWave * 3, -28);
      ctx.closePath();
      ctx.fill();
    } else if (sp.id === "burger") {
      // 6. MANGEUR DE DOUBLE BURGER : Chemise bûcheron, burger géant à double steak & cheddar
      // Corps costaud
      ctx.fillStyle = "#991b1b";
      ctx.beginPath();
      ctx.roundRect(-10, -24, 20, 22, 4);
      ctx.fill();
      // Tête
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 7, 0, Math.PI * 2);
      ctx.fill();
      // Double Burger géant tenu à deux mains
      const bY = -18;
      // Pain supérieur brioché
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.ellipse(0, bY - 6, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Graines de sésame
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(-4, bY - 8, 1.5, 1.5);
      ctx.fillRect(1, bY - 9, 1.5, 1.5);
      ctx.fillRect(5, bY - 7, 1.5, 1.5);
      // Salade verte & Tomate rouge
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(-10, bY - 3, 20, 2.5);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-9, bY - 1, 18, 2);
      // Double steak haché
      ctx.fillStyle = "#451a03";
      ctx.fillRect(-10, bY + 1, 20, 3);
      // Cheddar fondu qui dégouline
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(-9, bY + 4, 18, 2.5);
      ctx.beginPath();
      ctx.moveTo(3, bY + 6);
      ctx.lineTo(5, bY + 9);
      ctx.lineTo(7, bY + 6);
      ctx.fill();
      // Second steak & pain inférieur
      ctx.fillStyle = "#451a03";
      ctx.fillRect(-10, bY + 6, 20, 3);
      ctx.fillStyle = "#d97706";
      ctx.fillRect(-10, bY + 9, 20, 3.5);
    } else if (sp.id === "beer") {
      // 7. VÉTÉRAN À LA CHOPE DE BIÈRE : Veste militaire, béret vert, chope avec mousse débordante
      // Veste de treillis militaire
      ctx.fillStyle = "#166534";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      // Tête & Moustache blanche de vétéran
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f1f5f9"; // Moustache guidon
      ctx.fillRect(-4, -27, 8, 2.5);
      // Béret militaire vert & insigne or
      ctx.fillStyle = "#14532d";
      ctx.beginPath();
      ctx.ellipse(1, -34, 8, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(-2, -35, 3, 3);
      // Bras droit levant une grande chope de bière
      const beerArmSway = Math.sin(now * 0.006 + sp.phase) * 3;
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(6, -18);
      ctx.lineTo(12, -28 + beerArmSway);
      ctx.stroke();
      // Chope de bière en verre
      const chX = 14;
      const chY = -34 + beerArmSway;
      ctx.fillStyle = "rgba(226, 232, 240, 0.45)"; // Verre transparent
      ctx.fillRect(chX - 4, chY, 10, 14);
      // Bière blonde dorée
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(chX - 3, chY + 3, 8, 10);
      // Mousse blanche crémeuse débordante
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(chX - 2, chY + 1, 4, 0, Math.PI * 2);
      ctx.arc(chX + 2, chY, 4.5, 0, Math.PI * 2);
      ctx.arc(chX + 6, chY + 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Goutte de mousse qui tombe
      ctx.fillRect(chX + 5, chY + 6, 2, 3);
    } else if (sp.id === "sign") {
      // 8. PORTEUR DE PANCARTE "K.O. KEN WIN !" : Bras tendus portant un grand panneau
      // Corps
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      // Tête
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      // Deux montants en bois portant la pancarte
      const sY = -50 + Math.sin(now * 0.008 + sp.phase) * 4;
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-12, -18);
      ctx.lineTo(-12, sY + 18);
      ctx.moveTo(12, -18);
      ctx.lineTo(12, sY + 18);
      ctx.stroke();
      // Pancarte en carton robuste
      ctx.fillStyle = "#b45309";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-24, sY, 48, 18, 3);
      ctx.fill();
      ctx.stroke();
      // Inscription "★ K.O. KEN WIN ! ★"
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 7.5px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★ K.O. KEN WIN ! ★", 0, sY + 12);
    } else if (sp.id === "popcorn") {
      // 9. PILOTE AU POP-CORN : Blouson d'aviateur, lunettes d'aviateur, pot de pop-corn rayé
      // Blouson de cuir marron & col en peau de mouton blanche
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 3);
      ctx.fill();
      ctx.fillStyle = "#f8fafc"; // Col en mouton retourné
      ctx.fillRect(-7, -26, 14, 4);
      // Tête & Lunettes de soleil d'aviateur
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -30, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a"; // Verres noirs
      ctx.fillRect(-5, -31, 4, 3);
      ctx.fillRect(1, -31, 4, 3);
      // Seau de pop-corn rayé rouge et blanc
      const pcX = 0;
      const pcY = -15;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(pcX - 6, pcY);
      ctx.lineTo(pcX + 6, pcY);
      ctx.lineTo(pcX + 5, pcY + 14);
      ctx.lineTo(pcX - 5, pcY + 14);
      ctx.closePath();
      ctx.fill();
      // Rayures rouges verticales
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(pcX - 3.5, pcY, 2.5, 14);
      ctx.fillRect(pcX + 1.5, pcY, 2.5, 14);
      // Pop-corn doré soufflé débordant
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(pcX - 3, pcY - 2, 3, 0, Math.PI * 2);
      ctx.arc(pcX + 1, pcY - 4, 3.5, 0, Math.PI * 2);
      ctx.arc(pcX + 4, pcY - 1, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (sp.id === "megaphone") {
      // 10. SUPPORTER AU MÉGAPHONE : Sweat à capuche orange, mégaphone industriel & ondes sonores
      // Sweat orange vif
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.roundRect(-8, -24, 16, 22, 4);
      ctx.fill();
      // Tête
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -29, 6.5, 0, Math.PI * 2);
      ctx.fill();
      // Mégaphone orange de chantier orienté vers l'arène (gauche)
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(-5, -23);
      ctx.lineTo(-18, -28);
      ctx.lineTo(-18, -18);
      ctx.closePath();
      ctx.fill();
      // Pavillon & Poignée noire
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-19, -29, 2.5, 12);
      ctx.fillRect(-8, -19, 3, 5);
      // Ondes sonores concentriques animées pulsant vers le combat
      const megaPulse = (now * 0.008) % 3;
      ctx.strokeStyle = "rgba(249, 115, 22, 0.75)";
      ctx.lineWidth = 1.8;
      for (let s = 1; s <= 2; s++) {
        const rad = 6 + ((megaPulse + s) % 3) * 7;
        ctx.beginPath();
        ctx.arc(-22, -23, rad, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  // 5. COMBATTANTS 4K : KEN MASTERS VS COMMANDANT XÉNO
  drawKenMasters(versusDuel.player, now);
  drawAlienWarlord(versusDuel.enemy, now);

  // 6. TIRS ET PROJECTILES 4K (HADOUKEN 4K & BLASTER LASER ALIEN 4K)
  versusDuel.projectiles.forEach((proj) => {
    ctx.save();
    if (proj.type === "hadouken") {
      // HADOUKEN 4K : Orbe d'énergie Ki multi-couches avec cœur blanc, plasma cyan, arcs électriques et traînée cométaire
      const r = proj.radius;
      const px = proj.x;
      const py = proj.y;

      // Projection lumineuse bleue au sol sous le Hadouken
      ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
      ctx.beginPath();
      ctx.ellipse(px, gy + 4, r * 1.8, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Traînée cométaire Ki (Comet Tail)
      const tailLen = 65;
      const tailGrad = ctx.createLinearGradient(px - proj.vx * 0.12, py, px, py);
      tailGrad.addColorStop(0, "rgba(2, 132, 199, 0)");
      tailGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.35)");
      tailGrad.addColorStop(1, "rgba(56, 189, 248, 0.95)");
      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.moveTo(px, py - r * 0.85);
      ctx.lineTo(px - Math.sign(proj.vx) * tailLen, py);
      ctx.lineTo(px, py + r * 0.85);
      ctx.closePath();
      ctx.fill();

      // Boule de plasma concentrique 4K
      const hGrad = ctx.createRadialGradient(px, py, r * 0.15, px, py, r * 1.25);
      hGrad.addColorStop(0, "#ffffff");
      hGrad.addColorStop(0.25, "#bae6fd");
      hGrad.addColorStop(0.55, "#38bdf8");
      hGrad.addColorStop(0.85, "#0284c7");
      hGrad.addColorStop(1, "rgba(2, 132, 199, 0)");

      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 32;
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(px, py, r * 1.2 + Math.sin(now * 0.035) * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Arcs électriques rotatifs dans l'orbe
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 2;
      for (let a = 0; a < 3; a++) {
        const rot = (now * 0.015) + (a * Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(px, py, r * 0.75, rot, rot + 0.85);
        ctx.stroke();
      }
    } else {
      // TIR BLASTER PLASMA ALIEN 4K : Faisceau d'énergie émeraude fuselé avec halo thermique
      const r = proj.radius;
      const px = proj.x;
      const py = proj.y;

      // Traînée laser vert
      ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
      ctx.lineWidth = r * 1.2;
      ctx.beginPath();
      ctx.moveTo(px - proj.vx * 0.06, py);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Ovale de plasma émeraude incandescent
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#86efac";
      ctx.beginPath();
      ctx.ellipse(px, py, r * 2.2, r * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cœur blanc pur à ultra-haute température
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(px, py, r * 1.2, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // Particules d'impacts cinématiques & étincelles
  versusDuel.particles.forEach((pt) => {
    ctx.save();
    ctx.fillStyle = pt.color;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Confettis de Victoire 4K
  versusDuel.confetti.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.shadowColor = c.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  });

  // Flash d'impact blanc cinématique
  if (versusDuel.flashTimer > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, versusDuel.flashTimer * 2.5)})`;
    ctx.fillRect(0, 0, w, h);
  }

  // HUD Street Fighter
  drawStreetFighterHUD(now);
  ctx.restore();
}

function drawKenMasters(p, now) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.facing, 1);

  // 1. Ombre portée 4K avec estompage progressif
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const isPunch = p.state === "punch";
  const isKick = p.state === "kick";
  const isHadouken = p.state === "hadouken";
  const isWin = p.state === "win";

  // 2. JAMBES & PANTALON DU GI ROUGE (PLIS & TEXTURE 4K)
  const redGiBase = "#dc2626";
  const redGiShadow = "#991b1b";
  const redGiLight = "#ef4444";

  if (isKick) {
    // Jambe d'appui fléchie au sol
    ctx.fillStyle = redGiShadow;
    ctx.beginPath();
    ctx.roundRect(-12, -34, 14, 34, [4, 4, 2, 2]);
    ctx.fill();
    // Pied d'appui
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(-14, -4, 16, 6);

    // Jambe de frappe détendue à l'horizontale (Coup de pied fouetté 4K)
    ctx.save();
    ctx.translate(2, -36);
    ctx.rotate(-0.85);

    // Sillage d'air tranchant supersonique
    ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(20, -10, 45, -0.6, 0.6);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pantalon jambe tendue
    ctx.fillStyle = redGiBase;
    ctx.beginPath();
    ctx.roundRect(0, -8, 48, 15, 4);
    ctx.fill();

    // Pied nu en extension complète
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.roundRect(46, -10, 14, 18, 4);
    ctx.fill();
    ctx.restore();
  } else {
    // Posture de combat normale / saut
    // Jambe arrière
    ctx.fillStyle = redGiShadow;
    ctx.beginPath();
    ctx.roundRect(-16, -34, 13, 34, [4, 4, 2, 2]);
    ctx.fill();
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(-17, -4, 14, 6);

    // Jambe avant
    ctx.fillStyle = redGiBase;
    ctx.beginPath();
    ctx.roundRect(2, -34, 13, 34, [4, 4, 2, 2]);
    ctx.fill();
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(1, -4, 14, 6);
  }

  // Bandages blancs aux chevilles
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(-15, -9, 12, 3);
  if (!isKick) ctx.fillRect(3, -9, 12, 3);

  // 3. TORSE & HAUT DU GI ROUGE (ANATOMIE MUSCULAIRE 4K)
  // Veste de Gi rouge écarlate
  ctx.fillStyle = redGiBase;
  ctx.beginPath();
  ctx.roundRect(-16, -64, 32, 32, 5);
  ctx.fill();

  // Épaulières du Gi
  ctx.fillStyle = redGiLight;
  ctx.fillRect(-17, -64, 6, 14);
  ctx.fillRect(11, -64, 6, 14);

  // Décolleté en V : Torse athlétique musclé de Ken (Pectoraux sculptés)
  const chestGrad = ctx.createLinearGradient(0, -64, 0, -42);
  chestGrad.addColorStop(0, "#fed7aa");
  chestGrad.addColorStop(0.7, "#f59e0b");
  chestGrad.addColorStop(1, "#b45309");
  ctx.fillStyle = chestGrad;
  ctx.beginPath();
  ctx.moveTo(-8, -64);
  ctx.lineTo(8, -64);
  ctx.lineTo(0, -44);
  ctx.closePath();
  ctx.fill();

  // Ligne de séparation des pectoraux
  ctx.strokeStyle = "#9a3412";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -62);
  ctx.lineTo(0, -48);
  ctx.stroke();

  // 4. CEINTURE NOIRE 4K (BLACK BELT) & PANS FLOTTANTS
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(-17, -36, 34, 8);
  // Nœud central de ceinture
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-4, -36, 8, 8);
  // Broderie dorée kanji sur la ceinture
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(-12, -34, 5, 4);

  // Pans de ceinture noirs avec physique de flottement
  const beltSway = Math.sin(now * 0.008) * 4;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(-4, -30);
  ctx.lineTo(-4 + beltSway, -12);
  ctx.lineTo(0 + beltSway, -12);
  ctx.lineTo(0, -30);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(1, -30);
  ctx.lineTo(1 - beltSway * 0.8, -16);
  ctx.lineTo(5 - beltSway * 0.8, -16);
  ctx.lineTo(5, -30);
  ctx.closePath();
  ctx.fill();

  // 5. TÊTE & CHEVELURE BLONDE ICONIQUE DE KEN 4K
  // Visage
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(0, -72, 10, 0, Math.PI * 2);
  ctx.fill();

  // Sourcils et regard déterminé
  ctx.fillStyle = "#b45309";
  ctx.fillRect(2, -74, 5, 2);
  ctx.fillStyle = "#0284c7"; // Yeux bleus de Ken
  ctx.fillRect(4, -72, 2.5, 2.5);

  // Chevelure blonde volumineuse 4K (mèches superposées)
  ctx.fillStyle = "#facc15";
  ctx.shadowColor = "#eab308";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(-12, -74);
  ctx.lineTo(-17, -86);
  ctx.lineTo(-9, -82);
  ctx.lineTo(0, -92);
  ctx.lineTo(9, -83);
  ctx.lineTo(16, -88);
  ctx.lineTo(13, -73);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Reflets blonds clairs sur le dessus
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.moveTo(-7, -80);
  ctx.lineTo(0, -89);
  ctx.lineTo(7, -81);
  ctx.closePath();
  ctx.fill();

  // Lanières du bandeau rouge flottant à l'arrière
  const bandSway = Math.sin(now * 0.009) * 5;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-8, -72);
  ctx.lineTo(-18 + bandSway, -74);
  ctx.lineTo(-24 + bandSway * 1.2, -68);
  ctx.stroke();

  // 6. BRAS, GANTS DE COMBAT & ACTIONS (PUNCH / HADOUKEN / WIN)
  const skinTone = "#fed7aa";
  const gloveLeather = "#78350f";
  const gloveMetal = "#f59e0b";

  if (isPunch) {
    // Coup de poing direct fulgurant (Dragon Fist)
    // Bras tendu
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(4, -62, 42, 12, 4);
    ctx.fill();

    // Gant de combat cuir & renfort métal doré
    ctx.fillStyle = gloveLeather;
    ctx.beginPath();
    ctx.roundRect(42, -65, 16, 16, 4);
    ctx.fill();
    ctx.fillStyle = gloveMetal;
    ctx.fillRect(52, -64, 4, 14);

    // Onde de choc d'énergie dorée de la frappe
    ctx.fillStyle = "rgba(251, 191, 36, 0.45)";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(32, -56, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (isHadouken) {
    // Pose Hadouken : deux mains projetées vers l'avant avec orbe d'énergie
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(4, -58, 34, 12, 4);
    ctx.fill();

    ctx.fillStyle = gloveLeather;
    ctx.beginPath();
    ctx.roundRect(34, -61, 15, 17, 4);
    ctx.fill();
    ctx.fillStyle = gloveMetal;
    ctx.fillRect(44, -59, 4, 13);

    // Halo de concentration d'énergie Ki entre les paumes
    ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(46, -53, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (isWin) {
    // Pose de Victoire : poing levé vers le ciel avec halo solaire triomphant
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(4, -94, 12, 34, 4);
    ctx.fill();

    ctx.fillStyle = gloveLeather;
    ctx.beginPath();
    ctx.roundRect(2, -104, 15, 15, 4);
    ctx.fill();
    ctx.fillStyle = gloveMetal;
    ctx.fillRect(3, -103, 13, 4);

    // Rayons dorés de la gloire
    ctx.strokeStyle = "rgba(251, 191, 36, 0.75)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 16;
    for (let r = 0; r < 6; r++) {
      const rayAngle = (now * 0.003) + (r * Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(9, -96);
      ctx.lineTo(9 + Math.cos(rayAngle) * 26, -96 + Math.sin(rayAngle) * 26);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  } else {
    // Garde de combat standard (Ken Fighting Stance)
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(6, -60, 18, 11, 4);
    ctx.roundRect(16, -68, 11, 16, 4);
    ctx.fill();

    ctx.fillStyle = gloveLeather;
    ctx.beginPath();
    ctx.roundRect(14, -73, 14, 14, 4);
    ctx.fill();
    ctx.fillStyle = gloveMetal;
    ctx.fillRect(22, -72, 4, 12);
  }

  ctx.restore();
}

function drawAlienWarlord(e, now) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.scale(e.facing, 1);

  // 1. Ombre portée 4K au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 28, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  const isSlash = e.state === "slash";
  const isShoot = e.state === "shoot";
  const isKo = e.state === "ko";

  if (isKo) {
    // Commandant Xéno vaincu à terre avec fumée et étincelles
    ctx.rotate(Math.PI / 2);
    ctx.translate(22, -12);

    // Fumée d'armure endommagée
    ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
    ctx.beginPath();
    ctx.arc(-10, -50, 12 + Math.sin(now * 0.01) * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. JAMBES & BOTTES D'ARMURE EXOSQUELETTE 4K
  ctx.fillStyle = "#1e1b4b"; // Indigo très sombre
  ctx.beginPath();
  ctx.roundRect(-16, -36, 13, 36, [4, 4, 2, 2]);
  ctx.roundRect(3, -36, 13, 36, [4, 4, 2, 2]);
  ctx.fill();

  // Genouillères et plaques d'armure violettes
  ctx.fillStyle = "#7e22ce";
  ctx.fillRect(-15, -20, 11, 4);
  ctx.fillRect(4, -20, 11, 4);

  // Griffes mécaniques aux pieds
  ctx.fillStyle = "#334155";
  ctx.fillRect(-18, -4, 16, 6);
  ctx.fillRect(2, -4, 16, 6);

  // 3. CUIRASSE BIOMÉCANIQUE & RÉACTEUR DORSAL
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(-20, -68, 40, 36, 6);
  ctx.fill();

  // Plaques pectorales en titane sombre
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-16, -64, 14, 18);
  ctx.fillRect(2, -64, 14, 18);

  // Réacteur de puissance dorsal / Coeur Plasma Vert Émeraude 4K
  ctx.fillStyle = "#22c55e";
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, -52, 6, 0, Math.PI * 2);
  ctx.fill();
  // Cœur blanc réacteur
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, -52, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Conduits d'énergie pulsants le long du thorax
  ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-12, -46);
  ctx.lineTo(-4, -50);
  ctx.moveTo(12, -46);
  ctx.lineTo(4, -50);
  ctx.stroke();

  // 4. CASQUE XÉNOMORPHE & CRÊTE CYBERNÉTIQUE 4K
  // Tête reptilienne blindée
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.ellipse(0, -78, 12, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crête xéno allongée en arrière
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(-8, -82);
  ctx.lineTo(-24, -92);
  ctx.lineTo(-6, -72);
  ctx.closePath();
  ctx.fill();

  // Visière Tri-Laser Rouge Écarlate de Visée 4K
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(3, -80, 2.2, 0, Math.PI * 2);
  ctx.arc(7, -83, 2, 0, Math.PI * 2);
  ctx.arc(8, -77, 2, 0, Math.PI * 2);
  ctx.fill();

  // Faisceaux laser de visée projetés vers l'avant
  if (!isKo) {
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(8, -79);
    ctx.lineTo(120, -79);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // 5. ARMES 4K : SABRE LASER PLASMA ET FUSIL BLASTER LOURD
  if (isSlash) {
    // ATTAQUE AU SABRE LASER (CRIMSON PLASMA SABER 4K)
    ctx.save();
    ctx.translate(14, -54);
    ctx.rotate(-0.35);

    // Garde et poignée du sabre laser en titane
    ctx.fillStyle = "#475569";
    ctx.fillRect(-4, -5, 10, 10);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(4, -3, 8, 6);

    // LAME PLASMA 4K : Cœur blanc incandescent, manteau rouge carmin et halo thermique
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 28;

    // Halo extérieur rouge rubis
    ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
    ctx.beginPath();
    ctx.roundRect(10, -7, 62, 14, 5);
    ctx.fill();

    // Lame laser centrale
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(12, -4, 58, 8, 3);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Arc d'énergie tranchante dans l'air
    ctx.strokeStyle = "rgba(244, 63, 94, 0.65)";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(10, 0, 68, -0.7, 0.5);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  } else {
    // Sabre laser rengainé à la hanche (fourreau cybernétique avec émetteur lumineux)
    ctx.fillStyle = "#334155";
    ctx.fillRect(-22, -42, 6, 20);
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.fillRect(-22, -44, 6, 3);
    ctx.shadowBlur = 0;
  }

  if (isShoot) {
    // TIR AU FUSIL BLASTER LOURD (HEAVY PLASMA CARBINE 4K)
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(4, -60, 42, 11, 3);
    ctx.fill();

    // Chambre à plasma vert luminescente
    ctx.fillStyle = "#22c55e";
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 10;
    ctx.fillRect(16, -58, 12, 7);

    // Bouche du canon & Éclair de tir
    ctx.fillStyle = "#475569";
    ctx.fillRect(44, -62, 8, 15);
    ctx.fillStyle = "#86efac";
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(52, -55, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    // Fusil blaster tenu en position d'attente
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.roundRect(4, -52, 22, 9, 3);
    ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(10, -50, 6, 5);
  }

  ctx.restore();
}

function drawStreetFighterHUD(now) {
  const w = canvas.width;
  const h = canvas.height;
  const p = versusDuel.player;
  const e = versusDuel.enemy;

  ctx.save();
  const barW = Math.min(340, w * 0.38);
  const barH = 18;
  const barY = 22;

  const pRatio = Math.max(0, p.hp / p.maxHp);
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(24, barY, barW, barH);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, barY, barW, barH);

  const pGrad = ctx.createLinearGradient(24, barY, 24 + barW, barY);
  pGrad.addColorStop(0, "#ef4444");
  pGrad.addColorStop(0.3, "#f59e0b");
  pGrad.addColorStop(1, "#22c55e");
  ctx.fillStyle = pGrad;
  ctx.fillRect(24 + (barW * (1 - pRatio)), barY, barW * pRatio, barH);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KEN MASTERS (NOVA)", 26, barY - 6);

  const timerX = w / 2;
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.beginPath();
  ctx.arc(timerX, barY + 9, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = versusDuel.timer <= 10 ? "#ef4444" : "#fbbf24";
  ctx.font = "900 18px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(String(Math.ceil(versusDuel.timer)), timerX, barY + 16);

  const eRatio = Math.max(0, e.hp / e.maxHp);
  const eBarX = w - 24 - barW;
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(eBarX, barY, barW, barH);
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.strokeRect(eBarX, barY, barW, barH);

  const eGrad = ctx.createLinearGradient(eBarX, barY, eBarX + barW, barY);
  eGrad.addColorStop(0, "#22c55e");
  eGrad.addColorStop(0.7, "#f59e0b");
  eGrad.addColorStop(1, "#ef4444");
  ctx.fillStyle = eGrad;
  ctx.fillRect(eBarX, barY, barW * eRatio, barH);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("COMMANDANT XÉNO", w - 26, barY - 6);

  if (versusDuel.phase === "intro") {
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 28;
    ctx.font = "900 36px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ROUND 1", w / 2, h * 0.38);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("READY...", w / 2, h * 0.46);
  } else if (versusDuel.phase === "fight" && versusDuel.phaseTimer < 1.2) {
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 32;
    ctx.font = "900 52px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FIGHT !", w / 2, h * 0.42);
  } else if (versusDuel.phase === "ko") {
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 40;
    ctx.font = "900 78px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("K. O. !", w / 2, h * 0.42);
  } else if (versusDuel.phase === "victory") {
    ctx.fillStyle = "#22c55e";
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 30;
    ctx.font = "900 38px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VICTOIRE PAR K.O. !", w / 2, h * 0.34);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "900 28px system-ui, sans-serif";
    ctx.fillText("+50 000 PTS BONUS !", w / 2, h * 0.43);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillText("LA FOULE ACCLAME LE CHAMPION NOVA !", w / 2, h * 0.51);
  }

  if (p.combo > 1 && versusDuel.phase === "fight") {
    ctx.fillStyle = "#38bdf8";
    ctx.font = "900 20px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${p.combo} HITS COMBO !`, 28, barY + 48);
  }

  ctx.restore();
}

// ============================================================================
// JEU #3 : NOVA IRON COMMANDO // METAL SLUG 1 REMAKE (Moteur 2D Natif 60 FPS)
// ============================================================================

function playSlugAnnouncer(text) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.15;
      utter.pitch = 0.82;
      utter.volume = 1.0;
      utter.lang = 'en-US';
      window.speechSynthesis.speak(utter);
    }
  } catch (e) {}
  playSound("powerup");
}

const slugGame = {
  active: false,
  mission: 1,
  scrollX: 0,
  maxScrollX: 2800,
  groundY: 0,
  player: {
    x: 60,
    y: 0,
    groundY: 0,
    vx: 0,
    vy: 0,
    speed: 210,
    facing: 1, // 1: droite, -1: gauche
    aimY: 0, // -1: haut, 0: face, 1: bas (en saut)
    state: "idle", // "idle", "run", "crouch", "jump", "shoot", "knife", "in_tank", "die"
    stateTime: 0,
    isGrounded: true,
    weapon: "pistol", // "pistol", "hmg", "shotgun", "rocket", "flame"
    ammo: 999,
    grenades: 10,
    lives: 3,
    score: 0,
    powRescued: 0,
    shootCooldown: 0,
    knifeCooldown: 0,
    invulTimer: 0,
    inTank: false,
    tankHp: 3,
    maxTankHp: 3,
    tankBounce: 0
  },
  tank: {
    x: 920,
    y: 0,
    width: 68,
    height: 48,
    occupied: false,
    active: true
  },
  enemies: [],
  pows: [],
  pickups: [],
  projectiles: [],
  grenades: [],
  particles: [],
  boss: null,
  introBannerTimer: 3.2,
  missionComplete: false,
  victoryTimer: 0
};

function initSlugMission(missionNum) {
  state.paused = false;
  state.running = true;
  state.shots = [];
  state.enemyShots = [];
  state.powerups = [];

  const gy = canvas.height - 85;
  slugGame.active = true;

  // Préchargement garanti des planches 64-bit Neo-Geo
  if (!state.images.slug_bg) {
    state.images.slug_bg = new Image();
    state.images.slug_bg.src = "slug_bg_mission1_64bit.jpg?v=54";
  }
  if (!state.images.slug_vehicles) {
    state.images.slug_vehicles = new Image();
    state.images.slug_vehicles.src = "slug_vehicules_64bit.jpg?v=54";
  }
  if (!state.images.slug_characters) {
    state.images.slug_characters = new Image();
    state.images.slug_characters.src = "slug_personnages_64bit.jpg?v=54";
  }
  if (!state.images.slug_weapons) {
    state.images.slug_weapons = new Image();
    state.images.slug_weapons.src = "slug_armes_64bit.jpg?v=54";
  }

  slugGame.mission = missionNum || 1;
  slugGame.scrollX = 0;
  slugGame.groundY = gy;
  slugGame.maxScrollX = 2800;
  slugGame.introBannerTimer = 3.2;
  slugGame.missionComplete = false;
  slugGame.victoryTimer = 0;
  slugGame.projectiles = [];
  slugGame.grenades = [];
  slugGame.particles = [];
  slugGame.pickups = [];

  // Joueur
  const p = slugGame.player;
  p.x = 60;
  p.y = gy;
  p.groundY = gy;
  p.vx = 0;
  p.vy = 0;
  p.facing = 1;
  p.aimY = 0;
  p.state = "idle";
  p.stateTime = 0;
  p.isGrounded = true;
  p.weapon = "pistol";
  p.ammo = 999;
  p.grenades = 10;
  p.lives = 3;
  p.score = 0;
  p.powRescued = 0;
  p.shootCooldown = 0;
  p.knifeCooldown = 0;
  p.invulTimer = 1.5;
  p.inTank = false;
  p.tankHp = 3;
  p.tankBounce = 0;

  // Véhicule mythique SV-001 "Metal Slug" parachuté
  slugGame.tank = {
    x: 920,
    y: gy,
    groundY: gy,
    width: 68,
    height: 48,
    occupied: false,
    active: true
  };

  // 14 Soldats de l'Armée Rebelle répartis sur le niveau
  slugGame.enemies = [];
  const enemyXCoords = [240, 380, 530, 690, 840, 1080, 1220, 1420, 1580, 1750, 1920, 2080, 2240, 2390];
  enemyXCoords.forEach((ex, idx) => {
    slugGame.enemies.push({
      id: "soldier_" + idx,
      type: idx % 3 === 0 ? "grenadier" : (idx % 4 === 0 ? "shield" : "rifle"),
      x: ex,
      y: gy,
      groundY: gy,
      vx: 0,
      facing: -1,
      hp: idx % 4 === 0 ? 3 : 1,
      state: "patrol", // "patrol", "aim", "shoot", "panic", "die"
      stateTimer: Math.random() * 2,
      shootTimer: 1.0 + Math.random() * 2.5,
      dead: false
    });
  });

  // 1 Blindé léger Rebelle "Girida-O"
  slugGame.enemies.push({
    id: "tank_girida",
    type: "girida",
    x: 1460,
    y: gy - 8,
    groundY: gy - 8,
    vx: 0,
    facing: -1,
    hp: 12,
    state: "patrol",
    shootTimer: 2.2,
    dead: false
  });

  // 1 Avion éclaireur "Flying Tara"
  slugGame.enemies.push({
    id: "flying_tara",
    type: "plane",
    x: 1950,
    y: gy - 165,
    groundY: gy - 165,
    vx: -140,
    facing: -1,
    hp: 5,
    state: "fly",
    shootTimer: 1.8,
    dead: false
  });

  // 4 Otages de Guerre (P.O.W. - Prisoners of War)
  slugGame.pows = [
    { id: "pow_1", x: 420, y: gy, drop: "hmg", rescued: false, saluting: false, stateTimer: 0 },
    { id: "pow_2", x: 810, y: gy, drop: "bomb", rescued: false, saluting: false, stateTimer: 0 },
    { id: "pow_3", x: 1340, y: gy, drop: "shotgun", rescued: false, saluting: false, stateTimer: 0 },
    { id: "pow_4", x: 2120, y: gy, drop: "chicken", rescued: false, saluting: false, stateTimer: 0 }
  ];

  // Boss de Fin de Mission 1 : TETSUYUKI (Épave Forteresse Fluviale)
  slugGame.boss = {
    name: "TETSUYUKI",
    x: 2520,
    y: gy - 95,
    width: 210,
    height: 140,
    hp: 75,
    maxHp: 75,
    turretAngle: -Math.PI * 0.75,
    attackTimer: 2.5,
    attackPattern: 0,
    hitFlash: 0,
    dead: false
  };

  playSlugAnnouncer("MISSION 1 START !");

  // Liaison contrôles tactiles dédiés
  const btnKnife = document.getElementById("btnSlugKnife");
  const btnJump = document.getElementById("btnSlugJump");
  const btnBomb = document.getElementById("btnSlugBomb");
  if (btnKnife) {
    btnKnife.onclick = (e) => { e.preventDefault(); triggerSlugAction("knife"); };
    btnKnife.ontouchstart = (e) => { e.preventDefault(); triggerSlugAction("knife"); };
  }
  if (btnJump) {
    btnJump.onclick = (e) => { e.preventDefault(); triggerSlugAction("jump"); };
    btnJump.ontouchstart = (e) => { e.preventDefault(); triggerSlugAction("jump"); };
  }
  if (btnBomb) {
    btnBomb.onclick = (e) => { e.preventDefault(); triggerSlugAction("bomb"); };
    btnBomb.ontouchstart = (e) => { e.preventDefault(); triggerSlugAction("bomb"); };
  }

  syncUi();
}

function triggerSlugAction(action) {
  if (!slugGame.active || !state.running || state.paused) return;
  const p = slugGame.player;

  if (action === "jump") {
    // Si à proximité du char Metal Slug SV-001 (et pas encore dedans)
    if (!p.inTank && slugGame.tank && slugGame.tank.active && !slugGame.tank.occupied) {
      const distToTank = Math.abs(p.x - slugGame.tank.x);
      if (distToTank < 55) {
        p.inTank = true;
        slugGame.tank.occupied = true;
        p.tankHp = 3;
        p.tankBounce = 16;
        p.state = "in_tank";
        playSound("powerup");
        createFloatingText("★ METAL SLUG MOUNTED ! ★", p.x, p.y - 45, "#fbbf24");
        return;
      }
    }

    if (p.isGrounded) {
      p.vy = p.inTank ? -380 : -420;
      p.isGrounded = false;
      p.state = "jump";
      playSound("shoot");
    }
  } else if (action === "fire") {
    if (p.inTank) {
      // Tir double Gatling rotatif du Metal Slug
      fireSlugTankGatling();
      return;
    }

    // Si ennemi à moins de 32px à bout portant -> Attaque automatique au COUTEAU
    const closeEnemy = slugGame.enemies.find(en => !en.dead && Math.abs(en.x - p.x) < 34 && Math.abs(en.y - p.y) < 26);
    if (closeEnemy) {
      triggerSlugAction("knife");
      return;
    }

    // Tir d'arme à feu
    fireSlugPlayerWeapon();
  } else if (action === "knife") {
    if (p.inTank) return;
    p.state = "knife";
    p.stateTime = 0.25;
    playSound("hit");

    // Détection d'impact de lame sur ennemi ou otage
    slugGame.enemies.forEach(en => {
      if (!en.dead && Math.abs(en.x - p.x) < 42 && Math.abs(en.y - p.y) < 30) {
        en.hp = 0;
        en.dead = true;
        en.state = "die";
        p.score += 200;
        state.score += 200;
        createFloatingText("SLASH! +200", en.x, en.y - 20, "#ef4444");
        // Étincelles de couteau
        for (let sp = 0; sp < 8; sp++) {
          slugGame.particles.push({
            x: en.x, y: en.y - 15,
            vx: (Math.random() - 0.5) * 160,
            vy: (Math.random() - 0.5) * 160,
            size: 2.5, color: "#fef08a", life: 0.3
          });
        }
      }
    });

    // Possibilité de libérer un otage au couteau
    slugGame.pows.forEach(pow => {
      if (!pow.rescued && Math.abs(pow.x - p.x) < 45) {
        rescueSlugPOW(pow);
      }
    });
  } else if (action === "bomb") {
    if (p.inTank) {
      // Obus de char 127mm
      fireSlugTankCannon();
      return;
    }

    if (p.grenades > 0) {
      p.grenades--;
      playSound("deflect");
      slugGame.grenades.push({
        x: p.x + p.facing * 12,
        y: p.y - 22,
        vx: p.facing * 280,
        vy: -260,
        radius: 7,
        timer: 1.1,
        bounces: 0
      });
      createFloatingText("BOMB!", p.x, p.y - 30, "#f59e0b");
    }
  }
}

function rescueSlugPOW(pow) {
  pow.rescued = true;
  pow.saluting = true;
  pow.stateTimer = 1.2;
  slugGame.player.powRescued++;
  slugGame.player.score += 1000;
  state.score += 1000;
  playSound("powerup");
  createFloatingText("THANK YOU! +1000", pow.x, pow.y - 30, "#22c55e");

  // L'otage sort une caisse d'armement de son caleçon !
  slugGame.pickups.push({
    x: pow.x + 18,
    y: slugGame.groundY - 8,
    type: pow.drop,
    active: true
  });
}

function fireSlugPlayerWeapon() {
  const p = slugGame.player;
  if (p.shootCooldown > 0) return;

  const facing = p.facing;
  const aimY = p.aimY;
  const startX = p.x + (aimY !== 0 ? 0 : facing * 18);
  const startY = p.y - (aimY === -1 ? 38 : (aimY === 1 ? 8 : (p.state === "crouch" ? 14 : 24)));

  if (p.weapon === "pistol") {
    p.shootCooldown = 0.16;
    playSound("shoot");
    slugGame.projectiles.push({
      x: startX, y: startY,
      vx: aimY !== 0 ? 0 : facing * 540,
      vy: aimY * 540,
      radius: 3.5, damage: 1, type: "bullet", color: "#fef08a"
    });
  } else if (p.weapon === "hmg") {
    p.shootCooldown = 0.08;
    p.ammo--;
    playSound("shoot");
    // Dispersion en éventail
    const spreadAngle = (Math.random() - 0.5) * 0.15;
    slugGame.projectiles.push({
      x: startX, y: startY,
      vx: (aimY !== 0 ? 0 : facing * 600) + Math.sin(spreadAngle) * 60,
      vy: (aimY * 600) + Math.cos(spreadAngle) * 30,
      radius: 4, damage: 1.5, type: "hmg", color: "#f59e0b"
    });
    if (p.ammo <= 0) p.weapon = "pistol";
  } else if (p.weapon === "shotgun") {
    p.shootCooldown = 0.36;
    p.ammo--;
    playSound("explosion");
    // 6 balles coniques dévastatrices
    for (let s = -2; s <= 2; s++) {
      slugGame.projectiles.push({
        x: startX, y: startY,
        vx: (aimY !== 0 ? 0 : facing * 480),
        vy: (aimY * 480) + s * 45,
        radius: 6, damage: 4, type: "shotgun", color: "#ef4444"
      });
    }
    if (p.ammo <= 0) p.weapon = "pistol";
  } else if (p.weapon === "rocket") {
    p.shootCooldown = 0.28;
    p.ammo--;
    playSound("hadouken");
    slugGame.projectiles.push({
      x: startX, y: startY,
      vx: aimY !== 0 ? 0 : facing * 320,
      vy: aimY * 320,
      radius: 6, damage: 6, type: "rocket", color: "#38bdf8"
    });
    if (p.ammo <= 0) p.weapon = "pistol";
  } else if (p.weapon === "flame") {
    p.shootCooldown = 0.25;
    p.ammo--;
    playSound("saber");
    slugGame.projectiles.push({
      x: startX, y: startY,
      vx: aimY !== 0 ? 0 : facing * 280,
      vy: aimY * 280,
      radius: 14, damage: 5, type: "flame", color: "#ea580c"
    });
    if (p.ammo <= 0) p.weapon = "pistol";
  }

  // Éjection de douille en laiton
  slugGame.particles.push({
    x: p.x - facing * 8, y: p.y - 20,
    vx: -facing * (60 + Math.random() * 40),
    vy: -120 - Math.random() * 60,
    size: 2, color: "#facc15", life: 0.45
  });
}

function fireSlugTankGatling() {
  const p = slugGame.player;
  if (p.shootCooldown > 0) return;
  p.shootCooldown = 0.07;
  playSound("shoot");
  const facing = p.facing;
  const startX = p.x + facing * 34;
  const startY = p.y - 28;

  slugGame.projectiles.push({
    x: startX, y: startY,
    vx: facing * 620, vy: (Math.random() - 0.5) * 40,
    radius: 4.5, damage: 2, type: "hmg", color: "#fbbf24"
  });

  p.tankBounce = 6;
}

function fireSlugTankCannon() {
  const p = slugGame.player;
  if (p.grenades <= 0) return;
  p.grenades--;
  playSound("ko");
  const facing = p.facing;
  const startX = p.x + facing * 38;
  const startY = p.y - 26;

  slugGame.projectiles.push({
    x: startX, y: startY,
    vx: facing * 460, vy: -40,
    radius: 9, damage: 15, type: "cannon", color: "#ef4444"
  });
  p.tankBounce = 14;
  createFloatingText("CANNON SHELL !", p.x, p.y - 45, "#ef4444");
}

function updateSlugMission(dt, timestamp) {
  const p = slugGame.player;
  const w = canvas.width;
  const gy = slugGame.groundY;

  if (slugGame.introBannerTimer > 0) {
    slugGame.introBannerTimer -= dt;
  }

  // 1. Contrôles de déplacement Joueur (Clavier & Tactile)
  let moveX = 0;
  if (keys.has("ArrowLeft") || keys.has("q") || keys.has("Q") || keys.has("a") || keys.has("A")) moveX -= 1;
  if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) moveX += 1;

  // Visée verticale
  p.aimY = 0;
  if (keys.has("ArrowUp") || keys.has("z") || keys.has("Z") || keys.has("w") || keys.has("W")) p.aimY = -1;
  if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) {
    if (!p.isGrounded) p.aimY = 1; // Tir vers le bas en saut
    else p.state = "crouch";
  } else if (p.state === "crouch") {
    p.state = "idle";
  }

  if (moveX !== 0) {
    p.facing = moveX > 0 ? 1 : -1;
    const speed = p.state === "crouch" ? p.speed * 0.5 : p.speed;
    p.vx = moveX * speed;
    if (p.isGrounded && p.state !== "crouch" && p.state !== "knife") p.state = "run";
  } else {
    p.vx = 0;
    if (p.isGrounded && p.state !== "crouch" && p.state !== "knife") p.state = "idle";
  }

  // Physique de gravité
  p.vy += 980 * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;

  if (p.y >= gy) {
    p.y = gy;
    p.vy = 0;
    p.isGrounded = true;
    if (p.state === "jump") p.state = "idle";
  }

  // Caméra à défilement horizontal (auto-avance avec interdiction de retour arrière)
  slugGame.scrollX = Math.max(slugGame.scrollX, p.x - w * 0.32);
  slugGame.scrollX = Math.min(slugGame.maxScrollX - w, slugGame.scrollX);
  // Empêche le joueur de sortir à gauche de l'écran visible
  p.x = Math.max(slugGame.scrollX + 16, Math.min(slugGame.maxScrollX, p.x));

  // Cooldowns
  if (p.shootCooldown > 0) p.shootCooldown -= dt;
  if (p.knifeCooldown > 0) p.knifeCooldown -= dt;
  if (p.invulTimer > 0) p.invulTimer -= dt;
  if (p.tankBounce > 0) p.tankBounce = Math.max(0, p.tankBounce - dt * 30);

  // Position du tank quand le joueur est dedans
  if (p.inTank && slugGame.tank) {
    slugGame.tank.x = p.x;
    slugGame.tank.y = p.y;
  }

  // 2. Mise à jour des Projectiles
  slugGame.projectiles.forEach(proj => {
    proj.x += proj.vx * dt;
    proj.y += proj.vy * dt;

    // Collision projectile joueur -> Ennemis
    slugGame.enemies.forEach(en => {
      if (!en.dead && Math.abs(en.x - proj.x) < 24 && Math.abs((en.y - 18) - proj.y) < 22) {
        en.hp -= proj.damage;
        proj.dead = true;
        p.score += 50;
        state.score += 50;
        playSound("hit");
        if (en.hp <= 0) {
          en.dead = true;
          en.state = "die";
          p.score += 150;
          state.score += 150;
          createFloatingText("+150", en.x, en.y - 25, "#fbbf24");
        }
      }
    });

    // Collision projectile -> Otages P.O.W. (libère au tir)
    slugGame.pows.forEach(pow => {
      if (!pow.rescued && Math.abs(pow.x - proj.x) < 20 && Math.abs((pow.y - 16) - proj.y) < 18) {
        proj.dead = true;
        rescueSlugPOW(pow);
      }
    });

    // Collision projectile -> Boss TETSUYUKI
    if (slugGame.boss && !slugGame.boss.dead) {
      const b = slugGame.boss;
      if (proj.x > b.x - 30 && proj.x < b.x + b.width && proj.y > b.y - 60 && proj.y < b.y + b.height) {
        b.hp -= proj.damage;
        b.hitFlash = 0.12;
        proj.dead = true;
        p.score += 80;
        state.score += 80;
        playSound("hit");
        if (b.hp <= 0) {
          b.dead = true;
          slugGame.missionComplete = true;
          slugGame.victoryTimer = 5.0;
          p.score += 50000;
          state.score += 50000;
          playSlugAnnouncer("MISSION COMPLETE !");
          createFloatingText("★ TETSUYUKI DESTROYED ! +50 000 PTS ★", b.x + 40, b.y - 30, "#22c55e");
        }
      }
    }
  });
  slugGame.projectiles = slugGame.projectiles.filter(pr => !pr.dead && pr.x > slugGame.scrollX - 50 && pr.x < slugGame.scrollX + w + 50);

  // 3. Mise à jour des Grenades paraboliques
  slugGame.grenades.forEach(gr => {
    gr.vy += 650 * dt;
    gr.x += gr.vx * dt;
    gr.y += gr.vy * dt;
    gr.timer -= dt;

    if (gr.y >= gy - 6) {
      gr.y = gy - 6;
      gr.vy = -gr.vy * 0.45;
      gr.vx *= 0.75;
      gr.bounces++;
    }

    if (gr.timer <= 0) {
      gr.dead = true;
      playSound("explosion");
      // Dégâts de zone de déflagration
      slugGame.enemies.forEach(en => {
        if (!en.dead && Math.abs(en.x - gr.x) < 55) {
          en.hp -= 10;
          if (en.hp <= 0) {
            en.dead = true;
            en.state = "die";
            p.score += 200;
            state.score += 200;
          }
        }
      });
      // Dégâts au Boss
      if (slugGame.boss && !slugGame.boss.dead && Math.abs((slugGame.boss.x + 50) - gr.x) < 90) {
        slugGame.boss.hp -= 12;
        slugGame.boss.hitFlash = 0.15;
      }
      // Particules d'explosion
      for (let pz = 0; pz < 18; pz++) {
        slugGame.particles.push({
          x: gr.x, y: gr.y - 10,
          vx: (Math.random() - 0.5) * 220,
          vy: -Math.random() * 200,
          size: 4 + Math.random() * 5,
          color: Math.random() > 0.5 ? "#f59e0b" : "#ef4444",
          life: 0.5
        });
      }
    }
  });
  slugGame.grenades = slugGame.grenades.filter(g => !g.dead);

  // 4. Mise à jour des Otages (P.O.W.)
  slugGame.pows.forEach(pow => {
    if (pow.saluting) {
      pow.stateTimer -= dt;
      if (pow.stateTimer <= 0) {
        pow.x -= 120 * dt; // Fuite vers la gauche
      }
    }
  });

  // 5. Ramassage des Caisses d'Armes & Bonus
  slugGame.pickups.forEach(pu => {
    if (pu.active && Math.abs(pu.x - p.x) < 32 && Math.abs(pu.y - p.y) < 35) {
      pu.active = false;
      if (pu.type === "hmg") {
        p.weapon = "hmg";
        p.ammo = 200;
        playSlugAnnouncer("HEAVY MACHINE GUN !");
        createFloatingText("HEAVY MACHINE GUN ! +200", p.x, p.y - 35, "#f59e0b");
      } else if (pu.type === "shotgun") {
        p.weapon = "shotgun";
        p.ammo = 30;
        playSlugAnnouncer("SHOTGUN !");
        createFloatingText("SHOTGUN ! +30", p.x, p.y - 35, "#ef4444");
      } else if (pu.type === "bomb") {
        p.grenades += 10;
        playSlugAnnouncer("OK !");
        createFloatingText("BOMBS +10", p.x, p.y - 35, "#fbbf24");
      } else if (pu.type === "chicken") {
        p.score += 1000;
        state.score += 1000;
        playSound("powerup");
        createFloatingText("ROAST CHICKEN ! +1000", p.x, p.y - 35, "#22c55e");
      }
    }
  });
  slugGame.pickups = slugGame.pickups.filter(pu => pu.active);

  // 6. IA des Ennemis Rebelles
  slugGame.enemies.forEach(en => {
    if (en.dead) return;
    const distToPlayer = p.x - en.x;

    // Panique si le joueur arrive dans le Metal Slug !
    if (p.inTank && Math.abs(distToPlayer) < 180) {
      en.state = "panic";
      en.facing = distToPlayer > 0 ? -1 : 1;
      en.x += en.facing * 85 * dt;
      return;
    }

    if (en.type === "plane") {
      en.x += en.vx * dt;
      en.shootTimer -= dt;
      if (en.shootTimer <= 0) {
        en.shootTimer = 2.2;
        // Largue une bombe vers le bas
        slugGame.projectiles.push({
          x: en.x, y: en.y + 12,
          vx: -40, vy: 180,
          radius: 5, damage: 1, type: "enemyBomb", color: "#f87171"
        });
      }
      return;
    }

    // Fusiliers & Grenadiers au sol
    en.shootTimer -= dt;
    if (en.shootTimer <= 0 && Math.abs(distToPlayer) < 380) {
      en.shootTimer = 2.0 + Math.random() * 2;
      en.facing = distToPlayer > 0 ? 1 : -1;
      playSound("enemyShoot");
      slugGame.projectiles.push({
        x: en.x + en.facing * 14, y: en.y - 20,
        vx: en.facing * 280, vy: 0,
        radius: 3.5, damage: 1, type: "enemyBullet", color: "#ef4444"
      });
    }
  });

  // 7. IA du Boss TETSUYUKI
  if (slugGame.boss && !slugGame.boss.dead) {
    const b = slugGame.boss;
    if (b.hitFlash > 0) b.hitFlash -= dt;
    b.attackTimer -= dt;
    if (b.attackTimer <= 0) {
      b.attackTimer = 2.4;
      b.attackPattern = (b.attackPattern + 1) % 2;
      playSound("explosion");
      if (b.attackPattern === 0) {
        // Tirs d'artillerie lourde
        for (let t = 0; t < 2; t++) {
          slugGame.projectiles.push({
            x: b.x - 10, y: b.y + 15 + t * 24,
            vx: -340 - t * 40, vy: (t - 0.5) * 50,
            radius: 8, damage: 1, type: "enemyShell", color: "#f97316"
          });
        }
      } else {
        // Salve de mortier parabolique
        slugGame.grenades.push({
          x: b.x - 20, y: b.y - 30,
          vx: -240, vy: -380,
          radius: 9, timer: 1.8, bounces: 0
        });
      }
    }
  }

  // 8. Particules
  slugGame.particles.forEach(pt => {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.life -= dt;
  });
  slugGame.particles = slugGame.particles.filter(pt => pt.life > 0);

  // Victoire : temporisation avant retour au hub
  if (slugGame.missionComplete) {
    slugGame.victoryTimer -= dt;
  }
}

function drawSlugMission(w, h, now) {
  const p = slugGame.player;
  const gy = slugGame.groundY;
  const sx = slugGame.scrollX;

  ctx.save();

  // 1. DÉCOR 64-BIT RETRO AUTHENTIQUE : Planche 4 (Ciel Crépusculaire, Cascades, Jungle tropicale & Huttes sur pilotis)
  const bgImg = state.images.slug_bg;
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    // Parallaxe 0.38x fluide sur le paysage peint 64-bit Neo-Geo
    const scale = Math.max(h / bgImg.height, w / bgImg.width);
    const renderW = bgImg.width * scale;
    const renderH = bgImg.height * scale;
    const offX = (sx * 0.38) % renderW;

    ctx.drawImage(bgImg, -offX, 0, renderW, renderH);
    if (-offX + renderW < w) {
      ctx.drawImage(bgImg, -offX + renderW, 0, renderW, renderH);
    }
  } else {
    // PARALLAX COUCHE 0 : Ciel Crépusculaire Tropical & Montagnes Lointaines (Fallback)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, gy);
    skyGrad.addColorStop(0, "#082f49");
    skyGrad.addColorStop(0.4, "#0c4a6e");
    skyGrad.addColorStop(0.75, "#14532d");
    skyGrad.addColorStop(1, "#1e3a5f");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Montagnes escarpées brumeuses (Parallaxe 0.12x)
    ctx.fillStyle = "rgba(12, 74, 110, 0.45)";
    ctx.beginPath();
    ctx.moveTo(0, gy - 120);
    for (let mx = 0; mx <= w; mx += 80) {
      const mHeight = 120 + Math.sin((mx + sx * 0.12) * 0.008) * 45;
      ctx.lineTo(mx, gy - mHeight);
    }
    ctx.lineTo(w, gy);
    ctx.lineTo(0, gy);
    ctx.closePath();
    ctx.fill();

    // PARALLAX COUCHE 1 : Jungle Tropicale & Cascades Fluviales (Parallaxe 0.35x)
    ctx.fillStyle = "#14532d";
    for (let jx = -60; jx < w + 80; jx += 95) {
      const worldJX = jx - (sx * 0.35) % 95;
      ctx.beginPath();
      ctx.arc(worldJX + 45, gy - 85, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#166534";
      ctx.fillRect(worldJX + 38, gy - 75, 14, 75);
      ctx.fillStyle = "#14532d";
    }
  }

  // 2. PARALLAX COUCHE 2 : Sol Fluvial, Pontons en Bois d'Appui & Clous d'Acier (1.0x)
  const riverGrad = ctx.createLinearGradient(0, gy, 0, h);
  riverGrad.addColorStop(0, "rgba(54, 83, 20, 0.88)");
  riverGrad.addColorStop(0.2, "rgba(28, 25, 23, 0.95)");
  riverGrad.addColorStop(0.6, "#0f172a");
  riverGrad.addColorStop(1, "#020617");
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, gy, w, h - gy);

  // Pontons en bois 64-bit avec rainures et têtes de clous
  ctx.fillStyle = "#78350f";
  ctx.fillRect(0, gy, w, 14);
  ctx.fillStyle = "#451a03";
  for (let bx = -40; bx < w + 40; bx += 32) {
    const plankX = bx - (sx % 32);
    ctx.fillRect(plankX, gy, 2.5, 14);
    ctx.fillStyle = "#94a3b8"; // Clous métalliques
    ctx.fillRect(plankX + 1, gy + 3, 1.2, 1.2);
    ctx.fillRect(plankX + 1, gy + 10, 1.2, 1.2);
    ctx.fillStyle = "#451a03";
  }

  // 4. ENTITÉS DU JEU (Rendu avec décalage de caméra -sx)
  ctx.save();
  ctx.translate(-sx, 0);

  // A. Véhicule Metal Slug SV-001 (s'il n'est pas conduit par le joueur)
  if (slugGame.tank && slugGame.tank.active && !p.inTank) {
    drawMetalSlugTank(slugGame.tank, false, now);
    // Flèche néon clignotante "IN" au-dessus du char
    if (Math.floor(now / 250) % 2 === 0) {
      ctx.fillStyle = "#22c55e";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("▼ ENTER SLUG ▼", slugGame.tank.x, slugGame.tank.y - 56);
    }
  }

  // B. Otages P.O.W.
  slugGame.pows.forEach(pow => drawSlugPOW(pow, now));

  // C. Caisses de Pickups
  slugGame.pickups.forEach(pu => drawSlugPickup(pu, now));

  // D. Ennemis
  slugGame.enemies.forEach(en => {
    if (!en.dead) {
      if (en.type === "girida") drawGiridaTank(en, now);
      else if (en.type === "plane") drawFlyingTara(en, now);
      else drawRebelInfantry(en, now);
    }
  });

  // E. Boss TETSUYUKI
  if (slugGame.boss) drawBossTetsuyuki(slugGame.boss, now);

  // F. Joueur (Marco Rossi ou dans le Tank Metal Slug)
  if (p.inTank) {
    drawMetalSlugTank(p, true, now);
  } else {
    drawMarcoRossi(p, now);
  }

  // G. Projectiles & Grenades
  slugGame.projectiles.forEach(proj => {
    ctx.fillStyle = proj.color || "#fbbf24";
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  slugGame.grenades.forEach(gr => {
    // Grenade Ananas
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.arc(gr.x, gr.y, gr.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ca8a04";
    ctx.fillRect(gr.x - 2, gr.y - gr.radius - 3, 4, 3);
  });

  // H. Particules
  slugGame.particles.forEach(pt => {
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();

  // 5. PARALLAX COUCHE 3 : Lianes d'Avant-Plan (1.4x)
  ctx.fillStyle = "rgba(22, 101, 52, 0.4)";
  for (let vx = -20; vx < w + 80; vx += 140) {
    const lianeX = vx - (sx * 1.4) % 140;
    ctx.fillRect(lianeX, 0, 4, 65 + Math.sin(lianeX * 0.05) * 20);
  }

  // 6. HUD RETRO METAL SLUG
  drawSlugHUD(now);

  ctx.restore();
}

function drawMarcoRossi(p, now) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.facing, 1);

  const isTarma = typeof selectedSlugCommando !== "undefined" && selectedSlugCommando === "tarma";

  // Ombre portée 64-bit avec dégradé radial doux
  const shadowGrad = ctx.createRadialGradient(0, 3, 2, 0, 3, 18);
  shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
  shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(0, 3, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const isCrouch = p.state === "crouch";
  const isJump = p.state === "jump";
  const isKnife = p.state === "knife";
  const runCycle = Math.sin(now * 0.016) * 7;

  // Jambes (Pantalon treillis 64-bit avec plis et poches cargo)
  const pantGrad = ctx.createLinearGradient(0, -20, 0, 0);
  pantGrad.addColorStop(0, isTarma ? "#854d0e" : "#78350f");
  pantGrad.addColorStop(0.5, isTarma ? "#a16207" : "#92400e");
  pantGrad.addColorStop(1, isTarma ? "#713f12" : "#451a03");
  ctx.fillStyle = pantGrad;

  if (isCrouch) {
    ctx.beginPath();
    ctx.roundRect(-12, -12, 24, 12, 3);
    ctx.fill();
    ctx.fillStyle = "#1e293b"; // Bottes repliées
    ctx.fillRect(-13, -5, 12, 5);
    ctx.fillRect(1, -5, 12, 5);
  } else if (isJump) {
    ctx.fillRect(-13, -20, 11, 14);
    ctx.fillRect(2, -24, 11, 14);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-14, -7, 12, 6);
    ctx.fillRect(1, -11, 12, 6);
  } else {
    // Jambes articulées en course
    ctx.fillRect(-9 + runCycle, -18, 8, 18);
    ctx.fillRect(1 - runCycle, -18, 8, 18);
    // Bottes de combat avec boucles et semelles crantées
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-10 + runCycle, -5, 10, 6);
    ctx.fillRect(0 - runCycle, -5, 10, 6);
    ctx.fillStyle = "#94a3b8"; // Boucle en métal
    ctx.fillRect(-7 + runCycle, -4, 3, 2);
    ctx.fillRect(3 - runCycle, -4, 3, 2);
  }

  // Torse 64-bit : T-shirt blanc & Gilet tactique avec poches et cartouches
  const torsoY = isCrouch ? -22 : -34;
  // T-shirt blanc
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(-8, torsoY, 16, 17);

  // Gilet tactique : Rouge vermillon pour Marco, Jaune moutarde pour Tarma
  const vestGrad = ctx.createLinearGradient(-10, torsoY, 10, torsoY);
  if (isTarma) {
    vestGrad.addColorStop(0, "#ca8a04");
    vestGrad.addColorStop(0.5, "#eab308");
    vestGrad.addColorStop(1, "#a16207");
  } else {
    vestGrad.addColorStop(0, "#991b1b");
    vestGrad.addColorStop(0.5, "#dc2626");
    vestGrad.addColorStop(1, "#b91c1c");
  }
  ctx.fillStyle = vestGrad;
  ctx.fillRect(-10, torsoY, 6, 16);
  ctx.fillRect(4, torsoY, 6, 16);

  // Cartouchières dorées sur le torse
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-3, torsoY + 6, 2, 4);
  ctx.fillRect(1, torsoY + 6, 2, 4);

  // Ceinture de combat avec boucle acier
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-8, torsoY + 14, 16, 3);
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(-2, torsoY + 13.5, 4, 4);

  // Tête 64-bit & Cheveux / Bandana ou Lunettes de soleil
  const headY = torsoY - 12;
  const skinGrad = ctx.createRadialGradient(0, headY, 1, 0, headY, 7);
  skinGrad.addColorStop(0, "#ffedd5");
  skinGrad.addColorStop(0.8, "#fed7aa");
  skinGrad.addColorStop(1, "#fb923c");
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(0, headY, 7, 0, Math.PI * 2);
  ctx.fill();

  if (isTarma) {
    // Tarma Roving : Coupe brune en banane + Lunettes noires d'aviateur
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.arc(-1, headY - 6, 7, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-6, headY - 8, 13, 4);
    // Lunettes d'aviateur noires miroitantes
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-1, headY - 3, 5, 4);
    ctx.fillRect(5, headY - 3, 4, 4);
    ctx.fillStyle = "#38bdf8"; // Reflet verre bleu
    ctx.fillRect(1, headY - 2, 2, 2);
  } else {
    // Marco Rossi : Mèche blonde + Bandana blanc volant
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(-6, headY - 8, 12, 4);
    ctx.fillStyle = "#f8fafc"; // Bandana
    ctx.fillRect(-7, headY - 5, 14, 3.5);
    // Pans de bandana qui flottent au vent derrière la tête
    const bandWave = Math.sin(now * 0.015) * 3;
    ctx.beginPath();
    ctx.moveTo(-7, headY - 3);
    ctx.lineTo(-14, headY - 1 + bandWave);
    ctx.lineTo(-15, headY + 5 + bandWave);
    ctx.lineTo(-7, headY);
    ctx.closePath();
    ctx.fill();
  }

  // Bras musclés 64-bit & Armement
  ctx.fillStyle = "#fed7aa";
  if (isKnife) {
    // Coup de poignard d'élite vers l'avant !
    ctx.fillRect(2, torsoY + 2, 18, 5);
    // Poing fermé
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(18, torsoY + 4, 4, 0, Math.PI * 2);
    ctx.fill();
    // Lame de poignard commando 64-bit avec rainure et éclat d'acier
    const bladeGrad = ctx.createLinearGradient(20, torsoY, 36, torsoY);
    bladeGrad.addColorStop(0, "#cbd5e1");
    bladeGrad.addColorStop(0.5, "#ffffff");
    bladeGrad.addColorStop(1, "#94a3b8");
    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    ctx.moveTo(20, torsoY + 1);
    ctx.lineTo(38, torsoY + 4.5);
    ctx.lineTo(20, torsoY + 8);
    ctx.closePath();
    ctx.fill();
    // Arc lumineux cinématique de découpe
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(14, torsoY + 4, 26, -0.45, 0.45);
    ctx.stroke();
  } else {
    // Bras tenant l'arme
    ctx.fillRect(0, torsoY + 3, 14, 5);
    // Arme en acier texturé 64-bit
    const gunGrad = ctx.createLinearGradient(8, torsoY, 26, torsoY);
    gunGrad.addColorStop(0, "#334155");
    gunGrad.addColorStop(0.5, "#0f172a");
    gunGrad.addColorStop(1, "#475569");
    ctx.fillStyle = gunGrad;

    if (p.aimY === -1) {
      // Vise vers le haut
      ctx.fillRect(-3, torsoY - 18, 6, 20);
    } else if (p.aimY === 1) {
      // Vise vers le bas
      ctx.fillRect(-3, torsoY + 6, 6, 20);
    } else {
      // Vise droit devant
      ctx.fillRect(8, torsoY + 1, 18, 6);
      if (p.weapon === "hmg") {
        // Heavy Machine Gun : Manchon perforé & bande de cartouches
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(24, torsoY + 2, 14, 4);
        ctx.fillStyle = "#facc15"; // Munitions dorées
        ctx.fillRect(14, torsoY + 7, 5, 6);
      } else if (p.weapon === "shotgun") {
        // Shotgun lourd : double pompe
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(22, torsoY, 12, 8);
        ctx.fillStyle = "#78350f"; // Poignée en bois
        ctx.fillRect(12, torsoY + 5, 8, 4);
      } else if (p.weapon === "rocket") {
        // Rocket Launcher
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(16, torsoY - 2, 22, 10);
      } else if (p.weapon === "flame") {
        // Flame Shot
        ctx.fillStyle = "#ea580c";
        ctx.fillRect(18, torsoY, 16, 8);
      }
    }
  }

  ctx.restore();
}

function drawMetalSlugTank(t, occupied, now) {
  ctx.save();
  ctx.translate(t.x, t.y - (t.tankBounce || 0));
  if (occupied) ctx.scale(slugGame.player.facing, 1);

  // Chenilles de char 64-bit avec maillons articulés & suspension
  ctx.fillStyle = "#090d16";
  ctx.beginPath();
  ctx.roundRect(-34, -16, 68, 18, 8);
  ctx.fill();

  // 5 Galets de roulement métalliques avec rivets
  for (let r = -24; r <= 24; r += 12) {
    const wheelGrad = ctx.createRadialGradient(r, -7, 1, r, -7, 5.5);
    wheelGrad.addColorStop(0, "#94a3b8");
    wheelGrad.addColorStop(0.6, "#475569");
    wheelGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = wheelGrad;
    ctx.beginPath();
    ctx.arc(r, -7, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(r, -7, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Châssis arrondi bleu-gris acier 64-bit du SV-001
  const hullGrad = ctx.createLinearGradient(-26, -38, 26, -14);
  hullGrad.addColorStop(0, "#64748b");
  hullGrad.addColorStop(0.35, "#475569");
  hullGrad.addColorStop(0.7, "#334155");
  hullGrad.addColorStop(1, "#1e293b");
  ctx.fillStyle = hullGrad;
  ctx.beginPath();
  ctx.roundRect(-28, -38, 56, 26, [10, 10, 4, 4]);
  ctx.fill();

  // Plaques d'armure rivetées et cordon de soudure
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-24, -34, 48, 18);

  // Marquage militaire doré "SV-001"
  ctx.fillStyle = "#fbbf24";
  ctx.font = "900 8px 'Impact', system-ui, sans-serif";
  ctx.fillText("SV-001", -14, -22);

  // Tourelle sphérique & Double canon rotatif Gatling 360°
  const turretGrad = ctx.createRadialGradient(0, -38, 2, 0, -38, 14);
  turretGrad.addColorStop(0, "#475569");
  turretGrad.addColorStop(0.7, "#1e293b");
  turretGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = turretGrad;
  ctx.beginPath();
  ctx.arc(2, -38, 13, Math.PI, 0);
  ctx.fill();

  // Canons doubles Gatling avec manchons de refroidissement
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(12, -42, 26, 4);
  ctx.fillRect(12, -36, 26, 4);
  // Extrémités de canons chromées
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(36, -43, 3, 6);
  ctx.fillRect(36, -37, 3, 6);

  // Pot d'échappement arrière et volute de fumée diesel
  ctx.fillStyle = "#78350f";
  ctx.fillRect(-32, -32, 6, 10);
  const smokePuff = Math.sin(now * 0.02) * 2;
  ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
  ctx.beginPath();
  ctx.arc(-36 + smokePuff, -36, 5, 0, Math.PI * 2);
  ctx.fill();

  // Pilote (Marco ou Tarma) sortant de la trappe supérieure
  if (occupied) {
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -48, 5.5, 0, Math.PI * 2);
    ctx.fill();
    const isTarma = typeof selectedSlugCommando !== "undefined" && selectedSlugCommando === "tarma";
    if (isTarma) {
      ctx.fillStyle = "#0f172a"; // Lunettes noires
      ctx.fillRect(1, -50, 4, 3);
    } else {
      ctx.fillStyle = "#f8fafc"; // Bandana blanc
      ctx.fillRect(-5, -52, 10, 3);
    }
  }

  ctx.restore();
}

function drawRebelInfantry(en, now) {
  ctx.save();
  ctx.translate(en.x, en.y);
  ctx.scale(en.facing, 1);

  // Ombre portée au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const isShooting = en.shootTimer < 0.25;
  const isPanic = en.state === "panic";
  const runCycle = Math.sin(now * 0.015 + (en.id ? en.id.charCodeAt(en.id.length - 1) : 0)) * 5;

  // Jambes & Bottes d'assaut 64-bit avec guêtres
  ctx.fillStyle = "#14532d";
  ctx.fillRect(-6 + runCycle, -14, 5, 14);
  ctx.fillRect(1 - runCycle, -14, 5, 14);
  // Bottes de cuir noir et semelles crantées
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(-7 + runCycle, -4, 7, 5);
  ctx.fillRect(0 - runCycle, -4, 7, 5);

  // Torse uniforme Feldgrau / Vert Armée Rebelle avec cartouchières
  const torsoGrad = ctx.createLinearGradient(-8, -32, 8, -14);
  torsoGrad.addColorStop(0, "#166534");
  torsoGrad.addColorStop(0.6, "#14532d");
  torsoGrad.addColorStop(1, "#052e16");
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.roundRect(-8, -30, 16, 17, 3);
  ctx.fill();

  // Bretelles de suspension tactiques et ceinturon cuir
  ctx.fillStyle = "#451a03";
  ctx.fillRect(-8, -17, 16, 3.5);
  ctx.fillStyle = "#cbd5e1"; // Boucle ceinturon
  ctx.fillRect(-2, -17.5, 4, 4.5);
  // Cartouchières doubles sur la poitrine
  ctx.fillStyle = "#78350f";
  ctx.fillRect(-6, -26, 4, 6);
  ctx.fillRect(2, -26, 4, 6);

  // Tête & Visage expressif de soldat rebelle
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(0, -36, 6, 0, Math.PI * 2);
  ctx.fill();

  // Yeux et bouche expressifs
  ctx.fillStyle = "#0f172a";
  if (isPanic) {
    // Yeux exorbités de panique !
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(1, -38, 4, 4);
    ctx.fillStyle = "#000000";
    ctx.fillRect(2, -37, 2, 2);
    // Bouche grande ouverte criant
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.arc(2, -33, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (isShooting) {
    // Grimace de tir déterminé
    ctx.fillRect(1, -38, 4, 1.5);
    ctx.fillRect(1, -34, 3, 1.5);
  } else {
    // Regard militaire standard
    ctx.fillRect(1, -37, 3, 2);
  }

  // Casque militaire en acier Stahlhelm M35 64-bit avec bord évasé et reflet métallique
  const helmGrad = ctx.createRadialGradient(-1, -44, 2, 0, -40, 10);
  helmGrad.addColorStop(0, "#22c55e");
  helmGrad.addColorStop(0.35, "#15803d");
  helmGrad.addColorStop(0.8, "#14532d");
  helmGrad.addColorStop(1, "#052e16");
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.arc(0, -40, 7.5, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();
  // Visière et couvre-nuque évasé du Stahlhelm
  ctx.fillRect(-9, -40, 18, 3.5);
  ctx.fillStyle = "#0f172a"; // Jugulaire cuir
  ctx.fillRect(-1, -35, 1.5, 5);

  // Armement selon le rôle (Rifle / Grenade / Shield)
  if (en.type === "shield") {
    // Bouclier anti-émeute blindé lourd avec fente de visée
    const shieldGrad = ctx.createLinearGradient(6, -42, 18, -2);
    shieldGrad.addColorStop(0, "#64748b");
    shieldGrad.addColorStop(0.5, "#334155");
    shieldGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.roundRect(6, -40, 10, 40, 3);
    ctx.fill();
    // Fente de visée blindée
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(8, -34, 6, 2.5);
    // Rivets d'acier renforcés
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(7, -38, 2, 2);
    ctx.fillRect(7, -6, 2, 2);
  } else if (en.type === "grenadier") {
    // Grenade à manche Stielhandgranate 24 prête à être lancée !
    ctx.fillStyle = "#fed7aa"; // Bras levé
    ctx.fillRect(-2, -34, 6, 12);
    // Manche en bois
    ctx.fillStyle = "#78350f";
    ctx.fillRect(4, -48, 3, 16);
    // Tête explosive métallique de grenade
    ctx.fillStyle = "#15803d";
    ctx.fillRect(2, -54, 7, 7);
  } else {
    // Fusil de combat avec crosse en bois et culasse acier
    ctx.fillStyle = "#fed7aa"; // Bras tenant l'arme
    ctx.fillRect(0, -28, 10, 5);
    // Crosse en noyer
    ctx.fillStyle = "#78350f";
    ctx.fillRect(-4, -25, 8, 4);
    // Boîtier et canon d'acier bleui
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(4, -26, 22, 4);
    ctx.fillRect(24, -25, 3, 2);

    // Muzzle flash cinématique lors du tir
    if (isShooting) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(28, -24, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(28, -24, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawGiridaTank(t, now) {
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.scale(t.facing, 1);

  // Ombre portée lourde au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 38, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chenilles métalliques avec patins de caoutchouc
  ctx.fillStyle = "#090d16";
  ctx.beginPath();
  ctx.roundRect(-36, -16, 72, 17, 7);
  ctx.fill();

  // 4 Galets de roulement crantés du char Girida-O
  for (let gx = -24; gx <= 24; gx += 16) {
    const wheelGrad = ctx.createRadialGradient(gx, -8, 1, gx, -8, 6);
    wheelGrad.addColorStop(0, "#78350f");
    wheelGrad.addColorStop(0.6, "#451a03");
    wheelGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = wheelGrad;
    ctx.beginPath();
    ctx.arc(gx, -8, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#facc15"; // Moyeu en bronze
    ctx.beginPath();
    ctx.arc(gx, -8, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Châssis blindé lourd brun/kaki militaire 64-bit
  const bodyGrad = ctx.createLinearGradient(-30, -36, 30, -14);
  bodyGrad.addColorStop(0, "#92400e");
  bodyGrad.addColorStop(0.4, "#78350f");
  bodyGrad.addColorStop(0.8, "#451a03");
  bodyGrad.addColorStop(1, "#1c1917");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-30, -36, 60, 22, [8, 8, 3, 3]);
  ctx.fill();

  // Emblème Rebelle peint sur le flanc (croix jaune et crâne)
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-8, -30, 16, 2.5);
  ctx.fillRect(-2, -34, 4, 10);

  // Tourelle hémisphérique rotative & Viseur optique
  const turretGrad = ctx.createRadialGradient(2, -38, 2, 2, -38, 16);
  turretGrad.addColorStop(0, "#a16207");
  turretGrad.addColorStop(0.5, "#78350f");
  turretGrad.addColorStop(1, "#292524");
  ctx.fillStyle = turretGrad;
  ctx.beginPath();
  ctx.arc(4, -38, 14, Math.PI, 0);
  ctx.fill();

  // Coupole du commandant avec fente d'observation
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-2, -54, 10, 4);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(1, -53, 4, 2);

  // Canon anti-blindé 75mm long à frein de bouche imposant
  const barrelGrad = ctx.createLinearGradient(12, -42, 44, -36);
  barrelGrad.addColorStop(0, "#451a03");
  barrelGrad.addColorStop(0.5, "#1c1917");
  barrelGrad.addColorStop(1, "#44403c");
  ctx.fillStyle = barrelGrad;
  ctx.fillRect(12, -42, 32, 7);
  // Frein de bouche à évents multiples
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(40, -44, 6, 11);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(42, -43, 2, 9);

  // Pot d'échappement arrière avec fumée diesel animée
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(-34, -28, 6, 8);
  const dieselSmoke = Math.sin(now * 0.02) * 2;
  ctx.fillStyle = "rgba(100, 116, 139, 0.45)";
  ctx.beginPath();
  ctx.arc(-38 + dieselSmoke, -30, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFlyingTara(pl, now) {
  ctx.save();
  ctx.translate(pl.x, pl.y);

  // Ombre portée aérienne projetée sur le sol
  const shadowY = slugGame.groundY - pl.y;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, shadowY, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fuselage d'avion rebelle 64-bit vert militaire avec dégradé aérodynamique
  const fuseGrad = ctx.createLinearGradient(0, -12, 0, 12);
  fuseGrad.addColorStop(0, "#22c55e");
  fuseGrad.addColorStop(0.4, "#15803d");
  fuseGrad.addColorStop(0.85, "#166534");
  fuseGrad.addColorStop(1, "#052e16");
  ctx.fillStyle = fuseGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Capot moteur jaune moutarde distinctif SNK
  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.arc(-22, 0, 8.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();

  // Hélice bipale en rotation ultra-rapide (disque de flou semi-transparent)
  ctx.fillStyle = "rgba(250, 204, 21, 0.4)";
  ctx.beginPath();
  ctx.ellipse(-29, 0, 3, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pale brillante traversante
  const propAngle = (now * 0.04) % (Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-29, -Math.sin(propAngle) * 14);
  ctx.lineTo(-29, Math.sin(propAngle) * 14);
  ctx.stroke();

  // Verrière de cockpit en goutte d'eau avec pilote casqué
  const glassGrad = ctx.createLinearGradient(-4, -12, 10, -2);
  glassGrad.addColorStop(0, "rgba(224, 242, 254, 0.95)");
  glassGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.85)");
  glassGrad.addColorStop(1, "rgba(14, 116, 144, 0.9)");
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.ellipse(2, -5, 11, 6, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Pilote rebelle avec lunettes d'aviateur dans le cockpit
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(3, -4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a"; // Lunettes
  ctx.fillRect(1, -5, 4, 1.8);

  // Aile principale monoplan avec feux de navigation
  ctx.fillStyle = "#14532d";
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-4, -16);
  ctx.lineTo(8, -16);
  ctx.lineTo(14, 0);
  ctx.closePath();
  ctx.fill();

  // Bombe largable sous le ventre
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.ellipse(-2, 11, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#facc15"; // Anneau jaune de sécurité
  ctx.fillRect(-3, 8.5, 2, 5);

  // Empennage arrière et bande d'identification jaune
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.moveTo(20, -2);
  ctx.lineTo(28, -14);
  ctx.lineTo(31, -14);
  ctx.lineTo(26, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#eab308";
  ctx.fillRect(23, -8, 3, 8);

  ctx.restore();
}

function drawSlugPOW(pow, now) {
  ctx.save();
  ctx.translate(pow.x, pow.y);

  // Ombre portée au sol
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.beginPath();
  ctx.ellipse(0, 2, 12, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (pow.saluting) {
    // Otage P.O.W. libéré exécutant le salut militaire légendaire de Metal Slug !
    // Saut de joie animé
    const hopY = -Math.abs(Math.sin(now * 0.008) * 8);
    ctx.translate(0, hopY);

    // Pantalon bleu indigo déchiré / bermuda usé
    const pantsGrad = ctx.createLinearGradient(-6, -14, 6, 0);
    pantsGrad.addColorStop(0, "#1d4ed8");
    pantsGrad.addColorStop(0.6, "#1e3a8a");
    pantsGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = pantsGrad;
    ctx.fillRect(-6, -14, 12, 11);
    // Jambes nues & pieds nus
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(-5, -4, 4, 5);
    ctx.fillRect(1, -4, 4, 5);

    // Torse nu hâlé par la captivité avec muscles dessinés
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.roundRect(-7, -27, 14, 14, 2);
    ctx.fill();

    // Barbe blanche mythique extra-longue et soyeuse descendant sous la ceinture
    const beardGrad = ctx.createLinearGradient(0, -26, 0, -6);
    beardGrad.addColorStop(0, "#ffffff");
    beardGrad.addColorStop(0.7, "#f1f5f9");
    beardGrad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = beardGrad;
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-8, -14, -4, -6);
    ctx.quadraticCurveTo(0, -2, 4, -6);
    ctx.quadraticCurveTo(8, -14, 6, -26);
    ctx.closePath();
    ctx.fill();

    // Tête avec cheveux blancs ébouriffés
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -32, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-7, -38, 14, 5); // Tignasse ébouriffée

    // Yeux plissés de gratitude et grand sourire
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-3, -33, 2, 1.5);
    ctx.fillRect(1, -33, 2, 1.5);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-1.5, -30, 3, 1.5);

    // Bras droit impeccablement tendu en salut militaire au front !
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(4, -34, 8, 3.5);
    ctx.fillRect(10, -38, 3.5, 7);

    // Étoiles de remerciement scintillantes "THANK YOU!"
    if (Math.floor(now / 200) % 2 === 0) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "900 10px 'Impact', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("THANK YOU!", 0, -44);
    }
  } else {
    // Otage P.O.W. ligoté à genoux en attente de secours
    const wriggle = Math.sin(now * 0.01) * 1.5;
    ctx.translate(wriggle, 0);

    // Bermuda bleu déchiré
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-7, -10, 14, 10);

    // Torse nu ligoté par de grosses cordes de chanvre
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(-6, -22, 12, 13);
    // Cordes de chanvre épaisses avec nœuds
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 2.2;
    ctx.strokeRect(-6, -19, 12, 7);

    // Longue barbe blanche
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(-5, -20);
    ctx.lineTo(0, -9);
    ctx.lineTo(5, -20);
    ctx.closePath();
    ctx.fill();

    // Tête baissée avec cheveux longs
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -26, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-6, -30, 12, 4);

    // Bulle de supplication clignotante "HELP!"
    if (Math.floor(now / 350) % 2 === 0) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "900 10px 'Impact', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HELP!", 0, -34);
    }
  }

  ctx.restore();
}

function drawSlugPickup(pu, now) {
  ctx.save();
  ctx.translate(pu.x, pu.y);

  // Flottement léger cinématique
  const bobY = Math.sin(now * 0.007) * 3;
  ctx.translate(0, bobY);

  if (pu.type === "chicken") {
    // Poulet rôti doré succulent sur plat d'argent 64-bit
    ctx.fillStyle = "#cbd5e1"; // Plat d'argent
    ctx.beginPath();
    ctx.ellipse(0, 4, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Volaille dorée rôtie au four
    const chickenGrad = ctx.createRadialGradient(-2, -3, 2, 0, 0, 10);
    chickenGrad.addColorStop(0, "#fbbf24");
    chickenGrad.addColorStop(0.5, "#d97706");
    chickenGrad.addColorStop(1, "#78350f");
    ctx.fillStyle = chickenGrad;
    ctx.beginPath();
    ctx.ellipse(0, -1, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cuisse dorée
    ctx.fillRect(6, -6, 6, 4);
    ctx.fillStyle = "#ffffff"; // Manchon en papier blanc
    ctx.fillRect(10, -7, 4, 6);

    // Texte bonus scintillant
    ctx.fillStyle = "#facc15";
    ctx.font = "900 9px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("1000 PTS", 0, -11);
  } else {
    // Caisse de munitions en bois renforcé 64-bit avec coins d'acier rivetés
    const crateGrad = ctx.createLinearGradient(-13, -13, 13, 13);
    crateGrad.addColorStop(0, "#92400e");
    crateGrad.addColorStop(0.5, "#78350f");
    crateGrad.addColorStop(1, "#451a03");
    ctx.fillStyle = crateGrad;
    ctx.fillRect(-13, -11, 26, 18);

    // Planches de bois veinées
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-13, -2);
    ctx.lineTo(13, -2);
    ctx.stroke();

    // Renforts d'angles en acier rivetés
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-13, -11, 26, 18);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(-12, -10, 2, 2);
    ctx.fillRect(10, -10, 2, 2);
    ctx.fillRect(-12, 5, 2, 2);
    ctx.fillRect(10, 5, 2, 2);

    // Badge stencil d'identification lumineux
    let badgeColor = "#22c55e";
    let badgeLetter = "H";
    if (pu.type === "shotgun") {
      badgeColor = "#38bdf8";
      badgeLetter = "S";
    } else if (pu.type === "bomb") {
      badgeColor = "#f59e0b";
      badgeLetter = "💣";
    }

    ctx.fillStyle = badgeColor;
    ctx.beginPath();
    ctx.arc(0, -2, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.font = "900 9px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeLetter, 0, -1);
  }

  ctx.restore();
}

function drawBossTetsuyuki(b, now) {
  ctx.save();
  ctx.translate(b.x, b.y);

  if (b.hitFlash > 0) {
    ctx.filter = "brightness(2.2) saturate(0.4)";
  }

  // 1. ÉPAVE DE BOMBARDIER QUADRIMOTEUR TETSUYUKI (Planche 4)
  // Fuselage d'acier écrasé dans la berge boueuse avec dégradé d'armure lourde
  const hullGrad = ctx.createLinearGradient(0, 0, b.width, b.height);
  hullGrad.addColorStop(0, "#475569");
  hullGrad.addColorStop(0.3, "#334155");
  hullGrad.addColorStop(0.7, "#1e293b");
  hullGrad.addColorStop(1, "#090d16");
  ctx.fillStyle = hullGrad;

  // Profil géant du bombardier écrasé
  ctx.beginPath();
  ctx.moveTo(0, 35);
  ctx.lineTo(b.width * 0.25, -25);
  ctx.lineTo(b.width * 0.7, -45);
  ctx.lineTo(b.width * 0.95, 10);
  ctx.lineTo(b.width, b.height);
  ctx.lineTo(0, b.height);
  ctx.closePath();
  ctx.fill();

  // Plaques d'armure renforcée rivetées et coulures de rouille orange
  ctx.fillStyle = "#92400e";
  ctx.fillRect(20, 25, 75, 40);
  ctx.fillRect(110, 15, 80, 50);
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(20, 25, 75, 40);
  ctx.strokeRect(110, 15, 80, 50);

  // Rivets d'acier tout le long des longerons
  ctx.fillStyle = "#94a3b8";
  for (let rx = 24; rx < b.width * 0.9; rx += 16) {
    ctx.fillRect(rx, 28, 2, 2);
    ctx.fillRect(rx, 62, 2, 2);
  }

  // 2. RÉACTEURS D'AILES BRISÉS & MOTEURS EN FEU
  // Réacteur gauche fumant
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(60, 80, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f97316"; // Lueur incandescente interne
  ctx.beginPath();
  ctx.arc(60, 80, 14, 0, Math.PI * 2);
  ctx.fill();

  // Volutes de fumée noire épaisse & gerbes d'étincelles
  const smokeOsc = Math.sin(now * 0.015) * 8;
  ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
  ctx.beginPath();
  ctx.arc(55 + smokeOsc, 40, 18, 0, Math.PI * 2);
  ctx.arc(45 + smokeOsc * 1.5, 10, 24, 0, Math.PI * 2);
  ctx.fill();
  // Étincelles
  if (Math.floor(now / 120) % 2 === 0) {
    ctx.fillStyle = "#facc15";
    ctx.fillRect(68 + Math.random() * 8, 70 - Math.random() * 12, 3, 3);
  }

  // 3. TOURELLE DE CANON GÉANTE TETSUYUKI (Rotative, articulée, visant le joueur)
  const turretCenterX = 135;
  const turretCenterY = -12;
  const tAngle = b.turretAngle || -Math.PI * 0.75;

  ctx.save();
  ctx.translate(turretCenterX, turretCenterY);

  // Dôme blindé hémisphérique de la tourelle
  const domeGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 32);
  domeGrad.addColorStop(0, "#64748b");
  domeGrad.addColorStop(0.6, "#334155");
  domeGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = domeGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fût de canon lourd géant 203mm orienté vers le joueur
  ctx.rotate(tAngle);
  const barrelGrad = ctx.createLinearGradient(0, -10, 85, 10);
  barrelGrad.addColorStop(0, "#1e293b");
  barrelGrad.addColorStop(0.5, "#475569");
  barrelGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = barrelGrad;
  ctx.fillRect(15, -9, 78, 18);
  // Manchon de renfort et bouche crénelée
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(80, -12, 16, 24);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(94, -10, 4, 20);

  ctx.restore();

  // Poste de DCA secondaire sur l'avant
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(15, -8, 22, 14);
  ctx.fillRect(-5, -6, 22, 5);

  ctx.restore();

  // 4. BARRE DE VIE ÉPIQUE RETRO DU BOSS TETSUYUKI (HUD supérieur)
  ctx.save();
  const barW = Math.min(380, canvas.width * 0.55);
  const barX = canvas.width / 2 - barW / 2;
  const barY = 46;

  // Cadre blindé néon
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(barX - 4, barY - 4, barW + 8, 24);
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX - 4, barY - 4, barW + 8, 24);

  // Remplissage dynamique avec dégradé rouge sang / orange
  const hpRatio = Math.max(0, b.hp / b.maxHp);
  const hpGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
  hpGrad.addColorStop(0, "#ef4444");
  hpGrad.addColorStop(0.6, "#f97316");
  hpGrad.addColorStop(1, "#facc15");
  ctx.fillStyle = hpGrad;
  ctx.fillRect(barX, barY, barW * hpRatio, 16);

  // Hachures d'avertissement de danger
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  for (let hx = 0; hx < barW * hpRatio; hx += 14) {
    ctx.fillRect(barX + hx, barY, 6, 16);
  }

  // Titre Arcade
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px 'Impact', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("BOSS : TETSUYUKI // CRASHED BOMBER FORTRESS", canvas.width / 2, barY - 8);

  ctx.restore();
}

function drawSlugHUD(now) {
  const p = slugGame.player;
  const w = canvas.width;

  ctx.save();
  // Bandeau supérieur arcade
  ctx.fillStyle = "#fbbf24";
  ctx.font = "900 14px 'Impact', system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`1UP  ${p.score}`, 22, 26);

  // Arme & Munitions
  const wpnName = p.weapon.toUpperCase();
  ctx.fillStyle = "#4ade80";
  ctx.fillText(`ARMS: ${wpnName} [${p.ammo === 999 ? "∞" : p.ammo}]`, 160, 26);

  // Grenades & Otages sauvés
  ctx.fillStyle = "#f59e0b";
  ctx.fillText(`💣 x ${p.grenades}`, 340, 26);
  ctx.fillStyle = "#38bdf8";
  ctx.fillText(`P.O.W. 🎖️ x ${p.powRescued}`, 430, 26);

  // Jauge de blindage du Metal Slug
  if (p.inTank) {
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`SLUG LIFE: [${"█".repeat(p.tankHp)}${"░".repeat(p.maxTankHp - p.tankHp)}]`, 560, 26);
  }

  // Bannière introductive "MISSION 1 START"
  if (slugGame.introBannerTimer > 0) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(0, canvas.height * 0.35, w, 75);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "900 36px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("★ MISSION 1 ★", w / 2, canvas.height * 0.42);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("START !", w / 2, canvas.height * 0.48);
  }

  // Écran de Victoire & Décompte de Mission
  if (slugGame.missionComplete) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(0, canvas.height * 0.25, w, 180);
    ctx.fillStyle = "#22c55e";
    ctx.font = "900 42px 'Impact', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MISSION COMPLETE !", w / 2, canvas.height * 0.35);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "900 20px system-ui, sans-serif";
    ctx.fillText(`OTAGES SAUVÉS : ${p.powRescued} × 10 000 PTS = +${p.powRescued * 10000} PTS`, w / 2, canvas.height * 0.42);
    ctx.fillText(`BONUS DESTRUCTEUR TETSUYUKI : +50 000 PTS`, w / 2, canvas.height * 0.48);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillText("APPUYEZ SUR [ESPACE] OU RELANCEZ UNE MISSION DANS LE PORTAIL !", w / 2, canvas.height * 0.54);
  }

  ctx.restore();
}
const novaGamesPortal = document.getElementById("novaGamesPortal");

function openNovaGamesPortal() {
  state.running = false;
  state.paused = false;
  if (novaGamesPortal) {
    novaGamesPortal.classList.remove("hidden");
    novaGamesPortal.scrollTop = 0;
  }
}

function launchGameFromPortal(gameMode) {
  if (novaGamesPortal) {
    novaGamesPortal.classList.add("hidden");
  }
  setGameMode(gameMode);
  if (gameMode === "slug") {
    showOverlay(
      "MISSION 1 // NOVA IRON COMMANDO",
      "Metal Slug 1 Remake : Jungle Fluviale, Otages P.O.W., Tank SV-001 & Boss Tetsuyuki",
      "DÉMARRER LA MISSION 1"
    );
  } else if (gameMode === "tank") {
    showOverlay(
      "MISSION BLINDÉE // NOVA TANK ASSAULT",
      "Choisis ton Théâtre d'Opérations, ton Blindé et ton Armement !",
      "LANCER L'ASSAUT BLINDÉ"
    );
  } else {
    showOverlay(
      "CHAMP DE TIR 3D // MISSION NOVA",
      "Choisis ton Biome 3D, ton Vaisseau et ton Armement !",
      "DÉMARRER LA MISSION 3D"
    );
  }
  syncUi();
  draw();
}

document.querySelectorAll("[data-launch-game]").forEach((el) => {
  const handler = (e) => {
    e.stopPropagation();
    const mode = el.getAttribute("data-launch-game");
    if (mode === "space" || mode === "tank" || mode === "slug") {
      launchGameFromPortal(mode);
    }
  };
  el.addEventListener("click", handler);
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handler(e);
  });
});

const backToPortalSidebarBtn = document.getElementById("backToPortalSidebarBtn");
if (backToPortalSidebarBtn) {
  backToPortalSidebarBtn.addEventListener("click", openNovaGamesPortal);
  backToPortalSidebarBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    openNovaGamesPortal();
  });
}

// Bouton "Portail Nova Games" dans le menu Pause / Fin
const switchGameMenuBtn = document.getElementById("switchGameMenuBtn");
if (switchGameMenuBtn) {
  switchGameMenuBtn.addEventListener("click", openNovaGamesPortal);
  switchGameMenuBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    openNovaGamesPortal();
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

// Boutons Bouclier d'Urgence 3s (HUD Desktop + Mobile)
const hudShieldBtn = document.getElementById("hudShieldBtn");
if (hudShieldBtn) {
  hudShieldBtn.addEventListener("click", activateShield);
  hudShieldBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    activateShield();
  });
}
const btnShieldMobile = document.getElementById("btnShieldMobile");
if (btnShieldMobile) {
  btnShieldMobile.addEventListener("click", activateShield);
  btnShieldMobile.addEventListener("touchstart", (e) => {
    e.preventDefault();
    activateShield();
  });
}

// Boutons tactiles Street Fighter Duel Post-Boss
const btnDuelPunch = document.getElementById("btnDuelPunch");
if (btnDuelPunch) {
  btnDuelPunch.addEventListener("click", () => performDuelAction("punch"));
  btnDuelPunch.addEventListener("touchstart", (e) => { e.preventDefault(); performDuelAction("punch"); });
}
const btnDuelKick = document.getElementById("btnDuelKick");
if (btnDuelKick) {
  btnDuelKick.addEventListener("click", () => performDuelAction("kick"));
  btnDuelKick.addEventListener("touchstart", (e) => { e.preventDefault(); performDuelAction("kick"); });
}
const btnDuelHadouken = document.getElementById("btnDuelHadouken");
if (btnDuelHadouken) {
  btnDuelHadouken.addEventListener("click", () => performDuelAction("hadouken"));
  btnDuelHadouken.addEventListener("touchstart", (e) => { e.preventDefault(); performDuelAction("hadouken"); });
}
const btnDuelJump = document.getElementById("btnDuelJump");
if (btnDuelJump) {
  btnDuelJump.addEventListener("click", () => performDuelAction("jump"));
  btnDuelJump.addEventListener("touchstart", (e) => { e.preventDefault(); performDuelAction("jump"); });
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

function initSidebarPreference() {
  try {
    const saved = localStorage.getItem("nova_sidebar_collapsed");
    if (saved !== null) {
      toggleSidebar(saved === "true");
    } else if (window.innerWidth <= 900) {
      toggleSidebar(true);
    }
  } catch (e) {
    if (window.innerWidth <= 900) toggleSidebar(true);
  }
}

(function init() {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  makeStars();
  initSidebarPreference();
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
