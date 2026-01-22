import { useEffect, useState } from "react";
import Cell from "../Cell";
import './index.css';

const grid = Array.from({ length: 3}, () => Array(3).fill(null));
const PlayerValue = new Map();
PlayerValue.set(1, 'O');
PlayerValue.set(2, 'X');

const digonal1 = [[0,0], [1,1], [2,2]];
const digonal2 = [[0,2], [1,1], [2,0]];

const TicTacToe = ({ N = 5 }) => {
 const [board, setBoard] = useState(
    Array.from({ length: N }, () => Array(N).fill(""))
  );
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Track counts for each player
  const [rows, setRows] = useState(() => [Array(N).fill(0), Array(N).fill(0)]);
  const [cols, setCols] = useState(() => [Array(N).fill(0), Array(N).fill(0)]);
  const [diags, setDiags] = useState([0, 0]);     // main diag counts per player
  const [antiDiags, setAntiDiags] = useState([0, 0]); // anti diag counts

  const onCellClick = (row, col) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? PlayerValue.get(turn) : c))
    );
    setBoard(newBoard);

    const playerIdx = turn - 1;

    console.log("player idx :", playerIdx, turn)

    // update counters
    const newRows = rows.map(r => [...r]);
    const newCols = cols.map(c => [...c]);
    const newDiags = [...diags];
    const newAntiDiags = [...antiDiags];

    console.log("newRows : ", newRows);
    console.log("newCols : ", newCols);
    console.log("newDiags : ", newDiags);
    console.log("newAntiDiags : ", newAntiDiags);


    newRows[playerIdx][row]++;
    newCols[playerIdx][col]++;
    if (row === col) newDiags[playerIdx]++;
    if (row + col === N - 1) newAntiDiags[playerIdx]++;

    setRows(newRows);
    setCols(newCols);
    setDiags(newDiags);
    setAntiDiags(newAntiDiags);

    // check win in O(1)
    if (
      newRows[playerIdx][row] === N ||
      newCols[playerIdx][col] === N ||
      newDiags[playerIdx] === N ||
      newAntiDiags[playerIdx] === N
    ) {
      setWinner(turn);
    } else if (newBoard.flat().every(c => c !== "")) {
      setDraw(true);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  const reset = () => {
    setBoard(Array.from({ length: N }, () => Array(N).fill("")));
    setTurn(1);
    setWinner(null);
    setDraw(false);
    setRows([Array(N).fill(0), Array(N).fill(0)]);
    setCols([Array(N).fill(0), Array(N).fill(0)]);
    setDiags([0, 0]);
    setAntiDiags([0, 0]);
  };

  const renderBoard = () => {
    return (
      <div className="board-container" style={{ '--n': N }}>
        {
          board.map((row, rowIndex) =>
            row.map((col, colIndex) =>
            <Cell
              row={rowIndex}
              col={colIndex}
              value={board[rowIndex][colIndex]}
              onCellClick={onCellClick}
              disabled={winner !== null}
              // isWinningCell={winningCell.includes(`${rowIndex}${colIndex}`)}
              isWinningCell={false}
            />
          ))
        }
      </div>
    )
  }


  return (
      <div className="game-container">
      <h1 class="header">Tic Tac Toe</h1>
      <div className="game-board-header">
          <div>Current Turn</div>
          <div>{`Player ${turn}`}</div>
        </div>
      {/* Game board and logic will go here */}
      {renderBoard()}

      {draw && <div className="winner-info">Match draw!!</div>}

      {winner && <div className="winner-info">
        {`Player ${turn} won the game. Congratulations!!!`}
      </div>}

      {(winner || draw) && <div>
        <button onClick={reset} className="reset-button">Play Again</button>
      </div>}
      </div>
  );
};

export default TicTacToe;