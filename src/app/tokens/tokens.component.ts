import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TokenService, Token } from '../services/token.service';
import { UserService, User } from '../services/user.service';
import { TokenDialogComponent } from './token-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DEVICES } from './token.constants'; // Ajusta el camí segons la teva estructura

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css'],
})
export class TokensComponent implements OnInit {
  tokens: Token[] = [];
  displayedColumns: string[] = [
    'access_token',
    'device',
    'created_at',
    'expires_at',
    'refresh_token',
    'available_until',
    'actions',
  ];

  user!: User;
  availableDevices: { [key: string]: string }[] = [];

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.userService.getUserById(userId).subscribe((user) => {
          this.user = user;
          this.loadTokens();
        });
      }
    });
  }

  loadTokens() {
    const userId = this.user.id;
    this.tokenService.getTokens(userId).subscribe({
      next: (response) => {
        this.tokens = response.items;
        this.setAvailableDevices();
      },
      error: (error) => {
        this.showMessage('Error carregant els tokens');
        console.error('Error:', error);
      },
    });
  }

  private setAvailableDevices() {
    this.availableDevices = DEVICES.filter(
      (device) => !this.tokens.some((token) => token.device === device.key)
    );
    console.log(this.availableDevices);
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Tancar', {
      duration: 3000,
    });
  }

  openDialog(token?: Token) {
    const tokenClone = token ? { ...token } : {};

    const dialogRef = this.dialog.open(TokenDialogComponent, {
      width: '400px',
      data: {
        tokenClone,
        devices: this.availableDevices,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tokenService.createToken(this.user.id, result).subscribe({
          next: () => {
            this.showMessage('Token created successfully');
            this.loadTokens();
          },
          error: (error) => {
            this.showMessage('Error creating token');
            console.error('Error:', error);
          },
        });
      }
    });
  }

  deleteToken(token: Token) {
    if (confirm(`Are you sure you want to delete the token ${token.device}?`)) {
      this.tokenService.deleteToken(this.user.id, token.access_token).subscribe({
        next: () => {
          this.showMessage('Token deleted successfully');
          this.loadTokens();
        },
        error: (error) => {
          const errorMsg = error?.error?.detail || 'Error deleting token';
          this.showMessage(errorMsg);
          console.error('Error:', error);
        },
      });
    }
  }
}
