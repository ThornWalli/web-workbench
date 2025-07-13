import { BRUSH_MODE, BRUSH_TYPE, SHAPE_STYLE, TOOL } from '../types/select';

export default {
  warning: {
    page_change: 'Do you really want to leave the page?'
  },
  brush_mode: {
    [BRUSH_MODE.NORMAL]: 'Normal',
    [BRUSH_MODE.REPLACE]: 'Replace',
    [BRUSH_MODE.MULTIPLY]: 'Multiply',
    [BRUSH_MODE.SCREEN]: 'Screen',
    [BRUSH_MODE.OVERLAY]: 'Overlay',
    [BRUSH_MODE.SOFT_LIGHT]: 'Soft Light',
    [BRUSH_MODE.HARD_LIGHT]: 'Hard Light',
    [BRUSH_MODE.DIFFERENCE]: 'Difference',
    [BRUSH_MODE.EXCLUSION]: 'Exclusion',
    [BRUSH_MODE.COLOR_BURN]: 'Color Burn',
    [BRUSH_MODE.LINEAR_BURN]: 'Linear Burn',
    [BRUSH_MODE.COLOR_DODGE]: 'Color Dodge',
    [BRUSH_MODE.LINEAR_DODGE]: 'Linear Dodge',
    [BRUSH_MODE.VIVID_LIGHT]: 'Vivid Light',
    [BRUSH_MODE.LINEAR_LIGHT]: 'Linear Light',
    [BRUSH_MODE.PIN_LIGHT]: 'Pin Light',
    [BRUSH_MODE.HARD_MIX]: 'Hard Mix',
    [BRUSH_MODE.SUBSTRACT]: 'Substract',
    [BRUSH_MODE.DIVIDE]: 'Divide'
  },
  tool: {
    [TOOL.DOTTED_FREEHAND]: 'Dotted Freehand',
    [TOOL.CONTINUOUS_FREEHAND]: 'Continuous Freehand',
    [TOOL.STRAIGHT_LINE]: 'Straight Line',
    [TOOL.CURVE_LINE]: 'Curve',
    [TOOL.FILL_TOOL]: 'Fill Tool',
    [TOOL.AIR_BRUSH]: 'Air Brush',
    [TOOL.RECTANGLE]: 'Rectangle',
    [TOOL.CIRCLE]: 'Circle',
    [TOOL.ELLIPSE]: 'Ellipse',
    [TOOL.POLYGON]: 'Polygon',
    [TOOL.COLOR_PICKER]: 'Color Picker',
    [TOOL.CROP]: 'Crop',
    [TOOL.GRID]: 'Grid',
    [TOOL.ZOOM_FIT]: 'Fit to Screen',
    [TOOL.MAGNIFY]: 'Magnify',
    [TOOL.ZOOM]: 'Zoom',
    [TOOL.STACK_UNDO]: 'Undo',
    [TOOL.STACK_REDO]: 'Redo',
    [TOOL.CLEAR]: 'Clear'
  },
  brush_size: {
    [BRUSH_TYPE.CIRCLE]: {
      small: 'Small Circle',
      medium: 'Medium Circle',
      large: 'Large Circle',
      extra_large: 'Extra Large Circle'
    },
    [BRUSH_TYPE.SQUARE]: {
      small: 'Small Square',
      medium: 'Medium Square',
      large: 'Large Square',
      extra_large: 'Extra Large Square'
    },
    [BRUSH_TYPE.DOTS]: {
      sma: 'Small Dots',
      medi: 'Medium Dots',
      lar: 'Large Dots',
      extra_lar: 'Extra Large Dots'
    }
  },
  brush_type: {
    [BRUSH_TYPE.CIRCLE]: 'Circle',
    [BRUSH_TYPE.SQUARE]: 'Square',
    [BRUSH_TYPE.DOTS]: 'Dots',
    [BRUSH_TYPE.CUSTOM]: 'Custom'
  },
  shape_style: {
    [SHAPE_STYLE.STROKED]: 'Stroked',
    [SHAPE_STYLE.FILLED]: 'Filled',
    [SHAPE_STYLE.STROKED_FILLED]: 'Stroked & Filled'
  },
  context_menu: {
    general: {
      title: 'Web Paint',
      items: {
        settings: { title: 'Settings…' },
        info: { title: 'Info…' },
        close: { title: 'Close' }
      }
    },
    file: {
      title: 'File',
      items: {
        new: { title: 'New' },
        open: { title: 'Open…' },
        save: { title: 'Save' },
        save_as: { title: 'Save As…' },
        export: { title: 'Export…' },
        import: { title: 'Import…' },
        import_clipboard: { title: 'Clipboard Import' }
      }
    },
    edit: {
      title: 'Edit',
      items: {
        undo: { title: 'Undo' },
        redo: { title: 'Redo' },
        copy: { title: 'Copy' },
        insert_image: {
          title: 'Insert Image',
          items: {
            paste: { title: 'Paste' },
            open: { title: 'Open…' },
            import: { title: 'Import…' }
          }
        }
      }
    },
    tools: {
      title: 'Tools',
      items: {
        select_tool: { title: 'Select Tool' },
        brush_type: { title: 'Brush Type ({{type}})' },
        brush_mode: { title: 'Brush Mode ({{mode}})' },
        brush_size: {
          title: 'Brush Size ({{size}}px)',
          items: {
            set_custom: { title: 'Set custom…', text: 'Set custom brush size' }
          }
        },
        segment_length: {
          title: 'Segment Length ({{length}}px)',
          items: {
            set_custom: {
              title: 'Set custom…',
              text: 'Set custom segment length'
            }
          }
        },
        gap_length: {
          title: 'Gap Length ({{length}})',
          items: {
            set_custom: {
              title: 'Set custom…',
              text: 'Set custom gap length'
            }
          }
        },
        air_brush_strength: {
          title: 'Air Brush Strength ({{strength}})…',
          text: 'Set custom AirBrush strength (1 - 1000)'
        },
        air_brush_weight: {
          title: 'Air Brush Weight ({{weight}})…',
          text: 'Set custom AirBrush weight (0.01 - 1)'
        },
        interpolate_segments: {
          title: 'Interpolate Segments'
        }
      }
    },
    image: {
      title: 'Image',
      items: {
        rotate: {
          title: 'Rotate',
          items: {
            rotate_90: { title: 'Rotate 90°' },
            rotate_180: { title: 'Rotate 180°' },
            rotate_270: { title: 'Rotate 270°' }
          }
        },
        flip: {
          title: 'Flip',
          items: {
            horizontal: { title: 'Horizontal' },
            vertical: { title: 'Vertical' }
          }
        },
        operation: {
          title: 'Operation',
          items: {
            invert: { title: 'Invert' },
            grayscale: { title: 'Grayscale' },
            sepia: { title: 'Sepia' },
            brightness: {
              title: 'Brightness…',
              text: 'Adjust Brightness <br>-100% to 100%'
            },
            contrast: {
              title: 'Contrast…',
              text: 'Adjust Contrast <br>-100% to 100%'
            },
            saturation: {
              title: 'Saturation…',
              text: 'Adjust Saturation <br>-100% to 100%'
            },
            sharpen: {
              title: 'Sharpen…'
            },
            blur: {
              title: 'Blur…',
              text: 'Blur (px)'
            },
            emboss: {
              title: 'Emboss…',
              text: 'Emboss (px)'
            },
            resize: {
              title: 'Resize…'
            },
            resize_canvas: {
              title: 'Resize Canvas…'
            }
          }
        }
      }
    },
    color_palette: {
      title: 'Color Palette',
      items: {
        settings: {
          title: 'Settings…'
        },
        no_palettes: {
          title: 'No custom palettes'
        }
      }
    },
    display: {
      title: 'Display',
      items: {
        grid: {
          title: 'Grid…'
        },
        split: {
          title: 'Split View',
          items: {
            one_display: { title: 'One Display' },
            two_displays: { title: 'Two Displays' },
            three_displays: { title: 'Three Displays' },
            four_displays: { title: 'Four Displays' }
          }
        },
        reset: {
          title: 'Reset View',
          items: {
            all: { title: 'All' },
            position: { title: 'Position' },
            zoom: { title: 'Zoom' }
          }
        }
      }
    },
    dimension: {
      text: 'Dimension {{x}}x{{y}}'
    },
    position: {
      text: 'Position {{x}}/{{y}}'
    },
    zoom: {
      title: 'Zoom {{zoom}}',
      text: 'Enter zoom level:'
    },
    brush_mode: {
      title: 'Brush Mode: {{mode}}'
    }
  },
  windows: {
    settings: {
      general: {
        title: 'General',
        text: 'For this Settings you need restart Web Paint.',
        items: {
          native_theme: { label: 'Native Theme' },
          debug: { label: 'Debug' }
        }
      },
      display: {
        title: 'Display',
        items: {
          background: {
            label: 'Background'
          },
          foreground: {
            label: 'Foreground'
          }
        }
      },

      pixel_grid: {
        title: 'Pixel Grid',
        items: {
          grid_color: {
            label: 'Grid Color'
          },
          line_width: {
            label: 'Line Width (px)'
          },
          visible_count: {
            label: 'Visible Count'
          }
        }
      },

      fit_zoom: {
        title: 'Fit Zoom',
        items: {
          active: {
            label: 'Active'
          },
          offset: {
            label: 'Fit Zoom Offset (px)'
          }
        }
      },

      document: {
        title: 'Document',
        items: {
          background: {
            label: 'Background'
          }
        }
      },

      save: {
        label: 'Save'
      },
      reset: {
        label: 'Reset'
      }
    },
    sharpness: {
      title: 'Sharpness',
      radius: {
        label: 'Radius'
      },
      threshold: {
        label: 'Threshold'
      },
      apply: {
        label: 'Apply'
      }
    }
  }
};
