export interface Todo {
  title: string;
  completed: boolean;
}

export enum Filter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
}
