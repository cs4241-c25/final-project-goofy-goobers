import React, { FC } from 'react';
import { Path } from '../../shared/models/Path';
import { NewPathButton } from '../components/NewPathButton';
import { PathLink } from '../components/PathLink';

export const HomePage: FC = () => {
  const pathArray: Path[] = [
    {
      id: '67bcf74107867d3a7129a7ba',
      name: 'Pathy',
      description: 'This is the first path',
      owner: { username: 'Jeff' },
      waypoints: [],
    },
    {
      id: '2',
      name: 'Pathie',
      description: 'This is the second path!!!!!',
      owner: { username: 'Jeff' },
      waypoints: [],
    },
    {
      id: '3',
      name: 'Pathological',
      description: 'This is the third path (belongs to jill)!!!!!',
      owner: { username: 'Jill' },
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
