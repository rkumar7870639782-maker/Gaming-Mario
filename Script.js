/* =========================================
   SUPER DEV PORTFOLIO WORLD - FINAL JS
   Desktop + Mobile Controls
   ========================================= */

/* ===== GET HTML ELEMENTS ===== */
const player = document.getElementById('player');
const startScreen = document.getElementById('start');
const coinCounter = document.getElementById('coins');
const popup = document.getElementById('contactPopup');
const contactForm = document.getElementById('contactForm');
const flag = document.getElementById('flag');

/* ===== POSITION VARIABLES ===== */
let x = 100;
let y = 0;

/* ===== MOVEMENT VARIABLES ===== */
let velocityY = 0;
let moveLeft = false;
let moveRight = false;
let jumping = false;

/* ===== GAME VARIABLES ===== */
let score = 0;
let gameCompleted = false;
let gameStarted = false;

/* ===== DOUBLE JUMP VARIABLES ===== */
let lastSpaceTime = 0;
const DOUBLE_PRESS_DELAY = 300;

/* =========================================
   START GAME FUNCTION
   ========================================= */
function startGame() {
    startScreen.style.display = 'none';
    gameStarted = true;
}

/* =========================================
   CLOSE POPUP FUNCTION
   ========================================= */
function closePopup() {
    popup.style.display = 'none';
}

/* =========================================
   SUBMIT FORM FUNCTION
   ========================================= */
function submitForm() {
    alert('🚀 Message Sent Successfully!');
    closePopup();
}

/* =========================================
   CONTACT FORM SUBMIT
   ========================================= */
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm();
        this.reset();
    });
}

/* =========================================
   JUMP FUNCTION
   ========================================= */
function jump() {
    if (!jumping) {
        velocityY = -24;
        jumping = true;
    }

    const now = Date.now();

    if (now - lastSpaceTime < DOUBLE_PRESS_DELAY) {
        velocityY = -24;
        jumping = true;
    }

    lastSpaceTime = now;
}

/* =========================================
   KEYBOARD CONTROLS
   ========================================= */
document.addEventListener('keydown', function (e) {
    if (!gameStarted || gameCompleted) return;

    if (e.key === 'ArrowRight') {
        moveRight = true;
    }

    if (e.key === 'ArrowLeft') {
        moveLeft = true;
    }

    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowRight') {
        moveRight = false;
    }

    if (e.key === 'ArrowLeft') {
        moveLeft = false;
    }
});

/* =========================================
   PARTICLE EFFECT
   ========================================= */
function createParticles(px, py) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        particle.style.left = px + Math.random() * 30 + 'px';
        particle.style.top = py + Math.random() * 30 + 'px';

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

/* =========================================
   MAIN GAME LOOP
   ========================================= */
function gameLoop() {
    if (gameStarted && !gameCompleted) {
        /* ===== MOVE PLAYER ===== */
        if (moveRight) {
            x += 7;
            player.style.transform = 'scaleX(1)';
            player.classList.add('walk');
        }

        if (moveLeft) {
            x -= 7;
            player.style.transform = 'scaleX(-1)';
            player.classList.add('walk');
        }

        if (!moveLeft && !moveRight) {
            player.classList.remove('walk');
        }

        /* ===== BOUNDARIES ===== */
        if (x < 0) x = 0;
        if (x > 8400) x = 8400;

        /* ===== GRAVITY ===== */
        velocityY += 1.2;
        y += velocityY;

        /* ===== LAND ON GROUND ===== */
        if (y > 0) {
            y = 0;
            velocityY = 0;
            jumping = false;
        }

        /* ===== DRAW PLAYER ===== */
        player.style.left = x + 'px';
        player.style.top = (window.innerHeight - 220 + y) + 'px';

        /* ===== CAMERA FOLLOW ===== */
        window.scrollTo({
            left: Math.max(0, x - 300),
            top: 0,
            behavior: 'auto'
        });

        /* ===== COIN COLLECTION ===== */
        document.querySelectorAll('.coin').forEach(coin => {
            if (coin.style.display === 'none') return;

            const cx = coin.offsetLeft;
            const cy = coin.offsetTop;

            if (
                x + 60 > cx &&
                x < cx + 35 &&
                player.offsetTop < cy + 35 &&
                player.offsetTop + 90 > cy
            ) {
                coin.style.display = 'none';
                score++;

                coinCounter.textContent = 'COINS: ' + score;
                createParticles(cx, cy);
            }
        });

        /* ===== ENEMY COLLISION ===== */
        document.querySelectorAll('.enemy').forEach(enemy => {
            const ex = enemy.offsetLeft;

            if (
                x + 60 > ex &&
                x < ex + 60 &&
                y > -50
            ) {
                alert('💀 GAME OVER!');
                location.reload();
            }
        });

        /* ===== WIN CONDITION ===== */
        if (flag) {
            const flagPosition = flag.offsetLeft;

            if (
                x >= flagPosition - 100 &&
                score >= 5
            ) {
                gameCompleted = true;
                moveLeft = false;
                moveRight = false;

                popup.style.display = 'flex';
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

/* =========================================
   MOBILE TOUCH CONTROLS
   ========================================= */
function createMobileControls() {
    const controls = document.createElement('div');
    controls.id = 'mobileControls';

    controls.innerHTML = `
        <button id="leftBtn">⬅️</button>
        <button id="jumpBtn">⬆️</button>
        <button id="rightBtn">➡️</button>
    `;

    document.body.appendChild(controls);

    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const jumpBtn = document.getElementById('jumpBtn');

    /* ===== LEFT BUTTON ===== */
    leftBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        if (!gameStarted || gameCompleted) return;
        moveLeft = true;
    });

    leftBtn.addEventListener('touchend', function () {
        moveLeft = false;
    });

    leftBtn.addEventListener('touchcancel', function () {
        moveLeft = false;
    });

    /* ===== RIGHT BUTTON ===== */
    rightBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        if (!gameStarted || gameCompleted) return;
        moveRight = true;
    });

    rightBtn.addEventListener('touchend', function () {
        moveRight = false;
    });

    rightBtn.addEventListener('touchcancel', function () {
        moveRight = false;
    });

    /* ===== JUMP BUTTON ===== */
    jumpBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        if (!gameStarted || gameCompleted) return;
        jump();
    });

    /* ===== OPTIONAL MOUSE SUPPORT ===== */
    leftBtn.addEventListener('mousedown', () => moveLeft = true);
    rightBtn.addEventListener('mousedown', () => moveRight = true);
    jumpBtn.addEventListener('mousedown', jump);

    leftBtn.addEventListener('mouseup', () => moveLeft = false);
    rightBtn.addEventListener('mouseup', () => moveRight = false);
}

/* Create controls only on touch devices */
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    createMobileControls();
}

/* =========================================
   MAKE FUNCTIONS GLOBAL
   ========================================= */
window.startGame = startGame;
window.closePopup = closePopup;
window.submitForm = submitForm;

/* =========================================
   START GAME LOOP
   ========================================= */
gameLoop();
