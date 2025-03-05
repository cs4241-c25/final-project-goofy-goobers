import React, { FC, useState } from 'react';
import { Button } from 'reactstrap';
import { Path } from '../../shared/models/Path';
import { WaypointMap } from './WaypointMap';
import { useObjectState } from '../utils';
import { Waypoint } from '../../shared/models/Waypoint';

interface PlayModeProps {
  path: Path;
  refresh: () => void;
  exitPlayMode: () => void;
}

export const PlayMode: FC<PlayModeProps> = ({ path, exitPlayMode }) => {
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // Transition mode, allows from to go from one waypoint to the next
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transition, setTransition] = useObjectState<{
    from: Waypoint | null;
    to: Waypoint | null;
  }>({ from: null, to: null });

  const currentWaypoint = path.waypoints[currentWaypointIndex];

  const handleGoNext = () => {
    if (currentWaypointIndex < path.waypoints.length - 1) {
      setTransition('from', currentWaypoint);
      setTransition('to', path.waypoints[currentWaypointIndex + 1]);
      setIsTransitioning(true);
    }
  };

  const handleGoPrev = () => {
    if (currentWaypointIndex > 0) {
      setTransition('from', currentWaypoint);
      setTransition('to', path.waypoints[currentWaypointIndex - 1]);
      setIsTransitioning(true);
    }
  };

  return (
    <>
      <WaypointMap waypoint={currentWaypoint} />

      <div className="text-center">
        {isTransitioning ? (
          <>
            <h4>
              Travelling from {transition.from?.name} to {transition.to?.name}
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

      <div className="d-flex justify-content-center mt-3">
        <Button disabled={currentWaypointIndex === 0} onClick={handleGoPrev}>
          Previous
        </Button>

        <h5 className="mx-3">
          Waypoint {currentWaypointIndex + 1} of {path.waypoints.length}
        </h5>

        <Button disabled={currentWaypointIndex >= path.waypoints.length - 1} onClick={handleGoNext}>
          Next
        </Button>
      </div>

      <div className="text-center mt-3">
        <Button color="danger" onClick={exitPlayMode}>
          Exit Play Mode
        </Button>
      </div>
    </>
  );
};
