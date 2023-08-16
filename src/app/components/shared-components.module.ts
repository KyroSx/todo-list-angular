import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [FormsModule, MatIconModule, MatButtonToggleModule],
})
export class SharedComponentsModule {}
