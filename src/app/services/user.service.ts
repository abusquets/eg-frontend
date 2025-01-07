import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface UserListResponse {
  items: User[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  clients?: string[];
}

interface UserUpdate {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  clients?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/core/user`;

  constructor(private readonly http: HttpClient) {}

  getUsers(page: number, pageSize: number, searchTerm: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<UserListResponse>(this.apiUrl, { params });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(userId: string, updatedFields: UserUpdate): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, updatedFields);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
