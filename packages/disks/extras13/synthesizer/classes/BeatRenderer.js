import { ipoint } from '@js-basics/vector';
import { flipCanvas } from '@web-workbench/core/utils/canvas';
import { BASE_NOTE_HEIGHT, GROUP_DIRECTIONS } from '../utils';
import { SVG_HEIGHT_OFFSET } from './NoteRenderer';
export default class BeatRenderer {
  padding = 10;
  flipActive = false;
  colors = {
    background: '#0055aa',
    foreground: '#ffffff',
    highlight: '#ffaa55'
  };

  baseNote = 4;
  noteCount = 4;

  constructor(canvas, options = {}) {
    const { colors, gridRenderer, noteRenderer } = {
      gridRenderer: null,
      noteRenderer: null,
      ...options
    };
    this.colors = { ...this.colors, ...colors };
    this.gridRenderer = gridRenderer;
    this.noteRenderer = noteRenderer;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async render({ baseNote, noteCount, beats, flipActive }) {
    this.flipActive = flipActive || false;
    this.baseNote = baseNote;
    this.noteCount = noteCount;
    this.beats = beats;

    const beatCount = this.gridRenderer.beatCount;
    const { position: gridRowPosition, dimension: gridDimension } =
      this.gridRenderer.getInnerGridRowBoundingBox(
        this.gridRenderer.lastRowIndex
      );

    const noteDetails = [];
    for (let beatIndex = 0; beatIndex < this.beats.length; beatIndex++) {
      const beat = this.beats[Number(beatIndex)];
      const beatInnerWidth = gridDimension.x / beatCount - this.padding * 2;
      const x =
        gridRowPosition.x +
        this.padding +
        beatIndex * beatInnerWidth +
        beatIndex * this.padding * 2;
      noteDetails.push(await this.renderBeat(beat, x, beatInnerWidth));
    }
    return noteDetails.flat();
  }

  // eslint-disable-next-line complexity
  async renderBeat(beat, beatX, width) {
    const baseNote = this.baseNote;
    const noteCount = this.noteCount;

    const { position: gridRowPosition, dimension: gridRowDimension } =
      this.gridRenderer.getInnerGridRowBoundingBox(
        this.gridRenderer.lastRowIndex
      );
    const { groupedNotes } = beat;
    let groupX = 0;

    const noteDetails = [];

    let x, y;
    for (let groupIndex = 0; groupIndex < groupedNotes.length; groupIndex++) {
      const { notes, direction } = groupedNotes[Number(groupIndex)];

      let startNote;
      for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
        x = beatX + groupX;
        y = gridRowPosition.y;
        const note = notes[Number(noteIndex)];
        if (note.isPause && note.duration) {
          const size = ipoint(3, 8);
          // custom pause
          this.ctx.fillRect(x, y + gridRowDimension.y / 2 - 8, size.x, 16);
          this.ctx.fillRect(
            x + Math.floor((width * note.duration) / 2) - size.x + 1,
            y + gridRowDimension.y / 2 - size.y,
            size.x,
            16
          );
          this.ctx.fillRect(
            x,
            y + gridRowDimension.y / 2 - size.x / 2,
            (width * note.duration) / 2,
            size.x
          );
          groupX += (width * note.duration) / 2;
          // TODO: Referenz oder was?
          noteDetails.push({
            dimension: ipoint((width * note.duration) / 2, 16),
            position: ipoint(x, y + gridRowDimension.y / 2 - 8),
            note
          });
        } else {
          const flip =
            this.flipActive &&
            notes[Number(noteIndex)].bindingCount > 0 &&
            groupIndex % 2 === 1 &&
            notes[Number(noteIndex)].name;

          const resolvedNote = await this.resolveNote(notes, noteIndex, {
            baseNote,
            noteCount,
            width,
            direction,
            flip
          });

          const { position, note, canvas } = resolvedNote;

          let firstPixel = resolvedNote.firstPixel;
          if (flip) {
            firstPixel = [
              canvas.width - firstPixel[0] - 1,
              canvas.height - firstPixel[1] - 1 - BASE_NOTE_HEIGHT
            ];
          }
          y += (gridRowDimension.y - canvas.height) / 2;

          y -= canvas.height / 2;

          y += SVG_HEIGHT_OFFSET;
          y += BASE_NOTE_HEIGHT / 2;
          y -= position.y;

          x = Math.round(x);
          y = Math.round(y);

          groupX += position.x;

          let _canvas = canvas;
          if (flip) {
            _canvas = flipCanvas(canvas, true, true);
            y += SVG_HEIGHT_OFFSET + canvas.height - BASE_NOTE_HEIGHT * 2;
          }
          this.ctx.drawImage(_canvas, x, y);

          noteDetails.push({
            dimension: ipoint(canvas.width, canvas.height),
            position: ipoint(x, y),
            note
          });

          if (!note.isPause) {
            this.ctx.fillStyle = this.getNoteColors(note).primary;
            if (noteIndex === 0 && noteIndex === notes.length - 1) {
              const size = [5, 2];

              for (let i = 0; i < note.bindingCount; i++) {
                if (flip) {
                  this.ctx.fillRect(
                    x + firstPixel[0],
                    y + BASE_NOTE_HEIGHT + firstPixel[1] + i * -6,
                    ...size
                  );
                  this.ctx.fillRect(
                    x + firstPixel[0] + size[0] - 2,
                    y + BASE_NOTE_HEIGHT + firstPixel[1] + i * -6 - 2,
                    2,
                    2
                  );
                } else {
                  this.ctx.fillRect(
                    x + firstPixel[0],
                    y + firstPixel[1] + i * 6,
                    ...size
                  );
                  this.ctx.fillRect(
                    x + firstPixel[0] + size[0] - 2,
                    2 + y + firstPixel[1] + i * 6,
                    2,
                    2
                  );
                }
              }
            } else if (noteIndex === 0) {
              startNote = [x + firstPixel[0], y + firstPixel[1]];
            } else if (noteIndex === notes.length - 1) {
              this.ctx.lineWidth = 1;
              const h = 4;
              // this.ctx.fillStyle = this.colors.foreground;
              this.ctx.beginPath();
              for (let c = 0; c < note.bindingCount; c++) {
                if (flip) {
                  const gap = 6;
                  this.ctx.moveTo(
                    startNote[0],
                    startNote[1] + BASE_NOTE_HEIGHT - c * gap
                  );
                  this.ctx.lineTo(
                    x + firstPixel[0] + 1,
                    y + firstPixel[1] + BASE_NOTE_HEIGHT - c * gap
                  );
                  this.ctx.lineTo(
                    x + firstPixel[0] + 1,
                    y + firstPixel[1] + BASE_NOTE_HEIGHT - c * gap + h
                  );
                  this.ctx.lineTo(
                    startNote[0],
                    startNote[1] + BASE_NOTE_HEIGHT - c * gap + h
                  );
                  this.ctx.lineTo(
                    startNote[0],
                    startNote[1] + BASE_NOTE_HEIGHT - c * gap
                  );
                } else {
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
              }
              this.ctx.fill();
            }
          }
        }
      }
    }

    return noteDetails;
  }

  async resolveNote(notes, index, { width, direction, flip }) {
    const note = notes[Number(index)];

    const position = ipoint(
      (note.toSeconds() / (2 * (this.baseNote / this.noteCount))) * width,
      note.position * BASE_NOTE_HEIGHT
    );

    let offsetHeight = 0;

    const directonAscending = direction === GROUP_DIRECTIONS.ASCENDING;

    const angleOffset = direction === GROUP_DIRECTIONS.EQUAL ? 0 : 3;
    const lastNote = notes[notes.length - 1];
    const firstNote = notes[0];
    if (flip) {
      if (directonAscending) {
        offsetHeight = Math.floor(
          (note.position - firstNote.position) * BASE_NOTE_HEIGHT -
            angleOffset * index
        );
      } else {
        offsetHeight = Math.floor(
          (note.position - lastNote.position) * BASE_NOTE_HEIGHT -
            angleOffset * (notes.length - 1 - index)
        );
      }
    } else if (directonAscending) {
      offsetHeight = Math.floor(
        (lastNote.position - note.position) * BASE_NOTE_HEIGHT -
          angleOffset * (notes.length - 1 - index)
      );
    } else {
      offsetHeight = Math.floor(
        (firstNote.position - note.position) * BASE_NOTE_HEIGHT -
          angleOffset * index
      );
    }

    const { canvas, ...args } = await this.noteRenderer.render(
      note,
      {
        colors: this.getNoteColors(note)
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

  getNoteColors(note) {
    return {
      primary: note.selected ? this.colors.highlight : this.colors.foreground,
      secondary: this.colors.background
    };
  }
}
