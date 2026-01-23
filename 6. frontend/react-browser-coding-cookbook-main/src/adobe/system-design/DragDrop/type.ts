export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskType = "Story" | "Task" | "Bug" | "Spike";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface JiraTask {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  reporter: string;
  assignee: string;
  sprint: string;
  epic: string;
  tags: string[];
  updated: string; // or Date if you prefer
  created: string; // or Date
}
