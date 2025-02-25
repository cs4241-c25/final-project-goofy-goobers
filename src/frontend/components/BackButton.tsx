import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

export const BackButton: FC = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    void navigate(-1);
  }, [navigate]);
  return (
    <Button
      onClick={() => {
        goBack();
      }}
    >
      Back
    </Button>
  );
};
