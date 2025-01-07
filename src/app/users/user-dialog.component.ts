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
    <h2 mat-dialog-title>{{ data.id ? 'Modificar Usuari' : 'Nou Usuari' }}</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput type="email" [(ngModel)]="data.email" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nom</mat-label>
        <input matInput [(ngModel)]="data.first_name" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Cognoms</mat-label>
        <input matInput [(ngModel)]="data.last_name" required />
      </mat-form-field>

      <ng-container *ngIf="!data.id">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Contrasenya</mat-label>
          <input
            matInput
            [type]="hidePassword ? 'password' : 'text'"
            [(ngModel)]="data.password"
            required
          />
          <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Confirma la contrasenya</mat-label>
          <input
            matInput
            [type]="hideConfirmPassword ? 'password' : 'text'"
            [(ngModel)]="confirmPassword"
            required
          />
          <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-error *ngIf="passwordMismatch"> Les contrasenyes no coincideixen </mat-error>
      </ng-container>
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
export class UserDialogComponent {
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.is_active === undefined) {
      this.data.is_active = true;
    }
  }

  isFormValid(): boolean {
    if (this.data.id) {
      return !!(this.data.email && this.data.first_name && this.data.last_name);
    } else {
      return !!(
        this.data.email &&
        this.data.first_name &&
        this.data.last_name &&
        this.data.password &&
        this.confirmPassword &&
        this.data.password === this.confirmPassword
      );
    }
  }

  onSave(): void {
    if (this.isFormValid()) {
      if (!this.data.id && this.data.password !== this.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      this.passwordMismatch = false;
      const dataToSend = { ...this.data };
      delete dataToSend.confirmPassword;
      this.dialogRef.close(dataToSend);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
