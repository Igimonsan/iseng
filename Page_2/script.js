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

// Konfigurasi gambar profile
const totalImages = 10; 
const imageFolder = 'Img/Profile/';
const imageBaseName = 'profile';
const imageExtension = '.jpeg';
const changeInterval = 3000;

// Jenis animasi yang tersedia
const animations = ['fade', 'swipe-right', 'swipe-left'];

let currentIndex = 0;
let currentAnimation = 0;

// Fungsi untuk inisialisasi gambar
function initProfileImages() {
    const profileImageContainer = document.querySelector('.profile-image');

    // Hapus img yang ada
    const existingImg = profileImageContainer.querySelector('img');
    if (existingImg) {
        existingImg.remove();
    }

    // Buat semua img element
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `${imageFolder}${imageBaseName}${i}${imageExtension}`;
        img.alt = 'Profile Image';
        img.style.zIndex = '1';

        // Set gambar pertama sebagai active
        if (i === 1) {
            img.classList.add('active');
            img.style.opacity = '1';
            img.style.zIndex = '2';
        }

        profileImageContainer.appendChild(img);
    }
}

// Fungsi untuk mengganti gambar dengan animasi
function changeProfileImage() {
    const images = document.querySelectorAll('.profile-image img');
    const currentImg = images[currentIndex];

    // Tentukan index gambar berikutnya
    const nextIndex = (currentIndex + 1) % totalImages;
    const nextImg = images[nextIndex];

    // Tentukan animasi yang akan digunakan
    const animationType = animations[currentAnimation];
    currentAnimation = (currentAnimation + 1) % animations.length;

    // Set z-index agar gambar baru di atas gambar lama
    currentImg.style.zIndex = '1';
    nextImg.style.zIndex = '2';

    // Tampilkan gambar berikutnya dengan animasi masuk
    nextImg.classList.add('active');
    nextImg.style.opacity = '1';

    if (animationType === 'fade') {
        nextImg.classList.add('fade-in');
    } else if (animationType === 'swipe-right') {
        nextImg.classList.add('swipe-right');
    } else if (animationType === 'swipe-left') {
        nextImg.classList.add('swipe-left');
    }

    // Tunggu animasi selesai, baru sembunyikan gambar lama
    setTimeout(() => {
        // Sembunyikan gambar lama
        currentImg.classList.remove('active');
        currentImg.style.opacity = '0';

        // Hapus class animasi dari gambar baru
        nextImg.classList.remove('fade-in', 'swipe-right', 'swipe-left');

        // Update index
        currentIndex = nextIndex;
    }, 500);
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    initProfileImages();

    // Mulai interval pergantian gambar
    setInterval(changeProfileImage, changeInterval);
});