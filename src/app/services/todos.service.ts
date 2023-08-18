import { Injectable } from '@angular/core';
import { Todo } from '../models';
import { TodoBlank } from '../errors';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly todos: Todo[] = [];
  public displayableTodos: Todo[] = [];

  get hasTodos() {
    return this.todos.length > 0;
  }

  get hasNoDisplayableTodos() {
    return this.displayableTodos.length <= 0;
  }

  getTodos(): Observable<Todo[]> {
    return of(this.todos);
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

  filterByCompleted() {
    this.displayableTodos = this.todos.filter(todo => todo.completed);
  }

  filterByUncompleted() {
    this.displayableTodos = this.todos.filter(todo => !todo.completed);
  }

  resetFilter() {
    this.dispatch();
  }

  toggleTodo(todo: Todo) {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.toggleComplete(todo);
    }

    this.dispatch();
  }

  removeTodo(todo: Todo) {
    const foundTodo = this.findTodo(todo);

    if (foundTodo) {
      this.removeByIndex(this.getIndex(foundTodo));
    }

    this.dispatch();
  }

  private dispatch() {
    this.displayableTodos = this.todos;
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
