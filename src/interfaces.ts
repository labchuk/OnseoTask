import * as PIXI from "pixi.js";
import {ShipType} from "./enums";


export interface IShip {
    sprite: PIXI.Graphics;
    type: ShipType;
    changeColor(): void;
}

// Інтерфейс для класу Pier
export interface IPier {
    position: PIXI.Point;
    occupied: boolean;
    loading: boolean;
    occupy(): void;
    release(): void;
    changeColor(): void;
}

// Інтерфейс для класу Port
export interface IPort {
    app: PIXI.Application;
    piers: IPier[];
    ships: IShip[];
    queueRed: IShip[];
    queueGreen: IShip[];
    generateShip(): void;
    moveToPier(targetPier: IPier, ship: IShip): void;
    shipArrived(ship: IShip): void;
    handlerQueueRed(pier: IPier): void;
    handlerQueueGreen(pier: IPier): void;
    shipDeparted(ship: IShip, targetPier: IPier): void;
    startSimulation(): void;
}