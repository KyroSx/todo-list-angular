import { Injectable } from '@angular/core';
import { Todo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  public todos: Todo[] = [
    { title: 'Todo #1', completed: true },
    { title: 'Todo #2', completed: false },
  ];

  addTodo(todo: Todo) {
    this.todos.push(todo);
  }
}
