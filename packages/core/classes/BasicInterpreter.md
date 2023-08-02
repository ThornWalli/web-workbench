# BasicInterpreter

### WHILE & FOR

```shell
# FOR

FOR i%=1 TO 5 THEN

  PRINT "Number #"; i%

NEXT i%

# FOR with STEP

FOR i% = 1 TO 6 STEP 2

  PRINT "Number #"; i%

NEXT i%

# WHILE

WHILE i% < 5

  PRINT "Number #"; i%
  LET i% = i% + 1;

WEND
```

## Syntax

### Define Variables

```shell
# Default
DIM A = 1

# String
DIM c$ = "Hello World"

# Integer
DIM b% = 1234
```

### Set Variable

```shell
# Declare

DIM a$ = "Hello"

LET a$ = a$ + " World"
```

### If, Else and End

Conditions: `!=`, `>=`, `<=`, `>`, `<`,

```shell
DIM A = 1
DIM B = 2

IF A == B THEN
  PRINT "true"
ELSE
  PRINT "false"
END

IF (A < B) THEN
  PRINT "true"
END
```

### Goto and Goto-Mark

```shell
PRINT "Step 1"

PRINT "Step 2"

PRINT "Step 3"

GOTO ignore

PRINT "Step 4"

ignore:

PRINT "Step 5"
```
