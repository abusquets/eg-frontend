import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService, Client } from '../services/client.service';
import { ClientDialogComponent } from './client-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-clients',
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
  templateUrl: './clients.component.html', // Referència al nou fitxer HTML
  styleUrls: ['./clients.component.css'], // Referència al nou fitxer CSS
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  totalClients: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';
  displayedColumns: string[] = ['code', 'name', 'is_active', 'actions'];
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Recupera el terme de cerca dels QueryParams quan s'inicialitza el component
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.loadClients();
    });
  }

  loadClients() {
    this.clientService.getClients(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.clients = response.items;
        this.totalClients = response.total;
        console.log('Total clients:', this.totalClients); // Per debugar
      },
      error: (error) => {
        this.showMessage('Error carregant clients');
        console.error('Error:', error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page event:', event); // Per debugar
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadClients();
  }

  onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;

      // Navega amb el nou terme de cerca com a QueryParam
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.searchTerm ? { search: this.searchTerm } : {},
        queryParamsHandling: 'merge',
      });

      this.loadClients();
    }, 300);
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;

    // Elimina el QueryParam de cerca
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });

    this.loadClients();
  }

  openDialog(client?: Client) {
    // Clonar l'client per evitar modificar l'objecte original
    const clientClone = client ? { ...client } : {};

    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '400px',
      data: clientClone, // Utilitzar el clon
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          if (client) {
            // Aquí comparem el clon (result) amb l'original (client)
            const changes = this.getUpdatedFields(client, result);
            if (Object.keys(changes).length > 0) {
              this.clientService.updateClient(result.id, changes).subscribe({
                next: () => {
                  this.showMessage('Client actualitzat correctament');
                  this.loadClients();
                },
                error: (error) => {
                  this.showMessage('Error actualitzant client');
                  console.error('Error:', error);
                },
              });
            } else {
              this.showMessage('No hi ha canvis a actualitzar');
            }
          }
        } else {
          // Creació d'un nou client
          this.clientService.createClient(result).subscribe({
            next: () => {
              this.showMessage('Client creat correctament');
              this.loadClients();
            },
            error: (error) => {
              this.showMessage('Error creant client');
              console.error('Error:', error);
            },
          });
        }
      }
    });
  }

  deleteClient(client: Client) {
    if (confirm(`Estàs segur que vols eliminar el client ${client.name}?`)) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          this.showMessage('Client eliminat correctament');
          this.loadClients();
        },
        error: (error) => {
          this.showMessage('Error eliminant client');
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

  private getUpdatedFields(original: Client, updated: Client): Partial<Client> {
    const changes: Partial<Client> = {};

    if (original.name !== updated.name) {
      changes.name = updated.name;
    }

    if (original.is_active !== updated.is_active) {
      changes.is_active = updated.is_active;
    }

    return changes;
  }
}
