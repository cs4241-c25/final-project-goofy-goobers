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

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  if (loading || !path) {
    return <Spinner />;
  }

  return (
    <>
      {!isPlaying && (
        <TrailMap
          path={path}
          refresh={fetchPath}
          startPlay={() => {
            setIsPlaying(true);
          }}
        />
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
