import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Input() articleTitle: string = '';
  @Input() isDeleting: boolean = false;

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (!this.isDeleting) {
      this.confirm.emit();
    }
  }
}

