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
    { name: playerOneName, token: "X", score: 0 },
    { name: playerTwoName, token: "O", score: 0 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
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
        activePlayer.score++;
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
        activePlayer.score++;
        return true;
      }
    }

    // Check diagonals
    if (
      boardValues[0][0] &&
      boardValues[0][0] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][2]
    ) {
      activePlayer.score++;
      return true;
    }

    if (
      boardValues[0][2] &&
      boardValues[0][2] === boardValues[1][1] &&
      boardValues[1][1] === boardValues[2][0]
    ) {
      activePlayer.score++;
      return true;
    }

    return false;
  };

  const playRound = (r, c) => {
    board.dropToken(r, c, getActivePlayer().token);

    //winner logic would be handled here
    if (checkWinner()) {
      activePlayer.score--; //to prevent score from updating twice:(
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  const resetBoard = () => {
    activePlayer = players[0];
    for (let row of theBoard) {
      for (let cell of row) {
        cell.addToken(null); // Clear cell value
      }
    }
  };

  const getScores = () =>
    players.map((player) => ({ name: player.name, score: player.score }));

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWinner,
    getScores,
    resetBoard,
  };
}

(function ScreenController() {
  let game = GameController();
  const playerTurnText = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  //display dialog on page load
  const dialog = document.querySelector("#userInputDialog");
  window.addEventListener("DOMContentLoaded", () => {
    if (dialog) {
      dialog.showModal();
    }
  });

  //handle dialog form submission to recieve player names
  const submitFormButton = document.querySelector("#submit-btn");
  submitFormButton.addEventListener("click", (e) => {
    e.preventDefault(); //to prevent default behaviour of submit button

    const player1 = document.querySelector("#player1").value;
    const player2 = document.querySelector("#player2").value;

    if (player1.trim() === "" || player2.trim() === "") {
      document.querySelector(".error-msg").textContent =
        "Please enter both player names.";
      return;
    }

    // Update `game` with new player names
    game = GameController(player1, player2);

    // Close dialog
    dialog.close();

    // Update the screen to reflect the new game state
    updateScreen();
  });

  //handle round reset
  document.querySelector(".resetRoundButton").addEventListener("click", () => {
    game.resetBoard();
    updateScreen();
  });

  //handle game reset
  document.querySelector(".resetGameButton").addEventListener("click", () => {
    const player1 = document.querySelector("#player1").value;
    const player2 = document.querySelector("#player2").value;

    game = GameController(player1, player2); // Reinitialize the game
    updateScreen();

    dialog.showModal();
  });

  const updateScreen = () => {
    boardDiv.textContent = "";

    //get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnText.textContent = `${activePlayer.name}'s turn...`;
    document.querySelector(".player1-name-in-scoreboard").textContent =
      document.querySelector("#player1").value;
    document.querySelector(".player2-name-in-scoreboard").textContent =
      document.querySelector("#player2").value;

    // Update scores
    const scores = game.getScores();
    document.querySelector(".player1-score-in-scoreboard").textContent =
      scores[0].score;
    document.querySelector(".player2-score-in-scoreboard").textContent =
      scores[1].score;

    // Check for winner before rendering the board
    const winnerFound = game.checkWinner();

    //render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        //create a data attribute to identify the column and row to make it easier to pass in 'playRound' fucntion
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue();

        if (cell.getValue() === "X") {
          cellButton.style.color = "#d91656"; // Style "X" in red
        } else if (cell.getValue() === "O") {
          cellButton.style.color = "#ffb200"; // Style "O" in yellow
        }

        if (winnerFound) {
          playerTurnText.textContent = `${
            game.getActivePlayer().name
          } wins this round!`;
          setTimeout(() => {
            game.resetBoard();
            updateScreen();
          }, 1000);
          return;
        }

        // Disable already filled cells
        if (cell.getValue() !== null) {
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
