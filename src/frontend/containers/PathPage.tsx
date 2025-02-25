import React, { FC, useEffect, useState } from 'react';
import { Waypoint } from '../../shared/models/Waypoint';
import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton';
import { AddWaypoint } from '../components/AddWaypoint';
import { EditWaypoint } from '../components/EditWaypoint';
import { DeleteWaypoint } from '../components/DeleteWaypoint';
import { Button } from 'reactstrap';
import { Path } from '../../shared/models/Path';

export const PathPage: FC = () => {
  const [editModeFlag, setEditModeFlag] = useState(false);
  const [addModeFlag, setAddModeFlag] = useState(false);
  const [deleteModeFlag, setDeleteModeFlag] = useState(false);
  const [waypointArray, setWaypointArray] = useState<Waypoint[]>([]);
  const { pathid } = useParams();

  const handleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditModeFlag(!editModeFlag);
  };

  const handleAddMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setAddModeFlag(!addModeFlag);
  };

  const handleDeleteMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setDeleteModeFlag(!deleteModeFlag);
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

  console.log(pathid);
  console.log(editModeFlag);
  console.log(addModeFlag);

  return (
    <>
      <h1>You are at the path called {pathid}</h1>
      {waypointArray.map((waypoint) => (
        <>
          <h2 key={waypoint.name}>
            {waypoint.name} {waypoint.longitude}
          </h2>
        </>
      ))}
      {editModeFlag ? (
        <>
          <EditWaypoint setEditModeFlag={setEditModeFlag} />
        </>
      ) : addModeFlag ? (
        <>
          <AddWaypoint setAddModeFlag={setAddModeFlag} />
        </>
      ) : deleteModeFlag ? (
        <>
          <DeleteWaypoint setDeleteModeFlag={setDeleteModeFlag} />
        </>
      ) : (
        <>
          <BackButton />
          <Button onClick={handleAddMode}>Add</Button>
          <Button onClick={handleEditMode}>Edit</Button>
          <Button onClick={handleDeleteMode}>Delete</Button>
        </>
      )}
    </>
  );
};
