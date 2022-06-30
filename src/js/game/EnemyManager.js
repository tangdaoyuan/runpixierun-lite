import { GameObjectPool } from './GameObjectPool'
import { Enemy } from './Enemy'
import GAME from './Game';

class EnemyManager {
    constructor(engine) {
        this.engine = engine;
        this.enemies = [];
        this.enemyPool = new GameObjectPool(Enemy);
        this.spawnCount = 0;
    }

    update() {
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i]
            enemy.update();

            if (enemy.view.position.x < -100 - GAME.xOffset && !this.engine.steve.isDead) {
                this.enemyPool.returnObject(enemy);
                this.enemies.splice(i, 1);

                this.engine.view.gameFront.removeChild(enemy.view);
                i--;
            }
        }
    }

    addEnemy(x, y) {
        let enemy = this.enemyPool.getObject();
        enemy.position.x = x
        enemy.position.y = y
        this.enemies.push(enemy);
        this.engine.view.gameFront.addChild(enemy.view);
    }

    destroyAll() {
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            enemy.reset();
            this.enemyPool.returnObject(enemy);
            this.engine.view.gameFront.removeChild(enemy.view);
        }

        this.enemies = [];
    }

    destroyAllOffScreen() {
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];

            if (enemy.x > GAME.camera.x + GAME.width) {
                this.enemyPool.returnObject(enemy);
                this.engine.view.game.removeChild(enemy.view);
                this.enemies.splice(i, 1);
                i--;
            }
        }
    }
}

export {
    EnemyManager
}
