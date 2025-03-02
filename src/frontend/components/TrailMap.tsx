import React, { FC } from 'react';
// // ⚠️ No types available here
// import { MapContainer } from 'react-leaflet/MapContainer';
// ✅ Types are available here
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';

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
        zoom={13} // placeholder, will be derived from the waypoints
        scrollWheelZoom={false}
        style={{ height: '900px' }} // placeholder height, currently looks ugly
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
      </MapContainer>
      {path.waypoints.map((wp) => (
        <WaypointCard refresh={refresh} pathId={path.id} waypoint={wp} key={wp.id} />
      ))}
      <h1> end of dupes</h1>
    </>
  );
};
