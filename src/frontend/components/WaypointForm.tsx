import React, { FC, useCallback } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { WaypointPayload } from '../../shared/Payloads';
import { Waypoint } from '../../shared/models/Waypoint';
import { useObjectState } from '../utils';

interface WaypointFormProps {
  initialWaypoint?: Waypoint;
  closeForm: () => void;
  submit: (payload: WaypointPayload) => void;
}

export const WaypointForm: FC<WaypointFormProps> = ({ initialWaypoint, submit, closeForm }) => {
  const [waypoint, setWaypoint] = useObjectState<WaypointPayload>({
    name: initialWaypoint?.name ?? '',
    description: initialWaypoint?.description,
    latitude: initialWaypoint?.latitude ?? 0,
    longitude: initialWaypoint?.longitude ?? 0,
  });

  const handleSubmission = useCallback(() => {
    submit(waypoint);
  }, [submit, waypoint]);

  return (
    <Form>
      <FormGroup>
        <Label for="name">Name: </Label>
        <Input
          type="text"
          id="name"
          defaultValue={waypoint.name}
          minLength={3}
          maxLength={1024}
          name="name"
          placeholder="Enter Name"
          required
          onChange={(e) => {
            setWaypoint('name', e.target.value);
          }}
        />
        <br />
        <Label for="description">Description: </Label>
        <Input
          type="textarea"
          id="description"
          defaultValue={waypoint.description}
          name="description"
          maxLength={40000}
          placeholder="Enter description (optional)"
          onChange={(e) => {
            setWaypoint('description', e.target.value === '' ? undefined : e.target.value);
          }}
        />
        <br />
        <Label for="latitude">Latitude: </Label>
        <Input
          type="number"
          id="latitude"
          name="latitude"
          placeholder="Enter decimal of latitude here"
          defaultValue={waypoint.latitude}
          min={-90}
          max={90}
          onChange={(e) => {
            setWaypoint('latitude', Number.parseFloat(e.target.value));
          }}
          required
        />
        <br />
        <Label for="longitude">Longitude: </Label>
        <Input
          type="number"
          id="longitude"
          name="longitude"
          placeholder="Enter decimal of longitude here"
          defaultValue={waypoint.longitude}
          onChange={(e) => {
            setWaypoint('longitude', Number.parseFloat(e.target.value));
          }}
          min={-90}
          max={90}
          required
        />
        <br />
        <Button
          color="secondary"
          onClick={() => {
            closeForm();
          }}
        >
          Cancel
        </Button>{' '}
        <Button
          color="success"
          onClick={() => {
            handleSubmission();
          }}
        >
          Save
        </Button>
      </FormGroup>
    </Form>
  );
};
