
interface newClass<T> { new(): T }

class GameObjectPool<T> {
  ClassType: newClass<T>
  pool: T[]

  constructor(classType: newClass<T>) {
    this.ClassType = classType
    this.pool = []
  }

  getObject() {
    let object = this.pool.pop()
    if (!object)
      object = new this.ClassType()

    return object
  }

  returnObject(_object: T) {
    // this.pool.push(object);
  }
}
export {
  GameObjectPool,
}
