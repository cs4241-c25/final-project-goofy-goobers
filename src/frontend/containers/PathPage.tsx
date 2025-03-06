import React, { FC, useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, Spinner, Button, Col, Row, Container } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { useParams } from 'react-router-dom';
import { captureError } from '../utils';
import { WaypointForm } from '../components/WaypointForm';
import { WaypointPayload } from '../../shared/Payloads';
import { toast } from 'react-toastify';
import { TrailMap } from '../components/TrailMap';
import { PlayMode } from '../components/PlayMode';
import { QRCodeSVG } from 'qrcode.react';
import { WaypointCard } from '../components/WaypointCard';

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
          <Container fluid className="p-4">
            <div className="mb-4">
              <TrailMap path={path} refresh={fetchPath} key={path.id} />
            </div>

            <Row className="justify-content-center">
              <Col xs="12" className="d-md-none text-center mb-3">
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
              </Col>
            </Row>

            <Row>
              <Col xs="12" md="8">
                {path.waypoints.map((wp) => (
                  <WaypointCard
                    refresh={fetchPath}
                    pathId={path.id}
                    waypoint={wp}
                    owner={path.owner.username}
                    key={wp.id}
                  />
                ))}
              </Col>

              <Col xs="12" md="4" className="text-center">
                {path.waypoints.length > 0 && (
                  <>
                    <div className="d-none d-md-block mb-3">
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
                <div className="mt-5">
                  <QRCodeSVG
                    className="shadow-sm"
                    value={window.location.href}
                    size={200}
                    marginSize={1}
                  />
                </div>
              </Col>
            </Row>

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
          </Container>
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
