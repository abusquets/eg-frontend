import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Afegit MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Afegit MatButtonModule
import { SessionManagerService } from '../../services/session-manager.service'; // Servei de gestió de sessió

@Component({
  selector: 'app-session-expiration-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule], // Afegeix MatDialogModule i MatButtonModule
  template: `
    <h1 mat-dialog-title class="dialog-title">La teva sessió està a punt de caducar</h1>
    <div mat-dialog-content>
      <p>
        La teva sessió s'acabarà en breu si no realitzes cap acció. Vols continuar amb la sessió?
      </p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="extendSession()">Continuar sessió</button>
      <button mat-button (click)="logout()">Sortir</button>
    </div>
  `,
  styles: [
    `
      .dialog-title {
        text-align: center;
        color: #1976d2;
      }

      .dialog-actions {
        display: flex;
        justify-content: center;
      }

      .dialog-actions button {
        margin: 0 10px;
      }
    `,
  ],
})
export class SessionExpirationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SessionExpirationDialogComponent>, // Referència al diàleg
    private sessionManager: SessionManagerService // Servei per gestionar la sessió
  ) {}

  extendSession() {
    this.sessionManager.extendSession(); // Actualitza el temps d'inactivitat
    this.dialogRef.close('extend'); // Retorna 'extend' com a resultat
  }

  logout() {
    this.dialogRef.close('logout'); // Retorna 'logout' com a resultat
  }
}
