import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-create-article-dialog',
  templateUrl: './create-article-dialog.component.html',
  styleUrls: ['./create-article-dialog.component.css']
})
export class CreateArticleDialogComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ title: string; text: string }>();
  @Output() update = new EventEmitter<{ id: number; title: string; text: string }>();
  @Input() isSubmitting: boolean = false;
  @Input() articleToEdit: { id: number; title: string; text: string } | null = null;

  title: string = '';
  text: string = '';
  isEditMode: boolean = false;

  ngOnInit(): void {
    if (this.articleToEdit) {
      this.loadArticleData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleToEdit'] && this.articleToEdit) {
      this.loadArticleData();
    }
  }

  loadArticleData(): void {
    if (this.articleToEdit) {
      this.isEditMode = true;
      this.title = this.articleToEdit.title;
      this.text = this.articleToEdit.text;
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.title.trim() && this.text.trim() && !this.isSubmitting) {
      if (this.isEditMode && this.articleToEdit) {
        this.update.emit({
          id: this.articleToEdit.id,
          title: this.title.trim(),
          text: this.text.trim()
        });
      } else {
        this.create.emit({
          title: this.title.trim(),
          text: this.text.trim()
        });
      }
    }
  }

  resetForm(): void {
    this.title = '';
    this.text = '';
    this.isEditMode = false;
    this.articleToEdit = null;
  }
}

