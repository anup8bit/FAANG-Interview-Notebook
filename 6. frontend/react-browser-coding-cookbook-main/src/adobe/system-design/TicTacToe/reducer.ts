import { Action, GameState, MOVE, RESET_GAME, SET_COLS, SET_DIAG, SET_GAME_STATUS } from "./type";
import { getInitialState, hanndleMove } from "./helper";

function gameReducer(state: GameState, action: Action): GameState {
  switch(action.type) {
    case MOVE:
      return hanndleMove(state, action.payload);
    case SET_GAME_STATUS:
      return {
        ...state,
      };
    case RESET_GAME:
      return getInitialState(action.payload.value);
    default:
      return state;
  }
}

export default gameReducer;