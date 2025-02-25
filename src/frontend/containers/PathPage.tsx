import React, { FC, useCallback, useEffect, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { AddWaypoint } from '../components/AddWaypoint';
import { EditWaypoint } from '../components/EditWaypoint';
import { DeleteWaypoint } from '../components/DeleteWaypoint';
import { Button, Spinner } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router-dom';
import { captureError } from '../utils';

export const PathPage: FC = () => {
  const [editModeFlag, setEditModeFlag] = useState(false);
  const [addModeFlag, setAddModeFlag] = useState(false);
  const [deleteModeFlag, setDeleteModeFlag] = useState(false);
  const { pathId } = useParams();

  const [path, setPath] = useState<Path | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchPath = useCallback(() => {
    api
      .getPath(pathId)
      .then((found) => {
        setPath(found);
        setLoading(false);
      })
      .catch(captureError);
  }, [pathId]);

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  if (loading || !path) {
    return <Spinner />;
  }

  return (
    <>
      <h1>You are at the path called {path.name}</h1>
      {path.waypoints.map((wp) => (
        // h2 is temp till we get leaflet going
        <h2 key={wp.id}>
          name:{wp.name} lon:{wp.longitude} lat:{wp.latitude}
        </h2>
      ))}
      {editModeFlag ? (
        <>
          <EditWaypoint
            close={() => {
              setEditModeFlag(false);
            }}
            path={path}
            refresh={() => {
              fetchPath();
            }}
          />
        </>
      ) : addModeFlag ? (
        <>
          <AddWaypoint
            close={() => {
              setAddModeFlag(false);
            } } pathID={pathId ?? ''}
          />
        </>
      ) : deleteModeFlag ? (
        <>
          <DeleteWaypoint
            close={() => {
              setDeleteModeFlag(false);
            }}
            path={path}
            refresh={() => {
              fetchPath();
            }}
          />
        </>
      ) : (
        <>
          <BackButton />
          <Button
            onClick={() => {
              setAddModeFlag(!addModeFlag);
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              setEditModeFlag(!editModeFlag);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setDeleteModeFlag(!deleteModeFlag);
            }}
          >
            Delete
          </Button>
        </>
      )}
    </>
  );
};
