import React, { FC, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet';
import { Waypoint } from '../../shared/models/Waypoint';

const FitBounds: FC<{ waypoints: Waypoint[] }> = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!waypoints.length) {
      return;
    }
    const bounds = waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number]);
    map.fitBounds(bounds);
  }, [map, waypoints]);

  return null;
};

export const WaypointMap: FC<{
  readonly waypoints: Waypoint[];
}> = ({ waypoints }) => {
  const calculateCenter = (waypoints: Waypoint[]): [number, number] => {
    const [sumLat, sumLong, count] = waypoints.reduce(
      ([accLat, accLong, count], wp) => [accLat + wp.latitude, accLong + wp.longitude, count + 1],
      [0, 0, 0],
    );
    return count ? [sumLat / count, sumLong / count] : [0, 0];
  };
  const centerPoint = calculateCenter(waypoints);

  return (
    <>
      <MapContainer
        center={centerPoint}
        zoom={1}
        scrollWheelZoom={false}
        style={{
          right: '0',
          width: '100%',
          height: '60vh',
          margin: '0 0 10px 0',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map((wp) => (
          <Marker position={[wp.latitude, wp.longitude]} key={wp.id} />
        ))}
        <Polyline
          positions={waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number])}
          color="red"
        />

        <FitBounds waypoints={waypoints} />
      </MapContainer>
    </>
  );
};
