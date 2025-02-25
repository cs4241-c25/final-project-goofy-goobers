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
      owner: { username: 'Jeff' }, // His name is Jeff. Yours may not be. Dont worry. Its dumby code
      waypoints: [],
    },
    {
      id: '67bbbe66ca87042588eee5fe', // Make sure this is a real id on the database!
      name: 'No need to click (it MAY kill be)',
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
