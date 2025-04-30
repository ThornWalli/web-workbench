import type { NoteConfigDefinition, NoteTestDefinition } from './types';

function drawRect(
  ctx: CanvasRenderingContext2D,
  rect: SVGRectElement,
  offset: number[],
  color: string,
  offsetHeight = 0
) {
  ctx.fillStyle = color;
  ctx.fillRect(
    Number(rect.getAttribute('x')) + offset[0],
    Number(rect.getAttribute('y')) + offset[1] - offsetHeight,
    Number(rect.getAttribute('width')),
    Number(rect.getAttribute('height')) + offsetHeight
  );
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  polygon: SVGPolygonElement,
  offset: number[],
  color: string
) {
  if (!(polygon instanceof SVGPolygonElement)) {
    throw new Error('polygon is not an instance of SVGPolygonElement');
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  Array.from(polygon.points).forEach((point, index) => {
    if (index < 1) {
      ctx.moveTo(point.x + offset[0], point.y + offset[1]);
    } else {
      ctx.lineTo(point.x + offset[0], point.y + offset[1]);
    }
  });
  ctx.closePath();
  ctx.fill();
}

export const extras: NoteTestDefinition[] = [
  {
    test: /^2m/,
    name: 'sharp',
    selectors: [
      {
        selector: '#sharp rect',
        draw: drawRect,
        offset: [-8, 0]
      }
    ]
  },
  {
    test: /^2m/,
    name: 'doubleSharp',
    selectors: [
      {
        selector: '#double-sharp rect',
        draw: drawRect,
        offset: [-8, 0]
      }
    ]
  },
  {
    test: /^2m/,
    name: 'dot',
    selectors: [
      {
        selector: '#dot',
        draw: drawPolygon,
        offset: [4, 0]
      }
    ]
  },
  {
    test: /^1m/,
    name: 'sharp',
    selectors: [
      {
        selector: '#sharp rect',
        draw: drawRect,
        offset: [-4, 0]
      }
    ]
  },
  {
    test: /^1m/,
    name: 'doubleSharp',
    selectors: [
      {
        selector: '#double-sharp rect',
        draw: drawRect,
        offset: [-4, 0]
      }
    ]
  },
  {
    test: /^1m/,
    name: 'dot',
    selectors: [
      {
        selector: '#dot',
        draw: drawPolygon,
        offset: [1, 0]
      }
    ]
  },
  {
    test: /^2m/,
    name: 'flat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect,
        offset: [-8, 0]
      }
    ]
  },
  {
    test: /^2m/,
    name: 'doubleFlat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect,
        offset: [-8, 0]
      },
      {
        selector: '#flat-2 rect',
        draw: drawRect,
        offset: [-8, 0]
      }
    ]
  },
  {
    test: /^1m/,
    name: 'flat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect,
        offset: [-5, 0]
      }
    ]
  },
  {
    test: /^1m/,
    name: 'doubleFlat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect,
        offset: [-5, 0]
      },
      {
        selector: '#flat-2 rect',
        draw: drawRect,
        offset: [-5, 0]
      }
    ]
  },
  {
    name: 'flat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect
      }
    ]
  },
  {
    name: 'doubleFlat',
    selectors: [
      {
        selector: '#flat-1 rect',
        draw: drawRect
      },
      {
        selector: '#flat-2 rect',
        draw: drawRect
      }
    ]
  },
  {
    name: 'sharp',
    selectors: [
      {
        selector: '#sharp rect',
        draw: drawRect
      }
    ]
  },
  {
    name: 'doubleSharp',
    selectors: [
      {
        selector: '#double-sharp rect',
        draw: drawRect
      }
    ]
  },
  {
    name: 'dot',
    selectors: [
      {
        selector: '#dot',
        draw: drawPolygon
      }
    ]
  }
];

export const pauseTimeDefinitions: NoteConfigDefinition[] = [
  {
    time: [/^1m/],
    offset: [0, 3],
    selectors: [
      {
        selector: '#whole-pause',
        draw: drawRect
      }
    ]
  },
  {
    time: [/^2m/],
    offset: [0, 3],
    selectors: [
      {
        selector: '#double-pause',
        draw: drawRect
      }
    ]
  },
  {
    time: [/^2[nt]/],
    offset: [0, 7],
    selectors: [
      {
        selector: '#half-pause',
        draw: drawRect
      }
    ]
  },
  {
    time: [/^4[nt]/],
    offset: [0, 0],
    selectors: [
      {
        selector: '#divide-pause-line-0',
        draw: drawRect
      },
      {
        selector: '#divide-pause-line-1',
        draw: drawPolygon
      }
    ]
  },
  {
    time: [/^8[nt]/],
    selectors: [
      {
        selector: '#divide-pause-line-0',
        draw: drawRect
      },
      {
        selector: '#divide-pause-line-1',
        draw: drawPolygon
      },
      {
        selector: '#divide-pause-line-2',
        draw: drawPolygon
      }
    ]
  },
  {
    time: [/^16[nt]/],
    offset: [0, 0],
    selectors: [
      {
        selector: '#divide-pause-line-0',
        draw: drawRect
      },
      {
        selector: '#divide-pause-line-1',
        draw: drawPolygon
      },
      {
        selector: '#divide-pause-line-2',
        draw: drawPolygon,
        color: 'black'
      },
      {
        selector: '#divide-pause-line-3',
        draw: drawPolygon,
        color: 'black'
      }
    ]
  },
  {
    time: [/^32[nt]/],
    offset: [0, 0],
    selectors: [
      {
        selector: '#divide-pause-line-0',
        draw: drawRect
      },
      {
        selector: '#divide-pause-line-1',
        draw: drawPolygon
      },
      {
        selector: '#divide-pause-line-2',
        draw: drawPolygon
      },
      {
        selector: '#divide-pause-line-3',
        draw: drawPolygon
      },
      {
        selector: '#divide-pause-line-4',
        draw: drawPolygon
      }
    ]
  }
];

export const NOTE_COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary'
};
export const noteTimeDefinitions: NoteConfigDefinition[] = [
  {
    time: [/^1m/],
    selectors: [
      {
        selector: '#whole-background',
        draw: drawPolygon
      },
      {
        selector: '#whole-foreground',
        draw: drawPolygon,
        color: NOTE_COLORS.SECONDARY
      }
    ]
  },
  {
    time: [/^2m/],
    selectors: [
      {
        selector: '#whole-background',
        draw: drawPolygon
      },
      {
        selector: '#whole-foreground',
        draw: drawPolygon,
        color: NOTE_COLORS.SECONDARY
      },
      {
        selector: '#whole-double rect',
        draw: drawRect
      }
    ]
  },
  {
    time: [/^2[nt]/],
    selectors: [
      {
        selector: '#divide-background',
        draw: drawPolygon
      },
      {
        selector: '#divide-foreground',
        draw: drawPolygon,
        color: NOTE_COLORS.SECONDARY
      },
      {
        selector: '#divide-line',
        draw: drawRect,
        autoHeight: true
      }
    ]
  },
  {
    time: [/^4[nt]/],
    selectors: [
      {
        selector: '#divide-background',
        draw: drawPolygon
      },
      // {
      //   selector: '#divide-foreground',
      //   draw: drawPolygon,
      //   colorInvert: true
      // },
      {
        selector: '#divide-line',
        draw: drawRect,
        autoHeight: true
      }
      // {
      //   selector: '#divide-line-1',
      //   draw: drawPolygon,
      //   line: true
      // }
    ]
  },
  {
    time: [/^8[nt]/],
    selectors: [
      {
        selector: '#divide-background',
        draw: drawPolygon
      },
      // {
      //   selector: '#divide-foreground',
      //   draw: drawPolygon,
      //   colorInvert: true
      // },
      {
        selector: '#divide-line',
        draw: drawRect,
        autoHeight: true
      }
      // {
      //   selector: '#divide-line-1',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-2',
      //   draw: drawPolygon,
      //   line: true
      // }
    ]
  },
  {
    time: [/^16[nt]/],
    selectors: [
      {
        selector: '#divide-background',
        draw: drawPolygon
      },
      // {
      //   selector: '#divide-foreground',
      //   draw: drawPolygon,
      //   colorInvert: true
      // },
      {
        selector: '#divide-line',
        draw: drawRect,
        autoHeight: true
      }
      // {
      //   selector: '#divide-line-1',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-2',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-3',
      //   draw: drawPolygon,
      //   line: true
      // }
    ]
  },
  {
    time: [/^32[nt]/],
    selectors: [
      {
        selector: '#divide-background',
        draw: drawPolygon
      },
      // {
      //   selector: '#divide-foreground',
      //   draw: drawPolygon,
      //   colorInvert: true
      // },
      {
        selector: '#divide-line',
        draw: drawRect,
        autoHeight: true
      }
      // {
      //   selector: '#divide-line-1',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-2',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-3',
      //   draw: drawPolygon,
      //   line: true
      // },
      // {
      //   selector: '#divide-line-4',
      //   draw: drawPolygon,
      //   line: true
      // }
    ]
  }
];
