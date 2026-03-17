const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game Objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const paddleSpeed = 6;
const ballSpeed = 5;

// Left Paddle (Player)
const leftPaddle = {
    x: 10,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddleSpeed
};

// Right Paddle (Computer)
const rightPaddle = {
    x: gameWidth - 20,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddleSpeed
};

// Ball
const ball = {
    x: gameWidth / 2,
    y: gameHeight / 2,
    dx: ballSpeed,
    dy: ballSpeed,
    radius: ballSize
};

// Score
let leftScore = 0;
let rightScore = 0;

// Input handling
const keys = {};
let mouseY = gameHeight / 2;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update left paddle position
function updateLeftPaddle() {
    // Mouse control
    if (mouseY > 0 && mouseY < gameHeight) {
        leftPaddle.y = mouseY - paddleHeight / 2;
    }

    // Arrow key control
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        leftPaddle.y -= leftPaddle.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        leftPaddle.y += leftPaddle.speed;
    }

    // Boundary checking
    if (leftPaddle.y < 0) {
        leftPaddle.y = 0;
    }
    if (leftPaddle.y + paddleHeight > gameHeight) {
        leftPaddle.y = gameHeight - paddleHeight;
    }
}

// Update right paddle position (Computer AI)
function updateRightPaddle() {
    const paddleCenter = rightPaddle.y + paddleHeight / 2;
    const difficulty = 0.08; // Adjust for difficulty (0.05 = hard, 0.15 = easy)

    if (paddleCenter < ball.y - 35) {
        rightPaddle.y += rightPaddle.speed * difficulty;
    } else if (paddleCenter > ball.y + 35) {
        rightPaddle.y -= rightPaddle.speed * difficulty;
    }

    // Boundary checking
    if (rightPaddle.y < 0) {
        rightPaddle.y = 0;
    }
    if (rightPaddle.y + paddleHeight > gameHeight) {
        rightPaddle.y = gameHeight - paddleHeight;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > gameHeight) {
        ball.dy *= -1;
        ball.y = Math.max(ball.radius, Math.min(gameHeight - ball.radius, ball.y));
    }

    // Left paddle collision
    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
        // Add spin based on paddle position
        ball.dy += (ball.y - (leftPaddle.y + paddleHeight / 2)) * 0.1;
    }

    // Right paddle collision
    if (
        ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.radius;
        // Add spin based on paddle position
        ball.dy += (ball.y - (rightPaddle.y + paddleHeight / 2)) * 0.1;
    }

    // Score and reset
    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ball.radius > gameWidth) {
        leftScore++;
        resetBall();
    }

    // Update score display
    document.getElementById('leftScore').textContent = leftScore;
    document.getElementById('rightScore').textContent = rightScore;
}

// Reset ball to center
function resetBall() {
    ball.x = gameWidth / 2;
    ball.y = gameHeight / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenter() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw center line
    drawCenter();

    // Draw paddles and ball
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
}

// Game loop
function gameLoop() {
    updateLeftPaddle();
    updateRightPaddle();
    updateBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
