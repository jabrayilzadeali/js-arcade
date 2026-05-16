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
let aiPlayer = STATE.O
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
    console.log(`ai plays`)
    if (aiLevel === 'easy') {
        const arr = []
        console.log('board: ', board)
        // board.forEach((pos, index) => {
        //     console.log(pos)
        //     if (pos === "") {
        //         arr.push(index)
        //     }
        // })
        const arr2 = board.reduce((x, pos, index) => {
            if (pos === '') {
                x.push(index)
            }
            return x
        }, [])
        let random = arr2[Math.floor(Math.random() * arr2.length)]
        board[random] = aiPlayer
        console.log('arr: ', arr, 'arr2: ', arr2)
    }
    // const copyBoard = [...board]
    // board.forEach(pos => {
    //     if(pos === "") {
    //         copyBoard[pos] = currentPlayer()
    //         console.log(copyBoard)

    //     }
    // })
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
        result = `${currentPlayer(turn * -1)}'s turn`
    }
    document.querySelector('[data-status]').textContent = result
    console.log(currentPlayer())
}

updateStatus()

squares.forEach(square => square.addEventListener('click', () => {
    if (state === STATE.WON || state === STATE.STALEMATE) return
    console.log(againstAi, currentPlayer() === aiPlayer, currentPlayer(), aiPlayer)
    if (againstAi) {
        clickSquare(square)
        ai(board, aiPlayer)
        // turn *= -1
    } else {
        clickSquare(square)
    }
    redrawBoard()
    checkGameState()
    updateStatus()
    if (!againstAi) turn *= -1
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