import { useState } from "react";
import Sidebar from "../../Components/Sidebar"
import GridPageLayout from "../../Components/GridPageLayout"
import Input from "../../Components/Input";
import Modal from "../../Components/Modal";
import StarRating from "../../Components/StarRating";
import componentsMap from './componentRegistry';

const StoryBook = () => {
  const [component, setComponent] = useState("Input");

  const SelectedComponent = componentsMap[component] ?? <div>Select component from sidebar</div>;

  const setComponentName = (name) => {
    console.log("name : ", name);
    setComponent(name);
  }

  return (
    <GridPageLayout
      navLinks={(props) => <Sidebar handleClick={setComponentName} {...props} />}
    >
      <SelectedComponent />
    </GridPageLayout>
  )
}

export default StoryBook;