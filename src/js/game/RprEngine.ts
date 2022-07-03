import { gsap, Cubic } from 'gsap'
import GAME from './Game'
import { GAME_MODE } from '../constant'
import { Steve } from './Steve'
import { RprView } from './view/RprView'
import { SegmentManager } from './SegmentManager'
import { EnemyManager } from './EnemyManager'
import { PickupManager } from './PickupManager'
import { FloorManager } from './FloorManager'
import { CollisionManager } from './CollisionManager'
import LocalStorage from '../fido/LocalStorage'
import Audio from '../fido/Audio'
import { game } from '../RunPixieRun'

class RprEngine {
    floorManager: FloorManager
    joyrideMode: boolean
    enemyManager: EnemyManager
    pickupManager: PickupManager
    onGameover!: Function
    steve: Steve
    view: RprView
    segmentManager: SegmentManager
    collisionManager: CollisionManager
    LocalStorage: LocalStorage
    bulletMult: number
    pickupCount: number
    score: number
    joyrideCountdown: number
    isPlaying: boolean
    levelCount: number
    gameReallyOver: boolean
    isDying: boolean

    constructor() {
        this.steve = new Steve();
        this.view = new RprView(this);
        this.segmentManager = new SegmentManager(this);
        this.enemyManager = new EnemyManager(this);
        this.pickupManager = new PickupManager(this);
        this.floorManager = new FloorManager(this);
        this.collisionManager = new CollisionManager(this);
        this.LocalStorage = new LocalStorage(GAME.bundleId);

        this.steve.view.visible = false;

        this.bulletMult = 1;
        this.pickupCount = 0;
        this.score = 0;
        this.joyrideMode = false;
        this.joyrideCountdown = 0;
        this.isPlaying = false;
        this.levelCount = 0;
        this.gameReallyOver = false;
        this.isDying = false;

        this.view.game.addChild(this.steve.view);
    }

    start() {
        this.segmentManager.reset();
        this.enemyManager.destroyAll();
        this.pickupManager.destroyAll();
        this.isPlaying = true;
        this.gameReallyOver = false;
        this.score = 0;
        this.steve.level = 1;
        this.steve.position.y = 477;
        this.steve.speed.y = 0;
        this.steve.speed.x = this.steve.baseSpeed;
        this.steve.view.rotation = 0;
        this.steve.isFlying = false;
        this.steve.isDead = false;
        this.steve.view.play()
        this.steve.view.visible = true;
        this.segmentManager.chillMode = false;
        this.bulletMult = 1;
    }

    update() {
        GAME.time.update();

        let targetCamY = 0;
        if (targetCamY > 0) targetCamY = 0;
        if (targetCamY < -70) targetCamY = -70;

        GAME.camera.y = targetCamY;

        if (GAME.gameMode !== GAME_MODE.PAUSED) {
            this.steve.update();
            this.collisionManager.update();
            this.segmentManager.update();
            this.floorManager.update();
            this.enemyManager.update();
            this.pickupManager.update();

            if (this.joyrideMode) {
                this.joyrideCountdown -= GAME.time.DELTA_TIME;

                if (this.joyrideCountdown <= 0) {
                    this.joyrideComplete();
                }
            }

            this.levelCount += GAME.time.DELTA_TIME;

            if (this.levelCount > (60 * 60)) {
                this.levelCount = 0;
                this.steve.level += 0.05;
                GAME.time.speed += 0.05;
            }
        } else {
            if (this.joyrideMode) {
                this.joyrideCountdown += GAME.time.DELTA_TIME;
            }
        }

        this.view.update();
    }

    reset() {
        this.enemyManager.destroyAll();
        this.floorManager.destroyAll();

        this.segmentManager.reset();
        this.view.zoom = 1;
        this.pickupCount = 0;
        this.levelCount = 0;
        this.steve.level = 1;

        this.view.game.addChild(this.steve.view);
    }

    joyrideComplete() {
        this.joyrideMode = false;
        this.pickupCount = 0;
        this.bulletMult += 0.3;
        this.view.normalMode();
        this.steve.normalMode();
        this.enemyManager.destroyAll();
    }

    gameover() {
        this.isPlaying = false;
        this.isDying = true;
        this.segmentManager.chillMode = true;

        let nHighscore = this.LocalStorage.get('highscore');
        if (!nHighscore || this.score > nHighscore) {
            this.LocalStorage.store('highscore', this.score);
            GAME.newHighscore = true;
        }

        this.onGameover();

        this.view.game.addChild(this.steve.view);

        gsap.to(this.view, 0.5, {
            zoom: 2,
            ease: Cubic.easeOut
        });
    }

    gameoverReal() {
        this.gameReallyOver = true;
        this.isDying = false;
        this.onGameoverReal();
    }
onGameoverReal() {
throw new Error('Method not implemented.')
}

    pickup() {
        if (this.steve.isDead) return;

        this.score += 10;

        if (this.joyrideMode) {
            Audio.stop('pickup');
            Audio.play('pickup');
            return;
        }

        this.view.score.jump();
        this.pickupCount++;

        Audio.stop('pickup');
        Audio.play('pickup');

        if (this.pickupCount >= 50 * this.bulletMult && !this.steve.isDead) {
            this.pickupCount = 0;
            this.joyrideMode = true;
            this.joyrideCountdown = 60 * 10;
            this.view.joyrideMode();
            this.steve.joyrideMode();
            this.steve.position.x = 0;
            GAME.camera.x = game.steve.position.x - 100;
            this.enemyManager.destroyAll();
            this.pickupManager.destroyAll();
            this.floorManager.destroyAll();
            this.segmentManager.reset();
        }
    }

}

GAME.initTimer()

export {
    RprEngine
}
