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
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const { user } = useContext(UserContext); // change to be passed down

  const centerPoint = calculateCenter(path);

  // const addWaypoint = (lat: number, lng: number) => {
  //   console.log(`new waypoint being added at ${lat} ${lng}`);
  //   // todo: logic for adding to database, requires modal
  // };

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

  // eslint-disable-next-line no-empty-pattern
  const AddWaypointOnClick: FC = ({}) => {
    useMapEvents({
      click(e) {
        // addWaypoint(e.latlng.lat, e.latlng.lng);
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setModalTime(true);
      },
    });
    return null;
  };

  return (
    <>
      {/* todo: test out different Marker icons other than the blue pin */}
      {/* todo (time permitting): make the waypoints location update when editing & make waypoints draggable */}
      {/* todo (if possible): add waypoint based on cursor location relative to map */}
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
        {areAdding && <AddWaypointOnClick />}
      </MapContainer>
      {modalTime && (
        <Modal
          isOpen={areAdding}
          toggle={() => {
            setAreAdding(!areAdding);
          }}
        >
          <ModalHeader>New Waypoint</ModalHeader>
          <ModalBody>
            <WaypointForm
              initialWaypoint={{
                name: '',
                latitude: lat,
                longitude: lng,
              }}
              submit={addWaypoint}
              closeForm={() => {
                setAreAdding(false);
              }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
