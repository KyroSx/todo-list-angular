import { TodoComponent } from './todo.component';
import { ComponentSut } from '../testing/ComponentSut';

class Sut extends ComponentSut<TodoComponent> {
  constructor() {
    super(TodoComponent);
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
});
