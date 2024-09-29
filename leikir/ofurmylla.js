const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let freeBoardMode = false;
let gameState = {
    0: ["", "", "", "", "", "", "", "", ""], // Board 0 state
    1: ["", "", "", "", "", "", "", "", ""], // Board 1 state
    2: ["", "", "", "", "", "", "", "", ""], // Board 2 state
    3: ["", "", "", "", "", "", "", "", ""], // Board 3 state
    4: ["", "", "", "", "", "", "", "", ""], // Board 4 state
    5: ["", "", "", "", "", "", "", "", ""], // Board 5 state
    6: ["", "", "", "", "", "", "", "", ""], // Board 6 state
    7: ["", "", "", "", "", "", "", "", ""], // Board 7 state
    8: ["", "", "", "", "", "", "", "", ""], // Board 8 state
};
let activeBoard = 4; // Set Board 4 as the active board at the start
let playerMoves = { X: [], O: [] };
let wonBoards = {}; // Track which boards have been won
let bigBoard = ["", "", "", "", "", "", "", "", ""]; // Track overall board status

// Define winning combinations (for both small and big boards)
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Select the board to activate
const boards = document.querySelectorAll('.board');

// Highlight the initial active board (Board 4)
highlightActiveBoard(activeBoard);

boards.forEach((board, index) => {
    board.addEventListener('click', () => {
        if (gameActive && activeBoard === null) {
            // Set the active board
            activeBoard = index;
            highlightActiveBoard(activeBoard); // Highlight the selected board
            console.log(`Board ${index} is now active`);
        }
    });
});

// Handle cell click events
cells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
        const [boardIndex, cellIndex] = event.target.id.split('-').slice(1).map(Number);

        // Allow clicking on any non-won board if freeBoardMode is true
        if (!gameActive || (!freeBoardMode && activeBoard !== boardIndex) || gameState[boardIndex][cellIndex] !== "" || wonBoards[boardIndex]) {
            return; // Prevent further moves on won boards or invalid cells
        }

        // Make the move
        gameState[boardIndex][cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        // Check if the current player has won the current board
        if (checkBoardWinner(boardIndex)) {
            console.log(`${currentPlayer} has won Board ${boardIndex}`);
            wonBoards[boardIndex] = currentPlayer; // Mark the board as won
            bigBoard[boardIndex] = currentPlayer;  // Update the big board with the winner of the small board
            turnBoardIntoWinner(boardIndex, currentPlayer); // Turn the board into X or O

            // Check if the current player has won 3 boards in a row (overall winner)
            if (checkBigBoardWinner()) {
                console.log(`${currentPlayer} has won the game!`);
                endGame();  // End the game when a player wins 3 boards in a row
                return; // Do not switch the active board if the game is won
            }
        }

        // Set the next active board based on the clicked cell's index
        if (wonBoards[cellIndex]) {
            freeBoardMode = true; // Allow clicking on any non-won board
            highlightNonWonBoards();  // Highlight all boards that haven't been won
        } else {
            freeBoardMode = false; // Return to normal mode, where a specific board is active
            activeBoard = cellIndex; // Set the board corresponding to the cell index as the active board
            highlightActiveBoard(activeBoard); // Highlight the newly active board
        }

        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    });
});

// Restart the game
restartBtn.addEventListener('click', () => {
    gameActive = true;
    activeBoard = 4; // Set Board 4 as the active board after restarting
    highlightActiveBoard(activeBoard); // Highlight Board 4
    currentPlayer = 'X';
    playerMoves = { X: [], O: [] };
    cells.forEach(cell => {
        cell.textContent = ""; // Clear the cell content
        cell.style.backgroundColor = ''; // Reset the background color
    });
    Object.keys(gameState).forEach(key => gameState[key] = ["", "", "", "", "", "", "", "", ""]);
    bigBoard = ["", "", "", "", "", "", "", "", ""]; // Reset the overall big board state
    wonBoards = {}; // Reset won boards
    console.log("Game has been reset.");
});

// Function to check for a winner on a specific board
function checkBoardWinner(boardIndex) {
    const boardState = gameState[boardIndex];
    return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === currentPlayer);
    });
}

// Function to check if a player has won 3 boards in a row (the overall game)
function checkBigBoardWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => bigBoard[index] === currentPlayer);
    });
}

// Function to turn the entire board into the winner's symbol
function turnBoardIntoWinner(boardIndex, winner) {
    const board = boards[boardIndex];
    const boardCells = board.querySelectorAll('.cell');
    boardCells.forEach(cell => {
        cell.textContent = winner; // Replace the cell content with the winner's symbol (X or O)
        cell.style.backgroundColor = '#ccc'; // Optionally change the background color
        cell.style.color = '#000'; // Ensure the winner's text is visible
    });
}

// Function to highlight the active board
function highlightActiveBoard(activeBoardIndex) {
    // If in freeBoardMode, skip highlighting a single active board
    if (freeBoardMode) {
        highlightNonWonBoards(); // Highlight all non-won boards
        return;
    }

    // Remove the active class from all boards first
    boards.forEach(board => board.classList.remove('active-board'));

    // Add the active class to the selected board
    boards[activeBoardIndex].classList.add('active-board');
}

// Function to highlight all non-won boards
function highlightNonWonBoards() {
    boards.forEach((board, index) => {
        if (!wonBoards[index]) {
            board.classList.add('active-board'); // Highlight the non-won board
        } else {
            board.classList.remove('active-board'); // Remove highlight from won boards
        }
    });
}

// Function to end the game
function endGame() {
    gameActive = false;
    alert(`${currentPlayer} wins the game!`);
}
