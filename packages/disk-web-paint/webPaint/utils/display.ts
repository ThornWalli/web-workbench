import type { DocumentMeta } from './../lib/classes/Document';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type DisplayOptions from '../lib/classes/DisplayOptions';

export function normalizePosition(
  position: IPoint & number,
  {
    dimension
  }: {
    dimension: IPoint & number;
  }
) {
  return ipoint(() => (position / dimension! - 0.5) * 2);
}
export function unnormalizePosition(
  position: IPoint & number,
  { dimension }: { dimension: IPoint & number }
) {
  return ipoint(() => (position / 2 + 0.5) * dimension!);
}

export function normalizeDimension(
  size: IPoint & number,
  { dimension }: { dimension: IPoint & number }
) {
  return ipoint(() => size / dimension!);
}

export function unnormalizeDimension(
  size: IPoint & number,
  {
    dimension
  }: {
    dimension: IPoint & number;
  }
) {
  return ipoint(() => size * dimension!);
}

export function fixedPosition(
  position: IPoint & number,
  {
    documentMeta,
    dimension,
    displayOptions
  }: {
    documentMeta: DocumentMeta;
    dimension: IPoint & number;
    displayOptions: DisplayOptions;
  }
) {
  position = positionToRealPosition(
    normalizePosition(position, { dimension }),
    {
      documentMeta,
      dimension: dimension!,
      displayPosition: displayOptions.position,
      zoomLevel: displayOptions.zoomLevel
    }
  );
  position = realPositionToPosition(
    ipoint(() => {
      return Math.round(position);
    }),
    {
      documentMeta,
      dimension: dimension!,
      displayPosition: displayOptions.position,
      zoomLevel: displayOptions.zoomLevel
    }
  );
  return position;
}

export function dimensionToRealDimension(
  normalizedDimension: IPoint & number,
  {
    dimension,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const realPosition = ipoint(() =>
    Math.round(normalizedDimension * (dimension / zoomLevel))
  );
  return realPosition;
}

function realDimensionToDimension(
  realDimension: IPoint & number,
  {
    dimension,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  return ipoint(() => realDimension / (dimension / zoomLevel));
}

export function fixedDimension(
  dimension: IPoint & number,
  {
    displayOptions,
    normalizedDimension
  }: {
    displayOptions: DisplayOptions;
    normalizedDimension: IPoint & number;
  }
) {
  normalizedDimension = dimensionToRealDimension(
    normalizeDimension(normalizedDimension, { dimension }),
    {
      dimension: dimension!,
      displayPosition: displayOptions.position,
      zoomLevel: displayOptions.zoomLevel
    }
  );
  normalizedDimension = realDimensionToDimension(normalizedDimension, {
    dimension: dimension!,
    displayPosition: displayOptions.position,
    zoomLevel: displayOptions.zoomLevel
  });
  return normalizedDimension;
}

export function positionToRealPosition(
  position: IPoint & number,
  {
    documentMeta,
    dimension,
    displayPosition,
    zoomLevel
  }: {
    documentMeta: DocumentMeta;
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const imageDataDimension = documentMeta.dimension;

  const realPosition = ipoint(
    () =>
      displayPosition * imageDataDimension +
      imageDataDimension / 2 +
      ((position / zoomLevel) * dimension) / 2
  );
  return realPosition;
}

export function realPositionToPosition(
  realPosition: IPoint & number,
  {
    documentMeta,
    dimension,
    displayPosition,
    zoomLevel
  }: {
    documentMeta: DocumentMeta;
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const imageDataDimension = documentMeta.dimension;

  const position = ipoint(
    () =>
      ((realPosition -
        (displayPosition * imageDataDimension + imageDataDimension / 2)) *
        zoomLevel) /
      (dimension / 2)
  );
  return position;
}
