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
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { WaypointCard } from './WaypointCard';
import { UserContext } from '../services/providers';
import { WaypointForm } from './WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { captureError } from '../utils';
import L from 'leaflet';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
  const [isDeleting, setIsDeleting] = useState(false);

  const centerPoint = calculateCenter(path);

  const addWaypoint = useCallback(
    (waypoint: WaypointPayload) => {
      let failed = false;

      if (!waypoint.name) {
        failed = true;
        toast.error('Please provide a name for the waypoint');
      }
      if (waypoint.longitude > 180 || waypoint.longitude < -180) {
        failed = true;
        toast.error('Longitude value must be from -180 to 180');
      }
      if (waypoint.latitude > 90 || waypoint.latitude < -90) {
        failed = true;
        toast.error('Latitude value must be from -90 to 90');
      }
      if (failed) {
        return;
      }

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

  const AddWaypointOnClick: FC = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setModalTime(true);
      },
    });
    return null;
  };

  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    api
      .deletePath(path.id)
      .then(async () => {
        await navigate('/');
      })
      .catch(captureError);
  }, [navigate, path]);

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
      {/* todo: test out different Marker icons other than the blue pin */}
      {/* todo (time permitting): make the waypoints location update when editing & make waypoints draggable */}
      <div className={'d-flex justify-content-between px-3 pt-2 pb-1 align-items-center'}>
        <h1 style={{ margin: 0 }}>Path: {path.name}</h1>
        {path.owner.username === user?.username && (
          <div className="float-right">
            <Button
              color="danger"
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              Delete
            </Button>{' '}
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
        {path.waypoints.map((wp) => (
          <Marker position={[wp.latitude, wp.longitude]} key={wp.id} icon={customIcon}>
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
          color="RGB(222, 209, 179)"
          weight={5}
          pathOptions={{
            color: 'RGB(222, 209, 179)', // Main line color
            weight: 5, // Main line weight
            opacity: 1,
            fillOpacity: 1,
            className: 'polyline-outline',
          }}
        />
        <FitBounds path={path} />
        {areAdding && <AddWaypointOnClick />}
      </MapContainer>

      <Modal
        toggle={() => {
          setIsDeleting(!isDeleting);
        }}
        isOpen={isDeleting}
      >
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you&apos;d like to delete <strong>{path.name}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            id="complete"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>{' '}
          <Button
            color="secondary"
            id="cancel"
            onClick={() => {
              setIsDeleting(false);
            }}
            outline
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

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
                id: 'whatever',
                path: 'dont care',
                name: '',
                latitude: lat,
                longitude: lng,
              }}
              submit={addWaypoint}
              closeForm={() => {
                setAreAdding(false);
                setModalTime(false);
              }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
