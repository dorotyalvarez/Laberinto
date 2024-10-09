const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

let cols = 0; // Número de columnas
let rows = 0; // Número de filas

document.getElementById('enviar').addEventListener('click', function() {
    const seleccion = document.getElementById('opciones').value;

    // Asignar valores según la opción seleccionada
    switch (seleccion) {
        case 'opcion1':
            cols = 10;
            rows = 10;
            break;
        case 'opcion2':
            cols = 20;
            rows = 20;
            break;
        case 'opcion3':
            cols = 30;
            rows = 30;
            break;
        default:
            cols = 10; // Valor por defecto
            rows = 10; // Valor por defecto
            break;
    }

    console.log('Número de columnas:', cols);
    console.log('Número de filas:', rows);

    // Ahora podemos calcular el tamaño de la celda
    const cellSize = canvas.width / cols; // Tamaño de cada celda

    // Reiniciar el grid y crear el laberinto
    grid = [];
    stack = [];
    playerX = 0;
    playerY = 0;

    createMaze(cellSize); // Pasar cellSize a la función createMaze
});

// Clase Celda para el laberinto
class Cell {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.walls = [true, true, true, true]; // Paredes [superior, derecha, inferior, izquierda]
        this.visited = false;
    }

    // Dibujar la celda con sus paredes
    draw(cellSize) {
        const x = this.col * cellSize;
        const y = this.row * cellSize;

        ctx.strokeStyle = "";
        ctx.lineWidth = 2;

        // Dibujar paredes
        if (this.walls[0]) ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y); // Pared superior
        if (this.walls[1]) ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize); // Pared derecha
        if (this.walls[2]) ctx.moveTo(x, y + cellSize), ctx.lineTo(x + cellSize, y + cellSize); // Pared inferior
        if (this.walls[3]) ctx.moveTo(x, y), ctx.lineTo(x, y + cellSize); // Pared izquierda

        ctx.stroke();

        // Rellenar la celda si ha sido visitada
        if (this.visited) {
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    // Obtener vecinos no visitados
    getUnvisitedNeighbors() {
        const neighbors = [];
        const top = grid[index(this.col, this.row - 1)];
        const right = grid[index(this.col + 1, this.row)];
        const bottom = grid[index(this.col, this.row + 1)];
        const left = grid[index(this.col - 1, this.row)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        return neighbors;
    }

    // Eliminar la pared entre esta celda y su vecino
    removeWalls(next) {
        const dx = this.col + -next.col;
        const dy = this.row - next.row;

        if (dx === 1) {
            this.walls[3] = false; // Eliminar pared izquierda
            next.walls[1] = false; // Eliminar pared derecha del vecino
        } else if (dx === -1) {
            this.walls[1] = false; // Eliminar pared derecha
            next.walls[3] = false; // Eliminar pared izquierda del vecino
        }

        if (dy === 1) {
            this.walls[0] = false; // Eliminar pared superior
            next.walls[2] = false; // Eliminar pared inferior del vecino
        } else if (dy === -1) {
            this.walls[2] = false; // Eliminar pared inferior
            next.walls[0] = false; // Eliminar pared superior del vecino
        }
    }
}

// Crear el laberinto con el algoritmo DFS
function createMaze(cellSize) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = new Cell(col, row);
            grid.push(cell);
        }
    }

    let current = grid[0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
        let unvisitedNeighbors = current.getUnvisitedNeighbors();
        if (unvisitedNeighbors.length > 0) {
            let next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            next.visited = true;
            stack.push(current);
            current.removeWalls(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }

    drawMaze(cellSize);
}
// Dibujar la pelota
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX * (canvas.width / cols) + (canvas.width / cols) / 2, playerY * (canvas.height / rows) + (canvas.height / rows) / 2, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

// Dibujar el laberinto
function drawMaze(cellSize) {

    // Limpiar el canvas
    drawPlayer();
    grid.forEach(cell => cell.draw(cellSize));


    // Crear entrada y salida
    createEntranceAndExit(cellSize);

    // Dibujar la pelota
    drawPlayer();

}



// Crear la entrada y la salida del laberinto
function createEntranceAndExit(cellSize) {
    let entrance = grid[0];
    let exit = grid[index(cols - 1, rows - 1)];

    // Crear una "puerta" en la entrada (eliminar la pared izquierda)
    entrance.walls[3] = false;

    // Crear una "puerta" en la salida (eliminar la pared derecha)
    exit.walls[1] = false;

    // Dibujar la entrada y la salida
    ctx.fillStyle = "green"; // Color de la salida
    ctx.fillRect(exit.col * cellSize, exit.row * cellSize, cellSize, cellSize);

    ctx.fillStyle = "red"; // Color de la entrada
    ctx.fillRect(entrance.col * cellSize, entrance.row * cellSize, cellSize, cellSize);
}

// Índice para buscar las celdas
function index(col, row) {
    if (col < 0 || row < 0 || col >= cols || row >= rows) return -1;
    return col + row * cols;
}


// Mover la pelota
function movePlayer(e) {
    // Iniciar el cronómetro si no se ha iniciado
    if (!timerInterval) {
        startTimer();
    }


    let currentCell = grid[index(playerX, playerY)];

    switch (e.key) {

        case 'ArrowUp':
            if (!currentCell.walls[0] && playerY > 0) playerY--; // Verificar la pared superior
            break;
        case 'ArrowRight':
            if (!currentCell.walls[1] && playerX < cols - 1) playerX++; // Verificar la pared derecha
            break;
        case 'ArrowDown':
            if (!currentCell.walls[2] && playerY < rows - 1) playerY++; // Verificar la pared inferior
            break;
        case 'ArrowLeft':
            if (!currentCell.walls[3] && playerX > 0) playerX--; // Verificar la pared izquierda
            break;
    }

    function showWinMessage() {
        ctx.fillStyle = "green"; // Color del texto
        ctx.font = "50px Arial"; // Estilo de la fuente
        ctx.fillText("¡Ganaste!", canvas.width / 2 - 75, canvas.height / 2); // Centrar el mensaje
    }

    // En movePlayer, en lugar de alert:
    if (playerX === cols - 1 && playerY === rows - 1) {
        drawMaze(canvas.width / cols); // Redibujar el laberinto para mostrar la salida
        stopTimer();
        setTimeout(() => {
            resetTimer(); // Reinicia el cronómetro aquí
        }, 2000); // Esperar 2000 ms (2 segundos)
        showWinMessage(); // Mostrar el mensaje de victoria
        return setTimeout(() => {
            location.reload(); // Reiniciar la página después de 2 segundos
        }, 2000);; // Salir de la función

    }


    drawMaze(canvas.width / cols); // Redibujar el laberinto

}

// Escuchar eventos de teclado
document.addEventListener('keydown', movePlayer);

// Variables necesarias
let grid = [];
let stack = [];
let playerX = 0;
let playerY = 0;
const playerRadius = 10;

// Comenzar el proceso al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Reinicia el cronómetro aquí

    // Inicializar el laberinto con el tamaño de celda correcto
});