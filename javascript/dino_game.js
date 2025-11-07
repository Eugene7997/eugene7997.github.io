let canvas;
let ctx;
let scoreElement;

let score = 0;
let gameSpeed = 3;
let isGameOver = false;
let gameStarted = false;

const dino = {
    x: 50,
    y: 100,
    width: 40,
    height: 50,
    dy: 0,
    jumpPower: -12,
    gravity: 0.6,
    isJumping: false
};

let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 100;
const baseObstacleInterval = 100;

function drawDino() {
    ctx.fillStyle = '#535353';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    // Draw dino eye
    ctx.fillStyle = 'white';
    ctx.fillRect(dino.x + 25, dino.y + 10, 8, 8);
    // Draw dino legs
    ctx.fillStyle = '#535353';
    const legOffset = Math.floor(Date.now() / 100) % 20;
    ctx.fillRect(dino.x + 5, dino.y + dino.height, 8, 10);
    ctx.fillRect(dino.x + 25, dino.y + dino.height, 8, 10);
}

function drawObstacle(obs) {
    ctx.fillStyle = '#535353';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
}

function updateDino() {
    if (dino.isJumping) {
        dino.dy += dino.gravity;
        dino.y += dino.dy;

        if (dino.y >= 100) {
            dino.y = 100;
            dino.dy = 0;
            dino.isJumping = false;
        }
    }
}

function updateObstacles() {
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        // Random obstacle variations for more challenge
        const obstacleTypes = [
            { width: 20, height: 30 },  // Small cactus
            { width: 25, height: 40 },  // Medium cactus
            { width: 30, height: 35 },  // Wide cactus
            { width: 15, height: 45 }   // Tall thin cactus
        ];

        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        obstacles.push({
            x: canvas.width,
            y: 150 - randomType.height,
            width: randomType.width,
            height: randomType.height
        });
        obstacleTimer = 0;
    }

    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = `Score: ${score}`;

            // Progressive difficulty increase
            if (score % 5 === 0) {
                gameSpeed += 0.3;  // Speed increases every 5 points
            }

            // Spawn obstacles more frequently as score increases
            if (score % 10 === 0 && obstacleInterval > 50) {
                obstacleInterval -= 5;  // Reduce spawn interval
            }
        }
    });
}

function checkCollision() {
    for (let obs of obstacles) {
        if (dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#535353';
    ctx.fillRect(0, 148, canvas.width, 2);

    if (!gameStarted && !isGameOver) {
        ctx.fillStyle = '#535353';
        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to start', canvas.width / 2 - 100, canvas.height / 2);
    }
    else {
        if (!isGameOver) {
            updateDino();
            updateObstacles();

            if (checkCollision()) {
                isGameOver = true;
                gameStarted = false;
            }

            drawDino();
            obstacles.forEach(drawObstacle);
        }
        else {
            // Game Over screen
            ctx.fillStyle = '#535353';
            ctx.font = '30px Arial';
            ctx.fillText('GAME OVER', canvas.width / 2 - 90, canvas.height / 2);
            ctx.font = '16px Arial';
            ctx.fillText('Press SPACE to restart', canvas.width / 2 - 90, canvas.height / 2 + 30);
        }
    }

    requestAnimationFrame(gameLoop);
}

function jump() {
    if (!dino.isJumping && !isGameOver && gameStarted) {
        dino.isJumping = true;
        dino.dy = dino.jumpPower;
    }
}

function resetGame() {
    score = 0;
    gameSpeed = 3;
    obstacles = [];
    obstacleTimer = 0;
    obstacleInterval = baseObstacleInterval;  // Reset spawn interval
    dino.y = 100;
    dino.dy = 0;
    dino.isJumping = false;
    isGameOver = false;
    gameStarted = true;
    scoreElement.textContent = 'Score: 0';
}

function initGame() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');

    function resizeCanvasForDisplay() {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    }

    resizeCanvasForDisplay();
    window.addEventListener('resize', resizeCanvasForDisplay);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!gameStarted && !isGameOver) {
                gameStarted = true;
            }
            else if (isGameOver) {
                resetGame();
            }
            else {
                jump();
            }
        }
    });

    // Pointer / touch support: tapping the canvas starts/jumps/restarts depending on state
    canvas.addEventListener('pointerdown', (e) => {
        // prevent default so touch doesn't also trigger scroll/zoom
        e.preventDefault();
        if (!gameStarted && !isGameOver) {
            gameStarted = true;
        }
        else if (isGameOver) {
            resetGame();
        }
        else {
            jump();
        }
    });

    gameLoop();
}

class DinoGame extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="game-container" style="max-width: 600px; margin: 20px auto; position:relative;">
                <canvas id="game" width="600" height="150" style="border: 1px solid #535353; background-color: #f7f7f7; display:block; width:100%; height:auto; touch-action:none;"></canvas>
                <p id="score" style="text-align: center; font-size: 18px; margin-top: 10px;">Score: 0</p>
            </div>
        `;

        initGame();
    }
}

customElements.define('dino-game', DinoGame);