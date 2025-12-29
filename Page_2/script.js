function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 150;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random ukuran bintang (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Random posisi
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random delay untuk animasi twinkle
        star.style.animationDelay = Math.random() * 3 + 's';

        // Random durasi animasi
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';

        starsContainer.appendChild(star);
    }
}

// Jalankan fungsi saat halaman dimuat
createStars();

// Event listener untuk tracking klik
document.querySelectorAll('.link-item').forEach(link => {
    link.addEventListener('click', function (e) {
        const platform = this.getAttribute('data-platform');
        console.log(`Navigasi ke ${platform}`);

        // Tambahkan efek ripple saat diklik
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});