
class GameObjectPool {
    constructor(classType) {
        this.classType = classType;
        this.pool = [];
    }

    getObject() {
        let object = this.pool.pop();
        if (!object) {
            object = new this.classType();

        }
        return object;
    }

    returnObject(object) {
        //this.pool.push(object);
    }

}
export {
    GameObjectPool
}
