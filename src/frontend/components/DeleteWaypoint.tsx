import React, { FC, useCallback, useState } from 'react';
import { Button, FormGroup, Label } from 'reactstrap';
import { captureError } from '../utils';
import { Path } from '../../shared/models/Path';

interface DeleteWaypointProps {
  close: () => void;
  refresh: () => void;
  path: Path;
}

export const DeleteWaypoint: FC<DeleteWaypointProps> = ({ close, refresh, path }) => {
  const [waypointId, setWaypointId] = useState('');

  const handleDelete = useCallback(() => {
    api
      .deleteWaypoint(path.id, waypointId)
      .then(() => {
        refresh();
        close();
      })
      .catch(captureError);
  }, [close, path.id, refresh, waypointId]);

  //TODO - make sure only proper Inputs allowed into latitude and longitude field
  return (
    <FormGroup>
      <Label htmlFor="id">Chose the Waypoint: </Label>
      <select
        id="waypointId"
        name="waypointId"
        onChange={(e) => {
          setWaypointId(e.target.value);
        }}
      >
        <option value="">Select a waypoint</option>
        {path.waypoints.map((waypoint) => (
          <option key={waypoint.id} value={waypoint.id}>
            {waypoint.name}
          </option>
        ))}
      </select>

      <Button
        onClick={() => {
          close();
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          handleDelete();
        }}
      >
        Delete
      </Button>
    </FormGroup>
  );
};
