import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Path } from '../../shared/models/Path';

interface PathLinkProps {
  path: Path;
}

export const PathLink: FC<PathLinkProps> = ({ path }) => {
  return (
    <Link to={'/view-path/' + path.id}>
      <p>{path.name}</p>
    </Link>
  );
};
