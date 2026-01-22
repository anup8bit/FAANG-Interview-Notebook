import { Action, GameState, GameStatus, Player, Winner } from "./type";

export const hanndleMove = (state: GameState, payload: Action["payload"]): GameState => {
  const {row, col, value} = payload;
  const n = state.grid.length;
  let gameStatus: GameStatus = 'RUNNING';
  const playerMap: Record<Player, number> = {'O': 0, 'X': 1};
  let winner: Winner = null;

  /** update grid cell */
  const newGrid = [...state.grid];
  const newGridRow = [...(newGrid[row]??[])];
  newGridRow[col] = value as Player;
  newGrid[row] = newGridRow;

  /** Update row and col */
  const newRows = state.rows.map(r => [...r]);
  const newCols = state.cols.map(c => [...c]);
  const newDiag = [...state.diag];
  const newAntiDiag = [...state.antiDiag];


  const playerIndex = playerMap[value as Player];

  // ensure the inner arrays exist before indexing
  if (!newRows[playerIndex]) newRows[playerIndex] = Array(n).fill(0);
  if (!newCols[playerIndex]) newCols[playerIndex] = Array(n).fill(0);

  newRows[playerIndex][row] = (newRows[playerIndex][row] ?? 0) + 1;
  newCols[playerIndex][col] = (newCols[playerIndex][col] ?? 0) + 1;

  if (row === col) newDiag[playerIndex] = (newDiag[playerIndex] ?? 0) + 1;
  if (row+col === n-1) newAntiDiag[playerIndex] = (newAntiDiag[playerIndex] ?? 0) + 1;

  /** Check for game status */
   // 1. if all cells in a row have same player value
   if (
    newRows[playerIndex][row] === n ||
    newCols[playerIndex][col] === n ||
    newDiag[playerIndex] === n ||
    newAntiDiag[playerIndex] === n
  ) {
    winner = playerIndex === 0 ? 'O': 'X';
    gameStatus = 'COMPLETED';
  }

  if (state.move === (n*n)-1) gameStatus = 'DRAW';
  if (state.move === 0) gameStatus = 'RUNNING';

  return {
    ...state,
    grid: newGrid,
    rows: newRows,
    cols: newCols,
    diag: newDiag,
    antiDiag: newAntiDiag,
    turn: playerIndex === 0 ? 'X' : 'O',
    move: state.move+1,
    status: gameStatus,
    winner,
  }
}

export const getInitialState = (n: number): GameState => {
  return {
  grid: Array.from({ length: n }, () => Array(n).fill(undefined)),
  rows: Array.from({length: 2 }, () => Array(n).fill(0)), // if count in row at index i === N, it means a particular player has slected the whole row so he wins
  cols: Array.from({length: 2 }, () => Array(n).fill(0)),
  diag: [0, 0],
  antiDiag: [0, 0],
  turn: 'X',
  move: 0,
  status: 'NOT_STARTED',
  winner: null,
}
}