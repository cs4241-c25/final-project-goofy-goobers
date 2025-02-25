import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Label } from 'reactstrap';
import { Waypoint } from '../../shared/models/Waypoint';
import { captureError } from '../utils';
import { useParams } from 'react-router';
import { Path } from '../../shared/models/Path';

interface EditWaypointProps {
  setEditModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const EditWaypoint: FC<EditWaypointProps> = ({ setEditModeFlag }) => {
  const [waypointId, setWaypointId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [waypointArray, setWaypointArray] = useState<Waypoint[]>([]);
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
      await api
        .editWaypoint(
          pathid ?? '',
          waypointId,
          name,
          description,
          parseFloat(latitude),
          parseFloat(longitude),
        )
        .catch(captureError);
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }
    //
    // if (setEditModeFlag) {
    //   setEditModeFlag(false);
    // }
  };

  useEffect(() => {
    async function fetchWaypoints() {
      try {
        setWaypointArray([]);
        const response = await fetch(`/api/path/${pathid}`, {
          method: 'GET',
        });
        const path = (await response.json()) as Path;
        const waypoints: Waypoint[] = path.waypoints;
        for (const item of waypoints) {
          const waypointResponse = await fetch(`/api/waypoint/${item.id}`, {
            method: 'GET',
          });
          const waypoint = (await waypointResponse.json()) as Waypoint;
          console.log(`a waypoint was there ${waypoint.id}`);
          setWaypointArray((prev) => {
            const index = prev.findIndex((wp) => wp.id === waypoint.id);
            if (index !== -1) {
              const updatedArray = [...prev];
              updatedArray[index] = waypoint;
              return updatedArray;
            }
            return [...prev, waypoint];
          });
        }
        console.log(path.waypoints);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    void fetchWaypoints();
  }, [pathid]);

  //TODO - make sure only proper Inputs allowed into latitude and longitude field
  // todo: make the dropdown for name display name but store id (have to make an api call to get all waypoints and map them as options)
  //number.parseFloat
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
        // todo: have a way of showing the user what fields have been edited, maybe have a return to default
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
