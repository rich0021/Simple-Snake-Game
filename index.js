const container = document.getElementById("grid");
const bound = document.getElementById("bound");
const amount = 20;
const gap = 5;
const colSize = window.innerWidth / amount;
const rowSize = window.innerHeight / amount;
const boxSizeX = colSize - gap;
const boxSizeY = rowSize - gap;
const speed = 1000;
let direction = "left";
let interval;
let playState = true;

let snake = [
  { x: 3, y: 9, color: "blue" },
  { x: 2, y: 9, color: "green" },
];

let apple = {
  x: Math.floor(Math.random() * 18) + 3,
  y: Math.floor(Math.random() * 18) + 3,
};

window.onload = function () {
  //set red boundary size
  bound.style.width = `${colSize * 18}px`;
  bound.style.height = `${rowSize * 18}px`;

  //set grid row and column
  container.style.gridTemplateColumns = `repeat(${amount}, ${colSize}px)`;
  container.style.gridTemplateRows = `repeat(${amount}, ${rowSize}px)`;

  //render first snake and apple
  renderSnake();
  renderApple();

  //game loop
  interval = setInterval(() => {
    renderFrame();
  }, speed);

  //snake control
  window.addEventListener("keyup", function (e) {
    if (
      (e.key == "w" && direction != "down") ||
      (e.key == "ArrowUp" && direction != "down")
    ) {
      direction = "top";
      eagerRender();
    }
    if (
      (e.key == "s" && direction != "top") ||
      (e.key == "ArrowDown" && direction != "top")
    ) {
      direction = "bottom";
      eagerRender();
    }
    if (
      (e.key == "a" && direction != "left") ||
      (e.key == "ArrowLeft" && direction != "left")
    ) {
      direction = "right";
      eagerRender();
    }
    if (
      (e.key == "d" && direction != "right") ||
      (e.key == "ArrowRight" && direction != "right")
    ) {
      direction = "left";
      eagerRender();
    }
  });
};

function addSnake() {
  snake.push({ color: "green" });
  eagerRender();
}

//add snake to grid
function renderSnake() {
  snake.forEach((item, index) => {
    let part = document.createElement("div");
    part.style.gridColumn = item.x;
    part.style.gridRow = item.y;
    part.style.backgroundColor = item.color;
    part.style.width = `${boxSizeX}px`;
    part.style.height = `${boxSizeY}px`;
    if (index == 0) {
      part.style.zIndex = "10";
    }
    container.appendChild(part);
  });
}

function renderApple() {
  let part = document.createElement("div");
  part.style.gridColumn = apple.x;
  part.style.gridRow = apple.y;
  part.style.backgroundColor = "red";
  part.style.width = `${boxSizeX}px`;
  part.style.height = `${boxSizeY}px`;
  container.appendChild(part);
}

//move snake
function moveSnake(direction) {
  let prev;
  let temp;
  if (direction == "left") {
    snake = snake.map((item, index) => {
      if (index == 0) {
        prev = { ...item };
        return {
          ...item,
          x: item.x + 1,
        };
      } else {
        temp = { ...prev, color: item.color };
        prev = { ...item };
        return temp;
      }
    });
  }
  if (direction == "right") {
    snake = snake.map((item, index) => {
      if (index == 0) {
        prev = { ...item };
        return {
          ...item,
          x: item.x - 1,
        };
      } else {
        temp = { ...prev, color: item.color };
        prev = { ...item };
        return temp;
      }
    });
  }
  if (direction == "top") {
    snake = snake.map((item, index) => {
      if (index == 0) {
        prev = { ...item };
        return {
          ...item,
          y: item.y - 1,
        };
      } else {
        temp = { ...prev, color: item.color };
        prev = { ...item };
        return temp;
      }
    });
  }
  if (direction == "bottom") {
    snake = snake.map((item, index) => {
      if (index == 0) {
        prev = { ...item };
        return {
          ...item,
          y: item.y + 1,
        };
      } else {
        temp = { ...prev, color: item.color };
        prev = { ...item };
        return temp;
      }
    });
  }
}

function isCollisionBox() {
  let head = snake[0];
  if (head.x > 19 || head.y > 19 || head.x < 2 || head.y < 2) {
    playState = false;
    clearInterval(interval);
    setTimeout(() => {
      alert("Game Over");
      location.reload();
    });
  }
}

function isCollisionBody() {
  let head = snake[0];
  snake.forEach((item, index) => {
    if (head.x == item.x && head.y == item.y && index != 0) {
      playState = false;
      clearInterval(interval);
      setTimeout(() => {
        alert("Game Over");
        location.reload();
      });
    }
  });
}

function isCollisionApple() {
  let head = snake[0];
  if (head.x == apple.x && head.y == apple.y) {
    addSnake();
    spawnApple();
  }
}

function spawnApple() {
  apple.x = Math.floor(Math.random() * 18) + 3;
  apple.y = Math.floor(Math.random() * 18) + 3;
}

function renderFrame() {
  container.innerHTML = "";
  moveSnake(direction);
  isCollisionBox();
  isCollisionBody();
  isCollisionApple();
  renderSnake();
  renderApple();
}

function eagerRender() {
  setTimeout(() => {
    if (playState) {
      clearInterval(interval);
      renderFrame();
      interval = setInterval(() => {
        renderFrame();
      }, speed);
    }
  });
}
