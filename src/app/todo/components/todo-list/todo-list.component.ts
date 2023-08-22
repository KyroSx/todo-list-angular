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

  @Output() toggle = new EventEmitter<Todo>();
  @Output() refresh = new EventEmitter();

  constructor(
    public todosService: TodosService,
    public modal: ConfirmationModalService
  ) {}

  onToggle(todo: Todo) {
    this.toggle.emit(todo);
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
      this.refresh.emit();
    });
  }
}
