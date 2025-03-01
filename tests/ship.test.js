import { Ship, Gameboard, Player } from "../src/gameLogic.js";

test("Ship initializes", () => {
    let ship = new Ship(3);
    expect(ship.length).toEqual(3);
});

test("Ship registers a hit", () => {
    let ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test("Ship sinks after enough hits", () => {
    let ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test("Ship placement", () => {
    let b = new Gameboard();
    b.placeShips(new Ship(3), 2, 1);
    b.placeShips(new Ship(3), 2, 7);
    expect(b.placeShips(new Ship(5), 2, 4)).toBe(false);
});

test("receive attack", () => {
    let b = new Gameboard();
    const ship = new Ship(3);
    b.placeShips(ship, 2, 1);
    expect(b.receiveAttack(2, 1)).toBe("hit");
    expect(b.receiveAttack(2, 2)).toBe("hit");
    expect(b.receiveAttack(2, 3)).toBe("hit");
    expect(b.receiveAttack(2, 4)).toBe("miss");
    expect(b.receiveAttack(2, 4)).toBe("already attacked");
    expect(b.receiveAttack(2, 1)).toBe("already attacked");
});

test("all ships sunk", () => {
    let b = new Gameboard();
    let ship1 = new Ship(3);
    let ship2 = new Ship(2);
    b.placeShips(ship1, 2, 1);
    b.placeShips(ship2, 5, 3);

    b.receiveAttack(2, 1);
    b.receiveAttack(2, 2);
    b.receiveAttack(2, 3);

    expect(b.allShipsSunk()).toBe(false);

    b.receiveAttack(5, 3);
    b.receiveAttack(5, 4);

    expect(b.allShipsSunk()).toBe(true);
});

test("missed shots", () => {
    let b = new Gameboard();
    b.placeShips(new Ship(3), 2, 1);
    b.receiveAttack(2, 4);
    b.receiveAttack(1, 0);
    b.receiveAttack(2, 3);
    expect(b.missedShots.length).toBe(2);
});

test("Player attack", () => {
    const player = new Player();
    const bot = new Player(true);

    bot.board.placeShips(new Ship(4), 1, 1);

    expect(player.attack(bot.board, 1, 2)).toBe("hit");
});

test("Bot makes a valid attack", () => {
    const bot = new Player(true);
    const player = new Player();
    player.board.placeShips(new Ship(3), 2, 1);

    let result = bot.randomAttack(player.board);
    expect(["hit", "miss"]).toContain(result);
});
