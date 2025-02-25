import React, { FC } from 'react';
import { Path } from '../../shared/models/Path';
import { NewPathButton } from '../components/NewPathButton';
import { PathLink } from '../components/PathLink';

export const HomePage: FC = () => {
  const pathArray: Path[] = [
    {
      id: '67bcf74107867d3a7129a7ba', // Make sure this is a real id on the database!
      name: 'Pathy',
      description: 'This is the first path',
      owner: { username: 'Jeff' }, // Don't mind this field. His name is Jeff
      waypoints: [],
    },
    {
      id: '2',
      name: 'No need to click (doesnt work cause im a lazy hard coder)',
      description: 'This is the second path!!!!!',
      owner: { username: 'Jeff' },
      waypoints: [],
    },
  ];

  return (
    <>
      {pathArray.map((path) => (
        <PathLink key={path.id} path={path} />
      ))}
      <h1>Hello, world! You are on / via React Router.</h1>
      <NewPathButton />
    </>
  );
};
