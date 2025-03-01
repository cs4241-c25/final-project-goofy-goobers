import React, { FC } from 'react';
// // ⚠️ No types available here
// import { MapContainer } from 'react-leaflet/MapContainer';
// ✅ Types are available here
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const TrailMap: FC = () => {
  return (
    <>
      <p> Maping </p>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={20} // placeholder, will be derived from
        scrollWheelZoom={false}
        style={{ height: '900px' }} // placeholder height, currently looks ugly
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
