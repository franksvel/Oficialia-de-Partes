import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/api';  // Asegúrate de que la URL sea correcta
  // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo usuario
  registerUser(email: string, password: string): Observable<any> {
    const body = { email, password };  // Crea el cuerpo de la solicitud
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud POST y maneja los errores
    return this.http.post<any>(`${this.apiUrl}/register.php`, body, { headers })
    .pipe(
      catchError(error => {
        // Puedes manejar el error aquí, por ejemplo, mostrarlo en consola
        console.error('Error en la solicitud de registro:', error);
        return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
      })
    );
  
  }

  // Método para enviar las credenciales de login
  login(email: string, password: string): Observable<any> {
    const body = { email, password };  // Crea el cuerpo de la solicitud
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers })
    .pipe(
      catchError(error => {
        // Puedes manejar el error aquí, por ejemplo, mostrarlo en consola
        console.error('Error en la solicitud de registro:', error);
        return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
      })
    );
  
  }
}
