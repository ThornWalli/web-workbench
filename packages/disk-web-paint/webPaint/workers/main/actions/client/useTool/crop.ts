import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { getPixels, invert, setPixels } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';
import { BRUSH_MODE } from '@web-workbench/disk-web-paint/webPaint/types/select';
import {
  CROP_STATE,
  type CropOptions
} from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Crop';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';

export enum STROKE_ALIGN {
  CENTER,
  INSIDE,
  OUTSIDE
}

// eslint-disable-next-line complexity
export default function crop(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CropOptions
) {
  switch (options.state) {
    case CROP_STATE.START:
      {
        context.layerManager.currentLayer.createTmpView();
      }
      break;
    case CROP_STATE.STOP: {
      context.layerManager.currentLayer.removeTmpView();
      if (cutCropOptions) {
        cutPixels(
          context,
          useToolMeta,
          cutCropOptions,
          context.layerManager.currentLayer.view!,
          partialView.slice(0)
        );
      }

      draw(context, useToolMeta, options, partialView, partialDimension);

      reset();

      return {
        type: WORKER_ACTION_TYPE.USE_TOOL_SUCCESS,
        payload: {
          // view,
          // dimension: tmpDimension
        }
      };
    }

    case CROP_STATE.MOVE:
      {
        if (context.layerManager.currentLayer.tmpView) {
          partialView =
            partialView || getPartialView(context, useToolMeta, options);
          if (options.resize) {
            partialView = getPartialView(context, useToolMeta, options);
            partialDimension = options.dimension;
            moveView = partialView.slice(0);
            moveDimension = options.dimension;
            const width = Math.abs(moveDimension.x);
            const height = Math.abs(moveDimension.y);
            const tmpDimension = context.getTargetDimension(
              ipoint(width, height),
              useToolMeta
            );
            invert(moveView, wasm.toDimension(tmpDimension));
          } else if (partialView.length > 0) {
            // optionally replace pixels in the current view
            if (!prepared) {
              prepared = true;
              if (options.cut) {
                cutCropOptions = cutCropOptions || options;
                cutPixels(
                  context,
                  useToolMeta,
                  cutCropOptions,
                  context.layerManager.currentLayer.tmpView!,
                  partialView
                );
              }
            }
            draw(
              context,
              useToolMeta,
              options,
              moveView,
              moveDimension,
              context.layerManager.currentLayer.tmpView
            );
          }
        }
      }
      break;
    case CROP_STATE.ABORT:
      {
        reset();
        context.layerManager.currentLayer.removeTmpView();
      }
      break;

    case CROP_STATE.COPY: {
      const { position, dimension } = options;
      const offset = ipoint(() => Math.min(dimension, 0));
      const _position = ipoint(() => position + offset);
      const width = Math.abs(dimension.x);
      const height = Math.abs(dimension.y);

      const tmpDimension = context.getTargetDimension(
        ipoint(width, height),
        useToolMeta
      );
      const view = getPixels(
        context.layerManager.currentLayer.view!,
        wasm.toDimension(context.getDimension()),
        wasm.toPoint(context.getTargetPosition(_position, useToolMeta)),
        wasm.toDimension(tmpDimension)
      );
      context.layerManager.currentLayer.removeTmpView();

      reset();

      return {
        type: WORKER_ACTION_TYPE.USE_TOOL_SUCCESS,
        payload: {
          view,
          dimension: tmpDimension
        }
      };
    }
    case CROP_STATE.CUT: {
      const { position, dimension } = options;
      const offset = ipoint(() => Math.min(dimension, 0));
      const _position = ipoint(() => position + offset);
      const width = Math.abs(dimension.x);
      const height = Math.abs(dimension.y);

      const tmpDimension = context.getTargetDimension(
        ipoint(width, height),
        useToolMeta
      );

      const view = getPixels(
        context.layerManager.currentLayer.view!,
        wasm.toDimension(context.getDimension()),
        wasm.toPoint(context.getTargetPosition(_position, useToolMeta)),
        wasm.toDimension(tmpDimension)
      );

      context.layerManager.currentLayer.removeTmpView();

      cutPixels(
        context,
        useToolMeta,
        options,
        context.layerManager.currentLayer.view!,
        view.slice(0)
      );

      reset();

      return {
        type: WORKER_ACTION_TYPE.USE_TOOL_SUCCESS,
        payload: {
          view,
          dimension: tmpDimension
        }
      };
    }
  }
}

function reset() {
  cutCropOptions = undefined;
  partialView = undefined;
  partialDimension = undefined;
  moveView = undefined;
  moveDimension = undefined;
  prepared = false;
}

function cutPixels(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CropOptions,
  view: Uint8Array,
  partialView: Uint8Array
) {
  const offset = ipoint(() => Math.min(options.dimension, 0));
  const position = ipoint(() => options.position + offset);

  const width = Math.abs(moveDimension.x);
  const height = Math.abs(moveDimension.y);
  const tmpDimension = context.getTargetDimension(
    ipoint(width, height),
    useToolMeta
  );

  setPixels(
    view,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(context.getTargetPosition(position, useToolMeta)),
    new Uint8Array(
      Array(partialView.length / 4)
        .fill([0, 0, 0, 0])
        .flat()
    ),
    wasm.toDimension(tmpDimension),
    wasm.toBrushMode(BRUSH_MODE.REPLACE)
  );
}

let partialView: Uint8Array | undefined;
let partialDimension: (IPoint & number) | undefined;
let moveView: Uint8Array | undefined;
let moveDimension: (IPoint & number) | undefined;
let prepared = false;
let cutCropOptions: CropOptions;

function getPartialView(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CropOptions
): Uint8Array {
  const absDimension = ipoint(() => Math.abs(options.dimension));
  const offset = ipoint(() => Math.min(options.dimension, 0));
  const position = ipoint(() => options.position + offset);
  return getPixels(
    context.layerManager.currentLayer.view!,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(context.getTargetPosition(position, useToolMeta)),
    wasm.toDimension(context.getTargetDimension(absDimension, useToolMeta))
  );
}

function draw(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CropOptions,
  partialView?: Uint8Array,
  partialDimension?: IPoint & number,
  view?: Uint8Array
) {
  if (view && context.layerManager.currentLayer.view) {
    context.layerManager.currentLayer.view.set(view);
  }

  const absDimension = ipoint(() => Math.abs(partialDimension));
  const offset = ipoint(() => Math.min(partialDimension, 0));
  const position = ipoint(() => options.position + offset);
  const targetPosition = context.getTargetPosition(position, useToolMeta, {
    round: true
  });

  setPixels(
    context.layerManager.currentLayer.view!,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(ipoint(() => Math.round(targetPosition))),
    partialView,
    wasm.toDimension(context.getTargetDimension(absDimension, useToolMeta)),
    wasm.toBrushMode(BRUSH_MODE.NORMAL)
  );
}
