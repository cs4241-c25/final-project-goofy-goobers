import React, { FC } from 'react';
import { Button } from 'reactstrap';

interface AddWaypointProps {
  close: () => void;
}

export const AddWaypoint: FC<AddWaypointProps> = ({ close }) => {
  return (
    <>
      <Button
        onClick={() => {
          close();
        }}
      >
        Dummy
      </Button>
    </>
  );
};
