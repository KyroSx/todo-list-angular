import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { SharedComponentsModule } from '../components';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [TodoComponent],
  imports: [
    CommonModule,
    TodoRoutingModule,
    SharedComponentsModule,
    MatButtonToggleModule,
  ],
})
export class TodoModule {}
