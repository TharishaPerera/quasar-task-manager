export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface NewTask {
  title: string
  description: string
  completed: boolean
}
