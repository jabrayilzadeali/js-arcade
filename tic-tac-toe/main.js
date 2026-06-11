const squares = document.querySelectorAll('[data-square-index]')
const replayBtn = document.querySelector('[data-replay-btn]')
const chooseAgainstWho = document.querySelector('[data-choose-against-who]')
const aiIsXOrO = document.querySelector('[data-ai-is-x-or-o]')
const aiLevelElement = document.querySelector('[data-ai-level]')


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

let state = null;
let againstAi = true
let aiPlayer = STATE.O
let aiLevel = 'medium'
let turn = 1

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
    const emptyPositions = board.reduce((x, pos, index) => {
        if (pos === '') {
            x.push(index)
        }
        return x
    }, [])
    if (aiLevel === 'easy') {
        console.log(board)
        let randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
        board[randomPos] = aiPlayer
    }
    if (aiLevel === 'medium') {
        console.log('hello here medium __________________')
        for (const pos of emptyPositions) {
            const boardCopy = [...board]
            boardCopy[pos] = aiPlayer
            checkGameState(boardCopy)
        }
    }
}


const currentPlayer = (t = turn) => t > 0 ? STATE.X : STATE.O
// updateStatus()

function redrawBoard() {
    squares.forEach((square) => {
        square.innerHTML = board[square.dataset.squareIndex]
    })
}


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



function gameLoop() {
    if (againstAi && currentPlayer() === aiPlayer) {
        ai(board, aiPlayer)
        redrawBoard()
        updateStatus()
        turn *= -1
    }
    squares.forEach(square => square.addEventListener('click', () => {
        console.log('okay hello here')
        if (againstAi) {
            console.log('against ai');
            if (state === STATE.WON || state === STATE.STALEMATE || board[square.dataset.squareIndex] !== "") return
            clickSquare(square)
            redrawBoard()
            checkGameState()
            updateStatus()
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
}

redrawBoard()
// updateStatus()
gameLoop()

chooseAgainstWho.addEventListener('change', () => {
    againstAi = chooseAgainstWho.value === 'ai'
    resetBtn()

})
aiIsXOrO.addEventListener('change', () => {
    aiPlayer = aiIsXOrO.value === 'x' ? STATE.X : STATE.O
    resetBtn()

})

aiLevelElement.addEventListener('change', () => {
    aiLevel = aiLevelElement.value
    resetBtn()

})

function checkGameState(gameBoard = board) {
    for (const pos of winningPositions) {
        const [a, b, c] = pos
        if (gameBoard[a] !== "" && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            // alert(`${currentPlayer()} is won`)
            state = STATE.WON
            return
        }
    }
    if (gameBoard.some(pos => pos === "")) {
        state = turn > 0 ? STATE.X : STATE.O
    } else {
        state = STATE.STALEMATE
    }
}

replayBtn.addEventListener('click', resetBtn)

function resetBtn() {
    console.log(board)
    board.fill('')
    turn = 1
    state = null
    gameLoop()
    redrawBoard()
    console.log(board, state)
}