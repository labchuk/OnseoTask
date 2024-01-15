import {AppConst} from "./enums";
import {Ship} from "./ship";
import * as TWEEN from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'
import {Pier} from "./pier";

import {ShipType} from "./enums";
import {IPort} from "./interfaces";

type Nums = {
    x:number,
    y:number
}

class Port implements IPort{
    app: PIXI.Application;
    piers: Pier[] = [];
    ships: Ship[] = [];
    queueRed: Ship[] = [];
    queueGreen: Ship[] = [];

    constructor() {
        this.app = new PIXI.Application({ width: AppConst.WIDTH, height: AppConst.HEIGHT, backgroundColor: AppConst.BACKGROUND_COLOR, });
        document.body.appendChild(this.app.view);

        // Create piers with spacing
        for (let i = 0; i < 4; i++) {
            const pier = new Pier();
            pier.position.set(0, i * (AppConst.PIER_HEIGHT + AppConst.SPACING)); // Added spacing between piers
            this.app.stage.addChild(pier);
            this.piers.push(pier);
        }

        // Create line top for Port
        const top = new PIXI.Graphics();
        top.position.set(400, 0); // Fixed Y coordinate
        top.beginFill(0xFFFF00); // Color of the entrance
        top.drawRect(0, 0, 20, AppConst.HEIGHT / 2 - 130);
        top.endFill();
        this.app.stage.addChild(top);

        // Create line bottom for Port
        const bottom = new PIXI.Graphics();
        bottom.position.set(400, 800 / 2 + 100); // Fixed Y coordinate
        bottom.beginFill(0xFFFF00); // Color of the entrance
        bottom.drawRect(0, 0, 20, AppConst.HEIGHT / 2 - 100);
        bottom.endFill();
        this.app.stage.addChild(bottom);

        // Start generating ships
        setInterval(() => this.generateShip(), AppConst.TIME_INTERVAL);
    }

    generateShip():void {
        const shipType:ShipType = Math.round(Math.random()) ? ShipType.Red : ShipType.Green;
        const ship = new Ship(shipType);
        this.ships.push(ship);
        this.app.stage.addChild(ship.sprite);

        // Set the initial position of the ship
        ship.sprite.position.set(1200, 300); // Fixed Y coordinate

        // Tween the ship to move across the screen from right to left
        const shipTween = new TWEEN.Tween(ship.sprite.position)
            .to({ x: 350 }, 5000)
            .onComplete(() => this.shipArrived(ship))
            .start();
    }

     moveToPier(targetPier:Pier,ship:Ship):void{
        const moveTowardsPier = new TWEEN.Tween(ship.sprite.position)
            .to({ x: targetPier.position.x + 70, y: targetPier.position.y + 40 }, 5000)
            .onComplete(() =>{
                if (ship.type === ShipType.Red) {
                    targetPier.occupy();
                    targetPier.changeColor();
                    ship.changeColor()
                }
                else {
                    targetPier.release();
                    targetPier.changeColor();
                    ship.changeColor()
                }

                this.shipDeparted(ship, targetPier)
            })
            .start();
    }

    shipArrived(ship: Ship):void {
            if(ship.type === ShipType.Red) {
                const targetPier = this.piers.find((p)=>!p.occupied && !p.loading)
                if (targetPier && this.queueRed.length === 0) {
                    targetPier.loading = true
                    this.moveToPier(targetPier,ship)
                }
                else {
                    let nums:Nums = {
                        x: 450,
                        y: 470
                    }
                    if (this.queueRed.length) {
                        nums.x = this.queueRed[this.queueRed.length -1]?.sprite.position.x + 100
                    }
                    this.queueRed.push(ship)
                    new TWEEN.Tween(ship.sprite.position)
                        .to(nums,1000)
                        .start()
                }
            }
            else {
                const targetPier = this.piers.find((p)=>p.occupied && !p.loading)

                if (targetPier && this.queueGreen.length === 0) {
                    targetPier.loading = true
                    this.moveToPier(targetPier,ship)
                }
                else {
                    let nums:Nums = {
                        x: 450,
                        y: 230
                    }
                    if (this.queueGreen.length) {
                        nums.x = this.queueGreen[this.queueGreen.length -1]?.sprite.position.x + 100
                    }

                    this.queueGreen.push(ship)
                    new TWEEN.Tween(ship.sprite.position)
                        .to(nums,1000)
                        .start()
                }
            }
    }

    handlerQueueRed(pier:Pier):void {
        if (this.queueRed.length) {
            pier.loading = true
            const ship = this.queueRed[0]
            this.queueRed.shift()
            new TWEEN.Tween(ship.sprite.position)
                .to({x:350,y:300},1000)
                .start()
                .onComplete(()=>{
                    this.moveToPier(pier,ship)
                })
        }
    }

    handlerQueueGreen(pier:Pier):void {
        if(this.queueGreen.length) {
            pier.loading = true
            const ship = this.queueGreen[0]
            this.queueGreen.shift()
            new TWEEN.Tween(ship.sprite.position)
                .to({x:350,y:300},1000)
                .start()
                .onComplete(()=>{
                    this.moveToPier(pier,ship)
                })

        }

    }

    shipDeparted(ship: Ship, targetPier: Pier):void {
        // Move the ship back to the initial position
        const returnTween = new TWEEN.Tween(ship.sprite.position)
            .delay(5000)
            .onComplete(()=>{
                targetPier.loading = false
                new TWEEN.Tween(ship.sprite.position)
                    .to({ x: 350, y: 400 }, 3000)
                    .onComplete(() => {
                        new TWEEN.Tween(ship.sprite.position)
                            .to({x:1200},5000)
                            .onComplete(()=>{
                                // Remove the ship from the array
                                const index = this.ships.indexOf(ship);
                                if (index !== -1) {
                                    this.ships.splice(index, 1);
                                }
                                // Remove the ship from the stage
                                this.app.stage.removeChild(ship.sprite);
                            })
                            .start()


                    })
                    .start();
            })
            .start()
    }

    startSimulation() {
        this.app.ticker.add(() => TWEEN.update());
    }
}


export const port = new Port();
port.startSimulation();