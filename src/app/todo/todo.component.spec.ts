import { TodoComponent } from './todo.component';
import { ComponentSut } from '../testing/ComponentSut';
import { fakeAsync } from '@angular/core/testing';
import { TodoBlank } from '../errors';

class Sut extends ComponentSut<TodoComponent> {
  constructor() {
    super(TodoComponent);
  }

  get add_todo_input() {
    return this.getElement<HTMLInputElement>('.input');
  }

  get empty_state() {
    return this.getElement<HTMLDivElement>('.empty_state');
  }

  get error_message() {
    return this.getElement<HTMLSpanElement>('.error_message');
  }

  get add_todo_button() {
    return this.getElement<HTMLButtonElement>('.button');
  }

  get filter_completed_button() {
    return this.getElement<HTMLButtonElement>('.button_completed > button');
  }

  get filter_uncompleted_button() {
    return this.getElement<HTMLButtonElement>('.button_uncompleted > button');
  }

  get filter_view_all_button() {
    return this.getElement<HTMLButtonElement>('.button_view_all > button');
  }

  get todo_list() {
    const list = this.getAllElements<HTMLDivElement>('.todo_item_container');

    if (!list || list.length === 0) {
      throw new Error('List is Empty');
    }

    return list;
  }

  getTodoCheckbox(todo: HTMLDivElement): HTMLInputElement {
    return todo.querySelector('.checkbox')!;
  }

  getTodoTitle(todo: HTMLDivElement): HTMLSpanElement {
    return todo.querySelector('span')!;
  }

  filterByCompleted() {
    this.dispatchClickEvent(this.filter_completed_button);
  }

  filterByUncompleted() {
    this.dispatchClickEvent(this.filter_uncompleted_button);
  }

  filterByAll() {
    this.dispatchClickEvent(this.filter_view_all_button);
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
      expect(sut.getTodoTitle(todo)).toHaveClass('completed');

      sut.toggleTodo(todo);
      sut.detectChanges();

      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
      expect(sut.getTodoTitle(todo)).not.toHaveClass('completed');
    });
  }));

  it('removes todos', fakeAsync(() => {
    const REMOVED_INDEX = 1;
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    sut.tick();
    sut.detectChanges();

    sut.component.todosService.removeTodo(sut.component.todos[REMOVED_INDEX]);
    sut.detectChanges();

    TODOS.splice(REMOVED_INDEX, 1);

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });
  }));

  const BLANKS = ['', '        '];

  BLANKS.forEach(blank => {
    it(`displays error message if todo is blank (${blank})`, fakeAsync(() => {
      const TODO = 'TODO #1';

      sut.typeOnAddTodoInput(blank);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();

      sut.tick();
      sut.detectChanges();

      expect(sut.add_todo_input).toHaveClass('input_error');
      expect(sut.error_message.textContent).toContain(TodoBlank.message);

      sut.typeOnAddTodoInput(TODO);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();

      sut.tick();
      sut.detectChanges();

      expect(sut.add_todo_input).not.toHaveClass('input_error');
      expect(sut.error_message).toBeNull();
    }));
  });

  it('filters by completed and uncompleted', fakeAsync(() => {
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];
    const TOGGLE_INDEX = [0, 2];

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

  it('resets filter after adding todo', () => {
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];
    const TOGGLE_INDEX = [0, 2];

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

    sut.typeOnAddTodoInput('TODO #6');
    TODOS.push('TODO #6');
    sut.detectChanges();

    sut.clickOnTodoButton();
    sut.detectChanges();

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
    });
  });

  it('displays empty state if there is no todos on filter', () => {
    const TODOS = ['TODO #1', 'TODO #2', 'TODO #3', 'TODO #4', 'TODO #5'];

    expect(sut.empty_state).toBeDefined();

    TODOS.forEach(todo => {
      sut.typeOnAddTodoInput(todo);
      sut.detectChanges();

      sut.clickOnTodoButton();
      sut.detectChanges();
    });

    expect(sut.empty_state).toBeNull();

    sut.filterByCompleted();
    sut.detectChanges();

    expect(sut.empty_state).toBeDefined();
  });
});
