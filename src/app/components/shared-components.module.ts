import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [],
  imports: [FormsModule, MatIconModule, MatButtonToggleModule],
  exports: [FormsModule, MatIconModule, MatButtonToggleModule],
})
export class SharedComponentsModule {}
