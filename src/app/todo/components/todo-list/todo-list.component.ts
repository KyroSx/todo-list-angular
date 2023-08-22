import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../models';
import { TodosService } from '../../../services/todos.service';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];

  @Output() refresh = new EventEmitter();

  constructor(
    public todosService: TodosService,
    public modal: ConfirmationModalService
  ) {}

  toggleTodo(todo: Todo) {
    this.todosService.toggleTodo(todo).subscribe(() => {
      this.onSuccess();
    });
  }

  removeTodo(todo: Todo) {
    this.openModalThenRemove(todo);
  }

  private onSuccess() {
    this.refresh.emit();
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
      this.onSuccess();
    });
  }
}
