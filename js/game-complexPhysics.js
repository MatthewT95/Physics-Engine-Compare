let playerVelocityX = 0;
let playerVelocityY = 0;
let acceleration = 0.01;

function gameStepComplex() {
  if (gameRunning) {
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
  }

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

setInterval(gameStepComplex, 1000 / 100);
