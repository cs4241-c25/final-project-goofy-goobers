import React, { FC, useCallback, useState } from 'react';
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
} from 'reactstrap';
import { captureError } from '../utils';
import { Waypoint } from '../../shared/models/Waypoint';
import { WaypointForm } from '../components/WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';

export const WaypointCard: FC<{
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
