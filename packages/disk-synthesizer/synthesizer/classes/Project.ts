import { v4 as uuidv4 } from 'uuid';
import Track from './Track';

export default class Project {
  id: string;
  name: string;
  tracks: Track[] = [];
  constructor(options?: Partial<Project>) {
    const { id, name, tracks } = { tracks: this.tracks, ...options };
    this.id = id || uuidv4();
    this.name = name || 'Default Project';
    this.tracks = (tracks || []).map(track => new Track(track));
  }
}
