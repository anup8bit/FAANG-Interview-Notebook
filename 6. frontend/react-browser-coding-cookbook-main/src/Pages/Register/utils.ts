interface InputFieldsProps {
  name: keyof typeof initialState,
  type: string;
  required: boolean;
  placeholder: string;
  label?: string;
}


export const accountFields: InputFieldsProps[] = [
  {name:"email", label: "Email :", type: "text", required: true, placeholder: "Enter email"}, 
  {name:"username", label: "Username :", type: "text", required: true, placeholder: "Enter username"}, 
  {name:"password", label: "Password :", type: "text", required: true, placeholder: "Enter password"}, 
  {name:"confirmPassword", label: "Confirm Password :", type: "text", required: true, placeholder: "Enter confirmPassword" }
]

export const personalFields: InputFieldsProps[] = [
  {name:"firstName", label: "First Name", type: "text", required: true, placeholder: "Enter firstName"}, 
  {name:"lastName", label: "Last Name", type: "text", required: true, placeholder: "Enter lastName"}, 
  {name:"gender", label: "Gender", type: "checkbox", required: true, placeholder: "Enter gender"},
]




export const initialState = {
  step: 1,
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: ""
  }
};

export type RegisterState = typeof initialState;
