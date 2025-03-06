import React, { FC, useMemo } from 'react';
import { Card, CardBody, CardText } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { Link } from 'react-router-dom';

export const PathCard: FC<{
  readonly path: Path;
}> = ({ path }) => {
  const distance = useMemo(() => {
    let distance = 0;
    const R = 6371;
    const piRad = Math.PI / 180;
    const { waypoints } = path;

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
    return distance;
  }, [path]);

  const rawMinutes = (distance / 5) * 60;
  const minutes = (rawMinutes % 60).toFixed(0);
  const rawHours = Math.floor(rawMinutes / 60);
  const days = Math.floor(rawHours / 24);
  const hours = rawHours % 24;

  return (
    <>
      <Card className="h-100">
        <CardBody>
          <Link to={'/view-path/' + path.id}>
            <h4>{path.name}</h4>
          </Link>
          <h5>{'Owner: ' + path.owner.username}</h5>
          {path.waypoints.length > 1 && (
            <>
              <b>{`Distance: ${distance.toPrecision(2)}km`}</b>
              <br />
              {days > 0 ? (
                <b>{`Estimated Time: ${days} days, ${hours} hours, ${minutes} minutes`}</b>
              ) : hours > 0 ? (
                <b>{`Estimated Time: ${hours} hours, ${minutes} minutes`}</b>
              ) : (
                <b>{`Estimated Time: ${minutes} minutes`}</b>
              )}
            </>
          )}
          {path.description && <CardText>{path.description}</CardText>}
        </CardBody>
      </Card>
    </>
  );
};
