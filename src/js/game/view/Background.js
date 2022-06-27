import * as PIXI from '../../pixi'
import GAME from '../Game';

const Background = function(frontView) {
    PIXI.Container.call(this);
    this.initialWidth = 1000;
    this.scrollPosition = 1500;
    //{"x":604,"y":803,"w":600,"h":799},
    //{"x":1206,"y":2,"w":600,"h":799},
    //{"x":604,"y":2,"w":600,"h":799},

    this.foggyTrees = new BackgroundElement(PIXI.Texture.from("05_far_BG.jpg"), 40, this);
    this.rearSilhouette = new BackgroundElement(PIXI.Texture.from("03_rear_silhouette.png"), 358, this);
    this.rearCanopy = new BackgroundElement(PIXI.Texture.from("03_rear_canopy.png"), 0, this);



    this.tree1 = PIXI.Sprite.from("02_tree_1.png");
    this.tree1.anchor.x = 0.5;
    this.addChild(this.tree1);

    this.tree2 = PIXI.Sprite.from("02_tree_2.png");
    this.tree2.anchor.x = 0.5;
    this.tree2.position.y = 50;
    this.addChild(this.tree2);

    this.farCanopy = new BackgroundElement(PIXI.Texture.from("02_front_canopy.png"), 0, this);
    this.vines = new Vines(this);
    this.roofLeaves = new BackgroundElement(PIXI.Texture.from("00_roof_leaves.png"), 0, this);

    this.frontSilhouette = new BackgroundElement(PIXI.Texture.from("01_front_silhouette.png"), 424, this);

    this.foggyTrees.speed = 1 / 2;
    this.rearSilhouette.speed = 1.2 / 2;

    this.rearCanopy.speed = 1.2 / 2;
    this.farCanopy.speed = 1.5 / 2;
    this.frontSilhouette.speed = 1.6 / 2;
    this.roofLeaves.speed = 2 / 2;
    //this.ground.speed = 1


}

// constructor
Background.constructor = Background;

Background.prototype = Object.create(PIXI.Container.prototype);

Background.prototype.updateTransform = function() {
    this.scrollPosition = GAME.camera.x + 4000 // * GAME.time.DELTA_TIME;

    let treePos = -this.scrollPosition * 1.5 / 2;
    treePos %= this.initialWidth + 556;
    treePos += this.initialWidth + 556;
    treePos -= this.tree1.width / 2;
    this.tree1.position.x = treePos - GAME.xOffset;

    let treePos2 = -(this.scrollPosition + this.initialWidth / 2) * 1.5 / 2;
    treePos2 %= this.initialWidth + 556;
    treePos2 += this.initialWidth + 556;
    treePos2 -= this.tree2.width / 2;
    this.tree2.position.x = treePos2 - GAME.xOffset;

    //this.ground.setPosition(this.scrollPosition);
    this.foggyTrees.setPosition(this.scrollPosition);
    this.rearSilhouette.setPosition(this.scrollPosition);
    this.rearCanopy.setPosition(this.scrollPosition);
    this.farCanopy.setPosition(this.scrollPosition);
    this.frontSilhouette.setPosition(this.scrollPosition);

    this.roofLeaves.setPosition(this.scrollPosition);
    //this.ground.setPosition(this.scrollPosition);

    this.vines.setPosition(this.scrollPosition);


    PIXI.Container.prototype.updateTransform.call(this);
}

const Vines = function(owner) {
    this.vines = [];
    this.owner = owner

    for (let i = 0; i < 10; i++) {
        let vine = new PIXI.Sprite.from("01_hanging_flower3.png");
        vine.offset = i * 100 + Math.random() * 50;
        vine.speed = (1.5 + Math.random() * 0.25) / 2;
        vine.position.y = Math.random() * -200;
        owner.addChild(vine);
        vine.position.x = 200;
        this.vines.push(vine);
    };

    this.speed = 1;
}

Vines.prototype.setPosition = function(position) {
    for (let i = 0; i < this.vines.length; i++) {
        let vine = this.vines[i];

        let pos = -(position + vine.offset) * vine.speed; // * this.speed;
        pos %= this.owner.initialWidth;
        pos += this.owner.initialWidth;

        vine.position.x = pos //vine.offset// Math.floor(pos)
        //this.sky[i].position.y = Math.round(this.sky[i].position.y);
    };
}

Background.prototype.joyRideMode = function() {
    // change background!

}

Background.prototype.normalMode = function() {

}

const BackgroundElement = function(texture, y, owner) {
    this.sprites = [];
    this.spriteWidth = texture.width - 1;
    let amount = Math.ceil(940 / this.spriteWidth);
    if (amount < 3) amount = 3;

    for (let i = 0; i < amount; i++) {
        const sprite = new PIXI.Sprite(texture);
        sprite.position.y = y;
        owner.addChild(sprite);
        this.sprites.push(sprite);
    };

    this.speed = 1;
}

BackgroundElement.prototype.setPosition = function(position) {
    let h = this.spriteWidth;

    for (let i = 0; i < this.sprites.length; i++) {
        let pos = -position * this.speed;
        pos += i * h;
        pos %= h * this.sprites.length;
        pos += h * 2;

        this.sprites[i].position.x = Math.floor(pos) - GAME.xOffset
        //this.sky[i].position.y = Math.round(this.sky[i].position.y);
    };
}


export {
    Background,
    BackgroundElement,
    Vines
}
