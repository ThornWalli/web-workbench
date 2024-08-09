import { ipoint, point } from '@js-basics/vector';
import { flipCanvas } from '@web-workbench/core/utils/canvas';
import { GROUP_DIRECTIONS } from '../types';
import { BASE_NOTE_HEIGHT } from '../utils';
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
    const noteDetails = [];

    const { position: gridRowPosition, dimension: gridRowDimension } =
      this.gridRenderer.getInnerGridRowBoundingBox(
        this.gridRenderer.lastRowIndex
      );

    const noteGroups = Object.entries(beat.noteGroups);
    for (let noteGroupX = 0; noteGroupX < noteGroups.length; noteGroupX++) {
      const [, groups] = noteGroups[Number(noteGroupX)];
      // console.log(`render time ${time}`, groups);

      for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        const { notes, align } = groups[Number(groupIndex)];

        let startNote;
        for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
          const bindingStart = noteIndex === 0;
          const bindingEnd = noteIndex === notes.length - 1;
          const binding =
            notes[Number(noteIndex)].bindingCount &&
            (bindingStart || startNote);

          const flip =
            this.flipActive &&
            notes[Number(noteIndex)].bindingCount > 0 &&
            groupIndex % 2 === 1 &&
            notes[Number(noteIndex)].name;

          const resolvedNote = await this.resolveNote(notes, noteIndex, {
            baseNote,
            noteCount,
            align,
            flip,
            binding
          });
          const { position, note, canvas } = resolvedNote;

          let firstPixel = resolvedNote.firstPixel;
          if (flip) {
            firstPixel = [
              canvas.width - firstPixel.x - 1,
              canvas.height - firstPixel.y - 1 - BASE_NOTE_HEIGHT
            ];
          }
          let targetPosition = point(beatX, gridRowPosition.y);

          targetPosition.x =
            targetPosition.x + (width * (note.delay - beat.index * 2)) / 2;

          targetPosition.y += (gridRowDimension.y - canvas.height) / 2;
          targetPosition.y -= canvas.height / 2;

          targetPosition.y += SVG_HEIGHT_OFFSET;
          targetPosition.y += BASE_NOTE_HEIGHT / 2;

          targetPosition.y -= position.y;

          targetPosition = point(() => Math.round(targetPosition));

          let flippedCanvas = canvas;
          if (flip) {
            flippedCanvas = flipCanvas(canvas, true, true);
            targetPosition.y +=
              SVG_HEIGHT_OFFSET + flippedCanvas.height - BASE_NOTE_HEIGHT * 2;
          }

          this.ctx.drawImage(flippedCanvas, targetPosition.x, targetPosition.y);

          noteDetails.push({
            dimension: ipoint(flippedCanvas.width, flippedCanvas.height),
            position: targetPosition,
            note
          });

          if (!note.isPause) {
            this.ctx.fillStyle = this.getNoteColors(note).primary;
            if (noteIndex === 0 && noteIndex === notes.length - 1) {
              const size = [5, 2];

              for (let i = 0; i < note.bindingCount; i++) {
                if (flip) {
                  this.ctx.fillRect(
                    targetPosition.x + firstPixel.x,
                    targetPosition.y + BASE_NOTE_HEIGHT + firstPixel.y + i * -6,
                    ...size
                  );
                  this.ctx.fillRect(
                    targetPosition.x + firstPixel.x + size[0] - 2,
                    targetPosition.y +
                      BASE_NOTE_HEIGHT +
                      firstPixel.y +
                      i * -6 -
                      2,
                    2,
                    2
                  );
                } else {
                  this.ctx.fillRect(
                    targetPosition.x + firstPixel.x,
                    targetPosition.y + firstPixel.y + i * 6,
                    ...size
                  );
                  this.ctx.fillRect(
                    targetPosition.x + firstPixel.x + size[0] - 2,
                    2 + targetPosition.y + firstPixel.y + i * 6,
                    2,
                    2
                  );
                }
              }
            } else if (bindingStart) {
              startNote = ipoint(
                targetPosition.x + firstPixel.x,
                targetPosition.y + firstPixel.y
              );
            } else if (bindingEnd) {
              this.ctx.lineWidth = 1;
              const h = 4;
              // this.ctx.fillStyle = this.colors.foreground;
              this.ctx.beginPath();
              for (let c = 0; c < note.bindingCount; c++) {
                if (flip) {
                  const gap = 6;
                  this.ctx.moveTo(
                    startNote.x,
                    startNote.y + BASE_NOTE_HEIGHT - c * gap
                  );
                  this.ctx.lineTo(
                    targetPosition.x + firstPixel.x + 1,
                    targetPosition.y + firstPixel.y + BASE_NOTE_HEIGHT - c * gap
                  );
                  this.ctx.lineTo(
                    targetPosition.x + firstPixel.x + 1,
                    targetPosition.y +
                      firstPixel.y +
                      BASE_NOTE_HEIGHT -
                      c * gap +
                      h
                  );
                  this.ctx.lineTo(
                    startNote.x,
                    startNote.y + BASE_NOTE_HEIGHT - c * gap + h
                  );
                  this.ctx.lineTo(
                    startNote.x,
                    startNote.y + BASE_NOTE_HEIGHT - c * gap
                  );
                } else {
                  const gap = 6;
                  this.ctx.moveTo(startNote.x, startNote.y + c * gap);
                  this.ctx.lineTo(
                    targetPosition.x + firstPixel.x + 1,
                    targetPosition.y + firstPixel.y + c * gap
                  );
                  this.ctx.lineTo(
                    targetPosition.x + firstPixel.x + 1,
                    targetPosition.y + firstPixel.y + c * gap + h
                  );
                  this.ctx.lineTo(startNote.x, startNote.y + c * gap + h);
                  this.ctx.lineTo(startNote.x, startNote.y + c * gap);
                }
              }
              this.ctx.fill();
              startNote = null;
            }
          }
        }
      }
    }

    return noteDetails;
  }

  async resolveNote(notes, index, { align, flip, binding }) {
    const note = notes[Number(index)];

    const position = ipoint(0, note.octavePosition * BASE_NOTE_HEIGHT);

    let offsetHeight = 0;

    const directonAscending = align === GROUP_DIRECTIONS.ASCENDING;

    const angleOffset = align === GROUP_DIRECTIONS.EQUAL ? 0 : 3;
    const lastNote = notes[notes.length - 1];
    const firstNote = notes[0];
    if (binding) {
      if (flip) {
        if (directonAscending) {
          offsetHeight = Math.floor(
            (note.octavePosition - firstNote.octavePosition) *
              BASE_NOTE_HEIGHT -
              angleOffset * index
          );
        } else {
          offsetHeight = Math.floor(
            (note.octavePosition - lastNote.octavePosition) * BASE_NOTE_HEIGHT -
              angleOffset * (notes.length - 1 - index)
          );
        }
      } else if (directonAscending) {
        offsetHeight = Math.floor(
          (lastNote.octavePosition - note.octavePosition) * BASE_NOTE_HEIGHT -
            angleOffset * (notes.length - 1 - index)
        );
      } else {
        offsetHeight = Math.floor(
          (firstNote.octavePosition - note.octavePosition) * BASE_NOTE_HEIGHT -
            angleOffset * index
        );
      }
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
