const gameBoard = document.getElementById("gameCanvas");
const gameBoard_ctx = gameBoard.getContext("2d");
var startButton = document.getElementById("startButton");

var changing_direction = false;
var dx = 10;
var dy = 0;
var food_x;
var food_y;
var score = 0;

var snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

function clearCanvas() {
  gameBoard_ctx.fillStyle = "black";
  gameBoard_ctx.strokestyle = "red";
  gameBoard_ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
  gameBoard_ctx.strokeRect(0, 0, gameBoard.width, gameBoard.height);
}

function drawSnakePart(snakePart) {
  gameBoard_ctx.fillStyle = "green";
  gameBoard_ctx.strokestyle = "darkblue";
  gameBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  gameBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function move_snake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 1;
    document.getElementById("score").innerHTML = "Your score is: " + score;
    gen_food();
  } else {
    snake.pop();
  }
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function has_game_ended() {
  for (var i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameBoard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameBoard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
  // Generate a random number the food x-coordinate
  food_x = random_food(0, gameBoard.width - 10);
  // Generate a random number for the food y-coordinate
  food_y = random_food(0, gameBoard.height - 10);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function drawFood() {
  gameBoard_ctx.fillStyle = "red";
  gameBoard_ctx.strokestyle = "red";
  gameBoard_ctx.fillRect(food_x, food_y, 10, 10);
  gameBoard_ctx.strokeRect(food_x, food_y, 10, 10);
}

gen_food();
function main() {
  startButton.style.display = "none";
  if (has_game_ended()) {
    alert("Game Over! " + document.getElementById("score").innerHTML);
    location.reload();
    return;
  }
  changing_direction = false;

  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    move_snake();
    drawSnake();
    main();
  }, 100);
}
document.addEventListener("keydown", change_direction);
startButton.addEventListener("click", main);
