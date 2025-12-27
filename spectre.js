class AudioSpectrum {
    constructor(audioElement) {
        this.audio = audioElement;
        this.canvas = null;
        this.canvasCtx = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.source = null;
        this.animationId = null;
        this.isInitialized = false;

        // Visual settings
        this.barWidth = 1.8;
        this.barGap = 0.8;
        this.barCount = 120;
        this.smoothing = 0.8;

        // Color theme (space theme)
        this.colors = {
            primary: '#00f3ff',
            secondary: '#ff00ff',
            tertiary: '#ffff00'
        };
    }

    init() {
        if (this.isInitialized) return;

        // Find existing canvas or create new one
        this.canvas = document.getElementById('spectrum-canvas');

        if (!this.canvas) {
            // Create canvas element if not exists
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'spectrum-canvas';
            this.canvas.style.cssText = `
                width: 90%;
                height: 35px;
                margin: 10px auto 0 auto;
                display: block;
                border-radius: 0;
                background: transparent;
                transform: translateZ(0) rotateX(0deg) rotateY(0deg) !important;
                backface-visibility: hidden !important;
            `;

            // Insert canvas in profile info (after profile title)
            const profileInfo = document.querySelector('.profile-info');
            if (profileInfo) {
                profileInfo.appendChild(this.canvas);
            }
        }

        // Force flat transform on canvas
        this.canvas.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
        this.canvas.style.transformStyle = 'flat';
        this.canvas.style.backfaceVisibility = 'hidden';

        // Set canvas resolution
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.scale(dpr, dpr);

        // Initialize Web Audio API
        this.setupAudio();

        // Ensure canvas stays flat
        this.ensureFlatCanvas();

        this.isInitialized = true;
    }

    ensureFlatCanvas() {
        // Continuously enforce flat transform
        const enforceFlat = () => {
            if (this.canvas) {
                this.canvas.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
                this.canvas.style.transformStyle = 'flat';
            }
        };

        // Run immediately
        enforceFlat();

        // Set up observer to watch for style changes
        if (this.canvas && window.MutationObserver) {
            const observer = new MutationObserver(enforceFlat);
            observer.observe(this.canvas, {
                attributes: true,
                attributeFilter: ['style']
            });
        }

        // Also check periodically
        setInterval(enforceFlat, 100);
    }

    setupAudio() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create analyser with higher resolution
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048; // Increased from 256 for more frequency data
            this.analyser.smoothingTimeConstant = this.smoothing;

            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            // Connect audio element to analyser
            if (!this.source) {
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    }

    start() {
        if (!this.isInitialized) {
            this.init();
        }

        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.draw();
    }

    stop() {
        // Don't cancel animation immediately, let it transition to minimal
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        // Use setTimeout to ensure minimal bars are drawn after animation stops
        setTimeout(() => this.drawMinimalBars(), 10);
    }

    draw() {
        this.animationId = requestAnimationFrame(() => this.draw());

        if (!this.analyser || !this.dataArray) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas with fade effect instead of full clear
        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.canvasCtx.fillRect(0, 0, width, height);
        this.canvasCtx.clearRect(0, 0, width, height);

        // Calculate bar dimensions
        const totalBarWidth = this.barWidth + this.barGap;
        const usableWidth = width - 40; // padding
        const actualBarCount = Math.min(this.barCount, Math.floor(usableWidth / totalBarWidth));
        const startX = (width - (actualBarCount * totalBarWidth)) / 2;

        // Draw bars
        for (let i = 0; i < actualBarCount; i++) {
            // Get frequency data with better distribution
            const dataIndex = Math.floor((i / actualBarCount) * (this.bufferLength * 0.7)); // Use first 70% of frequency data
            const value = this.dataArray[dataIndex];

            // Calculate bar height with minimum
            const minBarHeight = 3;
            const barHeight = Math.max(minBarHeight, (value / 255) * (height - 20));
            const x = startX + (i * totalBarWidth);
            const y = height - barHeight - 10;

            // Create gradient for each bar
            const gradient = this.canvasCtx.createLinearGradient(x, y + barHeight, x, y);

            // Color based on frequency (low=purple, mid=cyan, high=yellow)
            if (i < actualBarCount * 0.33) {
                gradient.addColorStop(0, this.colors.secondary);
                gradient.addColorStop(1, this.colors.primary);
            } else if (i < actualBarCount * 0.66) {
                gradient.addColorStop(0, this.colors.primary);
                gradient.addColorStop(1, this.colors.tertiary);
            } else {
                gradient.addColorStop(0, this.colors.tertiary);
                gradient.addColorStop(1, this.colors.secondary);
            }

            // Draw bar
            this.canvasCtx.fillStyle = gradient;
            this.canvasCtx.fillRect(x, y, this.barWidth, barHeight);

            // Add glow effect
            this.canvasCtx.shadowBlur = 10;
            this.canvasCtx.shadowColor = gradient;
            this.canvasCtx.fillRect(x, y, this.barWidth, barHeight);
            this.canvasCtx.shadowBlur = 0;
        }
    }

    clearCanvas() {
        if (this.canvasCtx && this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            this.canvasCtx.clearRect(0, 0, rect.width, rect.height);
        }
    }

    drawMinimalBars() {
        if (!this.canvasCtx || !this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        this.canvasCtx.clearRect(0, 0, width, height);

        // Calculate bar dimensions
        const totalBarWidth = this.barWidth + this.barGap;
        const usableWidth = width - 40;
        const actualBarCount = Math.min(this.barCount, Math.floor(usableWidth / totalBarWidth));
        const startX = (width - (actualBarCount * totalBarWidth)) / 2;

        // Draw minimal bars (very short)
        const minHeight = 3; // Minimal bar height
        for (let i = 0; i < actualBarCount; i++) {
            const x = startX + (i * totalBarWidth);
            const y = height - minHeight - 10;

            // Color based on position
            let color;
            if (i < actualBarCount * 0.33) {
                color = this.colors.secondary;
            } else if (i < actualBarCount * 0.66) {
                color = this.colors.primary;
            } else {
                color = this.colors.tertiary;
            }

            // Draw minimal bar with slight transparency
            this.canvasCtx.fillStyle = color;
            this.canvasCtx.globalAlpha = 0.4;
            this.canvasCtx.fillRect(x, y, this.barWidth, minHeight);
            this.canvasCtx.globalAlpha = 1.0;
        }
    }

    destroy() {
        this.stop();

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        if (this.audioContext) {
            this.audioContext.close();
        }

        this.isInitialized = false;
    }
}

// Initialize spectrum when audio starts playing
let spectrum = null;

function initSpectrum() {
    const audioPlayer = document.getElementById('audioPlayer');

    if (!audioPlayer) {
        console.error('Audio player not found');
        return;
    }

    // Create spectrum instance
    spectrum = new AudioSpectrum(audioPlayer);

    // Initialize and show minimal bars on load
    spectrum.init();
    spectrum.drawMinimalBars();

    // Start spectrum when audio plays
    audioPlayer.addEventListener('play', () => {
        if (spectrum.animationId) return; // Prevent multiple animations
        spectrum.start();
    });

    // Show minimal bars when audio pauses
    audioPlayer.addEventListener('pause', () => {
        spectrum.stop();
    });

    // Show minimal bars when audio ends
    audioPlayer.addEventListener('ended', () => {
        spectrum.stop();
    });

    // Handle song changes - restart spectrum
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!audioPlayer.paused) {
            spectrum.start();
        } else {
            spectrum.drawMinimalBars();
        }
    });

    // Handle when song changes while playing
    audioPlayer.addEventListener('loadstart', () => {
        spectrum.drawMinimalBars();
    });

    // Keep minimal bars during loading
    audioPlayer.addEventListener('waiting', () => {
        if (audioPlayer.paused) {
            spectrum.drawMinimalBars();
        }
    });

    // Handle next/prev button clicks
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            setTimeout(() => spectrum.drawMinimalBars(), 50);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            setTimeout(() => spectrum.drawMinimalBars(), 50);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpectrum);
} else {
    initSpectrum();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioSpectrum;
}