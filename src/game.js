import "./styles/game.css";
import { Ship, Player } from "./gameLogic.js";

class Gamehandler {
    constructor() {
        this.player = new Player();
        this.computer = new Player(true);
        this.#arrangeShips();
    }

    #gameStart = false;

    #renderBoard(gameboard, elementId) {
        const boardElement = document.getElementById(elementId);
        boardElement.innerHTML = "";

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;

                const value = gameboard.board[x][y];

                if (
                    value instanceof Ship &&
                    elementId !== "computer-board" &&
                    !this.#gameStart
                )
                    cell.classList.add("ship");
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

    #setUpComputerBoard() {
        const lengths = [5, 4, 3, 3, 2];
        lengths.forEach((length) => {
            let ship, x, y, randomBoolean;

            do {
                ship = new Ship(length);
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                randomBoolean = Math.random() >= 0.5;
            } while (
                !this.computer.board.isPlacementValid(ship, x, y, randomBoolean)
            );
            this.computer.board.placeShips(ship, x, y, randomBoolean);
        });
    }

    #setUpShipItems() {
        const shipContainer = document.querySelector(".ship-container");

        const ships = {
            Carrier: 5,
            Battleship: 4,
            Destroyer: 3,
            Submarine: 3,
            "Patrol Boat": 2,
        };

        for (const ship in ships) {
            const shipDiv = document.createElement("div");

            shipDiv.draggable = true;
            shipDiv.dataset.length = ships[ship];
            shipDiv.dataset.shipName = ship;

            shipDiv.classList.add("ship-div");
            shipDiv.style.gridTemplateColumns = `repeat(${ships[ship]}, 30px)`;

            for (let i = 0; i < ships[ship]; i++) {
                let shipCell = document.createElement("div");
                shipCell.classList.add("ship-cell");
                shipDiv.append(shipCell);
            }
            shipContainer.append(shipDiv);
        }
    }

    #setUpPlayerBoard() {
        this.#setUpShipItems();
        let draggedShip = null;

        document.addEventListener("drag", (e) => {
            draggedShip = e.target;
            text_box.textContent = `Place your ${draggedShip.dataset.shipName}`;
        });

        const board = document.getElementById("player-board");
        board.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        board.addEventListener("drop", (e) => {
            e.preventDefault();

            let x = parseInt(e.target.dataset.x);
            let y = parseInt(e.target.dataset.y);
            let length = parseInt(draggedShip.dataset.length);
            let shipName = draggedShip.dataset.shipName;

            if (this.player.board.isPlacementValid(new Ship(length), x, y)) {
                this.player.board.placeShips(new Ship(length), x, y);
                this.#renderBoard(this.player.board, "player-board");

                text_box.textContent = "Place next ship";
                draggedShip.remove();
            } else {
                text_box.textContent = `Invalid placement for ${shipName}`;
            }

            if (!document.querySelector(".ship-container").hasChildNodes()) {
                text_box.textContent = "Game start. Your turn.";
                this.#gameStart = true;

                document
                    .querySelectorAll(".cell")
                    .forEach((cell) => cell.classList.remove("ship"));

                document
                    .getElementById("computer-board")
                    .classList.remove("disabled-board");
            }
        });
    }

    #arrangeShips() {
        this.#setUpComputerBoard();

        text_box.textContent = "Place your ships";
        document
            .getElementById("computer-board")
            .classList.add("disabled-board");

        this.#setUpPlayerBoard();

        this.#renderBoard(this.player.board, "player-board");
        this.#renderBoard(this.computer.board, "computer-board");
    }

    playerMove(x, y) {
        this.player.attack(this.computer.board, x, y);
        this.#renderBoard(this.computer.board, "computer-board");
        this.#updateShipStatus();

        if (this.computer.board.allShipsSunk()) {
            text_box.textContent = "You win! 🎉";
            this.#renderBoard(this.computer.board, "computer-board");
            this.#disableBoards();
            return;
        }

        if (this.computer.board.board[x][y] === "hit") {
            text_box.textContent = "Nice hit! Go again.";
            return;
        }

        document
            .getElementById("computer-board")
            .classList.add("disabled-board");
        document
            .getElementById("player-board")
            .classList.remove("disabled-board");
    }

    computerMove(result = "") {
        result = this.computer.smartAttack(this.player.board);
        this.#renderBoard(this.player.board, "player-board");
        this.#updateShipStatus();

        if (this.player.board.allShipsSunk()) {
            text_box.textContent = "Computer wins! 🎊";
            this.#disableBoards();
            return;
        }

        if (result === "hit") {
            text_box.textContent = "Opponent hit! Attacking again...";
            setTimeout(() => this.computerMove(result), 800);
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

    #disableBoards() {
        document.getElementById("player-board").classList.add("disabled-board");
        document
            .getElementById("computer-board")
            .classList.add("disabled-board");
    }

    #updateShipStatus() {
        const playerStatusList = document.getElementById("player-ship-status");
        const computerStatusList = document.getElementById(
            "computer-ship-status"
        );

        playerStatusList.innerHTML = "";
        computerStatusList.innerHTML = "";

        const shipsArray = [
            "Carrier",
            "Battleship",
            "Destroyer",
            "Submarine",
            "Patrol Boat",
        ];

        this.player.board.ships.forEach((ship, index) => {
            const shipItem = document.createElement("li");
            shipItem.textContent = `${shipsArray[index]} (${ship.length})`;

            if (ship.isSunk()) {
                shipItem.classList.add("sunk");
            }
            playerStatusList.appendChild(shipItem);
        });

        this.computer.board.ships.forEach((ship, index) => {
            const shipItem = document.createElement("li");
            shipItem.textContent = `${shipsArray[index]} (${ship.length})`;

            if (ship.isSunk()) {
                shipItem.classList.add("sunk");
            }
            computerStatusList.appendChild(shipItem);
        });
    }
}

const text_box = document.querySelector(".text-box");
const game = new Gamehandler();

document.getElementById("computer-board").addEventListener("click", (e) => {
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;

    if (x !== undefined && y !== undefined) {
        if (
            game.computer.board.board[x][y] === "hit" ||
            game.computer.board.board[x][y] === "miss"
        )
            return;

        game.playerMove(x, y);

        if (game.computer.board.board[x][y] === "hit") return;

        text_box.textContent = "Opponent's turn, please wait.";
        setTimeout(() => {
            game.computerMove();
        }, 800);
    }
});
