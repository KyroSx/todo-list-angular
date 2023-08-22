import { Component, EventEmitter, Output } from '@angular/core';
import { AddTodoFormService } from '../../../services/add-todo-form.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent {
  @Output() addTodo = new EventEmitter();

  constructor(public form: AddTodoFormService) {}

  onAddTodo() {
    this.addTodo.emit();
  }
}
