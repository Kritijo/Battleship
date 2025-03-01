import "./styles/game.css";

import { Ship, Player } from "./gameLogic.js";

function renderBoard(gameboard, elementId) {
    const boardElement = document.getElementById(elementId);
    boardElement.innerHTML = "";

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;

            const value = gameboard.board[x][y];
            if (value instanceof Ship) cell.classList.add("ship");
            else if (value === "hit") {
                cell.classList.add("hit");
                cell.textContent = "❌";
            } else if (value === "miss") {
                cell.classList.add("miss");
                cell.textContent = "🗿";
            }

            boardElement.appendChild(cell);
        }
    }
}

const player = new Player();
const computer = new Player(true);

computer.board.placeShips(new Ship(5), 5, 0, true);
computer.board.placeShips(new Ship(4), 8, 3);
computer.board.placeShips(new Ship(3), 0, 0);
computer.board.placeShips(new Ship(3), 2, 5);
computer.board.placeShips(new Ship(2), 5, 4);

player.board.placeShips(new Ship(5), 5, 0);
player.board.placeShips(new Ship(4), 5, 8, true);
player.board.placeShips(new Ship(3), 9, 0);
player.board.placeShips(new Ship(3), 2, 5);
player.board.placeShips(new Ship(2), 2, 3, true);

renderBoard(player.board, "player-board");
renderBoard(computer.board, "computer-board");

const text_box = document.querySelector(".text-box");

let gameOver = false;

document.getElementById("computer-board").addEventListener("click", (e) => {
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;

    if (x !== undefined && y !== undefined) {
        if (
            computer.board.board[x][y] === "hit" ||
            computer.board.board[x][y] === "miss"
        )
            return;

        playerMove(x, y);
        if (computer.board.board[x][y] === "hit") return;

        if (gameOver) {
            disableBoards();
            return;
        }

        text_box.textContent = "Opponent's turn, please wait.";
        setTimeout(() => {
            computerMove();
        }, 800);
    }
});

function playerMove(x, y) {
    player.attack(computer.board, x, y);
    renderBoard(computer.board, "computer-board");

    if (computer.board.allShipsSunk()) {
        text_box.textContent = "You win! ✨";
        renderBoard(computer.board, "computer-board");
        gameOver = true;
        disableBoards();
        return;
    }

    if (computer.board.board[x][y] === "hit") {
        text_box.textContent = "Nice hit! Go again.";
        return;
    }

    document.getElementById("computer-board").classList.add("disabled-board");
    document.getElementById("player-board").classList.remove("disabled-board");
}

function computerMove() {
    function attackAgain() {
        let result = computer.randomAttack(player.board);
        renderBoard(player.board, "player-board");

        if (player.board.allShipsSunk()) {
            text_box.textContent = "Opponent wins! ✨";
            renderBoard(player.board, "player-board");
            gameOver = true;
            disableBoards();
            return;
        }

        if (result === "hit") {
            text_box.textContent = "Opponent hit! Attacking again...";
            setTimeout(attackAgain, 800);
        } else {
            text_box.textContent = "Your turn.";
            document
                .getElementById("player-board")
                .classList.add("disabled-board");
            document
                .getElementById("computer-board")
                .classList.remove("disabled-board");
        }
    }

    attackAgain();
}

function disableBoards() {
    document.getElementById("player-board").classList.add("disabled-board");
    document.getElementById("computer-board").classList.add("disabled-board");
}
