import * as PIXI from '../pixi'
import { GameObjectPool } from './GameObjectPool'
import GAME from './Game';

const FloorManager = function(engine) {
    this.engine = engine;
    this.count = 0;
    this.floors = [];
    this.floorPool = new GameObjectPool(Floor);
}

FloorManager.constructor = FloorManager;

FloorManager.prototype.update = function() {
    for (var i = 0; i < this.floors.length; i++) {
        var floor = this.floors[i];
        floor.position.x = floor.x - GAME.camera.x - 16;

        if (floor.position.x < -1135 - GAME.xOffset - 16) {
            this.floorPool.returnObject(floor)
            this.floors.splice(i, 1);
            i--;
            this.engine.view.gameFront.removeChild(floor);
        }
    }
}

FloorManager.prototype.addFloor = function(floorData) {
    var floor = this.floorPool.getObject();
    floor.x = floorData;
    floor.position.y = 640 - 158;
    this.engine.view.gameFront.addChild(floor);
    this.floors.push(floor);
}

FloorManager.prototype.destroyAll = function() {
    for (var i = 0; i < this.floors.length; i++) {
        var floor = this.floors[i];
        this.floorPool.returnObject(floor);
        this.engine.view.gameFront.removeChild(floor);
    }

    this.floors = [];
}

const Floor = function() {
    PIXI.Sprite.call(this, PIXI.Texture.from("00_forest_floor.png"));
}



Floor.constructor = PIXI.Floor;
Floor.prototype = Object.create(PIXI.Sprite.prototype);

export {
    FloorManager,
    Floor
}
