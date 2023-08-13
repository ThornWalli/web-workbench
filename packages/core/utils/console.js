import columnify from 'columnify';

export class Table {
  #headerPadding = 0;
  #showHeader = true;

  #rows = [];
  #columns = [];

  constructor(options) {
    const { showHeader, headerPadding, columns } = Object.assign(
      {
        showHeader: true,
        headerPadding: 0,
        columns: []
      },
      options
    );
    this.#showHeader = showHeader;
    this.#headerPadding = headerPadding;
    this.addColumn(columns);
  }

  addColumn(options) {
    if (Array.isArray(options)) {
      this.#columns.push(...[].concat(options));
    } else {
      this.#columns.push(
        Object.assign(
          {
            value: null,
            align: 'left',
            minWidth: 0,
            maxWidth: 0,
            spacerChar: ' '
          },
          options
        )
      );
    }
  }

  addRow(row) {
    this.#rows.push(...[].concat(row));
  }

  static createSpacer(value, length, spacerChar) {
    if (value.length < length) {
      length = length - value.length;
      for (let i = 0; i < length; i++) {
        value += spacerChar;
      }
    }
    return value;
  }

  get columns() {
    return this.#columns;
  }

  get rows() {
    return this.#rows;
  }

  get showHeader() {
    return this.#showHeader;
  }

  get headerPadding() {
    return this.#headerPadding;
  }

  toColumnify() {
    const columns = this.columns.map(column => column.value);
    const rows = this.rows.reduce((result, row, index) => {
      if (index < 1 && this.showHeader && this.headerPadding) {
        result.push(...Array(this.headerPadding).fill(''));
      }
      result.push(
        this.columns.reduce((result, column, index) => {
          result[column.value] = row[Number(index)];
          return result;
        }, {})
      );
      return result;
    }, []);

    const config = this.columns.reduce((result, column) => {
      result[column.value] = {};
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
    }, {});

    return columnify(rows, {
      // columnSplitter: ' | ',
      showHeaders: this.showHeader,
      preserveNewLines: true,
      config,
      columns
    }).replace(/\xC2/g, ' ');
  }
}
