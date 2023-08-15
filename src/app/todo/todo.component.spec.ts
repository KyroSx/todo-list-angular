import { TodoComponent } from './todo.component';
import { ComponentSut } from '../testing/ComponentSut';

class Sut extends ComponentSut<TodoComponent> {
  constructor() {
    super(TodoComponent);
  }

  get add_todo_input() {
    return this.getElement<HTMLInputElement>('.add_todo_input');
  }

  get add_todo_button() {
    return this.getElement<HTMLButtonElement>('.add_todo_button');
  }

  get todo_list() {
    return this.getAllElements<HTMLDivElement>('.todo_item');
  }

  getTodoCheckbox(todo: HTMLDivElement): HTMLInputElement {
    return todo.querySelector('.todo_item_checkbox')!;
  }

  clickOnTodoButton() {
    this.dispatchClickEvent(this.add_todo_button);
  }

  typeOnAddTodoInput(title: string) {
    this.dispatchInputEvent(this.add_todo_input, title);
  }
}

describe('TodoComponent', () => {
  let sut: Sut;

  beforeEach(async () => {
    sut = new Sut();

    await sut.setUpTest();
  });

  it('creates component properly', () => {
    expect(sut.component).toBeTruthy();
  });

  it('adds todos', () => {
    const todos = ['TODO #1', 'TODO #2', 'TODO #3'];

    todos.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      expect(sut.add_todo_input.value).toBe(todo);

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(todos[index]);
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });
  });
});
