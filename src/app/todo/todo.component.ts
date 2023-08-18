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
    public filter: FilterService,
    private modal: ConfirmationModalService
  ) {}

  private getTodos() {
    this.todosService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo() {
    this.form.resetErrorMessage();

    this.todosService.addTodo(this.form.todoTitle).subscribe({
      next: ok => {
        if (ok) {
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
    this.todosService.toggleTodo(todo);
    this.keepFilter();
  }

  removeTodo(todo: Todo) {
    this.openModalThenRemove(todo);
    this.viewAll();
  }

  viewAll() {
    this.applyFilter(Filter.ALL);
    this.filter.setToAll();
  }

  keepFilter() {
    this.applyFilter(this.filter.current);
  }

  applyFilter(filter: Filter) {
    switch (filter) {
      case Filter.ALL:
        return this.todosService.resetFilter();
      case Filter.COMPLETED:
        return this.todosService.filterByCompleted();
      case Filter.UNCOMPLETED:
        return this.todosService.filterByUncompleted();
      default:
        return;
    }
  }

  private openModalThenRemove(todo: Todo) {
    this.modal
      .open()
      .afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.todosService.removeTodo(todo);
        }
      });
  }
}
