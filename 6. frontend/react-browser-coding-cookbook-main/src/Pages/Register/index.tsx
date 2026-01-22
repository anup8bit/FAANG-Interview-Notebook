import { useReducer } from "react";
import Input from "../../Components/Input";
import registerReducer from "./reducer";
import { accountFields, initialState, personalFields } from "./utils";
import "./index.css";

const Register = () => {
  const [state, dispatch] = useReducer(registerReducer, initialState)
  console.log("state : ", state);
  const infoFields = Object.keys(initialState);
  console.log(infoFields)
  return (
    <main>
      <section>
        <header>
          <h1 id="register-heading">Create an account</h1>
          <p>Fill in the form below to register</p>
        </header>

        <form aria-describedby="register-note">
          {/* Personal Info */}
          {state.step === 1 && <fieldset>
              <legend>Account Information</legend>
              {accountFields.map((inputField) => (
                <Input
                  name={inputField.name}
                  value={state[inputField.name] as unknown as string}
                  required={inputField.required}
                  type={inputField.type}
                  label={inputField.label ?? ""}
                  placeholder={inputField.placeholder}
                  onChange={
                    (e) =>
                      dispatch({
                        type: "SET_FIELD",
                        payload: { field: inputField.name, value: e.currentTarget.value}
                      })
                    }

                />
              ))}
            </fieldset>
          }

          {state.step === 2 && <fieldset>
              <legend>Personal Information</legend>
              {personalFields.map((inputField) => (
                <Input
                  name={inputField.name}
                  value={state[inputField.name] as unknown as string}
                  required={inputField.required}
                  type={inputField.type}
                  label={inputField.label ?? ""}
                  placeholder={inputField.placeholder}
                  onChange={
                    (e) =>
                      dispatch({
                        type: "SET_FIELD",
                        payload: { field: inputField.name, value: e.currentTarget.value}
                      })
                    }

                />
              ))}
            </fieldset>
          }


          {(state.step > 1 && state.step <= 3) &&
            <button
              onClick={
                () =>
                dispatch({
                  type: "SET_STEP",
                  payload: { field: "step", value: state.step-1 }
                })
              }
              className="prev-cta" type="button"
            >
              Prev
            </button>
          }
          {(state.step >= 1 && state.step < 3) &&
            <button
              className="next-cta"
              type="button"
              onClick={
                () =>
                dispatch({
                  type: "SET_STEP",
                  payload: { field: "step", value: state.step+1 }
                })
              }
            >
                Next
            </button>}

        </form>
      </section>
      
    </main>
  )
}

export default Register;
