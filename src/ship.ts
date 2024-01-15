import * as PIXI from 'pixi.js';
import {AppConst, ShipType} from "./enums";
import {IShip} from "./interfaces";

export class Ship implements IShip{
    sprite: PIXI.Graphics;
    type: ShipType;

    constructor(type: ShipType) {
        this.type = type;

        // Create a ship sprite
        this.sprite = new PIXI.Graphics();
        this.drawShip()

    }

    private drawShip():void{
        if (this.type === ShipType.Red) {
            this.sprite.beginFill(AppConst.SHIP_COLOR_FULL);
            this.sprite.drawRect(0, 0, AppConst.SHIP_WIDTH, AppConst.SHIP_HEIGHT);
            this.sprite.endFill();
        }
        else {

            this.sprite.beginFill(AppConst.SHIP_COLOR_EMPTY,0);
            this.sprite.lineStyle(AppConst.SHIP_LINE,AppConst.SHIP_COLOR_EMPTY)
            this.sprite.drawRect(0, 0, AppConst.SHIP_WIDTH, AppConst.SHIP_HEIGHT);
            this.sprite.endFill();
        }
    }

    changeColor():void {
        if(this.type === ShipType.Red) {
            this.sprite.clear();
            this.sprite.beginFill(AppConst.SHIP_COLOR_EMPTY,0);
            this.sprite.lineStyle(5,AppConst.SHIP_COLOR_EMPTY)
            this.sprite.drawRect(0, 0, AppConst.SHIP_WIDTH, AppConst.SHIP_HEIGHT);
            this.sprite.endFill();
        }
        else {
            this.sprite.clear();
            this.sprite.beginFill(AppConst.SHIP_COLOR_EMPTY);
            this.sprite.drawRect(0, 0, AppConst.SHIP_WIDTH, AppConst.SHIP_HEIGHT);
            this.sprite.endFill();
        }

    }


}