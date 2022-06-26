import * as PIXI from '../../pixi'
import { gsap, Elastic, Sine } from "gsap"
import { SteveTrailFire } from "../SteveTrailFire";
import { SteveTrail } from "../SteveTrail";
import GAME from '../Game'
import { LowFiBackground } from './LowFiBackground'
import { JoyBackground } from './JoyBackground'
import { Background } from './Background';
import { Lava } from './Lava'
import { PowerBar } from './PowerBar'
import { Score } from './Score'
import { BestScore } from './BestScore'
import { PixiDust } from '../PixiDust'
import { Splash } from './Splash'

const RprView = function(engine) {
    this.engine = engine;

    this.renderer = PIXI.autoDetectRenderer(600, 800);
    GAME.HIGH_MODE = !(this.renderer instanceof PIXI.CanvasRenderer);

    this.stage = new PIXI.Stage();

    //    console.log("Renderer width = " + this.renderer.width);
    //    console.log("Renderer height = " + this.renderer.height);
    //    
    //    console.log("Window width = " + window.innerWidth || document.body.clientWidth);
    //    console.log("Window height = " + window.innerHeight || document.body.clientHeight);

    this.container = new PIXI.Container();
    this.container.hitArea = this.stage.hitArea;
    this.container.interactive = true;

    this.hud = new PIXI.Container();
    this.game = new PIXI.Container();
    this.gameFront = new PIXI.Container();

    this.container.addChild(this.game);
    this.container.addChild(this.gameFront);

    this.stage.addChild(this.container);
    this.stage.addChild(this.hud);

    if (GAME.lowMode) {
        this.normalBackground = new LowFiBackground();
    } else {
        this.normalBackground = new Background(this.gameFront);
    }

    this.joyBackground = new JoyBackground();

    this.lava = new Lava(this.gameFront);

    this.powerBar = new PowerBar();
    this.score = new Score();
    this.bestScore = new BestScore();
    this.background = this.normalBackground;

    this.score.position.x = 300;

    this.game.addChild(this.background);
    this.hud.addChild(this.powerBar);
    this.hud.addChild(this.score);
    this.hud.addChild(this.bestScore);

    this.trail = new SteveTrail(this.game);
    this.trail2 = new SteveTrailFire(this.game);

    this.powerBar.alpha = 0;
    this.score.alpha = 0;
    this.bestScore.alpha = 0;

    this.count = 0;
    this.zoom = 1;

    this.white = PIXI.Sprite.from("img/whiteSquare.jpg");
    GAME.xOffset = this.container.position.x;

    this.dust = new PixiDust();
    this.container.addChild(this.dust);

    this.splash = new Splash();
    this.splash.position.y = 300;
    this.splash.position.x = 300;

    this.game.addChild(this.splash);
}

// constructor
RprView.constructor = RprView;

RprView.prototype.showHud = function() {
    var start = {
        x: GAME.width + 300,
        y: 0
    };

    this.score.alpha = 1;
    this.score.position.x = start.x;
    gsap.to(this.score.position, 1, {
        x: GAME.width - 295 - 20,
        ease: Elastic.easeOut
    });

    this.bestScore.alpha = 1;
    this.bestScore.position.x = start.x;
    this.bestScore.position.y -= 14;
    gsap.to(this.bestScore.position, 1, {
        x: GAME.width - 20,
        ease: Elastic.easeOut
    });

    this.powerBar.alpha = 1;
    this.powerBar.position.x = GAME.width;
    gsap.to(this.powerBar.position, 1, {
        x: GAME.width - 295,
        ease: Elastic.easeOut,
        delay: 0.3
    });
}

RprView.prototype.hideHud = function() {

}

RprView.prototype.update = function() {
    this.count += 0.01;

    if (!GAME.lowMode) {
        var ratio = (this.zoom - 1);
        var position = -GAME.width / 2
        var position2 = -this.engine.steve.view.position.x;
        var inter = position + (position2 - position) * ratio;

        this.container.position.x = inter * this.zoom;
        this.container.position.y = -this.engine.steve.view.position.y * this.zoom;

        this.container.position.x += GAME.width / 2;
        this.container.position.y += GAME.height / 2;

        GAME.xOffset = this.container.position.x;

        if (this.container.position.y > 0) this.container.position.y = 0;
        var yMax = -GAME.height * this.zoom;
        yMax += GAME.height;

        if (this.container.position.y < yMax) this.container.position.y = yMax;

        this.container.scale.x = this.zoom;
        this.container.scale.y = this.zoom;
    }

    this.trail.target = this.engine.steve;
    this.trail2.target = this.engine.steve;

    this.trail.update();
    this.trail2.update();
    this.dust.update();

    this.lava.setPosition(GAME.camera.x + 4000);
    this.bestScore.update();
    this.score.setScore(Math.round(this.engine.score));
    this.powerBar.bar.scale.x = ((this.engine.pickupCount / (50 * this.engine.bulletMult)) * (248 / 252))
    this.renderer.render(this.stage);
}

RprView.prototype.joyrideMode = function() {
    this.game.removeChild(this.background);
    this.background = this.joyBackground;
    this.game.addChildAt(this.background, 0);
    this.stage.addChild(this.white);
    this.white.alpha = 1;

    gsap.to(this.white, 0.7, {
        alpha: 0,
        ease: Sine.easeOut
    });
}

RprView.prototype.doSplash = function() {
    this.splash.splash(this.engine.steve.position);
}

RprView.prototype.normalMode = function() {
    this.game.removeChild(this.background);
    this.background = this.normalBackground;
    this.game.addChildAt(this.background, 0);
    this.stage.addChild(this.white)
    this.white.alpha = 1;

    gsap.to(this.white, 0.5, {
        alpha: 0,
        ease: Sine.easeOut
    });
}

RprView.prototype.resize = function(w, h) {
    //    console.log("Width ->" + w);
    //    console.log("Height -> " + h);

    GAME.width = w;
    GAME.height = h;

    this.renderer.resize(w, h);
    this.background.width = w;

    this.bestScore.position.x = w - 20;
    this.bestScore.position.y = 100;

    this.score.position.x = w - 295 - 20;
    this.score.position.y = 12;

    this.white.scale.x = w / 16;
    this.white.scale.y = h / 16;

    this.powerBar.position.x = w - 295;
    this.powerBar.position.y = 12;
}

export {
    RprView
}
