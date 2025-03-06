import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
  useMapEvents,
} from 'react-leaflet';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';
import { UserContext } from '../services/providers';
import { WaypointForm } from './WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { captureError } from '../utils';
import L from 'leaflet';

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
  const [areAdding, setAreAdding] = useState(false);
  const [modalTime, setModalTime] = useState(false);
  const [areEditing, setAreEditing] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [name, setName] = useState('');
  const [wid, setWid] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(UserContext); // change to be passed down

  const centerPoint = calculateCenter(path);

  const addWaypoint = useCallback(
    (waypoint: WaypointPayload) => {
      api
        .createWaypoint(path.id, waypoint)
        .then(() => {
          setModalTime(false);
          refresh();
        })
        .catch(captureError);
    },
    [refresh, path],
  );

  const editWaypoint = useCallback(
    (payload: WaypointPayload) => {
      api
        .editWaypoint(path.id, wid, payload)
        .then(() => {
          setAreEditing(false);
          refresh();
        })
        .catch(captureError);
    },
    [path, refresh, wid],
  );

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

  const HandleOnClick: FC = () => {
    useMapEvents({
      click(e) {
        console.log('here');
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setModalTime(true);
      },
    });
    return null;
  };

  const customIcon = (index: number) =>
    L.divIcon({
      className: 'custom-dot-icon',
      html: `
    <div style="width: 16px; height: 16px; background-color: black; border-radius: 50%; position: relative;">
      <div style="width: 13px; height: 13px; background-color: RGB(49, 117, 189); border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
<!--        <div style="width: 5px; height: 5px; background-color: #f2f2f2; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>-->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 10px;">${index}</div>
      </div>
     </div>
  `,
      iconSize: [16, 16], // Size of the dot
      iconAnchor: [8, 8], // Center the dot
    });

  return (
    <>
      <div className={'d-flex justify-content-between px-3 pt-2 pb-1 align-items-center'}>
        <h1 style={{ margin: 0 }}>Path: {path.name}</h1>
        {path.owner.username === user?.username && (
          <div className="float-right">
            <Button
              color={areAdding ? 'secondary' : 'primary'}
              onClick={() => {
                setAreAdding(!areAdding);
              }}
            >
              {areAdding ? 'Adding Waypoint (Click Map)' : 'Add New Waypoint'}
            </Button>
          </div>
        )}
      </div>
      <MapContainer
        center={centerPoint}
        zoom={1} // path with no waypoints, otherwise set by FixBounds
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
        {path.waypoints.map((wp, index) => (
          <Marker position={[wp.latitude, wp.longitude]} key={wp.id} icon={customIcon(index)}>
            <Popup>
              <WaypointCard
                refresh={refresh}
                pathId={path.id}
                waypoint={wp}
                key={wp.id}
                owner={path.owner.username}
                onMap={true}
                getLatLng={(waypoint: WaypointPayload) => {
                  setAreEditing(true);
                  setWid(wp.id);
                  setName(waypoint.name);
                  if (waypoint.description) {
                    setDescription(waypoint.description);
                  }
                }}
              />
            </Popup>
          </Marker>
        ))}
        <Polyline
          positions={path.waypoints.map((wp) => [wp.latitude, wp.longitude] as [number, number])}
          color="RGB(222, 209, 179)"
          weight={5}
          pathOptions={{
            color: 'RGB(222, 209, 179)', // Main line color
            weight: 5,
            opacity: 1,
            fillOpacity: 1,
            className: 'polyline-outline',
          }}
        />
        <FitBounds path={path} />
        {areAdding && <HandleOnClick />}
        {areEditing && <HandleOnClick />}
      </MapContainer>
      {modalTime && !(areAdding && areEditing) && (
        <Modal
          isOpen={(areAdding || areEditing) && !(areAdding && areEditing)}
          toggle={() => {
            if (areAdding) {
              setAreAdding(!areAdding);
            } else {
              setAreEditing(!areEditing);
            }
          }}
        >
          <ModalHeader>New Waypoint</ModalHeader>
          <ModalBody>
            <WaypointForm
              initialWaypoint={{
                id: wid,
                path: path.id,
                name: name,
                description: description,
                latitude: lat,
                longitude: lng,
              }}
              submit={areAdding ? addWaypoint : editWaypoint}
              closeForm={() => {
                setAreAdding(false);
                setAreEditing(false);
                setModalTime(false);
              }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
