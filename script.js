/**
 * Món Quà Tặng Lãng Mạn - Mưa Sao Trái Tim Giữa Màn Hình
 * Phiên bản Đồng Bộ Server: Lưu Trực Tiếp Lên Server, Link Ngắn Gọn Tuyệt Đối Không Bị Thiếu Chữ Trên Ngrok
 */

(function () {
  'use strict';

  // --- Các Mẫu Quà Tặng Có Sẵn (Presets) ---
  const PRESETS = {
    crush: {
      recipient: 'Em Yêu ♥',
      subtitle: 'Mỗi hạt sáng rơi xuống là một lời yêu thương gửi tới em',
      characters: '♥',
      letterTitle: 'Gửi Em, Điều Tuyệt Vời Nhất! ✨',
      letterBody: `Cảm ơn vì đã xuất hiện và làm cho mỗi ngày trôi qua đều ngập tràn ấm áp và nụ cười. 
Giữa hàng tỉ người trên hành tinh này, được gặp và đồng hành cùng em là điều may mắn nhất.

Mong rằng trái tim nhỏ lấp lánh này sẽ mang lại cho em một ngày thật vui vẻ, bình yên và luôn nở nụ cười trên môi.
Yêu em nhiều hơn cả những vì sao trên bầu trời! 🌸💖`,
      sender: 'From Me With All My Heart ♥',
      theme: 'rosePink',
      particleCount: 520,
      speed: 1.0
    },
    mom: {
      recipient: 'Mẹ hoa yêu quý hehe',
      subtitle: 'Mỗi hạt sáng rơi xuống là lời chúc sức khỏe và bình an con gửi đến Má ♥',
      characters: '♥',
      letterTitle: 'Gửi Mẹ hoa yêu quý hehe! ✨',
      letterBody: 'chúc má một ngày 20/10 vui vẻ mạnh khỏe và ngày càng xinh đẹp ạ,càng giàu nữa để trợ cấp con nhiều tiền :)',
      sender: 'Lucas của má',
      theme: 'goldenWarm',
      particleCount: 520,
      speed: 1.0
    },
    sister: {
      recipient: 'Cô Em Gái Nhỏ Bé 🎀',
      subtitle: 'Chúc em gái luôn luôn rạng rỡ, xinh đẹp và học tập thật tốt',
      characters: '♥',
      letterTitle: 'Gửi Cô Em Gái Đáng Yêu! 🎀',
      letterBody: `Chúc em gái nhỏ của anh/chị luôn luôn vui vẻ, học tập thật giỏi, ngày càng xinh đẹp và luôn giữ nụ cười rạng rỡ trên môi nhé!

Dù có bất cứ chuyện gì xảy ra thì anh/chị vẫn luôn ở bên ủng hộ em. Món quà trái tim nhỏ này gửi tặng riêng cho em đấy! 🌸✨`,
      sender: 'Anh/Chị Của Em ♥',
      theme: 'violetSoft',
      particleCount: 520,
      speed: 1.0
    }
  };

  // --- Bảng Màu Thuần Khiết ---
  const THEMES = {
    rosePink: {
      name: 'Hồng Đỏ Lãng Mạn',
      primary: '#ff2d65',
      accent: '#ff5c8a',
      trailBg: 'rgba(7, 7, 14, 0.28)'
    },
    goldenWarm: {
      name: 'Vàng Ấm Hoàng Kim',
      primary: '#ffb703',
      accent: '#f5a623',
      trailBg: 'rgba(10, 8, 6, 0.28)'
    },
    cyanCalm: {
      name: 'Xanh Lam Dịu Mắt',
      primary: '#00d2ff',
      accent: '#6be3ff',
      trailBg: 'rgba(5, 9, 15, 0.28)'
    },
    violetSoft: {
      name: 'Tím Oải Hương Nhẹ Nhàng',
      primary: '#c084fc',
      accent: '#e9d5ff',
      trailBg: 'rgba(9, 7, 16, 0.28)'
    }
  };

  // Mẫu đang hoạt động (mặc định là mom)
  let activePreset = 'mom';

  // Cấu hình ban đầu
  let currentConfig = { ...PRESETS.mom };

  // --- Quyền Admin: Chỉ người dùng trên localhost hoặc có token ?admin mới được mở bảng chỉnh sửa ---
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminInitial = urlParams.has('admin') || urlParams.has('edit');
  const canAccessAdmin = isLocalhost || isAdminInitial;

  // Link Ngrok được lưu trữ
  let savedNgrokUrl = '';

  // --- Trạng thái Ứng dụng ---
  const state = {
    particleCount: currentConfig.particleCount || 520,
    speedMultiplier: currentConfig.speed || 1.0,
    isExploded: false,
    explodeTimer: 0,
    particles: [],
    ripples: [],
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    heartScale: 16,
    themeKey: currentConfig.theme || 'goldenWarm',
    isMusicPlaying: false,
  };

  // --- Cập nhật Giao diện hiển thị ---
  function updateDisplayTexts() {
    document.getElementById('recipientName').textContent = currentConfig.recipient;
    document.getElementById('giftSubtitle').textContent = currentConfig.subtitle;
    document.getElementById('letterRecipient').textContent = currentConfig.letterTitle;
    document.getElementById('letterMessage').innerHTML = currentConfig.letterBody.replace(/\n/g, '<br>');
    document.getElementById('senderName').textContent = currentConfig.sender;

    document.getElementById('adminRecipientInput').value = currentConfig.recipient;
    document.getElementById('adminSenderInput').value = currentConfig.sender;
    document.getElementById('adminSubtitleInput').value = currentConfig.subtitle;
    document.getElementById('adminCharsInput').value = currentConfig.characters;
    document.getElementById('adminLetterMsgInput').value = currentConfig.letterBody;
    document.getElementById('adminParticleCount').value = state.particleCount;
    document.getElementById('adminParticleCountVal').textContent = state.particleCount;
    document.getElementById('adminFallSpeed').value = state.speedMultiplier;
    document.getElementById('adminFallSpeedVal').textContent = `${state.speedMultiplier}x`;

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === activePreset);
    });

    document.querySelectorAll('.theme-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.theme === state.themeKey);
    });

    updateCleanLinks(savedNgrokUrl);
  }

  // Cập nhật 3 link sạch theo tên miền ngrok hoặc domain hiện tại
  function updateCleanLinks(baseUrl) {
    let cleanBase = (baseUrl || '').trim().replace(/\/+$/, '');
    if (!cleanBase) {
      cleanBase = window.location.origin;
    }
    const meInput = document.getElementById('linkMe');
    const crushInput = document.getElementById('linkCrush');
    const sisterInput = document.getElementById('linkSister');
    const badge = document.getElementById('ngrokStatusBadge');

    if (meInput) meInput.value = `${cleanBase}/me`;
    if (crushInput) crushInput.value = `${cleanBase}/crush`;
    if (sisterInput) sisterInput.value = `${cleanBase}/emgai`;

    if (badge) {
      if (cleanBase.includes('ngrok') || (cleanBase.startsWith('http') && !cleanBase.includes('localhost'))) {
        badge.textContent = 'Đã kết nối';
        badge.classList.add('active');
      } else {
        badge.textContent = 'Chưa điền';
        badge.classList.remove('active');
      }
    }
  }

  // Lưu trực tiếp lên config.json trên Server
  async function saveConfigToServer(ngrokUrlToSave) {
    currentConfig.particleCount = state.particleCount;
    currentConfig.speed = state.speedMultiplier;
    currentConfig.theme = state.themeKey;

    const payload = {
      activeProfile: activePreset || 'mom',
      lastNgrokUrl: ngrokUrlToSave !== undefined ? ngrokUrlToSave : savedNgrokUrl,
      profiles: {
        ...PRESETS,
        [activePreset || 'mom']: { ...currentConfig }
      }
    };

    try {
      const res = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // --- Âm thanh Hộp Nhạc ---
  let audioCtx = null;
  let bgmInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCrystalChime() {
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.95);
      });
    } catch (e) {}
  }

  const MUSIC_BOX_NOTES = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46, 493.88, 659.25, 783.99, 659.25];
  let noteIndex = 0;

  function playMusicBoxNote() {
    if (!audioCtx || !state.isMusicPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const freq = MUSIC_BOX_NOTES[noteIndex % MUSIC_BOX_NOTES.length];
      noteIndex++;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {}
  }

  function toggleMusic() {
    initAudio();
    state.isMusicPlaying = !state.isMusicPlaying;
    const btn = document.getElementById('musicToggleBtn');

    if (state.isMusicPlaying) {
      btn.classList.add('playing');
      btn.title = 'Tắt nhạc';
      if (!bgmInterval) bgmInterval = setInterval(playMusicBoxNote, 440);
    } else {
      btn.classList.remove('playing');
      btn.title = 'Bật giai điệu hộp nhạc';
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
    }
  }

  // --- Canvas DOM Elements ---
  const canvas = document.getElementById('matrixHeartCanvas');
  const ctx = canvas.getContext('2d');
  const tapHint = document.getElementById('tapHint');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const closeLetterActionBtn = document.getElementById('closeLetterActionBtn');
  const letterModal = document.getElementById('letterModal');
  const adminPanel = document.getElementById('adminPanel');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const saveLocalBtn = document.getElementById('saveLocalBtn');
  const testExplodeBtn = document.getElementById('testExplodeBtn');
  const copyAlert = document.getElementById('copyAlert');
  const secretAdminTrigger = document.getElementById('secretAdminTrigger');

  // --- TẠO ĐIỂM HÌNH TRÁI TIM ĐỀU ĐẶN TUYỆT ĐỐI ---
  const HEART_SAMPLES = 600;
  const heartPoly = [];
  const heartLengths = [0];
  let heartTotalLen = 0;

  for (let i = 0; i <= HEART_SAMPLES; i++) {
    const t = (i / HEART_SAMPLES) * Math.PI * 2;
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const x = 16 * Math.pow(sinT, 3);
    const y = -(13 * cosT - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    heartPoly.push({ x, y });
    if (i > 0) {
      const dx = x - heartPoly[i - 1].x;
      const dy = y - heartPoly[i - 1].y;
      heartTotalLen += Math.hypot(dx, dy);
      heartLengths.push(heartTotalLen);
    }
  }

  function getBorderPoint(fraction) {
    const targetDist = fraction * heartTotalLen;
    let low = 0, high = heartLengths.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (heartLengths[mid] < targetDist) low = mid + 1;
      else high = mid - 1;
    }
    const idx = Math.max(1, Math.min(low, heartLengths.length - 1));
    const segLen = heartLengths[idx] - heartLengths[idx - 1];
    const tSeg = segLen > 0 ? (targetDist - heartLengths[idx - 1]) / segLen : 0;
    const p0 = heartPoly[idx - 1];
    const p1 = heartPoly[idx];
    return {
      x: p0.x + (p1.x - p0.x) * tSeg,
      y: p0.y + (p1.y - p0.y) * tSeg
    };
  }

  function isInsideHeart(x, y) {
    let inside = false;
    for (let i = 0, j = heartPoly.length - 1; i < heartPoly.length; j = i++) {
      const xi = heartPoly[i].x, yi = heartPoly[i].y;
      const xj = heartPoly[j].x, yj = heartPoly[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function getRandomInsidePoint() {
    let attempts = 0;
    while (attempts < 120) {
      attempts++;
      const x = Math.random() * 31 - 15.5;
      const y = Math.random() * 28 - 11.5;
      if (isInsideHeart(x, y)) {
        return { x, y };
      }
    }
    return { x: 0, y: 2.5 };
  }

  // --- Lớp Hạt Ký Tự ---
  class Particle {
    constructor(isHeartParticle = true, charIndex = 0, baseX = 0, baseY = 0) {
      this.isHeartParticle = isHeartParticle;
      this.charIndex = charIndex;
      this.baseX = baseX;
      this.baseY = baseY;
      this.reset(true);
    }

    reset(initial = false) {
      const cleanChars = (currentConfig.characters || '♥').replace(/\s+/g, '');
      this.char = cleanChars.length > 0 ? cleanChars[this.charIndex % cleanChars.length] : '♥';

      this.size = 15;
      this.alpha = this.isHeartParticle ? 0.98 : 0.65;

      if (initial) {
        this.x = Math.random() * state.width;
        this.y = -20 - Math.random() * (state.height * 0.9);
      } else {
        this.x = Math.random() * state.width;
        this.y = -20 - Math.random() * 60;
      }

      this.vx = 0;
      this.vy = (2.0 + Math.random() * 2.5) * state.speedMultiplier;
      this.targetX = state.centerX;
      this.targetY = state.centerY;
      this.state = 'falling';
      this.attractionStrength = 0.035;
      this.friction = 0.86;
    }

    update(pulseScale) {
      const currentTheme = THEMES[state.themeKey] || THEMES.goldenWarm;
      this.color = this.isHeartParticle ? currentTheme.primary : currentTheme.accent;

      if (this.isHeartParticle) {
        this.targetX = state.centerX + this.baseX * state.heartScale * pulseScale;
        this.targetY = state.centerY + this.baseY * state.heartScale * pulseScale;
      }

      if (state.isExploded) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.015;
        this.vy += dy * 0.015;
      } else {
        if (this.state === 'falling') {
          this.y += this.vy;

          const distToTarget = Math.hypot(this.x - this.targetX, this.y - this.targetY);

          if (this.isHeartParticle && (this.y >= this.targetY - 30 || distToTarget < 120)) {
            this.state = 'settled';
          }

          if (this.y > state.height + 30) {
            this.reset(false);
          }
        } else if (this.state === 'settled') {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;

          this.vx = (this.vx + dx * this.attractionStrength) * this.friction;
          this.vy = (this.vy + dy * this.attractionStrength) * this.friction;

          this.x += this.vx;
          this.y += this.vy;
        }
      }
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fillText(this.char, this.x, this.y);
    }

    explode(originX, originY) {
      this.state = 'settled';
      const dx = this.x - originX;
      const dy = this.y - originY;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
      const force = 10 + Math.random() * 18;

      this.vx = Math.cos(angle) * force;
      this.vy = Math.sin(angle) * force;
    }
  }

  // --- Sóng Kích Hoạt ---
  class ClickRipple {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 6;
      this.maxRadius = Math.min(state.width, state.height) * 0.35;
      this.alpha = 0.8;
    }

    update() {
      this.radius += (this.maxRadius - this.radius) * 0.12;
      this.alpha *= 0.92;
    }

    draw(ctx) {
      if (this.alpha <= 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = this.alpha;
      ctx.stroke();
    }

    isDone() {
      return this.alpha <= 0.01;
    }
  }

  function initParticles() {
    state.particles = [];
    const count = state.particleCount;
    const heartCount = Math.floor(count * 0.86);
    const rainCount = count - heartCount;

    const borderCount = Math.floor(heartCount * 0.25);
    const fillCount = heartCount - borderCount;

    for (let i = 0; i < borderCount; i++) {
      const pt = getBorderPoint(i / borderCount);
      state.particles.push(new Particle(true, i, pt.x, pt.y));
    }
    for (let i = 0; i < fillCount; i++) {
      const pt = getRandomInsidePoint();
      state.particles.push(new Particle(true, borderCount + i, pt.x, pt.y));
    }
    for (let i = 0; i < rainCount; i++) {
      state.particles.push(new Particle(false, i, 0, 0));
    }
  }

  function handleResize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.centerX = state.width / 2;
    state.centerY = state.height / 2;

    const minDim = Math.min(state.width, state.height);
    state.heartScale = Math.max(9, Math.min(minDim / 38, 20));

    canvas.width = state.width * state.dpr;
    canvas.height = state.height * state.dpr;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.scale(state.dpr, state.dpr);
  }

  function triggerExplosion(originX = state.centerX, originY = state.centerY) {
    state.isExploded = true;
    state.explodeTimer = 85;

    playCrystalChime();

    const theme = THEMES[state.themeKey] || THEMES.goldenWarm;
    state.ripples.push(new ClickRipple(originX, originY, theme.primary));

    for (let i = 0; i < state.particles.length; i++) {
      state.particles[i].explode(originX, originY);
    }

    if (tapHint && !tapHint.classList.contains('hidden')) {
      tapHint.classList.add('hidden');
    }
  }

  function animate(timestamp) {
    requestAnimationFrame(animate);

    const time = timestamp * 0.0015;

    const currentTheme = THEMES[state.themeKey] || THEMES.goldenWarm;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = currentTheme.trailBg;
    ctx.fillRect(0, 0, state.width, state.height);

    const pulseScale = 1.0 + Math.sin(time * 2.0) * 0.03;

    if (state.isExploded) {
      state.explodeTimer--;
      if (state.explodeTimer <= 0) state.isExploded = false;
    }

    for (let i = state.ripples.length - 1; i >= 0; i--) {
      const ripple = state.ripples[i];
      ripple.update();
      ripple.draw(ctx);
      if (ripple.isDone()) state.ripples.splice(i, 1);
    }

    ctx.font = '15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const particles = state.particles;
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(pulseScale);
      particles[i].draw(ctx);
    }
  }

  function openAdminPanel() {
    adminPanel.classList.remove('hidden');
  }

  function closeAdminPanel() {
    adminPanel.classList.add('hidden');
  }

  // --- Lắng nghe Sự kiện Tương tác ---
  function setupEventListeners() {
    window.addEventListener('resize', handleResize);

    canvas.addEventListener('pointerdown', (e) => {
      if (letterModal.classList.contains('open')) return;
      if (!adminPanel.classList.contains('hidden') && adminPanel.contains(e.target)) return;
      initAudio();
      triggerExplosion(e.clientX, e.clientY);
    });

    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });

    openLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      letterModal.classList.add('open');
      letterModal.setAttribute('aria-hidden', 'false');
    });

    function closeLetter() {
      letterModal.classList.remove('open');
      letterModal.setAttribute('aria-hidden', 'true');
    }
    closeLetterBtn.addEventListener('click', closeLetter);
    closeLetterActionBtn.addEventListener('click', closeLetter);
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetter();
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'a' || e.key === 'A' || e.key === 's' || e.key === 'S') {
        if (adminPanel.classList.contains('hidden')) {
          openAdminPanel();
        } else {
          closeAdminPanel();
        }
      }
    });

    let secretClicks = 0;
    let secretTimer = null;
    secretAdminTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      secretClicks++;
      clearTimeout(secretTimer);
      if (secretClicks >= 3) {
        secretClicks = 0;
        openAdminPanel();
      } else {
        secretTimer = setTimeout(() => { secretClicks = 0; }, 1200);
      }
    });

    closeAdminBtn.addEventListener('click', closeAdminPanel);

    // Nút chọn nhanh (Preset Buttons)
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        activePreset = presetKey;

        if (PRESETS[presetKey]) {
          const p = PRESETS[presetKey];
          currentConfig = { ...p };
          state.themeKey = p.theme;
          state.particleCount = p.particleCount || 520;
          state.speedMultiplier = p.speed || 1.0;

          updateDisplayTexts();

          const cleanChars = currentConfig.characters.replace(/\s+/g, '');
          const currentTheme = THEMES[state.themeKey] || THEMES.goldenWarm;
          state.particles.forEach((pt, idx) => {
            pt.char = cleanChars[idx % cleanChars.length] || '♥';
            pt.color = pt.isHeartParticle ? currentTheme.primary : currentTheme.accent;
          });
        }
      });
    });

    // Form inputs
    const recipientInput = document.getElementById('adminRecipientInput');
    const senderInput = document.getElementById('adminSenderInput');
    const subtitleInput = document.getElementById('adminSubtitleInput');
    const charsInput = document.getElementById('adminCharsInput');
    const letterMsgInput = document.getElementById('adminLetterMsgInput');
    const particleCountInput = document.getElementById('adminParticleCount');
    const fallSpeedInput = document.getElementById('adminFallSpeed');

    recipientInput.addEventListener('input', (e) => {
      currentConfig.recipient = e.target.value.trim() || 'Người Đặc Biệt';
      document.getElementById('recipientName').textContent = currentConfig.recipient;
      document.getElementById('letterRecipient').textContent = `Gửi ${currentConfig.recipient} ✨`;
    });

    senderInput.addEventListener('input', (e) => {
      currentConfig.sender = e.target.value.trim() || 'From Me With Love ♥';
      document.getElementById('senderName').textContent = currentConfig.sender;
    });

    subtitleInput.addEventListener('input', (e) => {
      currentConfig.subtitle = e.target.value.trim() || '';
      document.getElementById('giftSubtitle').textContent = currentConfig.subtitle;
    });

    charsInput.addEventListener('input', (e) => {
      currentConfig.characters = e.target.value.trim() || '♥';
      const cleanChars = currentConfig.characters.replace(/\s+/g, '');
      state.particles.forEach((p, idx) => {
        p.char = cleanChars[idx % cleanChars.length] || '♥';
      });
    });

    letterMsgInput.addEventListener('input', (e) => {
      currentConfig.letterBody = e.target.value;
      document.getElementById('letterMessage').innerHTML = currentConfig.letterBody.replace(/\n/g, '<br>');
    });

    particleCountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      document.getElementById('adminParticleCountVal').textContent = val;
      state.particleCount = val;
      initParticles();
    });

    fallSpeedInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      document.getElementById('adminFallSpeedVal').textContent = `${val.toFixed(1)}x`;
      state.speedMultiplier = val;
      state.particles.forEach(p => {
        p.vy = (2.0 + Math.random() * 2.5) * state.speedMultiplier;
      });
    });

    document.querySelectorAll('.theme-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.theme-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.themeKey = pill.dataset.theme;
        currentConfig.theme = state.themeKey;

        const currentTheme = THEMES[state.themeKey];
        state.particles.forEach(p => {
          p.color = p.isHeartParticle ? currentTheme.primary : currentTheme.accent;
        });
      });
    });

    testExplodeBtn.addEventListener('click', () => {
      triggerExplosion(state.centerX, state.centerY);
    });

    // Guard bảo vệ Admin: Nếu người xem ngoài mở link mà không có quyền thì giấu nút và chặn phím
    if (!canAccessAdmin && secretAdminTrigger) {
      secretAdminTrigger.style.display = 'none';
    }

    // Xử lý Hộp điền link Ngrok và Tự động Lưu
    const ngrokUrlInput = document.getElementById('ngrokUrlInput');
    const applyNgrokBtn = document.getElementById('applyNgrokBtn');

    async function handleNgrokSave() {
      const val = (ngrokUrlInput ? ngrokUrlInput.value : '').trim().replace(/\/+$/, '');
      if (val) {
        savedNgrokUrl = val;
      }
      updateCleanLinks(savedNgrokUrl);
      const success = await saveConfigToServer(savedNgrokUrl);

      if (copyAlert) {
        copyAlert.innerHTML = success 
          ? '🎉 <b>Đã lưu lên Server thành công!</b><br>3 link sạch bên dưới đã sẵn sàng, bấm "Sao chép" để gửi ngay!'
          : '⚠️ Không thể lưu cấu hình, vui lòng đảm bảo server đang chạy!';
        copyAlert.classList.remove('hidden');
        setTimeout(() => copyAlert.classList.add('hidden'), 5000);
      }
    }

    if (applyNgrokBtn) {
      applyNgrokBtn.addEventListener('click', handleNgrokSave);
    }

    if (ngrokUrlInput) {
      if (savedNgrokUrl) {
        ngrokUrlInput.value = savedNgrokUrl;
      }
      updateCleanLinks(savedNgrokUrl);

      // Cập nhật 3 link sạch ngay lập tức khi người dùng vừa gõ hoặc dán
      ngrokUrlInput.addEventListener('input', () => {
        const val = ngrokUrlInput.value.trim().replace(/\/+$/, '');
        if (val) {
          savedNgrokUrl = val;
          updateCleanLinks(val);
        }
      });

      ngrokUrlInput.addEventListener('change', handleNgrokSave);
      ngrokUrlInput.addEventListener('paste', () => {
        setTimeout(() => {
          const val = ngrokUrlInput.value.trim().replace(/\/+$/, '');
          if (val) {
            savedNgrokUrl = val;
            updateCleanLinks(val);
          }
          handleNgrokSave();
        }, 100);
      });
    }

    // Sao chép từng link sạch (Gửi Má / Crush / Em gái)
    document.querySelectorAll('.btn-copy-clean').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const targetInput = document.getElementById(targetId);
        if (targetInput && targetInput.value) {
          navigator.clipboard.writeText(targetInput.value).then(() => {
            const oldText = btn.textContent;
            btn.textContent = '✓ Đã chép!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = oldText;
              btn.classList.remove('copied');
            }, 2000);
          }).catch(() => {
            window.prompt('Sao chép đường link bên dưới:', targetInput.value);
          });
        }
      });
    });

    // LƯU CẤU HÌNH HIỆN TẠI LÊN SERVER
    saveLocalBtn.addEventListener('click', async () => {
      const success = await saveConfigToServer(savedNgrokUrl);
      if (copyAlert) {
        copyAlert.innerHTML = success
          ? '💾 <b>Đã lưu thành công lên Server!</b><br>Người xem mở qua ngrok sẽ thấy đúng 100% nội dung này!'
          : '💾 Đã lưu cấu hình!';
        copyAlert.classList.remove('hidden');
        setTimeout(() => copyAlert.classList.add('hidden'), 4500);
      }
    });

    setTimeout(() => {
      if (tapHint && !tapHint.classList.contains('hidden')) {
        tapHint.classList.add('hidden');
      }
    }, 8000);
  }

  // --- Tải cấu hình từ Server (Đảm bảo người ngoài mở link ngrok xem được 100%) ---
  async function loadConfigAndStart() {
    const rawPath = window.location.pathname.toLowerCase();
    const path = rawPath.replace(/\/+$/, '');
    const params = new URLSearchParams(window.location.search);
    const forParam = (params.get('for') || '').toLowerCase();

    let loadedConfig = null;
    let loadedPreset = null;

    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.profiles) {
          if (serverData.lastNgrokUrl) {
            savedNgrokUrl = serverData.lastNgrokUrl;
          }
          if (path === '/me' || path.endsWith('/me') || forParam === 'me' || forParam === 'mom') {
            loadedPreset = 'mom';
            loadedConfig = serverData.profiles.mom;
          } else if (path === '/crush' || path.endsWith('/crush') || forParam === 'crush') {
            loadedPreset = 'crush';
            loadedConfig = serverData.profiles.crush;
          } else if (path === '/emgai' || path.endsWith('/emgai') || forParam === 'emgai' || forParam === 'sister') {
            loadedPreset = 'sister';
            loadedConfig = serverData.profiles.sister;
          } else if (serverData.activeProfile && serverData.profiles[serverData.activeProfile]) {
            loadedPreset = serverData.activeProfile;
            loadedConfig = serverData.profiles[serverData.activeProfile];
          }
        }
      }
      // Tự động phát hiện nếu ngrok đang chạy
      if (!savedNgrokUrl) {
        try {
          const nRes = await fetch('/api/detect-ngrok');
          if (nRes.ok) {
            const nData = await nRes.json();
            if (nData.success && nData.url) {
              savedNgrokUrl = nData.url;
            }
          }
        } catch (ne) {}
      }
    } catch (e) {
      // Offline hoặc chạy static
    }

    if (!loadedConfig) {
      if (path === '/me' || path.endsWith('/me') || forParam === 'me' || forParam === 'mom') {
        loadedPreset = 'mom';
        loadedConfig = PRESETS.mom;
      } else if (path === '/crush' || path.endsWith('/crush') || forParam === 'crush') {
        loadedPreset = 'crush';
        loadedConfig = PRESETS.crush;
      } else if (path === '/emgai' || path.endsWith('/emgai') || forParam === 'emgai' || forParam === 'sister') {
        loadedPreset = 'sister';
        loadedConfig = PRESETS.sister;
      } else {
        loadedPreset = 'mom';
        loadedConfig = PRESETS.mom;
      }
    }

    activePreset = loadedPreset || 'mom';
    currentConfig = { ...loadedConfig };

    state.themeKey = currentConfig.theme || 'goldenWarm';
    state.particleCount = currentConfig.particleCount || 520;
    state.speedMultiplier = currentConfig.speed || 1.0;

    updateDisplayTexts();
    handleResize();
    initParticles();
    setupEventListeners();

    if (isAdminInitial) {
      openAdminPanel();
    }

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfigAndStart);
  } else {
    loadConfigAndStart();
  }
})();
