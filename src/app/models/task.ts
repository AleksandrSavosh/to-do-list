export interface Task {
  id: number;
  created: string
  performerId: number;
  description: string;
  priority: number;
  isCompleted: boolean;
}
