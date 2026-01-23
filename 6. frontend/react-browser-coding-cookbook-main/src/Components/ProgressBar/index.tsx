import { ReactElement, useRef, useState } from "react";
import "./index.css";

interface ProgressBarProps {
  progress: number;        // target progress (0–100)
  animationTime: number;   // duration in ms
}

const ProgressBar = ({
  progress = 70,
  animationTime = 3000
}: ProgressBarProps): ReactElement | null => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null); // To calculate elapsed time
  const animationFrameRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);

  // ----------- Animation Core -------------
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    /*
    *Animation starts at t = 1000ms.
    * Current performance.now() = 2500ms.
    * elapsed = 2500 - 1000 = 1500ms.
    */

    // adjust if paused
    const elapsed = timestamp - startTimeRef.current;
    const progressPercent = Math.min((elapsed / animationTime) * progress, progress);

    setCurrentProgress(progressPercent);

    if (progressPercent < progress) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
    }
  };

  // ----------- Controls -------------------
  const startAnimation = () => {
    cancelAnimationFrame(animationFrameRef.current!);
    setCurrentProgress(0);
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    setIsPaused(false);
    setIsRunning(true);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const pauseAnimation = () => {
    if (isRunning && !isPaused) {
      cancelAnimationFrame(animationFrameRef.current!);
      setIsPaused(true);
      pauseTimeRef.current = performance.now();
    }
  };

  const resumeAnimation = () => {
    if (isPaused) {
      setIsPaused(false);
      if (pauseTimeRef.current && startTimeRef.current) {
        // shift startTime forward by pause duration
        const pauseDuration = performance.now() - pauseTimeRef.current;
        startTimeRef.current += pauseDuration;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const cancelAnimation = () => {
    cancelAnimationFrame(animationFrameRef.current!);
    setCurrentProgress(0);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pauseTimeRef.current = null;
  };

  // ----------- UI -------------------------
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar"
          style={{
            width: `${currentProgress}%`,
            height: "100%",
            background: "#13eb4c",
            transition: "none" // no CSS transition, pure JS animation
          }}
        >
          {Math.round(currentProgress)}%
        </div>
      </div>

      <div className="controls">
        <button onClick={startAnimation}>Start</button>
        <button onClick={pauseAnimation} disabled={!isRunning || isPaused}>
          Pause
        </button>
        <button onClick={resumeAnimation} disabled={!isPaused}>
          Resume
        </button>
        <button onClick={cancelAnimation}>Cancel</button>
      </div>
    </div>
  );
};

export default ProgressBar;
