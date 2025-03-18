import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/api'; // Asegúrate de que esta URL esté correcta
  
  constructor(private http: HttpClient) { }

  // Método para registrar un usuario (ya existente)
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

  // Método para hacer login (ya existente)
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud de login:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }

  // Método para guardar un oficio
  guardarOficio(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud POST al archivo PHP (guardar_oficio.php)
    return this.http.post<any>(`${this.apiUrl}/guardar_oficio.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
}
