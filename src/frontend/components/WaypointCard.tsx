import React, { FC, useCallback, useContext, useState } from 'react';
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
import { UserContext } from '../services/providers';

export const WaypointCard: FC<{
  readonly waypoint: Waypoint;
  readonly pathId: string;
  readonly refresh: () => void;
  readonly owner: string;
  readonly onMap?: boolean;
}> = ({ waypoint, pathId, refresh, owner, onMap = false }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(UserContext);

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
          {isEditting &&
            !onMap && ( // keeping editing from non-map the way it is
              <WaypointForm
                initialWaypoint={waypoint}
                closeForm={() => {
                  setIsEditting(false);
                }}
                submit={submitEdit}
              />
            )}
        </CardBody>
        {!isEditting && owner === user?.username && (
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

      {/* todo: test out having this be translucent, would be nice to see the map while editing */}
      {onMap && ( // only modal when editing from map, up for scrutiny
        <Modal
          toggle={() => {
            setIsEditting(!isDeleting);
          }}
          isOpen={isEditting}
        >
          <ModalHeader>Editing {waypoint.name}</ModalHeader>
          <ModalBody>
            <WaypointForm
              initialWaypoint={waypoint}
              closeForm={() => {
                setIsEditting(false);
              }}
              submit={submitEdit}
            />
          </ModalBody>
        </Modal>
      )}

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
