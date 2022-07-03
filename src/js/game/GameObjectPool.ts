

type newClass<T> = {new(): T}

class GameObjectPool<T> {
    classType: newClass<T>;
    pool: T[];

    constructor(classType: newClass<T>) {
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

    returnObject(_object: T) {
        //this.pool.push(object);
    }

}
export {
    GameObjectPool
}
