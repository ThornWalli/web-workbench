import Track from './Track';

export default class Project {
  id: string;
  name: string;
  tracks: Track[] = [];
  constructor(options?: Partial<Project>) {
    const { id, name, tracks } = { tracks: this.tracks, ...options };
    this.id = id || crypto.randomUUID();
    this.name = name || 'Default Project';
    this.tracks = (tracks || []).map(track => new Track(track));
  }
}
