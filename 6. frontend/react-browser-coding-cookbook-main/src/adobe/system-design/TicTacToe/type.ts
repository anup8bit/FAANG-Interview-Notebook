export type Player = 'X' | 'O';
export type GameStatus = 'NOT_STARTED' | 'RESET' | 'RUNNING' | 'DRAW' | 'COMPLETED';

export type Winner = 'X' | 'O' | null;

export interface GameState {
  grid: (Player | undefined)[][];
  rows: number[][];
  cols: number[][];
  diag: number[];
  antiDiag: number[];
  turn: Player;
  move: number;
  status: GameStatus;
  winner: Winner;
}

/** action types */

export type ActionType = 'SET_GAME_STATUS' |
'MOVE' |
'SET_TURN' |
'SET_GRID' |
'SET_ROWS' |
'SET_COLS' |
'SET_DIAG' |
'SET_ANTIDIAG' |
'RESET_GAME' |
'SET_WINNER';

export interface Action {
  type: ActionType,
  payload: Record<string, any>;
}

export const SET_GAME_STATUS = 'SET_GAME_STATUS';
export const SET_TURN = 'SET_TURN';
export const RESET_GAME = 'RESET_GAME';
export const SET_ROWS = 'SET_ROWS';
export const SET_COLS = 'SET_COLS';
export const SET_DIAG = 'SET_DIAG';
export const SET_ANTIDIAG = 'SET_ANTIDIAG';
export const SET_WINNER = 'SET_WINNER';
export const MOVE = 'MOVE';


