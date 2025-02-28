import React, { FC, useEffect, useState } from 'react';
import { Path } from '../../shared/models/Path';
import { captureError } from '../utils';
import { PathCard } from '../components/PathCard';

export const HomePage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<Path[]>([]);

  useEffect(() => {
    api
      .getAllPaths()
      .then((retrieved) => {
        setPaths(retrieved);
        setLoading(false);
      })
      .catch(captureError);
  }, []);

  return (
    <>
      <h1>Welcome to TrailBlazer</h1>
      <p>Choose a Path below and follow along with each Waypoint.</p>
      <h2>Public Paths:</h2>
      {!loading && paths.map((path) => <PathCard key={path.id} path={path} />)}
    </>
  );
};
