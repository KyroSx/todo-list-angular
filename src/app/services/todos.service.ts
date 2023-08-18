import { Injectable } from '@angular/core';
import { Filter, Todo } from '../models';
import { TodoBlank } from '../errors';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly todos: Todo[] = [];

  getTodos(filter: Filter): Observable<Todo[]> {
    // noinspection JSUnreachableSwitchBranches
    switch (filter) {
      case Filter.ALL:
      default:
        return of(this.todos);
      case Filter.COMPLETED:
        return of(this.filterByCompleted());
      case Filter.UNCOMPLETED:
        return of(this.filterByUncompleted());
    }
  }

  addTodo(title: string): Observable<boolean> {
    try {
      this.addOrThrow(title);

      return of(true);
    } catch (error) {
      return throwError(() => error);
    }
  }

  private addOrThrow(title: string) {
    this.validateTodo(title);

    this.todos.push({
      title,
      completed: false,
    });
  }

  private filterByCompleted() {
    return this.todos.filter(todo => todo.completed);
  }

  private filterByUncompleted() {
    return this.todos.filter(todo => !todo.completed);
  }

  toggleTodo(todo: Todo): Observable<boolean> {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.toggleComplete(todo);
    }

    return of(true);
  }

  removeTodo(todo: Todo): Observable<boolean> {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.removeByIndex(this.getIndex(foundTodo));
    }

    return of(true);
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

  private validateTodo(title: string) {
    if (this.isBlank(title)) {
      throw new TodoBlank();
    }
  }

  private isBlank(title: string) {
    return title.trim() === '';
  }
}
