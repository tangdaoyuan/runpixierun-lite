import type { Container, Sprite } from 'pixi.js-legacy'
import { utils } from 'pixi.js-legacy'
export * from 'pixi.js-legacy'
export * from '@pixi/layers'

export declare interface ButtonSprite extends Sprite {
  touchstart?: Function
  mousedown?: Function
}

export declare interface interactiveContainer extends Container {
  touchstart?: Function
  mousedown?: Function
  mouseup?: Function
  touchend?: Function
}

utils.skipHello()
