import { sections } from "./config";
import { JiraTask, TaskStatus } from "./type";

export const useFilteredData = (tasks: JiraTask[]) => {
  const tasksByStatus: Record<TaskStatus, JiraTask[]> = {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: []
  };

  tasks.forEach((task) => {
    tasksByStatus[task.status].push(task);
  });

  return tasksByStatus
}