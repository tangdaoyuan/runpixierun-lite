import Audio from '../fido/Audio'
import GAME from './Game'
import { showGameover } from '../RunPixieRun'


class CollisionManager {
    constructor(engine) {
        this.engine = engine;
    }

    update() {
        //if(this.engine.isPlaying) 
        this.playerVsBlock();
        this.playerVsPickup();
        this.playerVsFloor();
    }

    playerVsBlock() {
        let enemies = this.engine.enemyManager.enemies;
        let steve = this.engine.steve;

        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i]

            let xdist = enemy.position.x - steve.position.x;
            if (xdist > -enemy.width / 2 && xdist < enemy.width / 2) {
                let ydist = enemy.position.y - steve.position.y;

                if (ydist > -enemy.height / 2 - 20 && ydist < enemy.height / 2) {
                    if (!steve.joyRiding) {
                        steve.die();
                        this.engine.gameover();
                        enemy.hit();
                    }
                }
            }
        }
    }

    playerVsPickup() {

        let pickups = this.engine.pickupManager.pickups;
        let steve = this.engine.steve;

        for (let i = 0; i < pickups.length; i++) {
            let pickup = pickups[i]
            if (pickup.isPickedUp) continue;

            let xdist = pickup.position.x - steve.position.x;
            if (xdist > -pickup.width / 2 && xdist < pickup.width / 2) {
                let ydist = pickup.position.y - steve.position.y;

                if (ydist > -pickup.height / 2 && ydist < pickup.height / 2) {
                    this.engine.pickupManager.removePickup(i);
                    this.engine.pickup();

                    //		i--;
                }
            }
        }
    }

    playerVsFloor() {
        let floors = this.engine.floorManager.floors;
        let steve = this.engine.steve;

        let max = floors.length;
        steve.onGround = false;

        if (steve.position.y > 610) {
            if (this.engine.isPlaying) {
                steve.boil();
                this.engine.view.doSplash();
                this.engine.gameover();
            } else {
                steve.speed.x *= 0.95;

                if (!GAME.interactive) {
                    showGameover();
                    GAME.interactive = true;
                }

                if (steve.bounce === 0) {
                    steve.bounce++;
                    steve.boil();
                    this.engine.view.doSplash();
                }

                return;
            }
        }

        for (let i = 0; i < max; i++) {
            let floor = floors[i];
            let xdist = floor.originalX - steve.position.x + 1135;

            if (steve.position.y > 477) {
                if (xdist > 0 && xdist < 1135) {
                    if (steve.isDead) {
                        steve.bounce++;

                        if (steve.bounce > 2) {
                            return;
                        }
                        Audio.play('thudBounce');
                        steve.view.texture = steve.crashFrames[steve.bounce]

                        steve.speed.y *= -0.7;
                        steve.speed.x *= 0.8;

                        if (steve.rotationSpeed > 0) {
                            steve.rotationSpeed = Math.random() * -0.3;
                        } else if (steve.rotationSpeed === 0) {
                            steve.rotationSpeed = Math.random() * 0.3;
                        } else {
                            steve.rotationSpeed = 0;
                        }
                    } else {
                        steve.speed.y = -0.3;
                    }

                    if (!steve.isFlying) {
                        steve.position.y = 478;
                        steve.onGround = true;

                    }
                }
            }
        }

        if (steve.position.y < 0) {
            steve.position.y = 0;
            steve.speed.y *= 0;
        }
    }
}

export {
    CollisionManager
}
