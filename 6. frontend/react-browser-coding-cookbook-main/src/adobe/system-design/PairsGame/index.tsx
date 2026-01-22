import { useRef, useState } from "react";
import Cell from "./Cell";
import './index.css';
import { useKeyboard } from "./useKeyboard";

interface PairGameProps {
  n: number;
  cards: number[];
}

const PairGame = ({
  n,
  cards,
}: PairGameProps) => {
  const [grid, setGrid] = useState<(number|null)[]>(cards);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [disabledClick, setDisabledClick] = useState(false);
  const gridCellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handler = (index: number) => setActiveIndex(index)

  console.log("active index ", activeIndex);

  useKeyboard(gridCellRefs, activeIndex, handler);

  const renderGrid = () => {
    return grid.map((cellVal, index) => (
      <Cell
        value={cellVal}
        index={index}
        onClick={handleCellClick}
        ref={(el) => {
          if(el)  gridCellRefs.current[index] = el;
        }
        }
        disabledClick={disabledClick}
      />
    ))
  }

  const handleCellClick = (val: number | null, index: number) => {
    setActiveIndex(index);
    if (prevIndex === -1) {
      setPrevIndex(index);
      return;
    }

    setDisabledClick(true);
    setTimeout(() => setDisabledClick(disabledClick => !disabledClick), 2000);

    if (grid[index] === grid[prevIndex]) {
      const newGrid = [...grid];
      newGrid[index] = null;
      newGrid[prevIndex] = null;
      setGrid(newGrid);
    }
    setPrevIndex(-1);
  }

  return (
    <div className="pair-game-container">
      <h3>Pair Game</h3>
      <div
        style={{
          gridTemplateRows: `repeat(${n}, auto)`,
          gridTemplateColumns: `repeat(${n}, auto)`,
        }}
        className="pair-game"
      >
        {renderGrid()}
      </div>
    </div>
  )
}

export default PairGame;
