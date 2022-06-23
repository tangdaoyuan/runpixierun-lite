export * from '@pixi/constants';
export * from '@pixi/math';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
import * as utils from '@pixi/utils';
export { utils };
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/loaders';
export * from '@pixi/compressed-textures';
export * from '@pixi/basis';
export * from '@pixi/sprite';
export * from '@pixi/canvas-renderer';
export * from '@pixi/accessibility';
export * from '@pixi/app';
export * from '@pixi/graphics';
export * from '@pixi/spritesheet';
export * from '@pixi/text';
export * from '@pixi/interaction';
export * from '@pixi/layers'

// Renderer plugins
import { Renderer } from '@pixi/core';
import { AccessibilityManager } from '@pixi/accessibility';
Renderer.registerPlugin('accessibility', AccessibilityManager);
import { BatchRenderer } from '@pixi/core';
Renderer.registerPlugin('batch', BatchRenderer);
import { InteractionManager } from '@pixi/interaction';
Renderer.registerPlugin('interaction', InteractionManager);

// CanvasRenderer plugins
import { CanvasRenderer } from '@pixi/canvas-renderer';
CanvasRenderer.registerPlugin('accessibility', AccessibilityManager);
CanvasRenderer.registerPlugin('interaction', InteractionManager);

// Application plugins
import { Application } from '@pixi/app';
import { AppLoaderPlugin } from '@pixi/loaders';
Application.registerPlugin(AppLoaderPlugin);
import { TickerPlugin } from '@pixi/ticker';
Application.registerPlugin(TickerPlugin);

// Loader plugins
import { Loader } from '@pixi/loaders';
import { BasisLoader } from '@pixi/basis';
Loader.registerPlugin(BasisLoader);
import { CompressedTextureLoader, DDSLoader, KTXLoader } from '@pixi/compressed-textures';
Loader.registerPlugin(CompressedTextureLoader);
Loader.registerPlugin(DDSLoader);
Loader.registerPlugin(KTXLoader);
import { SpritesheetLoader } from '@pixi/spritesheet';
Loader.registerPlugin(SpritesheetLoader);
