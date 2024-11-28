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
        console.log(
          `${getActivePlayer().name} wins with token "${boardValues[i][0]}"!`
        );
      }
    }

    //check columns
    for (let i = 0; i < 3; i++) {
      if (
        boardValues[0][i] &&
        boardValues[0][i] === boardValues[1][i] &&
        boardValues[1][i] === boardValues[2][1]
      ) {
        console.log(
          `${getActivePlayer().name} wins with token "${boardValues[0][i]}"!`
        );
      }
    }

    // Check diagonals
    if (
      boardValues[0][0] &&
      boardValues[0][0] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][2]
    ) {
      console.log(
        `${getActivePlayer().name} wins with token "${boardValues[0][0]}"!`
      );
    }

    if (
      boardValues[0][2] &&
      boardValues[0][2] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][0]
    ) {
      console.log(
        `${getActivePlayer().name} wins with token "${boardValues[0][2]}"!`
      );
    }
  };

  const playRound = (r, c) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into row ${r} and column ${c}...`
    );
    board.dropToken(r, c, getActivePlayer().token);

    //winner logic would be handled here
    checkWinner();

    switchPlayerTurn();
    printNewRound();
  };
  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

// const game = GameController();

// game.playRound(1, 1);
// game.playRound(0, 0);
// game.playRound(2, 0);
// game.playRound(0, 1);
// game.playRound(2, 2);
// game.playRound(1, 2);
// game.playRound(2, 1);

function ScreenController() {
  const game = GameController();
  const playerTurnText = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    //get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnText.textContent = `${activePlayer.name}'s turn...`;

    //render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        //create a data attribute to identify the column to make it easier to pass in our 'playRound' fucntion
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  //Add event listener fr the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    //make sure i've clicked a column and not a gap in between
    if (!selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  //initial render
  updateScreen();
}
ScreenController();
