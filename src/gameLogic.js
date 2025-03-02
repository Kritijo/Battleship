export class Ship {
    constructor(length) {
        this.length = length;
    }
    #hits = 0;
    hit() {
        this.#hits++;
    }
    isSunk() {
        return this.length - this.#hits === 0;
    }
}

export class Gameboard {
    constructor() {
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));
        this.missedShots = [];
        this.ships = [];
    }

    placeShips(ship, x, y, isVertical = false) {
        if (this.isPlacementValid(ship, x, y, isVertical)) {
            this.ships.push(ship);
            for (let i = 0; i < ship.length; i++) {
                if (isVertical) this.board[x + i][y] = ship;
                else this.board[x][y + i] = ship;
            }
            return true;
        }
        return false;
    }

    isPlacementValid(ship, x, y, isVertical) {
        for (let i = 0; i < ship.length; i++) {
            let newX = isVertical ? x + i : x;
            let newY = isVertical ? y : y + i;
            if (newX >= 10 || newY >= 10 || this.board[newX][newY] !== null) {
                return false;
            }
        }
        return true;
    }

    receiveAttack(x, y) {
        const target = this.board[x][y];

        if (target === "miss" || target === "hit") {
            return "already attacked";
        } else if (target && target instanceof Ship) {
            target.hit();
            this.board[x][y] = "hit";
            return "hit";
        } else {
            this.missedShots.push([x, y]);
            this.board[x][y] = "miss";
            return "miss";
        }
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}

export class Player {
    constructor(isAI = false) {
        this.board = new Gameboard();
        this.isAI = isAI;
    }

    shipsSunk = 0;
    #lastHit = null;
    #hitQueue = [];

    attack(opponentBoard, x, y) {
        return opponentBoard.receiveAttack(x, y);
    }

    smartAttack(opponentBoard) {
        let x, y;

        if (this.#hitQueue.length > 0) {
            [x, y] = this.#hitQueue.shift();
        } else {
            do {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            } while (
                opponentBoard.board[x][y] === "hit" ||
                opponentBoard.board[x][y] === "miss"
            );
        }

        const result = this.attack(opponentBoard, x, y);

        if (result === "hit") {
            let sunk = opponentBoard.ships.filter((ship) => ship.isSunk());
            if (sunk.length > this.shipsSunk) {
                this.shipsSunk++;
                this.#lastHit = null;
                this.#hitQueue = [];
            } else {
                this.#lastHit = { x, y };
                this.addAdjacentTargets(x, y, opponentBoard);
            }
        } else if (this.#hitQueue.length === 0) {
            this.#lastHit = null;
        }

        return result;
    }

    addAdjacentTargets(x, y, board) {
        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (
                newX >= 0 &&
                newX < 10 &&
                newY >= 0 &&
                newY < 10 &&
                board.board[newX][newY] !== "hit" &&
                board.board[newX][newY] !== "miss"
            ) {
                this.#hitQueue.push([newX, newY]);
            }
        }
    }
}
