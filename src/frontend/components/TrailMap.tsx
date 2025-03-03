import React, { FC, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';

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

export const TrailMap: FC<{
  readonly path: Path;
  readonly refresh: () => void;
}> = ({ path, refresh }) => {
  const calculateCenter = (path: Path): [number, number] => {
    const [sumLat, sumLong, count] = path.waypoints.reduce(
      ([accLat, accLong, count], wp) => [accLat + wp.latitude, accLong + wp.longitude, count + 1],
      [0, 0, 0],
    );
    return count ? [sumLat / count, sumLong / count] : [0, 0];
  };

  const centerPoint = calculateCenter(path);

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
      </MapContainer>
    </>
  );
};
