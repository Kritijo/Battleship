export class Ship {
    constructor(length) {
        this.length = length;
    }
    #hits = 0;
    hit() {
        this.#hits++;
    }
    isSunk() {
        return (this.length - this.#hits === 0);
    }
}
