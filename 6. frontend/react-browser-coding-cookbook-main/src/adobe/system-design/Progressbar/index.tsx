import { ProgressBarProps } from "./type";
import "./index.css";
import { useLayoutEffect, useRef, useState } from "react";

const ProgressBar = ({
  progress,
  id,
  duration = 1000,
  maxValue,
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLProgressElement | null>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [value, setValue] = useState(0);

  const animateProgress: FrameRequestCallback = (timestamp) => {
    if (startRef.current === null) {
      startRef.current = timestamp;
    }
    const timeElapsed = timestamp - startRef.current;
    const progressValue = Math.min((timeElapsed/duration)*progress, progress);
  
    if (progressRef.current) {
      progressRef.current.value = progressValue;
      setValue(progressValue);
      progressRef.current.textContent = progressValue.toString();
    }

    if (timeElapsed < duration) {
      animRef.current = requestAnimationFrame(animateProgress)
    } else {
      animRef.current = null;
    }
  }

  useLayoutEffect(() => {
    const elem = progressRef.current;

    if (!elem) return;

    if (startRef.current) startRef.current = null;

    animRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    }
    
  }, [progress]);

  return (
    <div className="progressbar-container">
      <label htmlFor={id}>Progress bar</label>
      <progress
        ref={progressRef}
        id={id}
        role="progressbar"
        className="progres-bar-wrapper"
        max="100"
      >
      </progress>
        <span className="progress-value">{value}%</span>
    </div>
  )
}

export default ProgressBar;
