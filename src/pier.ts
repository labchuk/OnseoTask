import * as PIXI from 'pixi.js';
import {port} from "./index";
import {IPier} from "./interfaces";
import {AppConst} from "./enums";

export class Pier extends PIXI.Container implements IPier{
    public occupied: boolean = false;
    private _loading: boolean = false;
    pierSprite: PIXI.Graphics

    constructor() {
        super();

        // Create a pier sprite
        this.pierSprite = new PIXI.Graphics();
        this.pierSprite.lineStyle(AppConst.PIER_LINE,AppConst.PIER_COLOR)
        this.pierSprite.beginFill(AppConst.PIER_COLOR,0);
        this.pierSprite.drawRect(5, 0, AppConst.PIER_WIDTH, AppConst.PIER_HEIGHT);
        this.pierSprite.endFill();
        this.addChild(this.pierSprite);

    }


    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = value

        if(!value && !this.occupied) {
            port.handlerQueueRed(this)
        }
        if(!value && this.occupied) {
            port.handlerQueueGreen(this)
        }
    }

    occupy():void {
        this.occupied = true;
    }

    release():void {
        this.occupied = false;
    }

    changeColor():void {
        const pierSprite = this.getChildAt(0) as PIXI.Graphics;
        if(this.occupied) {
            pierSprite.clear();
            pierSprite.beginFill(AppConst.PIER_COLOR);
            pierSprite.drawRect(5, 0, AppConst.PIER_WIDTH, AppConst.PIER_HEIGHT);
            pierSprite.endFill();
        }
        else {
            pierSprite.clear();
            pierSprite.beginFill(AppConst.PIER_COLOR,0);
            pierSprite.lineStyle(AppConst.PIER_LINE,AppConst.PIER_COLOR)
            pierSprite.drawRect(5, 0, AppConst.PIER_WIDTH, AppConst.PIER_HEIGHT);
            pierSprite.endFill();
        }

    }

}