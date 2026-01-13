import { ReactElement, useEffect, useRef, useState } from "react";
import "./index.css";


interface LazyImageProps {
  alt: string;
  dataTestId?: string;
  id?: string;
  className?: string;
  src: string;
}

const LazyImage = ({
  alt,
  dataTestId,
  id,
  className,
  src,
}: LazyImageProps): ReactElement | null => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!imgRef) return;
    const callback: IntersectionObserverCallback = (enteries, obs) => {
      // console.log("observer entries : ", enteries);
      enteries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      });
    }

    const options: IntersectionObserverInit = {
      rootMargin: "0px 100px 100px 0px",
      threshold: 0.1,
      root: null,
    }

    const observer = new IntersectionObserver(callback, options);
    if(imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if(imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    }
  });

  let imageClasses = "lazy-image";

  if (visible) {
    imageClasses += " lazy-image-visible";
  } else {
    imageClasses += " lazy-image-not-visible";
  }

  return (
    <div className="image-wrapper">
      <img
        alt={alt}
        className={imageClasses}
        data-testid={dataTestId}
        ref={imgRef}
        id={id}
        src={visible ? src: ""}
      />
    </div>
  )
}

export default LazyImage;
