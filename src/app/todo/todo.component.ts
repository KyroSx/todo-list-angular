import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../models';
import { TodoBlank } from '../errors';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  todoTitle = '';
  errorMessage = '';

  constructor(public todos: TodosService) {}

  addTodo() {
    try {
      this.errorMessage = '';
      this.todos.addTodo(this.todoTitle);
    } catch (error) {
      if (error instanceof TodoBlank) {
        this.errorMessage = error.message;
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
