import { Injectable } from '@angular/core';
import { Todo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  public todos: Todo[] = [];

  addTodo(title: string) {
    this.todos.push({
      title,
      completed: false,
    });
  }
}
