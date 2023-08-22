import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { SharedComponentsModule } from '../components';
import { FilterComponent } from './components/filter/filter.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';

@NgModule({
  declarations: [TodoComponent, FilterComponent, AddTodoComponent],
  imports: [CommonModule, TodoRoutingModule, SharedComponentsModule],
})
export class TodoModule {}
