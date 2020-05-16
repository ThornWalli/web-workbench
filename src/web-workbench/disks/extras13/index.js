
import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';

import App from './webPainting/lib/App';
import Bounds from './webPainting/lib/Bounds';
import { WINDOW_POSITION } from '@/web-workbench/classes/WindowWrapper';
import themeBlackContrast from '@/web-workbench/themes/blackContrast';

export const CONFIG_NAMES = {
  WEB_BASIC_SHOW_PREVIEW: 'extras13_web_basic_show_preview',
  WEB_PAINTING_DISPLAY_BACKGROUND: 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND: 'extras13_web_painting_display_foreground'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW]: true,
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
};

export const PROPERTY = {
  HAS_WINDOW_OUTPUT: 'has_window_output',
  CONTENT: 'content',
  OUTPUT_TYPE: 'type'
};

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS);

  return {
    locked: true,
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13
      ],
      [
        ITEM_META.WINDOW_SIZE, ipoint(360, 200)
      ],
      [
        ITEM_META.SORT_SYMBOLS, true
      ]
    ],
    name: 'Extras 1.3',
    items: [

      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING
          ]
        ],
        id: 'WebPainting.app',
        name: 'WebPainting',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webPaintingAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.WEB_BASIC
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'WebBasic.app',
        name: 'WebBasic',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webBasicAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.DIRECTORY
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(380, 200)
          ],
          [
            ITEM_META.SORT_SYMBOLS, true
          ]
        ],
        id: 'BasicDemos',
        name: 'Basic Demos',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        items: [
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'TEST.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'PRINT USING "# #"; 1,2'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'FunctionTest.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'PRINT USING "LEN(\\"ABC\\") #"; LEN("ABC")',
                'PRINT USING "ASC(\\"D\\") ##"; ASC("D")',
                'PRINT USING "CHR$(68) ##"; CHR$(68)',
                'PRINT USING "LEFT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; LEFT$("XYZ", LEN("XYZ")-1)',
                'PRINT USING "RIGHT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; RIGHT$("XYZ", LEN("XYZ")-1)'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Fibonacci.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'READ max',
                'DIM fib%(max)',
                'LET fib(1) = 1',
                'LET fib(2) = 2',
                'FOR i=3 TO max',
                'LET fib(i) = fib(i - 2) + fib(i -1)',
                'NEXT i',
                'FOR i=1 TO max',
                'PRINT fib(i)',
                'NEXT i',
                'DATA 10',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Area.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'DIM w%,h%,a%',
                'LET w%=12',
                'LET h%=4',
                'LET a%=w%*h%',
                'PRINT "With the width " + w%',
                'PRINT " and the height " + h%',
                'PRINT " you have the area " + a%'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Circle.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'DIM r,a',
                'LET r=5',
                'READ pi',
                'LET a=r*r*pi',
                'PRINT USING "With the radius ##.##"; r',
                'PRINT USING "we have the area ##.##"; a',
                'DATA 3.14',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Your_Name.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'PRINT "What is your name?"',
                'INPUT n$',
                'PRINT "What is your shoe size?"',
                'INPUT size',
                'PRINT "Hello "; n$',
                'PRINT USING "your shoe size is ##.##"; size',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'GuessTheNumber.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'GuessTheNumber',
                'CLS',
                'READ max%',
                'DIM number%, guess%, guesses%, message$',
                'LET message$ =  ""',
                'PRINT "The number is between 1-1000."',
                'LET number% = INT(RND * max%) + 1',
                'LET guess% = 1',
                'LET guesses% = 0',
                'WHILE guess%<>number%',
                'PRINT "Guess the number"',
                'PRINT message$',
                'INPUT message$ guess%',
                'IF (guess%<>number%) THEN',
                'IF (guess%>number%) THEN',
                'LET message$ = "Your guess was too high"',
                'ELSE',
                'LET message$ =  "Your guess was too low"',
                'ENDIF',
                'ENDIF',
                'LET guesses% = guesses% + 1',
                'WEND',
                'PRINT USING "You found the number in # tries"; guesses%',
                'DATA 1000',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Factorial.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM result, n',
                'PRINT "Calculate the factorial of"',
                'INPUT n',
                'LET result = 1',
                'FOR i = n TO 1 STEP -1',
                'LET result = result * i',
                'NEXT i',
                'PRINT USING "#! = #"; n, result',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Pyramid.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'DIM stars$',
                'PRINT "Enter the height of the pyramid"',
                'INPUT height',
                'LET stars$ = ""',
                'FOR i = 1 TO height',
                'LET stars$ = ""',
                'FOR j = 1 TO (i+i-1)',
                'LET stars$ = stars$ + "*"',
                'NEXT j',
                'PRINT SPC(height - i) + stars',
                'NEXT i',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Bubble_Sort.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'READ max',
                'DIM SHARED numbers(max)',
                'SUB CreateList(max) STATIC',
                'FOR i=1 TO max',
                'LET numbers(i) = INT(RND * 100)',
                'NEXT i',
                'END SUB',
                'SUB PrintList(max) STATIC',
                'FOR i=1 TO max',
                'PRINT numbers(i)',
                'NEXT i',
                'END SUB',
                'SUB SwapValues(i%, j%) STATIC',
                'LET numbers(i%) = numbers(i%) XOR numbers(j%)',
                'LET numbers(j%) = numbers(i%) XOR numbers(j%)',
                'LET numbers(i%) = numbers(i%) XOR numbers(j%)',
                'END SUB',
                'SUB Sort(max) STATIC',
                'FOR i%=1 TO (max - 1)',
                'FOR j%=i% TO max',
                'IF numbers(i%)>numbers(j%) THEN',
                'CALL SwapValues(i%, j%)',
                'END IF',
                'NEXT j%',
                'NEXT i%',
                'END SUB',
                'CreateList(max)',
                'Sort(max)',
                'PrintList(max)',
                'DATA 10',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Goto.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'PRINT "Step 1"',
                'PRINT "Step 2"',
                'PRINT "Step 3"',
                'GOTO ignore',
                'PRINT "Step 4"',
                'ignore:',
                'PRINT "Step 5"'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Vars.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM A, B',
                'LET A = 2000',
                'LET B = "Hello World"',
                'PRINT USING "A: #"; A',
                'PRINT USING "B: #"; B'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'If.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM A, B',
                'LET A = 1',
                'LET B = 2',
                'IF A == B THEN',
                'PRINT "true"',
                'ELSE',
                'PRINT "false"',
                'END',
                'IF (A < B) THEN',
                'PRINT "true"',
                'END'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'For.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM i%',
                'FOR i% = 1 TO 5',
                'PRINT USING "For Number #"; i%',
                'NEXT i%'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'For_Step.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'CLS',
                'FOR i% = 0 TO 6 STEP 2',
                'PRINT "For Step Number #"; i%',
                'NEXT i%'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'While.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM i%',
                'LET i%=0',
                'WHILE i% < 5',
                'PRINT USING "While Number #"; i%',
                'LET i% = i% + 1',
                'WEND'
              ]
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.BASIC
              ]
            ],
            id: 'Pause.bas',
            data: {
              [PROPERTY.HAS_WINDOW_OUTPUT]: true,
              [PROPERTY.OUTPUT_TYPE]: 'basic',
              [PROPERTY.CONTENT]: [
                'DIM duration',
                'LET duration = 2500',
                'PRINT USING "Start with Pause #ms"; duration',
                'PAUSE duration',
                'PRINT "End Pause"',
                'PRINT USING "Start with Sleep #ms"; duration',
                'PAUSE duration',
                'PRINT "End Sleep"'
              ]
            }
          }

        ]
      }
    ]
  };
};

export function getBasicDefaultModelValue () {
  return {
    [PROPERTY.HAS_WINDOW_OUTPUT]: false,
    [PROPERTY.CONTENT]: '',
    [PROPERTY.OUTPUT_TYPE]: 'basic'
  };
}

function webBasicAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }, path) => {
    const executionResolve = core.addExecution();

    let fsItem;
    const model = {
      actions: {},
      value: getBasicDefaultModelValue(),
      fsItem: null,
      output: [],
      openValue: null
    };
    if (path) {
      fsItem = await modules.files.fs.get(path);
      if (PROPERTY.CONTENT in fsItem.data) {
        const value = Object.assign({}, fsItem.data, {
          [PROPERTY.CONTENT]: [].concat(fsItem.data[PROPERTY.CONTENT]).join('\n')
        });
        model.fsItem = fsItem;
        model.value = value;
      } else {
        throw new Error('Can\'t read file content');
      }
    }
    const [
      WbComponentsWebBasic,
      WbComponentsWebBasicPreview
    ] = await Promise.all([
      import('@/components/disks/extras13/WebBasic').then(module => module.default),
      import('@/components/disks/extras13/webBasic/Preview').then(module => module.default)
    ]);

    const window = modules.windows.addWindow({
      title: 'WebBasic - Extras 1.3',
      component: WbComponentsWebBasic,
      componentData: { model },
      options: {
        scale: true,
        scrollX: true,
        scrollY: true,
        embed: true,
        borderless: true
      },
      layout: {
        size: ipoint(540, 360)
      }
    });

    model.reset = () => {
      model.value = getBasicDefaultModelValue();
      model.fsItem = null;
      model.output = [];
      model.openValue = null;
    };

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow({
          title: 'Preview - WebBasic - Extras 1.3',
          component: WbComponentsWebBasicPreview,
          componentData: { model },
          options: {
            scale: true,
            scrollX: true,
            scrollY: true,
            close: false,
            embed: true,
            borderless: true
          },
          layout: {
            size: ipoint(540, 360)
          }
        }, {
          active: false
        });
        global.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            window, previewWindow
          ]);
        }, 0);
      } else if (previewWindow) {
        window.unfocus();
        previewWindow.close();
        global.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            window
          ]);
          window.focus();
        });
      }
    };

    Object.assign(model.actions, {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    });

    core.modules.screen.setTheme(themeBlackContrast);

    return new Promise((resolve) => {
      executionResolve();
      window.events.subscribe(({ name }) => {
        if (name === 'close') {
          if (previewWindow) {
            previewWindow.close();
          }
          core.modules.screen.setTheme(null);
          resolve();
        }
      });
    });
  };
}

function webPaintingAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      WbComponentsWebPainting
    ] = await Promise.all([
      import('@/components/disks/extras13/WebPainting').then(module => module.default)
    ]);

    const contentLayout = core.modules.screen.contentLayout;
    const app = new App(new Bounds(contentLayout.position, ipoint(() => contentLayout.position + contentLayout.size)));

    app.options.display.background = core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND);
    app.options.display.foreground = core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND);

    const model = {
      fsItem: null,
      app
    };

    const window = windowsModule.addWindow({
      title: 'WebPainting - Extras 1.3',
      component: WbComponentsWebPainting,
      componentData: {
        model
      },
      options: {
        scale: false,
        scrollX: false,
        scrollY: false,
        embed: true
      }
    }, {
      full: true
    });

    model.actions = {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    };

    executionResolve();
  };
}
