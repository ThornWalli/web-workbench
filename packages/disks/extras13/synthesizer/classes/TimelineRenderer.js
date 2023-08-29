import { ipoint } from '@js-basics/vector';
import { pixelratedCanvas } from '@web-workbench/core/utils/canvas';
import { getOctaveRangeFromNotes } from '../utils';
import GridRenderer from './GridRenderer';
import NoteRenderer from './NoteRenderer';
import BeatRenderer from './BeatRenderer';

export default class TimelineRenderer {
  colors = {
    background: '#0055aa',
    foreground: '#ffffff',
    highlight: '#ffaa55'
  };

  gridInnerPadding = [20, 0, 10, 0];

  constructor(canvas, track, options) {
    const { colors } = options || {};

    this.track = track;

    this.colors = { ...this.colors, ...colors };

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });

    this.noteRenderer = new NoteRenderer();

    this.gridRenderer = new GridRenderer(this.canvas, {
      innerPadding: this.gridInnerPadding
    });

    this.beatRenderer = new BeatRenderer(this.canvas, {
      gridRenderer: this.gridRenderer,
      noteRenderer: this.noteRenderer
    });
  }

  get octaveLength() {
    const { length: octaveLength } = getOctaveRangeFromNotes(this.track.notes);
    return Math.max(Math.floor(octaveLength * 0.8), 1);
  }

  async render(options = {}) {
    options = { selectedIndex: -1, flipActive: false, ...options };

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const track = this.track;

    this.gridRenderer.render({
      beatCount: track.beatCount,
      count: this.octaveLength
    });

    const notes = await this.beatRenderer.render({
      flipActive: options.flipActive,
      baseNote: track.baseNote,
      noteCount: track.noteCount,
      beats: track.getVisibleBeats(options)
    });
    for (let i = 0; i < this.gridRenderer.count; i++) {
      const { position } = this.gridRenderer.getGridBoundingBox(i);
      this.renderTimeSignature(
        position.x + (this.gridInnerPadding[0] - 6) / 2,
        position.y + 3
      );
    }

    pixelratedCanvas(this.ctx, [
      '#000000',
      '#ffffff',
      ...Object.values(this.colors)
    ]);

    return { notes };
  }

  renderTimeSignature(x, y) {
    const fontSize = 16;
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.foreground;
    ctx.font = `${fontSize}px "Amiga Topaz 13", sans-serif`;
    ctx.fillText(this.track.baseNote, x, y + fontSize);
    ctx.fillText(this.track.noteCount, x, y + fontSize * 2 + 1);
  }

  get dimension() {
    const { height, gutter, outerMargin, innerMargin } = this.gridRenderer;
    const count = this.octaveLength;
    return ipoint(
      undefined,
      height * count +
        gutter * (count - 1) +
        outerMargin[1] +
        outerMargin[3] +
        innerMargin[1] +
        innerMargin[3]
    );
  }
}
