import { WaypointPayload } from '../shared/Payloads';
import { toast } from 'react-toastify';

const validWaypoint = (waypoint: WaypointPayload) => {
  if (!waypoint.name) {
    toast.error('Please provide a name for the waypoint');
    return false;
  }
  if (waypoint.longitude > 180 || waypoint.longitude < -180) {
    toast.error('Longitude value must be from -180 to 180');
    return false;
  }
  if (waypoint.latitude > 90 || waypoint.latitude < -90) {
    toast.error('Latitude value must be from -90 to 90');
    return false;
  }
  return true;
};

export default validWaypoint;
