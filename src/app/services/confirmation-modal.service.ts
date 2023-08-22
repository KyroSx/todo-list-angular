import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  onConfirmation(onConfirm: () => void) {
    this.open()
      .afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          onConfirm();
        }
      });
  }

  private open() {
    return this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
    });
  }
}
