import React, { FC } from 'react';
import { Button } from 'reactstrap';

interface AddWaypointProps {
  setAddModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const AddWaypoint: FC<AddWaypointProps> = ({ setAddModeFlag }) => {
  const handleAddMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (setAddModeFlag) {
      setAddModeFlag(false);
    }
  };

  return (
    <>
      <Button onClick={handleAddMode}>Dummy</Button>
    </>
  );
};
