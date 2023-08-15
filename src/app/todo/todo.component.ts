import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../models';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  todoTitle = '';

  constructor(public todos: TodosService) {}

  addTodo() {
    this.todos.addTodo(this.todoTitle);
  }

  toggleTodo(todo: Todo) {
    this.todos.toggleTodo(todo);
  }

  removeTodo(todo: Todo) {
    this.todos.removeTodo(todo);
  }
}
