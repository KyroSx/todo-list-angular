import { TodoComponent } from './todo.component';
import { ComponentSut } from '../testing/ComponentSut';
import { fakeAsync } from '@angular/core/testing';
import { TodoBlank } from '../errors';
import { Filter } from '../models';

class Sut extends ComponentSut<TodoComponent> {
  constructor() {
    super(TodoComponent);
  }

  get add_todo_input() {
    return this.getElement<HTMLInputElement>('.add_todo_input');
  }

  get error_message() {
    return this.getElement<HTMLSpanElement>('.error_message');
  }

  get add_todo_button() {
    return this.getElement<HTMLButtonElement>('.add_todo_button');
  }

  get filter_container() {
    return this.getElement<HTMLDivElement>('.filter_container');
  }

  get todo_list() {
    const list = this.getAllElements<HTMLDivElement>('.todo_item');

    if (!list || list.length === 0) {
      throw new Error('List is Empty');
    }

    return list;
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

  filterByCompleted() {
    this.component.applyFilter(Filter.COMPLETED);
  }

  filterByUncompleted() {
    this.component.applyFilter(Filter.UNCOMPLETED);
  }

  filterByAll() {
    this.component.applyFilter(Filter.ALL);
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

  it('displays error message if todo is blank', fakeAsync(() => {
    const BLANK = '';
    const TODO = 'TODO #1';

    sut.typeOnAddTodoInput(BLANK);
    sut.detectChanges();

    sut.clickOnTodoButton();
    sut.detectChanges();

    sut.tick();
    sut.detectChanges();

    expect(sut.add_todo_input).toHaveClass('add_todo_input_error');
    expect(sut.error_message.textContent).toContain(TodoBlank.message);

    sut.typeOnAddTodoInput(TODO);
    sut.detectChanges();

    sut.clickOnTodoButton();
    sut.detectChanges();

    sut.tick();
    sut.detectChanges();

    expect(sut.add_todo_input).not.toHaveClass('add_todo_input_error');
    expect(sut.error_message).toBeNull();
  }));

  it('filters by completed and uncompleted', fakeAsync(() => {
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];
    const TOGGLE_INDEX = [0, 2];

    expect(sut.filter_container).toBeNull();

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    TOGGLE_INDEX.forEach(index => {
      sut.toggleTodo(sut.todo_list[index]);
      sut.detectChanges();
    });

    sut.filterByCompleted();
    sut.detectChanges();

    sut.todo_list.forEach(todo => {
      expect(sut.getTodoCheckbox(todo).checked).toBe(true);
    });

    sut.filterByUncompleted();
    sut.detectChanges();

    sut.todo_list.forEach(todo => {
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });

    sut.filterByAll();
    sut.detectChanges();

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
    });
  }));
});
