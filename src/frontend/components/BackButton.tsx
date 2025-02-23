import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';


export const BackButton: FC = () => {

  let url = window.location.href;
  console.log(url);

  return <Link to={"/"}>
    <Button>Back</Button>
  </Link>;

};
