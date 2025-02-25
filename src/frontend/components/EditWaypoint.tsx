import React, { FC, useCallback, useState } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { captureError } from '../utils';

interface EditWaypointProps {
  close: () => void;
  refresh: () => void;
  path: Path;
}

export const EditWaypoint: FC<EditWaypointProps> = ({ close, refresh, path }) => {
  const [waypointId, setWaypointId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = useCallback(() => {
    api
      .editWaypoint(path.id, waypointId, name, description, 1, 2)
      .then(() => {
        refresh();
        close();
      })
      .catch(captureError);

    close();
  }, [close, description, name, path.id, refresh, waypointId]);

  //TODO - make sure only proper Inputs allowed into latitude and longitude field
  //TODO - double check they want to delete, show all waypoint info
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
        <option value="" disabled selected>
          Select a waypoint
        </option>
        {path.waypoints.map((waypoint) => (
          <option key={waypoint.id} value={waypoint.id}>
            {waypoint.name}
          </option>
        ))}
      </select>

      <br />

      {waypointId == '' ? (
        <>
          <Button
            onClick={() => {
              close();
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        // todo: have a way of showing the user what fields have been edited, maybe have a return to default option
        <>
          <Label for="name">Name: </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Shouldnt be empty, right?"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <br />

          <Label for="description">Description: </Label>
          <Input
            type="text"
            id="description"
            name="description"
            placeholder="Its ok for this one to be empty"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <br />

          <Label for="latitude">Latitude: </Label>
          <Input
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Enter a decimal here"
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
            }}
          />

          <br />

          <Label for="longitude">Longitude: </Label>
          <Input
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Enter decimal here"
            value={longitude}
            onChange={(e) => {
              setLongitude(e.target.value);
            }}
          />

          <br />

          <Button
            onClick={() => {
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Save
          </Button>
        </>
      )}
    </FormGroup>
  );
};
