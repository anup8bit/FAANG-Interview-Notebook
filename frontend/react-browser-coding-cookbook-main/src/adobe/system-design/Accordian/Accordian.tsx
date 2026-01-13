import AccordianBody from "./AccordianPanel";
import Header from "./Header";
import { AccordianProps } from "./type";
import "./index.css";
import { useState } from "react";

const Accordian = ({
  title,
  content,
  key,
  id,
  isMultiOpen = true,
  active = true,
  setActiveIndex = () => {},
}: AccordianProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const isAccordianOpen = open && (active || isMultiOpen);

  return (
    <div key={key} className="accordian">
      <Header
        ariaControl={id}
        title={title}
        open={!!isAccordianOpen}
        toggle={toggle}
        setActiveIndex={setActiveIndex}
      />
      <AccordianBody open={isAccordianOpen} content={content} />
    </div>
  )
}

export default Accordian;
