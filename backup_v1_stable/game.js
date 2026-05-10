const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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

function resizeCanvas() {
  const area = canvas.parentElement;
  const w = area.clientWidth;
  const h = area.clientHeight;
  canvas.width = w;
  canvas.height = h;
  
  if (player) {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 108;
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
  nova: { id: "nova", color: "#4df2c2", speed: 420, invul: 1200, width: 78, height: 78, weapon: "normal" },
  viper: { id: "viper", color: "#ff6474", speed: 540, invul: 1000, width: 68, height: 84, weapon: "rapid" },
  goliath: { id: "goliath", color: "#ffb84d", speed: 320, invul: 1800, width: 90, height: 70, weapon: "spread" },
  phantom: { id: "phantom", color: "#c264ff", speed: 480, invul: 1400, width: 72, height: 72, weapon: "plasma" },
  orion: { id: "orion", color: "#7af2ff", speed: 380, invul: 1600, width: 84, height: 80, weapon: "triple" }
};
let selectedShipId = "nova";
let selectedDifficulty = "normal";

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
  playerInvulnerableUntil: 0,
  powerups: [],
  showingQuestion: false,
  currentQuestion: null,
  currentWaveBonus: 0,
};

const WEAPONS = {
  normal: { name: "Laser Simple", color: "#7af2ff", delay: 190, speed: 560, width: 6 },
  rapid: { name: "Tir Rapide", color: "#b8ff5e", delay: 100, speed: 640, width: 5 },
  triple: { name: "Triple Laser", color: "#ffb84d", delay: 220, speed: 520, width: 4 },
  spread: { name: "Faisceau", color: "#ff6474", delay: 280, speed: 480, width: 8 },
  plasma: { name: "Plasma", color: "#c264ff", delay: 350, speed: 400, width: 14 },
  deflagration: { name: "Déflagration", color: "#ff4422", delay: 450, speed: 320, width: 18, explosion: true },
  bomb: { name: "Bombe", color: "#ffaa00", delay: 600, speed: 280, width: 50, height: 50, explosion: true, explosionHeight: 80 },
  fragbomb: { name: "Fragmentation", color: "#ffffff", delay: 500, speed: 300, width: 12, frag: true },
};

const powerupTypes = ["rapid", "triple", "spread", "plasma", "deflagration", "bomb", "fragbomb", "invincibility", "clone"];

const player = {
  width: 78,
  height: 78,
  x: canvas.width / 2 - 39,
  y: canvas.height - 108,
  weapon: "normal",
  weaponTime: 0,
  cloneTime: 0,
  speed: 420,
  invul: 1200,
  color: "#4df2c2"
};

function applyShipSelection() {
  const ship = SHIPS[selectedShipId];
  player.width = ship.width;
  player.height = ship.height;
  player.speed = ship.speed;
  player.invul = ship.invul;
  player.color = ship.color;
  player.id = ship.id;
  player.baseWeapon = ship.weapon;
  player.weapon = ship.weapon;
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
  const v = "?v=2";
  state.images.nova = await loadImage("ship_vanguard.png" + v);
  state.images.viper = await loadImage("ship_swift.png" + v);
  state.images.goliath = await loadImage("ship_titan.png" + v);
  state.images.phantom = await loadImage("ship_ghost.png" + v);
  state.images.orion = await loadImage("ship_orion.png" + v);

  state.images.squid = await loadImage("enemy_squid.png" + v);
  state.images.crab = await loadImage("enemy_crab.png" + v);
  state.images.octopus = await loadImage("enemy_octopus.png" + v);
  state.images.boss = await loadImage("boss_ship.png" + v);
}

function resetPlayer() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 108;
}

function isPlayerInvulnerable(timestamp) {
  return timestamp < state.playerInvulnerableUntil;
}

function createEnemyWave(wave) {
  const rows = 5;
  const cols = 11;
  const enemyList = [];
  const width = 36;
  const height = 36;
  const padding = 12;
  const totalWidth = cols * width + (cols - 1) * padding;
  const startX = (canvas.width - totalWidth) / 2;
  const startY = 60 + (wave * 15); // Descend plus bas à chaque niveau

  for (let row = 0; row < rows; row += 1) {
    let type = "squid"; // 30 pts approx
    let hp = 1;
    if (row === 1 || row === 2) type = "crab"; // 20 pts
    if (row >= 3) type = "octopus"; // 10 pts

    for (let col = 0; col < cols; col += 1) {
      enemyList.push({
        x: startX + col * (width + padding),
        y: startY + row * (height + padding),
        width: type === "squid" ? 36 : type === "crab" ? 44 : 48,
        height: type === "squid" ? 36 : type === "crab" ? 32 : 32,
        type,
        hp: 1,
        dead: false,
        freeRoaming: Math.random() < 0.05,
        vx: (Math.random() - 0.5) * 100,
        vy: 20 + Math.random() * 30
      });
    }
  }

  let speedMult = 1;
  if (selectedDifficulty === "easy") speedMult = 0.7;
  if (selectedDifficulty === "hard") speedMult = 1.4;

  state.enemySpeed = (20 + (wave * 4)) * speedMult;
  state.enemyDropDistance = 20;
  state.enemyDirection = 1;
  return enemyList;
}

function spawnBoss() {
  const wave = state.wave;
  let hp = 40;
  let speed = 100;
  let name = "Juggernaut";
  let fireChance = 0.02;
  let w = 200, h = 140;

  if (wave === 10) { name = "L'Eclipse"; hp = 60; speed = 160; fireChance = 0.035; w = 160; }
  if (wave === 15) { name = "Centurion"; hp = 90; speed = 140; fireChance = 0.045; w = 220; }
  if (wave === 20) { name = "Cerveau Ruche"; hp = 140; speed = 200; fireChance = 0.06; w = 180; }

  state.boss = {
    name,
    x: canvas.width / 2 - w / 2,
    y: 70,
    width: w,
    height: h,
    health: hp,
    maxHealth: hp,
    speed,
    direction: 1,
    fireChance,
    phase: 1,
    attackTimer: 0,
    sideAttack: wave >= 15,
  };
}

function initGame() {
  state.score = 0;
  state.lives = selectedDifficulty === "easy" ? 5 : (selectedDifficulty === "hard" ? 1 : 3);
  state.wave = 1;
  state.shots = [];
  state.enemyShots = [];
  state.particles = [];
  state.boss = null;
  state.playerInvulnerableUntil = 0;
  state.powerups = [];
  state.showingQuestion = false;
  state.currentQuestion = null;
  player.weapon = player.baseWeapon || "normal";
  player.weaponTime = 0;
  resetPlayer();
  enemies = createEnemyWave(state.wave);
  makeStars();
  syncUi();
}

function syncUi() {
  ui.score.textContent = String(state.score);
  ui.highScore.textContent = String(state.highScore);
  ui.lives.textContent = String(state.lives);
  ui.wave.textContent = String(state.wave);
  
  if (ui.weapon) {
    const weapon = WEAPONS[player.weapon];
    ui.weapon.textContent = player.weaponTime > 0 ? weapon.name : "—";
    ui.weapon.style.color = player.weaponTime > 0 ? weapon.color : "#6b8aa6";
    
    if (ui.weaponTimer && player.weaponTime > 0) {
      const remaining = player.weaponTime - performance.now();
      const percent = Math.max(0, remaining / 8000 * 100);
      ui.weaponTimer.style.width = percent + "%";
      ui.weaponTimer.style.backgroundColor = weapon.color;
    } else if (ui.weaponTimer) {
      ui.weaponTimer.style.width = "0%";
    }
  }
}

function startGame() {
  applyShipSelection();
  initGame();
  state.running = true;
  state.paused = false;
  state.lastFrame = performance.now();
  state.lastShotAt = 0;
  hideOverlay();
  syncUi();
  requestAnimationFrame(loop);
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
  ui.overlay.classList.remove("hidden");
}

function hideOverlay() {
  ui.overlay.classList.add("hidden");
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
  const weapon = WEAPONS[player.weapon];
  if (timestamp - state.lastShotAt < weapon.delay) {
    return;
  }
  
  playSound('shoot');

  const cx = player.x + player.width / 2;
  const baseY = player.y + 6;

  if (player.weapon === "triple") {
    state.shots.push({ x: cx - 14, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, vx: -60 });
    state.shots.push({ x: cx - 2, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, vx: 0 });
    state.shots.push({ x: cx + 10, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, vx: 60 });
  } else if (player.weapon === "spread") {
    state.shots.push({ x: cx - 18, y: baseY + 4, width: weapon.width, height: 12, speed: weapon.speed * 0.85, vx: -100 });
    state.shots.push({ x: cx - 2, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, vx: 0 });
    state.shots.push({ x: cx + 10, y: baseY + 4, width: weapon.width, height: 12, speed: weapon.speed * 0.85, vx: 100 });
  } else if (player.weapon === "plasma") {
    state.shots.push({ x: cx - 7, y: baseY, width: weapon.width, height: 24, speed: weapon.speed });
  } else if (player.weapon === "deflagration") {
    state.shots.push({ x: cx - 9, y: baseY, width: weapon.width, height: 28, speed: weapon.speed, explosion: true, explosionRadius: 60 });
  } else if (player.weapon === "bomb") {
    state.shots.push({ x: cx - weapon.width / 2, y: baseY - weapon.height + 10, width: weapon.width, height: weapon.height, speed: weapon.speed, explosion: true, explosionHeight: weapon.explosionHeight });
  } else if (player.weapon === "fragbomb") {
    state.shots.push({ x: cx - weapon.width / 2, y: baseY, width: weapon.width, height: 16, speed: weapon.speed, frag: true });
  } else {
    state.shots.push({ x: cx - 3, y: baseY, width: weapon.width, height: 18, speed: weapon.speed });
  }
  
  if (player.cloneTime > performance.now()) {
    state.shots.push({ x: cx - 40, y: baseY + 10, width: weapon.width, height: 16, speed: weapon.speed });
    state.shots.push({ x: cx + 40, y: baseY + 10, width: weapon.width, height: 16, speed: weapon.speed });
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
  const completedWave = state.wave;
  state.wave += 1;
  state.shots = [];
  state.enemyShots = [];
  state.running = false;
  showWaveComplete(completedWave);
}

function showWaveComplete(wave) {
  const bonus = wave * 100;
  state.score += bonus;
  
  if (state.highScore === undefined || state.score > state.highScore) {
    state.highScore = state.score;
  }
  
  const nextWave = wave + 1;
  let msg = `Score: ${state.score}\nRecord: ${state.highScore}\n\n`;
  msg += `Vague ${nextWave} : En approche...\nFormat Classique 11x5`;
  
  state.paused = true;
  state.showingQuestion = false;
  showOverlay(`Vague ${wave} terminée ! +${bonus} pts`, msg, "Continuer");
}

function levelCompleteContinue() {
  hideOverlay();
  
  state.running = true;
  state.paused = false;
  state.lastFrame = performance.now();
  state.shots = [];
  state.powerups = [];
  state.showingQuestion = false;
  
  state.boss = null;
  if (state.wave % 5 === 0) {
    enemies = [];
    state.boss = {
      name: "Dreadnought Alien",
      x: canvas.width / 2 - 80,
      y: 40,
      width: 160,
      height: 120,
      health: 80 + (state.wave * 10),
      maxHealth: 80 + (state.wave * 10),
      speed: 120 + (state.wave * 5),
      direction: 1,
      phase: 1,
      fireChance: 0.02 + (state.wave * 0.002)
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
  syncUi();
}

function updateStars(delta) {
  const dt = delta / 1000;

  state.stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > canvas.height) {
      star.y = -star.size;
      star.x = Math.random() * canvas.width;
    }
  });
}

function updatePlayer(delta, timestamp) {
  const dt = delta / 1000;
  const movingLeft = keys.has("ArrowLeft") || keys.has("a") || keys.has("A");
  const movingRight = keys.has("ArrowRight") || keys.has("d") || keys.has("D");
  const movingUp = keys.has("ArrowUp") || keys.has("w") || keys.has("W");
  const movingDown = keys.has("ArrowDown") || keys.has("s") || keys.has("S");

  if (movingLeft) {
    player.x -= player.speed * dt;
  }
  if (movingRight) {
    player.x += player.speed * dt;
  }
  if (movingUp) {
    player.y -= player.speed * dt;
  }
  if (movingDown) {
    player.y += player.speed * dt;
  }
  player.x = Math.max(16, Math.min(canvas.width - player.width - 16, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height - 16, player.y));

  if (keys.has(" ") || keys.has("Spacebar")) {
    firePlayerShot(timestamp);
  }
}

function updateProjectiles(delta) {
  const dt = delta / 1000;

  state.shots = state.shots.filter((shot) => {
    shot.y -= shot.speed * dt;
    if (shot.vx) {
      shot.x += shot.vx * dt;
    }
    return shot.y + shot.height > 0 && shot.x > 0 && shot.x < canvas.width;
  });

  state.enemyShots = state.enemyShots.filter((shot) => {
    shot.y += shot.speed * dt;
    return shot.y < canvas.height + shot.height;
  });
}

function updateBoss(delta) {
  const dt = delta / 1000;
  const boss = state.boss;

  if (boss.health <= boss.maxHealth * 0.5 && boss.phase === 1) {
    boss.phase = 2;
    boss.speed = 180;
    boss.fireChance = 0.035;
    addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, "#ff6474");
  }

  if (boss.health <= boss.maxHealth * 0.2 && boss.phase === 2) {
    boss.phase = 3;
    boss.speed = 240;
    boss.fireChance = 0.05;
    boss.sideAttack = true;
    addExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, "#ffb84d");
  }

  if (boss.phase >= 2) {
    boss.y += Math.sin(performance.now() * 0.003) * 30 * dt;
  }

  boss.x += boss.direction * boss.speed * dt;
  if (boss.x <= 40 || boss.x + boss.width >= canvas.width - 40) {
    boss.direction *= -1;
  }

  if (Math.random() < boss.fireChance) {
    fireEnemyShot(boss.x + boss.width / 2, boss.y + boss.height - 10, 320, true);
    if (boss.sideAttack) {
      if (boss.x + boss.width / 2 < canvas.width / 2) {
        fireEnemyShot(boss.x + boss.width - 15, boss.y + boss.height * 0.6, 280, true);
      } else {
        fireEnemyShot(boss.x + 15, boss.y + boss.height * 0.6, 280, true);
      }
    }
  }
}

function updateEnemies(delta) {
  const dt = delta / 1000;
  let shouldDrop = false;
  let lowestEnemyY = 0;

  enemies.forEach((enemy) => {
    if (enemy.freeRoaming) {
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.vx *= -1;
      }
    } else {
      enemy.x += state.enemyDirection * state.enemySpeed * dt;
    }
    lowestEnemyY = Math.max(lowestEnemyY, enemy.y + enemy.height);
    if (!enemy.freeRoaming && (enemy.x <= 20 || enemy.x + enemy.width >= canvas.width - 20)) {
      shouldDrop = true;
    }

    let fireMult = 1;
    if (selectedDifficulty === "easy") fireMult = 0.5;
    if (selectedDifficulty === "hard") fireMult = 2;

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

  if (lowestEnemyY >= canvas.height - 20 && enemies.length > 0) {
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

function resolveShotCollisions() {
  state.shots.forEach((shot) => {
    if (state.boss && rectsOverlap(shot, state.boss)) {
      shot.hit = true;
      state.boss.health -= 1;
      addExplosion(shot.x, shot.y, "#ffb84d");
      if (state.boss.health <= 0) {
        state.score += 500;
        addExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#4df2c2");
        state.boss = null;
        advanceWave();
      }
    }

    enemies.forEach((enemy) => {
      if (!shot.hit && rectsOverlap(shot, enemy)) {
        shot.hit = true;
        
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
            state.boss.health -= 10;
            addExplosion(expCenterX, expCenterY, weaponColor);
            if (state.boss.health <= 0) {
              state.score += 500;
              addExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#4df2c2");
              state.boss = null;
              advanceWave();
            }
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
              state.boss.health -= 15;
              addExplosion(expX, expY, weaponColor);
              if (state.boss.health <= 0) {
                state.score += 1500;
                addExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, "#4df2c2");
                state.boss = null;
                advanceWave();
              }
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

        if (enemy.dead && Math.random() < 0.05) {
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

  if (!state.boss && enemies.length === 0) {
    advanceWave();
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
  if (!state.running || state.paused) {
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

  if (state.boss) {
    updateBoss(delta);
  } else if (!updateEnemies(delta)) {
    return;
  }

  updateParticles(delta);
  resolveShotCollisions();
  resolvePowerupCollisions();
  resolvePlayerCollisions(timestamp);
  syncUi();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.stars.forEach((star) => {
    const twinkle = 0.6 + Math.sin(performance.now() * 0.001 * star.twinkleSpeed + star.twinkleOffset) * 0.4;
    ctx.shadowColor = "white";
    ctx.shadowBlur = star.size * 1.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

const waveColors = ["#7af2ff", "#b8ff5e", "#ffb84d", "#ff6474", "#c264ff", "#ffa500"];
const waveBossColors = ["#ffb84d", "#ff6474", "#c264ff", "#ffa500", "#7af2ff", "#b8ff5e"];

function drawSprite(img, entity, fallbackColor, type) {
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
  if (!state.boss) {
    return;
  }

  const boss = state.boss;
  const width = 240;
  const x = canvas.width / 2 - width / 2;
  const y = 24;
  
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(x, y, width, 14);
  
  if (boss.phase === 1) {
    ctx.fillStyle = "#ffb84d";
  } else if (boss.phase === 2) {
    ctx.fillStyle = "#ff6474";
  } else {
    ctx.fillStyle = "#c264ff";
  }
  
  ctx.fillRect(x, y, width * (Math.max(0, boss.health) / boss.maxHealth), 14);
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.strokeRect(x, y, width, 14);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${boss.name.toUpperCase()} - PHASE ${boss.phase}`, x + width / 2, y + 11);
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
    drawSprite(state.images.boss, state.boss, "#ffb84d", "boss");
  }
  drawPowerups();
  drawShots();
  drawParticles();
  drawBossHealth();
}

function loop(timestamp) {
  if (!state.running || state.paused) {
    return;
  }

  let delta = timestamp - state.lastFrame;
  if (delta > 100) {
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

  if (event.key === "p" || event.key === "P" || event.key === "Escape") {
    togglePause();
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
  if (state.paused && !state.running && state.wave > 1) {
    levelCompleteContinue();
    return;
  }
  
  if (!state.running) {
    startGame();
    return;
  }

  if (state.paused) {
    togglePause();
  }
}

ui.startButton.addEventListener("click", handleStartClick);
ui.pauseButton.addEventListener("click", () => {
  if (state.running) {
    togglePause();
  }
});

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

const shipCards = document.querySelectorAll(".ship-card");
shipCards.forEach(card => {
  card.addEventListener("click", () => {
    shipCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedShipId = card.getAttribute("data-ship");
  });
});

const diffBtns = document.querySelectorAll(".diff-btn");
diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    diffBtns.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    selectedDifficulty = btn.getAttribute("data-diff");
  });
});

// Start Audio Context on first interaction
document.body.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

(function init() {
  makeStars();
  resizeCanvas();
  draw();
  bootstrapAssets();
  if (!runSelfChecks()) {
    return;
  }
  showOverlay(
    "Prêt ?",
    "Protège la station Nova !",
    "Démarrer"
  );
  syncUi();
})();
