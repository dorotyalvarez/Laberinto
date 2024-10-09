const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Posición inicial de la pelota
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 5,
    dx: 0,
    dy: 0
};

// Dibujar la pelota
function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Mover la pelota
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Asegurarse de que la pelota no se salga del canvas
    if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
    if (ball.x - ball.radius < 0) ball.x = ball.radius;
    if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
    if (ball.y - ball.radius < 0) ball.y = ball.radius;
}

// Detectar teclas y cambiar dirección
function moveBall(e) {
    if (e.key === 'ArrowUp') {
        ball.dy = -ball.speed;
        ball.dx = 0;
    }
    if (e.key === 'ArrowDown') {
        ball.dy = ball.speed;
        ball.dx = 0;
    }
    if (e.key === 'ArrowLeft') {
        ball.dx = -ball.speed;
        ball.dy = 0;
    }
    if (e.key === 'ArrowRight') {
        ball.dx = ball.speed;
        ball.dy = 0;
    }
}

// Detener la pelota cuando se suelta la tecla
function stopBall(e) {
    if (
        e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' || e.key === 'ArrowRight'
    ) {
        ball.dx = 0;
        ball.dy = 0;
    }
}

// Escuchar eventos del teclado
document.addEventListener('keydown', moveBall);
document.addEventListener('keyup', stopBall);

// Loop principal del juego
function gameLoop() {
    updateBallPosition();
    drawBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();