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

  toggleTodo(todo: Todo) {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.toggleComplete(todo);
    }
  }

  removeTodo(todo: Todo) {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.removeByIndex(this.getIndex(foundTodo));
    }
  }

  private toggleComplete(todo: Todo) {
    todo.completed = !todo.completed;
  }

  private findTodo(todo: Todo) {
    return this.todos.find(_todo => _todo === todo);
  }

  private getIndex(todo: Todo) {
    return this.todos.indexOf(todo);
  }

  private removeByIndex(index: number) {
    this.todos.splice(index, 1);
  }
}
