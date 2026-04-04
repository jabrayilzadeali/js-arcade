const squares = document.querySelectorAll('[data-square-index]')

const board = [
    "", "", "",
    "", "", "",
    "", "", "",
];

const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
];

let turn = 1

const currentPlayer = () => turn > 0 ? "X" : "O"


function redrawBoard() {
    squares.forEach((square) => {
        square.innerHTML = board[square.dataset.squareIndex]
    })
}

function clickSquare(square) {
    const index = square.dataset.squareIndex
    if (board[index] === "") {
        board[index] = currentPlayer()
    }
}

squares.forEach(square => square.addEventListener('click', () => {
    clickSquare(square)
    redrawBoard()
    checkGameState()
    turn *= -1
}))

function checkGameState() {
    for (const pos of winningPositions) {
        const [a, b, c] = pos 
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            alert(`${currentPlayer()} is won`)
            return `${currentPlayer()} is won`
        }
    }
}