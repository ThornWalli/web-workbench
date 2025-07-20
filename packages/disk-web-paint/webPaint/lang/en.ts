import {
  BLEND_MODE,
  BRUSH_MODE,
  BRUSH_TYPE,
  SHAPE_STYLE,
  TOOL
} from '../types/select';
import { RESIZE_TYPE } from '../types/worker/main';

export default {
  warning: {
    page_change: 'Do you really want to leave the page?'
  },
  resize_type: {
    [RESIZE_TYPE.NEAREST_NEIGHBOR]: 'Nearest Neighbor',
    [RESIZE_TYPE.BICUBIC]: 'Bicubic',
    [RESIZE_TYPE.BILINEAR]: 'Bilinear',
    [RESIZE_TYPE.LANCZOS]: 'LANCZOS'
  },

  blend_mode: {
    [BLEND_MODE.NORMAL]: 'Normal',
    [BLEND_MODE.MULTIPLY]: 'Multiply',
    [BLEND_MODE.SCREEN]: 'Screen',
    [BLEND_MODE.OVERLAY]: 'Overlay',
    [BLEND_MODE.DARKEN]: 'Darken',
    [BLEND_MODE.LIGHTEN]: 'Lighten',
    [BLEND_MODE.COLOR_DODGE]: 'Color Dodge',
    [BLEND_MODE.COLOR_BURN]: 'Color Burn',
    [BLEND_MODE.HARD_LIGHT]: 'Hard Light',
    [BLEND_MODE.SOFT_LIGHT]: 'Soft Light',
    [BLEND_MODE.DIFFERENCE]: 'Difference',
    [BLEND_MODE.EXCLUSION]: 'Exclusion'
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
    [BRUSH_TYPE.DOTS]: 'Dots'
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
        help: { title: 'Help…' },
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
        export_document: { title: 'Export Document…' },
        import_document: { title: 'Import Document…' },
        export: { title: 'Export…' },
        import: { title: 'Import…' },
        import_clipboard: { title: 'Clipboard Import' },
        document_settings: {
          title: 'Document Settings…'
        }
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
        dotted_gap: {
          title: 'Dotted Gap ({{gap}})',
          items: {
            set_custom: {
              title: 'Set custom…',
              text: 'Set custom dotted gap'
            }
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
          text: 'Set custom AirBrush weight (ms)'
        },
        air_brush_interval: {
          title: 'Air Brush Interval ({{interval}})…',
          text: 'Set custom AirBrush interval (ms)'
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
      text: 'Dimension: {{x}}x{{y}}'
    },
    position: {
      text: 'Position: {{x}}/{{y}}'
    },
    zoom: {
      title: 'Zoom: {{zoom}}',
      items: {
        set_zoom: {
          title: 'Set Zoom…',
          text: 'Enter zoom level:'
        },
        reset: {
          title: 'Reset Zoom',
          text: 'Reset zoom to 100%'
        },
        fit: {
          title: 'Fit to Screen',
          text: 'Fit the image to the screen'
        }
      }
    },
    brush_mode: {
      title: 'Brush Mode: {{mode}}'
    },

    layers: {
      title: 'Layers ({{name}})',
      items: {
        visible: {
          title: 'Visible Layer'
        },
        lock: {
          title: 'Lock Layer'
        },
        move_up: {
          title: 'Move Layer Up'
        },
        move_down: {
          title: 'Move Layer Down'
        },
        add: {
          title: 'Add Layer'
        },
        rename: {
          title: 'Rename Layer',
          text: 'Enter new layer name:'
        },
        remove: {
          title: 'Remove Layer'
        },
        duplicate: {
          title: 'Duplicate Layer'
        },
        merge: {
          title: 'Merge Layer'
        },
        blend_mode: {
          title: 'Blend Mode: {{mode}}',
          items: {
            normal: { title: 'Normal' },
            multiply: { title: 'Multiply' },
            screen: { title: 'Screen' },
            overlay: { title: 'Overlay' },
            darken: { title: 'Darken' },
            lighten: { title: 'Lighten' },
            color_dodge: { title: 'Color Dodge' },
            color_burn: { title: 'Color Burn' },
            hard_light: { title: 'Hard Light' },
            soft_light: { title: 'Soft Light' },
            difference: { title: 'Difference' },
            exclusion: { title: 'Exclusion' }
          }
        },
        opacity: {
          title: 'Opacity: {{opacity}}%',
          text: 'Set layer opacity (0 - 100)'
        }
      }
    }
  },
  window: {
    info: {
      title: 'Info'
    },
    help: {
      title: 'Help'
    },
    value_input: {
      title: 'Value Input'
    },
    settings: {
      title: 'Settings',
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
            label: 'Offset (px)'
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
    image_sharpness: {
      title: 'Image Sharpness',
      radius: {
        label: 'Radius'
      },
      threshold: {
        label: 'Threshold'
      },
      apply: {
        label: 'Apply'
      }
    },
    document_resize: {
      title: 'Document Resize',
      width: {
        label: 'Width'
      },
      height: {
        label: 'Height'
      },
      resize_type: {
        label: 'Resize Type'
      },
      save: {
        label: 'Save'
      }
    },
    document_resize_canvas: {
      title: 'Document Resize Canvas',
      width: {
        label: 'Width'
      },
      height: {
        label: 'Height'
      },
      resize_type: {
        label: 'Resize Type'
      },
      save: {
        label: 'Save'
      }
    },
    document_settings: {
      title: 'Document Settings'
    },
    color_palette: {
      title: 'Color Palette',

      colors_from_palette: {
        label: 'Colors from Palette',
        items: {
          default: {
            label: 'Colors from Palette'
          },
          custom_palettes: {
            label: 'Custom Palettes'
          },
          builtin_palettes: {
            label: 'Built-in Palettes'
          }
        }
      },
      palette: {
        label: 'Palette',
        items: {
          new: {
            label: 'New Palette'
          },
          custom_palettes: {
            label: 'Custom Palettes'
          },
          builtin_palettes: {
            label: 'Built-in Palettes'
          }
        }
      },

      add_color: {
        label: 'Add'
      },

      remove_color: {
        label: 'Del'
      },

      move_color_backward: {
        label: '<'
      },

      move_color_forward: {
        label: '>'
      },

      colors_from_image: {
        label: 'Colors from Image'
      },

      add_palette: {
        label: 'Add Palette'
      },
      remove_palette: {
        label: 'Del Palette'
      },
      rename_palette: {
        label: 'Rename Palette'
      },
      import_palette: {
        label: 'Import'
      },
      export_palette: {
        label: 'Export'
      },
      save_palette: {
        label: 'Apply Palette'
      }
    },
    color_picker: {
      title: 'Color Picker',
      apply: {
        label: 'Apply'
      }
    },
    export_document: {
      title: 'Export',
      filename: {
        label: 'Filename'
      },
      type: {
        label: 'Type'
      },
      quality: {
        label: 'Quality'
      },
      width: {
        label: 'Width'
      },
      height: {
        label: 'Height'
      },
      dimension_type: {
        label: 'Type',
        items: {
          pixel: {
            label: 'Pixel'
          },
          percent: {
            label: 'Percent'
          }
        }
      },
      apply: {
        label: 'Export'
      }
    },
    insert_image: {
      title: 'Insert Image',
      width: {
        label: 'Width'
      },
      height: {
        label: 'Height'
      },
      resize_type: {
        label: 'Type'
      },
      position_x: {
        label: 'X'
      },
      position_y: {
        label: 'Y'
      },
      apply: {
        label: 'Insert Image'
      }
    },
    grid_settings: {
      title: 'Grid Settings',
      no_display:
        'No display is currently active. Please select a display to configure the grid settings.',
      active: {
        label: 'Active'
      },
      width: {
        label: 'Width'
      },
      height: {
        label: 'Height'
      },
      position_x: {
        label: 'X'
      },
      position_y: {
        label: 'Y'
      },
      primary_line_color: {
        label: 'Primary Line Color'
      },
      secondary_line_color: {
        label: 'Secondary Line Color'
      },
      apply: {
        label: 'Apply'
      }
    },
    new_document: {
      title: 'New Document',

      width: {
        label: 'Width',
        placeholder: 'Width in pixels'
      },
      height: {
        label: 'Height',
        placeholder: 'Height in pixels'
      },

      document_title: {
        label: 'Title',
        placeholder: 'Document title'
      },

      template: {
        label: 'Template'
      },

      aspect_ratio_info: '**Aspect Ratio** {{x}}x{{y}}',

      apply: {
        label: 'Apply'
      }
    }
  }
};
