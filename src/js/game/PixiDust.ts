import * as PIXI from '../pixi'
import GAME from './Game'
import { GameObjectPool } from './GameObjectPool'


class PixiDust extends PIXI.Container {
    particals: ParticalDust[];
    particalPool: GameObjectPool<ParticalDust>;
    max: number;
    count: number;
    focalLength: number;

    constructor() {
        super()

        this.particals = [];
        this.particalPool = new GameObjectPool(ParticalDust);
        this.max = GAME.HIGH_MODE ? 100 : 10;
        this.count = 0;

        for (let i = 0; i < this.max; i++) {
            let partical = this.particalPool.getObject();

            partical.home.x = Math.random() * -GAME.width;
            partical.position.y = partical.home.y = Math.random() * 110640;
            partical.speed = new PIXI.Point((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.4);
            this.particals.push(partical);

            this.addChild(partical);
        };


        this.focalLength = 150
    }

    update() {

        for (let i = 0; i < this.particals.length; i++) {
            let partical = this.particals[i];
            let scaleRatio = this.focalLength / (this.focalLength + partical.z);

            partical.scale.x = partical.scale.y = scaleRatio // * 0.5;

            partical.home.x += partical.speed.x;
            partical.position.y += partical.speed.y;
            partical.position.x = (partical.home.x - GAME.camera.x) * scaleRatio * 1.5;

            partical.position.x %= GAME.width;
            if (partical.position.x < 0) partical.position.x += GAME.width;

            partical.position.y %= 640;
            if (partical.position.y < 0) partical.position.y += 640;

            //partical.rotation += partical.rotationSpeed

        };
    }
}


class ParticalDust extends PIXI.Sprite {
    static globalCount = 0;
    static frames = ["mote01.png", "mote02.png", "mote03.png"];
    z: number;
    home: PIXI.Point;
    speed!: PIXI.Point;

    constructor() {
        ParticalDust.globalCount++;

        super(PIXI.Texture.from(ParticalDust.frames[ParticalDust.globalCount % 3]))

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.z = Math.random() * 500;
        this.rotation = Math.random() * Math.PI * 2;
        //	this.rotationSpeed =(Math.random()-0.5) * 0.1;
        //this.scale.x = this.scale.y = this.z * 0.2 ;
        this.home = new PIXI.Point();

        this.alpha = 0.5;
    }

}
export {
    PixiDust,
}
