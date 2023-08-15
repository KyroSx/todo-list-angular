import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { SharedComponentsModule } from '../components';

@NgModule({
  declarations: [TodoComponent],
  imports: [CommonModule, TodoRoutingModule, SharedComponentsModule],
})
export class TodoModule {}
