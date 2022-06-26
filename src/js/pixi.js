// export * from '@pixi/constants';
// export * from '@pixi/math';
// export * from '@pixi/runner';
// export * from '@pixi/settings';
// export * from '@pixi/ticker';
// import * as utils from '@pixi/utils';
// export { utils };
// export * from '@pixi/display';
// export * from '@pixi/core';
// export * from '@pixi/loaders';
// export * from '@pixi/compressed-textures';
// export * from '@pixi/basis';
// export * from '@pixi/sprite';
// export * from '@pixi/canvas-renderer';
// export * from '@pixi/accessibility';
// export * from '@pixi/app';
// export * from '@pixi/graphics';
// export * from '@pixi/spritesheet';
// export * from '@pixi/text';
// export * from '@pixi/interaction';
// export * from '@pixi/layers'

// // Renderer plugins
// import { Renderer } from '@pixi/core';
// import { AccessibilityManager } from '@pixi/accessibility';
// Renderer.registerPlugin('accessibility', AccessibilityManager);
// import { BatchRenderer } from '@pixi/core';
// Renderer.registerPlugin('batch', BatchRenderer);
// import { InteractionManager } from '@pixi/interaction';
// Renderer.registerPlugin('interaction', InteractionManager);

// // CanvasRenderer plugins
// import { CanvasRenderer } from '@pixi/canvas-renderer';
// CanvasRenderer.registerPlugin('accessibility', AccessibilityManager);
// CanvasRenderer.registerPlugin('interaction', InteractionManager);

// // Application plugins
// import { Application } from '@pixi/app';
// import { AppLoaderPlugin } from '@pixi/loaders';
// Application.registerPlugin(AppLoaderPlugin);
// import { TickerPlugin } from '@pixi/ticker';
// Application.registerPlugin(TickerPlugin);

// // Loader plugins
// import { Loader } from '@pixi/loaders';
// import { BasisLoader } from '@pixi/basis';
// Loader.registerPlugin(BasisLoader);
// import { CompressedTextureLoader, DDSLoader, KTXLoader } from '@pixi/compressed-textures';
// Loader.registerPlugin(CompressedTextureLoader);
// Loader.registerPlugin(DDSLoader);
// Loader.registerPlugin(KTXLoader);
// import { SpritesheetLoader } from '@pixi/spritesheet';
// Loader.registerPlugin(SpritesheetLoader);

import * as PIXI from 'pixi.js-legacy';
import { applyCanvasMixin } from '@pixi/layers';

applyCanvasMixin(PIXI.CanvasRenderer);


export * from 'pixi.js-legacy';
export * from '@pixi/layers'


// Override
PIXI.InteractionManager.prototype.onTouchStart = function(event) {
  const rect = this.interactionDOMElement.getBoundingClientRect();

  if (PIXI.AUTO_PREVENT_DEFAULT) event.preventDefault();

  let changedTouches = event.changedTouches;
  for (let i = 0; i < changedTouches.length; i++) {
      let touchEvent = changedTouches[i];
      let touchData = this.pool.pop();
      if (!touchData) touchData = new PIXI.InteractionData();

      touchData.originalEvent = event || window.event;

      this.touchs[touchEvent.identifier] = touchData;
      touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
      touchData.global.y = (touchEvent.clientY - rect.top) * (this.target.height / rect.height);

      let length = this.interactiveItems.length;

      for (let j = 0; j < length; j++) {
          let item = this.interactiveItems[j];

          if (item.touchstart || item.tap) {
              item.__hit = this.hitTest(item, touchData);

              if (item.__hit) {
                  //call the function!
                  if (item.touchstart) item.touchstart(touchData);
                  item.__isDown = true;
                  item.__touchData = touchData;

                  if (!item.interactiveChildren) break;
              }
          }
      }
  }
};
