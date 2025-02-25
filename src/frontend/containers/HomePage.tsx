import React, { FC, useEffect, useState } from 'react';
import { Path } from '../../shared/models/Path';
import { NewPathButton } from '../components/NewPathButton';
import { PathLink } from '../components/PathLink';
import { captureError } from '../utils';

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
      {!loading && paths.map((path) => <PathLink key={path.id} path={path} />)}
      <h1>Hello, world! You are on / via React Router.</h1>
      <NewPathButton />
    </>
  );
};
