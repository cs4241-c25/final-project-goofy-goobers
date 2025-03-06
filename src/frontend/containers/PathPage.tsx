import React, { FC, useCallback, useEffect, useContext, useState } from 'react';
import { Modal, ModalBody, ModalHeader, Spinner, Button } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router-dom';
import { captureError } from '../utils';
import { WaypointForm } from '../components/WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';
import { TrailMap } from '../components/TrailMap';
import { PlayMode } from '../components/PlayMode';
import { UserContext } from '../services/providers';

export const PathPage: FC = () => {
  const { pathId } = useParams();

  const [path, setPath] = useState<Path | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fetchPath = useCallback(() => {
    api
      .getPath(pathId)
      .then((found) => {
        setPath(found);
        setLoading(false);
      })
      .catch(captureError);
  }, [pathId]);

  const addWaypoint = useCallback(
    (waypoint: WaypointPayload) => {
      if (!path) {
        toast.error('No path was provided?');
        return;
      }
      api
        .createWaypoint(path.id, waypoint)
        .then(() => {
          setCreating(false);
          fetchPath();
        })
        .catch(captureError);
    },
    [fetchPath, path],
  );

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  if (loading || !path) {
    return <Spinner />;
  }

  return (
    <>
      {!isPlaying && (
        <>
          <TrailMap path={path} refresh={fetchPath} key={path.id} />
          {/*{path.waypoints.map((wp) => (*/}
          {/*  <WaypointCard*/}
          {/*    refresh={fetchPath}*/}
          {/*    pathId={path.id}*/}
          {/*    waypoint={wp}*/}
          {/*    owner={path.owner.username}*/}
          {/*    key={wp.id}*/}
          {/*  />*/}
          {/*))}*/}
          {path.waypoints.length > 0 && (
            <>
              <div className="text-center">
                <Button
                  color="success"
                  className="mt-3 mb-3"
                  onClick={() => {
                    setIsPlaying(true);
                  }}
                >
                  Enter Play Mode
                </Button>
              </div>
            </>
          )}
          <Modal
            isOpen={creating}
            toggle={() => {
              setCreating(!creating);
            }}
          >
            <ModalHeader>New Waypoint</ModalHeader>
            <ModalBody>
              <WaypointForm
                submit={addWaypoint}
                closeForm={() => {
                  setCreating(false);
                }}
              />
            </ModalBody>
          </Modal>
        </>
      )}
      {isPlaying && (
        <>
          <h1>Path: {path.name}</h1>
          <PlayMode
            path={path}
            refresh={fetchPath}
            exitPlayMode={() => {
              setIsPlaying(false);
            }}
          />
        </>
      )}
    </>
  );
};
