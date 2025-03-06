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
import { WaypointForm } from './WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { UserContext } from '../services/providers';

export const WaypointCard: FC<{
  readonly waypoint: Waypoint;
  readonly pathId: string;
  readonly refresh: () => void;
  readonly owner: string;
  readonly onMap?: boolean;
}> = ({ waypoint, pathId, refresh, owner, onMap = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(UserContext);

  const submitEdit = useCallback(
    (payload: WaypointPayload) => {
      api
        .editWaypoint(pathId, waypoint.id, payload)
        .then(() => {
          setIsEditing(false);
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
      <Card className={"margin-bottom"}>
        <CardBody className={"no-border"}>
          <h4>{waypoint.name}</h4>
          {waypoint.description && <CardText>{waypoint.description}</CardText>}
          {isEditing &&
            !onMap && ( // keeping editing from non-map the way it is
              <WaypointForm
                initialWaypoint={waypoint}
                closeForm={() => {
                  setIsEditing(false);
                }}
                submit={submitEdit}
              />
            )}
        </CardBody>
        {!isEditing && owner === user?.username && (
          <CardFooter className="float-right">
            <Button
              onClick={() => {
                setIsEditing(true);
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

      {/* todo: test out translucent?, would be nice to see the map while editing */}
      {onMap && ( // only modal when editing from map, up for scrutiny
        <Modal
          toggle={() => {
            setIsEditing(!isDeleting);
          }}
          isOpen={isEditing}
        >
          <ModalHeader>Editing {waypoint.name}</ModalHeader>
          <ModalBody>
            <WaypointForm
              initialWaypoint={waypoint}
              closeForm={() => {
                setIsEditing(false);
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
