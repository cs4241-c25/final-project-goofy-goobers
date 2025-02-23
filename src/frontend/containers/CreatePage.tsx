import React, { FC, useState } from 'react';

interface FormElements extends HTMLFormElement {
  nameInput: HTMLInputElement;
}

interface CreateFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreatePage: FC = () => {
  const { path, setPath } = useState<object>({
    id: '',
    name: '',
    description: '',
    owner: '',
    waypoints: [],
  });

  /*const handleSubmit = useCallback(
    (pathDetails: object) => {
      console.log(pathDetails);
      setPath(pathDetails);
    },
    [path],
  );*/

  const handleSubmit = (event: React.FormEvent<CreateFormElements>) => {
    console.log(event.currentTarget.elements);
  };

  // Title
  // Description
  // Display current waypoints
  // Display input for a new waypoint
  return (
    <>
      <h1>Create a new Path</h1>

      <form onSubmit={handleSubmit(onsubmit())}>
        <label htmlFor={'nameInput'}>Name</label>
        <input type={'text'} id={'nameInput'}></input>
        <label htmlFor={'descriptionInput'}>Description</label>
        <input type={'text'} id={'descriptionInput'}></input>
        <button type={'submit'}>
          Create
        </button>
      </form>
    </>
  );
};
