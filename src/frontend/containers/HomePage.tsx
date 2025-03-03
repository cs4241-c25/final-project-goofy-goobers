import React, { FC, useEffect, useState } from 'react';
import { Path } from '../../shared/models/Path';
import { User } from '../../shared/models/User';
import { captureError } from '../utils';
import { PathCard } from '../components/PathCard';
import { Row, Col } from 'reactstrap';

export const HomePage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<Path[]>([]);
  const [yourPaths, setYourPaths] = useState<Path[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ username: '', name: '', email: '' });

  useEffect(() => {
    api //get and set user
      .poll()
      .then((retrieved) => {
        setCurrentUser(retrieved);
      })
      .catch(captureError);

    api //get and set the two path lists
      .getAllPaths()
      .then((retrieved) => {
        setPaths(retrieved);

        const tempPaths: Path[] = retrieved.filter((path) => {
          return path.owner.username === currentUser.username;
        });
        setYourPaths(tempPaths);

        setLoading(false);
      })
      .catch(captureError);
  }, [currentUser]);

  return (
    <>
      <h1>Welcome to TrailBlazer</h1>
      <p>Choose a Path below and follow along with each Waypoint.</p>
      {!loading && yourPaths.length > 0 && <h2>Your Paths:</h2>}
      {!loading && yourPaths.length > 0 && (
        <Row>
          {yourPaths.map((path) => (
            <Col key={path.id} sm="8" md="6" lg="4">
              <PathCard path={path} />
              <br />
            </Col>
          ))}
        </Row>
      )}
      <h2>All Public Paths:</h2>
      {!loading && (
        <Row>
          {paths.map((path) => (
            <Col key={path.id} sm="8" md="4" lg="4">
              <PathCard path={path} />
              <br />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};
