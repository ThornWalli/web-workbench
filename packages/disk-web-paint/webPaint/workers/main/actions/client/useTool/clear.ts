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
}
