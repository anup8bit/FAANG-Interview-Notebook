import { useReducer, useState } from "react";
import "./index.css";
import gameReducer from "./reducer";
import { getInitialState } from "./helper";
import { MOVE, Player } from "./type";
import Cell from "./Cell";
import Modal from "../Modal/Modal";

interface Props {
  n?: number;
}

const TicTacToeGame = ({ n = 3 }: Props) => {
  const [state, dispatch]  = useReducer(gameReducer, getInitialState(n))
  const [open, setOpen] = useState(false);

  const haldleMove = () => {
    dispatch({
      type: MOVE,
      payload: {
        row: 1,
        col: 2,
        value: 'X'
      }
    })
  }

  console.log("---state----", state);

  const handleClick = (row: number, col: number) => {
    dispatch({
      type: MOVE,
      payload: {
        row,
        col,
        value: state.turn,
      }
    })
  }

  const renderGrid = () => {
    return state.grid.map((row, rIndex) => {
      return row.map((cellValue, cIndex) => (
        <Cell
          handleClick={handleClick}
          row={rIndex}
          col={cIndex}
          value={cellValue}
          isDisabled={cellValue !== undefined || state.status === 'COMPLETED'}
        />
      ))
    })
  }

  const getMatchStatus = () => {
    let matchStatus = '';

    switch(state.status) {
      case 'RUNNING':
        matchStatus = `Match in progress! Current player turn : ${state.turn}`
        break;
      case 'DRAW':
        matchStatus = 'Match is draw!!!';
        break;
      case 'COMPLETED':
        matchStatus = `Player won : ${state.winner}`
      default:
        matchStatus = 'Start the game!';
    }

    return matchStatus;
  }

  const toggleModal = () => setOpen(!open);
  
  return (
    <div className="tictaktoe-game-container">
      <h3>Tic Tac Toe Game</h3>
      <button onClick={toggleModal}>Click me to open modal</button>
      <div className="status-board">
        <div>
          {getMatchStatus()}
        </div>
      </div>
      <div
        className="grid-board"
        style={{
          display: 'inline-grid',
          gridTemplateRows: `repeat(${n}, 1fr)`,
          gridTemplateColumns: `repeat(${n}, 1fr)`
        }}
      >
        {renderGrid()}
      </div>
      <Modal
        toggleModal={toggleModal}
        open={open}
        title="My Modal"
        content="Modal Content"
        closeOnBackDropClick
      />
    </div>
  )
}

export default TicTacToeGame;
