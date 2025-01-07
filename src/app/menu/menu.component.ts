import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Àrea Privada</span>
      <button mat-button routerLink="/private/users">Usuaris</button>
      <button mat-button routerLink="/private/clients">Clients</button>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">Tancar sessió</button>
    </mat-toolbar>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class MenuComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sessió tancada amb èxit');
      },
      error: (error) => {
        console.error('Error al tancar sessió:', error);
      },
    });
  }
}
