import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const PathLink: FC = ({ path }) => {
  return (
    <Link to={"/view-path/" + path.id}>
      <p>{path.name}</p>
    </Link>
  );
};

