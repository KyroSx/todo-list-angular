import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { Type } from '@angular/core';
import { SharedComponentsModule } from '../components';

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
      imports: [SharedComponentsModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
  }
}
