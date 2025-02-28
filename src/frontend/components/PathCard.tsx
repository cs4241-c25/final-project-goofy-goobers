import React, { FC } from 'react';
import { Card, CardBody, CardText } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { Link } from 'react-router-dom';

export const PathCard: FC<{
  readonly path: Path;
}> = ({ path }) => {
  return (
    <>
      <Card>
        <CardBody>
          <Link to={'/view-path/' + path.id}>
            <h4>{path.name}</h4>
          </Link>
          {path.description && <CardText>{path.description}</CardText>}
        </CardBody>
      </Card>
    </>
  );
};
