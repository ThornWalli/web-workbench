import type { IPoint, Point } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { pixelratedCanvas } from '@web-workbench/core/utils/canvas';
import { prepareNotes } from '../utils/noteTransform';
import { getOctaveRangeFromNotes } from '../utils/note';
import GridRenderer from './GridRenderer';
import NoteRenderer from './NoteRenderer';
import BeatRenderer from './BeatRenderer';
import type Track from './Track';
import type NoteDescription from './NoteDescription';

export default class TimelineRenderer {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  noteRenderer: NoteRenderer;
  gridRenderer: GridRenderer;
  beatRenderer: BeatRenderer;

  colors = {
    background: '#0055aa',
    foreground: '#ffffff',
    highlight: '#ffaa55'
  };

  gridInnerPadding: [number, number, number, number] = [20, 0, 10, 0];

  constructor(
    canvas: OffscreenCanvas,
    options: {
      colors?: {
        background?: string;
        foreground?: string;
        highlight?: string;
      };
    } = { colors: {} }
  ) {
    const { colors } = options || {};
    this.colors = { ...this.colors, ...colors };

    if (!canvas) {
      throw new Error('Canvas is not available');
    }
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas context is not available');
    }
    this.ctx = ctx;

    this.noteRenderer = new NoteRenderer();

    this.gridRenderer = new GridRenderer(this.canvas, {
      innerPadding: this.gridInnerPadding
    });

    this.beatRenderer = new BeatRenderer(this.canvas, {
      gridRenderer: this.gridRenderer,
      noteRenderer: this.noteRenderer
    });
  }

  async render(
    track: Track,
    options: {
      selectedIndex?: number[];
      flipActive?: boolean;
    } = {}
  ) {
    options = { selectedIndex: [], flipActive: false, ...options };

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gridRenderer.render({
      beatCount: track.beatCount,
      count: this.getOctaveLength(track)
    });

    let notes: {
      dimension: IPoint & number;
      position: Point & number;
      note: NoteDescription;
    }[] = [];
    try {
      const beats = track.getVisibleBeatsByDuration(
        undefined,
        prepareNotes(track.notes)
      );

      notes = await this.beatRenderer.render({
        flipActive: options.flipActive,
        baseNote: track.baseNote,
        noteCount: track.noteCount,
        beats
      });
    } catch (error) {
      console.error(error);
    }

    for (let i = 0; i < this.gridRenderer.count; i++) {
      const { position } = this.gridRenderer.getGridBoundingBox(i);
      this.renderTimeSignature(
        track,
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

  renderTimeSignature(track: Track, x: number, y: number) {
    const fontSize = 16;
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.foreground;
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px "Amiga Topaz 13", sans-serif`;
    ctx.fillText(String(track.baseNote), x, y);
    ctx.fillText(String(track.noteCount), x, y + fontSize * 1 + 1);
  }

  getOctaveLength(track: Track) {
    const { length: octaveLength } = getOctaveRangeFromNotes(track.notes);
    return Math.max(Math.floor(octaveLength * 0.8), 1);
  }

  getDimension(track: Track) {
    const { height, gutter, outerMargin, innerMargin } = this.gridRenderer;
    const count = this.getOctaveLength(track);
    return ipoint(
      0,
      height * count +
        gutter * (count - 1) +
        outerMargin[1] +
        outerMargin[3] +
        innerMargin[1] +
        innerMargin[3]
    );
  }
}
