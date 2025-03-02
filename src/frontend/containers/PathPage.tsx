import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router-dom';
import { captureError } from '../utils';
import { WaypointForm } from '../components/WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';
import { WaypointCard } from '../components/WaypointCard';
import { UserContext } from '../services/providers';

export const PathPage: FC = () => {
  const { pathId } = useParams();

  const [path, setPath] = useState<Path | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPath = useCallback(() => {
    api
      .getPath(pathId)
      .then((found) => {
        setPath(found);
        setLoading(false);
      })
      .catch(captureError);
  }, [pathId]);

  const addWaypoint = useCallback(
    (waypoint: WaypointPayload) => {
      if (!path) {
        toast.error('No path was provided?');
        return;
      }
      api
        .createWaypoint(path.id, waypoint)
        .then(() => {
          setCreating(false);
          fetchPath();
        })
        .catch(captureError);
    },
    [fetchPath, path],
  );

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  if (loading || !path) {
    return <Spinner />;
  }

  return (
    <>
      <h1>Viewing: {path.name}</h1>
      <h2>Waypoints</h2>
      {path.owner.username === user?.username && (
        <div className="float-right">
          <Button
            color="primary"
            onClick={() => {
              setCreating(true);
            }}
          >
            New Waypoint
          </Button>
        </div>
      )}
      {path.waypoints.map((wp) => (
        <WaypointCard
          refresh={fetchPath}
          pathId={path.id}
          waypoint={wp}
          owner={path.owner.username}
          key={wp.id}
        />
      ))}
      <Modal
        isOpen={creating}
        toggle={() => {
          setCreating(!creating);
        }}
      >
        <ModalHeader>New Waypoint</ModalHeader>
        <ModalBody>
          <WaypointForm
            submit={addWaypoint}
            closeForm={() => {
              setCreating(false);
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
