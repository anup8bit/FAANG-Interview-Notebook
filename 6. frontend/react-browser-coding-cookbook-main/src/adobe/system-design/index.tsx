import { title } from "process"
import Accordian from "./Accordian/Accordian"
import { useState } from "react";

const data = [
  {
    title: "Accordian 1",
    content: "By default, all sections are collapsed and are hidden from view."
  },
  {
    title: "Accordian 2",
    content: "Clicking on a section title toggles the contents."
  },
  {
    title: "Accordian 3",
    content: "If the section is collapsed, the section will be expanded and the contents will be displayed."
  },
  {
    title: "Accordian 4",
    content: "Bangalore, the Garden City, the Silicon Valley of India, and the City of Pubs, offers plenty of things to do when it comes to food, shopping, and general merriment. But so often, when you have that three-day weekend or too many leaves that may end up lapsing, you need to do something beyond Bangalore. Luckily, Bangalore's backyard is filled with plenty of spots that are heavy on nature and history and offer you a quick and easy getaway. We've scouted (and travelled) to give you some of our favourite weekend getaways from Bangalore that are just under eight hours."
  }
];

const SystemDesign = () => {
  const [active, setActive] = useState(-1);
  const setActiveIndex = (index: number) => {
    setActive(index);
  }
  return (
    <div>
      <h2>System Design</h2>
      <div>
        <h3>Multi open accordian</h3>
        {
          data.map((item, index) => (
            <Accordian key={index.toString()} title={item.title} content={item.content} />
          ))
        }
      </div>

      <div>
        <h3>Single open accordian</h3>
        {
          data.map((item, index) => (
            <Accordian
              key={index.toString()}
              title={item.title}
              content={item.content}
              isMultiOpen={false}
              setActiveIndex={() => setActiveIndex(index)}
              active={active===index}
            />
          ))
        }
      </div>
    </div>
  )
}

export default SystemDesign;
