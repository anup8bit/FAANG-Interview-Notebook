import React, { useState } from "react";
import GridPageLayout from "../GridPageLayout";

const  DragDrop = () => {
  const [boxes, setBoxes] = useState({
    box1: ["🍎"],
    box2: []
  });

  const onDragStart = (e, item, fromBox) => {
    e.dataTransfer.setData("item", item);
    e.dataTransfer.setData("fromBox", fromBox);
  };

  const onDrop = (e, toBox) => {
    const item = e.dataTransfer.getData("item");
    const fromBox = e.dataTransfer.getData("fromBox");

    if (fromBox === toBox) return;

    setBoxes(prev => {
      const newBoxes = { ...prev };
      newBoxes[fromBox] = newBoxes[fromBox].filter(i => i !== item);
      newBoxes[toBox].push(item);
      return newBoxes;
    });
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <GridPageLayout>
      <div className="flex gap-6 p-6">
          {Object.keys(boxes).map((box) => (
              <div
              key={box}
              onDrop={(e) => onDrop(e, box)}
              onDragOver={allowDrop}
              className="w-40 h-40 border-2 border-dashed flex items-center justify-center"
              >
              {boxes[box].map((item, idx) => (
                  <div
                  key={idx}
                  draggable
                  onDragStart={(e) => onDragStart(e, item, box)}
                  className="p-4 bg-red-400 rounded cursor-grab"
                  >
                  {item}
                  </div>
              ))}
              </div>
          ))}
          </div>
    </GridPageLayout>
  );
}

export default DragDrop;
