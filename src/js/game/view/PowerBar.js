import * as PIXI from '../../pixi'

const PowerBar = function(owner) {
    PIXI.Container.call(this);

    this.barBG = PIXI.Sprite.from("bulletTime_back.png");
    this.addChild(this.barBG);
    this.barBG.position.x = 20;
    this.barBG.position.y = 30;



    this.bar = PIXI.Sprite.from("powerFillBar.png");
    this.addChild(this.bar);
    this.bar.position.x = 20;
    this.bar.position.y = 30;

    this.frame = PIXI.Sprite.from("bulletTime_BG.png");
    this.addChild(this.frame);
    this.position.x = 100;

    //this.pixiText.position.x = 20;
    //this.pixiText.position.y = 8//5;
}

PowerBar.constructor = PowerBar;
PowerBar.prototype = Object.create(PIXI.Container.prototype);


export {
    PowerBar
}
