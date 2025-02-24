import React, { FC, useState } from 'react';
import { Button } from 'reactstrap';
import { Waypoint } from '../../shared/models/Waypoint';

interface EditWaypointProps {
  setEditModeFlag?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export const EditWaypoint: FC<EditWaypointProps> = ({ setEditModeFlag }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (setEditModeFlag) {
      setEditModeFlag(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const waypoint: Waypoint = {
        id: id,
        name: name,
        description: description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        path: '', // default value, want to not send it as I think it may be redundant to do so
      };
      console.log('Waypoint:', waypoint);
      // TODO - make api call to save waypoint
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }
  };

  //TODO - make sure only proper inputs allowed into latitude and longitude field
  // todo: make the dropdown for name display name but store id (have to make an api call to get all waypoints and map them as options)
  //number.parseFloat
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="id">Chose the Waypoint: </label>
      <select
        id="id"
        name="id"
        onChange={(e) => {
          setId(e.target.value);
        }}
      >
        {/* todo: map api call with the value being id and name being name */}
        <option value="1">Wavy</option>
      </select>

      <br />

      <label htmlFor="name">Name: </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Enter name here"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <br />

      <label htmlFor="description">Description: </label>
      <input
        type="text"
        id="description"
        name="description"
        placeholder="Enter description here"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />

      <br />

      <label htmlFor="latitude">Latitude: </label>
      <input
        type="text"
        id="latitude"
        name="latitude"
        placeholder="Enter latitude here"
        onChange={(e) => {
          setLatitude(e.target.value);
        }}
      />

      <br />

      <label htmlFor="longitude">Longitude: </label>
      <input
        type="text"
        id="longitude"
        name="longitude"
        placeholder="Enter longitude here"
        onChange={(e) => {
          setLongitude(e.target.value);
        }}
      />

      <br />

      <Button onClick={handleEditMode}>Cancel</Button>
      <Button>Save</Button>
    </form>
  );
};
