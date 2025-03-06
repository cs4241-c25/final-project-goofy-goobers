import React, { FC, useState } from 'react';
import { Button, Form, Input, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { captureError } from '../utils';
import { toast } from 'react-toastify';

export const CreatePage: FC = () => {
  const navigate = useNavigate();

  const [path, setPath] = useState({
    name: '',
    description: '',
  });
  //when name updates
  const nameChange = (name: string) => {
    setPath({ ...path, name: name });
  };

  //when description updates
  const descriptionChange = (description: string) => {
    setPath({ ...path, description: description });
  };

  //creates new path and route to new page
  const clickCreate = () => {
    let failed = false;

    if (!path.name) {
      failed = true;
      toast.error(`Please provide path name`);
    }
    if (!path.description) {
      failed = true;
      toast.error(`Please provide a path description`);
    }
    if (failed) {
      return;
    }
    api
      .createPath(path.name, path.description) //call to create path endpoint
      .then(async (path) => {
        //route to new page
        await navigate(`/view-path/${path.id}`);
      })
      .catch(captureError);
  };

  return (
    <>
      <h1>Create a new Path</h1>

      <Form>
        <Label for={'nameInput'}>Name</Label>
        <Input
          type={'text'}
          id={'nameInput'}
          onChange={(e) => {
            nameChange(e.currentTarget.value); //when name is updated
          }}
        ></Input>
        <Label for={'descriptionInput'}>Description</Label>
        <Input
          type={'text'}
          id={'descriptionInput'}
          onChange={(e) => {
            descriptionChange(e.currentTarget.value); //when description is updated
          }}
        ></Input>
        <br />
        <Button
          id={'createButton'}
          onClick={() => {
            clickCreate();
          }}
        >
          Create
        </Button>
      </Form>
    </>
  );
};
