import React, { FC } from 'react';
import { Card, CardBody, CardText } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { Link } from 'react-router-dom';

export const PathCard: FC<{
  readonly path: Path;
}> = ({ path }) => {
  const distance = calcDistance(path);
  const allMinutes = calcTime(distance);
  const minutes = allMinutes % 60;
  const allHours = Math.floor(allMinutes / 60);
  const days = Math.floor(allHours / 24);
  const hours = allHours % 24;
  return (
    <>
      <Card>
        <CardBody>
          <Link to={'/view-path/' + path.id}>
            <h4>{path.name}</h4>
          </Link>
          <h5>{'Owner: ' + path.owner.username}</h5>
          { (path.waypoints.length > 1) && (
            <>
              <b>{'Distance: ' + distance + ' km'}</b>
              <br />
              {(days > 0) ? (
              <b>{'Estimated Time: ' + days + ' days ' + hours + ' hours ' + minutes + ' minutes'}</b>
              ) :
              (hours > 0) ? (
              <b>{'Estimated Time: ' + hours + ' hours ' + minutes + ' minutes'}</b>
              ) : (
              <b>{'Estimated Time: ' + minutes + ' minutes'}</b>
              )}
            </>
          )}
          {path.description && <CardText>{path.description}</CardText>}
        </CardBody>
      </Card>
    </>
  );
};

const calcDistance = (path: Path) => {
  let distance = 0;
  const R = 6371;
  const piRad = Math.PI / 180;
  const waypoints = path.waypoints;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const phi1 = waypoints[i].latitude * piRad;
    const phi2 = waypoints[i + 1].latitude * piRad;
    const deltaPhi = (waypoints[i + 1].latitude - waypoints[i].latitude) * piRad;
    const deltaGam = (waypoints[i + 1].longitude - waypoints[i].longitude) * piRad;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaGam / 2) * Math.sin(deltaGam / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = distance + R * c;
  }
  return distance.toFixed(2).toString();
};

const calcTime = (distanceString: string) => {
  const time = (Number(distanceString) / 5) * 60; //time it takes to do a trail in minutes
  return time.toFixed(0).toString();
};
