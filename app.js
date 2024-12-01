//function to represent state of the board
function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  //using a for loop to create a 2D array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (r, c, player) => {
    board[r][c].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard };
}

//function that represents each square on the board
function Cell() {
  let value = null;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

//function for controlling the flow and state of the game's turns, as well as whether anybody has won the game
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = gameBoard();
  const theBoard = board.getBoard();

  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  //function to handle winning logic
  const checkWinner = () => {
    const winnerTextDiv = document.querySelector(".winner");
    const boardValues = theBoard.map((row) =>
      row.map((cell) => cell.getValue())
    );

    //check rows
    for (let i = 0; i < 3; i++) {
      if (
        boardValues[i][0] &&
        boardValues[i][0] === boardValues[i][1] &&
        boardValues[i][1] === boardValues[i][2]
      ) {
        winnerTextDiv.textContent = `${
          getActivePlayer().name
        } wins with token "${boardValues[i][0]}"`;
        return true;
      }
    }

    //check columns
    for (let i = 0; i < 3; i++) {
      if (
        boardValues[0][i] &&
        boardValues[0][i] === boardValues[1][i] &&
        boardValues[1][i] === boardValues[2][i]
      ) {
        winnerTextDiv.textContent = `${
          getActivePlayer().name
        } wins with token "${boardValues[0][i]}"`;
        return true;
      }
    }

    // Check diagonals
    if (
      boardValues[0][0] &&
      boardValues[0][0] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][2]
    ) {
      winnerTextDiv.textContent = `${getActivePlayer().name} wins with token "${
        boardValues[0][0]
      }"`;
      return true;
    }

    if (
      boardValues[0][2] &&
      boardValues[0][2] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][0]
    ) {
      winnerTextDiv.textContent = `${getActivePlayer().name} wins with token "${
        boardValues[0][2]
      }"`;
      return true;
    }

    return false;
  };

  const playRound = (r, c) => {
    board.dropToken(r, c, getActivePlayer().token);

    //winner logic would be handled here
    if (checkWinner()) {
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };
  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard, checkWinner };
}

(function ScreenController() {
  const game = GameController();
  const playerTurnText = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    //get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnText.textContent = `${activePlayer.name}'s turn...`;

    // Check for winner before rendering the board
    const winnerFound = game.checkWinner();

    //render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        //create a data attribute to identify the column and row to make it easier to pass in our 'playRound' fucntion
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue();

        // Disable all cells if the game has ended (winner found or game over)
        if (winnerFound || cell.getValue() !== null) {
          cellButton.disabled = true;
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  //Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    // Ensure the click is on a valid cell and not gaps
    if (!selectedRow || !selectedColumn) return;

    game.playRound(Number(selectedRow), Number(selectedColumn));
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  //initial render
  updateScreen();
})();
