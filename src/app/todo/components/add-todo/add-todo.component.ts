import { Component, EventEmitter, Output } from '@angular/core';
import { AddTodoFormService } from '../../../services/add-todo-form.service';
import { TodoBlank } from '../../../errors';
import { TodosService } from '../../../services/todos.service';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent {
  @Output() refresh = new EventEmitter();

  constructor(
    public todosService: TodosService,
    public form: AddTodoFormService,
    public filterService: FilterService
  ) {}

  addTodo() {
    this.form.resetErrorMessage();

    this.todosService.addTodo(this.form.todoTitle).subscribe({
      next: ok => {
        if (ok) {
          this.filterService.setToAll();
          this.onSuccess();
        }
      },
      error: error => {
        if (error instanceof TodoBlank) {
          this.form.setErrorMessage(error.message);
        }
      },
    });
  }

  private onSuccess() {
    this.refresh.emit();
  }
}
