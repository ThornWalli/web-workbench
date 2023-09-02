import { v4 as uuidv4 } from 'uuid';
import Track from './Track';

export default class Project {
  id = null;
  name = null;
  tracks = [];
  constructor(options = {}) {
    const { id, name, tracks } = { tracks: this.tracks, ...options };
    this.id = id || uuidv4();
    this.name = name || 'Default Project';
    this.tracks = (tracks || []).map(track => new Track(track));
  }
}
