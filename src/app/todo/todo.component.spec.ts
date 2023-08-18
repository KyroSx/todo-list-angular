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

  get empty_state() {
    return this.getElement<HTMLDivElement>('.empty_state');
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

  get confirm_button() {
    return this.getElement<HTMLButtonElement>('#confirmation_modal_confirm');
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

  fit('adds todos', () => {
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

    sut.component.todosService.removeTodo(
      sut.component.todosService.displayableTodos[REMOVED_INDEX]
    );
    sut.detectChanges();

    TODOS.splice(REMOVED_INDEX, 1);

    sut.todo_list.forEach((todo, index) => {
      expect(todo.textContent).toContain(TODOS[index]);
      expect(sut.getTodoCheckbox(todo).checked).toBe(false);
    });
  }));

  const BLANKS = ['', '        '];

  BLANKS.forEach(blank => {
    fit(`displays error message if todo is blank (${blank})`, fakeAsync(() => {
      const TODO = 'TODO #1';

      sut.typeOnAddTodoInput(blank);
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
  });

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

  it('resets filter after adding todo', () => {
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
