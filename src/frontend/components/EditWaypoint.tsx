import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Label } from 'reactstrap';
import { Waypoint } from '../../shared/models/Waypoint';
import { captureError } from '../utils';
import { useParams } from 'react-router';

interface EditWaypointProps {
  setEditModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  waypointArray: Waypoint[];
  updateWaypointArray: (updatedArray: Waypoint[]) => void;
}

export const EditWaypoint: FC<EditWaypointProps> = ({
  setEditModeFlag,
  waypointArray,
  updateWaypointArray,
}) => {
  const [waypointId, setWaypointId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const { pathid } = useParams();

  const handleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (setEditModeFlag) {
      setEditModeFlag(false);
    }
  };

  useEffect(() => {
    const currentWaypoint = waypointArray.find((wp) => wp.id === waypointId);
    if (currentWaypoint) {
      setName(currentWaypoint.name);
      setDescription(currentWaypoint.description ?? '');
      setLatitude(currentWaypoint.latitude.toString());
      setLongitude(currentWaypoint.longitude.toString());
    }
  }, [waypointArray, waypointId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      console.log(
        `pid:${pathid} wid:${waypointId} name:${name} des:${description} lat:${latitude} lon:${longitude}`,
      );
      await api.editWaypoint(pathid ?? '', waypointId, name, description, 1, 2).catch(captureError);

      const updatedArray = waypointArray.map((wp) =>
        wp.id === waypointId
          ? {
              ...wp,
              name,
              description,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }
          : wp,
      );
      updateWaypointArray(updatedArray);
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }

    if (setEditModeFlag) {
      setEditModeFlag(false);
    }
  };

  //TODO - make sure only proper Inputs allowed into latitude and longitude field
  //TODO - double check they want to delete, show all waypoint info
  return (
    <Form onSubmit={handleSubmit}>
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

      <br />

      {waypointId == '' ? (
        <>
          <Button onClick={handleEditMode}>Cancel</Button>
        </>
      ) : (
        // todo: have a way of showing the user what fields have been edited, maybe have a return to default option
        <>
          <Label htmlFor="name">Name: </Label>
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

          <Label htmlFor="description">Description: </Label>
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

          <Label htmlFor="latitude">Latitude: </Label>
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

          <Label htmlFor="longitude">Longitude: </Label>
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

          <Button onClick={handleEditMode}>Cancel</Button>
          <Button>Save</Button>
        </>
      )}
    </Form>
  );
};
