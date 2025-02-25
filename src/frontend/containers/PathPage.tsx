import React, { FC, useEffect, useState } from 'react';
import { Waypoint } from '../../shared/models/Waypoint';
import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton';
import { AddWaypoint } from '../components/AddWaypoint';
import { EditWaypoint } from '../components/EditWaypoint';
import { DeleteWaypoint } from '../components/DeleteWaypoint';
import { Button } from 'reactstrap';
import { captureError } from '../utils';

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
        const ways = await api.getAllWaypointsOnPath(pathid ?? '').catch(captureError);
        if (typeof ways !== 'undefined') {
          setWaypointArray(ways);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    void fetchWaypoints();
  }, [pathid]);

  const updateWaypointArray = (updatedArray: Waypoint[]) => {
    setWaypointArray(updatedArray);
  };

  return (
    <>
      <h1>You are at the path called {pathid}</h1>
      {waypointArray.map((wp) => (
        // h2 is temp till we get leaflet going
        <h2 key={wp.id}>
          name:{wp.name} lon:{wp.longitude} lat:{wp.latitude}
        </h2>
      ))}
      {editModeFlag ? (
        <>
          <EditWaypoint
            setEditModeFlag={setEditModeFlag}
            waypointArray={waypointArray}
            updateWaypointArray={updateWaypointArray}
          />
        </>
      ) : addModeFlag ? (
        <>
          <AddWaypoint setAddModeFlag={setAddModeFlag} />
        </>
      ) : deleteModeFlag ? (
        <>
          <DeleteWaypoint
            setDeleteModeFlag={setDeleteModeFlag}
            waypointArray={waypointArray}
            updateWaypointArray={updateWaypointArray}
          />
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
