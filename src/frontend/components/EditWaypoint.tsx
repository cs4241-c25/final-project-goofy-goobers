import React, { FC } from 'react';


export const EditWaypoint: FC = () => {
  //TODO - make sure only proper inputs allowed into latitude and longitude field
  //number.parseFloat
  return (
    <form>

      <label htmlFor="waypointName">Name: </label><br />
      <input type="text" id="waypointName" name="waypointName" placeholder="Enter name here" /><br /><br />

      <label htmlFor="description">Description: </label><br />
      <input type="text" id="description" name="description" placeholder="Enter description here" /><br /><br />

      <label htmlFor="latitude">Latitude: </label><br />
      <input type="text" id="latitude" name="latitude" placeholder="Enter latitude here" /><br /><br />

      <label htmlFor="longitude">Longitude: </label><br />
      <input type="text" id="longitude" name="longitude" placeholder="Enter longitude here" /><br /><br />


    </form>
  );
};
