import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddTodoFormService {
  todoTitle = '';
  errorMessage = '';

  resetErrorMessage() {
    this.errorMessage = '';
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
