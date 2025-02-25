import React, { FC, useCallback } from 'react';
import { Button } from 'reactstrap';
import { captureError } from '../utils';

interface AddWaypointProps {
  close: () => void;
  refresh: () => void;
  pathID: string;
}

export const AddWaypoint: FC<AddWaypointProps> = ({ close, refresh, pathID }) => {
 
  const handleAdd = useCallback(() => {

    api
      .createWaypoint(pathID, {
        name: 'testWP',
        description: 'testWPDESC',
        latitude: 1,
        longitude: 2,
      })
      .then(() => {
        refresh();
        close();
      })
      .catch(captureError);
      close();

  }, [close, refresh, pathID]);
  

  return (
    <>
      <Button
        onClick={ () => {handleAdd();}}
      >
        Dummy
      </Button>
    </>
  );
};
