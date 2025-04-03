import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    // Aquí harías una solicitud HTTP a tu API
    return this.http.post('http://localhost:4200/login', { email, password });
  }
}
