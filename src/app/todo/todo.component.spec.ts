import { TodoComponent } from './todo.component';
import { ComponentSut } from '../testing/ComponentSut';
import { fakeAsync } from '@angular/core/testing';

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

  getTodoTitle(todo: HTMLDivElement): HTMLSpanElement {
    return todo.querySelector('span')!;
  }

  removeTodo(todo: HTMLDivElement) {
    const remove = todo.querySelector('.todo_item_remove')!;

    this.dispatchClickEvent(remove as HTMLElement);
  }

  clickOnTodoButton() {
    this.dispatchClickEvent(this.add_todo_button);
  }

  typeOnAddTodoInput(title: string) {
    this.dispatchInputEvent(this.add_todo_input, title);
  }

  toggleTodo(todo: HTMLDivElement) {
    this.dispatchClickEvent(this.getTodoCheckbox(todo));
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
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3'];

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      expect(sut.add_todo_input.value).toBe(todo);

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });
  });

  it('toggles todos', fakeAsync(() => {
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3'];

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    sut.tick();
    sut.detectChanges();

    sut.todo_list.forEach(todo => {
      sut.toggleTodo(todo);
      sut.detectChanges();

      expect(sut.getTodoCheckbox(todo).checked).toBe(true);
      expect(sut.getTodoTitle(todo)).toHaveClass('todo_item_completed');

      sut.toggleTodo(todo);
      sut.detectChanges();

      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
      expect(sut.getTodoTitle(todo)).not.toHaveClass('todo_item_completed');
    });
  }));

  it('removes todos', fakeAsync(() => {
    const REMOVED_INDEX = [1, 3];
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    sut.tick();
    sut.detectChanges();

    REMOVED_INDEX.forEach(index => {
      sut.removeTodo(sut.todo_list[index]);
      sut.detectChanges();

      TODOS.splice(index, 1);
    });

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });
  }));
});
