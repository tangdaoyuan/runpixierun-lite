import * as PIXI from '../pixi'

const Explosion = function() {
    PIXI.Container.call(this);

    this.particals = [];

    this.top = new ExplosionPartical("asplodeInner02.png");
    this.bottom = new ExplosionPartical("asplodeInner01.png");

    this.top.position.y = -20;
    this.bottom.position.y = 20;

    this.top.position.x = 20;
    this.bottom.position.x = 20;

    this.anchor = new PIXI.Point();
    this.addChild(this.top);
    this.addChild(this.bottom);

    this.particals = [this.top, this.bottom];

    for (let i = 0; i < 5; i++) {
        this.particals.push(new ExplosionPartical("asplodeSpike_01.png"));
        this.particals.push(new ExplosionPartical("asplodeSpike_02.png"));
    }

    this.clouds = [];

    for (let i = 0; i < 5; i++) {
        let cloud = new PIXI.Sprite.from("dustSwirl.png");
        this.clouds.push(cloud);
        this.addChild(cloud);
    }

    this.reset();
}

Explosion.constructor = Explosion;

Explosion.prototype = Object.create(PIXI.Container.prototype);

Explosion.prototype.explode = function() {
    this.exploding = true;
}

Explosion.prototype.reset = function() {
    for (let i = 0; i < 5; i++) {
        let cloud = this.clouds[i];
        cloud.anchor.x = 0.5;
        cloud.anchor.y = 0.5;
        cloud.scaleTarget = 2 + Math.random() * 2;
        cloud.scale.x = cloud.scale.x = 0.5
        cloud.alpha = 0.75;
        cloud.position.x = (Math.random() - 0.5) * 150;
        cloud.position.y = (Math.random() - 0.5) * 150;
        cloud.speed = new PIXI.Point(Math.random() * 20 - 10, Math.random() * 20 - 10);
        cloud.state = 0;
        cloud.rotSpeed = Math.random() * 0.05;
    }

    for (let i = 0; i < this.particals.length; i++) {
        let partical = this.particals[i];
        this.addChild(partical);
        let angle = (i / this.particals.length) * Math.PI * 2;
        let speed = 7 + Math.random()
        partical.directionX = Math.cos(angle) * speed;
        partical.directionY = Math.sin(angle) * speed;
        partical.rotation = -angle;
        partical.rotationSpeed = Math.random() * 0.02
    }
}

Explosion.prototype.updateTransform = function() {
    if (this.exploding) {
        for (let i = 0; i < this.clouds.length; i++) {
            let cloud = this.clouds[i];
            cloud.rotation += cloud.rotSpeed;
            if (cloud.state === 0) {
                cloud.scale.x += (cloud.scaleTarget - cloud.scale.x) * 0.4;
                cloud.scale.y = cloud.scale.x;

                if (cloud.scale.x > cloud.scaleTarget - 0.1) cloud.state = 1;
            } else {
                cloud.position.x += cloud.speed.x * 0.05;
                cloud.position.y += cloud.speed.y * 0.05;
            }
        }

        for (let i = 0; i < this.particals.length; i++) {
            let partical = this.particals[i];

            partical.directionY += 0.1;
            partical.directionX *= 0.99;
            partical.position.x += partical.directionX;
            partical.position.y += partical.directionY;
            partical.rotation += partical.rotationSpeed;
        }
    }

    PIXI.Container.prototype.updateTransform.call(this);
}

const ExplosionPartical = function(id) {
    PIXI.Sprite.call(this, PIXI.Texture.from(id));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.speed = new PIXI.Point();
}

ExplosionPartical.constructor = ExplosionPartical;
ExplosionPartical.prototype = Object.create(PIXI.Sprite.prototype);


export {
    Explosion,
    ExplosionPartical
}
