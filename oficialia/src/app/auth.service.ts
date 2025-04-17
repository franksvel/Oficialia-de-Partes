import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/api/login.php'; // Cambiar a la URL de tu backend

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.apiUrl, body);
  }

  logout() {
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('id_roles');
    sessionStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }
}
