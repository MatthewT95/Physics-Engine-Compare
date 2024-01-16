class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refreshWindow() {
  if (gameRunning) {
    ctx = gameWindow.getContext("2d");
    clear();
    drawTarget();
    drawPlayer(playerLocation);
    drawMines();
    drawText();
  }
}

function detectHover() {
  let distance = Math.sqrt(
    Math.pow(Math.abs(targetLocation.x - playerLocation.x), 2) +
      Math.pow(Math.abs(targetLocation.y - playerLocation.y), 2)
  );
  if (distance <= targetSize) {
    hoverTime += 0.1;
  } else {
    hoverTime = 0;
  }

  if (hoverTime >= passDuration) {
    nextLevel();
  }
}

function nextLevel() {
  level++;
  targetLocation = new Point(
    getRndInteger(20, gameWindow.width - 20),
    getRndInteger(20, gameWindow.height - 20)
  );
  addMines();
}

function clear() {
  ctx = gameWindow.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, gameWindow.width, gameWindow.height);
  ctx.stroke();
}

function drawPlayer(point) {
  ctx = gameWindow.getContext("2d");
  sprite = new Image();
  sprite.src = "./Images/ship.png";
  ctx.drawImage(
    sprite,
    point.x - sprite.width / 2,
    point.y - sprite.height / 2
  );
}

function drawMines(point) {
  ctx = gameWindow.getContext("2d");
  sprite = new Image();
  sprite.src = "./Images/mine.png";
  for (let i = 0; i < mines.length; i++) {
    //console.log(mines[i]);
    ctx.drawImage(
      sprite,
      mines[i]["Location"].x - 20 / 2,
      mines[i]["Location"].y - 20 / 2,
      20,
      20
    );
  }
}

function drawTarget() {
  ctx.beginPath();
  ctx.arc(
    targetLocation.x,
    targetLocation.y,
    targetSize,
    0,
    2 * Math.PI,
    false
  );
  ctx.fillStyle = "blue";
  ctx.fill();
}

function drawText() {
  ctx = gameWindow.getContext("2d");
  ctx.font = "24px Arial";
  ctx.fillStyle = "green";
  ctx.fillText("Level: " + level, 10, 30);
}

function addMines() {
  for (let i = 0; i < Math.floor((level - 1) / 2) + 1; i++) {
    let side = getRndInteger(0, 4);
    let mineLocation = new Point(0, 0);
    let mineDirection = "";
    if (side == 0) {
      mineLocation = new Point(16, getRndInteger(16, gameWindow.height - 16));
      mineDirection = "r";
    } else if (side == 1) {
      mineLocation = new Point(getRndInteger(16, gameWindow.width - 16), 16);
      mineDirection = "d";
    } else if (side == 2) {
      mineLocation = new Point(
        gameWindow.width - 16,
        getRndInteger(16, gameWindow.height - 16)
      );
      mineDirection = "l";
    } else if (side == 3) {
      mineLocation = new Point(
        getRndInteger(16, gameWindow.width - 16),
        gameWindow.height - 16
      );
      mineDirection = "u";
    }

    mines.push({ Direction: mineDirection, Location: mineLocation });
  }
}

function moveMines() {
  let mineSpeed = 3;
  if (gameRunning) {
    for (let i = 0; i < mines.length; i++) {
      if (mines[i]["Direction"] == "u") {
        mines[i]["Location"].y -= mineSpeed;
      } else if (mines[i]["Direction"] == "r") {
        mines[i]["Location"].x += mineSpeed;
      } else if (mines[i]["Direction"] == "d") {
        mines[i]["Location"].y += mineSpeed;
      } else if (mines[i]["Direction"] == "l") {
        mines[i]["Location"].x -= mineSpeed;
      }

      if (mines[i]["Location"].x <= 16) {
        mines[i]["Location"].x = 16;
        mines[i]["Direction"] = "r";
      }

      if (mines[i]["Location"].x >= gameWindow.width - 16) {
        mines[i]["Location"].x = gameWindow.width - 16;
        mines[i]["Direction"] = "l";
      }

      if (mines[i]["Location"].y <= 16) {
        mines[i]["Location"].y = 16;
        mines[i]["Direction"] = "d";
      }

      if (mines[i]["Location"].y >= gameWindow.height - 16) {
        mines[i]["Location"].y = gameWindow.height - 16;
        mines[i]["Direction"] = "u";
      }
    }
  }
}

function detectCollisionPlayerAndMines() {
  for (let i = 0; i < mines.length; i++) {
    let distance = Math.sqrt(
      Math.pow(Math.abs(mines[i].Location.x - playerLocation.x), 2) +
        Math.pow(Math.abs(mines[i].Location.y - playerLocation.y), 2)
    );
    if (distance < 20) {
      gameOver();
      ctx = gameWindow.getContext("2d");
      ctx.beginPath();
      ctx.arc(playerLocation.x, playerLocation.y, 20, 0, 2 * Math.PI, false);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        mines[i].Location.x,
        mines[i].Location.y,
        20,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "red";
      ctx.fill();
      break;
    }
  }
}

function gameOver() {
  gameRunning = false;
  ctx = gameWindow.getContext("2d");
  ctx.font = "48px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER - LEVEL " + level, 200, gameWindow.height / 2);
}

var pressedKeys = {};
window.onkeyup = function (e) {
  pressedKeys[e.keyCode] = false;
};
window.onkeydown = function (e) {
  pressedKeys[e.keyCode] = true;
};

function gameStepSimple() {
  let playerSpeed = 1;
  if (pressedKeys[65]) {
    playerLocation.x -= playerSpeed;
  }
  if (pressedKeys[68]) {
    playerLocation.x += playerSpeed;
  }
  if (pressedKeys[87]) {
    playerLocation.y -= playerSpeed;
  }
  if (pressedKeys[83]) {
    playerLocation.y += playerSpeed;
  }

  // Collision with wall detection
  if (playerLocation.x < 9) {
    playerLocation.x = 9;
  }

  if (playerLocation.x > gameWindow.width - 9) {
    playerLocation.x = gameWindow.width - 9;
  }

  if (playerLocation.y < 11) {
    playerLocation.y = 11;
  }

  if (playerLocation.y > gameWindow.height - 11) {
    playerLocation.y = gameWindow.height - 11;
  }
}

function gameStepComplex() {
  if (pressedKeys[65]) {
    playerVelocityX -= acceleration;
  }
  if (pressedKeys[68]) {
    playerVelocityX += acceleration;
  }
  if (pressedKeys[87]) {
    playerVelocityY -= acceleration;
  }
  if (pressedKeys[83]) {
    playerVelocityY += acceleration;
  }

  playerLocation.x += playerVelocityX;
  playerLocation.y += playerVelocityY;

  // Collision with wall detection
  if (playerLocation.x < 9) {
    playerLocation.x = 9;
    playerVelocityX = 0;
  }

  if (playerLocation.x > gameWindow.width - 9) {
    playerLocation.x = gameWindow.width - 9;
    playerVelocityX = 0;
  }

  if (playerLocation.y < 11) {
    playerLocation.y = 11;
    playerVelocityY = 0;
  }

  if (playerLocation.y > gameWindow.height - 11) {
    playerLocation.y = gameWindow.height - 11;
    playerVelocityY = 0;
  }
}

function gameStartSimple() {
  playerLocation = new Point(gameWindowWidth / 2, gameWindowHeight / 2);
  gameRunning = true;
  level = 1;
  mines = [];
  targetLocation = new Point(
    getRndInteger(20, gameWindow.width - 20),
    getRndInteger(20, gameWindow.height - 20)
  );
}

function gameStartComplex() {
  playerLocation = new Point(gameWindowWidth / 2, gameWindowHeight / 2);
  let playerVelocityX = 0;
  let playerVelocityY = 0;
  gameRunning = true;
  level = 1;
  mines = [];
  targetLocation = new Point(
    getRndInteger(20, gameWindow.width - 20),
    getRndInteger(20, gameWindow.height - 20)
  );
}

function gameStep() {
  if (gameRunning) {
    if (gameMode == "basic") {
      gameStepSimple();
    } else if (gameMode == "advanced") {
      gameStepComplex();
    }
  }
}

function newGame() {
  let gameSelectBox = document.getElementById("PhysicsModePlayer");
  gameMode = gameSelectBox.value;
  console.log(gameMode);
  if (gameMode == "basic") {
    gameStartSimple();
    gameRunning = true;
  } else if (gameMode == "advanced") {
    gameStartComplex();
    gameRunning = true;
  }
}

let targetSize = 20;
let hoverTime = 0;
let gameRunning = true;
let level = 1;
let passDuration = 1.5;
let mines = [];
let playerVelocityX = 0;
let playerVelocityY = 0;
let acceleration = 0.01;
let gameMode = "basic";

let gameWindowWidth = 1000;
let gameWindowHeight = 700;
let gameWindow = document.getElementById("gameWindow");
let playerLocation = new Point(gameWindowWidth / 2, gameWindowHeight / 2);
let targetLocation = new Point(
  getRndInteger(20, gameWindow.width - 20),
  getRndInteger(20, gameWindow.height - 20)
);

gameWindow.width = gameWindowWidth;
gameWindow.height = gameWindowHeight;
gameWindow.style.border = "Black solid 2px";

setInterval(refreshWindow, 1000 / 25);
setInterval(detectHover, 100);
setInterval(moveMines, 1000 / 10);
setInterval(detectCollisionPlayerAndMines, 1000 / 10);
setInterval(gameStep, 10);
