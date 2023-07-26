// Configurable values
let PLAYER_SIZE_MODIFIER = 0.125;
let PLAYER_SPEED_MODIFIER = 0.0125;
let MAX_BULLETS = 2;
const BULLET_SIZE_MODIFIER = 0.0125;
const BULLET_SPEED_MODIFIER = 0.005;
const ENEMY_SIZE_MODIFIER = 0.1;
let ENEMY_SPEED_MODIFIER = 0.002;
const ENEMY_SPEED_INCREMENT = 0.0001;
const MAX_ENEMY_SIDEWAYS_SPEED = 0.01;
const MIN_ENEMY_SPAWN_DELAY = 500; // in milliseconds
let MAX_ENEMY_SPAWN_DELAY = 2500; // in milliseconds
const MAX_ENEMY_SPAWN_INCREMENT = -20; // in milliseconds
const FONT = 'Orbitron, sans-serif';
const COLOR = '#b700ff';
const BULLET_COLOR_1 = "#FF0000"; // Red
const BULLET_COLOR_2 = "#FFFF00"; // Yellow
let bulletColor = BULLET_COLOR_1;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rightButton = document.getElementById('right-button');
const leftButton = document.getElementById('left-button');
const fireButton = document.getElementById('fire-button');

canvas.height = Math.min(window.innerWidth, window.innerHeight) * 0.8;
canvas.width = canvas.height;

const bgImage = new Image();
bgImage.src = 'images/background.jpg';

window.addEventListener('resize', function () {
    canvas.height = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.width = canvas.height;
});

const playerImage = new Image();
playerImage.src = 'images/player.jpg';

const player = {
    x: canvas.width / 2,
    y: canvas.height - (canvas.width * PLAYER_SIZE_MODIFIER * 7 / 12),
    width: canvas.width * PLAYER_SIZE_MODIFIER,
    height: canvas.width * PLAYER_SIZE_MODIFIER * 7 / 12,
    dx: canvas.width * PLAYER_SPEED_MODIFIER,
    image: playerImage
};

const bullets = [];
const enemies = [];
const powerUps = [];

let leftArrowPressed = false;
let rightArrowPressed = false;

let score = 0;

const enemyImages = ['images/monster.jpg', 'images/jesus.jpg', 'images/guy.jpg',].map(function (src) {
    const img = new Image();
    img.src = src;
    return img;
});

const powerUpTypes = ['green', 'green', 'green', 'blue', 'blue', 'red'];

leftButton.addEventListener('touchstart', function () {
    leftArrowPressed = true;
    rightArrowPressed = false;
})
leftButton.addEventListener('touchend', function () {
    leftArrowPressed = false;
})
rightButton.addEventListener('touchstart', function () {
    rightArrowPressed = true;
    leftArrowPressed = false;
})
rightButton.addEventListener('touchend', function () {
    rightArrowPressed = false;
})
fireButton.addEventListener('touchstart', function () {
    fire();
})

window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = true;
    } else if (event.key === ' ') {
        fire();
    }
});

function fire() {
    if (bullets.length < MAX_BULLETS) {
        const bullet = {
            x: player.x + player.width / 2,
            y: player.y,
            width: canvas.width * BULLET_SIZE_MODIFIER,
            height: canvas.width * BULLET_SIZE_MODIFIER,
            dy: -canvas.width * BULLET_SPEED_MODIFIER
        };
        bullets.push(bullet);
    }
}

window.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = false;
    }
});

function drawPlayer() {
    ctx.fillStyle = COLOR;
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = bulletColor;
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        ctx.fillStyle = powerUp.type;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }
}

function drawScore() {
    ctx.fillStyle = COLOR;
    ctx.font = '20px ' + FONT;
    ctx.fillText('Score: ' + score, 10, 30);
}

function movePlayer() {
    if (leftArrowPressed && player.x > 0) {
        player.x -= player.dx;
    } else if (rightArrowPressed && player.x < canvas.width - player.width) {
        player.x += player.dx;
    }
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y += bullet.dy;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.y += enemy.dy;
        enemy.x += enemy.dx;
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
        if (enemy.x < 0 || enemy.x > canvas.width - enemy.width) {
            enemy.dx *= -1;
        }
    }
}

function movePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        powerUp.y += powerUp.dy;
        powerUp.x += powerUp.dx;
        if (powerUp.y > canvas.height) {
            powerUps.splice(i, 1);
            i--;
        }
        if (powerUp.x < 0 || powerUp.x > canvas.width - powerUp.width) {
            powerUp.dx *= -1;
        }
    }
}

function checkCollision() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            return true;
        }
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                bullets.splice(j, 1);
                enemies.splice(i, 1);
                score += Math.ceil((1 + score) * 0.1);
                ENEMY_SPEED_MODIFIER += ENEMY_SPEED_INCREMENT;
                MAX_ENEMY_SPAWN_DELAY = Math.max(MAX_ENEMY_SPAWN_DELAY + MAX_ENEMY_SPAWN_INCREMENT, MIN_ENEMY_SPAWN_DELAY);
                break;
            }
        }
    }
    return false;
}

function checkPowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        if (player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y) {
            powerUps.splice(i, 1);

            if (powerUp.type === 'green') {
                MAX_BULLETS += 1;
            }

            if (powerUp.type === 'blue') {
                PLAYER_SPEED_MODIFIER = PLAYER_SPEED_MODIFIER + (PLAYER_SPEED_MODIFIER / 4);
                player.dx = canvas.width * PLAYER_SPEED_MODIFIER;
            }

            if (powerUp.type === 'red') {
                PLAYER_SIZE_MODIFIER = (1 - PLAYER_SIZE_MODIFIER) / 5;
                player.width = canvas.width * PLAYER_SIZE_MODIFIER;
            }
        }
    }
}

function cleanUpBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y += bullets[i].dy;
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }
}

function checkGameOver() {
    return enemies.some(function (enemy) {
        return enemy.y + enemy.height >= canvas.height;
    });
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw game over text
    ctx.fillStyle = COLOR;
    ctx.font = '50px ' + FONT;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = FONT;
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Click/Tap To Restart', canvas.width / 2, canvas.height / 2 + 50);

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
        dx: (Math.random() > 0.5 ? 1 : -1) * canvas.width * (Math.random() * MAX_ENEMY_SIDEWAYS_SPEED),
        dy: canvas.width * ENEMY_SPEED_MODIFIER + score / 100,
        img: enemyImages[Math.floor(Math.random() * enemyImages.length)]
    };
    enemies.push(enemy);

    const nextSpawnDelay = MIN_ENEMY_SPAWN_DELAY + Math.random() * (MAX_ENEMY_SPAWN_DELAY - MIN_ENEMY_SPAWN_DELAY);
    setTimeout(spawnEnemy, nextSpawnDelay);
}

function spawnPowerUp() {
    const powerUp = {
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
        x: Math.random() * (canvas.width - canvas.width * (ENEMY_SIZE_MODIFIER / 3)),
        y: 0,
        width: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        height: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        dx: 0,
        dy: canvas.width * ENEMY_SPEED_MODIFIER * 2,
    };
    powerUps.push(powerUp);

    const nextSpawnDelay = (MIN_ENEMY_SPAWN_DELAY + Math.random() * (MAX_ENEMY_SPAWN_DELAY - MIN_ENEMY_SPAWN_DELAY)) * 6;
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
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

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

spawnEnemy();
spawnPowerUp();
gameLoop();

