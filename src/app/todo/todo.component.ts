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
  constructor(
    public todos: TodosService,
    public form: AddTodoFormService,
    public filter: FilterService,
    private modal: ConfirmationModalService
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
        return this.todos.resetFilter();
      case Filter.COMPLETED:
        return this.todos.filterByCompleted();
      case Filter.UNCOMPLETED:
        return this.todos.filterByUncompleted();
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
          this.todos.removeTodo(todo);
        }
      });
  }
}
