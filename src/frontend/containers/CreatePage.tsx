import React, { FC, useState } from 'react';
// import { Path } from '../../shared/models/Path';
import { Button, Form, Input, Label } from 'reactstrap';

export const CreatePage: FC = () => {
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
  const clickCreate = async () => {
    await api.createPath(path.name, path.description); //call to create path endpoint
    //route to edit page
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
        <Button
          type={'submit'}
          id={'createButton'}
          onClick={() => async () => {
            await clickCreate();
          }}
        >
          Create
        </Button>
      </Form>
    </>
  );
};
