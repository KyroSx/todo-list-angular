import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Type } from '@angular/core';
import { SharedComponentsModule } from '../components';
import { TodoModule } from '../todo/todo.module';

export class ComponentSut<Component> {
  component!: Component;
  fixture!: ComponentFixture<Component>;

  private readonly componentDefinition: Type<Component>;

  constructor(componentDefinition: Type<Component>) {
    this.componentDefinition = componentDefinition;
  }

  async setUpTest() {
    await this.configureTestModule();

    this.fixture = TestBed.createComponent(this.componentDefinition);
    this.component = this.fixture.componentInstance;
  }

  detectChanges() {
    this.fixture.detectChanges();
  }

  tick() {
    tick();
  }

  protected dispatchInputEvent(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  protected dispatchClickEvent(element: HTMLElement) {
    element.click();
  }

  protected getElement<HTMLElement>(selector: string): HTMLElement {
    return this.fixture.nativeElement.querySelector(selector);
  }

  protected getAllElements<HTMLElement>(selector: string): HTMLElement[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }

  private async configureTestModule() {
    await TestBed.configureTestingModule({
      declarations: [this.componentDefinition],
      imports: [SharedComponentsModule, TodoModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
  }
}
