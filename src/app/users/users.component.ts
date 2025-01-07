import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService, User } from '../services/user.service';
import { UserDialogComponent } from './user-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserClientDialogComponent } from './user-clients-dialog.component';

@Component({
  selector: 'app-users',
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
    MatPaginatorModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  totalUsers: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';
  displayedColumns: string[] = ['email', 'first_name', 'last_name', 'is_active', 'actions'];
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.loadUsers();
    });
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalUsers = response.total;
        console.log('Total users:', this.totalUsers);
      },
      error: (error) => {
        this.showMessage('Error carregant usuaris');
        console.error('Error:', error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page event:', event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadUsers();
  }

  onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.searchTerm ? { search: this.searchTerm } : {},
        queryParamsHandling: 'merge',
      });

      this.loadUsers();
    }, 300);
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });

    this.loadUsers();
  }

  openDialog(user?: User) {
    // Clonar l'usuari per evitar modificar l'objecte original
    const userClone = user ? { ...user } : {};

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: userClone, // Utilitzar el clon
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          if (user) {
            // Aquí comparem el clon (result) amb l'original (user)
            const changes = this.getUpdatedFields(user, result);
            if (Object.keys(changes).length > 0) {
              this.userService.updateUser(result.id, changes).subscribe({
                next: () => {
                  this.showMessage('Usuari actualitzat correctament');
                  this.loadUsers();
                },
                error: (error) => {
                  this.showMessage('Error actualitzant usuari');
                  console.error('Error:', error);
                },
              });
            } else {
              this.showMessage('No hi ha canvis a actualitzar');
            }
          }
        } else {
          // Creació d'un nou usuari
          this.userService.createUser(result).subscribe({
            next: () => {
              this.showMessage('Usuari creat correctament');
              this.loadUsers();
            },
            error: (error) => {
              this.showMessage('Error creant usuari');
              console.error('Error:', error);
            },
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Estàs segur que vols eliminar l'usuari ${user.email}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.showMessage('Usuari eliminat correctament');
          this.loadUsers();
        },
        error: (error) => {
          this.showMessage('Error eliminant usuari');
          console.error('Error:', error);
        },
      });
    }
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Tancar', {
      duration: 3000,
    });
  }

  private getUpdatedFields(original: User, updated: User): Partial<User> {
    const changes: Partial<User> = {};

    if (original.first_name !== updated.first_name) {
      changes.first_name = updated.first_name;
    }
    if (original.last_name !== updated.last_name) {
      changes.last_name = updated.last_name;
    }
    if (original.email !== updated.email) {
      changes.email = updated.email;
    }
    if (original.is_active !== updated.is_active) {
      changes.is_active = updated.is_active;
    }

    return changes;
  }

  openClientDialog(user: User) {
    const dialogRef = this.dialog.open(UserClientDialogComponent, {
      width: '400px',
      data: {
        userId: user.id,
        selectedClients: user.clients || [], // Això hauria d'estar al model de `User`
      },
    });

    dialogRef.afterClosed().subscribe((selectedClientIds: string[]) => {
      if (selectedClientIds) {
        this.userService.updateUser(user.id, { clients: selectedClientIds }).subscribe({
          next: () => {
            this.showMessage('Clients actualitzats correctament');
            this.loadUsers();
          },
          error: (error) => {
            this.showMessage('Error actualitzant clients');
            console.error('Error:', error);
          },
        });
      }
    });
  }
  viewTokens(user: User) {
    this.router.navigate([user.id, 'tokens'], { relativeTo: this.route, state: { user: user } });
  }
}
