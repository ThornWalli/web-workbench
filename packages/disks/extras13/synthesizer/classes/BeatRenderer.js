import { ipoint } from '@js-basics/vector';
import { BASE_NOTE_HEIGHT, GROUP_DIRECTIONS } from '../utils';
import { SVG_HEIGHT_OFFSET } from './NoteRenderer';

export default class BeatRenderer {
  padding = 20;
  colors = {
    background: '#0055aa',
    foreground: '#ffffff',
    highlight: '#ffaa55'
  };

  constructor(canvas, options = {}) {
    const { beats, colors, gridRenderer, noteRenderer } = {
      gridRenderer: null,
      noteRenderer: null,
      ...options
    };
    this.colors = { ...this.colors, ...colors };
    this.beats = beats;
    this.gridRenderer = gridRenderer;
    this.noteRenderer = noteRenderer;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async render() {
    const beatCount = this.gridRenderer.beatCount;
    const { position: gridRowPosition, dimension: gridDimension } =
      this.gridRenderer.getInnerGridRowBoundingBox(
        this.gridRenderer.lastRowIndex
      );

    for (let beatIndex = 0; beatIndex < this.beats.length; beatIndex++) {
      const beat = this.beats[Number(beatIndex)];
      let x = gridRowPosition.x;
      const beatInnerWidth = gridDimension.x / beatCount - this.padding * 2;
      x +=
        this.padding +
        beatIndex * beatInnerWidth +
        beatIndex * this.padding * 2;

      await this.renderBeat(beat, x, beatInnerWidth);
    }
  }

  // eslint-disable-next-line complexity
  async renderBeat(beat, beatX, width) {
    const { position: gridRowPosition, dimension: gridRowDimension } =
      this.gridRenderer.getInnerGridRowBoundingBox(
        this.gridRenderer.lastRowIndex
      );
    const { groupedNotes } = beat;
    let groupX = 0;

    let x, y;
    for (let groupIndex = 0; groupIndex < groupedNotes.length; groupIndex++) {
      const { notes, direction } = groupedNotes[Number(groupIndex)];
      // prerender first order last note;

      let preRenderedNote;

      switch (direction) {
        case GROUP_DIRECTIONS.ASCENDING:
          preRenderedNote = await this.resolveNote(
            notes,
            notes.length - 1,
            width,
            direction
          );
          break;
        case GROUP_DIRECTIONS.DESCENDING:
          preRenderedNote = await this.resolveNote(notes, 0, width, direction);
          break;
      }

      let startNote;
      for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
        const { position, note, canvas, firstPixel } = await this.resolveNote(
          notes,
          noteIndex,
          width,
          direction,
          preRenderedNote
        );

        x = beatX + groupX;
        y = gridRowPosition.y;

        y += (gridRowDimension.y - canvas.height) / 2;

        // debugger;
        y -= canvas.height / 2;

        y += SVG_HEIGHT_OFFSET;
        y += BASE_NOTE_HEIGHT / 2;
        y -= position.y;

        x = Math.round(x);
        y = Math.round(y);

        groupX += position.x;

        this.ctx.drawImage(canvas, x, y);

        // bindings
        if (note.name) {
          if (noteIndex === 0 && noteIndex === notes.length - 1) {
            const test = [5, 2];
            for (let i = 0; i < note.bindingCount; i++) {
              this.ctx.fillRect(x + firstPixel[0], y + i * 6, ...test);
              this.ctx.fillRect(
                x + firstPixel[0] + test[0] - 2,
                2 + y + i * 6,
                2,
                2
              );
            }
          } else if (noteIndex === 0) {
            startNote = [x + firstPixel[0], y + firstPixel[1]];
          } else if (noteIndex === notes.length - 1) {
            this.ctx.lineWidth = 1;
            const h = 4;
            this.ctx.fillStyle = this.colors.foreground;
            this.ctx.beginPath();
            for (let c = 0; c < note.bindingCount; c++) {
              const gap = 6;
              this.ctx.moveTo(startNote[0], startNote[1] + c * gap);
              this.ctx.lineTo(
                x + firstPixel[0] + 1,
                y + firstPixel[1] + c * gap
              );
              this.ctx.lineTo(
                x + firstPixel[0] + 1,
                y + firstPixel[1] + c * gap + h
              );
              this.ctx.lineTo(startNote[0], startNote[1] + c * gap + h);
              this.ctx.lineTo(startNote[0], startNote[1] + c * gap);
            }
            this.ctx.fill();
          }
        }
      }
    }
  }

  async resolveNote(notes, index, width, direction, controlNote) {
    const note = notes[Number(index)];
    const position = ipoint(
      (width * note.toSeconds()) / 2,
      note.position * BASE_NOTE_HEIGHT
    );
    const angleOffset = 5;
    let offsetHeight = 0;
    if (controlNote) {
      offsetHeight = Math.floor(
        (controlNote.position.y || 0) -
          position.y -
          notes.length * 2 +
          ((notes.length * angleOffset * index) / notes.length) *
            (direction === GROUP_DIRECTIONS.ASCENDING ? 1 : -1)
      );
    }

    const { canvas, ...args } = await this.noteRenderer.render(
      note,
      {
        colors: {
          primary: this.colors.foreground,
          secondary: this.colors.background,
          tertiary: this.colors.highlight
        }
      },
      offsetHeight
    );
    return {
      offsetHeight,
      position,
      note,
      canvas,
      ...args
    };
  }
}
