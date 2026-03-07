// ============================================================
// CANVAS PARTICLE ANIMATION
// ============================================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 150;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.4 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// ============================================================
// PROFILE IMAGE CYCLING
// ============================================================

const profileImage = document.getElementById('profileImage');
const profileImageContainer = document.getElementById('profileImageContainer');

let currentProfileIndex = 1;
const TOTAL_PROFILE_IMAGES = 10;

profileImageContainer.style.cursor = 'pointer';

profileImageContainer.addEventListener('click', (e) => {
  e.stopPropagation();

  currentProfileIndex++;
  if (currentProfileIndex > TOTAL_PROFILE_IMAGES) {
    currentProfileIndex = 1;
  }

  profileImage.style.opacity = '0';

  setTimeout(() => {
    profileImage.src = `Assets/Profile Image/profile${currentProfileIndex}.jpeg`;
    profileImage.style.opacity = '1';
  }, 200);
});


// ============================================================
// CARD 3D TILT (MOUSE & TOUCH)
// ============================================================

const profileCard = document.getElementById('profileCard');
const musicCard = document.getElementById('musicCard');

function handleMouseMove(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 15;
  const rotateY = ((x - centerX) / centerX) * 25;

  card.querySelector('.flip-card-inner').style.transform =
    `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave(card) {
  card.querySelector('.flip-card-inner').style.transform =
    'rotateX(0deg) rotateY(0deg)';
}

profileCard.addEventListener('mousemove', (e) => handleMouseMove(e, profileCard));
profileCard.addEventListener('mouseleave', () => handleMouseLeave(profileCard));
musicCard.addEventListener('mousemove', (e) => handleMouseMove(e, musicCard));
musicCard.addEventListener('mouseleave', () => handleMouseLeave(musicCard));

// Touch tilt
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e, card) {
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const diffX = (touchX - touchStartX) / 10;
  const diffY = (touchY - touchStartY) / 10;

  card.querySelector('.flip-card-inner').style.transform =
    `rotateX(${-diffY}deg) rotateY(${diffX}deg)`;
}

function handleTouchEnd(card) {
  card.querySelector('.flip-card-inner').style.transform =
    'rotateX(0deg) rotateY(0deg)';
}

profileCard.addEventListener('touchstart', handleTouchStart);
profileCard.addEventListener('touchmove', (e) => handleTouchMove(e, profileCard));
profileCard.addEventListener('touchend', () => handleTouchEnd(profileCard));

musicCard.addEventListener('touchstart', handleTouchStart);
musicCard.addEventListener('touchmove', (e) => handleTouchMove(e, musicCard));
musicCard.addEventListener('touchend', () => handleTouchEnd(musicCard));


// ============================================================
// AUDIO PLAYER
// ============================================================

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const errorMessage = document.getElementById('errorMessage');
const playlistMenuBtn = document.getElementById('playlistMenuBtn');
const playlistDropdown = document.getElementById('playlistDropdown');
const playlistItems = document.getElementById('playlistItems');

let currentSongIndex = 0;
let isPlaylistEnabled = false;

const playlist = [
  { title: 'Dj Sirih Kasih',      file: 'Assets/Music/sirihkasih.mp3' },
  { title: 'Dj Bahtera Mahligai', file: 'Assets/Music/mahligai.mp3'   },
  { title: 'Gatau Apa',           file: 'Assets/Music/gatau.mp3'      },
  { title: 'Gatau Apa(2)',           file: 'Assets/Music/gatau_2.mp3'      },
];

// --- Helpers ---

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function setPlayIcon() { playPauseBtn.textContent = '▶'; }
function setPauseIcon() { playPauseBtn.textContent = '⏸'; }

// --- Playlist UI ---

function generatePlaylistItems() {
  playlistItems.innerHTML = '';

  playlist.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (index === currentSongIndex) item.classList.add('active');
    item.textContent = song.title;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      loadAndPlaySong(index);
      togglePlaylistMenu();
    });

    playlistItems.appendChild(item);
  });
}

function togglePlaylistMenu() {
  if (!isPlaylistEnabled) return;
  playlistDropdown.classList.toggle('show');
  playlistMenuBtn.classList.toggle('active');
}

function enablePlaylistMenu() {
  isPlaylistEnabled = true;
  playlistMenuBtn.classList.add('enabled');
}

function disablePlaylistMenu() {
  isPlaylistEnabled = false;
  playlistMenuBtn.classList.remove('enabled');
  playlistDropdown.classList.remove('show');
  playlistMenuBtn.classList.remove('active');
}

playlistMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isPlaylistEnabled) togglePlaylistMenu();
});

document.addEventListener('click', (e) => {
  if (
    !playlistDropdown.contains(e.target) &&
    !playlistMenuBtn.contains(e.target)
  ) {
    playlistDropdown.classList.remove('show');
    playlistMenuBtn.classList.remove('active');
  }
});

// --- Song Loading & Playback ---

function loadSong(index) {
  const song = playlist[index];
  audioPlayer.src = song.file;
  songTitle.textContent = song.title;
  errorMessage.textContent = '';
  audioPlayer.load();

  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function loadAndPlaySong(index) {
  const wasPlaying = !audioPlayer.paused;
  audioPlayer.pause();
  setPlayIcon();

  currentSongIndex = index;
  loadSong(currentSongIndex);

  if (wasPlaying) {
    audioPlayer.play().catch(() => {
      errorMessage.textContent = 'Error: File tidak ditemukan';
      setPlayIcon();
    });
  }
}

function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play().catch(err => {
      console.error('Error playing audio:', err);
      errorMessage.textContent = 'Error: File tidak ditemukan';
    });
  } else {
    audioPlayer.pause();
  }
}

function navigateSong(direction) {
  const wasPlaying = !audioPlayer.paused;
  audioPlayer.pause();
  setPlayIcon();

  currentSongIndex =
    (currentSongIndex + direction + playlist.length) % playlist.length;
  loadSong(currentSongIndex);

  if (wasPlaying) {
    audioPlayer.play().catch(() => {
      errorMessage.textContent = 'Error: File tidak ditemukan';
      setPlayIcon();
    });
  }
}

// --- Player Event Listeners ---

playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateSong(-1); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateSong(1); });

progressContainer.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!audioPlayer.duration) return;
  const rect = progressContainer.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;
});

audioPlayer.addEventListener('loadedmetadata', () => {
  durationDisplay.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
  if (!audioPlayer.duration) return;
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  audioPlayer.play().catch(() => {
    errorMessage.textContent = 'Error: File tidak ditemukan';
    setPlayIcon();
  });
});

audioPlayer.addEventListener('error', () => {
  errorMessage.textContent = 'Error: File tidak ditemukan';
  setPlayIcon();
});

audioPlayer.addEventListener('play', setPauseIcon);
audioPlayer.addEventListener('pause', setPlayIcon);

// Init
generatePlaylistItems();
loadSong(currentSongIndex);


// ============================================================
// COMPANION SCRIPTS
// ============================================================

let activeCompanionScript = null;
let activeButton = null;

const companionButtons = document.querySelectorAll('.companion-btn');

function removeActiveCompanion() {
  if (activeCompanionScript) {
    activeCompanionScript.remove();
    activeCompanionScript = null;
  }

  companionButtons.forEach(btn => btn.classList.remove('active'));
  activeButton = null;

  // Remove any companion elements from DOM
  const companions = document.querySelectorAll(
    '[id^="oneko"], [id^="companion"], [class*="oneko"], [class*="companion"]'
  );
  companions.forEach(el => el.remove());

  // Clear all intervals
  for (let i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }
}

function loadCompanionScript(variant, button) {
  removeActiveCompanion();

  setTimeout(() => {
    const script = document.createElement('script');
    script.id = 'active-companion-script';

    if (variant === 'oneko') {
      script.src = './oneko.js';
    } else {
      script.src = './companion.js';
      script.setAttribute('data-variant', variant);
      script.setAttribute('data-persist-position', 'true');
    }

    script.onload = () => {
      console.log(`Loaded companion: ${variant}`);
      enablePlaylistMenu();
    };

    script.onerror = () => {
      console.error(`Failed to load companion: ${variant}`);
      button.classList.remove('active');
    };

    document.body.appendChild(script);
    activeCompanionScript = script;
    activeButton = button;
    button.classList.add('active');
  }, 100);
}

companionButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const variant = button.getAttribute('data-companion');

    if (button.classList.contains('active')) {
      removeActiveCompanion();
      disablePlaylistMenu();
    } else {
      loadCompanionScript(variant, button);
    }
  });
});