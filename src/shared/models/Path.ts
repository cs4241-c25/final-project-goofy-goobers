import { Waypoint } from './Waypoint';

interface PathOwner {
  username: string;
}

export interface Path {
  id: string;
  name: string;
  description?: string;
  owner: PathOwner;
  waypoints: Waypoint[];
}
