import React, { FC, useState } from 'react';
import { Waypoint } from '../../shared/models/Waypoint.ts';
import { useParams } from "react-router";
import { NewPathButton } from '../components/NewPathButton';
import { BackButton } from '../components/BackButton';
import { AddWaypointButton } from '../components/AddWaypointButton';
import { EditWaypoint } from '../components/EditWaypoint';
import { Button } from 'reactstrap';


export const PathPage: FC = () => {

  const [editModeFlag, setEditModeFlag] = useState(false);

  const handleEditMode = (e) => {
    e.preventDefault()
    setEditModeFlag(!editModeFlag);
  }

  const waypointArray: Waypoint[] = [
    {
      id: "1",
      name: "Wavy",
      description: "This is the first path",
      latitude: 10.1,
      longitude: 10.2,
      path: '1'
    },
    {
      id: "1",
      name: "Wavy",
      description: "This is the first path",
      latitude: 10.12,
      longitude: 10.22,
      path: '1'
    },
    {
      id: "1",
      name: "Wavy",
      description: "This is the first path",
      latitude: 10.19,
      longitude: 10.29,
      path: '2'
    },
  ]

  let {pathid} = useParams();
  console.log(pathid);

  return (
    <>
      <h1>cool guy</h1>
      {waypointArray.map(waypoint =>
        <h1>{waypoint.longitude}</h1>
      )}
      {editModeFlag?
        <>
          <Button onClick={handleEditMode}>Cancel</Button>
          <EditWaypoint setEditModeFlag={setEditModeFlag} />
        </>
        :
        <>
          <BackButton />
          <AddWaypointButton />
          <Button onClick={handleEditMode}>Edit</Button>
        </>
      }
    </>
  );
};
