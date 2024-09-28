const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let playerMoves = { X: [], O: [] };

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // Place the current player's symbol (X or O) in the clicked cell
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    // Track the move for the current player
    trackMoves(clickedCellIndex);

    // Ensure the player has only 3 moves on the board
    if (playerMoves[currentPlayer].length > 3) {
        removeOldestMove();
    }

    // Check if there is a winner before switching the player
    checkWinner();

    // Only switch the player if the game is still active
    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        // Highlight the oldest move if the next player already has 3 moves
        if (playerMoves[currentPlayer].length === 3) {
            indicateOldestMove();
        }
    }
}

function trackMoves(cellIndex) {
    playerMoves[currentPlayer].push(cellIndex);
}

function indicateOldestMove() {
    if (playerMoves[currentPlayer].length === 3) {
        const oldestMove = playerMoves[currentPlayer][0];
        cells[oldestMove].classList.add('about-to-remove');
    }
}

function removeOldestMove() {
    if (playerMoves[currentPlayer].length > 3) {
        const oldestMove = playerMoves[currentPlayer].shift();
        gameState[oldestMove] = "";
        cells[oldestMove].innerHTML = "";
        cells[oldestMove].classList.remove('about-to-remove');
    }
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        setTimeout(() => alert(`Player ${currentPlayer} has won!`), 100);
        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        setTimeout(() => alert('It\'s a draw!'), 100);
        return;
    }
}

function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    playerMoves = { X: [], O: [] };
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('about-to-remove');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
