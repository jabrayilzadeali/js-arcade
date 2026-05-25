const squares = document.querySelectorAll('[data-square-index]')

const board = [
    "", "", "",
    "", "", "",
    "", "", "",
];

// possible states: x, o, won, stalemate
const STATE = {
    X: "x",
    O: "o",
    WON: "won",
    STALEMATE: "stalemate"
}

const STATE_MESSAGES = {
    X: "X's turn",
    O: "o's turn",
    X_WON: `X is won`,
    O_WON: `O is won`,
    STALEMATE: "stalemate"
}

let state;
let againstAi = true
let aiPlayer = STATE.X
let aiLevel = 'easy'

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

function ai(board, aiPlayer) {
    if (aiLevel === 'easy') {
        console.log(board)
        const arr = board.reduce((x, pos, index) => {
            if (pos === '') {
                x.push(index)
            }
            return x
        }, [])
        let random = arr[Math.floor(Math.random() * arr.length)]
        board[random] = aiPlayer
    }
}

let turn = 1

const currentPlayer = (t = turn) => t > 0 ? STATE.X : STATE.O
// updateStatus()

function redrawBoard() {
    squares.forEach((square) => {
        square.innerHTML = board[square.dataset.squareIndex]
    })
}

redrawBoard()

function clickSquare(square) {
    if (state === STATE.WON || state === STATE.STALEMATE) return
    const index = square.dataset.squareIndex
    if (board[index] === "") {
        board[index] = currentPlayer()
    }
}


function updateStatus() {
    let result = ''
    if (state === STATE.WON) {
        result = `${currentPlayer()} is won`
    } else if (state === STATE.STALEMATE) {
        result = 'stalemate'
    } else {
        result = `${board.every(item => item === "")
            ? currentPlayer()
            : currentPlayer(turn * -1)}
            's turn`
    }
    document.querySelector('[data-status]').textContent = result
}

updateStatus()

if (againstAi && currentPlayer() === aiPlayer) {
    console.log('here')
    ai(board, aiPlayer)
    redrawBoard()
    updateStatus()
    turn *= -1
}

squares.forEach(square => square.addEventListener('click', () => {
    if (againstAi) {
        if (state === STATE.WON || state === STATE.STALEMATE || board[square.dataset.squareIndex] !== "") return
        clickSquare(square)
        redrawBoard()
        checkGameState()
        updateStatus()
        console.log('state: ', state)
        turn *= -1
        if (state === STATE.WON || state === STATE.STALEMATE) return
        ai(board, aiPlayer)
        redrawBoard()
        checkGameState()
        updateStatus()
        turn *= -1
    } else {
        if (state === STATE.WON || state === STATE.STALEMATE || board[square.dataset.squareIndex] !== "") return
        clickSquare(square)
        redrawBoard()
        checkGameState()
        updateStatus()
        console.log(currentPlayer())
        turn *= -1
    }
}))

function checkGameState() {
    for (const pos of winningPositions) {
        const [a, b, c] = pos
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            // alert(`${currentPlayer()} is won`)
            state = STATE.WON
            return
        }
    }
    if (board.some(pos => pos === "")) {
        state = turn > 0 ? STATE.X : STATE.O
    } else {
        state = STATE.STALEMATE
    }
}
