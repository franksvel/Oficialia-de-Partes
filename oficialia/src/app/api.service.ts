import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/api'; 


  constructor(private http: HttpClient) { }

  registerUser(email: string, password: string): Observable<any> {
    const body = { email, password };  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/register.php`, body, { headers })
    .pipe(
      catchError(error => {
        console.error('Error en la solicitud de registro:', error);
        return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
      })
    );
  
  }

 
  login(email: string, password: string): Observable<any> {
    const body = { email, password }; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers })
    .pipe(
      catchError(error => {
        console.error('Error en la solicitud de registro:', error);
        return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
      })
    );
  
  }
}
