import { Component } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Filter, Todo } from '../models';
import { TodoBlank } from '../errors';
import { AddTodoFormService } from '../services/add-todo-form.service';
import { FilterService } from '../services/filter.service';
import { ConfirmationModalService } from '../services/confirmation-modal.service';

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
    public filterService: FilterService,
    private modal: ConfirmationModalService
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

  toggleTodo(todo: Todo) {
    this.todosService.toggleTodo(todo).subscribe(() => {
      this.getTodos();
    });
  }

  removeTodo(todo: Todo) {
    this.openModalThenRemove(todo);
  }

  private openModalThenRemove(todo: Todo) {
    this.modal
      .open()
      .afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.removeThenReload(todo);
        }
      });
  }

  private removeThenReload(todo: Todo) {
    this.todosService.removeTodo(todo).subscribe(() => {
      this.getTodos();
    });
  }

  protected readonly Filter = Filter;
}
