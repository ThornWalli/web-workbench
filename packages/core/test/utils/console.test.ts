import { describe, it, expect } from 'vitest';
import { Table } from '../../utils/console';

describe('utils - console', () => {
  it('Table', () => {
    const table = new Table();

    table.addColumns([
      { value: 'Column A', align: 'left', minWidth: 10, maxWidth: 20 },
      { value: 'Column B', align: 'center', minWidth: 10, maxWidth: 20 },
      { value: 'Column C', align: 'right', minWidth: 10, maxWidth: 20 }
    ]);

    table.addRows([
      ['Value 1.A', 'Value 1.B', 'Value 1.C'],
      ['Value 2.A', 'Value 2.B', 'Value 2.C'],
      ['Value 3.A', 'Value 3.B', 'Value 3.C']
    ]);

    expect(table.toColumnify()).equal(
      [
        'Column A    Column B    Column C',
        'Value 1.A  Value 1.B   Value 1.C',
        'Value 2.A  Value 2.B   Value 2.C',
        'Value 3.A  Value 3.B   Value 3.C'
      ].join('\n')
    );
  });
});
