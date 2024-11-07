const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rows = 20;
const columns = 10;
const blockSize = 30;
let score = 0;

// Block shapes
const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
];

let board = Array.from({ length: rows }, () => Array(columns).fill(0));
let currentShape, shapePosition;

// Start the game
function startGame() {
    score = 0;
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    spawnNewShape();
    update();
}

// Spawn a new shape
function spawnNewShape() {
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    currentShape = shapes[shapeIndex];
    shapePosition = { x: Math.floor(columns / 2) - 1, y: 0 };
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (board[y][x]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }

    // Draw the current shape
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                ctx.fillStyle = 'red';
                ctx.fillRect((shapePosition.x + x) * blockSize, (shapePosition.y + y) * blockSize, blockSize, blockSize);
            }
        }
    }

    // Draw the score
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Move shape down
function moveDown() {
    shapePosition.y++;
    if (isCollision()) {
        shapePosition.y--;
        placeShape();
        spawnNewShape();
        clearLines();
    }
}

// Check for collisions
function isCollision() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                const newX = shapePosition.x + x;
                const newY = shapePosition.y + y;
                if (newX < 0 || newX >= columns || newY >= rows || board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place the shape on the board
function placeShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                board[shapePosition.y + y][shapePosition.x + x] = 1;
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y].every(cell => cell === 1)) {
            board.splice(y, 1);
            board.unshift(Array(columns).fill(0));
            score += 10;
        }
    }
}

// Handle key presses
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        shapePosition.x--;
        if (isCollision()) shapePosition.x++;
    } else if (e.key === 'ArrowRight') {
        shapePosition.x++;
        if (isCollision()) shapePosition.x--;
    } else if (e.key === 'ArrowDown') {
        moveDown();
    } else if (e.key === 'ArrowUp') {
        rotateShape();
    }
});

// Rotate shape
function rotateShape() {
    const newShape = currentShape[0].map((_, index) => currentShape.map(row => row[index])).reverse();
    const oldShape = currentShape;
    currentShape = newShape;
    if (isCollision()) currentShape = oldShape;
}

// Game loop
function update() {
    moveDown();
    draw();
    setTimeout(update, 500); // speed of falling
}

startGame();
