import { GameObjectPool } from './GameObjectPool'
import { Enemy } from './Enemy'
import GAME from './Game';

var laserCount = 0;

const EnemyManager = function(engine) {
    this.engine = engine;
    this.enemies = [];
    this.enemyPool = new GameObjectPool(Enemy);
    this.spawnCount = 0;
}

EnemyManager.constructor = EnemyManager;

EnemyManager.prototype.update = function() {
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i]
        enemy.update();

        if (enemy.view.position.x < -100 - GAME.xOffset && !this.engine.steve.isDead) {
            this.enemyPool.returnObject(enemy);
            this.enemies.splice(i, 1);

            this.engine.view.gameFront.removeChild(enemy.view);
            i--;
        }
    }
}

EnemyManager.prototype.addEnemy = function(x, y) {
    var enemy = this.enemyPool.getObject();
    enemy.position.x = x
    enemy.position.y = y
    this.enemies.push(enemy);
    this.engine.view.gameFront.addChild(enemy.view);
}

EnemyManager.prototype.destroyAll = function() {
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i];
        enemy.reset();
        this.enemyPool.returnObject(enemy);
        this.engine.view.gameFront.removeChild(enemy.view);
    }

    this.enemies = [];
}

EnemyManager.prototype.destroyAllOffScreen = function() {
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i];

        if (enemy.x > GAME.camera.x + GAME.width) {
            this.enemyPool.returnObject(enemy);
            this.engine.view.game.removeChild(enemy.view);
            this.enemies.splice(i, 1);
            i--;
        }
    }
}

export {
    EnemyManager
}
