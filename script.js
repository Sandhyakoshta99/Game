//Program to implement snake game
//*@AUTHOR:SANDHYA KOSHTA     
// *@DATE : 05 January 2025      
// */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game buttons
const startButton = document.getElementById('startGameButton');
const pauseButton = document.getElementById('pauseGameButton');
const restartButton = document.getElementById('restartGameButton');

// Score elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const popupHighScoreElement = document.getElementById('popupHighScore');

// Popup and Lock Screen
const gameOverPopup = document.getElementById('gameOverPopup');
const lockScreen = document.getElementById('lockScreen');

// Joystick controls
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Grid and snake parameters
const box = 17; // Size of each grid cell
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake, food, direction, score, highScore, gameInterval, speed, paused, gameOver;

// Initialize the game
function initializeGame() {
  snake = [{ x: 5 * box, y: 5 * box }];
  food = generateFood();
  direction = { x: 0, y: 0 };
  score = 0;
  speed = 300;
  paused = false;
  gameOver = false;

  highScore = localStorage.getItem('highScore') || 0;
  highScoreElement.textContent = highScore;
  updateScore();
  hidePopup();
  startGameLoop();
}

// Generate random food location
function generateFood() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

// Update score
function updateScore() {
  scoreElement.textContent = score;
  finalScoreElement.textContent = score;
  popupHighScoreElement.textContent = highScore;
}

function drawSnake() {
  snake.forEach((segment, index) => {
    // Different color for the head and body
    ctx.fillStyle = index === 0 ? '#298c2c' : '#1aa305'; // Head (teal) and body (green)
    ctx.fillRect(segment.x, segment.y, box, box);

    // Add a border around each segment for a "blocky" attractive look
    ctx.strokeStyle = '#ecf0f1'; // Light gray border
    ctx.strokeRect(segment.x, segment.y, box, box);

    // Draw larger, attractive eyes for the snake's head
    if (index === 0) {
      ctx.fillStyle = '#fff'; // White for eyes
      ctx.beginPath();
      ctx.arc(
        segment.x + box / 4, 
        segment.y + box / 3, 
        box / 6, 
        0, 
        Math.PI * 2
      ); // Left eye
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(
        segment.x + (3 * box) / 4, 
        segment.y + box / 3, 
        box / 6, 
        0, 
        Math.PI * 2
      ); // Right eye
      ctx.fill();

      // Add pupils to the eyes
      ctx.fillStyle = '#000'; // Black pupils
      ctx.beginPath();
      ctx.arc(
        segment.x + box / 4, 
        segment.y + box / 3, 
        box / 12, 
        0, 
        Math.PI * 2
      ); // Left pupil
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        segment.x + (3 * box) / 4, 
        segment.y + box / 3, 
        box / 12, 
        0, 
        Math.PI * 2
      ); // Right pupil
      ctx.fill();
    }
  });
}


// Draw food
function drawFood() {
  ctx.fillStyle = '#ff4757'; // Food color
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, (box * 0.6), 0, Math.PI * 2); // Larger food
  ctx.fill();
  ctx.closePath();
}


// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();

    // Generate new food
    food = generateFood();

    // Increase speed slightly as the score increases
    if (speed > 50) {
      speed -= 5;
      restartGameLoop(); // Adjust interval for increased speed
    }

    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
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

  // Self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Main game loop
function gameLoop() {
  if (paused || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawFood();
  drawSnake();
  moveSnake();

  if (checkCollision()) {
    endGame();
  }
}

// Start the game loop
function startGameLoop() {
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

// Restart the game loop
function restartGameLoop() {
  clearInterval(gameInterval);
  startGameLoop();
}

// End the game
function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  showPopup();
}

// Show the "Game Over" popup
function showPopup() {
  gameOverPopup.classList.remove('hidden');
}

// Hide the "Game Over" popup
function hidePopup() {
  gameOverPopup.classList.add('hidden');
}

// Lock screen functionality
function lockScreenHandler() {
  lockScreen.classList.remove('hidden');
}

function unlockScreenHandler() {
  lockScreen.classList.add('hidden');
}

// Event listeners for lock screen
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lockScreenHandler();
    paused = true;
  }
});

document.addEventListener('click', unlockScreenHandler);
document.addEventListener('keydown', unlockScreenHandler);

// Direction controls using keyboard
document.addEventListener('keydown', e => {
  if (gameOver || paused) return;

  if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -box };
  if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: box };
  if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -box, y: 0 };
  if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: box, y: 0 };
});

// Joystick controls
upButton.addEventListener('click', () => {
  if (direction.y === 0) direction = { x: 0, y: -box };
});

downButton.addEventListener('click', () => {
  if (direction.y === 0) direction = { x: 0, y: box };
});

leftButton.addEventListener('click', () => {
  if (direction.x === 0) direction = { x: -box, y: 0 };
});

rightButton.addEventListener('click', () => {
  if (direction.x === 0) direction = { x: box, y: 0 };
});

// Start the game
startButton.addEventListener('click', () => {
  initializeGame();
  startButton.disabled = true;
  pauseButton.disabled = false;
});

// Pause the game
pauseButton.addEventListener('click', () => {
  paused = !paused;
  if (!paused) {
    restartGameLoop();
  } else {
    clearInterval(gameInterval);
  }
});

// Restart the game
restartButton.addEventListener('click', () => {
  initializeGame();
  startButton.disabled = true;
  pauseButton.disabled = false;
});


function resizeCanvas() {
  const canvasWidth = window.innerWidth * 2.9; // 90% of window width
  const canvasHeight = window.innerHeight * 2.7; // 60% of window height
  // canvas.width = canvasWidth;
  // canvas.height = canvasHeight;
  canvas.width = Math.floor(window.innerWidth * 0.8 / box) * box;
 canvas.height = Math.floor(window.innerHeight * 0.8 / box) * box;

  
  // Update grid size based on canvas size
  rows = Math.floor(canvas.height / box);
  cols = Math.floor(canvas.width / box);

  // Reinitialize game if necessary (e.g., adjust food and snake size)
  if (!gameOver) {
    initializeGame();
  }
}

// Call resizeCanvas on window resize
window.addEventListener('resize', resizeCanvas);

// Initial canvas resize
resizeCanvas();
 


