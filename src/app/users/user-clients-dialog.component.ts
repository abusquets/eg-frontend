// src/app/users/user-client-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ClientService, Client } from '../services/client.service';

type SelectableClient = Client & { isSelected?: boolean };

@Component({
  selector: 'app-user-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    FormsModule, // Afegim FormsModule als imports
  ],
  template: `
    <h2 mat-dialog-title>Seleccionar Clients</h2>
    <div mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let client of clients">
          <mat-checkbox [(ngModel)]="client.isSelected">
            {{ client.name }} ({{ client.code }})
          </mat-checkbox>
        </mat-list-item>
      </mat-list>
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel·lar</button>
      <button mat-raised-button color="primary" (click)="onSave()">Desar</button>
    </div>
  `,
  styles: [
    `
      mat-list-item {
        display: flex;
        align-items: center;
      }
      [mat-dialog-actions] {
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class UserClientDialogComponent implements OnInit {
  clients: SelectableClient[] = [];

  constructor(
    private clientService: ClientService,
    public dialogRef: MatDialogRef<UserClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string; selectedClients: string[] }
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients(1, 100, '').subscribe({
      next: (response) => {
        this.clients = response.items.map((client) => ({
          ...client,
          isSelected: this.data.selectedClients.includes(client.id),
        }));
      },
      error: (err) => {
        console.error('Error carregant clients:', err);
      },
    });
  }

  onSave() {
    const selectedClientIds = this.clients
      .filter((client) => client.isSelected)
      .map((client) => client.id);
    this.dialogRef.close(selectedClientIds);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
