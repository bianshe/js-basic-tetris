document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const gameOverMessage = document.querySelector('#game-over');
  const startBtn = document.querySelector('#start-button');
  const restartBtn = document.querySelector('#restart-button');
  let score = 0;
  const width = 10;
  const height = 18;
  let timerId;
  const colors = [
    '#00cc00',
    '#0066ff',
    '#ff6600',
    '#cc00cc',
    '#ff0000',
    '#6600ff',
    '#00cc99',
    '#ff3377',
    '#ffcc00'
  ];

  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const lTetromino = [
    [width, width + 1, width + 2, 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width * 2, width, width + 1, width + 2],
    [0, 1, width + 1, width * 2 + 1]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino];

  let isOver = false;
  let isPaused = true;
  let currentPosition = 4;
  //let currentRotation = Math.floor(Math.random() * 4);
  let currentRotation = 0;
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let nextRandom = 0;
  let randomColor = Math.floor(Math.random() * colors.length);
  let nextRandomColor = Math.floor(Math.random() * colors.length);
  let current = theTetrominoes[random][currentRotation];

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[randomColor];
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = "";
    })
  }

  //timerId = setInterval(moveDown, 1000);

  function control(e) {
    if(!isPaused && !isOver){
      if(e.keyCode === 37) {
        moveLeft();
      }
      else if(e.keyCode === 38){
        rotate();
      }
      else if(e.keyCode === 39){
        moveRight();
      }
      else if(e.keyCode === 40){
        moveDown();
      }
    }
  }

  document.addEventListener('keyup', control);
  startBtn.innerHTML = "<i class='fas fa-play'></i> Start";

  function moveDown() {
    gameOver();
    if(!isPaused && !isOver){
      undraw();
      currentPosition += width;
      draw();
      freeze();
    }
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      randomColor = nextRandomColor;
      nextRandomColor = Math.floor(Math.random() * colors.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      addScore();
      draw();
      displayShape();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge) {
      currentPosition--;
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition++;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if(!isAtRightEdge) {
      currentPosition++;
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition--;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if(currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    //check for out of field before rotate
    if(current.some(index => (currentPosition + index) % width === 0)
    && current.some(index => (currentPosition + index) % width === width - 1)) {
      if(currentRotation === 0) {
        currentRotation = current.length - 1;
      }
      else {
        currentRotation--;
      }
      current = theTetrominoes[random][currentRotation];
    }
    draw();
  }


  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  const displayIndex = 0;


  const upNextTetromino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [displayWidth * 2, displayWidth * 2 + 1, displayWidth + 1, displayWidth + 2],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    [displayWidth, displayWidth + 1, displayWidth + 2, 2]
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = ''
    })

    upNextTetromino[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandomColor];
    })
  }

  startBtn.addEventListener('click', () => {
    if(isPaused) {
      isPaused = false;
      startBtn.innerHTML = "<i class='fas fa-pause'></i> Pause";
    }
    else {
      isPaused = true;
      startBtn.innerHTML = "<i class='fas fa-play'></i> Play";
    }
    if(timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    else if(isOver){
      restart();
    }
    else {
      draw();
      timerId = setInterval(moveDown, 1000);
      //nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      //nextRandomColor = Math.floor(Math.random() * colors.length);
      displayShape();
    }
  })

  function addScore() {
    for(let i = 0; i < 179; i+= width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = "";
        })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      //scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
      timerId = null;
      isOver = true;
      gameOverMessage.innerHTML = "Game Over!";
      startBtn.innerHTML = "<i class='fas fa-play'></i> Start";
    }
  }

  function restart() {
    clearInterval(timerId);
    score = 0;
    scoreDisplay.innerHTML = score;
    startBtn.innerHTML = "<i class='fas fa-pause'></i> Pause";
    isPaused = false;
    isOver = false;
    gameOverMessage.innerHTML = "";
    squares.forEach(square => {
      if(square.classList.contains('tetromino')) {
          square.style.backgroundColor = '';
          square.classList.remove('tetromino');
          square.classList.remove('taken');
      }
    });
    random = Math.floor(Math.random() * theTetrominoes.length);;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    randomColor = Math.floor(Math.random() * theTetrominoes.length);
    nextRandomColor = Math.floor(Math.random() * colors.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    timerId = setInterval(moveDown, 1000);
    displayShape();
  }

  restartBtn.addEventListener('click', () => {
    restart();
  })
})
