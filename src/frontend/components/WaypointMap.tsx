import React, { FC, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet';
import { Waypoint } from '../../shared/models/Waypoint';
import L from 'leaflet';

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

  const customIcon = L.divIcon({
    className: 'custom-dot-icon',
    html: `
      <div style="width: 16px; height: 16px; background-color: black; border-radius: 50%; position: relative;">
        <div style="width: 13px; height: 13px; background-color: RGB(49, 117, 189); border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
          <div style="width: 5px; height: 5px; background-color: #f2f2f2; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
        </div>
       </div>
    `,
    iconSize: [16, 16], // Size of the dot
    iconAnchor: [8, 8], // Center the dot
  });

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
          <Marker position={[wp.latitude, wp.longitude]} key={wp.id} icon={customIcon} />
        ))}
        <Polyline
          positions={waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number])}
          color="RGB(222, 209, 179)"
        />

        <FitBounds waypoints={waypoints} />
      </MapContainer>
    </>
  );
};
