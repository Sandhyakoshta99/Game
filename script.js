//Program to implement snake game
//*@AUTHOR:SANDHYA KOSHTA     
// *@DATE : 05 January 2025      
// */


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGameButton');
const restartButton = document.getElementById('restartGameButton');
const gameOverElement = document.getElementById('gameOver');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');

const box = 20; // Size of each grid box (increased for better visuals)
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake, food, direction, score, gameInterval, speed;
let gameOver = true;

// Initialize the game variables
function initializeGame() {
  snake = [{ x: 5 * box, y: 5 * box }]; // Start with one segment
  food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
  direction = { x: 0, y: 0 }; // Snake is stationary initially
  score = 0;
  speed = 200; // Initial speed in milliseconds (higher value = slower)
  gameOver = false;

  updateScore();
  gameOverElement.classList.add('hidden');
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed); // Start the game loop
}

// Update the score
function updateScore() {
  scoreElement.textContent = score;
  finalScoreElement.textContent = score;
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = 'lime';
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, box, box); // Draw each segment
    ctx.strokeStyle = 'darkgreen'; // Add border for better visuals
    ctx.strokeRect(part.x, part.y, box, box);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box,
    };

    // Increase speed slightly after eating food
    if (speed > 50) {
      speed -= 10; // Decrease interval for faster movement
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop(); // Remove the tail if no food eaten
  }

  snake.unshift(head); // Add new head to the snake
}

// Check for collisions
function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
    return true;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Game loop
function gameLoop() {
  if (gameOver) {
    clearInterval(gameInterval);
    gameOverElement.classList.remove('hidden');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawFood();
  drawSnake();
  moveSnake();

  if (checkCollision()) {
    gameOver = true;
    gameOverElement.classList.remove('hidden');
    clearInterval(gameInterval);
  }
}

// Handle direction change (keyboard)
document.addEventListener('keydown', e => {
  if (gameOver) return;

  if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -box };
  if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: box };
  if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -box, y: 0 };
  if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: box, y: 0 };
});

// Handle direction change (touch)
let touchStartX, touchStartY;

canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
});

canvas.addEventListener('touchend', e => {
  if (gameOver) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0 && direction.x === 0) direction = { x: box, y: 0 }; // Right
    if (dx < 0 && direction.x === 0) direction = { x: -box, y: 0 }; // Left
  } else {
    // Vertical swipe
    if (dy > 0 && direction.y === 0) direction = { x: 0, y: box }; // Down
    if (dy < 0 && direction.y === 0) direction = { x: 0, y: -box }; // Up
  }
});

// Start the game
startButton.addEventListener('click', () => {
  initializeGame();
});

// Restart the game
restartButton.addEventListener('click', () => {
  initializeGame();
});
