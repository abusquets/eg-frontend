// src/app/layout/private-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  template: `
    <div class="layout-container">
      <app-menu></app-menu>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .content {
      padding: 20px;
      flex: 1;
    }
  `]
})
export class PrivateLayoutComponent {}