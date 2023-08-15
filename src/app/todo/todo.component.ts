import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../models';
import { TodoBlank } from '../errors';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  constructor(
    public todos: TodosService,
    public form: FormService
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
  }

  toggleTodo(todo: Todo) {
    this.todos.toggleTodo(todo);
  }

  removeTodo(todo: Todo) {
    this.todos.removeTodo(todo);
  }
}
