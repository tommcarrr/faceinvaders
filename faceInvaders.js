// Configurable values
var PLAYER_SIZE_MODIFIER = 0.125;
var PLAYER_SPEED_MODIFIER = 0.0125;
var MAX_BULLETS = 2;
var BULLET_SIZE_MODIFIER = 0.0125;
var BULLET_SPEED_MODIFIER = 0.005;
var ENEMY_SIZE_MODIFIER = 0.1;
var ENEMY_SPEED_MODIFIER = 0.002;
var ENEMY_SPEED_INCREMENT = 0.0001;
var MAX_ENEMY_SIDEWAYS_SPEED = 0.005;
var MIN_ENEMY_SPAWN_DELAY = 500; // in milliseconds
var MAX_ENEMY_SPAWN_DELAY = 2500; // in milliseconds
var MAX_ENEMY_SPAWN_INCREMENT = -1; // in milliseconds
var FONT = 'Orbitron, sans-serif';
var COLOR = '#b700ff';

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var rightButton = document.getElementById('right-button');
var leftButton = document.getElementById('left-button');
var fireButton = document.getElementById('fire-button');

canvas.height = Math.min(window.innerWidth, window.innerHeight) * 0.8;
canvas.width = canvas.height;

var bgImage = new Image();
bgImage.src = 'images/background.jpg';

window.addEventListener('resize', function () {
    canvas.height = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.width = canvas.height;
});

var playerImage = new Image();
playerImage.src = 'images/player.jpg';

var player = {
    x: canvas.width / 2,
    y: canvas.height - (canvas.width * PLAYER_SIZE_MODIFIER * 7 / 12),
    width: canvas.width * PLAYER_SIZE_MODIFIER,
    height: canvas.width * PLAYER_SIZE_MODIFIER * 7 / 12,
    dx: canvas.width * PLAYER_SPEED_MODIFIER,
    image: playerImage
};

var bullets = [];
var enemies = [];
var powerUps = [];

var leftArrowPressed = false;
var rightArrowPressed = false;

var score = 0;

var enemyImages = ['images/monster.jpg', 'images/jesus.jpg', 'images/guy.jpg',].map(function (src) {
    var img = new Image();
    img.src = src;
    return img;
});

var powerUpTypes = ['green', 'blue', 'red'];

leftButton.addEventListener('touchstart', function (event) {
    leftArrowPressed = true;
    rightArrowPressed = false;
})
leftButton.addEventListener('touchend', function (event) {
    leftArrowPressed = false;
})
rightButton.addEventListener('touchstart', function (event) {
    rightArrowPressed = true;
    leftArrowPressed = false;
})
rightButton.addEventListener('touchend', function (event) {
    rightArrowPressed = false;
})
fireButton.addEventListener('touchstart', function (event) {
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
        var bullet = {
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
    ctx.fillStyle = COLOR;
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function drawPowerUps() {
    for (var i = 0; i < powerUps.length; i++) {
        var powerUp = powerUps[i];
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
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.y += bullet.dy;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
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
    for (var i = 0; i < powerUps.length; i++) {
        var powerUp = powerUps[i];
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
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            return true;
        }
        for (var j = bullets.length - 1; j >= 0; j--) {
            var bullet = bullets[j];
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
    for (var i = powerUps.length - 1; i >= 0; i--) {
        var powerUp = powerUps[i];
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

    gameCanvas.addEventListener('click', location.reload());

    gameCanvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        location.reload();
    });


    location.reload();
}

function spawnEnemy() {
    var enemy = {
        x: Math.random() * (canvas.width - canvas.width * ENEMY_SIZE_MODIFIER),
        y: 0,
        width: canvas.width * ENEMY_SIZE_MODIFIER,
        height: canvas.width * ENEMY_SIZE_MODIFIER,
        dx: (Math.random() > 0.5 ? 1 : -1) * canvas.width * (Math.random() * MAX_ENEMY_SIDEWAYS_SPEED),
        dy: canvas.width * ENEMY_SPEED_MODIFIER + score / 100,
        img: enemyImages[Math.floor(Math.random() * enemyImages.length)]
    };
    enemies.push(enemy);

    var nextSpawnDelay = MIN_ENEMY_SPAWN_DELAY + Math.random() * (MAX_ENEMY_SPAWN_DELAY - MIN_ENEMY_SPAWN_DELAY);
    setTimeout(spawnEnemy, nextSpawnDelay);
}

function spawnPowerUp() {
    var powerUp = {
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
        x: Math.random() * (canvas.width - canvas.width * (ENEMY_SIZE_MODIFIER / 3)),
        y: 0,
        width: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        height: canvas.width * (ENEMY_SIZE_MODIFIER / 3),
        dx: 0,
        dy: canvas.width * ENEMY_SPEED_MODIFIER * 2,
    };
    powerUps.push(powerUp);

    var nextSpawnDelay = (MIN_ENEMY_SPAWN_DELAY + Math.random() * (MAX_ENEMY_SPAWN_DELAY - MIN_ENEMY_SPAWN_DELAY)) * 6;
    setTimeout(spawnPowerUp, nextSpawnDelay);
}


spawnEnemy();
spawnPowerUp();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    drawPlayer();
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

gameLoop();

