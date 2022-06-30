import * as PIXI from './pixi'

class SpritePool {
  static _instance = null;

  constructor() {
    this._pool = [];
  }

  static getInstance() {
    if (!SpritePool._instance)
      SpritePool._instance = new SpritePool();
    return SpritePool._instance;
  }

  get(frameId) {
    for (let i in this._pool) {
      if (this._pool[i].texture === PIXI.utils.TextureCache[frameId])
        return this._pool.splice(i, 1)[0];
    }
    return PIXI.Sprite.from(frameId);
  };
  recycle(sprite) {
    this._pool.push(sprite);
  }
}



export default SpritePool
