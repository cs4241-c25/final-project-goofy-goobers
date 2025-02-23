import React, { FC } from 'react';
import { Link } from 'react-router-dom';


export const BackButton: FC = () => {

  let url = window.location.href;
  console.log(url);

  return <Link to={"/"}>
    <button>Back</button>
  </Link>;

};
