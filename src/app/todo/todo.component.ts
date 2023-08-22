import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../models';
import { TodoBlank } from '../errors';
import { AddTodoFormService } from '../services/add-todo-form.service';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  todos: Todo[] = [];

  constructor(
    public todosService: TodosService,
    public form: AddTodoFormService,
    public filterService: FilterService
  ) {}

  getTodos() {
    this.todosService.getTodos(this.filterService.current).subscribe(todos => {
      this.todos = todos;
    });
  }

  get hasNoTodos() {
    return this.todos.length <= 0;
  }

  addTodo() {
    this.form.resetErrorMessage();

    this.todosService.addTodo(this.form.todoTitle).subscribe({
      next: ok => {
        if (ok) {
          this.filterService.setToAll();
          this.getTodos();
        }
      },
      error: error => {
        if (error instanceof TodoBlank) {
          this.form.setErrorMessage(error.message);
        }
      },
    });
  }
}
