export class TodoBlank extends Error {
  static message = 'Todo cant be blank.';

  constructor() {
    super(TodoBlank.message);
  }
}
