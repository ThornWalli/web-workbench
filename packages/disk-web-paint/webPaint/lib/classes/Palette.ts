import PaletteColor from './PaletteColor';
import type { IPaletteColor } from './PaletteColor';

export interface IPalette {
  id?: string;
  name: string;
  description?: string;
  colors: IPaletteColor[];
  locked?: boolean;
}
export default class Palette {
  id: string;
  name: string;
  description?: string;
  colors: PaletteColor[];
  locked?: boolean;

  constructor(options?: Partial<IPalette | ReturnType<Palette['toJSON']>>) {
    const { id, name, description, colors, locked } = options || {};
    this.id = id || crypto.randomUUID();
    this.name = name || '';
    this.description = description;
    this.colors = (colors || []).map(
      color => new PaletteColor(color as IPaletteColor)
    );
    this.locked = locked;
  }

  toJSON() {
    return {
      _type: this.constructor.name,
      id: this.id,
      name: this.name,
      description: this.description,
      colors: this.colors.map(color => color.toJSON()),
      locked: this.locked
    };
  }
}
