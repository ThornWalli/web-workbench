import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { PROPERTY } from '../utils';

export default {
  meta: [
    [
      ITEM_META.SYMBOL, SYMBOL.DIRECTORY
    ],
    [
      ITEM_META.WINDOW_SIZE, ipoint(380, 200)
    ],
    [
      ITEM_META.WINDOW_SYMBOL_REARRANGE, true
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
          'CALL SwapValues(i, j)',
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
};
