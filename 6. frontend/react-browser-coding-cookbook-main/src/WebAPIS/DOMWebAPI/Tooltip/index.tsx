import { CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import "./index.css";


interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

type placement = 'top' | 'bottom' | 'left' | 'right';

const Tooltip = ({
  children,
  content,
}: TooltipProps): ReactElement | null => {
  const [pos, setPos] = useState<DOMRect>();
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [styles, setStyles] = useState<CSSProperties>();

  const toggleTooltip = () => {
    setShow(!show);
    const tooltipElem = ref?.current;
    console.log(tooltipElem);
    const rectElementPos = tooltipElem?.getBoundingClientRect();
    console.log("pos : ", rectElementPos);
    setPos(rectElementPos);
    if (rectElementPos) {
      const tooltipStyles: CSSProperties = {
          top: rectElementPos.bottom + 8,
        }

        setStyles(tooltipStyles);
    }
  }

  return (
    <div
      ref={ref}
      // onMouseEnter={toggleTooltip}
      onClick={toggleTooltip}
      className="tooltip-container"
    >
      <>{children}</>
      {show && (
        <div className="tooltip">
          <div className="tooltip-arrow"></div>
          <div className="tooltip-content">
            <div className="tooltip-inner-content">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip;
