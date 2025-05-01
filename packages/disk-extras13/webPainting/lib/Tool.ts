'use strict';

import Tool from './tool/Tool';
import Brush from './tool/Brush';
import DottedFreehand from './tool/DottedFreehand';
import ContinuousFreehand from './tool/ContinuousFreehand';
import StraightLine from './tool/StraightLine';
import Curve from './tool/Curve';
import Fill from './tool/Fill';
import AirBrush from './tool/Airbrush';
import UnfilledFilledRectangle from './tool/UnfilledFilledRectangle';
import UnfilledFilledCircle from './tool/UnfilledFilledCircle';
import UnfilledFilledEllipse from './tool/UnfilledFilledEllipse';
import UnfilledFilledPolygon from './tool/UnfilledFilledPolygon';
import BrushSelector from './tool/BrushSelector';
import Magnifier from './tool/Magnifier';
import Zoom from './tool/Zoom';
import Undo from './tool/Undo';
import Clear from './tool/Clear';

function getToolByIndex(index: number) {
  return [
    DottedFreehand,
    ContinuousFreehand,
    StraightLine,
    Curve,
    Fill,
    AirBrush,
    UnfilledFilledRectangle,
    UnfilledFilledCircle,
    UnfilledFilledEllipse,
    UnfilledFilledPolygon,
    BrushSelector,
    Tool,
    Tool,
    Tool,
    Magnifier,
    Zoom,
    Undo,
    Clear
  ][index];
}
export {
  getToolByIndex,
  Tool,
  Brush,
  DottedFreehand,
  ContinuousFreehand,
  StraightLine,
  Curve,
  Fill,
  AirBrush,
  UnfilledFilledRectangle,
  UnfilledFilledCircle,
  UnfilledFilledEllipse,
  UnfilledFilledPolygon,
  BrushSelector,
  Magnifier,
  Zoom,
  Undo,
  Clear
};
