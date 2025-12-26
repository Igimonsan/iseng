// Particle System
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 150;

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

for (let i = 0; i < particleCount; i++) {
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

// 3D Tilt Effect for Desktop
const profileCard = document.getElementById('profileCard');
const musicCard = document.getElementById('musicCard');

function handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / centerY * 15;
    const rotateY = (x - centerX) / centerX * 25;

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

// Touch Support for Mobile
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

// Music Player Functionality
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

let currentSongIndex = 0;

const playlist = [
    { title: 'Space Odyssey', file: 'Assets/lagu.mp3' },
    { title: 'Acido', file: 'Assets/lagu2.mp3' },
    { title: 'Lunar Waves', file: 'Assets/lagu3.mp3' },
    { title: 'Amor na praia', file: 'Assets/lagu4.mp3' }
];

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function loadSong(index) {
    const song = playlist[index];
    audioPlayer.src = song.file;
    songTitle.textContent = song.title;
    errorMessage.textContent = '';

    audioPlayer.load();
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play().catch(err => {
            console.error('Error playing audio:', err);
            errorMessage.textContent = 'Error: File tidak ditemukan';
        });
        playPauseBtn.textContent = '⏸';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
    }
}

playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasPlaying = !audioPlayer.paused;
    audioPlayer.pause();
    playPauseBtn.textContent = '▶';

    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);

    if (wasPlaying) {
        audioPlayer.play().catch(err => {
            errorMessage.textContent = 'Error: File tidak ditemukan';
            playPauseBtn.textContent = '▶';
        });
    }
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasPlaying = !audioPlayer.paused;
    audioPlayer.pause();
    playPauseBtn.textContent = '▶';

    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);

    if (wasPlaying) {
        audioPlayer.play().catch(err => {
            errorMessage.textContent = 'Error: File tidak ditemukan';
            playPauseBtn.textContent = '▶';
        });
    }
});

progressContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audioPlayer.duration) {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
});

// Audio event listeners
audioPlayer.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    audioPlayer.play().catch(err => {
        errorMessage.textContent = 'Error: File tidak ditemukan';
        playPauseBtn.textContent = '▶';
    });
});

audioPlayer.addEventListener('error', (e) => {
    errorMessage.textContent = 'Error: File tidak ditemukan';
    playPauseBtn.textContent = '▶';
});

audioPlayer.addEventListener('play', () => {
    playPauseBtn.textContent = '⏸';
});

audioPlayer.addEventListener('pause', () => {
    playPauseBtn.textContent = '▶';
});

// Load first song
loadSong(currentSongIndex);

// Companion Script Manager
let activeCompanionScript = null;
let activeButton = null;

const companionButtons = document.querySelectorAll('.companion-btn');

function removeActiveCompanion() {
    // Remove existing companion script
    if (activeCompanionScript) {
        activeCompanionScript.remove();
        activeCompanionScript = null;
    }

    // Remove active class from all buttons
    companionButtons.forEach(btn => btn.classList.remove('active'));
    activeButton = null;

    // Remove any companion elements from DOM
    const companions = document.querySelectorAll('[id^="oneko"], [id^="companion"], [class*="oneko"], [class*="companion"]');
    companions.forEach(el => el.remove());

    // Clear any intervals/timers related to companions
    // This helps prevent lingering animations
    for (let i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
}

function loadCompanionScript(variant, button) {
    // Remove previous companion first
    removeActiveCompanion();

    // Small delay to ensure cleanup is complete
    setTimeout(() => {
        // Create and load new script
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

        // Toggle off if clicking active button
        if (button.classList.contains('active')) {
            removeActiveCompanion();
        } else {
            // Load new companion (will automatically remove previous one)
            loadCompanionScript(variant, button);
        }
    });
});

