import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface TokenListResponse {
  items: Token[];
}

export interface Token {
  access_token: string;
  device: string;
  created_at: Date;
  expires_at?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = `${environment.apiUrl}/api/auth/token`;

  constructor(private http: HttpClient) {}

  getTokens(userId: string): Observable<TokenListResponse> {
    const url = `${this.apiUrl}?user_id=${userId}`;
    return this.http.get<TokenListResponse>(url, {});
  }

  createToken(userId: string, createToken: any): Observable<Token> {
    const payload = {
      device: createToken.device,
    };
    const url = `${this.apiUrl}?user_id=${userId}`;
    return this.http.post<Token>(url, payload);
  }

  deleteToken(userId: string, access_token: string): Observable<any> {
    const url = `${this.apiUrl}/${access_token}?user_id=${userId}`;
    return this.http.delete(url);
  }
}
