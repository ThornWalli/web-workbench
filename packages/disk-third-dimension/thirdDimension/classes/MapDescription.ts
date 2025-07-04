/* eslint-disable complexity */
import type { IVector } from '@js-basics/vector';
import { ivector } from '@js-basics/vector';
import type { GroundType } from '../types';

export default class MapDescription {
  dimension: IVector & number;
  depthMatrix: number[];
  groundMatrix: GroundType[];
  points: PointDescription[];
  size: number = 0.2;
  constructor(
    depthMatrix: number[],
    groundMatrix: GroundType[],
    width: number,
    height: number,
    size: number
  ) {
    this.depthMatrix = depthMatrix;
    this.groundMatrix = groundMatrix;
    this.dimension = ivector(width, 0, height);
    this.size = size;

    console.log('dimension', this.dimension);

    const preparedMatrix = depthMatrix.map((y, index) => {
      const x = index % this.power;
      const z = Math.floor(index / this.power);
      return ivector(x, y, z);
    });

    this.points = preparedMatrix.map((point, index) =>
      getPointDescription({
        point,
        index,
        power: this.power,
        matrix: depthMatrix
      })
    );
  }

  get power() {
    return Math.sqrt(this.depthMatrix.length);
  }

  getType({ x, z }: { x: number; z: number }) {
    x = Math.floor(x);
    z = Math.floor(z);
    return this.groundMatrix[z * this.dimension.x + x];
  }

  getTypeByPosition({ x, z }: { x: number; y?: number; z: number }) {
    x = Math.floor(this.dimension.x / 2) + x;
    z = Math.floor(this.dimension.z / 2) + z;
    return this.groundMatrix[z * this.dimension.x + x];
  }

  getPointByPosition({ x, z }: { x: number; z: number }) {
    const x_ = Math.round(x * (1 / this.size));
    // const y_ = Math.round(y * (1 / this.size));
    const z_ = Math.round(z * (1 / this.size));

    const description =
      this.points[
        (Math.floor(this.dimension.z / 2) + z_) * this.dimension.x +
          Math.floor(this.dimension.x / 2) +
          x_
      ];

    // console.log(
    //   { x_, z_ },
    //   this.groundMatrix[
    //     (Math.floor(this.dimension.z / 2) + z_) * this.dimension.x +
    //       Math.floor(this.dimension.x / 2) +
    //       x_
    //   ],
    //   description.point.toJSON()
    // );
    const test =
      description.northEast ||
      description.northWest ||
      description.southEast ||
      description.southWest ||
      0;
    // const origin = (this.size / 2 / this.size) * test;
    // console.log('test', { test, origin }, x / this.size);+
    let i = x;
    const testA = test * ((0.5 + i / this.size) % 1);

    if (1 === (description.northEast || description.northWest)) {
      i *= -1;
    }
    console.log(
      x,
      test - description.point.y,
      1 === (description.northEast || description.northWest),
      1 === (description.southEast || description.southWest)
    );
    return ivector(
      x,
      description.point.y + testA,
      // description.point.y + Math.abs(test * ((x / 1 / this.size + 0.5) % 1)),
      z
    );
  }
}

const getPointDescription = ({
  point,
  index,
  power,
  matrix
}: {
  point: IVector & number;
  index: number;
  power: number;
  matrix: number[];
}) => {
  // if (point.x === 6 && point.z === 6) {
  //   debugger;
  // }
  let east =
    matrix[(Math.floor(index / power) - 1) * power + (index % power)] || 0;
  let west =
    matrix[(Math.floor(index / power) + 1) * power + (index % power)] || 0;

  let north =
    matrix[Math.floor(index / power) * power - 1 + (index % power)] || 0;
  let south =
    matrix[Math.floor(index / power) * power + 1 + (index % power)] || 0;

  east -= east !== 0 && point.y;
  west -= west !== 0 && point.y;
  north -= north !== 0 && point.y;
  south -= south !== 0 && point.y;

  let northWest =
    matrix[(Math.floor(index / power) + 1) * power - 1 + (index % power)] || 0;
  let northEast =
    matrix[(Math.floor(index / power) - 1) * power - 1 + (index % power)] || 0;
  let southWest =
    matrix[(Math.floor(index / power) + 1) * power + 1 + (index % power)] || 0;
  let southEast =
    matrix[(Math.floor(index / power) - 1) * power + 1 + (index % power)] || 0;

  northWest -= northWest && point.y;
  northEast -= northEast && point.y;
  southWest -= southWest && point.y;
  southEast -= southEast && point.y;

  const points = [
    // (North Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 0:  Center
    ivector(1, -1, west || south || southWest), // 1:  NE
    ivector(1, 0, east || south || southEast), // 2:  NW

    // (East Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 3:  Center
    ivector(0, -1, west || north || northWest), // 4:  SE
    ivector(1, -1, west || south || southWest), // 5:  NE

    // (South Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 6:  Center
    ivector(0, 0, east || north || northEast), // 7:  SW
    ivector(0, -1, west || north || northWest), // 8:  SE

    // (West Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 9:  Center
    ivector(1, 0, east || south || southEast), // 10: NW
    ivector(0, 0, east || north || northEast) // 11: SW
  ];

  return new PointDescription({
    points,
    point,
    northWest,
    northEast,
    southWest,
    southEast
  });
  // return points.map(point => new Vector3(point.x, point.y, point.z));
};

class PointDescription {
  point: IVector & number = ivector(0, 0, 0);
  points: (IVector & number)[] = [];
  northWest: number = 0;
  northEast: number = 0;
  southWest: number = 0;
  southEast: number = 0;

  constructor({
    point,
    points,
    northWest,
    northEast,
    southWest,
    southEast
  }: {
    point: IVector & number;
    points: (IVector & number)[];
    northWest: number;
    northEast: number;
    southWest: number;
    southEast: number;
  }) {
    this.point = point;
    this.points = points;
    this.northWest = northWest;
    this.northEast = northEast;
    this.southWest = southWest;
    this.southEast = southEast;
  }
}
