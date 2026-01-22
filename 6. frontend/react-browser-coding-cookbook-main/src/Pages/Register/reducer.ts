import { initialState, type RegisterState } from "./utils.js";

interface ActionPayload {
  field: keyof RegisterState,
  value: string | number;
}

interface RegisterAction {
  type: "SET_FIELD" | "SET_ADDRESS_FIELD" | "RESET" | "SET_STEP",
  payload: ActionPayload,
}

function registerReducer(state: RegisterState = initialState, action: RegisterAction) {
  switch(action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value
      };
    case "SET_ADDRESS_FIELD":
      return {
        ...state,
        address: {
          ...state.address,
          [action.payload.field]: action.payload.value
        }
      };
    case "SET_STEP":
      return {
        ...state,
        [action.payload.field]: action.payload.value
      }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default registerReducer;