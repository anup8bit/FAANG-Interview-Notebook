import { useEffect, useLayoutEffect, useRef } from "react";
import { AccordianPanelProps } from "./type";
import { useSmoothAnimation } from "../hooks/useSmoothAnimation";

const AccordianPanel = ({ content, open }: AccordianPanelProps) => {
  const panelRef = useSmoothAnimation<HTMLDivElement>(open);
  
  return (
    <div
      ref={panelRef}
      role="region"
      style={{
        overflow: "hidden",
        height: "0px",
      }}
      className="accordian-content">
      {content}
    </div>
  )
}

export default AccordianPanel;
