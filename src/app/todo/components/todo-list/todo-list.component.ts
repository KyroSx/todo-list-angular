import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../models';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];

  @Output() toggle = new EventEmitter<Todo>();
  @Output() remove = new EventEmitter<Todo>();

  onToggle(todo: Todo) {
    this.toggle.emit(todo);
  }

  onRemove(todo: Todo) {
    this.remove.emit(todo);
  }
}
