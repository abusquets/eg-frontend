// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ClientsComponent } from './clients/clients.component';
import { TokensComponent } from './tokens/tokens.component';
import { AuthGuard } from './auth.guard';
import { PrivateLayoutComponent } from './layout/private-layout.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'private',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/:userId/tokens', component: TokensComponent },
      { path: 'clients', component: ClientsComponent },
    ],
  },
];
