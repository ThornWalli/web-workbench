import columnify from 'columnify';

export class TableColumn {
  value: string = 'unknown';
  align: 'left' | 'center' | 'right' = 'left';
  minWidth: number = 0;
  maxWidth: number = 0;
  spacerChar: string = ' ';
  headingTransform: (heading: string) => string = heading => heading;
  constructor(options?: Partial<TableColumn>) {
    const { value, align, minWidth, maxWidth, spacerChar, headingTransform } =
      options || {};
    this.value = value || this.value;
    this.align = align || this.align;
    this.minWidth = minWidth || this.minWidth;
    this.maxWidth = Math.max(maxWidth || this.maxWidth, this.minWidth);
    this.spacerChar = spacerChar || this.spacerChar;
    this.headingTransform = headingTransform || this.headingTransform;
  }
}

type CellValue = string | number;

export class Table {
  headerPadding = 0;
  showHeader = true;

  columns: TableColumn[] = [];
  rows: CellValue[][] = [];

  constructor(options?: Partial<Table>) {
    const { showHeader, headerPadding, columns } = {
      showHeader: true,
      headerPadding: 0,
      columns: [],
      ...options
    };
    this.showHeader = showHeader;
    this.headerPadding = headerPadding;
    this.addColumns(columns);
  }

  addColumn(column: Partial<TableColumn>) {
    this.columns.push(new TableColumn(column));
  }

  addColumns(columns: Partial<TableColumn>[]) {
    columns.forEach(column => this.addColumn(column));
  }

  addRow(row: CellValue[]) {
    this.rows.push(row);
  }

  addRows(rows: CellValue[][]) {
    rows.forEach(row => this.addRow(row));
  }

  static createSpacer(value: string, length: number, spacerChar: string) {
    if (value.length < length) {
      length = length - value.length;
      for (let i = 0; i < length; i++) {
        value += spacerChar;
      }
    }
    return value;
  }

  toColumnify() {
    const columns = this.columns.map(column => column.value);
    const rows = this.rows.reduce(
      (result, row, index) => {
        if (index < 1 && this.showHeader && this.headerPadding) {
          result.push(...Array(this.headerPadding).fill(''));
        }

        const list = this.columns.reduce(
          (result, column: TableColumn, colIndex: number) => {
            return { ...result, [column.value]: row[Number(colIndex)] };
          },
          {} as Record<string, CellValue>
        );
        result.push(list);
        return result;
      },
      [] as Array<Record<string, CellValue>>
    );

    const config = this.columns.reduce(
      (result, column) => {
        result[column.value] = new TableColumn();
        if (column.align) {
          result[column.value].align = column.align;
        }
        if (column.minWidth) {
          result[column.value].minWidth = column.minWidth;
        }
        if (column.maxWidth) {
          result[column.value].maxWidth = column.maxWidth;
        }
        result[column.value].headingTransform = heading => {
          return heading;
        };
        return result;
      },
      {} as Record<string, TableColumn>
    );

    return columnify(rows, {
      // columnSplitter: ' | ',
      showHeaders: this.showHeader,
      preserveNewLines: true,
      config,
      columns
    }).replace(/\xC2/g, ' ');
  }
}
