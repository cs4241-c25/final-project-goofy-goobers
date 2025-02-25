import React, { FC, useCallback, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { captureError } from '../utils';

interface AddWaypointProps {
  close: () => void;
  refresh: () => void;
  pathID: string;
}

export const AddWaypoint: FC<AddWaypointProps> = ({ close, refresh, pathID }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleAdd = useCallback(() => {
    api
      .createWaypoint(pathID, {
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude,
      })
      .then(() => {
        refresh();
        close();
      })
      .catch(captureError);
    close();
  }, [close, refresh, pathID, name, description, latitude, longitude]);

  return (
    // TODO: make a front end check to make sure their are no null feilds where their shouldnt be
    <Form>
      <FormGroup>
        <Label for="name">Name: </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter Name"
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
          placeholder="Enter description (optional)"
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
          placeholder="Enter decimal of latitude here"
          defaultValue={latitude}
          onChange={(e) => {
            setLatitude(parseFloat(e.target.value));
          }}
          required
        />

        <br />

        <Label for="longitude">Longitude: </Label>
        <Input
          type="text"
          id="longitude"
          name="longitude"
          placeholder="Enter decimal of longitude here"
          defaultValue={longitude}
          onChange={(e) => {
            setLongitude(parseFloat(e.target.value));
          }}
          required
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
            handleAdd();
          }}
        >
          Save
        </Button>
      </FormGroup>
    </Form>
  );
};
