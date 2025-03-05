import React, { FC, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { Waypoint } from '../../shared/models/Waypoint';

const SetView: FC<{ waypoint: Waypoint }> = ({ waypoint }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([waypoint.latitude, waypoint.longitude], 20);
  }, [map, waypoint]);

  return null;
};

export const WaypointMap: FC<{
  readonly waypoint: Waypoint;
}> = ({ waypoint }) => {
  return (
    <>
      <MapContainer
        center={[waypoint.latitude, waypoint.longitude]}
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
        <Marker position={[waypoint.latitude, waypoint.longitude]} />

        <SetView waypoint={waypoint} />
      </MapContainer>
    </>
  );
};
