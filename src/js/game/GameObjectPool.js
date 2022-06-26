const GameObjectPool = function(classType) {
    this.classType = classType;
    this.pool = [];
}

// constructor
GameObjectPool.constructor = GameObjectPool;

GameObjectPool.prototype.getObject = function() {
    let object = this.pool.pop();
    if (!object) {
        object = new this.classType();

    }
    return object;
}

GameObjectPool.prototype.returnObject = function(object) {
    //this.pool.push(object);
}

export {
    GameObjectPool
}
