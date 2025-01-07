import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-token-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.css'],
})
export class TokenDialogComponent implements OnInit {
  private inputChanges = new Subject<string>();

  devices: { [key: string]: string }[] = [];

  ipsControl = new FormControl('', [
    Validators.pattern(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    ),
  ]);

  constructor(
    public dialogRef: MatDialogRef<TokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.ips === undefined) {
      this.data.ips = '';
    }
  }

  ngOnInit() {
    this.devices = this.data.devices;

    // Subscribe to changes with debounceTime
    this.inputChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.ipsControl.setValue(value); // Updates the value of the FormControl
      this.ipsControl.markAsTouched(); // Mark the camp com "touched"
    });
  }

  onInputChange(value: string | undefined) {
    if (value !== undefined) {
      this.inputChanges.next(value);
    }
  }

  isFormValid(): boolean {
    return this.ipsControl.valid && this.data.device !== undefined;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.data);
    }
  }
}
