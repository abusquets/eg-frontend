import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ClientListResponse {
  items: Client[];
  total: number;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

interface ClientUpdate {
  name?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/api/core/client`;

  constructor(private http: HttpClient) {}

  getClients(page: number, pageSize: number, searchTerm: string): Observable<ClientListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<ClientListResponse>(this.apiUrl, { params });
  }

  createClient(client: any): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  updateClient(clientId: number, updatedFields: ClientUpdate): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${clientId}`, updatedFields);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
