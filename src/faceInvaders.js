// Constants
const BULLET_SIZE_MODIFIER = 0.0125;
const BULLET_SPEED_MODIFIER = 0.005;
const ENEMY_SIZE_MODIFIER = 0.1;
const ENEMY_SPEED_INCREMENT = 0.00015;
const MIN_ENEMY_SPAWN_DELAY = 500; // in milliseconds
const MAX_ENEMY_SPAWN_INCREMENT = -20; // in milliseconds
const FONT = 'Orbitron, sans-serif';
const SCORE_FONT = '\'Press Start 2P\', cursive';
const COLOR = '#b700ff';
const BULLET_COLOR_1 = "#FF0000";
const BULLET_COLOR_2 = "#FFFF00";
const BG_IMAGE = new Image();
BG_IMAGE.src = 'images/background.jpg';
const PLAYER_IMAGE = new Image();
PLAYER_IMAGE.src = 'images/player.jpg';
const BULLETS = [];
const ENEMIES = [];
const POWERUPS = [];
const POWER_UP_TYPES = ['green', 'green', 'green', 'blue', 'blue', 'yellow', 'yellow', 'pink', 'pink', 'red'];
const ENEMY_IMAGES = ['images/monster.jpg', 'images/jesus.jpg', 'images/guy.jpg',].map(function (src) {
    const img = new Image();
    img.src = src;
    return img;
});


// Variables
let playerSizeModifier = 0.125;
let playerSpeedModifier = 0.0125;
let maxBullets = 3;
let enemySpeedModifier = 0.0017;
let maxEnemySidewaysSpeed = 0.005;
let maxEnemySpawnDelay = 2500; // in milliseconds
let bulletColor = BULLET_COLOR_1;
let leftArrowPressed = false;
let rightArrowPressed = false;
let enemiesStopped = false;
let score = 0;

// Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rightButton = document.getElementById('right-button');
const leftButton = document.getElementById('left-button');
const fireButton = document.getElementById('fire-button');

// Set Canvas Size
let { fontSizeHeader, fontSize } = doCanvasSize();

window.addEventListener('resize',  () => {
    ({ fontSizeHeader, fontSize } = doCanvasSize());
});

// Create Player
const PLAYER = {
    x: canvas.width / 2,
    y: canvas.height - (canvas.width * playerSizeModifier * 7 / 12),
    width: canvas.width * playerSizeModifier,
    height: canvas.width * playerSizeModifier * 7 / 12,
    dx: canvas.width * playerSpeedModifier,
    image: PLAYER_IMAGE
};


// Event Handlers
leftButton.addEventListener('touchstart', () => {
    leftArrowPressed = true;
    rightArrowPressed = false;
})
leftButton.addEventListener('touchend',  () => {
    leftArrowPressed = false;
})
rightButton.addEventListener('touchstart',  () => {
    rightArrowPressed = true;
    leftArrowPressed = false;
})
rightButton.addEventListener('touchend',  () => {
    rightArrowPressed = false;
})
fireButton.addEventListener('touchstart', fire);

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = true;
    } else if (event.key === ' ') {
        fire();
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = false;
    }
});

// Functions
function doCanvasSize() {
    canvas.height = Math.min(window.innerWidth - 4, window.innerHeight) * 0.8;
    if (canvas.height > 600) {
        canvas.height = window.innerHeight - 280;
    }
    canvas.width = canvas.height;

    // Consts from Canvas Size
    let fontSizeHeader = canvas.height * 0.08;
    let fontSize = canvas.height * 0.06;
    return { fontSizeHeader, fontSize };
}

function fire() {
    if (BULLETS.length < maxBullets) {
        const bullet = {
            x: PLAYER.x + PLAYER.width / 2,
            y: PLAYER.y,
            width: canvas.width * BULLET_SIZE_MODIFIER,
            height: canvas.width * BULLET_SIZE_MODIFIER,
            dy: -canvas.width * BULLET_SPEED_MODIFIER
        };
        BULLETS.push(bullet);
    }
}

function drawPlayer() {
    ctx.fillStyle = COLOR;
    ctx.drawImage(PLAYER.image, PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

function drawBullets() {
    ctx.fillStyle = bulletColor;
    for (let i = 0; i < BULLETS.length; i++) {
        const bullet = BULLETS[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawEnemies() {
    for (let i = 0; i < ENEMIES.length; i++) {
        const enemy = ENEMIES[i];
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function drawPowerUps() {
    for (let i = 0; i < POWERUPS.length; i++) {
        const powerUp = POWERUPS[i];
        ctx.fillStyle = powerUp.type;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = fontSize + 'px ' + SCORE_FONT;
    ctx.fillText('Score:' + score, 20, fontSizeHeader);
}

function movePlayer() {
    if (leftArrowPressed && PLAYER.x > 0) {
        PLAYER.x -= PLAYER.dx;
    } else if (rightArrowPressed && PLAYER.x < canvas.width - PLAYER.width) {
        PLAYER.x += PLAYER.dx;
    }
}

function moveBullets() {
    for (let i = 0; i < BULLETS.length; i++) {
        const bullet = BULLETS[i];
        bullet.y += bullet.dy;
        if (bullet.y < 0) {
            BULLETS.splice(i, 1);
            i--;
        }
    }
}

function moveEnemies() {

    if (!enemiesStopped) {
        for (let i = 0; i < ENEMIES.length; i++) {
            const enemy = ENEMIES[i];
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
            if (enemy.y > canvas.height) {
                ENEMIES.splice(i, 1);
                i--;
            }
            if (enemy.x < 0 || enemy.x > canvas.width - enemy.width) {
                enemy.dx *= -1;
            }
        }
    }
}

function movePowerUps() {
    for (let i = 0; i < POWERUPS.length; i++) {
        const powerUp = POWERUPS[i];
        powerUp.y += powerUp.dy;
        powerUp.x += powerUp.dx;
        if (powerUp.y > canvas.height) {
            POWERUPS.splice(i, 1);
            i--;
        }
        if (powerUp.x < 0 || powerUp.x > canvas.width - powerUp.width) {
            powerUp.dx *= -1;
        }
    }
}

function checkCollision() {
    for (let i = ENEMIES.length - 1; i >= 0; i--) {
        const enemy = ENEMIES[i];
        if (PLAYER.x < enemy.x + enemy.width &&
            PLAYER.x + PLAYER.width > enemy.x &&
            PLAYER.y < enemy.y + enemy.height &&
            PLAYER.y + PLAYER.height > enemy.y) {
            return true;
        }
        for (let j = BULLETS.length - 1; j >= 0; j--) {
            const bullet = BULLETS[j];
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                BULLETS.splice(j, 1);
                ENEMIES.splice(i, 1);
                score += Math.ceil((1 + score) * 0.1);
                enemySpeedModifier += ENEMY_SPEED_INCREMENT;
                maxEnemySpawnDelay = Math.max(maxEnemySpawnDelay + MAX_ENEMY_SPAWN_INCREMENT, MIN_ENEMY_SPAWN_DELAY);
                enemiesStopped = false;
                break;
            }
        }
    }
    return false;
}

function checkPowerUps() {
    for (let i = POWERUPS.length - 1; i >= 0; i--) {
        const powerUp = POWERUPS[i];
        if (PLAYER.x < powerUp.x + powerUp.width &&
            PLAYER.x + PLAYER.width > powerUp.x &&
            PLAYER.y < powerUp.y + powerUp.height &&
            PLAYER.y + PLAYER.height > powerUp.y) {
            POWERUPS.splice(i, 1);

            if (powerUp.type === 'green') {
                maxBullets += 1;
                maxEnemySidewaysSpeed += 0.001;
            }

            if (powerUp.type === 'blue') {
                playerSpeedModifier = playerSpeedModifier + (playerSpeedModifier / 4);
                PLAYER.dx = canvas.width * playerSpeedModifier;
            }

            if (powerUp.type === 'red') {
                if (PLAYER.width <= canvas.width) {
                    PLAYER.width = PLAYER.width * 1.5;
                }
            }

            if (powerUp.type === 'yellow') {
                ENEMIES.length = 0;
            }

            if (powerUp.type === 'pink') {
                enemiesStopped = true;
                setTimeout( () => {
                    enemiesStopped = false;
                }, 5000)
            }
        }
    }
}

function cleanUpBullets() {
    for (let i = BULLETS.length - 1; i >= 0; i--) {
        BULLETS[i].y += BULLETS[i].dy;
        if (BULLETS[i].y + BULLETS[i].height < 0) {
            BULLETS.splice(i, 1);
        }
    }
}

function checkGameOver() {
    return ENEMIES.some(function (enemy) {
        return enemy.y + enemy.height >= canvas.height;
    });
}

function gameOver() {

    var highestScore = localStorage.getItem('highestScore');

    if (highestScore === null || score > parseInt(highestScore)) {
        localStorage.setItem('highestScore', score);
        highestScore = score
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game over text
    ctx.fillStyle = COLOR;
    ctx.font = fontSizeHeader + 'px ' + FONT;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 3 * fontSize);
    ctx.font = fontSize + 'px ' + FONT;
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 - fontSize);
    ctx.fillText('High Score: ' + highestScore, canvas.width / 2, canvas.height / 2 + fontSize);
    ctx.fillText('Click/Tap To Restart', canvas.width / 2, canvas.height / 2 + 3 * fontSize);

    canvas.addEventListener('click', function (e) {
        e.preventDefault();
        location.reload();
    });

    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        location.reload();
    });
}

function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - canvas.width * ENEMY_SIZE_MODIFIER),
        y: 0,
        width: canvas.width * ENEMY_SIZE_MODIFIER,
        height: canvas.width * ENEMY_SIZE_MODIFIER,
        dx: (Math.random() > 0.5 ? 1 : -1) * canvas.width * (Math.random() * maxEnemySidewaysSpeed),
        dy: canvas.width * enemySpeedModifier + score / 100,
        img: ENEMY_IMAGES[Math.floor(Math.random() * ENEMY_IMAGES.length)]
    };
    ENEMIES.push(enemy);

    const nextSpawnDelay = MIN_ENEMY_SPAWN_DELAY + Math.random() * (maxEnemySpawnDelay - MIN_ENEMY_SPAWN_DELAY);
    setTimeout(spawnEnemy, nextSpawnDelay);
}

function spawnPowerUp() {
    const powerUp = {
        type: POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)],
        x: Math.random() * (canvas.width - canvas.width * (ENEMY_SIZE_MODIFIER / 3)),
        y: 0,
        width: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        height: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        dx: 0,
        dy: canvas.width * enemySpeedModifier * 2,
    };
    POWERUPS.push(powerUp);

    const nextSpawnDelay = (MIN_ENEMY_SPAWN_DELAY + Math.random() * (maxEnemySpawnDelay - MIN_ENEMY_SPAWN_DELAY)) * 6;
    setTimeout(spawnPowerUp, nextSpawnDelay);
}

function updateBulletColor() {
    const time = new Date().getTime();
    if (time % 500 < 250) {
        bulletColor = BULLET_COLOR_1;
    } else {
        bulletColor = BULLET_COLOR_2;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(BG_IMAGE, 0, 0, canvas.width, canvas.height);

    drawPlayer();
    updateBulletColor();
    drawBullets();
    drawEnemies();
    drawPowerUps();
    drawScore();

    movePlayer();
    moveBullets();
    cleanUpBullets();
    moveEnemies();
    movePowerUps();
    checkPowerUps();

    if (checkCollision() || checkGameOver()) {
        return gameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Init methods for spawning
spawnEnemy();
spawnPowerUp();

// Game loop
gameLoop();

