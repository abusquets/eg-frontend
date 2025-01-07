// src/app/welcome/welcome.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterModule],
  template: `
    <mat-card class="welcome-card">
      <mat-card-header>
        <mat-card-title>Benvingut/da a l'aplicació</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Has iniciat sessió correctament.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" routerLink="/private/users">
          Anar a Usuaris
        </button>
        <button mat-raised-button color="accent" routerLink="/private/clients">
          Anar a Clients
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .welcome-card {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }
    mat-card-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class WelcomeComponent {}