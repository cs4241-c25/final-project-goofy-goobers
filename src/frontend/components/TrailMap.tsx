import React, { FC, useEffect } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
  useMapEvents,
} from 'react-leaflet';
import { Button } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';

export const TrailMap: FC<{
  readonly path: Path;
  readonly refresh: () => void;
  readonly areAdding: boolean;
}> = ({ path, refresh, areAdding = true }) => {
  const calculateCenter = (path: Path): [number, number] => {
    const [sumLat, sumLong, count] = path.waypoints.reduce(
      ([accLat, accLong, count], wp) => [accLat + wp.latitude, accLong + wp.longitude, count + 1],
      [0, 0, 0],
    );
    return count ? [sumLat / count, sumLong / count] : [0, 0];
  };

  const centerPoint = calculateCenter(path);

  const addWaypoint = (lat: number, lng: number) => {
    console.log(`new waypoint being added at ${lat} ${lng}`);
    // todo: logic for adding to database
  };

  const FitBounds: FC<{ path: Path }> = ({ path }) => {
    const map = useMap();

    useEffect(() => {
      if (!path.waypoints.length) {
        return;
      }
      const bounds = path.waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number]);
      map.fitBounds(bounds);
    }, [map, path]);

    return null;
  };

  const AddWaypointOnClick: FC<{ addWaypoint: (lat: number, lng: number) => void }> = ({
    addWaypoint,
  }) => {
    useMapEvents({
      click(e) {
        addWaypoint(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <>
      {/* todo: test out different Marker icons other than the blue pin */}
      {/* todo (time permitting): make the waypoints location update when editing & make waypoints draggable */}
      {/* todo (if possible): add waypoint based on cursor location relative to map */}
      <MapContainer
        center={centerPoint}
        zoom={1} // placeholder, will be derived from the waypoints
        scrollWheelZoom={false}
        style={{
          right: '0',
          width: '100%',
          height: '60vh',
          margin: '0 0 10px 0', // might change
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {path.waypoints.map((wp) => (
          <Marker position={[wp.latitude, wp.longitude]} key={wp.id}>
            {/*pop up is currently a little jank cause of how the refresh works, it closes out when clicking edit*/}
            <Popup>
              <WaypointCard
                refresh={refresh}
                pathId={path.id}
                waypoint={wp}
                key={wp.id}
                owner={path.owner.username}
                onMap={true}
              />
            </Popup>
          </Marker>
        ))}
        <Polyline
          positions={path.waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number])}
          color="red" // todo: find a color that looks good on both the whitish and green land of leaflet
        />
        <FitBounds path={path} />
        <Button> testing </Button>
        {areAdding && <AddWaypointOnClick addWaypoint={addWaypoint} />}
        {!areAdding && <AddWaypointOnClick addWaypoint={addWaypoint} />} {/* just for testing*/}
      </MapContainer>
    </>
  );
};
