import * as PIXI from 'pixi.js-legacy';
export * from 'pixi.js-legacy';
export * from '@pixi/layers'

PIXI.utils.skipHello()


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
