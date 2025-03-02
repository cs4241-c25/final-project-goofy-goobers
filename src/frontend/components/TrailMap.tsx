import React, { FC, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';

// there are 2 lint ignores, todo: fix
const FitBounds: FC<{ path: Path }> = ({ path }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map = useMap();

  useEffect(() => {
    const bounds = path.waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    map.fitBounds(bounds);
  }, [map, path]);

  return null;
};

export const TrailMap: FC<{
  readonly path: Path;
  readonly refresh: () => void;
}> = ({ path, refresh }) => {
  const calculateCenter = (path: Path): [number, number] => {
    const latitudes = path.waypoints.map((wp) => wp.latitude);
    const longitudes = path.waypoints.map((wp) => wp.longitude); // mapping twice is kinda dumb. todo: do it better
    const sumLat = latitudes.reduce((acc, lat) => acc + lat, 0);
    const sumLong = longitudes.reduce((acc, long) => acc + long, 0);
    return [sumLat / latitudes.length, sumLong / longitudes.length];
  };

  const centerPoint = calculateCenter(path);

  return (
    <>
      <MapContainer
        center={centerPoint}
        zoom={1} // placeholder, will be derived from the waypoints
        scrollWheelZoom={false}
        style={{
          position: 'fixed',
          top: '56px', // Adjust based on the height of your navbar
          right: '0',
          width: '100%', // Adjust the width as needed
          height: 'calc(100vh - 56px)', // Adjust based on the height of your navbar
          zIndex: 1,
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
              <WaypointCard refresh={refresh} pathId={path.id} waypoint={wp} key={wp.id} />
            </Popup>
          </Marker>
        ))}
        <Polyline
          positions={path.waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number])}
          color="red" // todo: find a color that looks good on both the whitish and green land of leaflet
        />
        <FitBounds path={path} />
      </MapContainer>
      <h1> end of dupes</h1>
    </>
  );
};
