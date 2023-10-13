import { ipoint } from '@js-basics/vector';

const BEAT_ROWS = 4;
export default class GridRenderer {
  beatCount = 1;
  gutter = 27;
  count = 1;
  height = 36;
  outerMargin = [10, 0, 10, 0];
  innerMargin = [0, 48, 0, 48];
  innerPadding = [20, 0, 10, 0];

  color = '#ffaa55';

  constructor(canvas, options) {
    this.setOptions(options);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  setOptions(options) {
    const {
      gutter,
      height,
      margin,
      color,
      outerMargin,
      innerMargin,
      innerPadding
    } = options || {};
    this.gutter = gutter || this.gutter;
    this.height = height || this.height;
    this.margin = margin || this.margin;
    this.color = color || this.color;
    this.outerMargin = outerMargin || this.outerMargin;
    this.innerMargin = innerMargin || this.innerMargin;
    this.innerPadding = innerPadding || this.innerPadding;
  }

  render({ beatCount, count }) {
    this.count = count;
    this.beatCount = beatCount;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < this.count; i++) {
      this.renderGridRow(
        this.getGridBoundingBox(i),
        this.getInnerGridBoundingBox(i)
      );
    }

    // (() => {
    //   ctx.fillStyle = '#ff05';
    //   const { position, dimension } = this.innerBoundingBox;
    //   ctx.fillRect(position.x, position.y, dimension.x, dimension.y);
    // })();
    // (() => {
    //   ctx.fillStyle = '#00ff0055';
    //   const { position, dimension } = this.getInnerGridRowBoundingBox(0);
    //   ctx.fillRect(position.x, position.y, dimension.x, dimension.y);
    // })();
  }

  getInnerGridRowBoundingBox(index) {
    const { position, dimension } = this.getInnerGridBoundingBox(index);
    return {
      position,
      dimension: ipoint(dimension.x, dimension.y * this.beatGrid.y + 1)
    };
  }

  get firstRowIndex() {
    return 0;
  }

  get lastRowIndex() {
    return this.count - 1;
  }

  get innerBoundingBox() {
    return {
      position: ipoint(this.outerMargin[0], this.outerMargin[1]),
      dimension: ipoint(
        this.ctx.canvas.width - (this.outerMargin[0] + this.outerMargin[2]),
        this.ctx.canvas.height - (this.outerMargin[1] + this.outerMargin[3])
      )
    };
  }

  get beatGrid() {
    return ipoint(this.beatCount, BEAT_ROWS);
  }

  get dimension() {
    return ipoint(this.canvas.width, this.canvas.height);
  }

  get mergedMargin() {
    return [
      this.outerMargin[0] + this.innerMargin[0],
      this.outerMargin[1] + this.innerMargin[1],
      this.outerMargin[2] + this.innerMargin[2],
      this.outerMargin[3] + this.innerMargin[3]
    ];
  }

  getGridBoundingBox(index) {
    const margin = this.mergedMargin;
    const x = margin[0] + 0;
    const y = margin[1] + index * this.height + index * this.gutter;

    const width = -(margin[0] + margin[2]) + this.dimension.x;
    const height = this.height / this.beatGrid.y;
    return { position: ipoint(x, y), dimension: ipoint(width, height) };
  }

  getInnerGridBoundingBox(index) {
    const { position, dimension } = this.getGridBoundingBox(index);

    return {
      position: ipoint(
        position.x + this.innerPadding[0],
        position.y + this.innerPadding[1]
      ),
      dimension: ipoint(
        dimension.x - this.innerPadding[0] - this.innerPadding[2], // remove last line pixel
        (this.height - this.innerPadding[1] - this.innerPadding[3]) /
          this.beatGrid.y
      )
    };
  }

  renderGridRow(grid, innerGrid) {
    const ctx = this.ctx;
    ctx.fillStyle = ctx.strokeStyle = this.color;

    let path = new Path2D();
    horizontalLines(path, this.beatGrid, grid);
    ctx.fill(path);
    path = new Path2D();
    verticalLines(path, this.beatGrid, innerGrid, { first: true, last: true });
    ctx.fill(path);

    // end
    ctx.fillRect(
      grid.position.x + grid.dimension.x - 5,
      grid.position.y,
      5,
      grid.dimension.y * this.beatGrid.y
    );
  }
}
function verticalLines(path, beatGrid, { position, dimension }, options = {}) {
  const { first, last } = { first: false, last: false, ...options };
  for (let i = first ? 0 : 1; i < beatGrid.x + last ? 1 : 0; i++) {
    path.rect(
      position.x + 0 + i * Math.floor(dimension.x / beatGrid.x),
      position.y,
      1,
      dimension.y * beatGrid.y
    );
    // path.moveTo(
    //   position.x + 0.5 + i * Math.floor(dimension.x / beatGrid.x),
    //   position.y
    // );
    // path.lineTo(
    //   position.x + 0.5 + i * Math.floor(dimension.x / beatGrid.x),
    //   dimension.y * beatGrid.y + position.y
    // );
  }
}
function horizontalLines(path, beatGrid, { position, dimension }) {
  for (let i = 0; i <= beatGrid.y; i++) {
    path.rect(position.x, i * dimension.y + position.y, dimension.x, 1);
  }
}
