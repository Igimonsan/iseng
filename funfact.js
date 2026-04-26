const FUN_FACTS = [
  { icon: '🐙', text: 'Gurita punya tiga jantung, darah biru, dan sembilan otak — satu otak utama dan satu di setiap tentakelnya.' },
  { icon: '🍯', text: 'Madu tidak pernah basi. Arkeolog menemukan madu berusia 3.000 tahun di makam Mesir kuno dan masih bisa dimakan.' },
  { icon: '🌊', text: 'Lebih dari 80% lautan di bumi belum pernah dipetakan atau dieksplorasi oleh manusia.' },
  { icon: '⚡', text: 'Petir menyambar bumi sekitar 100 kali setiap detiknya — itu sekitar 8,6 juta kali sehari.' },
  { icon: '🦈', text: 'Hiu lebih tua dari pohon. Hiu sudah ada sekitar 450 juta tahun, sedangkan pohon baru muncul sekitar 350 juta tahun lalu.' },
  { icon: '🧠', text: 'Otak manusia menghasilkan sekitar 70.000 pikiran per hari, dan 95% di antaranya sama seperti hari sebelumnya.' },
  { icon: '🌙', text: 'Jejak kaki yang ditinggalkan astronot di bulan akan bertahan jutaan tahun karena tidak ada angin di sana.' },
  { icon: '🐘', text: 'Gajah adalah satu-satunya hewan yang tidak bisa melompat — dan satu-satunya mamalia berkaki empat yang begitu.' },
  { icon: '🎵', text: 'Lagu "Happy Birthday to You" adalah lagu yang paling sering dinyanyikan dalam bahasa Inggris di seluruh dunia.' },
  { icon: '🦋', text: 'Kupu-kupu bisa merasakan rasa manis lewat kaki mereka — reseptor rasanya ada di telapak kaki.' },
  { icon: '🌍', text: 'Jika kamu menggali lubang lurus menembus bumi dari Indonesia, kamu akan muncul di Samudra Atlantik.' },
  { icon: '🐜', text: 'Semut bisa mengangkat beban 50 kali berat tubuhnya sendiri. Kalau manusia sekuat itu, kita bisa angkat mobil.' },
  { icon: '💧', text: 'Air yang kamu minum hari ini mungkin pernah diminum dinosaurus. Air di bumi terus berdaur ulang selama miliaran tahun.' },
  { icon: '🌸', text: 'Bunga teratai bisa mengatur suhu tubuhnya sendiri antara 30–36°C meskipun suhu lingkungan berubah-ubah.' },
  { icon: '🐬', text: 'Lumba-lumba tidur dengan hanya setengah otaknya — separuh tetap terjaga untuk terus berenang dan bernapas.' },
  { icon: '🍕', text: 'Kata "pizza" pertama kali tercatat secara tertulis di Gaeta, Italia, pada tahun 997 Masehi.' },
  { icon: '🦴', text: 'Bayi manusia lahir dengan sekitar 270–300 tulang. Saat dewasa, jumlahnya berkurang menjadi 206 karena beberapa menyatu.' },
  { icon: '🌋', text: 'Ada lebih banyak gunung berapi aktif di bawah laut daripada di daratan. Sebagian besar berada di Mid-Ocean Ridge.' },
  { icon: '🐌', text: 'Siput punya gigi — ribuan! Seekor siput biasa punya sekitar 14.000 gigi kecil di lidahnya.' },
  { icon: '☁️', text: 'Awan kumulonimbus rata-rata mengandung air seberat 500.000 kg — setara dengan berat 80 ekor gajah.' },
  { icon: '🧊', text: 'Es bisa terbakar. Di suhu dan tekanan ekstrem tertentu, ada yang disebut "es panas" yang bisa mencapai 5.000°C.' },
  { icon: '🦜', text: 'Kakapo adalah satu-satunya burung beo yang tidak bisa terbang, dan juga yang paling berat — bisa sampai 4 kg.' },
  { icon: '🌞', text: 'Sinar matahari yang kamu rasakan hari ini sebenarnya sudah "diproduksi" sejak 100.000 tahun lalu di inti matahari.' },
  { icon: '🐧', text: 'Penguin jantan melamar betinanya dengan memberikan batu. Batu yang paling bagus dianggap hadiah terbaik.' },
  { icon: '🔵', text: 'Biru adalah warna yang paling jarang muncul di alam. Bahkan banyak hewan "biru" sebenarnya hanya memantulkan cahaya biru.' },
  { icon: '🌴', text: 'Pohon kelapa sawit bisa menghasilkan minyak selama lebih dari 25 tahun dan merupakan tanaman penghasil minyak paling efisien di dunia.' },
  { icon: '🧲', text: 'Magnet terkuat di alam semesta adalah magnetar — bintang neutron yang magnetnya miliaran kali lebih kuat dari magnet bumi.' },
  { icon: '🐢', text: 'Penyu laut kembali ke pantai yang sama tempat mereka menetas untuk bertelur — bisa setelah 30 tahun berkelana di laut.' },
  { icon: '🍄', text: 'Jamur lebih dekat secara genetik ke manusia daripada ke tanaman. Kita dan jamur punya nenek moyang yang sama.' },
  { icon: '🪐', text: 'Saturnus bisa mengapung di air karena kerapatan rata-ratanya lebih rendah dari air — sekitar 0,687 g/cm³.' },
  { icon: '🦎', text: 'Bunglon tidak berubah warna untuk kamuflase — mereka berubah warna untuk berkomunikasi dan mengatur suhu tubuh.' },
  { icon: '🧬', text: 'DNA manusia dan pisang memiliki sekitar 60% kesamaan genetik. Dengan simpanse, kesamaannya mencapai 98,7%.' },
  { icon: '🌀', text: 'Angin topan tidak pernah terbentuk di garis khatulistiwa karena tidak ada efek Coriolis yang cukup di sana.' },
  { icon: '🐝', text: 'Lebah madu harus mengunjungi sekitar 2 juta bunga untuk menghasilkan 450 gram madu — sepanjang jarak dua kali keliling bumi.' },
  { icon: '🎮', text: 'Tetris adalah game pertama yang diluncurkan ke luar angkasa — dibawa astronot ke stasiun luar angkasa pada 1993.' },
  { icon: '🌊', text: 'Titik terdalam lautan, Challenger Deep di Palung Mariana, lebih dalam dari tinggi Gunung Everest — sekitar 11 km.' },
  { icon: '🦊', text: 'Rubah menggunakan medan magnet bumi untuk membantu mereka berburu — mereka bisa "melihat" medan magnet.' },
  { icon: '🍎', text: 'Ada lebih dari 7.500 varietas apel di dunia. Kalau kamu makan satu jenis per hari, butuh 20 tahun untuk mencobanya semua.' },
  { icon: '🌡️', text: 'Suhu di permukaan Matahari sekitar 5.500°C, tapi korona (atmosfernya) bisa mencapai 1–3 juta°C. Mengapa masih jadi misteri.' },
  { icon: '🐋', text: 'Paus biru adalah hewan terbesar yang pernah hidup di bumi — lebih besar dari dinosaurus manapun yang pernah ada.' },
  { icon: '🔮', text: 'Kaca sebenarnya adalah cairan yang bergerak sangat lambat, bukan padatan. Kaca tua di museum lebih tebal di bagian bawah.' },
  { icon: '🌿', text: 'Pohon berkomunikasi satu sama lain melalui jaringan jamur di bawah tanah yang disebut "wood wide web".' },
  { icon: '🦁', text: 'Singa betinalah yang berburu, bukan jantan. Singa jantan hanya menghabiskan sekitar 2 jam sehari untuk aktif bergerak.' },
  { icon: '💡', text: 'Thomas Edison bukan penemu bola lampu. Warren de la Rue menciptakannya 40 tahun sebelum Edison — tapi Edison yang mempopulerkannya.' },
  { icon: '🧪', text: 'Air murni tidak menghantarkan listrik sama sekali. Yang menghantarkan adalah mineral dan ion yang larut di dalamnya.' },
  { icon: '🌺', text: 'Bunga vanilla berasal dari anggrek. Tanaman vanilla hanya mekar satu hari dalam setahun, dan harus diserbuki secara manual.' },
  { icon: '🐠', text: 'Ikan badut (seperti Nemo) bisa berganti jenis kelamin. Semua lahir jantan, dan yang dominan bisa berubah jadi betina.' },
  { icon: '🏔️', text: 'Gunung Everest bukan titik terjauh dari pusat bumi. Gunung Chimborazo di Ekuador lebih jauh karena bumi menggembung di khatulistiwa.' },
  { icon: '🎯', text: 'Manusia adalah satu-satunya hewan yang bisa berlari maraton. Kita berevolusi jadi pelari jarak jauh terbaik di antara semua mamalia.' },
  { icon: '🌌', text: 'Ada lebih banyak bintang di alam semesta daripada butiran pasir di semua pantai dan gurun di bumi.' },
];

(function () {
  const STORAGE_KEY = 'funfact_seen';

  // shuffle Fisher-Yates
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // build shuffled queue, avoid repeating last seen
  function buildQueue() {
    const lastSeen = parseInt(sessionStorage.getItem(STORAGE_KEY) || '-1');
    let shuffled = shuffle(FUN_FACTS);
    // make sure first fact isn't same index as last session
    if (shuffled[0] === FUN_FACTS[lastSeen]) {
      shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
    }
    return shuffled;
  }

  let queue = buildQueue();
  let idx = 0;

  const popup    = document.getElementById('funfactPopup');
  const backdrop = document.getElementById('funfactBackdrop');
  const closeBtn = document.getElementById('funfactClose');
  const nextBtn  = document.getElementById('funfactNext');
  const iconEl   = document.getElementById('funfactIcon');
  const textEl   = document.getElementById('funfactText');
  const counterEl= document.getElementById('funfactCounter');

  function showFact() {
    const fact = queue[idx];
    // animate out then in
    textEl.style.opacity = '0';
    iconEl.style.opacity = '0';
    setTimeout(() => {
      iconEl.textContent  = fact.icon;
      textEl.textContent  = fact.text;
      counterEl.textContent = `${idx + 1} / ${queue.length}`;
      textEl.style.opacity = '1';
      iconEl.style.opacity = '1';
    }, 180);
    sessionStorage.setItem(STORAGE_KEY, FUN_FACTS.indexOf(fact));
  }

  function openPopup() {
    popup.classList.add('show');
    backdrop.classList.add('show');
    showFact();
  }

  function closePopup() {
    popup.classList.remove('show');
    backdrop.classList.remove('show');
  }

  nextBtn.addEventListener('click', () => {
    idx = (idx + 1) % queue.length;
    showFact();
  });

  closeBtn.addEventListener('click', closePopup);
  backdrop.addEventListener('click', closePopup);

  // open on load with slight delay so page renders first
  window.addEventListener('load', () => {
    setTimeout(openPopup, 600);
  });
})();