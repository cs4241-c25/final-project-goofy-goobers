import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router-dom';
import { captureError } from '../utils';
import { Waypoint } from '../../shared/models/Waypoint';
import { WaypointForm } from '../components/WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';

export const PathPage: FC = () => {
  const { pathId } = useParams();

  const [path, setPath] = useState<Path | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
      {path.waypoints.map((wp) => (
        <WaypointCard refresh={fetchPath} pathId={path.id} waypoint={wp} key={wp.id} />
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

const WaypointCard: FC<{
  readonly waypoint: Waypoint;
  readonly pathId: string;
  readonly refresh: () => void;
}> = ({ waypoint, pathId, refresh }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const submitEdit = useCallback(
    (payload: WaypointPayload) => {
      api
        .editWaypoint(pathId, waypoint.id, payload)
        .then(() => {
          setIsEditting(false);
          refresh();
        })
        .catch(captureError);
    },
    [pathId, refresh, waypoint.id],
  );
  const deleteWaypoint = useCallback(() => {
    api
      .deleteWaypoint(pathId, waypoint.id)
      .then(() => {
        refresh();
      })
      .catch(captureError);
  }, [pathId, refresh, waypoint.id]);
  return (
    <>
      <Card>
        <CardBody>
          <h4>{waypoint.name}</h4>
          {waypoint.description && <CardText>{waypoint.description}</CardText>}
          {isEditting && (
            <WaypointForm
              initialWaypoint={waypoint}
              closeForm={() => {
                setIsEditting(false);
              }}
              submit={submitEdit}
            />
          )}
        </CardBody>
        {!isEditting && (
          <CardFooter className="float-right">
            <Button
              onClick={() => {
                setIsEditting(true);
              }}
            >
              Edit
            </Button>{' '}
            <Button
              onClick={() => {
                setIsDeleting(true);
              }}
              color="danger"
            >
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
      <Modal
        toggle={() => {
          setIsDeleting(!isDeleting);
        }}
        isOpen={isDeleting}
      >
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you&apos;d like to delete <strong>{waypoint.name}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            id="complete"
            onClick={() => {
              deleteWaypoint();
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
    </>
  );
};
