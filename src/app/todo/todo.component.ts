import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../models';
import { TodoBlank } from '../errors';
import { AddTodoFormService } from '../services/add-todo-form.service';

enum Filter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  filter: Filter = Filter.ALL;

  constructor(
    public todos: TodosService,
    public form: AddTodoFormService
  ) {}

  addTodo() {
    try {
      this.form.resetErrorMessage();
      this.todos.addTodo(this.form.todoTitle);
    } catch (error) {
      if (error instanceof TodoBlank) {
        this.form.setErrorMessage(error.message);
      }
    }

    this.viewAll();
  }

  toggleTodo(todo: Todo) {
    this.todos.toggleTodo(todo);
    this.viewAll();
  }

  removeTodo(todo: Todo) {
    this.todos.removeTodo(todo);
    this.viewAll();
  }

  viewAll() {
    this.applyFilter(Filter.ALL);
    this.filter = Filter.ALL;
  }

  applyFilter(filter: Filter) {
    switch (filter) {
      case Filter.ALL:
        return this.todos.resetFilter();
      case Filter.COMPLETED:
        return this.todos.filterByCompleted();
      case Filter.UNCOMPLETED:
        this.todos.filterByUncompleted();
    }
  }
}
