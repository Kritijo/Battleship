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

    attack(opponentBoard, x, y) {
        return opponentBoard.receiveAttack(x, y);
    }

    randomAttack(opponentBoard) {
        let x, y;
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (
            opponentBoard.board[x][y] === "hit" ||
            opponentBoard.board[x][y] === "miss"
        );

        return this.attack(opponentBoard, x, y);
    }
}
