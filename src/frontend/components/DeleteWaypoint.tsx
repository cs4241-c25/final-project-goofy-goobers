import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Label } from 'reactstrap';
import { Waypoint } from '../../shared/models/Waypoint';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router';
import { captureError } from '../utils';

interface DeleteWaypointProps {
  setDeleteModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const DeleteWaypoint: FC<DeleteWaypointProps> = ({ setDeleteModeFlag }) => {
  const [waypointId, setWaypointId] = useState('');
  const [waypointArray, setWaypointArray] = useState<Waypoint[]>([]);
  const { pathid } = useParams();

  const handleDeleteMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (setDeleteModeFlag) {
      setDeleteModeFlag(false);
    }
  };

  const handleDelete = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('Delete waypoint:', waypointId);
    console.log('Delete waypoint pathid:', pathid);
    try {
      await api.deleteWaypoint(pathid ?? '', waypointId).catch(captureError);
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }
  };

  //TODO - make this be a feild that is shared to PathPage
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
