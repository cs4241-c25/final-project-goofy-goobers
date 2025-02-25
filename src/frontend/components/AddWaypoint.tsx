import React, { FC } from 'react';
import { Button } from 'reactstrap';
import { captureError } from '../utils';

interface AddWaypointProps {
  close: () => void;
  pathID: string;
}

export const AddWaypoint: FC<AddWaypointProps> = ({ pathID }) => {
  const handleAddMode = (e: { preventDefault: () => void }) => {
    api
      .createWaypoint(pathID, {
        name: 'testWP',
        description: 'testWPDESC',
        latitude: 1,
        longitude: 2,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(captureError);
      close();
  };

  return (
    <>
      <Button
        onClick={handleAddMode}
      >
        Dummy
      </Button>
    </>
  );
};
