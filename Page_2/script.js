function createStars(){const starsContainer=document.querySelector('.stars');const numberOfStars=150;for(let i=0;i<numberOfStars;i++){const star=document.createElement('div');star.className='star';const size=Math.random()*2+1;star.style.width=size+'px';star.style.height=size+'px';star.style.left=Math.random()*100+'%';star.style.top=Math.random()*100+'%';star.style.animationDelay=Math.random()*3+'s';star.style.animationDuration=(Math.random()*3+2)+'s';starsContainer.appendChild(star);}}createStars();document.querySelectorAll('.link-item').forEach(link=>{link.addEventListener('click',function(e){const platform=this.getAttribute('data-platform');console.log(`Navigasi ke ${platform}`);const ripple=document.createElement('span');ripple.style.position='absolute';ripple.style.borderRadius='50%';ripple.style.background='rgba(255,255,255,0.5)';ripple.style.width='20px';ripple.style.height='20px';ripple.style.animation='ripple 0.6s ease-out';ripple.style.left=e.offsetX+'px';ripple.style.top=e.offsetY+'px';this.appendChild(ripple);setTimeout(()=>ripple.remove(),600);});});const totalImages=10;const imageFolder='Img/Profile/';const imageBaseName='profile';const imageExtension='.jpeg';const changeInterval=3000;const animations=['fade','swipe-right','swipe-left'];let currentIndex=0;let currentAnimation=0;function initProfileImages(){const profileImageContainer=document.querySelector('.profile-image');const existingImg=profileImageContainer.querySelector('img');if(existingImg){existingImg.remove();}for(let i=1;i<=totalImages;i++){const img=document.createElement('img');img.src=`${imageFolder}${imageBaseName}${i}${imageExtension}`;img.alt='Profile Image';img.style.zIndex='1';if(i===1){img.classList.add('active');img.style.opacity='1';img.style.zIndex='2';}profileImageContainer.appendChild(img);}}function changeProfileImage(){const images=document.querySelectorAll('.profile-image img');const currentImg=images[currentIndex];const nextIndex=(currentIndex+1)%totalImages;const nextImg=images[nextIndex];const animationType=animations[currentAnimation];currentAnimation=(currentAnimation+1)%animations.length;currentImg.style.zIndex='1';nextImg.style.zIndex='2';nextImg.classList.add('active');nextImg.style.opacity='1';if(animationType==='fade'){nextImg.classList.add('fade-in');}else if(animationType==='swipe-right'){nextImg.classList.add('swipe-right');}else if(animationType==='swipe-left'){nextImg.classList.add('swipe-left');}setTimeout(()=>{currentImg.classList.remove('active');currentImg.style.opacity='0';nextImg.classList.remove('fade-in','swipe-right','swipe-left');currentIndex=nextIndex;},500);}document.addEventListener('DOMContentLoaded',function(){initProfileImages();setInterval(changeProfileImage,changeInterval);initGame();});

// ============================================
// SNAKE GAME
// ============================================
function initGame() {
  const canvas  = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const overlay = document.getElementById('snakeOverlay');
  const startBtn= document.getElementById('snakeStartBtn');
  const scoreEl = document.getElementById('snakeScore');
  const bestEl  = document.getElementById('snakeBest');
  const speedEl = document.getElementById('snakeSpeed');
  const titleEl = document.getElementById('overlayTitle');
  const subEl   = document.getElementById('overlaySub');

  const COLS = 20, ROWS = 20;
  let cellSize, running = false, loop = null;
  let snake, dir, nextDir, food, score, best = 0, tick;

  const ACCENT  = '#c9a962';
  const ACCENT2 = '#8b7444';
  const BG      = '#0a0a0f';
  const GRID    = 'rgba(201,169,98,0.04)';
  const HEAD    = '#e8c97a';
  const BODY1   = '#c9a962';
  const BODY2   = '#8b7444';
  const FOOD_C  = '#ff6b6b';

  function resize() {
    const w = canvas.parentElement.clientWidth;
    canvas.width  = w;
    canvas.height = w;
    cellSize = w / COLS;
    if (!running) drawOverlayCanvas();
  }

  function randFood() {
    let pos;
    do { pos = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) }; }
    while (snake.some(s => s.x===pos.x && s.y===pos.y));
    return pos;
  }

  function startGame() {
    snake   = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir     = {x:1, y:0};
    nextDir = {x:1, y:0};
    score   = 0;
    tick    = 180;
    food    = randFood();
    running = true;
    overlay.classList.add('hidden');
    scoreEl.textContent = 0;
    speedEl.textContent = 1;
    clearInterval(loop);
    loop = setInterval(step, tick);
  }

  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return gameOver();
    // self collision
    if (snake.some(s => s.x===head.x && s.y===head.y)) return gameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      if (score > best) { best = score; bestEl.textContent = best; }
      food = randFood();
      // speed up every 5 points
      if (score % 5 === 0) {
        tick = Math.max(60, tick - 18);
        clearInterval(loop);
        loop = setInterval(step, tick);
        const spd = Math.round((180 - tick) / 18) + 1;
        speedEl.textContent = spd;
      }
      bumpEl(scoreEl);
    } else {
      snake.pop();
    }
    draw();
  }

  function gameOver() {
    running = false;
    clearInterval(loop);
    titleEl.textContent = 'Game Over';
    subEl.textContent   = `Score: ${score}`;
    startBtn.textContent = 'Main Lagi';
    overlay.classList.remove('hidden');
  }

  function draw() {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x*cellSize,0); ctx.lineTo(x*cellSize,canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0,y*cellSize); ctx.lineTo(canvas.width,y*cellSize); ctx.stroke();
    }

    // food — glowing dot
    const fx = food.x * cellSize + cellSize/2;
    const fy = food.y * cellSize + cellSize/2;
    const grad = ctx.createRadialGradient(fx,fy,1,fx,fy,cellSize*0.45);
    grad.addColorStop(0, '#ff9999');
    grad.addColorStop(1, FOOD_C);
    ctx.beginPath();
    ctx.arc(fx, fy, cellSize*0.38, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = FOOD_C;
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake
    snake.forEach((seg, i) => {
      const x = seg.x * cellSize, y = seg.y * cellSize;
      const pad = i === 0 ? 1 : 2;
      const r = cellSize * 0.25;

      if (i === 0) {
        // head
        ctx.fillStyle = HEAD;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ACCENT;
      } else {
        ctx.fillStyle = i % 2 === 0 ? BODY1 : BODY2;
        ctx.shadowBlur = 0;
      }

      roundRect(ctx, x+pad, y+pad, cellSize-pad*2, cellSize-pad*2, r);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function drawOverlayCanvas() {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x*cellSize,0); ctx.lineTo(x*cellSize,canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0,y*cellSize); ctx.lineTo(canvas.width,y*cellSize); ctx.stroke();
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  function bumpEl(el) {
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 150);
  }

  // keyboard (tetap support)
  document.addEventListener('keydown', e => {
    const map = {
      ArrowUp:'U', ArrowDown:'D', ArrowLeft:'L', ArrowRight:'R',
      w:'U', s:'D', a:'L', d:'R',
      W:'U', S:'D', A:'L', D:'R'
    };
    const k = map[e.key];
    if (!k) return;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    if (!running) return;
    if (k==='U' && dir.y===0) nextDir={x:0,y:-1};
    if (k==='D' && dir.y===0) nextDir={x:0,y:1};
    if (k==='L' && dir.x===0) nextDir={x:-1,y:0};
    if (k==='R' && dir.x===0) nextDir={x:1,y:0};
  });

  // swipe gesture (mobile)
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (!running) { startGame(); return; }
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // tap, ignore
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x === 0) nextDir = {x:1, y:0};
      if (dx < 0 && dir.x === 0) nextDir = {x:-1, y:0};
    } else {
      if (dy > 0 && dir.y === 0) nextDir = {x:0, y:1};
      if (dy < 0 && dir.y === 0) nextDir = {x:0, y:-1};
    }
  }, { passive: true });

  // click arah relatif kepala ular (desktop)
  canvas.addEventListener('click', e => {
    if (!running) { startGame(); return; }
    const rect = canvas.getBoundingClientRect();
    const scaleX = COLS / rect.width;
    const scaleY = ROWS / rect.height;
    const clickCol = Math.floor((e.clientX - rect.left) * scaleX);
    const clickRow = Math.floor((e.clientY - rect.top)  * scaleY);
    const head = snake[0];
    const diffX = clickCol - head.x;
    const diffY = clickRow - head.y;
    if (Math.abs(diffX) >= Math.abs(diffY)) {
      if (diffX > 0 && dir.x === 0) nextDir = {x:1,  y:0};
      if (diffX < 0 && dir.x === 0) nextDir = {x:-1, y:0};
    } else {
      if (diffY > 0 && dir.y === 0) nextDir = {x:0, y:1};
      if (diffY < 0 && dir.y === 0) nextDir = {x:0, y:-1};
    }
  });

  startBtn.addEventListener('click', e => { e.stopPropagation(); startGame(); });
  overlay.addEventListener('click', e => { if (!running && e.target === overlay) startGame(); });

  window.addEventListener('resize', resize);
  resize();
}