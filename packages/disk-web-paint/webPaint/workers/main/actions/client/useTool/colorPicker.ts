import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { WORKER_ACTION_TYPE } from '../../../../../types/worker';

export default function colorPicker(
  context: IContext,
  useToolMeta: UseToolMeta
) {
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  return {
    type: WORKER_ACTION_TYPE.COLOR_PICKER_SUCCESS,
    payload: {
      position,
      color: context.isIntersect(position)
        ? context.getColorAtPosition(position)
        : undefined
    }
  };
}
