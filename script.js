const GameBoard = (() => {
  let board = [];

  const cleanBoard = () => {
    const tiles = document.querySelectorAll('td');
    for (let tile of tiles) {
      tile.textContent = '';
    }
  }

  const boardLength = () => {
    //count defined elements in array
    return GameBoard.board.reduce(len => len + 1, 0);
  }
  return {board, cleanBoard, boardLength};
})();

const playerFactory = (mark) => {
  const makeMove = (move) => {
    GameBoard.board[move] = mark;
    updateUI(move);
  }     
  const updateUI = (move) => {
    const tile = document.querySelector(`[data-index="${move}"]`);
    tile.innerHTML = mark
  }
  return {mark, makeMove};
} 

const GameController = (() => {
  const winnerPara = document.querySelector('.winner-text');
  let player1 = playerFactory('✖');
  let player2 = playerFactory('⬤');
  let currentPlayer = player1; 
  let winner;

  const init = () => {
    GameBoard.board = [];
    winnerPara.textContent = '';
    currentPlayer = player1;
    winner = null;
  } 

  const start = () => {

    const tiles = document.querySelectorAll('td');
    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        tileIndex = e.target.getAttribute('data-index');
        if (GameBoard.board[tileIndex] !== undefined) {
          return;
        }
        if (!winner && GameBoard.boardLength() < 9){
          currentPlayer.makeMove(tileIndex, GameBoard.board);
          if (checkGameOver()) {
            winnerPara.textContent = gameOverMsj();
            return;
          }
          currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
      })
    })

    const startBtn = document.querySelector('#start-btn');
    startBtn.onclick = () => {
      init();
      GameBoard.cleanBoard();
    }
  }

  const checkGameOver = () => {
    if (isTie()) {
      return true;
    }
    const winConditions = [[0, 1, 2], [3, 4, 5], 
                           [6, 7, 8], [0, 3, 6],
                           [1, 4, 7], [2, 5, 8],
                           [0, 4, 8], [2, 4, 6]]

    for (const indexes of winConditions) {
      let line = indexes.map(el => GameBoard.board[el]);
      let isWin = line.every(el => el === line[0] && el !== undefined)
      if (isWin) {
        winner = currentPlayer;
        return true;
      } 
    }
    return false;
  }

  const isTie = () => {
    if (GameBoard.boardLength() >= 9 && !winner) {
      return true;
    }
    return false;
  }

  const gameOverMsj = () => {
    if (isTie()) {
      return "it's a tie";
    }
    return `${winner === player1 ? 'Player ✖' : 'Player ⬤'} wins!`;
  }

  return {start};
})();

GameController.start();