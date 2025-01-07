// src/app/users/user-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.id ? 'Modificar Client' : 'Nou Client' }}</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Code</mat-label>
        <input matInput type="code" [(ngModel)]="data.code" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="data.name" required />
      </mat-form-field>

      <mat-checkbox [(ngModel)]="data.is_active">Is Active</mat-checkbox>
      <!-- Add Is Active Checkbox -->
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel·lar</button>
      <button mat-raised-button color="primary" [disabled]="!isFormValid()" (click)="onSave()">
        Desar
      </button>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      [mat-dialog-actions] {
        justify-content: flex-end;
        gap: 8px;
      }
      mat-error {
        margin-bottom: 15px;
      }
    `,
  ],
})
export class ClientDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.is_active === undefined) {
      this.data.is_active = true;
    }
  }

  isFormValid(): boolean {
    if (this.data.id) {
      return !!(this.data.code && this.data.name);
    } else {
      return !!(this.data.code && this.data.name);
    }
  }

  onSave(): void {
    if (this.isFormValid()) {
      // if (!this.data.id) {
      //   return;
      // }
      const dataToSend = { ...this.data };
      this.dialogRef.close(dataToSend);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
