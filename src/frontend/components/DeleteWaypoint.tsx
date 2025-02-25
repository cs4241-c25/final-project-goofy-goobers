import React, { FC, useState } from 'react';
import { Button, Form, Label } from 'reactstrap';
import { Waypoint } from '../../shared/models/Waypoint';
import { useParams } from 'react-router';
import { captureError } from '../utils';

interface DeleteWaypointProps {
  setDeleteModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  waypointArray: Waypoint[];
  updateWaypointArray: (updatedArray: Waypoint[]) => void;
}

export const DeleteWaypoint: FC<DeleteWaypointProps> = ({
  setDeleteModeFlag,
  waypointArray,
  updateWaypointArray,
}) => {
  const [waypointId, setWaypointId] = useState('');
  const { pathid } = useParams();

  const handleDeleteMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (setDeleteModeFlag) {
      setDeleteModeFlag(false);
    }
  };

  const handleDelete = async () => {
    if (setDeleteModeFlag) {
      setDeleteModeFlag(false);
    }
    try {
      await api.deleteWaypoint(pathid ?? '', waypointId).catch(captureError);

      const updatedArray = waypointArray.filter((wp) => wp.id !== waypointId);
      updateWaypointArray(updatedArray);
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }
  };

  //TODO - make sure only proper Inputs allowed into latitude and longitude field
  return (
    <Form onSubmit={handleDelete}>
      <Label htmlFor="id">Chose the Waypoint: </Label>
      <select
        id="waypointId"
        name="waypointId"
        onChange={(e) => {
          setWaypointId(e.target.value);
        }}
      >
        <option value="">Select a waypoint</option>
        {waypointArray.map((waypoint) => (
          <option key={waypoint.id} value={waypoint.id}>
            {waypoint.name}
          </option>
        ))}
      </select>

      <Button onClick={handleDeleteMode}>Cancel</Button>
      <Button>Delete</Button>
    </Form>
  );
};
