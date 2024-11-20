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
  let value = 0;

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

  const playRound = (r, c) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into row ${r} and column ${c}...`
    );
    board.dropToken(r, c, getActivePlayer().token);

    //winner logic would be handled here

    switchPlayerTurn();
    printNewRound();
  };
  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();

game.playRound(1, 1);
game.playRound(0, 0);
