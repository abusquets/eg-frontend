import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService
      .login(this.username, this.password)
      .pipe(
        tap({
          next: (response) => {
            console.log('Login response:', response); // Per depurar
            if (response && response.access_token) {
              this.router.navigate(['/private']);
            } else {
              this.errorMessage = 'Invalid username or password';
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login error:', error);
            if (error.error && error.error.detail) {
              this.errorMessage = error.error.detail;
            } else {
              this.errorMessage = 'An unexpected error occurred. Please try again.';
            }
          },
        })
      )
      .subscribe();
  }
}
