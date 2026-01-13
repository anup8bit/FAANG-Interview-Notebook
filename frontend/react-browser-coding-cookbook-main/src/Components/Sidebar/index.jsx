import "./index.css";


const list = [
  {
    label: "Input",
    component: "",
    name: "Input"
  },
  {
    label: "Modal",
    component: "",
    name: "Modal"
  },
  {
    label: "Star Rating",
    component: "",
    name: "StarRating"
  },
  {
    label: "Drag and Drop",
    component: "",
    name: "DragDrop"
  },
  {
    label: "File Explorer",
    name: "FileExplorer"
  },
  {
    label: "OTP Form",
    name: "OTPForm",
  },
  {
    label: "Auto Complete",
    name: "AutoComplete",
  },
  {
    label: "Progress Bar",
    name: "ProgressBar",
  },
  {
    label: "Tooltip",
    name: "Tooltip",
  },
  {
    label: "User List With Suspense",
    name: "UserListWithSuspense",
  },
]

const Sidebar = ({
  handleClick
}) => {
  return (
    <div className="sidebar-container">
      {list.map((comp) => (
        <div className="nav-item">
          <button onClick={() => handleClick(comp.name)} className="sidebar-cta">{comp.label}</button>
        </div>
      ))}
    </div>
  )
}

export default Sidebar;