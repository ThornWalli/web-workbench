export enum COLOR {
  WHITE = 'white',
  BLACK = 'black',
  RED = 'red',
  DARK_RED = 'dark-red',
  YELLOW = 'yellow',
  DARK_YELLOW = 'dark-yellow',
  BLUE = 'blue',
  DARK_BLUE = 'dark-blue',
  LIGHT_GREEN = 'light-green',
  GREEN = 'green',
  DARK_GREEN = 'dark-green',
  GRAY = 'gray',
  DARK_GRAY = 'dark-gray',
  ORANGE = 'orange',
  DARK_ORANGE = 'dark-orange',
  SHADOW = 'shadow'
}

export const PLAYER_COLORS = [COLOR.GREEN, COLOR.RED, COLOR.BLUE, COLOR.YELLOW];

export const COLOR_VALUE = {
  [COLOR.WHITE]: '#ffffff',
  [COLOR.BLACK]: '#000000',
  [COLOR.RED]: '#cc0000',
  [COLOR.DARK_RED]: '#990000',
  [COLOR.YELLOW]: '#ffdd22',
  [COLOR.DARK_YELLOW]: '#dd9811',
  [COLOR.ORANGE]: '#cc7700',
  [COLOR.DARK_ORANGE]: '#994400',
  [COLOR.BLUE]: '#00ccff',
  [COLOR.DARK_BLUE]: '#0088cc',
  [COLOR.LIGHT_GREEN]: '#00cc00',
  [COLOR.GREEN]: '#88bb44',
  [COLOR.DARK_GREEN]: ' #446633',
  [COLOR.GRAY]: '#cccccc',
  [COLOR.DARK_GRAY]: '#999999'
};

export const COLOR_GRAPH = {
  RED: COLOR.RED,
  GREEN: COLOR.GREEN,
  GRAY: COLOR.GRAY,
  YELLOW: COLOR.YELLOW,
  LAYOUT_GRID: 'layout-grid'
};

export const COLOR_VALUE_GRAPH_FILL = {
  [COLOR_GRAPH.RED]: '#ff000033',
  [COLOR_GRAPH.GREEN]: '#00ff0033',
  [COLOR_GRAPH.GRAY]: '#88888833',
  [COLOR_GRAPH.LAYOUT_GRID]: '#ff0000',
  [COLOR_GRAPH.YELLOW]: '#ffdd2233'
};

export const COLOR_VALUE_GRAPH_STROKE = {
  [COLOR_GRAPH.RED]: '#ff0000',
  [COLOR_GRAPH.GREEN]: '#00ff00',
  [COLOR_GRAPH.GRAY]: '#888888',
  [COLOR_GRAPH.LAYOUT_GRID]: '#440000',
  [COLOR_GRAPH.YELLOW]: '#ffdd22'
};

export const COLOR_VALUE_GRAPH_TEXT = {
  [COLOR_GRAPH.RED]: '#ff0000',
  [COLOR_GRAPH.GREEN]: '#00ff00',
  [COLOR_GRAPH.GRAY]: '#888888',
  [COLOR_GRAPH.LAYOUT_GRID]: '#ff0000',
  [COLOR_GRAPH.YELLOW]: '#ffdd22'
};
