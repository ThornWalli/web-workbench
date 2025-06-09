import type { Context } from '../../../../../types/main';

export default function clear(context: Context) {
  context.view?.set(
    new Uint8ClampedArray(
      new Array(
        context.sharedBuffer?.dimension.x *
          context.sharedBuffer?.dimension.y *
          4
      ).fill(255)
    )
  );
  // context.tmpSharedBuffer = {
  //   buffer: context.sharedBuffer!.buffer.slice(0),
  //   dimension: context.sharedBuffer!.dimension
  // };
  // context.actionStack.clear();
  // context.updateClient();
  // context.updateDisplays();
}
