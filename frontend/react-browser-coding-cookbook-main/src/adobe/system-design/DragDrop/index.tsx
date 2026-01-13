import { DragEvent, useMemo, useState } from "react"
import { jiraTasks } from "./mockedData";
import "./index.css";
import { sections } from "./config";
import DropableContainer from "./DropableContainer";
import { useFilteredData } from "./useFilteredData";
import { JiraTask } from "./type";
import DragableElement from "./DragableElement";

const DragDrop = () => {
  const [tasks, setTasks] = useState<JiraTask[]>(jiraTasks as JiraTask[]);

  const filteredData = useMemo(() => useFilteredData(tasks), tasks);

  const handleOnDragStart = (e: DragEvent<HTMLDivElement>, data: JiraTask) => {
    e.dataTransfer.setData("text/plain", data.id);
  }

  const handleOnDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.clearData();
  }

  const handleOnDragOver = () => {

  }

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData("text/plain");
    const status = e.currentTarget.id;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status,
        }
      }

      return task;
    });
    setTasks(updatedTasks as JiraTask[]);
  }

  const renderSection = () => {
    return sections.map((section, index) => (
      <DropableContainer
        label={section as unknown as string}
        id={section as unknown as string}
        onDrop={handleOnDrop}
        onDragOver={handleOnDragOver}
      >
        <div className="task-section">
          <span className="section-header">{section}</span>
          {filteredData[section].map((task, index) => (
          <DragableElement
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
            data={task}
            className="dragable-item"
          >
            <div className="jira-task">{task.title}</div>
          </DragableElement>
        ))}
        </div>
      </DropableContainer>
    ))
  }

  return (
    <div className="drag-drop-page">
        <h3>Drag Drop Example</h3>
      <div className="drag-drop-container">
        {renderSection()}
      </div>
    </div>
  )
}

export default DragDrop;
