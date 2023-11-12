const GameBoard = {
    gameBoard: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ],
    playerScore: 0,
    computerScore: 0,
    draw: 0,
    playerChoice: "",
    computerChoice: "",
    playerGame: [],
    computerGame: [],
    clear() {
        this.gameBoard.forEach(grid => grid.fill(""));
        this.playerGame = [];
        this.computerGame = [];
        this.playerChoice = "";
        this.computerChoice = "";
    },
    checkWinner(winner) {
        if (winner.length < 3) return;
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        winner.sort((a, b) => a - b);
        let finalWinner;
        if (winner.length === 3) {
            finalWinner = winConditions.some(condition => condition.every(index => winner.includes(index)));
        }
        if (winner.length > 3) {
            for (let i = 0; i < winner.length; i++) {
                finalWinner = winConditions.some(condition => condition.every(index => winner.slice(i).includes(index)));
                if (finalWinner) break;
            }
        }
        if (finalWinner) {
            document.querySelector("[data-nought]").disabled = false;
            document.querySelector("[data-cross]").disabled = false;
            this.displayGrids();
            this.clear();
            setTimeout(() => this.displayGrids(), 2000);
            return finalWinner;
        }
    },
    computerPlay() {
        let isCellEmpty = false;
        const isBoardFull = this.gameBoard.every(row => row.every(cell => cell !== ""));
        if (isBoardFull) {
            document.querySelector("[data-nought]").disabled = false;
            document.querySelector("[data-cross]").disabled = false;
            this.draw++;
            document.querySelector("[data-draw] span").innerText = this.draw;
            this.displayGrids();
            this.clear();
            this.displayGrids();
        }
        while (!isCellEmpty) {
            let computerRow = Math.floor(Math.random() * 3);
            let computerColumn = Math.floor(Math.random() * 3);
            if (!this.gameBoard[computerRow][computerColumn] && this.gameBoard[computerRow][computerColumn] === "") {
                this.gameBoard[computerRow][computerColumn] = this.computerChoice;
                this.computerGame.push(computerRow * 3 + computerColumn);
                isCellEmpty = true;
            }
        }
        this.displayGrids();
        if (this.checkWinner(this.computerGame)) {
            this.computerScore++;
            document.querySelector("[data-player-score] span").innerText = this.playerScore;
            document.querySelector("[data-computer-score] span").innerText = this.computerScore;
        }
    },
    displayGrids() {
        const grids = document.querySelector("[data-grid-container]");
        grids.innerHTML = "";
        for (let i = 0; i < this.gameBoard.length; i++) {
            for (let j = 0; j < this.gameBoard[i].length; j++) {
                const button = document.createElement("button");
                button.innerText = this.gameBoard[i][j];
                button.classList.add("grid-item");
                button.id = `${i * 3 + j}`;
                button.addEventListener("click", (() => {
                    const row = i, col = j;
                    return () => {
                        if (!this.gameBoard[row][col] && this.playerChoice !== "") {
                            this.gameBoard[row][col] = this.playerChoice;
                            button.innerText = this.playerChoice;
                            this.playerGame.push(parseInt(button.id));
                            if (this.checkWinner(this.playerGame)) {
                                this.playerScore++;
                                document.querySelector("[data-player-score] span").innerText = this.playerScore;
                                document.querySelector("[data-computer-score] span").innerText = this.computerScore;
                            }
                            setTimeout(() => this.computerPlay(), 500);
                        }
                    }
                })());
                grids.appendChild(button);
            }
        }
    }
};

document.querySelector("[data-nought]").addEventListener("click", () => {
    document.querySelector("[data-nought]").disabled = true;
    document.querySelector("[data-cross]").disabled = true;
    GameBoard.playerChoice = "O";
    GameBoard.computerChoice = "X";
    GameBoard.displayGrids();
});

document.querySelector("[data-cross]").addEventListener("click", () => {
    document.querySelector("[data-nought]").disabled = true;
    document.querySelector("[data-cross]").disabled = true;
    GameBoard.playerChoice = "X";
    GameBoard.computerChoice = "O";
    GameBoard.displayGrids();
});

document.querySelector("[data-restart]").addEventListener("click", () => {
    document.querySelector("[data-nought]").disabled = false;
    document.querySelector("[data-cross]").disabled = false;
    GameBoard.playerScore = 0;
    GameBoard.computerScore = 0;
    GameBoard.draw = 0;
    document.querySelector("[data-player-score] span").innerText = GameBoard.playerScore;
    document.querySelector("[data-computer-score] span").innerText = GameBoard.computerScore;
    document.querySelector("[data-draw] span").innerText = GameBoard.draw;
    GameBoard.clear();
    GameBoard.displayGrids();
})

GameBoard.displayGrids();
