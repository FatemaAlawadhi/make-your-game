const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 1,
  1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 
  1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1,
  1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 
  1, 6, 6, 2, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 2, 6, 6, 1, 
  1, 1, 1, 2, 1, 2, 1, 1, 8, 7, 4, 9, 1, 1, 2, 1, 2, 1, 1, 1, 
  1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 
  1, 2, 1, 2, 5, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 5, 2, 1, 2, 1, 
  1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

document.addEventListener("DOMContentLoaded", function () {
  const start = document.querySelector(".StartButton");
  const grid = document.querySelector(".grid");
  const score = document.querySelector(".score");
  const timerElement = document.querySelector(".timer");
  const winSound = new Audio("../Sound/pacman_win.mp3");
  const deadSound = new Audio("../Sound/pacman_death.wav");
  const playButtonText = start.firstChild;
  const restart = document.querySelector(".RestartButton");
  const submit = document.querySelector(".SubmitButton");
  const moveInterval = 190; // Pacman Speed in milliseconds
  const directionMap = {
    right: "left",
    left: "right",
    up: "down",
    down: "up",
  };
  const ghosts = {
    1: "ghostOne",
    2: "ghostTwo",
    3: "ghostThree",
    4: "ghostFour",
  };

 // let foundGhost = null;
  let Flee = false;
  let livesNumber = 2;
  let pacman = {
    Position: 250, 
    direction: null, 
  };
  let ghostOne = {
    Position: 170, 
    direction: null, 
    changeDirection: null,
    DefaultPosition: 170,
    ghostName: "ghostOne",
  };
  let ghostTwo = {
    Position: 169, 
    direction: null, 
    changeDirection: null,
    DefaultPosition: 169,
    ghostName: "ghostTwo",
  };
  let ghostThree = {
    Position: 168,
    direction: null, 
    changeDirection: null,
    DefaultPosition: 168,
    ghostName: "ghostThree",
  };
  let ghostFour = {
    Position: 171,
    direction: null, 
    changeDirection: null,
    DefaultPosition: 171,
    ghostName: "ghostFour",
  };
  let timer = 60;
  let scoreNumber = 0;
  let timerInterval;
  let gameRunning = false;
  let lastFrameTime = performance.now();
  let frameInterval = 500;
  let gridSquare;
  let Cinterval = 420;
  let moving = false;
  let lastMoveTime = 0;
  let isSick = false;
  const Ghosts = [ghostOne, ghostTwo, ghostThree, ghostFour];

  start.addEventListener("click", StartGame);
  restart.addEventListener("click", ResetGame);
  submit.addEventListener("click", function() {
    AddScore(score.textContent,timerElement.textContent);
  });
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  requestAnimationFrame(gameLoop);

  //creating all the small squares within the grid
  CreateGrid();
  function CreateGrid() {
    for (let i = 0; i < layout.length; i++) {
      const div = document.createElement("div");
      div.classList.add("gridSquare");
      grid.appendChild(div);
    }

    gridSquare = document.querySelectorAll(".gridSquare");
    GridSize();
    assignGrid();
    window.addEventListener("resize", GridSize);
  }

  function GridSize() {
    const game = document.querySelector(".game");
    const width = game.offsetWidth;
    const height = game.offsetHeight;

    if (width < height) {
      grid.style.width = `${90}%`;
      const gridWidthPx = grid.offsetWidth;
      grid.style.height = `${gridWidthPx}px`;
    } else {
      grid.style.height = `${90}%`;
      const gridHeightPx = grid.offsetHeight;
      grid.style.width = `${gridHeightPx}px`;
    }

    gridSquare.forEach((square) => {
      const squareSize = `${5}%`;
      square.style.width = squareSize;
      square.style.height = squareSize;
    });
  }

  function assignGrid() {
    for (let i = 0; i < layout.length; i++) {
      if (layout[i] === 1) {
        gridSquare[i].classList.add("wall");
      } else if (layout[i] === 2) {
        gridSquare[i].classList.add("food");
      } else if (layout[i] === 3) {
        gridSquare[i].classList.add("pacmanRight");
      } else if (layout[i] === 5) {
        gridSquare[i].classList.add("pill");
      } else if (layout[i] === 6) {
        gridSquare[i].classList.add("warp");
      } else if (layout[i] === 4) {
        gridSquare[i].classList.add("ghostOne");
        //ghostOne.ghostIndex = i
      } else if (layout[i] === 7) {
        gridSquare[i].classList.add("ghostTwo");
        //ghostTwo.ghostIndex = i
      } else if (layout[i] === 8) {
        gridSquare[i].classList.add("ghostThree");
        //ghostThree.ghostIndex = i
      } else if (layout[i] === 9) {
        gridSquare[i].classList.add("ghostFour");
        //ghostFour.ghostIndex = i
      }
    }
  }

  const foodSquares = document.querySelectorAll(".gridSquare.food");
  let numberOfFood = foodSquares.length;

  function moveGhost(ghost, ghostName) {
    if (!gameRunning) return;
    // Check adjacent grid squares for valid directions
    let validDirections = [];
    let currentPosition = ghost.Position;
    let leftPosition = currentPosition - 1;
    let rightPosition = currentPosition + 1;
    let upPosition = currentPosition - 20;
    let downPosition = currentPosition + 20;

    if (isValid(ghost, leftPosition)) {
      validDirections.push("left");
    }
    if (isValid(ghost, rightPosition)) {
      validDirections.push("right");
    }
    if (isValid(ghost, upPosition)) {
      validDirections.push("up");
    }
    if (isValid(ghost, downPosition)) {
      validDirections.push("down");
    }

    // Update direction based on valid directions
    ghost.direction = chooseDirectionWithPacman(
      ghost,
      validDirections,
      ghost.prevDirection
    );
    ghost.prevDirection = ghost.direction;
    // Update next position based on the new direction
    let ghostNewPosition = currentPosition;
    if (ghost.direction === "left") {
      ghostNewPosition = leftPosition;
    } else if (ghost.direction === "right") {
      ghostNewPosition = rightPosition;
    } else if (ghost.direction === "up") {
      ghostNewPosition = upPosition;
    } else if (ghost.direction === "down") {
      ghostNewPosition = downPosition;
    }
    gridSquare[currentPosition].classList.remove(ghostName);
    gridSquare[ghostNewPosition].classList.add(ghostName);
    ghost.Position = ghostNewPosition;
  }

  function Fleeg(pacIndex) {
    //console.log("im here");
    const toggleInterval = setInterval(() => {
      gridSquare[pacIndex].classList.toggle("ghostDead");
      gridSquare[pacIndex].classList.toggle("ghostFlee");
    }, 100);

    setTimeout(() => {
      clearInterval(toggleInterval);
      gridSquare[pacIndex].classList.remove("ghostDead");
      gridSquare[pacIndex].classList.remove("ghostFlee");
    }, 1000);
    const Ghosts = [ghostOne, ghostTwo, ghostThree, ghostFour];

    let foundGhost = null;
    for (let i = 0; i < Ghosts.length; i++) {
     
      const ghost = Ghosts[i];
      if (ghost.Position === pacIndex) {
        
        foundGhost = ghost;
        if (i < Ghosts.length - 1) {
          foundGhost.ghostName = ghosts[i+1];
          console.log(foundGhost.ghostName);
        } else {
          foundGhost.ghostName = "ghostFour"; // Set a default name for the last ghost
        }
        console.log(foundGhost.ghostName);
        gridSquare[foundGhost.Position].classList.remove(foundGhost.ghostName);
        foundGhost.Position = foundGhost.DefaultPosition;
        gridSquare[foundGhost.Position].classList.add(foundGhost.ghostName);

        break;
      }
    }
  }

  function isValid(ghost, newPosition) {
    const Ghosts = ["ghostOne", "ghostTwo", "ghostThree", "ghostFour"];
    if ((gridSquare[newPosition].classList.contains("wall")) || (newPosition== 158 )|| (newPosition == 141 )){
      return false;
    } else if (
      Ghosts.some(
        (ghostName) =>
          ghostName !== ghost.name &&
          gridSquare[newPosition].classList.contains(ghostName)
      )
    ) {
      return false;
    } else {
      return true; // Valid move if the square is empty
    }
  }

  function chooseDirectionWithPacman(ghost, validDirections, prevDirection) {
    for (const direction of validDirections) {
      const currentPosition = ghost.Position;
      let newPosition = currentPosition;

      if (direction === "left") {
        newPosition = currentPosition - 1;
      } else if (direction === "right") {
        newPosition = currentPosition + 1;
      } else if (direction === "up") {
        newPosition = currentPosition - 20;
      } else if (direction === "down") {
        newPosition = currentPosition + 20;
      }

      if (
        (gridSquare[newPosition].classList.contains("pacmanRight") ||
          gridSquare[newPosition].classList.contains("pacmanLeft") ||
          gridSquare[newPosition].classList.contains("pacmanUp") ||
          gridSquare[newPosition].classList.contains("pacmanDown")) &&
        !Flee
      ) {
        return direction;
      }
    }
    const mappedPrevDirection = directionMap[prevDirection];
    if (
      validDirections.includes(mappedPrevDirection) &&
      validDirections.length > 1
    ) {
      validDirections = validDirections.filter(
        (direction) => direction !== mappedPrevDirection
      );
    }
    //If pacman is not found, choose a random direction
    return validDirections[Math.floor(Math.random() * validDirections.length)];
  }

  function StartGame() {
    if (playButtonText.textContent === "P L A Y") {
     // ResetGame();
       ActiveGame();
      playButtonText.textContent = "P O U S E";
    } else if (playButtonText.textContent === "P O U S E") {
      gameRunning = false;
      clearInterval(timerInterval);
      playButtonText.textContent = "CONTINUE";
    } else if (playButtonText.textContent === "CONTINUE") {
      gameRunning = true;
      timerInterval = setInterval(updateTimer, 1000);
      playButtonText.textContent = "P O U S E";
    } else if (playButtonText.textContent === "PLAY AGAIN") {
      ResetGame();
      ActiveGame();
      playButtonText.textContent = "P O U S E";
    }
  }

  function gameLoop(timestamp) {
    if (gameRunning) {
      //For Pacman movement
      if (moving) {
        if (timestamp - lastMoveTime >= moveInterval) {
          movePacman();
          lastMoveTime = timestamp;
        }
      }

      //For ghost movement
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        moveGhost(ghostOne, ghostOne.ghostName);
        moveGhost(ghostTwo, ghostTwo.ghostName);
        moveGhost(ghostThree, ghostThree.ghostName);
        moveGhost(ghostFour, ghostFour.ghostName);
        lastFrameTime = currentTime;
      }
      if (deltaTime >= Cinterval) {
        Check();
      }
    }
    requestAnimationFrame(gameLoop);
  }

  function Check() {
    if (
      (ghostOne.Position == pacman.Position &&
        ghostOne.ghostName == "ghostOne") ||
      (ghostTwo.Position == pacman.Position &&
        ghostTwo.ghostName == "ghostTwo") ||
      (ghostThree.Position == pacman.Position &&
        ghostThree.ghostName == "ghostThree") ||
      (ghostFour.Position == pacman.Position &&
        ghostFour.ghostName == "ghostFour")
    ) {
      loss(pacman.Position);
    }

    if (gridSquare[pacman.Position].classList.contains("ghostFlee")) {
      Fleeg(pacman.Position);
    }
  }

  function ActiveGame() {
    gameRunning = true;
    assignGrid();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    timerElement.textContent = `${timer}s`;
    if (timer === 0) {
      clearInterval(timerInterval);
      EndGame();
    } else {
      timer--;
    }
  }

  function handleKeyDown(event) {
    if (gameRunning) {
      const { key } = event;

      // Set the direction based on the key pressed
      if (key === "ArrowRight") {
        pacman.direction = "right";
      } else if (key === "ArrowLeft") {
        pacman.direction = "left";
      } else if (key === "ArrowDown") {
        pacman.direction = "down";
      } else if (key === "ArrowUp") {
        pacman.direction = "up";
      }

      // Start continuous movement if not already moving
      moving = true;
    }
  }

  function handleKeyUp(event) {
    const { key } = event;

    // Stop continuous movement if the key released matches the current direction
    if (
      (key === "ArrowRight" && pacman.direction === "right") ||
      (key === "ArrowLeft" && pacman.direction === "left") ||
      (key === "ArrowDown" && pacman.direction === "down") ||
      (key === "ArrowUp" && pacman.direction === "up")
    ) {
      moving = false;
    }
  }

  function movePacman() {
    let pacmanNewPosition = pacman.Position;
    let Move;
    if (!gameRunning) return;

    // Update next position based on the current direction of Pacman
    if (pacman.direction === "right") {
      if (pacmanNewPosition == 158) {
        pacmanNewPosition -= 17;
        Move= true;
      } else {
      pacmanNewPosition += 1;
      Move = isValidMove(pacmanNewPosition);
      }
      if (Move) {
        ResetPacClasses();
        gridSquare[pacmanNewPosition].classList.add("pacmanRight");
        if (isSick) {
          gridSquare[pacmanNewPosition].classList.add("sickpacman");
        } else {
          RemoveSickPacman();
          gridSquare[pacmanNewPosition].classList.remove("sickpacman");
        }
        pacman.Position = pacmanNewPosition;
      }
    } else if (pacman.direction === "left") {
      if (pacmanNewPosition == 141) {
        pacmanNewPosition += 17;
        Move= true;
      } else {
      pacmanNewPosition -= 1;
      Move = isValidMove(pacmanNewPosition);
      }
      if (Move) {
        ResetPacClasses();
        gridSquare[pacmanNewPosition].classList.add("pacmanLeft");
        if (isSick) {
          gridSquare[pacmanNewPosition].classList.add("sickpacman");
        } else {
          RemoveSickPacman();
          gridSquare[pacmanNewPosition].classList.remove("sickpacman");
        }
        pacman.Position = pacmanNewPosition;
      }
    } else if (pacman.direction === "down") {
      pacmanNewPosition += 20;
      Move = isValidMove(pacmanNewPosition);
      if (Move) {
        ResetPacClasses();
        gridSquare[pacmanNewPosition].classList.add("pacmanDown");
        if (isSick) {
          gridSquare[pacmanNewPosition].classList.add("sickpacman");
        } else {
          RemoveSickPacman();
          gridSquare[pacmanNewPosition].classList.remove("sickpacman");
        }
        pacman.Position = pacmanNewPosition;
      }
    } else if (pacman.direction === "up") {
      pacmanNewPosition -= 20;
      Move = isValidMove(pacmanNewPosition);
      if (Move) {
        ResetPacClasses();
        gridSquare[pacmanNewPosition].classList.add("pacmanUp");
        if (isSick) {
          gridSquare[pacmanNewPosition].classList.add("sickpacman");
        } else {
          RemoveSickPacman();
          gridSquare[pacmanNewPosition].classList.remove("sickpacman");
        }
        pacman.Position = pacmanNewPosition;
      }
    }
  }

  function isValidMove(pacIndex) {
    if (gridSquare[pacIndex].classList.contains("wall")) {
      return false;
    } else if (gridSquare[pacIndex].classList.contains("food")) {
      gridSquare[pacIndex].classList.remove("food");
      scoreNumber = scoreNumber + 10;
      score.innerHTML = scoreNumber;
      numberOfFood--;
      if (numberOfFood === 0) {
        win();
      }
    } else if (gridSquare[pacIndex].classList.contains("pill")) {
      gridSquare[pacIndex].classList.remove("pill");
      changeToGhostFlee();
    } else if (gridSquare[pacIndex].classList.contains("ghostFlee")) {
      Fleeg(pacIndex);
      return true;
    }
    return true;
  }

  function win() {
    gameRunning = false;
    ShowForm("win") 
    scoreNumber = 0;
    playButtonText.textContent = "PLAY AGAIN";
    clearInterval(timerInterval);
    winSound.play();
  }

  function changeToGhostFlee() {
    Flee = true;
    gridSquare.forEach((element) => {
      // Remove the class "ghostOne" and add "fleeGhost"
      if (element.classList.contains(`ghostOne`)) {
        element.classList.remove(`ghostOne`);
        element.classList.add("ghostFlee");
      }
      if (element.classList.contains(`ghostTwo`)) {
        element.classList.remove(`ghostTwo`);
        element.classList.add("ghostFlee");
      }
      if (element.classList.contains(`ghostThree`)) {
        element.classList.remove(`ghostThree`);
        element.classList.add("ghostFlee");
      }
      if (element.classList.contains(`ghostFour`)) {
        element.classList.remove(`ghostFour`);
        element.classList.add("ghostFlee");
      }
    });
    ghostOne.ghostName = "ghostFlee";
    ghostTwo.ghostName = "ghostFlee";
    ghostThree.ghostName = "ghostFlee";
    ghostFour.ghostName = "ghostFlee";

    // Revert the class back to "ghostOne" after 10 seconds
    setTimeout(() => {
      gridSquare.forEach((element, index) => {
        // Remove the class "fleeGhost" and add "ghostOne"
        if (element.classList.contains("ghostFlee")) {
          element.classList.remove(`ghostFlee`);
          element.classList.add(`ghosts[${index + 1}]`);
        }
      });
      Flee = false;
      ghostOne.ghostName = "ghostOne";
      ghostTwo.ghostName = "ghostTwo";
      ghostThree.ghostName = "ghostThree";
      ghostFour.ghostName = "ghostFour";
    }, 10000);
  }

  function ResetPacClasses() {
    gridSquare[pacman.Position].classList.remove("pacmanUp");
    gridSquare[pacman.Position].classList.remove("pacmanRight");
    gridSquare[pacman.Position].classList.remove("pacmanDown");
    gridSquare[pacman.Position].classList.remove("pacmanLeft");
  }
  let canCallLoss = true;
  function loss() {
    if (!canCallLoss) return;

    if (livesNumber > 0 && gameRunning) {
      livesNumber -= 1;
    }

    const livesContainer = document.querySelector(".LivesContainer");
    const elementsToRemove = livesContainer.querySelectorAll(".Life");
    if (elementsToRemove.length > 0) {
      livesContainer.removeChild(elementsToRemove[0]);
    }

    if (livesNumber == 0) {
      EndGame();
    } else {
      canCallLoss = false;
      isSick = true;
      setTimeout(() => {
        isSick = false;
        canCallLoss = true;
      }, 2000);
    }
  }

  function EndGame() {
    gameRunning = false;
    ShowForm("loss")
    scoreNumber = 0;
    playButtonText.textContent = "PLAY AGAIN";
    clearInterval(timerInterval);
    deadSound.play();
  }

  function SetDefault() {
    pacman = {
      Position: 250, 
      direction: null, 
    };
    ghostOne = {
      Position: 170, 
      direction: null, 
      changeDirection: null,
      DefaultPosition: 170,
      ghostName: "ghostOne",
    };
    ghostTwo = {
      Position: 169, 
      direction: null, 
      prevDirection: null,
      DefaultPosition: 169,
      ghostName: "ghostTwo",
    };
    ghostThree = {
      Position: 168, 
      direction: null, 
      prevDirection: null,
      DefaultPosition: 168,
      ghostName: "ghostThree",
    };
    ghostFour = {
      Position: 171, 
      direction: null, 
      prevDirection: null,
      DefaultPosition: 171,
      ghostName: "ghostFour",
    };
    timer = 60;
    scoreNumber = 0;
    timerInterval;
    gameRunning = false;
    clearInterval(timerInterval);
    timerElement.textContent = `${timer}s`;
    score.textContent = `0`;
    numberOfFood = foodSquares.length;
  }

  function ResetGridClasses() {
    gridSquare.forEach((element) => {
      // Retrieve all the classes on the element
      const classes = Array.from(element.classList);
      classes.forEach((className) => {
        if (className !== "gridSquare") {
          element.classList.remove(className);
        }
      });
    });
  }

  function RemoveSickPacman() {
    gridSquare.forEach((element) => {
      // Retrieve all the classes on the element
      const classes = Array.from(element.classList);
      classes.forEach((className) => {
        if (className == "sickpacman") {
          element.classList.remove(className);
        }
      });
    });
  }

  function ResetGame() {
    SetDefault();
    ResetLives();
    playButtonText.textContent = "P L A Y";
    ResetGridClasses();
    RemoveForm() 
    assignGrid();
  }

  function ResetLives() {
    const livesContainer = document.querySelector(".LivesContainer");
    const life = document.createElement("div");
    life.className = "Life";
    life.innerHTML = '<img class="PacLifeImage" src="Style/Images/pacRight.svg">';
    while (livesNumber < 2) {
      const clone = life.cloneNode(true);
      livesContainer.appendChild(clone);
      ++livesNumber;
    }
  }
});
