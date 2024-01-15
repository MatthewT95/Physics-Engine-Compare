let playerSpeed = 1;

function gameStepSimple() {
  if (gameRunning) {
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

setInterval(gameStepSimple, 1000 / 100);
