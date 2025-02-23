import React, { FC, useState } from 'react';
import { Button } from 'reactstrap';


export const EditWaypoint: FC = ({setEditModeFlag}) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleEditMode = (e) => {
    e.preventDefault()
    setEditModeFlag(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  //TODO - make sure only proper inputs allowed into latitude and longitude field
  //number.parseFloat
  return (
    <form onSubmit={handleSubmit}>

      <label htmlFor="name">Name: </label><br />
      <input type="text" id="name" name="name" placeholder="Enter name here" onChange={(e) => setName(e.target.value)}/><br /><br />

      <label htmlFor="description">Description: </label><br />
      <input type="text" id="description" name="description" placeholder="Enter description here" onChange={(e) => setDescription(e.target.value)}/><br /><br />

      <label htmlFor="latitude">Latitude: </label><br />
      <input type="text" id="latitude" name="latitude" placeholder="Enter latitude here" onChange={(e) => setLatitude(e.target.value)}/><br /><br />

      <label htmlFor="longitude">Longitude: </label><br />
      <input type="text" id="longitude" name="longitude" placeholder="Enter longitude here" onChange={(e) => setLongitude(e.target.value)}/><br /><br />

      <Button onClick={handleEditMode}>Cancel</Button>
      <Button>Save</Button>

    </form>
  );
};
