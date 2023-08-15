import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TodoComponent],
  imports: [CommonModule, TodoRoutingModule, FormsModule, MatIconModule],
})
export class TodoModule {}
