import React, { FC, useCallback, useState } from 'react';
import { Button } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { WaypointMap } from './WaypointMap';
import { Waypoint } from '../../shared/models/Waypoint';

interface PlayModeProps {
  path: Path;
  refresh: () => void;
  exitPlayMode: () => void;
}

export const PlayMode: FC<PlayModeProps> = ({ path, exitPlayMode }) => {
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  const defaultWaypoint: Waypoint = {
    id: '',
    name: 'Default Waypoint',
    latitude: 0,
    longitude: 0,
    description: '',
    path: '',
  };

  // Transition mode, allows from to go from one waypoint to the next
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transToWaypoint, setTransToWaypoint] = useState<Waypoint>(defaultWaypoint);
  const [transFromWaypoint, setTransFromWaypoint] = useState<Waypoint>(defaultWaypoint);

  const currentWaypoint = path.waypoints[currentWaypointIndex];

  const handleGoNext = useCallback(() => {
    if (currentWaypointIndex < path.waypoints.length - 1) {
      setTransFromWaypoint(currentWaypoint);
      setTransToWaypoint(path.waypoints[currentWaypointIndex + 1]);
      setCurrentWaypointIndex(currentWaypointIndex + 1);
      setIsTransitioning(true);
    }
  }, [
    currentWaypoint,
    currentWaypointIndex,
    path.waypoints,
    setTransFromWaypoint,
    setTransToWaypoint,
  ]);

  const handleGoPrev = useCallback(() => {
    if (currentWaypointIndex > 0) {
      setTransFromWaypoint(currentWaypoint);
      setTransToWaypoint(path.waypoints[currentWaypointIndex - 1]);
      setCurrentWaypointIndex(currentWaypointIndex - 1);
      setIsTransitioning(true);
    }
  }, [
    currentWaypoint,
    currentWaypointIndex,
    path.waypoints,
    setTransFromWaypoint,
    setTransToWaypoint,
  ]);

  const handleArrival = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const handleOpenMapping = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${transFromWaypoint.latitude},${transFromWaypoint.longitude}&destination=${transToWaypoint.latitude},${transToWaypoint.longitude}&travelmode=walking`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <>
      <div className="mt-3">
        {!isTransitioning ? (
          <WaypointMap waypoints={[currentWaypoint]} />
        ) : (
          <WaypointMap waypoints={[transFromWaypoint, transToWaypoint]} />
        )}

        <div className="text-center">
          {isTransitioning ? (
            <>
              <h4>
                Travelling from {transFromWaypoint.name} to {transToWaypoint.name}
              </h4>
            </>
          ) : (
            <>
              <h4 className="mx-3">{currentWaypoint.name}</h4>
              {currentWaypoint.description && (
                <>
                  <h5 className="mt-2 mx-3">{currentWaypoint.description}</h5>
                </>
              )}
            </>
          )}
        </div>

        <div className="d-flex flex-column align-items-center mt-3">
          {isTransitioning ? (
            <>
              <div className="mb-2">
                <Button
                  className={"success-button"}
                  onClick={() => {
                    handleArrival();
                  }}
                >
                  Arrived
                </Button>
              </div>
              <div className="mb-2">
                <Button className={"secondary-button"} onClick={handleOpenMapping}>
                  Navigate
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <Button disabled={currentWaypointIndex === 0} onClick={handleGoPrev}>
                  Previous
                </Button>

                <h5 className="mx-3">
                  Waypoint {currentWaypointIndex + 1} of {path.waypoints.length}
                </h5>

                <Button
                  disabled={currentWaypointIndex >= path.waypoints.length - 1}
                  onClick={handleGoNext}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-3">
          <Button className={"danger-button"} onClick={exitPlayMode}>
            Exit Play Mode
          </Button>
        </div>
      </div>
    </>
  );
};
