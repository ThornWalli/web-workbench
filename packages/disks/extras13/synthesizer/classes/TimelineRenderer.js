import { ipoint } from '@js-basics/vector';
import { pixelratedCanvas } from '@web-workbench/core/utils/canvas';
import { getOctaveRangeFromBeats } from '../utils';
import SvgNote from '../assets/svg/note_canvas.svg?raw';
import GridRenderer from './GridRenderer';
import NoteRenderer from './NoteRenderer';
import BeatRenderer from './BeatRenderer';
import Notation from './Notation';

export default class TimelineRenderer {
  colors = {
    background: '#0055aa',
    foreground: '#ffffff',
    highlight: '#ffaa55'
  };

  gridInnerPadding = [20, 0, 10, 0];

  constructor(canvas, noteSheet, options) {
    const { colors } = options || {};

    this.noteSheet = noteSheet;
    console.log('noteSheet', noteSheet);

    this.colors = { ...this.colors, ...colors };

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const parser = new DOMParser();
    this.noteRenderer = new NoteRenderer(
      parser.parseFromString(SvgNote, 'image/svg+xml').querySelector('svg')
    );
    this.beats = noteSheet.getVisibleBeats();

    const { length: octaveLength } = getOctaveRangeFromBeats(this.beats);
    this.gridRenderer = new GridRenderer(this.canvas, {
      beatCount: noteSheet.track.beatCount,
      count: octaveLength,
      innerPadding: this.gridInnerPadding
    });
    this.beatRenderer = new BeatRenderer(this.canvas, {
      beats: this.beats,
      gridRenderer: this.gridRenderer,
      noteRenderer: this.noteRenderer
    });
  }

  async render() {
    this.gridRenderer.render();
    await this.beatRenderer.render();
    pixelratedCanvas(this.ctx, [
      '#000000',
      '#ffffff',
      ...Object.values(this.colors)
    ]);

    const { position } = this.gridRenderer.getGridBoundingBox(0);
    this.renderTimeSignature(
      position.x + (this.gridInnerPadding[0] - 6) / 2,
      position.y + 3
    );
  }

  renderTimeSignature(x, y, baseNote, noteCount) {
    const notation = new Notation(this.noteSheet.track.noteCount);
    const fontSize = 16;
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.foreground;
    ctx.font = `${fontSize}px "Amiga Topaz 13", sans-serif`;
    ctx.fillText(this.noteSheet.track.baseNote, x, y + fontSize);
    ctx.fillText(notation.number, x, y + fontSize * 2 + 1);
  }

  get dimension() {
    const { height, count, gutter, outerMargin, innerMargin } =
      this.gridRenderer;
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
