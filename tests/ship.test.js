import { Ship } from "../src/gameLogic.js";

test("Ship initializes",()=>{
    let ship = new Ship(3);
    expect(ship.length).toEqual(3);
})

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