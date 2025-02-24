import React, { FC, useState } from 'react';
import { Waypoint } from '../../shared/models/Waypoint';
import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton';
import { AddWaypoint } from '../components/AddWaypoint';
import { EditWaypoint } from '../components/EditWaypoint';
import { Button } from 'reactstrap';

export const PathPage: FC = () => {
  const [editModeFlag, setEditModeFlag] = useState(false);
  const [addModeFlag, setAddModeFlag] = useState(false);

  const handleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditModeFlag(!editModeFlag);
  };

  const handleAddMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setAddModeFlag(!addModeFlag);
  };

  const waypointArray: Waypoint[] = [
    {
      id: '1',
      name: 'Wavy',
      description: 'This is the first path',
      latitude: 10.1,
      longitude: 10.2,
      path: '1',
    },
    {
      id: '2',
      name: 'Wavy',
      description: 'This is the first path',
      latitude: 10.12,
      longitude: 10.22,
      path: '1',
    },
    {
      id: '3',
      name: 'Wavy',
      description: 'This is the first path',
      latitude: 10.19,
      longitude: 10.29,
      path: '2',
    },
  ];

  const { pathid } = useParams();
  console.log(pathid);
  console.log(editModeFlag);
  console.log(addModeFlag);

  return (
    <>
      <h1>You are at the path called {pathid}</h1>
      {waypointArray.map((waypoint) => (
        <h2 key={waypoint.id}>{waypoint.longitude}</h2>
      ))}
      {editModeFlag ? (
        <>
          <EditWaypoint setEditModeFlag={setEditModeFlag} />
        </>
      ) : addModeFlag ? (
        <>
          <AddWaypoint setAddModeFlag={setAddModeFlag} />
          <Button onClick={handleAddMode}>Done</Button>
        </>
      ) : (
        <>
          <BackButton />
          <Button onClick={handleAddMode}>Add</Button>
          <Button onClick={handleEditMode}>Edit</Button>
        </>
      )}
    </>
  );
};
